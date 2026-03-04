import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { RecommendationsContent } from "./recommendations-content";

export default async function RecommendationsPage() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "client";

  if (isDemoMode) {
    return <RecommendationsContent isDemoMode recommendations={[]} />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("recommendations")
    .select("*")
    .eq("client_id", user.id)
    .in("status", ["sent", "acknowledged", "in_progress", "completed"])
    .order("created_at", { ascending: false });

  return (
    <RecommendationsContent
      isDemoMode={false}
      recommendations={data ?? []}
    />
  );
}
