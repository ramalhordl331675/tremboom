import { createClient } from "@/lib/supabase/server";

// Espelha a tabela public.platforms (migration 20260907220343).
// Padrão do projeto: logo_url e is_active (sem colunas logo/status).
export type Platform = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  rating: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  position: number | null;
  created_at: string | null;
};

const PLATFORM_COLUMNS =
  "id,name,slug,logo_url,rating,is_active,is_featured,position,created_at";

export async function getPlatforms(): Promise<Platform[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platforms")
    .select(PLATFORM_COLUMNS)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Erro genérico de propósito: o boundary (error.tsx) exibe
  // mensagem amigável sem vazar detalhes do Supabase.
  if (error) {
    throw new Error("LOAD_PLATFORMS_FAILED");
  }

  return (data ?? []) as Platform[];
}
