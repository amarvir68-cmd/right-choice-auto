# v27 File-by-File Change Report

Baseline: v26 project package (including the v25 visual admin dashboard and public mobile-menu/featured-vehicle fixes).

## Public site

- `public-site/app/api/inquiries/route.js` — server-only Supabase write path, rate limiting, tighter request/origin validation, hardened Turnstile verification, safe errors.
- `public-site/lib/rate-limit.js` — new Upstash REST distributed limiter with conservative per-instance fallback.
- `public-site/app/api/analytics/route.js` — new protected analytics ingestion endpoint.
- `public-site/app/AnalyticsTracker.js` — sends anonymous analytics to the same-origin API instead of writing directly to Supabase from the browser.
- `public-site/app/api/health/route.js` — new minimal uptime/database-health endpoint without database details.
- `public-site/next.config.mjs` — CSP, HSTS, frame protection, content sniffing protection, permissions restrictions, COOP, compression.
- `public-site/app/privacy/page.js` — clearer privacy/data-use information and customer request guidance.
- `public-site/app/sitemap.js` — adds the privacy page.
- `public-site/app/globals.css` — privacy-page readability styles; all v26 customer layout rules retained.
- `public-site/.env.example` — documents public and server-only environment variables.

## Admin

- `admin-site/app/page.js` — optional MFA enforcement, 30-minute default idle logout, generic login errors, stricter photo validation, audit-log hooks and Audit Log UI.
- `admin-site/app/admin.css` — Audit Log responsive presentation.
- `admin-site/next.config.mjs` — admin CSP and hardened security headers.
- `admin-site/.env.example` — MFA/idle-session and public-site URL configuration.

## Database

- `database/2026-10-10-v27-security-hardening.sql` — staged migration to remove direct anonymous inquiry/repair/analytics writes and create the protected administrator audit log.

## Repository / operations

- `.gitignore` — excludes dependencies, builds, logs and real environment files.
- `.github/dependabot.yml` — weekly dependency update checks for both Next.js apps.
- `.github/workflows/ci.yml` — builds and high-severity npm audit checks on pushes/PRs.
- `.github/workflows/codeql.yml` — scheduled and PR JavaScript/TypeScript CodeQL scanning.
- `SECURITY.md` — repository security policy and secret-handling rules.
- `V27-SECURITY-DEPLOYMENT.md` — required production configuration and safe rollout order.
- `scripts/check-v27.mjs` — static wiring/security regression checks.
- `verify-upgrade.sh` — updates the legacy analytics assertion to the protected analytics endpoint.
- `changelogs/V27-PRODUCTION-HARDENING.md` — v27 release notes.

## Not changed

The v26 compact homepage featured-vehicle layout, v24/v25 lead management UI, working inquiry/repair form components, existing public mobile navigation, vehicle-detail gallery, and existing Supabase data are preserved.
