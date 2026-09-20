# Vehicle photo gallery fix

- Clicking a vehicle photo on Cars for Sale now opens a full-screen viewer directly.
- The viewer provides previous/next controls, clickable thumbnails, photo counter, Escape to close, and left/right keyboard shortcuts.
- The vehicle details link remains separate, below the photo.
- Corrected conflicting old `.gallery` grid styling on vehicle detail pages.
- No database migration and no admin-site changes are required.

Deploy the updated `public-site` to the public Vercel project and test with a vehicle that has several uploaded photos. The actual deployed database and browser behavior have not been tested here.
