-- KASITU Webs Sales Partner Commission Tracking
-- Run this migration in Supabase SQL Editor on the KASITU Business Manager project.
-- Safe to rerun: all columns are added only when missing.
-- This migration adds an audit trail; it does not mark any commission as approved or paid.

alter table public.sales_partner_leads
  add column if not exists commission_approved_at timestamptz,
  add column if not exists commission_approved_by uuid references auth.users(id),
  add column if not exists commission_paid_at timestamptz,
  add column if not exists commission_paid_by uuid references auth.users(id),
  add column if not exists commission_payment_reference text,
  add column if not exists commission_payment_method text;

comment on column public.sales_partner_leads.commission_approved_at
  is 'Timestamp when the business owner approved this commission.';
comment on column public.sales_partner_leads.commission_approved_by
  is 'Auth user ID of the business owner who approved this commission.';
comment on column public.sales_partner_leads.commission_paid_at
  is 'Timestamp when the commission was actually paid.';
comment on column public.sales_partner_leads.commission_paid_by
  is 'Auth user ID of the business owner who recorded the payment.';
comment on column public.sales_partner_leads.commission_payment_reference
  is 'Optional EFT or payment reference entered when marking the commission paid.';
comment on column public.sales_partner_leads.commission_payment_method
  is 'Payment method used for the salesperson commission, for example EFT.';