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

/**
 * Landing pública "/" — Etapa G1.1 (visual only, modelo de afiliados).
 * Portal de curadoria: descoberta no TremBoom, compra na loja parceira.
 * Sem Supabase, sem busca funcional, sem conta, sem carrinho, sem checkout.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <CategoryNav />
      <main className="flex-1">
        <Hero />
        <Categories />
        <PromoBanners />
        <FeaturedProducts />
        <HowItWorks />
        <TrustBar />
        <AffiliateNotice />
      </main>
      <SiteFooter />
    </div>
  );
}
