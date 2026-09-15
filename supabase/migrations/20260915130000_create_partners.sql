-- TremBoom: Parceiros — vitrine de parceiros gerenciada pelo Admin.
-- Tabela public.partners (começa vazia, sem seed): landing exibe somente
-- parceiros ativos ordenados por display_order (seção "Nossos Parceiros").
-- RLS segue o padrão do projeto (categories/products): leitura pública
-- restrita a is_active = true; escrita exclusiva do administrador
-- (auth.jwt() -> app_metadata -> role = 'admin').
-- NÃO contém credenciais: nenhuma chave, token ou URL de projeto aqui.
-- NÃO altera tabelas existentes.

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text not null,
  affiliate_url text not null,
  button_text text,
  category text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partners_active_order_idx
  on public.partners (is_active, display_order);

create index if not exists partners_slug_idx
  on public.partners (slug);

-- Reaproveita o trigger padrão de updated_at do projeto.
drop trigger if exists trg_partners_updated_at on public.partners;
create trigger trg_partners_updated_at
  before update on public.partners
  for each row execute function public.handle_updated_at();

alter table public.partners enable row level security;

-- Leitura pública: somente parceiros ativos (landing + sitemap futuro).
drop policy if exists "public read active partners" on public.partners;
create policy "public read active partners" on public.partners
  for select to anon, authenticated using (is_active = true);

-- Admin autenticado enxerga tudo (inclusive inativos, para gerenciar).
drop policy if exists "admin read partners" on public.partners;
create policy "admin read partners" on public.partners
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert partners" on public.partners;
create policy "admin insert partners" on public.partners
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin update partners" on public.partners;
create policy "admin update partners" on public.partners
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin delete partners" on public.partners;
create policy "admin delete partners" on public.partners
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
