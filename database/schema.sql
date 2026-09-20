-- Right Choice Auto Repair & Car Sales
-- Run this in Supabase SQL Editor once.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  year integer not null check (year between 1900 and 2100),
  make text not null,
  model text not null,
  trim text,
  price numeric(12,2) check (price is null or price >= 0),
  mileage integer check (mileage is null or mileage >= 0),
  vin text,
  transmission text,
  drivetrain text,
  fuel_type text,
  exterior_color text,
  interior_color text,
  description text,
  status text not null default 'available' check (status in ('available','pending','sold')),
  featured boolean not null default false,
  published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  image_url text not null,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text,
  starts_at timestamptz,
  ends_at timestamptz,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()) $$;

alter table public.admin_users enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.promotions enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;

-- Public website: read-only access to published content.
create policy "public read published vehicles" on public.vehicles for select to anon, authenticated using (published = true and status in ('available','pending'));
create policy "public read images of published vehicles" on public.vehicle_images for select to anon, authenticated using (exists(select 1 from public.vehicles v where v.id=vehicle_id and v.published=true and v.status in ('available','pending')));
create policy "public read promotions" on public.promotions for select to anon, authenticated using (published=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()));
create policy "public read services" on public.services for select to anon, authenticated using (published=true);
create policy "public read site settings" on public.site_settings for select to anon, authenticated using (true);

-- Admin app: authenticated users must also exist in admin_users.
create policy "admins read admin list" on public.admin_users for select to authenticated using (public.is_admin());
create policy "admins full vehicles" on public.vehicles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins full images" on public.vehicle_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins full promotions" on public.promotions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins full services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins full settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for public vehicle photos. Upload/delete still requires admin role via policies below.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('vehicle-images','vehicle-images',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=8388608,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create policy "admins upload vehicle images" on storage.objects for insert to authenticated with check (bucket_id='vehicle-images' and public.is_admin());
create policy "admins update vehicle images" on storage.objects for update to authenticated using (bucket_id='vehicle-images' and public.is_admin()) with check (bucket_id='vehicle-images' and public.is_admin());
create policy "admins delete vehicle images" on storage.objects for delete to authenticated using (bucket_id='vehicle-images' and public.is_admin());

insert into public.site_settings(key,value) values
 ('phone','204-632-4296'),
 ('address','1129 Fife Street, Winnipeg, MB R2X 2N1'),
 ('hours',''),
 ('home_intro','Quality cars. Reliable repairs. Straightforward service from a local Winnipeg shop.'),
 ('about_short','Right Choice Auto Repair & Car Sales serves Winnipeg drivers from 1129 Fife Street.'),
 ('about_full','We help Winnipeg drivers with practical auto repairs and used vehicle sales. Our goal is a straightforward experience from the first call to the final handoff.'),
 ('facebook_url',''),
 ('instagram_url',''),
 ('tiktok_url','')
on conflict (key) do nothing;

insert into public.services(name,description,sort_order) values
 ('Oil Changes','Routine oil and filter service to help protect your engine.',10),
 ('Brake Service','Brake inspections, pads, rotors and related repairs.',20),
 ('Engine Diagnostics','Warning lights, drivability issues and mechanical troubleshooting.',30),
 ('Suspension & Steering','Repairs for ride quality, handling and steering concerns.',40),
 ('Tires & Wheels','Tire-related service, wheel concerns and seasonal help.',50),
 ('General Repairs','Everyday maintenance and practical repair solutions.',60)
on conflict do nothing;


-- Analytics (v8)
-- Right Choice Auto v8: privacy-conscious analytics
create table if not exists public.analytics_events (
  id bigint generated by default as identity primary key,
  event_name text not null check (event_name in ('page_view','vehicle_view','call_click','facebook_click','instagram_click','tiktok_click')),
  page_path text not null default '/',
  vehicle_id uuid null references public.vehicles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "public insert anonymous analytics" on public.analytics_events;
create policy "public insert anonymous analytics"
on public.analytics_events for insert to anon, authenticated
with check (
  event_name in ('page_view','vehicle_view','call_click','facebook_click','instagram_click','tiktok_click')
  and length(page_path) <= 300
);

drop policy if exists "admins read analytics" on public.analytics_events;
create policy "admins read analytics"
on public.analytics_events for select to authenticated
using (public.is_admin());

create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_vehicle_id_idx on public.analytics_events(vehicle_id);
