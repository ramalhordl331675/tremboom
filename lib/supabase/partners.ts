import { createClient } from "@/lib/supabase/server";

// Espelha a tabela public.partners (migration 20260915130000).
// Leitura pública restrita a parceiros ativos (policy
// "public read active partners"); o Admin enxerga tudo.

export type PartnerListItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  affiliate_url: string;
  button_text: string | null;
  category: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
};

const PARTNER_COLUMNS =
  "id,name,slug,image_url,affiliate_url,button_text,category,is_active,display_order,created_at";

export type PartnerDetails = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  affiliate_url: string;
  button_text: string | null;
  category: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

const PARTNER_DETAILS_COLUMNS =
  "id,name,slug,description,image_url,affiliate_url,button_text,category,is_active,display_order,created_at,updated_at";

export type PublicPartner = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  affiliate_url: string;
  button_text: string | null;
  category: string | null;
  display_order: number | null;
};

const PUBLIC_PARTNER_COLUMNS =
  "id,name,slug,description,image_url,affiliate_url,button_text,category,display_order";

export async function getPartners(): Promise<PartnerListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_COLUMNS)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Erro genérico de propósito: o boundary (error.tsx) exibe
  // mensagem amigável sem vazar detalhes do Supabase.
  if (error) {
    throw new Error("LOAD_PARTNERS_FAILED");
  }

  return (data ?? []) as PartnerListItem[];
}

export async function getPartnerById(
  id: string
): Promise<PartnerDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_DETAILS_COLUMNS)
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("LOAD_PARTNER_FAILED");
  }

  return (data ?? null) as PartnerDetails | null;
}

/**
 * Vitrine pública: somente parceiros ativos, ordenados por display_order.
 * Leitura via anon key, amparada pela policy "public read active partners".
 * Tabela vazia => lista vazia (a seção da landing não aparece).
 */
export async function getActivePartners(): Promise<PublicPartner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select(PUBLIC_PARTNER_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Erro genérico de propósito: a landing oculta a seção
  // sem vazar detalhes do Supabase.
  if (error) {
    throw new Error("LOAD_ACTIVE_PARTNERS_FAILED");
  }

  return (data ?? []) as PublicPartner[];
}
