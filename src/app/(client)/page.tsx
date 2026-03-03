import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ClientDashboardContent } from "./dashboard-content";

export default async function ClientDashboard() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "client";

  if (isDemoMode) {
    return <ClientDashboardContent isDemoMode />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profileRes, goalRes, snapshotsRes] = await Promise.all([
    supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("score_snapshots")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <ClientDashboardContent
      isDemoMode={false}
      userName={user.user_metadata?.name}
      profile={profileRes.data}
      goal={goalRes.data}
      snapshots={snapshotsRes.data ?? []}
    />
  );
}
