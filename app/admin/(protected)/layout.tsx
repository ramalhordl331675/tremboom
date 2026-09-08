import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

// Proteção server-side obrigatória de /admin.
// O middleware apenas renova a sessão; a autorização acontece aqui.
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  const email = user.email ?? "Administrador";
  const displayName =
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    email;
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  return (
    <AdminShell user={{ email, displayName, initial }}>
      {children}
    </AdminShell>
  );
}
