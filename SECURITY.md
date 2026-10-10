# Security Policy

Do not open a public GitHub issue containing customer data, credentials, API keys, database dumps, or exploitable security details.

For security issues, contact the business privately using the contact information on the Right Choice Auto website. Rotate any exposed credential immediately in the provider dashboard and redeploy affected applications.

## Secrets
- Never commit `.env` files.
- `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and `UPSTASH_REDIS_REST_TOKEN` are server-only secrets.
- Only values intentionally used in browser code may use the `NEXT_PUBLIC_` prefix.

## Production controls
See `V27-SECURITY-DEPLOYMENT.md` for the required deployment order, MFA, rate limiting, backups, database policy verification, and incident-response checks.
