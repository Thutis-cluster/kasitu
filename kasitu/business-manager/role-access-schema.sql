-- KASITU Webs Business Manager — Phase 12 role enforcement
-- Run AFTER team-schema.sql and team-data-access-schema.sql.
-- This keeps shared business reads available according to role while restricting writes.

create or replace function public.current_business_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select bm.role
  from public.business_members bm
  where bm.user_id = auth.uid()
    and bm.status = 'active'
  limit 1
$$;

-- Shared data: all active members may read business records.
-- Writes are role-specific.
do $$
declare t text;
begin
  foreach t in array array['clients','leads','quotations','invoices','payments','projects','maintenance','expenses','documents'] loop
    execute format('drop policy if exists %I on public.%I', t||'_insert_own', t);
    execute format('drop policy if exists %I on public.%I', t||'_update_own', t);
    execute format('drop policy if exists %I on public.%I', t||'_delete_own', t);
  end loop;
end $$;

-- Owner / Manager / Staff: operational records.
create policy "clients_insert_role" on public.clients
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "clients_update_role" on public.clients
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "clients_delete_role" on public.clients
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

create policy "leads_insert_role" on public.leads
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "leads_update_role" on public.leads
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "leads_delete_role" on public.leads
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

create policy "quotations_insert_role" on public.quotations
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "quotations_update_role" on public.quotations
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "quotations_delete_role" on public.quotations
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

create policy "invoices_insert_role" on public.invoices
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "invoices_update_role" on public.invoices
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "invoices_delete_role" on public.invoices
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

create policy "payments_insert_role" on public.payments
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "payments_update_role" on public.payments
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager','staff'));
create policy "payments_delete_role" on public.payments
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

-- Projects and maintenance: staff/viewer can read; only owner/manager can change.
create policy "projects_insert_role" on public.projects
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "projects_update_role" on public.projects
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "projects_delete_role" on public.projects
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

create policy "maintenance_insert_role" on public.maintenance
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "maintenance_update_role" on public.maintenance
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "maintenance_delete_role" on public.maintenance
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

-- Expenses: staff can see them only if the role UI eventually exposes them;
-- only owner/manager may create, edit, or delete.
create policy "expenses_insert_role" on public.expenses
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "expenses_update_role" on public.expenses
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "expenses_delete_role" on public.expenses
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

-- Documents: staff/viewer can read; only owner/manager may modify metadata.
create policy "documents_insert_role" on public.documents
for insert to authenticated
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "documents_update_role" on public.documents
for update to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'))
with check (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));
create policy "documents_delete_role" on public.documents
for delete to authenticated
using (owner_id = public.current_business_owner_id() and public.current_business_role() in ('owner','manager'));

-- Business settings remain owner-only.
drop policy if exists "business_settings_select_own" on public.business_settings;
drop policy if exists "business_settings_select_owner" on public.business_settings;
create policy "business_settings_select_business" on public.business_settings
for select to authenticated
using (owner_id = public.current_business_owner_id());
drop policy if exists "business_settings_insert_own" on public.business_settings;
create policy "business_settings_insert_owner" on public.business_settings
for insert to authenticated
with check (owner_id = auth.uid() and public.current_business_role() = 'owner');
drop policy if exists "business_settings_update_own" on public.business_settings;
create policy "business_settings_update_owner" on public.business_settings
for update to authenticated
using (owner_id = auth.uid() and public.current_business_role() = 'owner')
with check (owner_id = auth.uid() and public.current_business_role() = 'owner');

-- Team management is owner-only for invitations. Members can still see their
-- own account and, through team-schema.sql, the business team listing.
drop policy if exists "business_invitations_select_owner" on public.business_invitations;
create policy "business_invitations_select_owner" on public.business_invitations
for select to authenticated
using (business_owner_id = public.current_business_owner_id() and public.current_business_role() = 'owner');

-- Storage: active members may read business documents; only owner/manager may write/delete.
drop policy if exists "business_documents_insert_own" on storage.objects;
create policy "business_documents_insert_role" on storage.objects
for insert to authenticated
with check (
  bucket_id='business-documents'
  and (storage.foldername(name))[1]=public.current_business_owner_id()::text
  and public.current_business_role() in ('owner','manager')
);
drop policy if exists "business_documents_update_own" on storage.objects;
create policy "business_documents_update_role" on storage.objects
for update to authenticated
using (
  bucket_id='business-documents'
  and (storage.foldername(name))[1]=public.current_business_owner_id()::text
  and public.current_business_role() in ('owner','manager')
)
with check (
  bucket_id='business-documents'
  and (storage.foldername(name))[1]=public.current_business_owner_id()::text
  and public.current_business_role() in ('owner','manager')
);
drop policy if exists "business_documents_delete_own" on storage.objects;
create policy "business_documents_delete_role" on storage.objects
for delete to authenticated
using (
  bucket_id='business-documents'
  and (storage.foldername(name))[1]=public.current_business_owner_id()::text
  and public.current_business_role() in ('owner','manager')
);
