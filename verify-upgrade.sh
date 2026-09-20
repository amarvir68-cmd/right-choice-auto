#!/usr/bin/env bash
set -euo pipefail
node --check public-site/app/api/inquiries/route.js
node --check public-site/app/AnalyticsTracker.js
node - <<'NODE'
const fs=require('fs'), assert=require('assert');
const read=p=>fs.readFileSync(p,'utf8');
const api=read('public-site/app/api/inquiries/route.js');
const inquiry=read('public-site/app/VehicleInquiry.js');
const repairs=read('public-site/app/repairs/page.js');
const db=read('database/2026-09-19-upgrade-repair-requests.sql');
const admin=read('admin-site/app/page.js');
const gallery=read('public-site/app/ListingPhotoGallery.js');
const inventory=read('public-site/app/InventoryBrowser.js');
for(const [name,condition] of Object.entries({
 'vehicle submits through API':inquiry.includes("fetch('/api/inquiries'"),
 'server validates submissions':api.includes('body.consent!==true'),
 'repair page contains form':repairs.includes('<RepairRequest/>'),
 'repair table uses RLS':db.includes('enable row level security'),
 'repair read restricted to admin':db.includes('using(public.is_admin())'),
 'admin repair tab':admin.includes("['repairs','⚒','Repair Requests']"),
 'gallery restores focus':gallery.includes('triggerRef.current?.focus()'),
 'inventory min price':inventory.includes('setMinPrice'),
 'inventory drivetrain':inventory.includes('setDrivetrain'),
 'analytics fallback':read('public-site/app/AnalyticsTracker.js').includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')
})){assert(condition,name);console.log('PASS:',name)}
NODE
printf '\nStatic source checks passed. Full Next builds and live workflows must still be run with dependencies/configuration.\n'
