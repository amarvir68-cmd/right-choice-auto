# v27 — Production Hardening & Platform Polish

## Public site
- Lead submissions now prefer a server-only Supabase service-role credential.
- Added distributed Upstash-compatible rate-limit support with conservative local fallback.
- Hardened inquiry request validation, origin checks, payload limits and Turnstile verification.
- Routed analytics events through a protected server endpoint instead of direct browser database writes.
- Added a minimal health endpoint for uptime monitoring.
- Added Content Security Policy and additional browser security headers.
- Added privacy link, updated privacy information and added Privacy to sitemap.
- Preserved v26 compact featured-vehicle homepage layout and working mobile navigation.

## Admin
- Added optional MFA enforcement switch (activate only after TOTP enrollment).
- Added inactivity logout.
- Generic login errors avoid exposing authentication details.
- Strengthened vehicle image validation: type, size, dimensions and per-vehicle count.
- Added audit logging hooks for important vehicle/lead actions.
- Added Audit Log navigation/view.
- Preserved v25 visual dashboard and v24 lead-management/delete functionality.

## Database / operations
- Added staged security migration that removes direct anonymous lead/analytics writes.
- Added `admin_audit_logs` with RLS.
- Added `.env.example` files, `.gitignore`, Security Policy, Dependabot, CodeQL and CI workflows.
- Added production deployment/security runbook.

## Controls requiring production configuration
- Supabase service-role secret
- Turnstile site/secret keys and enforcement switch
- Upstash distributed rate limiter
- Vercel firewall rules
- Supabase administrator MFA enrollment
- database backup/PITR and restore test
- live penetration/security testing
