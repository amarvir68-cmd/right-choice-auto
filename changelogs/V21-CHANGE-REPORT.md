# Right Choice Auto v21 — implementation and release report

## Source baseline
Based on the v20 ZIP available in this conversation, which includes the simplified vehicle card. The current live GitHub repository may differ; compare changes before replacing files. Neither Vercel project has been deployed by this package.

## Changed files
- `public-site/app/InventoryBrowser.js`: four always-visible filters (search, make, maximum price, sort), expandable advanced filters; removes comparison state, checkbox and comparison table entirely; retains existing filtering and empty states.
- `public-site/app/MobileNavigation.js` (new): accessible client-side menu with expandable button and navigation links.
- `public-site/app/components.js`: integrates mobile navigation in existing server-rendered Header. Leaves vehicle card, footer, and inquiry functionality intact.
- `public-site/app/globals.css`: non-overlapping in-flow header, breakpoint navigation, responsive filter grids, homepage/repair polish.
- `public-site/app/page.js`: additional trust copy and separate repair appointment and phone calls to action. Retains existing featured car and SEO structured data.
- `public-site/app/repairs/RepairRequest.js`: preserves request API payload and adds distinct success/error feedback and accessible form label.
- `admin-site/app/page.js`: inquiries now show status badges, disable already-selected status, accurate empty state, accessible notice. Repair request logic unchanged.
- `admin-site/app/admin.css`: status badge, wrapping contacts/actions, improved narrow-screen admin navigation.
- `scripts/check-v21.mjs` (new): assertion checks for core UI and preserved workflows.

## Deployment order
1. Commit and deploy public-site changes in their correct paths. Do not upload a ZIP as one file. Check Vercel project's root directory is `public-site` and commit matches GitHub.
2. Check desktop and mobile navigation; inventory search, make, price, sort, advanced options and reset; photo link and vehicle detail gallery; vehicle inquiry and repair request submissions using dummy details.
3. Commit and deploy admin-site changes, root directory `admin-site`. Confirm admin login, inquiry status and repair request status persist after refresh.
4. Compare screenshots at 375px, 768px, 1024px, 1440px and browser zoom 100–200%; check no header/filter overlap.

## Test limitations
Static assertions and archive integrity are not substitutes for interactive browser tests. npm clean install / Next production builds cannot run offline without dependency lockfiles and packages. No live Supabase mutation, authentication or Vercel deploy was attempted. Image compression and responsive sizing of all source photography remain unverified; existing upload compression stays in place, with no new image delivery service or unsafe automatic image-domain configuration. Existing SEO metadata, sitemap, robots and vehicle schema are preserved, not validated against a live deployed build.

## Rollback
Preserve v20 ZIP and working Vercel deployment. Revert the v21 Git commit (or promote a prior verified deployment) if smoke tests fail. No database migration is required.
