import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getActiveCategories } from "@/lib/supabase/categories";
import { getPlatforms } from "@/lib/supabase/platforms";
import { getProductById } from "@/lib/supabase/products";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, platforms] = await Promise.all([
    getProductById(id).catch(() => null),
    getActiveCategories().catch(() => []),
    getPlatforms().catch(() => []),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para produtos
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Editar produto
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Altere os dados de “{product.name}”.
        </p>
      </div>

      <ProductForm
        categories={categories}
        platforms={platforms}
        product={product}
      />
    </div>
  );
}
