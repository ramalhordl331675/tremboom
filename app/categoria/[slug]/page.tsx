import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CategoryNav } from "@/components/landing/CategoryNav";
import { ProductCard } from "@/components/landing/ProductCard";
import { SiteFooter } from "@/components/landing/SiteFooter";
import {
  getActiveCategories,
  getActiveCategoryBySlug,
} from "@/lib/supabase/categories";
import { getActiveProductsByCategoryId } from "@/lib/supabase/products";

type Params = { slug: string };

async function loadCategory(slug: string) {
  const category = await getActiveCategoryBySlug(slug).catch(() => null);
  if (!category) {
    notFound();
  }
  return category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug).catch(() => null);
  if (!category) {
    return { title: "Categoria não encontrada — TremBoom" };
  }
  return {
    title: `${category.name} — TremBoom`,
    description: `Achadinhos e ofertas de ${category.name} selecionados pelo TremBoom.`,
  };
}

/**
 * Página pública da categoria — "/categoria/[slug]".
 * Mostra somente os produtos ativos vinculados à categoria
 * (products.category_id), no mesmo visual da Landing.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = await loadCategory(slug);

  const [categoriesResult, products] = await Promise.all([
    getActiveCategories().catch(() => []),
    getActiveProductsByCategoryId(category.id).catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <SiteHeader />
      <CategoryNav categories={categoriesResult} />
      <main className="min-w-0 flex-1 bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl min-w-0 px-4 py-8 sm:py-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-bold text-[#EA470C] hover:underline"
          >
            ← Voltar para a página inicial
          </Link>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-[#EA470C]">
            Categoria
          </p>
          <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="min-w-0 text-2xl font-black tracking-tight break-words text-[#231610] sm:text-3xl">
              {category.name}
            </h1>
            <p className="pb-1 text-sm font-medium text-neutral-500">
              {products.length === 1
                ? "1 produto"
                : `${products.length} produtos`}
            </p>
          </div>

          {products.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-sm font-medium text-neutral-500">
              Nenhum produto encontrado nesta categoria.
            </p>
          ) : (
            <ul className="mt-6 grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ul>
          )}

          <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-xs leading-relaxed text-neutral-500">
            Preços, disponibilidade, descontos e condições podem mudar na
            plataforma parceira. Consulte as informações finais antes de
            realizar a compra.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
