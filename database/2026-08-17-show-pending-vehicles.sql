-- Run this ONCE in Supabase SQL Editor for an existing Right Choice Auto database.
-- It makes published pending vehicles (and their photos) readable on the public site.

drop policy if exists "public read published vehicles" on public.vehicles;
create policy "public read published vehicles"
on public.vehicles for select to anon, authenticated
using (published = true and status in ('available','pending'));

drop policy if exists "public read images of published vehicles" on public.vehicle_images;
create policy "public read images of published vehicles"
on public.vehicle_images for select to anon, authenticated
using (exists (
  select 1 from public.vehicles v
  where v.id = vehicle_id
    and v.published = true
    and v.status in ('available','pending')
));
