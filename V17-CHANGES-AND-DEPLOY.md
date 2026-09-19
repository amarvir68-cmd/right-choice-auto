# v17: verified-source cleanup and visual polish

## Included changes
- Removed Saved Vehicles links, page, client component, and browser-storage save button; retained sharing and comparison.
- Added name-normalization duplicate checks in admin Repair Services; duplicates already stored are flagged for manual review, **not automatically deleted**.
- Deduplicated repeated service names in public homepage/footer display without changing database records.
- Refined responsive homepage, inventory card, vehicle details, and admin styles. Preserved inquiry and repair-request API/database logic.

## Deployment
1. Back up your current GitHub main branch and database.
2. Commit the files in this archive into the existing GitHub repository, preserving `public-site/` and `admin-site/` paths. Do not upload just the ZIP as a file.
3. Verify the customer and admin Vercel projects track the intended GitHub branch and directories. Deploy both separately.
4. Verify `/favourites` now returns 404, navigation and share button work, inspect responsive pages.
5. Check Admin → Repair Services for flagged duplicate names. Compare names and descriptions and only then delete unwanted records individually; no SQL deletion included.
6. Re-test vehicle inquiry submission and status persistence, repair request submission and status persistence, authentication, uploads, and inventory.

## Validation scope
ZIP integrity and source-level checks can be run locally. Live browser testing, connected Supabase tests and production builds require correct dependencies and environment variables. Do not treat static checks as production validation.
