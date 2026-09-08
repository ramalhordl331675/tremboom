-- TremBoom: Etapa C — categories (novos campos) + products.platform_id + RLS admin.
-- Decisões da Etapa B: platform_id NULLABLE com ON DELETE SET NULL (sem join
-- product_platforms); categories com description/image_url/is_active/position;
-- admin via app_metadata.role = 'admin' (padrão do projeto, sem nova função).
-- Idempotente: ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS /
-- DROP IF EXISTS + CREATE para triggers e policies. Tabelas vazias: defaults
-- aplicados sem reescrita relevante.
-- NÃO contém credenciais: nenhuma chave, token ou URL de projeto neste arquivo.
-- NÃO toca nas policies de public.platforms.

-- ---------------------------------------------------------------------------
-- Categories: novos campos (Etapa B, seção 3)
-- ---------------------------------------------------------------------------
alter table public.categories
  add column if not exists description text;

alter table public.categories
  add column if not exists image_url text;

alter table public.categories
  add column if not exists is_active boolean not null default true;

alter table public.categories
  add column if not exists position integer not null default 0;

create index if not exists categories_active_position_idx
  on public.categories (is_active, position);

-- ---------------------------------------------------------------------------
-- Products: vínculo com platforms (Etapa B, seção 4 — Cenário A)
-- ---------------------------------------------------------------------------
alter table public.products
  add column if not exists platform_id uuid
    references public.platforms (id) on delete set null;

create index if not exists products_platform_idx
  on public.products (platform_id);

-- ---------------------------------------------------------------------------
-- Triggers de updated_at (garante o invariante mesmo se a migration
-- inicial foi aplicada parcialmente; padrão do projeto)
-- ---------------------------------------------------------------------------
drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS categories: leitura pública passa a exigir is_active (coluna nova);
-- escrita exclusiva do administrador. Policies de platforms intocadas.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories" on public.categories
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin read categories" on public.categories;
create policy "admin read categories" on public.categories
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert categories" on public.categories;
create policy "admin insert categories" on public.categories
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin update categories" on public.categories;
create policy "admin update categories" on public.categories
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin delete categories" on public.categories;
create policy "admin delete categories" on public.categories
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- RLS products: mantém leitura pública de ativos; adiciona escrita admin.
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select to anon, authenticated using (is_active = true);

drop policy if exists "admin read products" on public.products;
create policy "admin read products" on public.products
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
