-- KASITU Webs Business Manager — Phase 12 Team Management
-- Run once in Supabase SQL Editor AFTER account-schema.sql.
-- Creates secure, server-side invitation functions without exposing a service key.

create extension if not exists pgcrypto;

alter table public.business_members
  add column if not exists business_owner_id uuid references auth.users(id) on delete cascade;

alter table public.business_members
  add column if not exists email text;

update public.business_members bm
set business_owner_id = bm.user_id
where bm.role = 'owner' and bm.business_owner_id is null;

update public.business_members bm
set email = lower(u.email)
from auth.users u
where bm.user_id = u.id
  and bm.email is null;

create index if not exists business_members_owner_idx
  on public.business_members(business_owner_id);

create table if not exists public.business_invitations (
  id uuid primary key default gen_random_uuid(),
  business_owner_id uuid not null references auth.users(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'staff'
    check (role in ('manager','staff','viewer')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists business_invitations_owner_idx
  on public.business_invitations(business_owner_id, created_at desc);

create index if not exists business_invitations_email_idx
  on public.business_invitations(lower(email));

alter table public.business_invitations enable row level security;

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

drop policy if exists "business_members_select_business" on public.business_members;
create policy "business_members_select_business"
on public.business_members
for select to authenticated
using (
  user_id = auth.uid()
  or business_owner_id = public.current_business_owner_id()
);

drop policy if exists "business_invitations_select_owner" on public.business_invitations;
create policy "business_invitations_select_owner"
on public.business_invitations
for select to authenticated
using (business_owner_id = public.current_business_owner_id());

create or replace function public.create_business_invitation(
  p_email text,
  p_role text default 'staff'
)
returns table(invitation_id uuid, invite_token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_token text;
  v_expires timestamptz;
  v_id uuid;
begin
  v_owner := public.current_business_owner_id();

  if v_owner is null or public.current_business_role() <> 'owner' then
    raise exception 'Only the business owner can create invitations';
  end if;

  if lower(trim(coalesce(p_email,''))) = '' then
    raise exception 'Email address is required';
  end if;

  if p_role not in ('manager','staff','viewer') then
    raise exception 'Invalid invitation role';
  end if;

  if exists (
    select 1 from public.business_members
    where business_owner_id = v_owner
      and lower(email) = lower(trim(p_email))
      and status = 'active'
  ) then
    raise exception 'This email already has active team access';
  end if;

  v_token := encode(gen_random_bytes(32), 'hex');
  v_expires := now() + interval '7 days';

  insert into public.business_invitations(
    business_owner_id, invited_by, email, role, token_hash, expires_at
  )
  values(
    v_owner, auth.uid(), lower(trim(p_email)), p_role,
    encode(digest(v_token, 'sha256'), 'hex'), v_expires
  )
  returning id into v_id;

  return query select v_id, v_token, v_expires;
end;
$$;

create or replace function public.revoke_business_invitation(p_invitation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  v_owner := public.current_business_owner_id();

  if v_owner is null or public.current_business_role() <> 'owner' then
    raise exception 'Only the business owner can revoke invitations';
  end if;

  update public.business_invitations
  set revoked_at = now()
  where id = p_invitation_id
    and business_owner_id = v_owner
    and accepted_at is null
    and revoked_at is null;

  return found;
end;
$$;

create or replace function public.accept_business_invitation(
  p_token text,
  p_full_name text default null,
  p_phone text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_inv public.business_invitations%rowtype;
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to accept an invitation';
  end if;

  select lower(email) into v_email from auth.users where id = auth.uid();

  v_hash := encode(digest(coalesce(p_token,''), 'sha256'), 'hex');

  select * into v_inv
  from public.business_invitations
  where token_hash = v_hash
    and accepted_at is null
    and revoked_at is null
    and expires_at > now()
  limit 1;

  if not found then
    raise exception 'This invitation is invalid, expired, revoked, or already used';
  end if;

  if lower(v_inv.email) <> lower(coalesce(v_email,'')) then
    raise exception 'This invitation was issued to a different email address';
  end if;

  if exists (
    select 1 from public.business_members where user_id = auth.uid()
  ) then
    raise exception 'This account already has Business Manager access';
  end if;

  insert into public.business_members(
    user_id, business_owner_id, email, role, status
  )
  values(
    auth.uid(), v_inv.business_owner_id, lower(v_email), v_inv.role, 'active'
  );

  insert into public.business_profiles(user_id, full_name, phone)
  values(auth.uid(), nullif(trim(coalesce(p_full_name,'')),''), nullif(trim(coalesce(p_phone,'')),''))
  on conflict (user_id) do update set
    full_name = coalesce(excluded.full_name, public.business_profiles.full_name),
    phone = coalesce(excluded.phone, public.business_profiles.phone);

  update public.business_invitations
  set accepted_at = now()
  where id = v_inv.id;

  return true;
end;
$$;

grant execute on function public.create_business_invitation(text,text) to authenticated;
grant execute on function public.revoke_business_invitation(uuid) to authenticated;
grant execute on function public.accept_business_invitation(text,text,text) to authenticated;
