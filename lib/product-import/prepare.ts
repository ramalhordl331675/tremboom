import { normalizeImportLink } from "./normalize";

// Preparação dos dados da importação para o formulário existente.
// Preenche SOMENTE o que é determinável com segurança (plataforma + link).
// Todo o resto (nome, preço, imagem, etc.) continua manual — sem invenção.
export type ImportInitialValues = {
  affiliate_url?: string;
  platform_id?: string;
};

type PlatformRef = { id: string; slug: string };

/**
 * Validação server-side dos parâmetros de importação vindos da query
 * (?affiliate_url=…&platform_id=…). Nunca confia no navegador:
 * - a URL precisa normalizar com sucesso;
 * - o platform_id precisa existir de verdade na lista de plataformas.
 * Retorna apenas valores seguros para pré-preencher o ProductForm.
 */
export function resolveImportInitialValues(
  params: { affiliate_url?: string; platform_id?: string },
  platforms: PlatformRef[]
): ImportInitialValues {
  const initial: ImportInitialValues = {};

  if (params.affiliate_url) {
    const normalized = normalizeImportLink(params.affiliate_url);
    if (normalized.ok) {
      initial.affiliate_url = normalized.url;
    }
  }

  if (params.platform_id) {
    const exists = platforms.some((p) => p.id === params.platform_id);
    if (exists) {
      initial.platform_id = params.platform_id;
    }
  }

  return initial;
}

/** Monta a query string para /admin/products/new a partir de valores seguros. */
export function buildImportQuery(values: Required<ImportInitialValues>): string {
  const search = new URLSearchParams({
    affiliate_url: values.affiliate_url,
    platform_id: values.platform_id,
  });
  return `/admin/products/new?${search.toString()}`;
}
