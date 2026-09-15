"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isPublicPage(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/categoria/");
}

/**
 * Registra a visita da página pública atual (fire-and-forget).
 * Não renderiza nada, não bloqueia a página e ignora qualquer falha.
 * Páginas /admin e /api nunca são registradas (checagem aqui + allowlist
 * no servidor).
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPublicPage(pathname)) return;
    const controller = new AbortController();
    fetch("/api/visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ page: pathname }),
      keepalive: true,
      credentials: "same-origin",
      signal: controller.signal,
    }).catch(() => {
      // Contador indisponível: a página segue normalmente.
    });
    return () => controller.abort();
  }, [pathname]);

  return null;
}
