import { PLACEHOLDER_PRODUCTS, brl, type LandingProduct } from "@/lib/landing-placeholders";

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

function ProductThumb({ product }: { product: LandingProduct }) {
  return (
    <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.hue}`}>
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 48 48" className="h-16 w-16 text-[#231610]/15" fill="currentColor">
          <path d="M24 4 6 14v16l18 10 18-10V14L24 4Z" />
          <path d="M6 14l18 10 18-10M24 24v16" stroke="#fff" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <span className="absolute left-2 top-2 rounded-md bg-[#231610] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
        Exemplo visual
      </span>
      <span className="absolute right-2 top-2 rounded-md bg-[#E63A1E] px-2 py-1 text-[10px] font-black text-white">
        -{product.discountPct}%
      </span>
      <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
        Imagem ilustrativa
      </span>
    </div>
  );
}

/**
 * Vitrine ilustrativa (G1.1 — sem Supabase).
 * Cards são placeholders visuais com valores ilustrativos; o catálogo real
 * será conectado em etapa posterior. Nenhum dado aqui deve ser lido como real.
 */
export function FeaturedProducts() {
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
          Exemplos visuais para apresentar o formato da vitrine — o catálogo
          real será conectado em breve. Valores, descontos e avaliações
          mostrados aqui são ilustrativos.
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PLACEHOLDER_PRODUCTS.map((p) => (
            <li
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgb(234_71_12/0.45)]"
            >
              <ProductThumb product={p} />
              <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                <p className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-snug text-[#3d2c25]">
                  {p.name}
                </p>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <Stars rating={p.rating} />
                  <span className="text-[11px] font-medium text-neutral-500">
                    {p.rating.toFixed(1)} ({p.reviews.toLocaleString("pt-BR")})
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  <span className="price-strike">{brl(p.oldPrice)}</span>
                  <span className="ml-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600">
                    -{p.discountPct}%
                  </span>
                </p>
                <p className="text-lg font-black text-[#EA470C] sm:text-xl">{brl(p.price)}</p>
                <span className="w-fit rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-[#EA470C] ring-1 ring-orange-100">
                  Shopee
                </span>
                <a
                  href="#destaques"
                  className="mt-auto block rounded-xl bg-gradient-to-r from-[#F96116] to-[#E63A1E] px-4 py-2.5 pt-2.5 text-center text-[13px] font-black uppercase tracking-wide text-white transition hover:brightness-110"
                  style={{ marginTop: "0.75rem" }}
                >
                  Ver oferta na Shopee →
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-xs leading-relaxed text-neutral-500">
          Preços, disponibilidade, descontos e condições podem mudar na
          plataforma parceira. Consulte as informações finais antes de realizar
          a compra.
        </p>
      </div>
    </section>
  );
}
