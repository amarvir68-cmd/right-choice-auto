import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const required=['public-site/app/InventoryBrowser.js','public-site/app/VehicleExtras.js','public-site/app/VehicleInquiry.js','database/2026-09-19-v14-inquiries.sql','admin-site/app/page.js'];
let bad=0;
for(const p of required){const exists=fs.existsSync(path.join(root,p));console.log(`${exists?'PASS':'FAIL'} file: ${p}`);if(!exists)bad++}
const pub=fs.readFileSync(path.join(root,'public-site/app/cars/page.js'),'utf8');const detail=fs.readFileSync(path.join(root,'public-site/app/cars/[id]/page.js'),'utf8');const admin=fs.readFileSync(path.join(root,'admin-site/app/page.js'),'utf8');const sql=fs.readFileSync(path.join(root,'database/2026-09-19-v14-inquiries.sql'),'utf8');
for(const [name,ok] of [['filters wired',pub.includes('<InventoryBrowser')],['gallery wired',detail.includes('<VehicleGallery')],['inquiries wired',detail.includes('<VehicleInquiry')],['admin inbox wired',admin.includes("tab==='inquiries'")],['admin RLS migration',sql.includes('public.is_admin()')],['no service booking',!detail.includes('Book Appointment')],['favourites removed',!fs.existsSync(path.join(root,'public-site/app/favourites/page.js'))]]){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)bad++}
if(bad){console.error(`${bad} failures`);process.exit(1)}console.log('Static wiring checks PASS (not an end-to-end or production build test).');
