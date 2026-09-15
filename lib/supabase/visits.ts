import { createClient } from "@/lib/supabase/server";

export type VisitStats = {
  total: number;
  unique_sessions: number;
  today: number;
  last_7_days: number;
};

const EMPTY_STATS: VisitStats = {
  total: 0,
  unique_sessions: 0,
  today: 0,
  last_7_days: 0,
};

function toVisitStats(value: unknown): VisitStats | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.total !== "number" ||
    typeof v.unique_sessions !== "number" ||
    typeof v.today !== "number" ||
    typeof v.last_7_days !== "number"
  ) {
    return null;
  }
  return {
    total: v.total,
    unique_sessions: v.unique_sessions,
    today: v.today,
    last_7_days: v.last_7_days,
  };
}

/**
 * Agregados do contador de visitas (server-side). Nunca lança: em qualquer
 * falha (p.ex. migration ainda não aplicada) retorna zeros, para que o
 * contador jamais derrube uma página.
 *
 * NOTA: este módulo é server-only (usa next/headers via createClient).
 * Código de cliente NÃO deve importá-lo — ver VisitCounter.
 */
export async function getVisitStats(): Promise<VisitStats> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_visit_stats");
    if (error) return EMPTY_STATS;
    return toVisitStats(data) ?? EMPTY_STATS;
  } catch {
    return EMPTY_STATS;
  }
}
