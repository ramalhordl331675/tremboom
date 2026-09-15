import { createClient } from "@/lib/supabase/server";

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number | string;
  old_price: number | string | null;
  rating: number | string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  position: number | null;
  created_at: string | null;
  category: { id: string; name: string; slug: string } | null;
  platform: { id: string; name: string; slug: string } | null;
};

const PRODUCT_COLUMNS =
  "id,name,slug,image_url,price,old_price,rating,is_featured,is_active,position,created_at,category:categories(id,name,slug),platform:platforms(id,name,slug)";

export type ProductDetails = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  platform_id: string | null;
  image_url: string | null;
  price: number | string;
  old_price: number | string | null;
  affiliate_url: string;
  highlight_text: string | null;
  rating: number | string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
};

const PRODUCT_DETAILS_COLUMNS =
  "id,name,slug,description,category_id,platform_id,image_url,price,old_price,affiliate_url,highlight_text,rating,is_featured,is_active,position,created_at,updated_at";

export async function getProducts(): Promise<ProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Erro genérico de propósito: o boundary (error.tsx) exibe
  // mensagem amigável sem vazar detalhes do Supabase.
  if (error) {
    throw new Error("LOAD_PRODUCTS_FAILED");
  }

  // PostgREST retorna objeto único em joins many-to-one, mas o cliente
  // sem tipos gerados infere array; cast via unknown é intencional.
  return (data ?? []) as unknown as ProductListItem[];
}

export async function getProductById(id: string): Promise<ProductDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_DETAILS_COLUMNS)
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("LOAD_PRODUCT_FAILED");
  }

  return (data ?? null) as ProductDetails | null;
}

/**
 * Vitrine pública: somente produtos ativos, ordenados por posição
 * (mesmo padrão do Admin). Leitura via anon key, amparada pela policy
 * "public read active products" (is_active = true).
 */
export type ShowcaseProduct = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number | string;
  old_price: number | string | null;
  rating: number | string | null;
  affiliate_url: string;
  highlight_text: string | null;
  is_featured: boolean | null;
  position: number | null;
  category: { id: string; name: string; slug: string } | null;
  platform: { id: string; name: string; slug: string } | null;
};

const SHOWCASE_COLUMNS =
  "id,name,slug,image_url,price,old_price,rating,affiliate_url,highlight_text,is_featured,position,category:categories(id,name,slug),platform:platforms(id,name,slug)";

export async function getShowcaseProducts(): Promise<ShowcaseProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(SHOWCASE_COLUMNS)
    .eq("is_active", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Erro genérico de propósito: a vitrine exibe mensagem amigável
  // sem vazar detalhes do Supabase.
  if (error) {
    throw new Error("LOAD_SHOWCASE_FAILED");
  }

  // PostgREST retorna objeto único em joins many-to-one, mas o cliente
  // sem tipos gerados infere array; cast via unknown é intencional.
  return (data ?? []) as unknown as ShowcaseProduct[];
}

/**
 * Vitrine pública filtrada por categoria: somente produtos ativos da
 * categoria informada (via FK category_id), mesma ordenação da vitrine
 * geral (position asc, created_at desc). Reaproveita SHOWCASE_COLUMNS.
 */
export async function getShowcaseProductsByCategory(
  categoryId: string
): Promise<ShowcaseProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(SHOWCASE_COLUMNS)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error("LOAD_SHOWCASE_FAILED");
  }

  return (data ?? []) as unknown as ShowcaseProduct[];
}
