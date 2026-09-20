# v19 inventory photo navigation

Inventory vehicle photos now link to their respective vehicle details page instead of opening a fullscreen overlay. The photo viewer is retained on the vehicle detail page in `public-site/app/VehicleExtras.js`. This update starts from the v18 ZIP and changes only `public-site/app/components.js` and `public-site/app/globals.css` plus this note. No database migration or admin change is required.

Deploy: commit the two changed files at the exact paths in the GitHub repository. Verify the Vercel customer build succeeds, click a vehicle photo on `/cars` and confirm it opens `/cars/<vehicle-id>`, then open the gallery on that detail page and check zoom/navigation. Also recheck customer inquiry and repair form operation.
