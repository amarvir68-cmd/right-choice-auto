# Right Choice Auto — v14 combined upgrade

This is one ZIP containing BOTH the public and admin Next.js projects. It is a **candidate release**, not an independently verified production deployment.

## Included in code

- Public inventory: keyword/make/status filters; maximum price, minimum year, maximum mileage; sorting; 2–3 vehicle comparison.
- Vehicle detail: primary gallery with thumbnails, fullscreen view and keyboard arrows; local-browser favourites; native share/copy-link fallback; vehicle inquiry form.
- New Saved Vehicles page. Favourites stay in local browser storage, not server accounts.
- Sticky mobile Call button; existing contact directions and configurable business hours remain.
- Admin inventory: search, status/draft filters, copy listing as unpublished draft (without duplicating photo records), bulk status changes, CSV export and public listing preview.
- Images above 1.5 MB are optionally resized to a maximum 1800 px and converted to JPEG when smaller; type/8 MB validation remains. Image upload errors alert the admin.
- Admin inquiries: view recent 200, mark New/Contacted/Closed, email and click-to-call links.
- Optional Google Reviews link field in Website Info and homepage link. No Google API integration, ratings or review text are invented.
- Privacy-conscious directions-click analytics; existing view/call/social tracking retained.
- New Supabase migration creates a private, RLS-protected inquiry table and extends analytics events.

## Required deployment sequence

1. Back up your current Supabase database and storage externally before applying a migration or changing production code.
2. In Supabase SQL Editor, run `database/2026-09-19-v14-inquiries.sql` ONCE. Read and confirm each statement before executing.
3. Copy the updated `public-site` and `admin-site` directories to their respective GitHub/Vercel projects (do not swap project root directories).
4. Preserve your existing Supabase environment variables. For the admin project, add `NEXT_PUBLIC_PUBLIC_SITE_URL=https://YOUR_PUBLIC_SITE_DOMAIN` so Preview opens your real public site.
5. Optionally paste a **real** Google Business Profile reviews URL into Admin > Website Info > Google Reviews URL. Do not put made-up reviews on the website.
6. Deploy **both** projects and test mobile, inventory, admin access, uploads, inquiry submissions and status changes. Avoid placing the inquiry form into heavy public use until anti-spam protection is configured.

## Critical limitations — NOT complete / NOT independently verified

- Full production build and browser end-to-end tests could not run here because package installation in the isolated environment failed (npm dependency cache missing). JSX syntactic parsing was performed, but production functionality is not verified.
- CAPTCHA and server-side inquiry rate limiting are **not implemented**. The honeypot alone is insufficient. Set up a protected server/Edge Function with CAPTCHA and rate limits before full public launch. Do not assume this is spam-safe.
- No automated email notifications or delivery integrations; submitted inquiries appear in the private Admin Inquiries tab only.
- No real Google review feed or API integration; the code adds only an authentic-profile link when configured.
- No automatic database backups, tested disaster recovery, remote error monitoring, automated end-to-end tests, or completed live SEO/accessibility/security/performance audit. These require access/configuration of your Vercel, Supabase and deployed domains, plus real browser tests.
- Admin bulk actions and photo workflow should be tested against a staging Supabase project first.
- Vehicle gallery uses normal HTML images; dedicated Next Image transformation/CDN tuning remains to be benchmarked against the deployed service.
- No online service booking or financing pages were added.

## Tests

Run `node scripts/check-v14.mjs` for local source sanity checks. For a real build, install the dependencies in `public-site` and `admin-site` separately and run `npm run build` in each. Then manually exercise the workflows in a staging deployment.
