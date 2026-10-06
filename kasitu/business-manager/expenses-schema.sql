-- KASITU Business Manager — Expenses module
-- Run once in the Supabase SQL Editor for the KASITU Business Manager project.
create table if not exists public.expenses (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 expense_number text not null,
 title text not null,
 category text not null default 'Other',
 amount numeric(12,2) not null check (amount > 0),
 expense_date date not null default current_date,
 payment_method text not null default 'EFT' check (payment_method in ('EFT','Cash','Card','Debit Order','PayPal','Other')),
 vendor text,
 receipt_url text,
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(owner_id, expense_number)
);
create index if not exists expenses_owner_idx on public.expenses(owner_id);
create index if not exists expenses_date_idx on public.expenses(owner_id, expense_date desc);
create index if not exists expenses_category_idx on public.expenses(owner_id, category);
alter table public.expenses enable row level security;
drop policy if exists "expenses_select_own" on public.expenses;
create policy "expenses_select_own" on public.expenses for select to authenticated using (owner_id = auth.uid());
drop policy if exists "expenses_insert_own" on public.expenses;
create policy "expenses_insert_own" on public.expenses for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "expenses_update_own" on public.expenses;
create policy "expenses_update_own" on public.expenses for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "expenses_delete_own" on public.expenses;
create policy "expenses_delete_own" on public.expenses for delete to authenticated using (owner_id = auth.uid());
drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at before update on public.expenses for each row execute function public.set_updated_at();
