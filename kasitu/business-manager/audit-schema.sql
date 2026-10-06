-- KASITU Webs Business Manager — Phase 15 Activity & Audit Log
create table if not exists public.business_activity_log (
  id uuid primary key default gen_random_uuid(),
  business_owner_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('created','updated','deleted','removed','revoked','logged_in','logged_out')),
  module text not null,
  record_id uuid,
  record_label text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_activity_owner_created_idx
on public.business_activity_log(business_owner_id, created_at desc);

alter table public.business_activity_log enable row level security;

drop policy if exists "business_activity_select_owner" on public.business_activity_log;
create policy "business_activity_select_owner"
on public.business_activity_log
for select to authenticated
using (
  business_owner_id = public.current_business_owner_id()
  and public.current_business_role() = 'owner'
);

create or replace function public.log_business_activity(
  p_action text,
  p_module text,
  p_record_id uuid default null,
  p_record_label text default null,
  p_details jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  v_owner := public.current_business_owner_id();
  if v_owner is null then raise exception 'No active Business Manager membership'; end if;
  if p_action not in ('created','updated','deleted','removed','revoked','logged_in','logged_out') then raise exception 'Invalid audit action'; end if;
  insert into public.business_activity_log(business_owner_id,actor_user_id,action,module,record_id,record_label,details)
  values(v_owner,auth.uid(),p_action,p_module,p_record_id,p_record_label,coalesce(p_details,'{}'::jsonb));
  return true;
end;
$$;

create or replace function public.get_business_activity(p_limit integer default 200)
returns table(
  id uuid,
  created_at timestamptz,
  actor_email text,
  actor_role text,
  action text,
  module text,
  record_id uuid,
  record_label text,
  details jsonb
)
language sql
security definer
set search_path = public
as $$
  select l.id,l.created_at,lower(u.email),m.role,l.action,l.module,l.record_id,l.record_label,l.details
  from public.business_activity_log l
  join auth.users u on u.id=l.actor_user_id
  join public.business_members m on m.user_id=l.actor_user_id
  where l.business_owner_id=public.current_business_owner_id()
    and public.current_business_role()='owner'
  order by l.created_at desc
  limit greatest(1,least(coalesce(p_limit,200),500));
$$;

grant execute on function public.log_business_activity(text,text,uuid,text,jsonb) to authenticated;
grant execute on function public.get_business_activity(integer) to authenticated;
