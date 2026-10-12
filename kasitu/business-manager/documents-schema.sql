-- KASITU Business Manager — Documents module (Phase 8)
-- Run this entire script once in the Supabase SQL Editor.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('business-documents','business-documents',false,15728640,array[
'application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','text/plain','image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create table if not exists public.documents (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 document_number text not null,title text not null,document_type text not null default 'Other',
 client_id uuid references public.clients(id) on delete set null,client_name text,
 document_date date,expiry_date date,file_name text,file_path text,mime_type text,file_size bigint,notes text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(owner_id,document_number));
create index if not exists documents_owner_idx on public.documents(owner_id);
create index if not exists documents_client_idx on public.documents(owner_id,client_id);
create index if not exists documents_date_idx on public.documents(owner_id,document_date desc);
alter table public.documents enable row level security;
drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own" on public.documents for select to authenticated using(owner_id=auth.uid());
drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own" on public.documents for insert to authenticated with check(owner_id=auth.uid());
drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own" on public.documents for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own" on public.documents for delete to authenticated using(owner_id=auth.uid());
drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at before update on public.documents for each row execute function public.set_updated_at();

-- Files stay private. Storage path: <user UUID>/<document UUID>/<filename>.
drop policy if exists "business_documents_select_own" on storage.objects;
create policy "business_documents_select_own" on storage.objects for select to authenticated using(bucket_id='business-documents' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "business_documents_insert_own" on storage.objects;
create policy "business_documents_insert_own" on storage.objects for insert to authenticated with check(bucket_id='business-documents' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "business_documents_update_own" on storage.objects;
create policy "business_documents_update_own" on storage.objects for update to authenticated using(bucket_id='business-documents' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='business-documents' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "business_documents_delete_own" on storage.objects;
create policy "business_documents_delete_own" on storage.objects for delete to authenticated using(bucket_id='business-documents' and (storage.foldername(name))[1]=auth.uid()::text);
