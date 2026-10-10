# Right Choice Auto v27 — Production Security & Deployment

This release hardens the existing Next.js + Supabase architecture. It does **not** make the site hack-proof. Production safety still depends on provider configuration, administrator practices, dependency updates, backups, and monitoring.

## Required deployment order

1. Back up the current Supabase database and confirm you can restore it.
2. In the **public-site Vercel project**, add the server-only `SUPABASE_SERVICE_ROLE_KEY`. Never prefix it with `NEXT_PUBLIC_`.
3. If using Turnstile, configure **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Set `REQUIRE_TURNSTILE=true` only after both work in Preview.
4. Configure Upstash Redis REST credentials for distributed form/API rate limiting. Without them, v27 uses a per-instance fallback that is not sufficient for a scaled production deployment.
5. Deploy the public site to Preview and test vehicle inquiries, repair requests, analytics, mobile navigation, and `/api/health`.
6. Deploy the admin site to Preview and test login, CRUD, inquiry/repair status changes, delete actions, image uploads, and the Audit Log page.
7. Apply `database/2026-10-10-v27-security-hardening.sql` **only after** the public forms work using the service-role-backed server endpoint. The migration removes direct anonymous database inserts.
8. Retest both customer forms after the migration.
9. Enroll TOTP MFA for every administrator in Supabase Auth. Then set `NEXT_PUBLIC_REQUIRE_ADMIN_MFA=true` on the admin project and redeploy.
10. Promote tested previews to Production.

## Vercel / edge controls

Add production firewall/rate-limit rules in Vercel for at least:
- `POST /api/inquiries`
- `POST /api/analytics`
- the admin hostname / login traffic

The source-level rate limiter is defense-in-depth; provider-level rate limiting should be the first layer.

## Supabase checks

Verify in production:
- RLS is enabled on `vehicle_inquiries`, `repair_requests`, `admin_users`, `admin_audit_logs`, vehicles, services, promotions, settings and image metadata.
- anonymous users cannot SELECT/UPDATE/DELETE customer inquiry or repair records.
- after the v27 migration, anonymous users cannot INSERT directly into the lead tables.
- only approved authenticated admins satisfy `public.is_admin()`.
- the `vehicle-images` bucket limits MIME types and size, and only admins can upload/update/delete.
- no secrets are stored in `site_settings` because that table is intentionally public-readable.

## Admin security

- Use a separate account for each staff member.
- Enable TOTP MFA for every administrator before enforcing the MFA environment switch.
- v27 signs an authenticated admin out after an inactivity period (default 30 minutes).
- Deleted inquiries are permanent; use retention rules and backups appropriate to your business/legal requirements.
- The audit log stores action metadata, not customer message bodies.

## Secrets

Server-only:
- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `UPSTASH_REDIS_REST_TOKEN`

Public/browser values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Never commit real `.env` files. `.gitignore` now excludes them.

## Backups and recovery

Backups cannot be implemented reliably from application source alone. Configure Supabase backup/PITR options appropriate to your plan and document a restore test. Keep a known-good Git commit and Vercel deployment for rollback.

## Monitoring

The public app includes `GET /api/health`, returning only `{"status":"ok"}` or `{"status":"degraded"}`. It can be monitored by an external uptime service without exposing database details.

Monitor:
- public site availability
- `/api/health`
- elevated 4xx/5xx responses
- failed inquiry submissions
- unusual admin authentication activity
- database/storage usage and errors

## Dependency security

v27 adds Dependabot and GitHub CodeQL configuration plus a CI workflow that runs `npm audit` and both Next.js builds on GitHub. Review security update PRs promptly rather than auto-merging major framework upgrades.
