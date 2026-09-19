# v20: Inventory card and header correction

Source: v19 ZIP supplied in this conversation.

## Files changed
- `public-site/app/components.js`: inventory uses one linked photograph, title, price, compact specifications and a details CTA; adds a native responsive navigation menu. No inventory photo gallery.
- `public-site/app/globals.css`: image aspect ratio and consistent card dimensions; header stays in document flow and switches to a keyboard-friendly menu below 1200px.

## Deployment
Copy both files into the matching paths in GitHub and commit. Check the exact Vercel production project's deployed commit. The customer app alone needs deployment. Do not upload ZIP contents into a nested directory.

## Manual verification still required
Check /cars at 375, 768, 1024, 1280 and 1600 px, at 100–200% zoom. Header must not overlap filters; card photo and CTA must link to /cars/[id]. Check detail-page fullscreen viewer still works. Recheck inquiries, repair bookings, and admin status updates before production release.
