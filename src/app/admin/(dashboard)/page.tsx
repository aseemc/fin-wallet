import { createClient } from "@/lib/supabase/server";

export default async function AdvisorDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">Advisor Console</h1>
      <p className="text-muted-foreground mt-1">
        Welcome back, {user?.user_metadata?.name ?? "Advisor"}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Client list will be built in Milestone 3.
      </p>
    </div>
  );
}
