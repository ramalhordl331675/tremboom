import { brl } from "@/lib/landing-placeholders";
import type { ShowcaseProduct } from "@/lib/supabase/products";
import { ProductCard } from "./ProductCard";

function toNumber(value: number | string | null): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function discountPct(price: number, oldPrice: number | null): number {
  if (oldPrice === null || oldPrice <= 0 || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

/**
 * Mesma regra de thumbnail do ProductCard (duplicada aqui de propósito
 * para não alterar o ProductCard.tsx).
 */
function toShopeeThumb(url: string): string {
  const match = url.match(
    /^(https:\/\/[^/]*susercontent\.com\/file\/[^/?#]+?)(?:\.(jpe?g|png|webp|gif|jfif|bmp|avif))?([?#].*)?$/i,
  );
  if (!match) return url;
  const [, base, , suffix] = match;
  if (base.toLowerCase().endsWith("_tn")) return url;
  return `${base}_tn${suffix ?? ""}`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Avaliação ${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "text-amber-400" : "text-neutral-200"}`}
          aria-hidden="true"
        >
          <path
            d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

/**
 * Card horizontal de destaque — exibe o primeiro produto da vitrine
 * ocupando toda a largura (imagem à esquerda, infos à direita).
 * Usa os mesmos dados, textos, preços e destino do botão do card
 * padrão; apenas a composição é horizontal.
 */
function HeroCard({ product: p }: { product: ShowcaseProduct }) {
  const price = toNumber(p.price) ?? 0;
  const oldPrice = toNumber(p.old_price);
  const rating = toNumber(p.rating);
  const pct = discountPct(price, oldPrice);
  const badge = p.highlight_text ?? (p.is_featured ? "Destaque" : null);
  const platformName = p.platform?.name ?? "oferta";
  const src = p.image_url ? toShopeeThumb(p.image_url) : null;
  return (
    <div className="group flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-orange-100 bg-white p-3 shadow-sm transition hover:shadow-[0_12px_32px_-12px_rgb(234_71_12/0.45)] sm:gap-4 sm:p-4">
      <div className="relative aspect-square w-28 shrink-0 self-start overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 min-[420px]:w-36 sm:w-56">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={p.name}
            loading="eager"
            decoding="async"
            width={660}
            height={660}
            className="h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#231610]/15" fill="currentColor">
              <path d="M24 4 6 14v16l18 10 18-10V14L24 4Z" />
              <path d="M6 14l18 10 18-10M24 24v16" stroke="#fff" strokeWidth="2" fill="none" />
            </svg>
          </div>
        )}
        {badge ? (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-md bg-[#231610] px-2 py-1 text-[10px] font-black uppercase tracking-wider break-words text-yellow-300">
            {badge}
          </span>
        ) : null}
        {pct > 0 ? (
          <span className="absolute right-2 top-2 max-w-[calc(100%-1rem)] rounded-md bg-[#E63A1E] px-2 py-1 text-[10px] font-black break-words text-white">
            -{pct}%
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="line-clamp-2 text-sm font-bold leading-snug break-words text-[#3d2c25] sm:text-lg">
          {p.name}
        </p>
        {rating !== null ? (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5" aria-hidden="true">
            <Stars rating={rating} />
            <span className="text-[11px] font-medium text-neutral-500">
              {rating.toFixed(1)}
            </span>
          </div>
        ) : null}
        {oldPrice !== null && oldPrice > price ? (
          <p className="text-xs text-neutral-400">
            <span className="price-strike">{brl(oldPrice)}</span>
            {pct > 0 ? (
              <span className="ml-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600">
                -{pct}%
              </span>
            ) : null}
          </p>
        ) : null}
        <p className="text-xl font-black break-words text-[#EA470C] sm:text-2xl">{brl(price)}</p>
        <span className="w-fit max-w-full rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold break-words text-[#EA470C] ring-1 ring-orange-100">
          {p.platform?.name ?? "Oferta"}
        </span>
        <a
          href={p.affiliate_url}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="mt-auto block rounded-xl bg-gradient-to-r from-[#F96116] to-[#E63A1E] px-3 py-2.5 text-center text-xs font-black uppercase leading-snug tracking-wide break-words text-white transition hover:brightness-110 sm:text-[13px]"
          style={{ marginTop: "0.75rem" }}
        >
          Ver oferta na {platformName} →
        </a>
      </div>
    </div>
  );
}

/**
 * Vitrine de produtos em destaque — dados reais do Supabase
 * (somente is_active, ordenados por position/created_at).
 * Layout e estilos preservados da Landing aprovada.
 */
export function FeaturedProducts({
  products,
  loadError,
}: {
  products: ShowcaseProduct[];
  loadError: boolean;
}) {
  return (
    <section id="destaques" aria-labelledby="destaques-title" className="bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <h2 id="destaques-title" className="min-w-0 text-xl font-black tracking-tight break-words text-[#231610] min-[400px]:text-2xl sm:text-3xl">
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
          <>
            <div className="mt-6 min-w-0">
              <HeroCard product={products[0]} />
            </div>
            {products.length > 1 ? (
              <ul className="mt-3 grid min-w-0 grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.slice(1).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </ul>
            ) : null}
          </>
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
