# Right Choice Auto Repair & Car Sales — Hostable Platform

Production-oriented two-app website for Right Choice Auto Repair & Car Sales.

## Applications

- `public-site/` — public customer website for `rightchoiceauto.ca`
- `admin-site/` — separate private content/inventory manager for `admin.rightchoiceauto.ca`
- `database/schema.sql` — Supabase/PostgreSQL schema, RLS policies and storage policies
- `HOSTING.md` — deployment instructions
- `docker-compose.yml` — optional self-hosting setup

## What the public site includes

- Home page
- Separate Cars for Sale inventory page
- Individual vehicle pages
- Auto Repair page
- About page
- Contact page
- Live promotions
- Live business info/hours
- Responsive layout
- Click-to-call and directions
- No public admin link

## What the admin app includes

- Private email/password sign-in
- Extra database-level admin authorization
- Add/edit/delete vehicles
- Publish/unpublish vehicles
- Available/Pending/Sold statuses
- Multi-photo upload
- Promotions manager
- Repair services manager
- Website info/content manager
- Search-engine noindex headers

## Database/security

The public app uses only the Supabase publishable key and RLS-limited reads. The admin app also uses the publishable key; write permissions are granted only when the authenticated Supabase user exists in `public.admin_users`.

Never add a Supabase service-role secret to either frontend project.

## Fastest deployment

See `HOSTING.md`. The recommended setup is two Vercel projects plus one Supabase project.
