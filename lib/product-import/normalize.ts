// Normalização do link de importação.
// Funções puras (sem imports server-only): usadas pelo formulário client
// e pela validação server-side. NENHUM acesso à página da plataforma,
// NENHUM scraping, NENHUMA chamada de API — apenas o texto do link.

export type NormalizedLink = { ok: true; url: string } | { ok: false; error: string };

/**
 * Valida e normaliza o link colado pelo administrador:
 * - remove espaços acidentais;
 * - exige URL válida com protocolo http:// ou https://;
 * - sem "https://" ausente não inventamos protocolo: texto sem host válido falha.
 */
export function normalizeImportLink(raw: string): NormalizedLink {
  const trimmed = (raw ?? "").trim();

  if (!trimmed) {
    return { ok: false, error: "Cole o link do produto para continuar." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Isso não parece um link válido. Confira e tente de novo." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "O link precisa começar com http:// ou https://." };
  }

  return { ok: true, url: parsed.href };
}
