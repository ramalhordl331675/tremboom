import { HeroTrain } from "./HeroTrain";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#16a34a" />
      <path
        d="m8 12.5 2.6 2.6L16 9.5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hero principal — banner da locomotiva preservado (G1.1: modelo de afiliados). */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1E6] via-[#FFF8F2] to-[#FFF8F2]">
      {/* brilhos decorativos */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-[36rem] rounded-full bg-yellow-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-6 lg:pb-14">
        {/* Lado esquerdo */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-[#EA470C] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EA470C] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EA470C]" />
            </span>
            Portal de achadinhos e ofertas
          </span>

          <p className="mt-4 text-sm font-black uppercase tracking-[0.3em] text-[#EA470C]">
            TremBoom
          </p>
          <h1 className="mt-1 text-4xl font-black leading-[1.05] tracking-tight text-[#231610] sm:text-5xl xl:text-6xl">
            Os melhores achadinhos,{" "}
            <span className="bg-gradient-to-r from-[#F96116] to-[#E63A1E] bg-clip-text text-transparent">
              em um só lugar!
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#6f5b52] sm:text-lg lg:mx-0">
            Encontramos produtos interessantes, ofertas e oportunidades em
            lojas parceiras para você descobrir em um só lugar.
          </p>

          <ul className="mx-auto mt-5 flex max-w-xl flex-col gap-2 text-left sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            {[
              "Achadinhos selecionados",
              "Ofertas em destaque",
              "Produtos de lojas parceiras",
            ].map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] font-semibold text-[#3d2c25] shadow-sm ring-1 ring-orange-100"
              >
                <CheckIcon />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#destaques"
              className="w-full rounded-xl bg-gradient-to-r from-[#F96116] to-[#E63A1E] px-8 py-3.5 text-center text-sm font-black uppercase tracking-widest text-white shadow-[0_12px_32px_-12px_rgb(234_71_12/0.8)] transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
            >
              Aproveite agora →
            </a>
            <a
              href="#categorias"
              className="w-full rounded-xl border-2 border-[#231610]/10 bg-white px-8 py-3 text-center text-sm font-bold uppercase tracking-widest text-[#231610] transition hover:border-[#EA470C]/40 hover:text-[#EA470C] sm:w-auto"
            >
              Explorar categorias
            </a>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-[#6f5b52] lg:mx-0 lg:text-left">
            Você descobre por aqui e conclui a compra diretamente na loja
            parceira.
          </p>
        </div>

        {/* Lado direito — locomotiva */}
        <div className="relative">
          <div className="rounded-[2rem] border border-orange-100 bg-white/70 p-2 shadow-[0_1px_2px_rgb(35_22_16/0.06),0_8px_24px_-12px_rgb(234_71_12/0.25)] backdrop-blur">
            <div className="rounded-[1.6rem] bg-gradient-to-b from-sky-100 via-orange-50 to-amber-100 px-2">
              <HeroTrain />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2" aria-label="Indicadores do carrossel (visual)">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={
                  i === 0
                    ? "h-2 w-7 rounded-full bg-[#EA470C]"
                    : "h-2 w-2 rounded-full bg-[#231610]/15"
                }
              />
            ))}
          </div>
          <p className="mt-1 text-center text-[11px] font-medium text-[#6f5b52]">
            Carrossel promocional — navegação completa chega nas próximas etapas
          </p>
        </div>
      </div>
    </section>
  );
}
