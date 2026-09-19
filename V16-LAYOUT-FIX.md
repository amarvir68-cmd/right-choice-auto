# v16 vehicle detail layout patch

Changes are in **public-site only**; no admin files were modified in this targeted fix.

- `public-site/app/globals.css`: balanced 50/50 detail columns, 1440px page cap, responsive bounded 16:11 photo stage, proportional photos and thumbnails, larger details width, and 1050px single-column breakpoint. Overrides legacy v14/v15 layout selectors at end of stylesheet.
- `public-site/app/cars/[id]/page.js`: adds vehicle section accessible name.
- `public-site/app/VehicleExtras.js`: adds lightbox focus restoration/focus loop and image decoding hints while retaining image zoom and arrows.

The description shown on the screenshot comes from `car.description` in Supabase, not a hard-coded label. Edit this vehicle's description in the admin dashboard if it contains test text. This patch does not silently alter vehicle records.

## Deploy
1. Keep the live site unchanged until tests pass. Set the Vercel public project root to `public-site`. Upload/commit changed public-site files.
2. Build via `npm install` and `npm run build` within `public-site`, setting the correct existing environment variables.
3. Deploy a preview and inspect a listing at desktop (1440 and 1100px), laptop (1024px), tablet (768px), mobile (390px), and browser zoom 80%, 100%, 125%, 200%. Test one-image and multi-image listings.
4. Check gallery open/close, arrows, thumbnails, Escape, Tab, and scrolling. Then promote the preview to production.

No deployment or live database modifications were made by this patch. Previous v15 features retain their existing unverified status.
