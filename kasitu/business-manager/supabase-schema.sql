-- KASITU Webs Business Manager
-- Phase 1B database schema for Supabase/PostgreSQL
-- Run this in the Supabase SQL Editor AFTER creating your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_code text not null,
  business_name text not null,
  contact_name text,
  email text,
  phone text,
  service text,
  status text not null default 'Active' check (status in ('Active','Inactive','Prospect')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, client_code)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  contact_name text,
  phone text,
  email text,
  service_requested text,
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Won','Lost')),
  follow_up_date date,
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_owner_idx on public.clients(owner_id);
create index if not exists leads_owner_idx on public.leads(owner_id);
create index if not exists leads_follow_up_idx on public.leads(owner_id, follow_up_date);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.leads enable row level security;

-- Profiles: a signed-in user can only see/update their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Clients: users can only access their own records.
drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own"
on public.clients for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own"
on public.clients for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "clients_update_own" on public.clients;
create policy "clients_update_own"
on public.clients for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "clients_delete_own" on public.clients;
create policy "clients_delete_own"
on public.clients for delete
to authenticated
using (owner_id = auth.uid());

-- Leads: users can only access their own records.
drop policy if exists "leads_select_own" on public.leads;
create policy "leads_select_own"
on public.leads for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "leads_insert_own" on public.leads;
create policy "leads_insert_own"
on public.leads for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "leads_update_own" on public.leads;
create policy "leads_update_own"
on public.leads for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "leads_delete_own" on public.leads;
create policy "leads_delete_own"
on public.leads for delete
to authenticated
using (owner_id = auth.uid());

-- Automatically keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- Create a profile automatically whenever a new authenticated user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Optional starter records for your own account.
-- Replace YOUR_AUTH_USER_UUID after creating your account, then run these manually.
-- insert into public.clients (owner_id, client_code, business_name, service, status)
-- values ('YOUR_AUTH_USER_UUID', 'KAS-2026-001', 'Mumsy Braids Studio', 'Website / Booking System', 'Active');
--
-- insert into public.clients (owner_id, client_code, business_name, service, status)
-- values ('YOUR_AUTH_USER_UUID', 'KAS-2026-002', 'Thutis Project', 'Business Website', 'Active');

-- Phase 2: quotations
create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  quote_number text not null,
  client_id uuid references public.clients(id) on delete set null,
  client_code text,
  client_name text not null,
  client_contact text,
  client_email text,
  client_phone text,
  quote_date date not null default current_date,
  valid_until date,
  status text not null default 'Draft' check (status in ('Draft','Sent','Approved','Rejected','Expired')),
  line_items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  deposit_rate numeric(5,2) not null default 50,
  deposit_amount numeric(12,2) not null default 0,
  balance_amount numeric(12,2) not null default 0,
  notes text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, quote_number)
);
create index if not exists quotations_owner_idx on public.quotations(owner_id);
create index if not exists quotations_client_idx on public.quotations(owner_id, client_id);
create index if not exists quotations_status_idx on public.quotations(owner_id, status);
alter table public.quotations enable row level security;
drop policy if exists "quotations_select_own" on public.quotations;
create policy "quotations_select_own" on public.quotations for select to authenticated using (owner_id = auth.uid());
drop policy if exists "quotations_insert_own" on public.quotations;
create policy "quotations_insert_own" on public.quotations for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "quotations_update_own" on public.quotations;
create policy "quotations_update_own" on public.quotations for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "quotations_delete_own" on public.quotations;
create policy "quotations_delete_own" on public.quotations for delete to authenticated using (owner_id = auth.uid());
drop trigger if exists quotations_set_updated_at on public.quotations;
create trigger quotations_set_updated_at before update on public.quotations for each row execute function public.set_updated_at();


-- Phase 3: invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  invoice_number text not null,
  quotation_id uuid references public.quotations(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  client_code text,
  client_name text not null,
  client_contact text,
  client_email text,
  client_phone text,
  invoice_date date not null default current_date,
  due_date date,
  status text not null default 'Draft' check (status in ('Draft','Sent','Partially Paid','Paid','Overdue','Cancelled')),
  line_items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance_due numeric(12,2) not null default 0,
  notes text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, invoice_number)
);
create index if not exists invoices_owner_idx on public.invoices(owner_id);
create index if not exists invoices_quotation_idx on public.invoices(owner_id, quotation_id);
create index if not exists invoices_status_idx on public.invoices(owner_id, status);
alter table public.invoices enable row level security;
drop policy if exists "invoices_select_own" on public.invoices;
create policy "invoices_select_own" on public.invoices for select to authenticated using (owner_id = auth.uid());
drop policy if exists "invoices_insert_own" on public.invoices;
create policy "invoices_insert_own" on public.invoices for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "invoices_update_own" on public.invoices;
create policy "invoices_update_own" on public.invoices for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "invoices_delete_own" on public.invoices;
create policy "invoices_delete_own" on public.invoices for delete to authenticated using (owner_id = auth.uid());
drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at before update on public.invoices for each row execute function public.set_updated_at();


-- Phase 4: payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  payment_number text not null,
  invoice_id uuid references public.invoices(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  client_code text,
  client_name text,
  invoice_number text,
  payment_date date not null default current_date,
  amount numeric(12,2) not null default 0 check (amount > 0),
  method text not null default 'EFT' check (method in ('EFT','Cash','Card','PayPal','Other')),
  reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, payment_number)
);
create index if not exists payments_owner_idx on public.payments(owner_id);
create index if not exists payments_invoice_idx on public.payments(owner_id, invoice_id);
create index if not exists payments_date_idx on public.payments(owner_id, payment_date);
alter table public.payments enable row level security;
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments for select to authenticated using (owner_id = auth.uid());
drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own" on public.payments for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "payments_update_own" on public.payments;
create policy "payments_update_own" on public.payments for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "payments_delete_own" on public.payments;
create policy "payments_delete_own" on public.payments for delete to authenticated using (owner_id = auth.uid());
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function public.set_updated_at();
