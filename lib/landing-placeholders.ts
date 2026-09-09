/**
 * Utilidades restantes da etapa visual G1.1.
 * Os mocks de vitrine (PLACEHOLDER_PRODUCTS, LANDING_CATEGORIES, NAV_LINKS)
 * foram removidos: a Landing agora consome categorias e produtos reais do
 * Supabase (ver lib/supabase/categories.ts e lib/supabase/products.ts).
 * Mantido aqui apenas o formatador de moeda usado pela vitrine.
 */

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
