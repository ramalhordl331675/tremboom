import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getActiveCategories } from "@/lib/supabase/categories";
import { getPlatforms } from "@/lib/supabase/platforms";
import { resolveImportInitialValues } from "@/lib/product-import/prepare";

export default async function AdminProductNewPage({
  searchParams,
}: {
  searchParams: Promise<{ affiliate_url?: string; platform_id?: string }>;
}) {
  const [categories, platforms] = await Promise.all([
    getActiveCategories(),
    getPlatforms(),
  ]);
  const params = await searchParams;

  // Pré-preenchimento vindo da importação pelo link — validado no
  // servidor (URL válida + plataforma existente). Parâmetros inválidos
  // são silenciosamente ignorados; o cadastro manual segue normal.
  const importValues = resolveImportInitialValues(
    {
      affiliate_url: params?.affiliate_url,
      platform_id: params?.platform_id,
    },
    platforms
  );
  const fromImport = Boolean(importValues.affiliate_url);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para produtos
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Novo produto</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cadastre um novo achadinho para a vitrine do TremBoom.
        </p>
      </div>

      {fromImport ? (
        <p
          role="status"
          className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Link importado — plataforma e link de afiliado já preenchidos.
          Confira os dados e complete os demais campos manualmente.
        </p>
      ) : null}

      <ProductForm
        categories={categories}
        platforms={platforms}
        initialValues={importValues}
      />
    </div>
  );
}
