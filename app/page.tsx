import { SiteHeader } from "@/components/landing/SiteHeader";
import { BackToTop } from "@/components/landing/BackToTop";
import { CategoryNav } from "@/components/landing/CategoryNav";
import { MainBanner } from "@/components/landing/MainBanner";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Categories } from "@/components/landing/Categories";
import { PromoBanners } from "@/components/landing/PromoBanners";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { PartnersSection } from "@/components/landing/Partners";
import { TrustBar } from "@/components/landing/TrustBar";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { getActiveCategories } from "@/lib/supabase/categories";
import { getShowcaseProducts } from "@/lib/supabase/products";
import { getActivePartners } from "@/lib/supabase/partners";

/**
 * Landing pública "/" — portal de curadoria de afiliados.
 * A vitrine (#destaques) exibe produtos ativos do banco (tabela products);
 * a busca simples via ?q= filtra pelo nome sobre os produtos já
 * carregados (sem nova consulta). O restante da página segue visual,
 * sem checkout próprio e sem tracking.
 *
 * ISR de 60s + revalidação de "/" a cada salvamento no Admin
 * (ver app/admin/products/actions.ts).
 */
export const revalidate = 60;

/** Normaliza para busca: minúsculas e sem acentos ("maquina" acha "máquina"). */
function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const rawQ = Array.isArray(resolvedParams.q)
    ? resolvedParams.q[0]
    : resolvedParams.q;
  const query = (rawQ ?? "").trim();
  const [categoriesResult, productsResult, partnersResult] = await Promise.allSettled([
    getActiveCategories(),
    getShowcaseProducts(),
    getActivePartners(),
  ]);
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  // Busca local: filtra pelo nome; q vazio/ausente => todos os produtos.
  const queryNorm = normalizeForSearch(query);
  const visibleProducts = queryNorm
    ? products.filter((p) => normalizeForSearch(p.name).includes(queryNorm))
    : products;
  const loadError =
    categoriesResult.status === "rejected" ||
    productsResult.status === "rejected";

  // Parceiros: falha silenciosa => seção oculta (não quebra a landing).
  const partners =
    partnersResult.status === "fulfilled" ? partnersResult.value : [];

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <SiteHeader />
      <CategoryNav categories={categories} />
      <main className="min-w-0 flex-1">
        <MainBanner />
        <FeaturedProducts products={visibleProducts} loadError={loadError} />
        <Hero />
        <HowItWorks />
        <Categories categories={categories} loadError={loadError} />
        <PromoBanners />
        <PartnersSection partners={partners} />
        <TrustBar />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
