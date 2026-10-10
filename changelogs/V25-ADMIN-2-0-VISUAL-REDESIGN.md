# v25 — Admin 2.0 visual command centre

## Baseline
User-uploaded `right-choice-auto-main(1).zip` (v24 with public mobile-menu fix). Public-site source is unchanged. No database migration.

## Source changes
- `admin-site/app/page.js`: action centre using *existing* Supabase KPI data (new sales leads, new repair requests, available vehicles), compact inventory breakdown, accessible task shortcuts, loading skeleton and navigation context. These panels show no customer names, email addresses or phone numbers. Existing login, inventory editing, inquiry and repair status updates, deletion and management logic preserved.
- `admin-site/app/admin.css`: coherent dark surfaces, sidebar active state, hover/focus styling, KPI tile styling, responsive overview panels, inventory chart and reduced-motion support.
- `changelogs/V25-ADMIN-2-0-VISUAL-REDESIGN.md`: this report.

## Important limitations
This is a substantial dashboard visual/layout upgrade, NOT an all-new backend, drag-and-drop lead pipeline, calendar scheduling, AI service or penetration test. The inventory ring shows counts from existing records. This archive has not been deployed.

## Verification and release checklist
1. Build each application from its own folder (`npm ci` if lockfile exists, otherwise `npm install`; `npm run build`).
2. Deploy admin to a preview first. Verify login and admin authorization, overview metrics, inquiry/repair refresh, statuses and deletes using test records.
3. Test 320/375/768/1024/1440px screens, 200% zoom and keyboard focus; ensure sidebar and action buttons work.
4. Confirm live Supabase RLS and administrator permissions independently; source styling is not a security audit.
5. Promote admin preview only after checks. No public-site deployment needed.
