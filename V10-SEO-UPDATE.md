# V10 SEO update

This release improves search-engine and social-sharing readiness without changing the visual design.

## Added
- Unique titles/descriptions for Home, Cars, Repairs, About and Contact.
- Dynamic metadata for every published vehicle.
- Canonical URLs.
- Open Graph and Twitter sharing metadata.
- AutoRepair + AutoDealer JSON-LD on the homepage.
- Vehicle JSON-LD on individual vehicle pages.
- Dynamic `/sitemap.xml`, including published available/pending vehicles.
- `/robots.txt` for the public site.
- Admin `/robots.txt` plus noindex/noarchive/nosnippet metadata.
- `NEXT_PUBLIC_SITE_URL` environment variable.

## Vercel environment variable
In the PUBLIC Vercel project add:

NEXT_PUBLIC_SITE_URL=https://rightchoiceauto.ca

If your final domain is different, use that domain instead.

After adding/changing the environment variable, redeploy the public site.

## No database migration
V10 does not require any new Supabase SQL.
