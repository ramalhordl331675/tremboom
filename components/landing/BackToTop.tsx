"use client";

import { useCallback, useEffect, useState } from "react";

const VISIBILITY_THRESHOLD_PX = 400;

function ArrowUpIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 19V5m0 0-6 6m6-6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Botão flutuante "Voltar ao topo" da landing pública.
 * Fica oculto no topo e aparece após ~400px de rolagem,
 * com transição suave de entrada/saída.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > VISIBILITY_THRESHOLD_PX);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      tabIndex={isVisible ? 0 : -1}
      className={`fixed right-4 bottom-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-[#F96116] to-[#E63A1E] text-white shadow-[0_12px_32px_-12px_rgb(234_71_12/0.45)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F96116] sm:right-6 sm:bottom-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon />
    </button>
  );
}
