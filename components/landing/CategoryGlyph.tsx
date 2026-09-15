export type CategoryIconKind =
  | "sparkles"
  | "chip"
  | "home"
  | "heart"
  | "shirt"
  | "ball"
  | "blocks"
  | "wheel"
  | "grid";

/**
 * Ícones das categorias por slug.
 *
 * A tabela `categories` não possui campo de ícone nesta etapa, então a
 * correspondência é feita pelo slug (estável, validado no Admin) — nunca
 * pelo nome digitado. Slugs sem correspondência usam o ícone genérico.
 *
 * Evolução futura: priorizar `icon`/`image_url` da tabela quando o campo
 * existir, mantendo este mapa apenas como fallback:
 *   category.image_url ?? category.icon ?? categoryIconForSlug(category.slug)
 */
const SLUG_ICONS: Record<string, CategoryIconKind> = {
  achadinhos: "sparkles",
  eletronicos: "chip",
  "casa-cozinha": "home",
  "casa-e-cozinha": "home",
  cozinha: "home",
  "beleza-saude": "heart",
  "beleza-e-saude": "heart",
  beleza: "heart",
  saude: "heart",
  moda: "shirt",
  esportes: "ball",
  esporte: "ball",
  brinquedos: "blocks",
  automotivo: "wheel",
};

export function categoryIconForSlug(slug: string): CategoryIconKind {
  return SLUG_ICONS[slug.toLowerCase()] ?? "grid";
}

export function CategoryGlyph({ slug }: { slug: string }) {
  const cls = "h-6 w-6";
  switch (categoryIconForSlug(slug)) {
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2Z" fill="currentColor" />
          <path d="M19 2l.9 2.6L22.5 5.5l-2.6.9L19 9l-.9-2.6-2.6-.9 2.6-.9L19 2Z" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
          <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1v-9Z" fill="currentColor" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.2.9 4.2 2.3C13 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2Z" fill="currentColor" />
        </svg>
      );
    case "shirt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M9 3 3 7l2.5 4L9 9.5V21h6V9.5l3.5 1.5L21 7l-6-4a3 3 0 0 1-6 0Z" fill="currentColor" />
        </svg>
      );
    case "ball":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="currentColor" />
          <path d="M12 7l3 2.2-1.2 3.6h-3.6L9 9.2 12 7Zm-6.5 3.3 3.2.5.5 3-3 1.3-2-2.5 1.3-2.3Zm13 0 1.3 2.3-2 2.5-3-1.3.5-3 3.2-.5ZM9.5 16.5h5L12 21l-2.5-4.5Z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "blocks":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="12" width="8" height="8" rx="1.5" fill="currentColor" />
          <rect x="13" y="12" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
          <rect x="8" y="4" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
        </svg>
      );
    case "wheel":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path d="M12 3v6M4.2 7.5l5.2 3M4.2 16.5l5.2-3M19.8 7.5l-5.2 3M19.8 16.5l-5.2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
        </svg>
      );
  }
}
