# V14 file verification compared to V13

## New files
- `V14-RELEASE-NOTES.md`
- `database/2026-09-19-v14-inquiries.sql`
- `public-site/app/FavouritesBrowser.js`
- `public-site/app/InventoryBrowser.js`
- `public-site/app/VehicleExtras.js`
- `public-site/app/VehicleInquiry.js`
- `public-site/app/favourites/page.js`
- `scripts/check-v14.mjs`

## Changed files
- `admin-site/.env.example`
- `admin-site/app/admin.css`
- `admin-site/app/page.js`
- `public-site/app/AnalyticsTracker.js`
- `public-site/app/cars/[id]/page.js`
- `public-site/app/cars/page.js`
- `public-site/app/components.js`
- `public-site/app/globals.css`
- `public-site/app/page.js`

## Removed files
None

## How to upload
Extract the archive. In GitHub upload the **contents of** `public-site/` to your existing public project and the **contents of** `admin-site/` to your existing admin project, retaining directory layout. Run database/2026-09-19-v14-inquiries.sql on the matching Supabase project ONLY after backup. Do not upload the outer directory as a nested folder if each Vercel project expects its app at repo root. Deploy to staging first.
