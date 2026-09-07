-- TremBoom initial schema: categories + products
-- Aprovado na Etapa 5 com as decisões da Etapa 6.
-- Idempotente para projeto novo: re-execução segura (IF NOT EXISTS / OR REPLACE / DROP IF EXISTS).
-- NÃO contém credenciais: nenhuma chave, token ou URL de projeto neste arquivo.

-- ---------------------------------------------------------------------------
-- Tabela categories (mínima, conforme aprovação)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tabela products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  category_id uuid not null references public.categories (id) on delete restrict,
  image_url text,
  price numeric(10,2) not null check (price >= 0),
  old_price numeric(10,2) check (old_price >= 0),
  discount numeric(5,2) generated always as (
    case
      when old_price is not null and old_price > 0 and old_price > price
        then round((1 - price / old_price) * 100, 2)
      else 0
    end
  ) stored,
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  affiliate_url text not null check (affiliate_url like 'https://%'),
  highlight_text text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (old_price is null or old_price >= price)
);

-- ---------------------------------------------------------------------------
-- Índices úteis (vitrine, filtros e joins)
-- ---------------------------------------------------------------------------
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_position_idx on public.products (is_active, position);
create index if not exists products_featured_idx on public.products (position)
  where is_featured and is_active;

-- ---------------------------------------------------------------------------
-- Trigger de updated_at (compartilhado)
-- ---------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: leitura pública somente de itens ativos; nenhuma escrita pública;
-- nenhuma policy administrativa nesta etapa (admin futura via
-- Supabase Auth + app_metadata.role = 'admin').
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select to anon, authenticated using (is_active = true);
