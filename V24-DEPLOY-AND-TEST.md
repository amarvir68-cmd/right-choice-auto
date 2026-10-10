# V24 installation checklist

1. Extract the ZIP. Update **both** `admin-site/app/page.js` and `admin-site/app/admin.css` at the same repository paths; do not upload the ZIP itself to GitHub as a file. Commit them together.
2. On the **admin** Vercel project, check the new deployment commit. Customer site needs no redeploy.
3. Preview test: log in as approved admin, open Vehicle Inquiries and Repair Requests; Refresh must be at the **top right on both** screens. Search and status filters appear in matching places. At narrow widths Refresh becomes full width.
4. Submit dummy vehicle inquiry and repair request via current working customer site. Confirm both appear; change status and refresh to confirm persistence. Delete **only the dummy records** using Delete → Yes, delete, verify each disappears and stays gone after Refresh. Also test Cancel leaves the record intact.
5. If deletion fails, inspect Supabase grants/RLS and the correct project configuration. Read `database/2026-09-20-v24-optional-delete-grant.sql` before considering it; do not run it by default.
6. Keep existing real customer leads until the business has established data-retention requirements and a backup/records policy. A permanent delete cannot be undone from the dashboard.

Unverified: production build and authenticated browser integration. Existing static checks do not substitute for these release gates.
