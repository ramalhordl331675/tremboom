import Link from "next/link";
import { ImportLinkForm } from "@/components/admin/ImportLinkForm";
import { getPlatforms } from "@/lib/supabase/platforms";

export default async function AdminProductImportPage() {
  // Plataforma Shopee real (sem duplicar): o formulário usa o ID existente.
  const platforms = await getPlatforms().catch(() => []);
  const shopee = platforms.find((p) => p.slug === "shopee") ?? null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para produtos
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Importar produto</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cole o link do produto ou seu link de afiliado para preparar o
          cadastro.
        </p>
      </div>

      <ImportLinkForm shopeePlatformId={shopee?.id ?? null} />
    </div>
  );
}
