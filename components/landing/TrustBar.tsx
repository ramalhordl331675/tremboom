const BENEFITS = [
  {
    title: "Ofertas selecionadas",
    desc: "Achadinhos escolhidos para você",
    icon: "check" as const,
  },
  {
    title: "Plataformas parceiras",
    desc: "Você compra diretamente na loja parceira",
    icon: "store" as const,
  },
  {
    title: "Informações claras",
    desc: "Confira preço, condições e detalhes antes de comprar",
    icon: "info" as const,
  },
  {
    title: "Novos achadinhos",
    desc: "Descubra novas oportunidades regularmente",
    icon: "bolt" as const,
  },
];

function BenefitIcon({ icon }: { icon: (typeof BENEFITS)[number]["icon"] }) {
  const cls = "h-6 w-6";
  switch (icon) {
    case "store":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M4 9l1.5-4h13L20 9M4 9h16v2a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0v-2ZM6 13.5V20h12v-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "info":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1.3" fill="currentColor" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="m8 12.5 2.6 2.6L16 9.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
        </svg>
      );
  }
}

export function TrustBar() {
  return (
    <section aria-label="Benefícios" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <li
              key={b.title}
              className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-[#FFF8F2] p-4"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#F96116] to-[#E63A1E] text-white shadow-sm">
                <BenefitIcon icon={b.icon} />
              </span>
              <span>
                <span className="block text-sm font-black text-[#231610]">{b.title}</span>
                <span className="block text-xs text-neutral-500">{b.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
