import { createClient } from "@/lib/supabase/server";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Financial Health Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Welcome back, {user?.user_metadata?.name ?? "there"}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Dashboard will be built in Milestone 2.
      </p>
    </div>
  );
}
