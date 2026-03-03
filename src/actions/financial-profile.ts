"use server";

import { createClient } from "@/lib/supabase/server";
import { computeAndStoreScore } from "@/actions/score";
import { revalidatePath } from "next/cache";

export async function getFinancialProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message };
  }

  return { data };
}

export async function updateFinancialProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const monthlyIncome = parseFloat(formData.get("monthly_income") as string) || 0;
  const monthlyExpenses = parseFloat(formData.get("monthly_expenses") as string) || 0;
  const totalDebt = parseFloat(formData.get("total_debt") as string) || 0;
  const totalSavings = parseFloat(formData.get("total_savings") as string) || 0;

  if (monthlyIncome < 0 || monthlyExpenses < 0 || totalDebt < 0 || totalSavings < 0) {
    return { error: "Values cannot be negative" };
  }

  const { error } = await supabase
    .from("financial_profiles")
    .upsert(
      {
        user_id: user.id,
        monthly_income: monthlyIncome,
        monthly_expenses: monthlyExpenses,
        total_debt: totalDebt,
        total_savings: totalSavings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };

  await computeAndStoreScore(user.id);
  revalidatePath("/");
  revalidatePath("/data");

  return { success: true };
}
