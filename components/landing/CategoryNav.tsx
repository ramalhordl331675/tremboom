import { NAV_LINKS } from "@/lib/landing-placeholders";

/** Barra de navegação estilo portal — links visuais (âncoras/placeholders) na G1.1. */
export function CategoryNav() {
  return (
    <nav
      aria-label="Navegação de categorias"
      className="border-b border-orange-100 bg-white"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap py-2">
          {NAV_LINKS.map((link, i) => (
            <li key={link} className="shrink-0">
              <a
                href={link === "Início" ? "#" : `#${link.toLowerCase()}`}
                aria-current={link === "Início" ? "page" : undefined}
                className={
                  link === "Início"
                    ? "mx-1 inline-block rounded-full bg-[#231610] px-4 py-1.5 text-[13px] font-bold text-white"
                    : i === 0
                      ? "inline-block rounded-full px-3 py-1.5 text-[13px] font-bold text-[#EA470C] transition hover:bg-orange-50"
                      : "inline-block rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition hover:bg-orange-50 hover:text-[#EA470C]"
                }
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
