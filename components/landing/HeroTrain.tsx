type MiniIcon = "phone" | "box" | "tag" | "bottle" | "shoe" | "lamp";

function MiniGlyph({ kind }: { kind: MiniIcon }) {
  const common = "h-5 w-5";
  switch (kind) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M4 13a8 8 0 0 1 8-8h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Z"
            fill="currentColor"
          />
          <rect x="15" y="4" width="5" height="10" rx="2.5" fill="currentColor" opacity="0.55" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" fill="currentColor" />
          <path d="M3 7l9 5 9-5M12 12v10" stroke="#fff" strokeWidth="1.6" />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M3 3h8l10 10-8 8L3 11V3Z"
            fill="currentColor"
          />
          <circle cx="8" cy="8" r="1.8" fill="#fff" />
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="9" y="2" width="6" height="4" rx="1" fill="currentColor" />
          <path d="M8 7h8l1.5 12.5a2 2 0 0 1-2 2.5h-7a2 2 0 0 1-2-2.5L8 7Z" fill="currentColor" opacity="0.85" />
        </svg>
      );
    case "shoe":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M3 16V9a1 1 0 0 1 1-1h5l7 5h4a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z"
            fill="currentColor"
          />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M9 2h6v5l4 10a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 17L9 7V2Z" fill="currentColor" />
        </svg>
      );
  }
}

const SMOKE: { kind: MiniIcon; bg: string; fg: string; delay: string; left: string }[] = [
  { kind: "phone", bg: "bg-white", fg: "text-orange-600", delay: "0s", left: "left-[6%]" },
  { kind: "tag", bg: "bg-yellow-300", fg: "text-[#231610]", delay: "0.7s", left: "left-[20%]" },
  { kind: "box", bg: "bg-white", fg: "text-rose-500", delay: "1.4s", left: "left-[34%]" },
  { kind: "bottle", bg: "bg-sky-100", fg: "text-sky-600", delay: "2.1s", left: "left-[48%]" },
  { kind: "shoe", bg: "bg-white", fg: "text-emerald-600", delay: "2.8s", left: "left-[60%]" },
  { kind: "lamp", bg: "bg-orange-100", fg: "text-orange-600", delay: "1s", left: "left-[72%]" },
];

function Wheel({ className = "" }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center ${className}`}>
      <span className="absolute inset-0 animate-[rolling_1.1s_linear_infinite] rounded-full border-[3px] border-dashed border-white/40" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
    </span>
  );
}

/**
 * Ilustração promocional da locomotiva — 100% HTML/CSS/SVG.
 * Estrutura preparada: para usar uma arte final, substitua o conteúdo
 * deste componente mantendo o mesmo wrapper (data-train-illustration).
 */
export function HeroTrain() {
  return (
    <div
      data-train-illustration
      className="relative mx-auto w-full max-w-[560px] select-none overflow-visible px-2 pb-6 pt-14 sm:pt-16"
    >
      {/* Fumaça de miniaturas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24">
        {SMOKE.map((s, i) => (
          <span
            key={i}
            style={{ animationDelay: s.delay }}
            className={`absolute ${s.left} top-10 animate-[puff_3.6s_ease-in-out_infinite]`}
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.fg} shadow-[0_8px_20px_-8px_rgb(35_22_16/0.5)] ring-1 ring-black/5`}
            >
              <MiniGlyph kind={s.kind} />
            </span>
          </span>
        ))}
      </div>

      {/* Selo flutuante */}
      <div className="absolute right-1 top-2 z-10 animate-[float-soft_5s_ease-in-out_infinite] rounded-2xl bg-[#231610] px-3 py-2 text-center shadow-lg sm:right-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">Até</p>
        <p className="text-2xl font-black leading-none text-white">70%</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">off</p>
      </div>

      <div className="animate-[chug_3.2s_ease-in-out_infinite]">
        <div className="flex items-end justify-center gap-1 sm:gap-2">
          {/* LOCOMOTIVA */}
          <div className="relative w-[46%]">
            <div className="absolute -top-7 left-6 h-7 w-6 rounded-t-md bg-[#231610]">
              <span className="absolute -top-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-[#231610]" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F96116] to-[#E63A1E] p-3 shadow-[0_16px_32px_-16px_rgb(234_71_12/0.7)] ring-1 ring-black/10">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-12 place-items-center rounded-lg bg-[#231610] text-[9px] font-black text-yellow-300">
                  TB-01
                </span>
                <span className="h-9 flex-1 rounded-lg bg-sky-200/90 ring-2 ring-white/60" />
              </div>
              <p className="mt-2 rounded-lg bg-yellow-400 px-2 py-1 text-center text-[11px] font-black uppercase tracking-wide text-[#231610]">
                Ofertas imperdíveis
              </p>
              <div className="mt-2 flex items-end justify-between">
                <Wheel className="h-9 w-9 rounded-full bg-[#231610] ring-2 ring-white/30" />
                <Wheel className="h-11 w-11 rounded-full bg-[#231610] ring-2 ring-white/30" />
                <Wheel className="h-9 w-9 rounded-full bg-[#231610] ring-2 ring-white/30" />
              </div>
            </div>
          </div>

          {/* Engate */}
          <span className="mb-6 h-1.5 w-3 rounded-full bg-[#231610]/70 sm:w-5" />

          {/* VAGÃO 1 */}
          <div className="relative w-[27%]">
            <div className="flex -translate-y-1 items-end justify-center gap-1">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-orange-600 shadow ring-1 ring-black/5">
                <MiniGlyph kind="box" />
              </span>
              <span className="grid h-12 w-9 place-items-center rounded-lg bg-[#231610] text-yellow-300 shadow ring-1 ring-black/10">
                <MiniGlyph kind="tag" />
              </span>
            </div>
            <div className="rounded-2xl bg-[#231610] p-2 text-center shadow-lg ring-1 ring-black/20">
              <p className="rounded-lg bg-emerald-400 px-1 py-1 text-[10px] font-black uppercase leading-tight text-[#0b2b1d]">
                Frete grátis
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Wheel className="h-7 w-7 rounded-full bg-black ring-2 ring-white/25" />
                <Wheel className="h-7 w-7 rounded-full bg-black ring-2 ring-white/25" />
              </div>
            </div>
          </div>

          {/* Engate */}
          <span className="mb-6 h-1.5 w-3 rounded-full bg-[#231610]/70 sm:w-5" />

          {/* VAGÃO 2 */}
          <div className="relative w-[27%]">
            <div className="flex -translate-y-1 items-end justify-center gap-1">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 text-sky-600 shadow ring-1 ring-black/5">
                <MiniGlyph kind="bottle" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-600 shadow ring-1 ring-black/5">
                <MiniGlyph kind="shoe" />
              </span>
            </div>
            <div className="rounded-2xl bg-white p-2 text-center shadow-lg ring-1 ring-orange-200">
              <p className="rounded-lg bg-[#E63A1E] px-1 py-1 text-[10px] font-black uppercase leading-tight text-white">
                Cupons de desconto
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Wheel className="h-7 w-7 rounded-full bg-[#231610] ring-2 ring-orange-200" />
                <Wheel className="h-7 w-7 rounded-full bg-[#231610] ring-2 ring-orange-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Trilhos */}
        <div aria-hidden="true" className="mx-1 mt-2">
          <div className="h-1.5 rounded-full bg-[#231610]" />
          <div className="mt-1 flex justify-between px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="h-2 w-3 rounded-sm bg-[#231610]/25" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
