# v23 — Interactive admin dashboard (2026-09-20)

Based on the uploaded v22 project with consolidated changelogs. This release changes only the admin UI and its static-check scripts; public-site and database files are preserved.

## Actual source changes
- `admin-site/app/page.js`: dashboard opens on Overview; responsive navigation with keyboard-accessible menu; overview KPI cards query existing vehicles, vehicle_inquiries, and repair_requests tables and link to relevant admin screens. Counts are real records (up to 200 leads per table, not all-time totals); unavailable queries show a dash and a warning. No customer names, emails or messages are read by the overview queries.
- `admin-site/app/page.js`: inquiry search, status-count quick filters, refresh, and accurate filtered empty state; repair-request quick status filters, refreshed empty state. Status updates continue to use the existing Supabase methods.
- `admin-site/app/admin.css`: visual dashboard, sidebar, KPI tiles, responsive mobile menu, focus states and reduced-motion styles.
- `scripts/check-v21.mjs`: updates the expected inquiry empty-state string after improving it.
- `scripts/check-v23.mjs`: new 12-point static check.

## Deploy
1. Back up the working production deployment. Upload `admin-site/app/page.js` and `admin-site/app/admin.css` at their exact repository paths. The public site and database require no changes for this release.
2. Confirm the admin Vercel project builds the new Git commit (root directory `admin-site`). Deploy a preview before production.
3. Sign in using your own authorized administrator account. Verify overview totals, inventory, search, each inquiry and repair status change with refresh, edit vehicle, service and website settings, mobile menu, and sign out.
4. Confirm Supabase RLS policies and MFA settings separately. These UI updates do not resolve the earlier direct-public-insert, rate-limiting, or privacy-policy security audit findings.

## Verification limits
Static wiring checks and archive integrity can be run offline. The environment has no installed Next.js dependencies (`next: not found`), so production build, browser interaction, authenticated Supabase queries, security penetration testing and live deployment have NOT been completed. This is a preview release, not a security-certified release.
