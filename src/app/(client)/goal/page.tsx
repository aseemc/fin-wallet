import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { GoalForm } from "./goal-form";

export default async function GoalPage() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "client";

  if (isDemoMode) {
    return <GoalForm isDemoMode />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return <GoalForm isDemoMode={false} goal={goal} />;
}
