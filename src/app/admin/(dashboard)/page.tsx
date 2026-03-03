import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ClientListContent } from "./client-list-content";

export default async function AdvisorDashboard() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "advisor";

  if (isDemoMode) {
    return <ClientListContent isDemoMode />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: clients } = await supabase
    .from("users")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  const clientsWithScores = await Promise.all(
    (clients ?? []).map(async (client) => {
      const { data: score } = await supabase
        .from("score_snapshots")
        .select("score, created_at")
        .eq("user_id", client.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return {
        ...client,
        latestScore: score?.score ?? null,
        lastUpdated: score?.created_at ?? client.created_at,
      };
    })
  );

  return (
    <ClientListContent
      isDemoMode={false}
      advisorName={user.user_metadata?.name}
      clients={clientsWithScores}
    />
  );
}
