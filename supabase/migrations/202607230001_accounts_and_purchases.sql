create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.app_role as enum ('user', 'volunteer', 'staff', 'admin');
create type public.account_state as enum ('active', 'suspended');
create type public.product_category as enum (
  'pass',
  'masterclass',
  'competition',
  'other'
);
create type public.payment_method as enum ('card', 'cash');
create type public.purchase_status as enum (
  'pending',
  'active',
  'cancelled',
  'suspended'
);
create type public.money_currency as enum ('AMD', 'EUR', 'RUB', 'AED');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext not null unique,
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  role public.app_role not null default 'user',
  account_state public.account_state not null default 'active',
  password_reset_required boolean not null default false,
  onboarding_completed boolean not null default false,
  age_16_confirmed_at timestamptz,
  terms_version text,
  terms_accepted_at timestamptz,
  privacy_version text,
  privacy_acknowledged_at timestamptz,
  qr_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  category public.product_category not null,
  description text check (description is null or char_length(description) <= 2000),
  active boolean not null default true,
  published boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  currency public.money_currency not null,
  amount_minor bigint not null check (amount_minor >= 0),
  active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  retired_at timestamptz
);

create unique index one_active_price_per_product_currency
  on public.product_prices (product_id, currency)
  where active;

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  product_name_snapshot text not null,
  product_category_snapshot public.product_category not null,
  amount_minor_snapshot bigint not null check (amount_minor_snapshot >= 0),
  currency_snapshot public.money_currency not null,
  payment_method public.payment_method not null,
  status public.purchase_status not null,
  status_reason text,
  created_by uuid references auth.users (id) on delete set null,
  purchased_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases (user_id);
create index purchases_status_idx on public.purchases (status);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  target_user_id uuid references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id text,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index audit_target_user_idx
  on public.audit_log (target_user_id, created_at desc);
create index audit_entity_idx
  on public.audit_log (entity_type, entity_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger purchases_set_updated_at
before update on public.purchases
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  supplied_first_name text;
  supplied_last_name text;
  completed boolean;
begin
  supplied_first_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'given_name'), ''),
    'Pending'
  );
  supplied_last_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'family_name'), ''),
    'Profile'
  );
  completed :=
    coalesce((new.raw_user_meta_data ->> 'age_16_confirmed')::boolean, false)
    and coalesce((new.raw_user_meta_data ->> 'terms_accepted')::boolean, false)
    and coalesce((new.raw_user_meta_data ->> 'privacy_acknowledged')::boolean, false)
    and supplied_first_name <> 'Pending'
    and supplied_last_name <> 'Profile';

  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    onboarding_completed,
    age_16_confirmed_at,
    terms_version,
    terms_accepted_at,
    privacy_version,
    privacy_acknowledged_at
  )
  values (
    new.id,
    coalesce(new.email, new.id::text || '@missing.invalid'),
    supplied_first_name,
    supplied_last_name,
    completed,
    case when completed then now() else null end,
    case when completed then new.raw_user_meta_data ->> 'terms_version' else null end,
    case when completed then now() else null end,
    case when completed then new.raw_user_meta_data ->> 'privacy_version' else null end,
    case when completed then now() else null end
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create schema if not exists private;

create or replace function private.has_team_role()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and account_state = 'active'
      and role in ('volunteer', 'staff', 'admin')
  );
$$;

create or replace function private.has_admin_role()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and account_state = 'active'
      and role = 'admin'
  );
$$;

revoke all on schema private from public;
grant usage on schema private to authenticated;
grant execute on function private.has_team_role() to authenticated;
grant execute on function private.has_admin_role() to authenticated;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.purchases enable row level security;
alter table public.audit_log enable row level security;

revoke insert, update, delete on public.profiles from anon, authenticated;
revoke insert, update, delete on public.products from anon, authenticated;
revoke insert, update, delete on public.product_prices from anon, authenticated;
revoke insert, update, delete on public.purchases from anon, authenticated;
revoke insert, update, delete on public.audit_log from anon, authenticated;

grant select on public.profiles to authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_prices to anon, authenticated;
grant select on public.purchases to authenticated;
grant select on public.audit_log to authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.profiles,
  public.products,
  public.product_prices,
  public.purchases,
  public.audit_log
to service_role;

create policy "users read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "team reads profiles"
on public.profiles for select
to authenticated
using ((select private.has_team_role()));

create policy "published products are public"
on public.products for select
to anon, authenticated
using (published);

create policy "team reads all products"
on public.products for select
to authenticated
using ((select private.has_team_role()));

create policy "published product prices are public"
on public.product_prices for select
to anon, authenticated
using (
  active
  and exists (
    select 1
    from public.products
    where products.id = product_prices.product_id
      and products.published
  )
);

create policy "team reads all product prices"
on public.product_prices for select
to authenticated
using ((select private.has_team_role()));

create policy "users read their own purchases"
on public.purchases for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "team reads purchases"
on public.purchases for select
to authenticated
using ((select private.has_team_role()));

create policy "admins read audit log"
on public.audit_log for select
to authenticated
using ((select private.has_admin_role()));

comment on table public.purchases is
  'Immutable commercial snapshots. Do not delete purchase history through the application.';
comment on column public.profiles.qr_token is
  'Opaque revocable lookup token. It contains no user PII.';
comment on column public.product_prices.amount_minor is
  'Integer smallest unit; AMD is stored as whole dram, EUR/RUB/AED as minor units.';
comment on column public.purchases.amount_minor_snapshot is
  'Locked price at purchase time; never recompute from product_prices.';
