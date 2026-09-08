import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getActiveCategories } from "@/lib/supabase/categories";
import { getPlatforms } from "@/lib/supabase/platforms";

export default async function AdminProductNewPage() {
  const [categories, platforms] = await Promise.all([
    getActiveCategories(),
    getPlatforms(),
  ]);

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

      <ProductForm categories={categories} platforms={platforms} />
    </div>
  );
}
