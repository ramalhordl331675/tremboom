-- TremBoom: tabela public.platforms (Parte 2B).
-- Compatível com lib/supabase/platforms.ts (colunas logo/status removidas;
-- padrão do projeto: logo_url e is_active).
-- Reutiliza public.handle_updated_at() e o padrão de RLS da migration inicial.
-- NÃO contém credenciais: nenhuma chave, token ou URL de projeto neste arquivo.

-- ---------------------------------------------------------------------------
-- Tabela platforms
-- ---------------------------------------------------------------------------
create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  logo_url text,
  description text,
  affiliate_url text check (affiliate_url is null or affiliate_url like 'https://%'),
  bonus_text text,
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Índices úteis (vitrine e ordenação)
-- ---------------------------------------------------------------------------
create index if not exists platforms_active_position_idx on public.platforms (is_active, position);
create index if not exists platforms_featured_idx on public.platforms (position)
  where is_featured and is_active;

-- ---------------------------------------------------------------------------
-- Trigger de updated_at (reutiliza public.handle_updated_at())
-- ---------------------------------------------------------------------------
drop trigger if exists trg_platforms_updated_at on public.platforms;
create trigger trg_platforms_updated_at
  before update on public.platforms
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: leitura pública somente de plataformas ativas; escrita exclusiva
-- do administrador via app_metadata.role = 'admin' (padrão do projeto).
-- Nenhuma policy concede escrita a anon ou a authenticated comum.
-- ---------------------------------------------------------------------------
alter table public.platforms enable row level security;

drop policy if exists "public read active platforms" on public.platforms;
create policy "public read active platforms" on public.platforms
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin read platforms" on public.platforms;
create policy "admin read platforms" on public.platforms
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert platforms" on public.platforms;
create policy "admin insert platforms" on public.platforms
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin update platforms" on public.platforms;
create policy "admin update platforms" on public.platforms
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin delete platforms" on public.platforms;
create policy "admin delete platforms" on public.platforms
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
