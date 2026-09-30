-- KASITU Webs Business Manager — Phase 11 Account & Access
-- Run once in Supabase SQL Editor.
-- Roles are intentionally protected from browser self-escalation.

create table if not exists public.business_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager','staff','viewer')),
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;
alter table public.business_members enable row level security;

drop policy if exists "business_profiles_select_own" on public.business_profiles;
create policy "business_profiles_select_own" on public.business_profiles
for select to authenticated using (user_id = auth.uid());

drop policy if exists "business_profiles_insert_own" on public.business_profiles;
create policy "business_profiles_insert_own" on public.business_profiles
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "business_profiles_update_own" on public.business_profiles;
create policy "business_profiles_update_own" on public.business_profiles
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "business_members_select_own" on public.business_members;
create policy "business_members_select_own" on public.business_members
for select to authenticated using (user_id = auth.uid());

drop policy if exists "business_members_insert_own" on public.business_members;
create policy "business_members_insert_own" on public.business_members
for insert to authenticated with check (user_id = auth.uid() and role = 'owner' and status = 'active');

drop policy if exists "business_profiles_updated_at" on public.business_profiles;
create trigger business_profiles_updated_at before update on public.business_profiles
for each row execute function public.set_updated_at();

drop policy if exists "business_members_updated_at" on public.business_members;
create trigger business_members_updated_at before update on public.business_members
for each row execute function public.set_updated_at();

insert into public.business_members (user_id, role, status)
select id, 'owner', 'active'
from auth.users
where not exists (
  select 1 from public.business_members bm where bm.user_id = auth.users.id
);
