-- KASITU Webs Business Manager — Phase 10 Settings
-- Run once in Supabase SQL Editor. Each account can only access its own settings.
create table if not exists public.business_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null default 'KASITU Webs',
  contact_name text,
  email text,
  phone text,
  website text,
  address text,
  default_quote_validity_days integer not null default 14 check (default_quote_validity_days between 1 and 365),
  default_deposit_rate numeric(5,2) not null default 50 check (default_deposit_rate between 0 and 100),
  default_vat_rate numeric(5,2) not null default 0 check (default_vat_rate between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.business_settings enable row level security;
drop policy if exists "business_settings_select_own" on public.business_settings;
create policy "business_settings_select_own" on public.business_settings for select to authenticated using (owner_id = auth.uid());
drop policy if exists "business_settings_insert_own" on public.business_settings;
create policy "business_settings_insert_own" on public.business_settings for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "business_settings_update_own" on public.business_settings;
create policy "business_settings_update_own" on public.business_settings for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop trigger if exists business_settings_set_updated_at on public.business_settings;
create trigger business_settings_set_updated_at before update on public.business_settings for each row execute function public.set_updated_at();
