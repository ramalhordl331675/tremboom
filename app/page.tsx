import { SiteHeader } from "@/components/landing/SiteHeader";
import { CategoryNav } from "@/components/landing/CategoryNav";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { PromoBanners } from "@/components/landing/PromoBanners";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustBar } from "@/components/landing/TrustBar";
import { AffiliateNotice } from "@/components/landing/AffiliateNotice";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { getActiveCategories } from "@/lib/supabase/categories";
import { getActiveProductsForLanding } from "@/lib/supabase/products";

/**
 * Landing pública "/" — vitrine com dados reais do Supabase
 * (categorias ativas + produtos ativos ordenados por position/created_at).
 * Layout e componentes visuais preservados; somente a fonte dos dados
 * mudou (antes placeholders de lib/landing-placeholders).
 */
export default async function Home() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getActiveCategories(),
    getActiveProductsForLanding(),
  ]);

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const categoriesError = categoriesResult.status === "rejected";

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  const productsError = productsResult.status === "rejected";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <CategoryNav categories={categories} />
      <main className="flex-1">
        <Hero />
        <Categories categories={categories} loadError={categoriesError} />
        <PromoBanners />
        <FeaturedProducts products={products} loadError={productsError} />
        <HowItWorks />
        <TrustBar />
        <AffiliateNotice />
      </main>
      <SiteFooter />
    </div>
  );
}
