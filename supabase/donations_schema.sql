-- Donation records storage for the public PayPal donation flow.
-- Run this in the same Supabase project used by the learning/admin app.

create table if not exists public.website_donations (
  id bigint generated always as identity primary key,
  order_id text not null unique,
  capture_id text unique,
  provider text not null default 'paypal',
  fund_type text not null check (fund_type in ('donation', 'sangetsu')),
  status text not null default 'created' check (status in ('created', 'completed', 'cancelled', 'error')),
  donor_name text,
  donor_email text,
  paypal_payer_email text,
  payer_id text,
  center_id text,
  center_name text,
  donation_type text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  provider_invoice_id text,
  paypal_status text,
  source text not null default 'website_donate_page',
  custom_id text,
  order_payload jsonb,
  capture_payload jsonb,
  recorded_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists website_donations_recorded_at_idx on public.website_donations (recorded_at desc);
create index if not exists website_donations_completed_at_idx on public.website_donations (completed_at desc);
create index if not exists website_donations_center_id_idx on public.website_donations (center_id);
create index if not exists website_donations_status_idx on public.website_donations (status);
create index if not exists website_donations_fund_type_idx on public.website_donations (fund_type);

alter table public.website_donations enable row level security;

grant select on public.website_donations to authenticated;

drop policy if exists website_donations_admin_select on public.website_donations;
create policy website_donations_admin_select
  on public.website_donations
  for select
  to authenticated
  using (
    public.learning_is_super_admin()
    or public.learning_can_manage_center(website_donations.center_id)
  );
