# V8 update

This release focuses only on the upgrades already discussed:

- Professional admin Dashboard with anonymous 30-day analytics.
- Vehicle photo manager with reorder controls, Set Cover, and permanent Delete.
- New photos append to the existing gallery instead of overwriting it.
- More polished admin spacing, cards, photo controls, and responsive layout.
- No new public pages were added.

## Existing Supabase project
Run `database/2026-08-17-admin-analytics.sql` once in Supabase SQL Editor.

## Deployment
Redeploy both apps because:
- `public-site` now records anonymous analytics events.
- `admin-site` now displays analytics and contains the upgraded photo manager.

Analytics stores only event name, page path, optional vehicle ID, and timestamp. It does not intentionally store names or IP addresses.
