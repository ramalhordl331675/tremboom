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
 * o restante da página segue visual, sem busca funcional, sem checkout
 * próprio e sem tracking.
 *
 * ISR de 60s + revalidação de "/" a cada salvamento no Admin
 * (ver app/admin/products/actions.ts).
 */
export const revalidate = 60;

export default async function Home() {
  const [categoriesResult, productsResult, partnersResult] = await Promise.allSettled([
    getActiveCategories(),
    getShowcaseProducts(),
    getActivePartners(),
  ]);
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
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
        <Hero />
        <HowItWorks />
        <Categories categories={categories} loadError={loadError} />
        <PromoBanners />
        <FeaturedProducts products={products} loadError={loadError} />
        <PartnersSection partners={partners} />
        <TrustBar />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
