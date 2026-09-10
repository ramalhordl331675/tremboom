import type { LandingProductItem } from "@/lib/supabase/products";
import { ProductCard } from "./ProductCard";

/**
 * Vitrine de produtos em destaque — dados reais do Supabase
 * (somente is_active, ordenados por position/created_at).
 * Layout e estilos preservados da Landing aprovada.
 */
export function FeaturedProducts({
  products,
  loadError,
}: {
  products: LandingProductItem[];
  loadError: boolean;
}) {
  return (
    <section id="destaques" aria-labelledby="destaques-title" className="bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 id="destaques-title" className="text-2xl font-black tracking-tight text-[#231610] sm:text-3xl">
            🔥 Produtos em destaque
          </h2>
          <a href="#destaques" className="shrink-0 text-sm font-bold text-[#EA470C] hover:underline">
            Ver todos →
          </a>
        </div>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-neutral-500">
          Achadinhos selecionados pelo TremBoom — você descobre aqui e
          conclui a compra diretamente na loja parceira.
        </p>

        {loadError ? (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-sm font-medium text-red-700"
          >
            Não foi possível carregar os produtos agora. Tente novamente
            mais tarde.
          </p>
        ) : products.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-sm font-medium text-neutral-500">
            Nenhum produto disponível no momento. Volte em breve para novos
            achadinhos.
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        )}
        <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-xs leading-relaxed text-neutral-500">
          Preços, disponibilidade, descontos e condições podem mudar na
          plataforma parceira. Consulte as informações finais antes de realizar
          a compra.
        </p>
      </div>
    </section>
  );
}
