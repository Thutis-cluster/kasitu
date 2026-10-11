-- KASITU Webs Business Manager — Phase 19.1 RLS policy conflict cleanup
-- Run once in Supabase SQL Editor AFTER production-hardening-schema.sql.
-- Removes legacy *_role write policies that can OR together with the
-- hardened *_own policies. No business records are deleted or rewritten.

begin;

-- Remove legacy role-based write policies from the shared business tables.
do $cleanup$
declare
  t text;
  action text;
begin
  foreach t in array array[
    'clients','leads','quotations','invoices','payments',
    'projects','maintenance','expenses','documents'
  ] loop
    foreach action in array array['insert','update','delete'] loop
      execute format('drop policy if exists %I on public.%I', t || '_' || action || '_role', t);
    end loop;
  end loop;
end
$cleanup$;

-- Staff may create/update the modules allowed by Phase 19, but only owners
-- and managers may delete business records.
do $delete_policies$
declare
  t text;
begin
  foreach t in array array[
    'clients','leads','quotations','invoices','payments',
    'projects','maintenance','expenses','documents'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_delete_own', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (owner_id = public.current_business_owner_id() and public.current_business_role() in (''owner'',''manager''))',
      t || '_delete_own', t
    );
  end loop;
end
$delete_policies$;

-- Remove the old settings write policies; Phase 19's *_own policies remain.
drop policy if exists "business_settings_insert_owner" on public.business_settings;
drop policy if exists "business_settings_update_owner" on public.business_settings;

-- Storage policies must retain the hardened *_own names and conditions.
-- Drop the legacy *_role policies, then restore role-checked write access.
drop policy if exists "business_documents_insert_role" on storage.objects;
drop policy if exists "business_documents_update_role" on storage.objects;
drop policy if exists "business_documents_delete_role" on storage.objects;

drop policy if exists "business_documents_insert_own" on storage.objects;
create policy "business_documents_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'business-documents'
  and (storage.foldername(name))[1] = public.current_business_owner_id()::text
  and public.current_business_can_write('documents')
);

drop policy if exists "business_documents_update_own" on storage.objects;
create policy "business_documents_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'business-documents'
  and (storage.foldername(name))[1] = public.current_business_owner_id()::text
  and public.current_business_can_write('documents')
)
with check (
  bucket_id = 'business-documents'
  and (storage.foldername(name))[1] = public.current_business_owner_id()::text
  and public.current_business_can_write('documents')
);

drop policy if exists "business_documents_delete_own" on storage.objects;
create policy "business_documents_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'business-documents'
  and (storage.foldername(name))[1] = public.current_business_owner_id()::text
  and public.current_business_can_write('documents')
);

commit;

-- Read-only verification: remaining duplicate table/operation groups.
-- Multiple SELECT policies can be intentional; inspect remaining write groups.
select
  tablename,
  cmd,
  count(*) as policy_count,
  string_agg(policyname, ', ' order by policyname) as policies
from pg_policies
where schemaname = 'public'
  and tablename in (
    'business_members',
    'business_invitations',
    'business_settings',
    'clients',
    'leads',
    'quotations',
    'invoices',
    'payments',
    'projects',
    'maintenance',
    'expenses',
    'documents',
    'business_activity_log'
  )
group by tablename, cmd
having count(*) > 1
order by tablename, cmd;
