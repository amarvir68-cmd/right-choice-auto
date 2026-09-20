-- Apply AFTER schema.sql and v14 inquiries migration; run in Supabase SQL editor.
create table if not exists public.repair_requests (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 100),
 email text not null check(length(trim(email)) between 3 and 180),
 phone text check(phone is null or length(phone)<=35),
 service text not null check(length(trim(service)) between 1 and 100),
 vehicle text check(vehicle is null or length(vehicle)<=120),
 preferred_date date,
 message text not null check(length(trim(message)) between 10 and 2000),
 consent boolean not null check(consent=true),
 status text not null default 'new' check(status in ('new','contacted','confirmed','closed')),
 created_at timestamptz not null default now()
);
alter table public.repair_requests enable row level security;
revoke all on public.repair_requests from public;
grant insert on public.repair_requests to anon;
grant select,insert,update,delete on public.repair_requests to authenticated;
drop policy if exists "public submit repair requests" on public.repair_requests;
create policy "public submit repair requests" on public.repair_requests for insert to anon,authenticated with check(status='new' and consent=true);
drop policy if exists "admins manage repair requests" on public.repair_requests;
create policy "admins manage repair requests" on public.repair_requests for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index if not exists repair_requests_created_at_idx on public.repair_requests(created_at desc);
-- Add a distributed edge/WAF rate limit and optionally Turnstile before high-volume production launch.
