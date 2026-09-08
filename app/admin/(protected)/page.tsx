import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentActivity } from "@/components/admin/RecentActivity";

function greetingForHour(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const displayName =
    (typeof user?.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    email ||
    "Administrador";
  const greeting = greetingForHour(new Date().getHours());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {greeting}, {displayName}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Gerencie o conteúdo e as configurações do TremBoom.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <QuickActions />
        </div>
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
