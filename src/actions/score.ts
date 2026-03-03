"use server";

import { createClient } from "@/lib/supabase/server";
import { computeScore } from "@/lib/score";
import type { Json } from "@/lib/supabase/types";

export async function computeAndStoreScore(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const result = computeScore({
    monthlyIncome: profile?.monthly_income ?? 0,
    monthlyExpenses: profile?.monthly_expenses ?? 0,
    totalDebt: profile?.total_debt ?? 0,
    totalSavings: profile?.total_savings ?? 0,
    goalTarget: goal?.target_amount ?? 0,
    goalCurrent: goal?.current_amount ?? 0,
  });

  const { error } = await supabase.from("score_snapshots").insert({
    user_id: userId,
    score: result.score,
    breakdown: result.breakdown as unknown as Json,
  });

  if (error) {
    console.error("Failed to store score snapshot:", error.message);
  }

  return result;
}

export async function getScoreSnapshots() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("score_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message };
  return { data };
}

export async function getLatestScore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("score_snapshots")
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
