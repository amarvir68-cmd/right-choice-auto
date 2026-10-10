import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const tests=[
 ['server-only lead writes',read('public-site/app/api/inquiries/route.js').includes('SUPABASE_SERVICE_ROLE_KEY')],
 ['distributed rate limiter hook',read('public-site/lib/rate-limit.js').includes('UPSTASH_REDIS_REST_URL')],
 ['Turnstile verification',read('public-site/app/api/inquiries/route.js').includes('TURNSTILE_SECRET_KEY')],
 ['analytics protected endpoint',read('public-site/app/AnalyticsTracker.js').includes('/api/analytics')],
 ['CSP public',read('public-site/next.config.mjs').includes('Content-Security-Policy')],
 ['CSP admin',read('admin-site/next.config.mjs').includes('Content-Security-Policy')],
 ['admin idle logout',read('admin-site/app/page.js').includes('useInactivityLogout')],
 ['admin MFA switch',read('admin-site/app/page.js').includes('NEXT_PUBLIC_REQUIRE_ADMIN_MFA')],
 ['image dimension validation',read('admin-site/app/page.js').includes('12000')],
 ['audit log UI',read('admin-site/app/page.js').includes('function AuditLog')],
 ['RLS hardening migration',read('database/2026-10-10-v27-security-hardening.sql').includes('revoke insert')],
 ['CI security workflow',fs.existsSync('.github/workflows/ci.yml')],
 ['Dependabot',fs.existsSync('.github/dependabot.yml')],
 ['privacy sitemap',read('public-site/app/sitemap.js').includes("absoluteUrl('/privacy')")],
 ['health endpoint',fs.existsSync('public-site/app/api/health/route.js')]
];
let bad=0;for(const [name,ok] of tests){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)bad++}if(bad)process.exit(1);
