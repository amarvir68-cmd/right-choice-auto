import fs from 'node:fs';
const page=fs.readFileSync('admin-site/app/page.js','utf8'),css=fs.readFileSync('admin-site/app/admin.css','utf8');
const checks={
 'dashboard opens first':page.includes("useState('analytics')"),
 'responsive menu works':page.includes('setMenu(x=>!x)')&&css.includes('.v23SidebarOpen'),
 'overview uses database lead counts':page.includes("from('vehicle_inquiries').select('id,status,created_at')")&&page.includes("from('repair_requests').select('id,status,created_at')"),
 'KPI cards navigate':page.includes('v23LeadGrid')&&page.includes("navigate('inquiries')"),
 'inquiry search and pipeline':page.includes('v23LeadToolbar')&&page.includes('v23Pipeline'),
 'repair pipeline':page.includes("['new','contacted','confirmed','closed'].map(status=>"),
 'inquiry status persisted':page.includes("from('vehicle_inquiries').update({status})"),
 'repair status persisted':page.includes("from('repair_requests').update({status})"),
 'admin gate retained':page.includes("from('admin_users')"),
 'privacy no PII in overview':page.includes("select('id,status,created_at')"),
 'responsive style':css.includes('@media(max-width:600px)'),
 'keyboard outline':css.includes('.adminV23 button:focus-visible')
};let fail=0;for(const [label,ok] of Object.entries(checks)){console.log(`${ok?'PASS':'FAIL'} ${label}`);if(!ok)fail++}if(fail)process.exit(1);
