import Link from "next/link";
import { getPartners } from "@/lib/supabase/partners";
import { PartnersList } from "@/components/admin/PartnersList";
import { PlusIcon } from "@/components/admin/icons";

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  // Erro de leitura cai no boundary error.tsx (mensagem genérica).
  const partners = await getPartners();
  const params = await searchParams;
  const feedback = params?.created
    ? "Parceiro criado com sucesso."
    : params?.updated
      ? "Parceiro atualizado com sucesso."
      : params?.deleted
        ? "Parceiro excluído com sucesso."
        : null;

  return (
    <div className="space-y-6">
      {feedback && (
        <p
          role="status"
          className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {feedback}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Parceiros</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie os parceiros exibidos na vitrine “Nossos Parceiros” da
            landing page.
          </p>
        </div>
        <Link
          href="/admin/partners/new"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          <PlusIcon className="h-4 w-4" />
          Adicionar parceiro
        </Link>
      </div>

      {partners.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm sm:p-14">
          <p className="text-sm font-medium text-zinc-700">
            Nenhum parceiro cadastrado.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            Quando o primeiro parceiro for criado e ativado, ele aparecerá
            automaticamente na landing page.
          </p>
        </div>
      ) : (
        <PartnersList partners={partners} />
      )}
    </div>
  );
}
