const BANNERS = [
  {
    eyebrow: "Cupons de desconto",
    title: "Economize mais",
    desc: "Encontre cupons disponíveis nas lojas parceiras.",
    cta: "Ver cupons",
    href: "#destaques",
    style: "from-[#E63A1E] to-[#8f1d0c] text-white",
    chip: "bg-yellow-400 text-[#231610]",
  },
  {
    eyebrow: "Frete grátis",
    title: "Confira condições",
    desc: "Confira produtos com frete grátis.",
    cta: "Ver ofertas",
    href: "#destaques",
    style: "from-[#F96116] to-[#EA470C] text-white",
    chip: "bg-white/20 text-white ring-1 ring-white/40",
  },
  {
    eyebrow: "Ofertas",
    title: "Seleção do dia",
    desc: "Descubra ofertas selecionadas.",
    cta: "Aproveitar",
    href: "#destaques",
    style: "from-[#231610] to-[#4a2c20] text-white",
    chip: "bg-[#E63A1E] text-white",
  },
] as const;

export function PromoBanners() {
  return (
    <section aria-label="Promoções" className="bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 pb-2">
        <div className="grid gap-3 md:grid-cols-3">
          {BANNERS.map((b) => (
            <a
              key={b.eyebrow}
              href={b.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.style} p-5 shadow-[0_1px_2px_rgb(35_22_16/0.06),0_8px_24px_-12px_rgb(234_71_12/0.25)] transition hover:-translate-y-0.5`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl transition group-hover:scale-125" />
              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-widest ${b.chip}`}>
                {b.eyebrow}
              </span>
              <p className="mt-2 text-2xl font-black uppercase tracking-tight">{b.title}</p>
              <p className="mt-1 text-sm text-white/85">{b.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-[13px] font-black text-[#231610] transition group-hover:gap-2">
                {b.cta} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
