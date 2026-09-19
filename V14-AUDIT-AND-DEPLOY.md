# Right Choice Auto — v14 audit fix and deployment checklist

## Verified through public web retrieval on 2026-09-19
- https://right-choice-auto-one.vercel.app/ returned homepage content, with a featured vehicle and repair services.
- /cars, /repairs, and /contact could not be retrieved by the available external inspector; this is **not evidence these pages are broken**.
- The admin root responded with only a Loading… shell; authenticated actions could not be inspected.
- The homepage still showed older introductory text, but the Home source reads the editable `site_settings.home_intro`, so this may be saved admin content rather than outdated code. Update it in Admin > Website Info if desired.

## Changes in this package
- Includes the preceding v14 listing-photo gallery fix.
- Public and admin Supabase clients accept either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This fixes a configuration mismatch with prior setup advice; define just one key consistently for each project. Never supply a service-role or secret key to these variables.
- Inventory search tolerates vehicles with missing make/model and sorting tolerates missing created_at.
- This document distinguishes tested behavior from missing live verification.

## Not independently verified; do not sign off yet
- Interactive inventory filtering, favourites, comparison, image gallery, inquiry submission, and mobile layout in a real browser.
- Admin authentication, editing, photo upload, inquiry inbox, and bulk actions.
- RLS and unauthorized-user access tests with actual staging Supabase database.
- Production build, anti-spam/rate limiting, recovery testing, error monitoring, authentic review feed, performance/accessibility audits.

## Rollout
1. Back up Supabase database and storage. Do not replace production project credentials merely to deploy these frontend changes.
2. Ensure new v14 migration is applied only once where appropriate; this fix adds no further SQL.
3. Upload contents of `public-site/` and `admin-site/` to the correct project roots and redeploy each.
4. Check Vercel build log, then open homepage, /cars, /repairs, /contact and a vehicle detail page in an incognito browser.
5. Test a multi-photo car: opening full-screen, arrows, thumbnails, Escape, and View Details separately.
6. Test authenticated admin account on staging; verify inquiries and confirm anonymous users cannot read or change protected tables.
7. Configure server-side inquiry spam protection and rate limiting before broad public use.

## Exact changed source files beyond the gallery-fix package
- `public-site/lib/supabase.js`
- `admin-site/lib/supabase.js`
- `public-site/app/VehicleInquiry.js`
- `public-site/app/InventoryBrowser.js`
