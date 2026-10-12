-- KASITU Business Manager — Maintenance module
-- Run once in the Supabase SQL Editor for the KASITU Business Manager project.

create table if not exists public.maintenance (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  maintenance_number text not null,
  title text not null,
  client_id uuid references public.clients(id) on delete set null,
  client_code text,
  client_name text not null,
  service_type text not null default 'Website Maintenance',
  status text not null default 'Planned'
    check (status in ('Planned','Active','Paused','Completed','Cancelled')),
  priority text not null default 'Normal'
    check (priority in ('Low','Normal','High','Urgent')),
  billing_frequency text not null default 'Monthly'
    check (billing_frequency in ('One-time','Weekly','Monthly','Quarterly','Biannual','Annual','Custom')),
  fee numeric(12,2) not null default 0 check (fee >= 0),
  start_date date,
  next_service_date date,
  last_service_date date,
  description text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, maintenance_number)
);

create index if not exists maintenance_owner_idx on public.maintenance(owner_id);
create index if not exists maintenance_client_idx on public.maintenance(owner_id, client_id);
create index if not exists maintenance_status_idx on public.maintenance(owner_id, status);
create index if not exists maintenance_next_service_idx on public.maintenance(owner_id, next_service_date);

alter table public.maintenance enable row level security;
drop policy if exists "maintenance_select_own" on public.maintenance;
create policy "maintenance_select_own" on public.maintenance
  for select to authenticated using (owner_id = auth.uid());
drop policy if exists "maintenance_insert_own" on public.maintenance;
create policy "maintenance_insert_own" on public.maintenance
  for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "maintenance_update_own" on public.maintenance;
create policy "maintenance_update_own" on public.maintenance
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "maintenance_delete_own" on public.maintenance;
create policy "maintenance_delete_own" on public.maintenance
  for delete to authenticated using (owner_id = auth.uid());

drop trigger if exists maintenance_set_updated_at on public.maintenance;
create trigger maintenance_set_updated_at
  before update on public.maintenance
  for each row execute function public.set_updated_at();
