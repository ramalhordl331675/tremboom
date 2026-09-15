import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { VisitStats } from "@/lib/supabase/visits";

// Cookie de sessão do contador: UUID aleatório, sem identificação pessoal.
// httpOnly + SameSite=Lax; nunca lido pelo JavaScript do cliente.
const SESSION_COOKIE = "tb_sid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

function isPublicPage(page: unknown): page is string {
  return (
    typeof page === "string" &&
    (page === "/" || page.startsWith("/categoria/")) &&
    page.length <= 200
  );
}

/**
 * POST /api/visits { page } — registra 1 visita pública.
 * Deduplicação (janela de 30 min por sessão+página) e allowlist vivem na
 * função record_visit(); aqui só validamos o básico e gerenciamos o cookie.
 * Nunca retorna 5xx por falha do contador: erro interno vira { recorded: false }.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const page = (body as { page?: unknown } | null)?.page;
    if (!isPublicPage(page)) {
      return NextResponse.json({ recorded: false }, { status: 400 });
    }

    const jar = await cookies();
    let sessionId = jar.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("record_visit", {
      p_page: page,
      p_session_id: sessionId,
    });

    const response = NextResponse.json({
      recorded: error ? false : data === true,
    });
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch {
    return NextResponse.json({ recorded: false });
  }
}

/**
 * GET /api/visits — agregados públicos do contador (totais, hoje, 7 dias).
 * Somente agregados; nenhuma linha individual é exposta.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_visit_stats");
    if (error || typeof data !== "object" || data === null) {
      throw new Error("LOAD_VISIT_STATS_FAILED");
    }
    const stats = data as VisitStats;
    return NextResponse.json(stats, {
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { total: 0, unique_sessions: 0, today: 0, last_7_days: 0 },
      { headers: { "cache-control": "no-store" } }
    );
  }
}
