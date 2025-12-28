saya sudah membuat tabel dan .env di supabase sebagai berikut

# Supabase (client / browser-safe)
VITE_SUPABASE_URL=https://umrclqszjrzukgvuepgr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_K4n8CMW0DRp1XeUBqg28ZA_8i05yksS

-- =========================================
-- 0) Extensions (uuid generator)
-- =========================================
create extension if not exists "pgcrypto";

-- =========================================
-- 1) Helper: updated_at auto update
-- =========================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- 2) Helper: month derived from date (YYYY-MM)
-- =========================================
create or replace function public.set_transaction_month()
returns trigger
language plpgsql
as $$
begin
  -- normalize month from date field
  new.month = to_char(new.date, 'YYYY-MM');
  return new;
end;
$$;

-- =========================================
-- 3) profiles table
-- =========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  currency text not null default 'IDR',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS: user can read own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- RLS: user can update own profile
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- (Optional but recommended) allow insert own profile row (e.g., after signup)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

-- =========================================
-- 4) balances table
-- =========================================
create table if not exists public.balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null default 0,
  note text,
  updated_at timestamptz not null default now()
);

alter table public.balances enable row level security;

-- updated_at trigger
drop trigger if exists trg_balances_set_updated_at on public.balances;
create trigger trg_balances_set_updated_at
before update on public.balances
for each row execute function public.set_updated_at();

-- RLS policies
drop policy if exists "balances_select_own" on public.balances;
create policy "balances_select_own"
on public.balances
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "balances_insert_own" on public.balances;
create policy "balances_insert_own"
on public.balances
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "balances_update_own" on public.balances;
create policy "balances_update_own"
on public.balances
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "balances_delete_own" on public.balances;
create policy "balances_delete_own"
on public.balances
for delete
to authenticated
using (user_id = auth.uid());

-- Helpful index
create index if not exists idx_balances_user_id
on public.balances(user_id);

-- =========================================
-- 5) categories table
-- =========================================
-- Use a CHECK constraint for type to keep it simple in Supabase
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null default 'both'
    check (type in ('income','expense','both')),
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- RLS policies
drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own"
on public.categories
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
on public.categories
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using (user_id = auth.uid());

-- Helpful indexes
create index if not exists idx_categories_user_id
on public.categories(user_id);

-- Optional: enforce unique category name per user
create unique index if not exists uq_categories_user_name
on public.categories(user_id, name);

-- =========================================
-- 6) transactions table
-- =========================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  month text not null, -- auto-filled by trigger from date
  type text not null check (type in ('income','expense')),
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

-- triggers: set month on insert/update, set updated_at on update
drop trigger if exists trg_transactions_set_month on public.transactions;
create trigger trg_transactions_set_month
before insert or update of date on public.transactions
for each row execute function public.set_transaction_month();

drop trigger if exists trg_transactions_set_updated_at on public.transactions;
create trigger trg_transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

-- RLS policies
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
on public.transactions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
on public.transactions
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
on public.transactions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
on public.transactions
for delete
to authenticated
using (user_id = auth.uid());

-- Indexes requested
create index if not exists idx_transactions_user_month
on public.transactions(user_id, month);

create index if not exists idx_transactions_user_date
on public.transactions(user_id, date);

create index if not exists idx_transactions_user_type_month
on public.transactions(user_id, type, month);

-- Extra (optional) index for category filtering
create index if not exists idx_transactions_user_category_month
on public.transactions(user_id, category_id, month);

-- =========================================
-- 7) (Optional) Auto-create profile row on signup
-- =========================================
-- This makes onboarding simpler: every new auth user gets a profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

