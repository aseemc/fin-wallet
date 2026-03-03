"use server";

import { createClient } from "@/lib/supabase/server";
import { computeAndStoreScore } from "@/actions/score";
import { revalidatePath } from "next/cache";

export async function getGoal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message };
  }

  return { data };
}

export async function upsertGoal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const title = (formData.get("title") as string)?.trim();
  const targetAmount = parseFloat(formData.get("target_amount") as string) || 0;
  const currentAmount = parseFloat(formData.get("current_amount") as string) || 0;
  const deadline = formData.get("deadline") as string;
  const goalId = formData.get("goal_id") as string;

  if (!title) return { error: "Goal title is required" };
  if (targetAmount <= 0) return { error: "Target amount must be greater than 0" };
  if (currentAmount < 0) return { error: "Current amount cannot be negative" };

  const goalData = {
    user_id: user.id,
    title,
    target_amount: targetAmount,
    current_amount: currentAmount,
    deadline: deadline || null,
    updated_at: new Date().toISOString(),
  };

  if (goalId) {
    const { error } = await supabase
      .from("goals")
      .update(goalData)
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("goals").insert(goalData);
    if (error) return { error: error.message };
  }

  await computeAndStoreScore(user.id);
  revalidatePath("/");
  revalidatePath("/goal");

  return { success: true };
}
