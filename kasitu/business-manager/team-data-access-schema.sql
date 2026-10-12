-- KASITU Webs Business Manager — Phase 12 shared business data access
-- Run AFTER account-schema.sql and team-schema.sql.
-- Existing records keep their original owner_id; team members access the owner's records.

create or replace function public.current_business_owner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select bm.business_owner_id
  from public.business_members bm
  where bm.user_id = auth.uid()
    and bm.status = 'active'
  limit 1
$$;

-- Shared business tables
drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own" on public.clients for select to authenticated using (owner_id = public.current_business_owner_id());
drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own" on public.clients for insert to authenticated with check (owner_id = public.current_business_owner_id());
drop policy if exists "clients_update_own" on public.clients;
create policy "clients_update_own" on public.clients for update to authenticated using (owner_id = public.current_business_owner_id()) with check (owner_id = public.current_business_owner_id());
drop policy if exists "clients_delete_own" on public.clients;
create policy "clients_delete_own" on public.clients for delete to authenticated using (owner_id = public.current_business_owner_id());

drop policy if exists "leads_select_own" on public.leads;
create policy "leads_select_own" on public.leads for select to authenticated using (owner_id = public.current_business_owner_id());
drop policy if exists "leads_insert_own" on public.leads;
create policy "leads_insert_own" on public.leads for insert to authenticated with check (owner_id = public.current_business_owner_id());
drop policy if exists "leads_update_own" on public.leads;
create policy "leads_update_own" on public.leads for update to authenticated using (owner_id = public.current_business_owner_id()) with check (owner_id = public.current_business_owner_id());
drop policy if exists "leads_delete_own" on public.leads;
create policy "leads_delete_own" on public.leads for delete to authenticated using (owner_id = public.current_business_owner_id());

do $$
declare t text;
begin
  foreach t in array array['quotations','invoices','payments','projects','maintenance','expenses','documents'] loop
    execute format('drop policy if exists %I on public.%I', t||'_select_own', t);
    execute format('create policy %I on public.%I for select to authenticated using (owner_id = public.current_business_owner_id())', t||'_select_own', t);
    execute format('drop policy if exists %I on public.%I', t||'_insert_own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (owner_id = public.current_business_owner_id())', t||'_insert_own', t);
    execute format('drop policy if exists %I on public.%I', t||'_update_own', t);
    execute format('create policy %I on public.%I for update to authenticated using (owner_id = public.current_business_owner_id()) with check (owner_id = public.current_business_owner_id())', t||'_update_own', t);
    execute format('drop policy if exists %I on public.%I', t||'_delete_own', t);
    execute format('create policy %I on public.%I for delete to authenticated using (owner_id = public.current_business_owner_id())', t||'_delete_own', t);
  end loop;
end $$;

-- Private uploaded documents follow the business owner's UUID, not the individual team member's UUID.
drop policy if exists "business_documents_select_own" on storage.objects;
create policy "business_documents_select_own" on storage.objects
for select to authenticated
using (bucket_id='business-documents' and (storage.foldername(name))[1]=public.current_business_owner_id()::text);

drop policy if exists "business_documents_insert_own" on storage.objects;
create policy "business_documents_insert_own" on storage.objects
for insert to authenticated
with check (bucket_id='business-documents' and (storage.foldername(name))[1]=public.current_business_owner_id()::text);

drop policy if exists "business_documents_update_own" on storage.objects;
create policy "business_documents_update_own" on storage.objects
for update to authenticated
using (bucket_id='business-documents' and (storage.foldername(name))[1]=public.current_business_owner_id()::text)
with check (bucket_id='business-documents' and (storage.foldername(name))[1]=public.current_business_owner_id()::text);

drop policy if exists "business_documents_delete_own" on storage.objects;
create policy "business_documents_delete_own" on storage.objects
for delete to authenticated
using (bucket_id='business-documents' and (storage.foldername(name))[1]=public.current_business_owner_id()::text);
