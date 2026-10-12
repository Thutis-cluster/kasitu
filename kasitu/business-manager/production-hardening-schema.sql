-- KASITU Webs Business Manager — Phase 19 Production Hardening
-- Run once in the Supabase SQL Editor for project xkgpiphvqzyafrxsnkes.
-- This is an additive security patch: it preserves existing records and team accounts.
-- Run AFTER account-schema.sql, team-schema.sql, team-data-access-schema.sql,
-- settings-schema.sql, documents-schema.sql and the relevant module schema files.

-- 1. Restrict self-created owner memberships to the user's own business.
-- Without this constraint, a user could try to set business_owner_id to another account.
drop policy if exists "business_members_insert_own" on public.business_members;
create policy "business_members_insert_own"
on public.business_members
for insert to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and status = 'active'
  and (business_owner_id is null or business_owner_id = auth.uid())
);

-- 2. Central database-side role check for write permissions.
-- This is the authoritative control; hiding buttons in the browser is not sufficient.
create or replace function public.current_business_can_write(p_module text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select case bm.role
      when 'owner' then p_module in (
        'clients','leads','quotations','invoices','payments',
        'projects','maintenance','expenses','documents'
      )
      when 'manager' then p_module in (
        'clients','leads','quotations','invoices','payments',
        'projects','maintenance','expenses','documents'
      )
      when 'staff' then p_module in (
        'clients','leads','quotations','invoices','payments'
      )
      else false
    end
    from public.business_members bm
    where bm.user_id = auth.uid()
      and bm.status = 'active'
    limit 1
  ), false);
$$;

-- 3. Replace shared-data write policies with role-aware policies.
-- All active members can read the business data they are permitted to access.
-- Staff can write clients, leads, quotations, invoices and payments.
-- Managers can write operational records; only the owner can write business settings.
do $hardening$
declare
  t text;
begin
  foreach t in array array[
    'clients','leads','quotations','invoices','payments',
    'projects','maintenance','expenses','documents'
  ] loop
    execute format('drop policy if exists %I on public.%I', t||'_select_own', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (owner_id = public.current_business_owner_id())',
      t||'_select_own', t
    );

    execute format('drop policy if exists %I on public.%I', t||'_insert_own', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (owner_id = public.current_business_owner_id() and public.current_business_can_write(%L))',
      t||'_insert_own', t, t
    );

    execute format('drop policy if exists %I on public.%I', t||'_update_own', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (owner_id = public.current_business_owner_id() and public.current_business_can_write(%L)) with check (owner_id = public.current_business_owner_id() and public.current_business_can_write(%L))',
      t||'_update_own', t, t, t
    );

    execute format('drop policy if exists %I on public.%I', t||'_delete_own', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (owner_id = public.current_business_owner_id() and public.current_business_can_write(%L))',
      t||'_delete_own', t, t
    );
  end loop;
end
$hardening$;

-- 4. Business settings: active team members can read shared settings,
-- but only the owner may insert, update or delete them.
drop policy if exists "business_settings_select_own" on public.business_settings;
drop policy if exists "business_settings_select_owner" on public.business_settings;
drop policy if exists "business_settings_select_business" on public.business_settings;
create policy "business_settings_select_business"
on public.business_settings
for select to authenticated
using (owner_id = public.current_business_owner_id());

drop policy if exists "business_settings_insert_own" on public.business_settings;
create policy "business_settings_insert_own"
on public.business_settings
for insert to authenticated
with check (
  owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
);

drop policy if exists "business_settings_update_own" on public.business_settings;
create policy "business_settings_update_own"
on public.business_settings
for update to authenticated
using (
  owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
)
with check (
  owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
);

drop policy if exists "business_settings_delete_own" on public.business_settings;
create policy "business_settings_delete_own"
on public.business_settings
for delete to authenticated
using (
  owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
);

-- 5. Invitation lists and private document storage.
-- Only owners can list invitations. Active members can read existing business files,
-- but upload/update/delete permissions follow the documents role.
drop policy if exists "business_invitations_select_owner" on public.business_invitations;
create policy "business_invitations_select_owner"
on public.business_invitations
for select to authenticated
using (
  business_owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
);

drop policy if exists "business_documents_select_own" on storage.objects;
create policy "business_documents_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'business-documents'
  and (storage.foldername(name))[1] = public.current_business_owner_id()::text
);

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

-- 6. Reduce RPC exposure. SECURITY DEFINER functions are granted only to authenticated users.
-- Explicit checks inside each function still enforce owner-only actions where applicable.
revoke all on function public.current_business_owner_id() from public, anon;
revoke all on function public.current_business_role() from public, anon;
revoke all on function public.current_business_can_write(text) from public, anon;
grant execute on function public.current_business_owner_id() to authenticated;
grant execute on function public.current_business_role() to authenticated;
grant execute on function public.current_business_can_write(text) to authenticated;

revoke all on function public.create_business_invitation(text,text) from public, anon;
revoke all on function public.revoke_business_invitation(uuid) from public, anon;
revoke all on function public.update_business_member(uuid,text,text) from public, anon;
revoke all on function public.remove_business_member(uuid) from public, anon;
revoke all on function public.accept_business_invitation(text,text,text) from public, anon;
revoke all on function public.log_business_activity(text,text,uuid,text,jsonb) from public, anon;
revoke all on function public.get_business_activity(integer) from public, anon;

grant execute on function public.create_business_invitation(text,text) to authenticated;
grant execute on function public.revoke_business_invitation(uuid) to authenticated;
grant execute on function public.update_business_member(uuid,text,text) to authenticated;
grant execute on function public.remove_business_member(uuid) to authenticated;
grant execute on function public.accept_business_invitation(text,text,text) to authenticated;
grant execute on function public.log_business_activity(text,text,uuid,text,jsonb) to authenticated;
grant execute on function public.get_business_activity(integer) to authenticated;

-- Note: this SQL intentionally does not delete or rewrite business records.
