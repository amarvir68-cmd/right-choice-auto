# V26 — Homepage Featured Vehicle Layout

## Changed files
- `public-site/app/page.js`
- `public-site/app/globals.css`

## Changes
- Added homepage-specific featured vehicle classes without changing inventory cards elsewhere.
- A single featured vehicle now uses a compact two-column desktop showcase instead of stretching its image across the page.
- Constrained the featured card to 1180px and 460px maximum desktop height.
- Vehicle information, price, status and CTA are visible beside the image on desktop.
- The card stacks cleanly on tablet/mobile with a controlled image aspect ratio.
- Multiple featured vehicles continue using the existing card grid.

## No changes
- No database changes.
- No admin changes.
- No inquiry or repair-request workflow changes.
- No vehicle detail gallery changes.
