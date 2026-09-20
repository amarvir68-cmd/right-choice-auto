import fs from 'node:fs';
const read = path => fs.readFileSync(path, 'utf8');
const inventory=read('public-site/app/InventoryBrowser.js');
const header=read('public-site/app/components.js');
const mobile=read('public-site/app/MobileNavigation.js');
const home=read('public-site/app/page.js');
const repair=read('public-site/app/repairs/RepairRequest.js');
const admin=read('admin-site/app/page.js');
const checks={
 'four basic filters':inventory.includes('inventoryBasic')&&inventory.includes('Search inventory')&&inventory.includes('Maximum price ($)')&&inventory.includes('Sort by'),
 'advanced filter toggle':inventory.includes('aria-expanded={advanced}')&&inventory.includes('inventoryAdvanced'),
 'comparison removed':!inventory.includes('comparePick')&&!inventory.includes('comparePanel')&&!inventory.includes('setSelected'),
 'responsive mobile menu':header.includes('<MobileNavigation/>')&&mobile.includes('aria-expanded={open}')&&mobile.includes('href={url}'),
 'simple card retained':header.includes('className="simpleInventoryPhoto"')&&!header.includes('ListingPhotoGallery'),
 'home repair CTA':home.includes('Request a Repair Appointment')&&home.includes('heroTrust'),
 'repair API preserved':repair.includes("fetch('/api/inquiries'")&&repair.includes("kind:'repair'")&&repair.includes('repairFeedback'),
 'inquiry API preserved':read('public-site/app/VehicleInquiry.js').includes("fetch('/api/inquiries'"),
 'admin inquiry status updates preserved':admin.includes("from('vehicle_inquiries').update({status})"),
 'admin repair management preserved':admin.includes("from('repair_requests')"),
 'admin inquiry status badges':admin.includes('leadStatus')&&admin.includes('No inquiries match your filters.'),
 'SEO and schemas retained':home.includes('jsonLd(businessSchema)')&&fs.existsSync('public-site/app/sitemap.js')&&fs.existsSync('public-site/app/robots.js'),
};
let failures=0;for(const [name,pass] of Object.entries(checks)){console.log(`${pass?'PASS':'FAIL'} ${name}`);if(!pass)failures++}process.exitCode=failures?1:0;
