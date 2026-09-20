import fs from 'node:fs';
const page=fs.readFileSync('admin-site/app/page.js','utf8');
const css=fs.readFileSync('admin-site/app/admin.css','utf8');
const checks={
 'both lead screens use the same toolbar':page.includes('<LeadToolbar title="Vehicle Inquiries"')&&page.includes('<LeadToolbar title="Repair Requests"'),
 'same refresh button for both pages':page.includes('function LeadToolbar(')&&page.includes('className="secondary v24Refresh"'),
 'search and status filters for both':page.includes('const shown=items.filter(')&&page.match(/const shown=items\.filter\(/g)?.length>=2,
 'deletion requires second confirmation':page.includes('function DeleteLeadButton(')&&page.includes('Yes, delete')&&page.includes('Cancel')&&page.includes('This cannot be undone.'),
 'delete only selected id':page.includes(".delete().eq('id',item.id).select('id')"),
 'deletion checks database response':page.includes('if(!data?.length)')&&page.includes('onDeleted(item.id)'),
 'administrator verification preserved':page.includes("from('admin_users')"),
 'inquiry update retained':page.includes("from('vehicle_inquiries').update({status})"),
 'repair update retained':page.includes("from('repair_requests').update({status})"),
 'responsive cards and toolbar':css.includes('.v24LeadControls')&&css.includes('@media(max-width:660px)'),
 'no new service key in admin':!page.includes('SUPABASE_SERVICE_ROLE_KEY'),
};
let n=0;for(const [name,ok] of Object.entries(checks)){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)n++}
process.exitCode=n?1:0;
