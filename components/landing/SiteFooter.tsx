"use client";

import { TrainLogo } from "./TrainLogo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "TremBoom",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Fale conosco", href: "#" },
    ],
  },
  {
    title: "Informações",
    links: [
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de Uso", href: "#" },
      { label: "Política de Afiliados", href: "#" },
    ],
  },
  {
    title: "Ofertas",
    links: [
      { label: "Achadinhos", href: "#destaques" },
      { label: "Categorias", href: "#categorias" },
      { label: "Ofertas", href: "#destaques" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#231610] text-orange-100/80">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white">
                <TrainLogo className="h-8 w-8" />
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                TremBoom
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Portal de achadinhos e ofertas — descubra por aqui e compre
              diretamente nas plataformas parceiras.
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-orange-100/60">
              O TremBoom é um portal de curadoria e divulgação de achadinhos e
              ofertas. As compras são realizadas diretamente nas plataformas
              parceiras.
            </p>
            <form
              aria-label="Receber ofertas por e-mail (visual)"
              className="mt-4 flex max-w-xs overflow-hidden rounded-xl bg-white/10 p-1 ring-1 ring-white/15"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="Seu e-mail para ofertas"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-[#F96116] to-[#E63A1E] px-4 py-2 text-[13px] font-black text-white"
              >
                OK
              </button>
            </form>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm transition hover:text-yellow-300">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs sm:flex-row">
          <p>© 2026 TremBoom — Todos os direitos reservados.</p>
          <p className="text-white/50">
            Alguns links podem gerar comissão para o TremBoom.
          </p>
        </div>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40 sm:text-left">
          Preços, disponibilidade, descontos e condições podem mudar na
          plataforma parceira. Consulte as informações finais antes de realizar
          a compra.
        </p>
      </div>
    </footer>
  );
}
