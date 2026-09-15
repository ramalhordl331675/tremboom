-- TremBoom: contador real de visitas (somente páginas públicas).
-- Tabela site_visits: uma linha por visita pública, sem PII (sem nome,
-- e-mail, endereço, IP ou qualquer dado pessoal — apenas page + session_id
-- aleatório). Distingue visitas totais (count) de sessões únicas
-- (count distinct session_id).
-- Leitura pública restrita a agregados via get_visit_stats(); registro via
-- record_visit() com janela anti-duplicação de 30 min por (sessão, página).
-- NÃO contém credenciais: nenhuma chave, token ou URL de projeto aqui.
-- NÃO altera tabelas existentes (products, categories, platforms, usuários).

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page text not null,
  session_id text not null
);

create index if not exists site_visits_created_at_idx
  on public.site_visits (created_at desc);

create index if not exists site_visits_session_page_idx
  on public.site_visits (session_id, page, created_at desc);

alter table public.site_visits enable row level security;

-- Registro: apenas anon, somente páginas públicas (nunca /admin nem /api).
-- O Route Handler usa a anon key, então a policy precisa permitir o insert;
-- a validação fina (allowlist + janela de 30 min) vive em record_visit().
drop policy if exists "public insert site visits" on public.site_visits;
create policy "public insert site visits" on public.site_visits
  for insert to anon
  with check (page not like '/admin%' and page not like '/api%');

-- Sem policy de SELECT: ninguém lê linhas cruas (nem anon, nem visitantes).
-- Agregados públicos via get_visit_stats() abaixo.

-- ---------------------------------------------------------------------------
-- record_visit: registra 1 visita se não houver registro da mesma sessão
-- para a mesma página nos últimos 30 min (evita flood de refresh).
-- Retorna true quando inseriu, false quando deduplicou ou recusou.
-- ---------------------------------------------------------------------------
create or replace function public.record_visit(p_page text, p_session_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_page is null
    or (p_page <> '/' and p_page not like '/categoria/%')
    or length(p_page) > 200 then
    return false;
  end if;

  if p_session_id is null
    or length(p_session_id) < 16
    or length(p_session_id) > 128 then
    return false;
  end if;

  if exists (
    select 1 from public.site_visits
    where session_id = p_session_id
      and page = p_page
      and created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  insert into public.site_visits (page, session_id)
  values (p_page, p_session_id);

  return true;
end;
$$;

grant execute on function public.record_visit(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- get_visit_stats: agregados públicos (totais, sessões únicas, hoje, 7 dias).
-- Única leitura exposta ao site público e ao admin.
-- ---------------------------------------------------------------------------
create or replace function public.get_visit_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'total', (select count(*) from public.site_visits),
    'unique_sessions', (select count(distinct session_id) from public.site_visits),
    'today', (select count(*) from public.site_visits
              where created_at >= date_trunc('day', now())),
    'last_7_days', (select count(*) from public.site_visits
                    where created_at >= now() - interval '7 days')
  );
$$;

grant execute on function public.get_visit_stats() to anon, authenticated;
