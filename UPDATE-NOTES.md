# Public Site Update — Promotions + Logo

This build updates the public website in two ways:

1. All active/published promotions rotate automatically every 5 seconds. Visitors can also use the small dots to switch promotions manually.
2. The temporary RC mark is replaced by the selected Right Choice Logo 6 artwork in the header, footer, and homepage hero.

Files changed in `public-site`:
- `app/page.js`
- `app/components.js`
- `app/globals.css`
- `app/PromoRotator.js` (new)
- `public/right-choice-logo.png` (new)

Both app package files now pin Next.js to 16.0.7 so a fresh deployment does not use the previously blocked 16.0.0 release.

After these files are committed to GitHub, Vercel should automatically redeploy the public site if Git integration is enabled.

## v3 admin login refresh
- Rebuilt the private admin sign-in screen with the approved Right Choice logo.
- Added a two-panel branded desktop layout and responsive mobile layout.
- Added clearer private-staff/security messaging, improved form styling, and loading state.
- Added `admin-site/public/right-choice-logo.png`.
