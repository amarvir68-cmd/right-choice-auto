# v18 Inventory gallery full-screen fix

Root cause: v17 applies `transform: translateY(-3px)` to `.vehicleCard:hover`. CSS transforms make a containing block for fixed descendants. The inventory lightbox was rendered inside `.vehicleCard`, so its `position: fixed` was confined to the card rather than the viewport. The screenshot shows precisely this failure.

Fix: `ListingPhotoGallery.js` now uses React `createPortal(..., document.body)` after mount so the overlay is outside cards and any transformed/overflow-clipped ancestors. The CSS sets explicit viewport dimensions and appropriate image constraints. Other card animations and the separate vehicle detail gallery are unchanged.

Modified files:
- `public-site/app/ListingPhotoGallery.js`
- `public-site/app/globals.css`

Deploy: extract this ZIP, upload these two files to their exact matching paths on GitHub main; Vercel will rebuild the customer public-site. No database migration or admin deployment needed. Open /cars, click the photo, confirm viewer fills the viewport and closes on Escape and X. Test narrow screens, arrows, and thumbnails.

Validation: ZIP and syntax/static checks, no browser or live deployment validation claimed.
