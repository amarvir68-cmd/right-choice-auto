-- v14: customer vehicle inquiries. Run in the Supabase SQL editor BEFORE deploying v14.
-- Anonymous users can submit inquiries, but ONLY approved admins can read/update/delete them.
create table if not exists public.vehicle_inquiries (
 id uuid primary key default gen_random_uuid(),
 vehicle_id uuid references public.vehicles(id) on delete set null,
 name text not null check (length(trim(name)) between 1 and 100),
 email text not null check (length(trim(email)) between 3 and 180),
 phone text check (phone is null or length(phone)<=35),
 message text not null check (length(trim(message)) between 10 and 2000),
 consent boolean not null check(consent=true),
 status text not null default 'new' check(status in ('new','contacted','closed')),
 created_at timestamptz not null default now()
);
alter table public.vehicle_inquiries enable row level security;
drop policy if exists "public submit vehicle inquiries" on public.vehicle_inquiries;
create policy "public submit vehicle inquiries" on public.vehicle_inquiries for insert to anon,authenticated with check(status='new' and consent=true and (vehicle_id is null or exists(select 1 from public.vehicles v where v.id=vehicle_id and v.published=true and v.status in ('available','pending'))));
drop policy if exists "admins manage vehicle inquiries" on public.vehicle_inquiries;
create policy "admins manage vehicle inquiries" on public.vehicle_inquiries for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index if not exists vehicle_inquiries_created_at_idx on public.vehicle_inquiries(created_at desc);
-- Important: Enable Supabase CAPTCHA / edge-function rate limiting before accepting substantial public traffic.
-- The honeypot in the UI alone is NOT a sufficient anti-spam or abuse control.

-- Opt-in reviews link setting. Add the real URL in Admin → Website Info.
insert into public.site_settings(key,value) values ('google_reviews_url','') on conflict(key) do nothing;
-- Extend analytics event validation to include directions clicks. Preserve previous permitted events.
alter table public.analytics_events drop constraint if exists analytics_events_event_name_check;
alter table public.analytics_events add constraint analytics_events_event_name_check check(event_name in ('page_view','vehicle_view','call_click','facebook_click','instagram_click','tiktok_click','directions_click'));
drop policy if exists "public insert anonymous analytics" on public.analytics_events;
create policy "public insert anonymous analytics" on public.analytics_events for insert to anon,authenticated with check(event_name in ('page_view','vehicle_view','call_click','facebook_click','instagram_click','tiktok_click','directions_click') and length(page_path)<=300);
