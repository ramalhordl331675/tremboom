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

// Vitrine pública da Landing (somente leitura anon via RLS).
// Espelha getProducts com filtro is_active = true + affiliate_url
// (necessário ao botão "Ver oferta") — ordenação position ASC,
// created_at DESC conforme regra da vitrine. Não alterar getProducts
// (uso do Admin).
export type LandingProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price: number | string;
  old_price: number | string | null;
  rating: number | string | null;
  highlight_text: string | null;
  affiliate_url: string;
  is_featured: boolean | null;
  position: number | null;
  created_at: string | null;
  category: { id: string; name: string; slug: string } | null;
  platform: { id: string; name: string; slug: string } | null;
};

const LANDING_PRODUCT_COLUMNS =
  "id,name,slug,description,image_url,price,old_price,rating,highlight_text,affiliate_url,is_featured,position,created_at,category:categories(id,name,slug),platform:platforms(id,name,slug)";

export async function getActiveProductsForLanding(): Promise<
  LandingProductItem[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LANDING_PRODUCT_COLUMNS)
    .eq("is_active", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error("LOAD_LANDING_PRODUCTS_FAILED");
  }

  return (data ?? []) as unknown as LandingProductItem[];
}

/**
 * Página pública da categoria — somente produtos ativos de uma
 * categoria (somente leitura anon via RLS). Mesmas colunas e
 * ordenação da vitrine (position ASC, created_at DESC).
 */
export async function getActiveProductsByCategoryId(
  categoryId: string
): Promise<LandingProductItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LANDING_PRODUCT_COLUMNS)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error("LOAD_LANDING_PRODUCTS_FAILED");
  }

  return (data ?? []) as unknown as LandingProductItem[];
}
