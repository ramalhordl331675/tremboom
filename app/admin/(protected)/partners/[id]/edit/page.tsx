import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { getPartnerById } from "@/lib/supabase/partners";

export default async function AdminPartnerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartnerById(id).catch(() => null);

  if (!partner) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/partners"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para parceiros
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Editar parceiro
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Altere os dados de “{partner.name}”.
        </p>
      </div>

      <PartnerForm partner={partner} />
    </div>
  );
}
