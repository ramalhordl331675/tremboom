import Link from "next/link";
import { getProducts } from "@/lib/supabase/products";
import { ProductsList } from "@/components/admin/ProductsList";
import { PlusIcon } from "@/components/admin/icons";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  // Erro de leitura cai no boundary error.tsx (mensagem genérica).
  const products = await getProducts();
  const params = await searchParams;
  const notice =
    params?.created === "1"
      ? "Produto criado com sucesso."
      : params?.updated === "1"
        ? "Produto atualizado com sucesso."
        : params?.deleted === "1"
          ? "Produto excluído com sucesso."
          : null;

  return (
    <div className="space-y-6">
      {notice && (
        <p
          role="status"
          className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {notice}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie os achadinhos exibidos na vitrine do TremBoom.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
          <Link
            href="/admin/products/import"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            ⚡ Importar produto
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <PlusIcon className="h-4 w-4" />
            Adicionar produto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm sm:p-14">
          <p className="text-sm font-medium text-zinc-700">
            Nenhum produto cadastrado.
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            Quando o primeiro produto for criado, ele aparecerá listado aqui.
          </p>
        </div>
      ) : (
        <ProductsList products={products} />
      )}
    </div>
  );
}
