-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  barber_id text not null check (barber_id in ('dylan', 'mitch')),
  service_id text not null check (service_id in ('haircut', 'lineup', 'hair-and-beard')),
  service_name text not null,
  service_price integer not null,
  service_duration_minutes integer not null,
  booking_date date not null,
  booking_time text not null,
  customer_name text not null,
  customer_phone text not null
);

alter table public.bookings enable row level security;

-- Customers (using the anon key from the browser) can create bookings but
-- cannot read them back -- there is deliberately no select policy for anon.
create policy "Public can create bookings"
  on public.bookings for insert
  to anon
  with check (true);
