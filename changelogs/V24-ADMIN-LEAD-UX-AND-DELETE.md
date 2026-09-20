# V24 — Admin lead management, consistency and visual polish

Baseline: V23 archive supplied in this conversation. **Admin-only source changes**; the customer app and existing booking/inquiry submission endpoints were not changed.

## Root causes fixed
- V23's Vehicle Inquiries and Repair Requests components were separately written. Refresh was embedded in the Vehicle Inquiries search row but placed below the repair pipeline on Repair Requests. A **shared LeadToolbar** now puts Refresh in the upper-right of both page headings, with the same search/status controls and status-summary buttons below.
- Neither screen rendered a delete action. A reusable **DeleteLeadButton** now offers per-record deletion on both pages. It requires a second explicit confirmation, supports Cancel, prevents duplicate submissions while busy, checks the returned database row, and only removes the card from the UI after confirmed deletion. This is **permanent deletion, not an archive**; do not delete legitimate leads while still needed for business or legal retention requirements.
- Both lists now share layouts for status pills, customer details, action rows and informative empty/error states. Repair requests still explicitly distinguish preferred dates from confirmed appointments.
- Updates now confirm a changed row was returned before reporting success and update local display immediately. User-facing database errors remain visible.

## Files changed
- `admin-site/app/page.js` — shared lead toolbar, both lead views, delete controls, state/error feedback.
- `admin-site/app/admin.css` — consistent visual hierarchy, lead cards, mobile controls, delete confirmation styling.
- `scripts/check-v24.mjs` — regression checks; `scripts/check-v23.mjs`, `scripts/check-v21.mjs`, `verify-upgrade.sh` updated only to recognize refactored equivalent code rather than require obsolete markup.
- `database/2026-09-20-v24-optional-delete-grant.sql` — **optional, NOT auto-applied**; see below.

## Supabase permissions
Migrations already declare RLS and administrator-only `FOR ALL` policies on both lead tables. Admin deletion needs both database `DELETE` privilege and a passing admin RLS policy. **Do not grant anonymous deletion and never put service-role keys in the browser.** If deletion reports a permissions error, first verify this is the correct Supabase project and inspect the current grants and policies. Review the optional SQL file with your database administrator and apply only if the `authenticated` role lacks DELETE grants. It does not disable RLS.

## Validation and release gate
- Static checks (`check-v24`, `check-v23`, `check-v21`, `verify-upgrade`) passed in the preparation environment after adapting older checks to the shared components.
- JSX syntax parse: checked locally using TypeScript parser.
- Production Next.js build: cannot pass here without installed Next.js dependencies; must be run on Vercel preview or a local dependency-installed environment.
- Live authenticated Supabase permission checks, real browser/mobile testing, and deletion outcome have **not** been performed. Do not delete real customer records as a test. Create clearly marked dummy inquiries and repair requests you control, verify admin status changes and delete only those dummy records.

## Deployment
Commit `admin-site/app/page.js` and `admin-site/app/admin.css` together to GitHub. No customer deployment is needed. Deploy to preview; test permissions and responsive layout before production. Other files are documentation/tests only. Roll back to previous Vercel deployment if the preview reveals an issue. The customer site and database are not changed by this ZIP alone.
