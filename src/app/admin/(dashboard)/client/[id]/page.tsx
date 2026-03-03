import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ClientDetailContent } from "./client-detail-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "advisor";

  if (isDemoMode) {
    return <ClientDetailContent isDemoMode clientId={id} />;
  }

  const supabase = await createClient();

  const { data: client } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .eq("role", "client")
    .single();

  if (!client) return notFound();

  const [profileRes, goalRes, snapshotsRes, recsRes] = await Promise.all([
    supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", id)
      .single(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("score_snapshots")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("recommendations")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <ClientDetailContent
      isDemoMode={false}
      clientId={id}
      client={client}
      profile={profileRes.data}
      goal={goalRes.data}
      snapshots={snapshotsRes.data ?? []}
      recommendations={recsRes.data ?? []}
    />
  );
}
