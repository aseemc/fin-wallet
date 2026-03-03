"use server";

import { createClient } from "@/lib/supabase/server";
import { generateAIRecommendation, type AIRecommendation } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import type { Json } from "@/lib/supabase/types";

export async function generateRecommendation(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const [profileRes, goalRes, scoreRes] = await Promise.all([
    supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", clientId)
      .single(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("score_snapshots")
      .select("*")
      .eq("user_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const profile = profileRes.data;
  if (!profile) return { error: "Client has no financial data" };

  const score = scoreRes.data;
  const goal = goalRes.data;

  const breakdown = (score?.breakdown as Record<string, number>) ?? {
    savings_rate: 0,
    debt_ratio: 0,
    emergency_coverage: 0,
    goal_progress: 0,
  };

  try {
    const result = await generateAIRecommendation({
      income: profile.monthly_income ?? 0,
      expenses: profile.monthly_expenses ?? 0,
      debt: profile.total_debt ?? 0,
      savings: profile.total_savings ?? 0,
      score: score?.score ?? 0,
      breakdown: {
        savings_rate: breakdown.savings_rate ?? 0,
        debt_ratio: breakdown.debt_ratio ?? 0,
        emergency_coverage: breakdown.emergency_coverage ?? 0,
        goal_progress: breakdown.goal_progress ?? 0,
      },
      goalTitle: goal?.title ?? "",
      goalTarget: goal?.target_amount ?? 0,
      goalCurrent: goal?.current_amount ?? 0,
    });

    return { data: result };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate recommendation";
    return { error: message };
  }
}

export async function saveRecommendation(
  clientId: string,
  recommendation: AIRecommendation
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("recommendations")
    .select("id")
    .eq("client_id", clientId)
    .eq("advisor_id", user.id)
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  let data;
  let error;

  if (existing) {
    const result = await supabase
      .from("recommendations")
      .update({
        summary: recommendation.summary,
        actions: recommendation.actions as unknown as Json,
        ai_generated: true,
      })
      .eq("id", existing.id)
      .select()
      .single();
    data = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from("recommendations")
      .insert({
        client_id: clientId,
        advisor_id: user.id,
        status: "draft",
        summary: recommendation.summary,
        actions: recommendation.actions as unknown as Json,
        ai_generated: true,
      })
      .select()
      .single();
    data = result.data;
    error = result.error;
  }

  if (error) return { error: error.message };

  revalidatePath(`/admin/client/${clientId}`);
  return { data };
}

export async function updateRecommendation(
  id: string,
  summary: string,
  actions: AIRecommendation["actions"]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("recommendations")
    .update({
      summary,
      actions: actions as unknown as Json,
    })
    .eq("id", id)
    .eq("advisor_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

export async function deleteDraftRecommendation(id: string, clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("recommendations")
    .delete()
    .eq("id", id)
    .eq("advisor_id", user.id)
    .eq("status", "draft");

  if (error) return { error: error.message };

  revalidatePath(`/admin/client/${clientId}`);
  revalidatePath(`/admin/client/${clientId}/recommend`);
  return { success: true };
}

export async function sendRecommendation(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("recommendations")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("advisor_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/admin/client/${data.client_id}`);
  return { success: true };
}

export async function acknowledgeRecommendation(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("recommendations")
    .update({
      status: "acknowledged",
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("client_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/recommendations");
  return { success: true };
}

export async function completeRecommendation(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("recommendations")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("client_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/recommendations");
  return { success: true };
}
