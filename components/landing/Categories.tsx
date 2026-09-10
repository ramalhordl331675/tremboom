import Link from "next/link";
import type { Category } from "@/lib/supabase/categories";

function CategoryGlyph({ icon }: { icon: string }) {
  const cls = "h-6 w-6";
  switch (icon) {
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2Z" fill="currentColor" />
          <path d="M19 2l.9 2.6L22.5 5.5l-2.6.9L19 9l-.9-2.6-2.6-.9 2.6-.9L19 2Z" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
          <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1v-9Z" fill="currentColor" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.2.9 4.2 2.3C13 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2Z" fill="currentColor" />
        </svg>
      );
    case "shirt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M9 3 3 7l2.5 4L9 9.5V21h6V9.5l3.5 1.5L21 7l-6-4a3 3 0 0 1-6 0Z" fill="currentColor" />
        </svg>
      );
    case "ball":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="currentColor" />
          <path d="M12 7l3 2.2-1.2 3.6h-3.6L9 9.2 12 7Zm-6.5 3.3 3.2.5.5 3-3 1.3-2-2.5 1.3-2.3Zm13 0 1.3 2.3-2 2.5-3-1.3.5-3 3.2-.5ZM9.5 16.5h5L12 21l-2.5-4.5Z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "blocks":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="12" width="8" height="8" rx="1.5" fill="currentColor" />
          <rect x="13" y="12" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
          <rect x="8" y="4" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
        </svg>
      );
    case "wheel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path d="M12 3v6M4.2 7.5l5.2 3M4.2 16.5l5.2-3M19.8 7.5l-5.2 3M19.8 16.5l-5.2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
        </svg>
      );
  }
}

// A tabela categories não possui coluna de ícone (etapa atual não altera
// o banco): o glifo é um fallback visual derivado do slug real.
function iconForSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("eletro")) return "chip";
  if (s.includes("casa") || s.includes("cozinha")) return "home";
  if (s.includes("beleza") || s.includes("saude")) return "heart";
  if (s.includes("moda")) return "shirt";
  if (s.includes("esport")) return "ball";
  if (s.includes("brinquedo")) return "blocks";
  if (s.includes("auto")) return "wheel";
  if (s.includes("achadinho")) return "sparkles";
  return "grid";
}

/**
 * Seção de categorias — dados reais do Supabase (somente ativas).
 * Layout e estilos preservados da Landing aprovada.
 */
export function Categories({
  categories,
  loadError,
}: {
  categories: Category[];
  loadError: boolean;
}) {
  return (
    <section id="categorias" aria-labelledby="categorias-title" className="bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#EA470C]">
              Navegue por temas
            </p>
            <h2 id="categorias-title" className="mt-1 text-2xl font-black tracking-tight text-[#231610] sm:text-3xl">
              Categorias
            </h2>
          </div>
          <a href="#categorias" className="hidden text-sm font-bold text-[#EA470C] hover:underline sm:block">
            Ver todas →
          </a>
        </div>

        {loadError ? (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-sm font-medium text-red-700"
          >
            Não foi possível carregar as categorias agora. Tente novamente
            mais tarde.
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-orange-100 bg-white p-4 text-center text-sm font-medium text-neutral-500">
            Nenhuma categoria disponível no momento.
          </p>
        ) : (
          <ul className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-9 sm:overflow-visible sm:px-0">
            {categories.map((c) => (
              <li key={c.slug} className="shrink-0 sm:shrink">
                <Link
                  href={`/categoria/${c.slug}`}
                  className="group flex w-[88px] flex-col items-center gap-2 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-[#EA470C]/40 hover:shadow-[0_12px_32px_-12px_rgb(234_71_12/0.45)] sm:w-auto"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-[#EA470C] transition group-hover:from-[#F96116] group-hover:to-[#E63A1E] group-hover:text-white">
                    <CategoryGlyph icon={iconForSlug(c.slug)} />
                  </span>
                  <span className="text-center text-[11px] font-bold leading-tight text-[#3d2c25]">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
