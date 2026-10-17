-- KASITU Webs Sales Partner Portal Phase 1
create table if not exists public.sales_partners (
 user_id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null,
 email text, phone text,
 status text not null default 'active' check (status in ('active','paused','disabled')),
 commission_rate numeric(5,2) not null default 14.00 check (commission_rate = 14.00),
 created_at timestamptz not null default now()
);
create table if not exists public.sales_partner_leads (
 id uuid primary key default gen_random_uuid(),
 manager_id uuid not null references auth.users(id) on delete cascade,
 salesperson_id uuid not null references auth.users(id) on delete restrict,
 business_name text not null, contact_name text not null, phone text not null,
 email text, service_requested text not null, notes text,
 status text not null default 'New' check (status in ('New','Contacted','Quoted','Won','Lost')),
 service_price numeric(12,2),
 commission_rate numeric(5,2) not null default 14.00 check (commission_rate = 14.00),
 commission_amount numeric(12,2) generated always as (case when service_price is null then null else round(service_price * commission_rate / 100,2) end) stored,
 commission_status text not null default 'Not eligible' check (commission_status in ('Not eligible','Pending','Approved','Paid')),
 manager_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists sales_partner_leads_manager_idx on public.sales_partner_leads(manager_id,created_at desc);
create index if not exists sales_partner_leads_salesperson_idx on public.sales_partner_leads(salesperson_id,created_at desc);
alter table public.sales_partners enable row level security;
alter table public.sales_partner_leads enable row level security;
drop policy if exists sales_partners_read_self_or_owner on public.sales_partners;
create policy sales_partners_read_self_or_owner on public.sales_partners for select to authenticated using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));
drop policy if exists sales_leads_read_self_or_manager on public.sales_partner_leads;
create policy sales_leads_read_self_or_manager on public.sales_partner_leads for select to authenticated using (salesperson_id=auth.uid() or (manager_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner')));
drop policy if exists sales_leads_update_manager on public.sales_partner_leads;
create policy sales_leads_update_manager on public.sales_partner_leads for update to authenticated using (manager_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner')) with check (manager_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='owner'));
create or replace function public.submit_sales_partner_lead(p_business_name text,p_contact_name text,p_phone text,p_email text,p_service_requested text,p_notes text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_manager uuid; v_lead uuid;
begin
 if v_user is null then raise exception 'Please sign in first.'; end if;
 if not exists(select 1 from public.sales_partners sp where sp.user_id=v_user and sp.status='active') then raise exception 'Sales partner account is not active.'; end if;
 if nullif(trim(p_business_name),'') is null or nullif(trim(p_contact_name),'') is null or nullif(trim(p_phone),'') is null or nullif(trim(p_service_requested),'') is null then raise exception 'Business, contact, phone and service are required.'; end if;
 select id into v_manager from public.profiles where role='owner' order by created_at asc limit 1;
 if v_manager is null then raise exception 'KASITU manager account is not configured.'; end if;
 insert into public.sales_partner_leads(manager_id,salesperson_id,business_name,contact_name,phone,email,service_requested,notes)
 values(v_manager,v_user,trim(p_business_name),trim(p_contact_name),trim(p_phone),nullif(trim(coalesce(p_email,'')),''),trim(p_service_requested),nullif(trim(coalesce(p_notes,'')),''))
 returning id into v_lead;
 return v_lead;
end $$;
revoke all on function public.submit_sales_partner_lead(text,text,text,text,text,text) from public;
grant execute on function public.submit_sales_partner_lead(text,text,text,text,text,text) to authenticated;
-- Provision a partner after creating their Supabase Auth user:
-- insert into public.sales_partners(user_id,full_name,email,phone) values ('AUTH-USER-UUID','Salesperson Name','person@example.com','0712345678');
