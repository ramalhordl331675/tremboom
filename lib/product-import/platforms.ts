// Identificação da plataforma a partir do domínio do link.
// Lista explícita e conservadora: domínios desconhecidos NÃO são
// presumidos como Shopee. NENHUMA requisição é feita — só o hostname.

/** Slug da plataforma no banco para cada família de domínios reconhecida. */
export type RecognizedPlatformSlug = "shopee";

const SHOPEE_HOSTS = new Set([
  "shopee.com.br",
  "www.shopee.com.br",
  "s.shopee.com.br",
  "shope.ee",
]);

/**
 * Retorna o slug da plataforma quando o hostname é oficialmente
 * reconhecido, ou null quando a plataforma é desconhecida.
 */
export function identifyPlatformSlug(hostname: string): RecognizedPlatformSlug | null {
  const host = hostname.trim().toLowerCase();
  if (SHOPEE_HOSTS.has(host)) {
    return "shopee";
  }
  return null;
}

/** Nome de exibição para cada slug reconhecido. */
export function platformDisplayName(slug: RecognizedPlatformSlug): string {
  switch (slug) {
    case "shopee":
      return "Shopee";
  }
}
