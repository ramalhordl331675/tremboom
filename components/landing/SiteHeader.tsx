"use client";

import { TrainLogo } from "./TrainLogo";

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M20 20l-3.8-3.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlameIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2c1 4-3 5.5-3 10a5 5 0 0 0 10 0c0-2-1-3.5-2-5-.5 1.5-1.5 2.5-3 3 .5-3-1-6.5-2-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Header do portal de achadinhos — visual apenas (G1.1).
 * Sem conta, sem carrinho, sem checkout: o TremBoom direciona para lojas parceiras.
 * Busca é apenas visual nesta etapa.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 shadow-[0_2px_16px_-6px_rgb(234_71_12/0.5)]">
      {/* Faixa utilitária */}
      <div className="bg-[#231610]">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-amber-200 sm:text-xs">
          Portal de achadinhos e ofertas — descubra oportunidades em lojas
          parceiras
        </p>
      </div>

      {/* Barra principal */}
      <div className="bg-gradient-to-r from-[#F96116] via-[#EA470C] to-[#E63A1E]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:py-4">
          {/* Menu mobile (visual) */}
          <button
            type="button"
            aria-label="Abrir menu"
            className="rounded-lg p-1.5 text-white transition hover:bg-white/15 lg:hidden"
          >
            <MenuIcon />
          </button>

          {/* Logo */}
          <a href="#" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm">
              <TrainLogo className="h-8 w-8" />
            </span>
            <span className="leading-tight">
              <span className="block truncate text-[13px] font-black tracking-tight text-white min-[400px]:text-xl sm:text-2xl">
                TREMBOOM DA SHOPEE
              </span>
              <span className="hidden text-[11px] font-medium text-orange-100 sm:block">
                Os melhores achadinhos, em um só lugar!
              </span>
            </span>
          </a>

          {/* Busca desktop */}
          <form
            role="search"
            aria-label="Buscar produtos"
            className="hidden min-w-0 flex-1 md:flex"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="busca-desktop" className="sr-only">
              Buscar produtos
            </label>
            <div className="flex w-full overflow-hidden rounded-xl bg-white p-1 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-yellow-300">
              <input
                id="busca-desktop"
                type="search"
                placeholder="Busque por achadinhos, marcas e categorias…"
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-[#231610] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black"
              >
                <SearchIcon className="h-4 w-4" />
                Buscar
              </button>
            </div>
          </form>

          {/* Ações */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <a
              href="#destaques"
              className="flex items-center gap-1.5 rounded-xl bg-[#231610] px-3 py-2 text-[13px] font-black text-white shadow-sm transition hover:bg-black sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <FlameIcon />
              <span className="hidden whitespace-nowrap min-[400px]:inline">🔥 Ofertas de hoje</span>
            </a>
          </div>
        </div>

        {/* Busca mobile — segunda linha */}
        <div className="px-4 pb-3 md:hidden">
          <form
            role="search"
            aria-label="Buscar produtos"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="busca-mobile" className="sr-only">
              Buscar produtos
            </label>
            <div className="flex overflow-hidden rounded-xl bg-white p-1 pl-4 shadow-sm">
              <input
                id="busca-mobile"
                type="search"
                placeholder="O que você procura hoje?"
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                aria-label="Pesquisar"
                className="grid w-11 place-items-center rounded-lg bg-[#231610] text-white"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
