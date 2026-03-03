import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { FinancialDataForm } from "./financial-data-form";

export default async function DataPage() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "client";

  if (isDemoMode) {
    return <FinancialDataForm isDemoMode />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return <FinancialDataForm isDemoMode={false} profile={profile} />;
}
