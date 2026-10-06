-- KASITU Business Manager — Projects module
-- Run this once in Supabase SQL Editor for the KASITU Business Manager project.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_number text not null,
  project_name text not null,
  client_id uuid references public.clients(id) on delete set null,
  client_code text,
  client_name text not null,
  description text,
  status text not null default 'Planning'
    check (status in ('Planning','In Progress','On Hold','Completed','Cancelled')),
  priority text not null default 'Normal'
    check (priority in ('Low','Normal','High','Urgent')),
  start_date date,
  due_date date,
  budget numeric(12,2) not null default 0 check (budget >= 0),
  progress integer not null default 0 check (progress between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, project_number)
);

create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists projects_client_idx on public.projects(owner_id, client_id);
create index if not exists projects_status_idx on public.projects(owner_id, status);
create index if not exists projects_due_date_idx on public.projects(owner_id, due_date);

alter table public.projects enable row level security;
drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own" on public.projects
  for select to authenticated using (owner_id = auth.uid());
drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own" on public.projects
  for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own" on public.projects
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own" on public.projects
  for delete to authenticated using (owner_id = auth.uid());

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
