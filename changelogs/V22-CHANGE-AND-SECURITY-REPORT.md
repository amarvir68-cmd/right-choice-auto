# v22 change and security report

## Actual source changes
- `public-site/app/page.js`: focused hero headline and direct repair booking CTA.
- `public-site/app/globals.css`: consistent responsive homepage, inventory cards, services, header sizing, zoom/reduced-motion and privacy presentation.
- `public-site/app/components.js`: privacy page in footer.
- `public-site/app/privacy/page.js`: new draft privacy disclosure; must be reviewed against actual business practices and applicable law before publication.
- `public-site/app/api/inquiries/route.js`: JSON content-type and body-length enforcement, origin/fetch-metadata checks, optional Turnstile response hostname verification.
- `public-site/app/SpamProtection.js`, `VehicleInquiry.js`, `repairs/RepairRequest.js`: optional Turnstile widget integration, token submission, disable buttons until verified when enabled.

## Security review and remaining risks — do not call penetration tested
- Inquiries use Supabase public/anon credentials with RLS insert policies, and admin read/update permissions use `public.is_admin()` as defined in database migrations. Verify deployed policies and admin membership in your real project; source inspection alone cannot verify them.
- Public API currently has no **distributed rate limiting**. Configure a durable limiter using a managed edge/WAF or shared storage before high public traffic. A per-process JS Map does NOT secure multi-instance Vercel deployments.
- Turnstile must have BOTH `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public app, build time) and `TURNSTILE_SECRET_KEY` (server only) in the *public-site* Vercel project; add allowed hostname(s) in Cloudflare. If only server secret exists, forms cannot complete. If only public key exists, challenges are not enforced by the API. Never commit secrets.
- Confirm API and admin use correct Supabase project, and verify RLS using anonymous and non-admin accounts. Review analytics insert policies/storage upload constraints separately.
- Require MFA for GitHub/Vercel/Supabase administrator accounts; restrict project access; rotate credentials if exposed; enable managed WAF rate limits and alerting.
- Keep dependencies patched. A dependency vulnerability audit and production builds require network/install access not verified here.
- Security headers exist in both `next.config.mjs`; no strict Content Security Policy is introduced because image hosts, Turnstile and Supabase must be enumerated and tested first.
- Privacy text is a draft; establish an actual retention schedule and deletion workflow; do not claim compliance until verified by qualified local counsel.

## Deployment and smoke test
1. Back up deployed commit and Supabase database. Merge changes rather than replacing newer files blindly.
2. Deploy public app preview (correct root: `public-site`); verify homepage, inventory links, gallery, repair booking and inquiry forms.
3. Confirm public-site `NEXT_PUBLIC_SITE_URL` matches actual customer hostname, or omit it when using platform URL. A mismatched URL will cause origin check failures.
4. Configure both Turnstile env vars together; rebuild because NEXT_PUBLIC is embedded into browser bundle; submit test inquiry and booking.
5. Verify admin login, inquiries, repair requests and status persistence unchanged. This release does NOT modify admin source; prior v21 admin redesign retained.
6. Test widths 320, 375, 768, 1024, 1440 pixels and browser zoom 100/200% with a real browser. Audit response headers and API failures.
7. Run `npm install`, `npm run build` independently in both `public-site` and `admin-site`; run `npm audit` and review findings. None of these tests can be assumed passed without logs.
