import Link from "next/link";
import { getPlatforms } from "@/lib/supabase/platforms";
import { PlatformsList } from "@/components/admin/PlatformsList";
import { PlusIcon } from "@/components/admin/icons";

export default async function AdminPlatformsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  // Erro de leitura cai no boundary error.tsx (mensagem genérica).
  const platforms = await getPlatforms();
  const params = await searchParams;
  const justCreated = params?.created === "1";

  return (
    <div className="space-y-6">
      {justCreated && (
        <p
          role="status"
          className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Plataforma criada com sucesso.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Plataformas</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie as origens de produtos do TremBoom, como Shopee e outras
            plataformas.
          </p>
        </div>
        <Link
          href="/admin/platforms/new"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          <PlusIcon className="h-4 w-4" />
          Adicionar plataforma
        </Link>
      </div>

      {platforms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm sm:p-14">
          <p className="text-sm font-medium text-zinc-700">
            Nenhuma plataforma cadastrada.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            Quando a primeira plataforma for criada, ela aparecerá listada
            aqui.
          </p>
        </div>
      ) : (
        <PlatformsList platforms={platforms} />
      )}
    </div>
  );
}
