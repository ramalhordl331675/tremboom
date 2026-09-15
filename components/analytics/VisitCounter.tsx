"use client";

import { useEffect, useState } from "react";

function formatVisits(total: number): string {
  const formatted = new Intl.NumberFormat("pt-BR").format(total);
  return total === 1 ? "1 visita" : `${formatted} visitas`;
}

/**
 * Contador público de visitas — discreto, para o rodapé.
 * Busca apenas o agregado total; em qualquer falha não renderiza nada
 * (nunca quebra a página nem desloca o layout).
 */
export function VisitCounter() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/visits", {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        const total =
          typeof data === "object" && data !== null
            ? (data as { total?: unknown }).total
            : null;
        if (typeof total === "number" && Number.isFinite(total)) {
          setLabel(formatVisits(total));
        }
      })
      .catch(() => {
        // Contador indisponível: permanece oculto.
      });
    return () => controller.abort();
  }, []);

  if (label === null) return null;

  return (
    <p className="text-white/50" aria-label={`Total de visitas: ${label}`}>
      👁️ {label}
    </p>
  );
}
