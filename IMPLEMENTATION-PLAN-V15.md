# Right Choice Auto — v15 implementation plan and handoff

## Delivered in this package (source changes, not deployed)

1. **Inquiry validation:** Vehicle inquiries now POST to `/api/inquiries` rather than writing directly from the browser. Server validates lengths, type, email, consent, vehicle UUID, honeypot, content length (when supplied), and same-origin requests (when Origin is supplied). Public Supabase credentials and the existing RLS policy are used; the service-role key is **not** exposed. A configured Cloudflare Turnstile *secret* is checked, but the frontend does not yet render a Turnstile widget: do not configure `TURNSTILE_SECRET_KEY` until completing the frontend integration.
2. **Analytics:** Both the general Supabase client and analytics tracker accept the publishable or legacy anon key.
3. **Inventory:** Minimum price, maximum year, transmission and drivetrain filters; clear filters also resets these. Existing search, status, comparison, sorting, and filters are preserved.
4. **Gallery:** Modal keyboard Tab wrapping, initial focus on close button, focus restoration, lazy-loaded thumbnails, asynchronous image decoding, and high-priority primary image. Existing swipe behavior and arrows are unchanged.
5. **Repair requests:** New customer form under `/repairs`, server API, private database table with admin-only read/update RLS, and dashboard Repair Requests tab with status controls. These are *requests*, not confirmed appointments; customers must be contacted manually.
6. **Styling:** Improved card treatment, visible keyboard focus, typography, responsive repair form, reduced-motion support, and smaller-screen spacing. Core brand colours and existing layout preserved.

## Deployment order — required

- Back up Supabase and the deployed v14 apps; deploy to staging first.
- Confirm v14 inquiry migration (`database/2026-09-19-v14-inquiries.sql`) has run; then run `database/2026-09-19-upgrade-repair-requests.sql` in Supabase SQL editor. Confirm `public.is_admin()` exists from the base schema. Check RLS explicitly by attempting an anonymous SELECT (must be denied), an anonymous INSERT (must succeed with valid data), and authenticated administrator SELECT and UPDATE (must succeed).
- Set `NEXT_PUBLIC_SUPABASE_URL`, either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` on the public app. Set admin app env vars as documented in its `.env.example`. Never put the service-role secret in any `NEXT_PUBLIC_` variable.
- Install packages and run `npm run build` independently in `public-site` and `admin-site`; no npm dependencies were bundled. This package has NOT passed a complete Next.js build in the editing environment.
- Complete distributed rate limiting in a WAF/API gateway or shared durable store. The server endpoint **does not include a distributed rate limiter**, so it is not sufficient as sole anti-spam protection. Optional Turnstile backend verification is implemented, but frontend token generation/widget is pending. Do not set `TURNSTILE_SECRET_KEY` until the widget has been integrated and tested.
- Verify real customer notifications or manually check dashboard frequently. No email/SMS is sent automatically by this package. Configure approved email provider and secure backend notification delivery before advertising instant replies.
- Verify site URL, domain, sitemap, robots, metadata, performance and structured data in the live deployment. SEO metadata already existed in v14; this upgrade does not guarantee rankings.

## Manual workflow verification checklist

- [ ] Run `npm install && npm run build` in BOTH apps.
- [ ] Vehicle inquiry: bad email, missing consent, invalid UUID, and long text rejected; valid request stored, readable to admin only.
- [ ] Anonymous GET/SELECT against vehicle_inquiries and repair_requests denied under RLS.
- [ ] Repair request: valid form stored; status changes `new → contacted → confirmed → closed`; no appointment is automatically confirmed.
- [ ] Multiple rapid submissions blocked by deployment-layer rate limiter; security challenge works when configured.
- [ ] Verify analytics with publishable and anon keys; monitor insert errors and validate events in admin.
- [ ] Desktop/mobile 320px, 375px, 768px, 1440px: homepage, inventory, detail, gallery and repairs form; inspect wrapping and horizontal scrolling.
- [ ] Inventory combinations, empty-state, clear filters, compare 2–3 vehicles, unavailable photos and null prices.
- [ ] Gallery opens, Tab and Shift+Tab wrap, Esc closes, focus returns, arrows/swipe work, background doesn't scroll.
- [ ] Existing admin login, vehicle CRUD, image upload/order, promotions, settings, analytics, inquiry management.
- [ ] Lighthouse mobile checks, image transfer size, Google Search Console sitemap indexing, URL canonicalization and real-domain metadata.

## Remaining changes by priority

**P0 before production:** Complete builds and full smoke tests; apply SQL; deploy WAF/shared rate limiting; implement frontend Turnstile if enabling its server-side option; secure notification provider if immediate staff alerts are required; verify admin identity/permissions and backups.

**P1 product:** Add admin lead ownership, notes, follow-up due dates and audit trail through a new RLS-protected migration; send transactional alerts from a server-side service using secret credentials; add search filters to URL; improve client-side query error displays; verify galleries with assistive technology and touch devices; add test fixtures and automated end-to-end flows.

**P2 visual and growth:** Perform a brand-approved homepage redesign using actual dealership photos, improve vehicle spec/inspection disclosures, review genuine testimonials, optimize actual image assets and responsive image sizes (Next Image requires domain configuration), test Core Web Vitals and schema against deployed pages. These items are planned, NOT implemented in this release.

## Rollback

Retain the v14 ZIP and database backup. Redeploy v14 applications if regression is detected. Keep the new repair_requests table during a rollback unless the business has archived its customer requests; dropping it deletes customer data. Do not roll back the pre-existing v14 inquiry migration blindly.
