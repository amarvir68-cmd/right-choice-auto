# Hosting Right Choice Auto

## Recommended production layout

- Public website: `https://rightchoiceauto.ca`
- Private admin: `https://admin.rightchoiceauto.ca`
- Database/Auth/Storage: Supabase
- Hosting: two separate Vercel projects, each pointed at one folder in this repository.

## 1. Create Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `database/schema.sql` once.
3. In Authentication, create the first staff user using email/password.
4. Copy that user's UUID from Authentication > Users.
5. In SQL Editor run:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE-AUTH-USER-UUID-HERE', 'Owner');
```

6. Copy the Project URL and Publishable key from Supabase project settings.

## 2. Deploy the public site on Vercel

Create a Vercel project from this repository and set **Root Directory** to `public-site`.
Add these environment variables for Production, Preview and Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Deploy, then attach `rightchoiceauto.ca` and optionally `www.rightchoiceauto.ca`.

## 3. Deploy the private admin on Vercel

Create a second Vercel project from the same repository and set **Root Directory** to `admin-site`.
Add the same two environment variables.
Deploy, then attach `admin.rightchoiceauto.ca`.

Do not put a link to this admin domain on the public site.

## 4. Domain DNS

Follow the DNS records Vercel gives you for the apex domain and `admin` subdomain. DNS values vary by setup, so use the records shown in your Vercel project rather than copying old examples.

## 5. Local test

Each app is independent:

```bash
cd public-site
cp .env.example .env.local
# fill in Supabase values
npm install
npm run dev
```

Admin:

```bash
cd admin-site
cp .env.example .env.local
# fill in the same Supabase values
npm install
npm run dev -- -p 3001
```

## 6. Docker/self-hosting alternative

Copy `.env.example` to `.env`, fill in the values, then:

```bash
docker compose up --build -d
```

Public will listen on port 3000 and admin on 3001. Put a TLS reverse proxy such as Caddy, Nginx, or a managed load balancer in front of them before exposing them to the internet.

## Security checklist before launch

- Use a unique strong password for every admin.
- Add only approved user UUIDs to `admin_users`.
- Enable MFA for staff before production use.
- Never put a Supabase service-role secret in either browser application.
- Keep RLS enabled and do not replace the included policies with broad authenticated-user policies.
- Review Supabase Auth logs and remove former staff promptly.
- Keep dependencies updated and redeploy regularly.
- Back up the Supabase database according to the recovery level your business needs.

## Publishing workflow

1. Sign in at `admin.rightchoiceauto.ca`.
2. Add or edit a vehicle.
3. Upload photos.
4. Set status to Available and turn on Published.
5. Public inventory updates automatically.
6. When sold, set status to Sold instead of deleting the vehicle.

Promotions, repair services, phone/address/hours, and About/Home text are also managed in the admin application.
