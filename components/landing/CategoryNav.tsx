import Link from "next/link";
import type { Category } from "@/lib/supabase/categories";

/**
 * Barra de navegação estilo portal — "Início" + categorias reais do
 * Supabase (somente ativas). Cada categoria leva à sua página própria
 * ("/categoria/[slug]"). Layout e estilos preservados.
 */
export function CategoryNav({ categories }: { categories: Category[] }) {
  return (
    <nav
      aria-label="Navegação de categorias"
      className="border-b border-orange-100 bg-white"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap py-2">
          <li className="shrink-0">
            <Link
              href="/"
              aria-current="page"
              className="mx-1 inline-block rounded-full bg-[#231610] px-4 py-1.5 text-[13px] font-bold text-white"
            >
              Início
            </Link>
          </li>
          {categories.length === 0 ? (
            <li className="shrink-0">
              <span className="inline-block rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-400">
                Nenhuma categoria disponível
              </span>
            </li>
          ) : (
            categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/categoria/${c.slug}`}
                  className="inline-block rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition hover:bg-orange-50 hover:text-[#EA470C]"
                >
                  {c.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
}
