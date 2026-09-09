const STEPS = [
  {
    n: "1",
    title: "Você encontra",
    desc: "Descubra achadinhos e ofertas selecionadas.",
  },
  {
    n: "2",
    title: "Você escolhe",
    desc: "Compare as informações e escolha o produto que mais combina com você.",
  },
  {
    n: "3",
    title: "Você compra na loja parceira",
    desc: "Ao clicar em uma oferta, você será direcionado para a plataforma parceira para concluir a compra.",
  },
] as const;

/** Explica o modelo de afiliados: descoberta no TremBoom, compra na loja parceira. */
export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-[#EA470C]">
          Sem checkout por aqui
        </p>
        <h2
          id="como-funciona-title"
          className="mt-1 text-center text-2xl font-black tracking-tight text-[#231610] sm:text-3xl"
        >
          Como funciona?
        </h2>
        <ol className="mx-auto mt-6 grid max-w-4xl gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-orange-100 bg-[#FFF8F2] p-5 text-center shadow-sm"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#F96116] to-[#E63A1E] text-base font-black text-white">
                {s.n}
              </span>
              <p className="mt-3 text-sm font-black text-[#231610]">
                {s.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
