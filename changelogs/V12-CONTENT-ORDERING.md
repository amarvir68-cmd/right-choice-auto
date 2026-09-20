# V12 content ordering

- Promotions now have Move Up, Move Down, Publish/Hide, and Delete controls.
- Repair Services now have Move Up, Move Down, and Delete controls.
- New promotions/services are added at the end automatically.
- The public promotion rotator follows promotion `sort_order`.
- The public Auto Repair page follows service `sort_order`.
- Ordering changes are saved immediately to Supabase.

No database migration is required.
Deploy the updated `admin-site`. The public site already reads the `sort_order` fields, so no public code change is required for ordering.
