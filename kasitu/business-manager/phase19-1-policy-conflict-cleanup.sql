-- KASITU Webs Business Manager — Phase 19.1 RLS policy conflict cleanup
-- Run once in Supabase SQL Editor AFTER production-hardening-schema.sql.
-- This removes legacy *_role write policies that otherwise OR together with
-- the hardened *_own policies. No business records are deleted or rewritten.

begin;

-- Remove the legacy role-based write policies. The hardened *_own policies
-- remain responsible for inserts and updates; delete access is recreated below.
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

-- The Phase 19 can_write function intentionally allows staff to create/update
-- selected records. Staff must not gain DELETE access through the generic
-- can_write check, so restrict all shared-data deletes to owner/manager.
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

-- These legacy settings policies are superseded by the Phase 19 role-aware
-- policies. Remove the older equivalents to keep one clear rule per operation.
drop policy if exists "business_settings_insert_owner" on public.business_settings;
drop policy if exists "business_settings_update_owner" on public.business_settings;

commit;

-- Verify remaining multiple policies for the same operation.
-- Multiple SELECT policies may be intentional (for example, own profile plus
-- team/business visibility). Review any remaining write duplicates separately.
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
