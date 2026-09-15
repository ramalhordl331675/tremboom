"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicPartner } from "@/lib/supabase/partners";

const AUTOPLAY_MS = 4500;

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PartnerSlide({ partner }: { partner: PublicPartner }) {
  return (
    <a
      href={partner.affiliate_url}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label={`${partner.name} — abrir site do parceiro`}
      className="group block min-w-0 snap-center overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#EA470C]/40 hover:shadow-[0_12px_32px_-12px_rgb(234_71_12/0.45)]"
    >
      <span className="relative block aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
        <img
          src={partner.image_url}
          alt={partner.name}
          loading="lazy"
          decoding="async"
          width={800}
          height={500}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 rounded-md bg-[#231610]/85 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
          Parceria
        </span>
      </span>
      <span className="block min-w-0 p-4">
        <span className="block truncate text-sm font-black text-[#231610]">
          {partner.name}
        </span>
        {partner.description ? (
          <span className="mt-1 line-clamp-2 block min-h-9 text-[13px] leading-snug break-words text-neutral-500">
            {partner.description}
          </span>
        ) : null}
        <span className="mt-3 block rounded-xl bg-gradient-to-r from-[#F96116] to-[#E63A1E] px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-white transition group-hover:brightness-110">
          {partner.button_text?.trim() || "Visitar parceiro"} →
        </span>
      </span>
    </a>
  );
}

/**
 * Carrossel sem dependências: scroll-snap nativo (mouse/touch/swipe),
 * autoplay com loop, pausa em hover/foco/toque e controles acessíveis.
 * Com 1 parceiro, exibe o card estático (sem autoplay nem controles).
 */
export function PartnersSlider({ partners }: { partners: PublicPartner[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    const target = slides[index];
    if (target) {
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft - 16, behavior: "smooth" });
    }
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      goTo((active + direction + partners.length) % partners.length);
    },
    [active, goTo, partners.length]
  );

  // Acompanha o slide visível (dots) sem forçar re-render por pixel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || partners.length < 2) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        const center = track.scrollLeft + track.clientWidth / 2;
        slides.forEach((slide, i) => {
          const slideCenter =
            slide.offsetLeft - track.offsetLeft + slide.clientWidth / 2;
          const dist = Math.abs(slideCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [partners.length]);

  // Autoplay com loop; respeita pausa (hover/foco/toque) e 1 parceiro.
  useEffect(() => {
    if (partners.length < 2) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setActive((current) => {
        const next = (current + 1) % partners.length;
        goTo(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goTo, partners.length]);

  if (partners.length === 1) {
    return (
      <div className="mx-auto w-full max-w-md">
        <PartnerSlide partner={partners[0]} />
      </div>
    );
  }

  const setPaused = (paused: boolean) => {
    pausedRef.current = paused;
  };

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Nossos parceiros"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") step(-1);
        if (event.key === "ArrowRight") step(1);
      }}
      className="min-w-0"
    >
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1"
      >
        {partners.map((partner) => (
          <div
            key={partner.id}
            data-slide
            className="w-[82%] min-w-0 shrink-0 snap-center min-[420px]:w-[62%] sm:w-[47%] lg:w-[31.5%]"
          >
            <PartnerSlide partner={partner} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Parceiro anterior"
          className="grid h-10 w-10 place-items-center rounded-full border border-orange-200 bg-white text-[#EA470C] shadow-sm transition hover:border-[#EA470C]/50 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA470C]"
        >
          <ChevronIcon direction="prev" />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {partners.map((partner, index) => (
            <span
              key={partner.id}
              className={
                index === active
                  ? "h-2 w-6 rounded-full bg-[#EA470C] transition-all"
                  : "h-2 w-2 rounded-full bg-[#231610]/15 transition-all"
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Próximo parceiro"
          className="grid h-10 w-10 place-items-center rounded-full border border-orange-200 bg-white text-[#EA470C] shadow-sm transition hover:border-[#EA470C]/50 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA470C]"
        >
          <ChevronIcon direction="next" />
        </button>
      </div>
    </div>
  );
}

/**
 * Seção pública "Nossos Parceiros" — somente parceiros ativos
 * (ordenados por display_order). Sem parceiros, não renderiza nada.
 */
export function PartnersSection({ partners }: { partners: PublicPartner[] }) {
  if (partners.length === 0) return null;

  return (
    <section
      id="parceiros"
      aria-labelledby="parceiros-title"
      className="overflow-hidden bg-white"
    >
      <div className="mx-auto max-w-7xl min-w-0 px-4 py-10 sm:py-12">
        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-[#EA470C]">
          Indicações do TremBoom
        </p>
        <h2
          id="parceiros-title"
          className="mt-1 text-balance text-center text-2xl font-black tracking-tight break-words text-[#231610] sm:text-3xl"
        >
          🤝 Nossos Parceiros
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[13px] leading-relaxed text-neutral-500">
          Lojas e serviços parceiros — você descobre por aqui e continua
          diretamente no site do parceiro.
        </p>
        <div className="mt-6 min-w-0">
          <PartnersSlider partners={partners} />
        </div>
      </div>
    </section>
  );
}
