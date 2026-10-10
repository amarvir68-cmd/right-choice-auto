import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT=process.cwd();
const PUBLIC='https://right-choice-auto-one.vercel.app';
const ADMIN='https://right-choice-auto-f6su-five.vercel.app';
const OUT=path.join(ROOT,'live-validation-artifacts');
fs.mkdirSync(OUT,{recursive:true});

const results=[];
function record(name,ok,detail=''){results.push({name,ok,detail});console.log(`${ok?'PASS':'FAIL'} ${name}${detail?' — '+detail:''}`)}

async function httpCheck(){
  const pages=['/','/cars','/repairs','/about','/contact','/privacy'];
  for(const p of pages){
    try{
      const r=await fetch(PUBLIC+p,{redirect:'follow'});
      record(`HTTP ${p}`,r.ok,`${r.status}`);
    }catch(e){record(`HTTP ${p}`,false,e.message)}
  }
  try{
    const r=await fetch(PUBLIC+'/api/health',{cache:'no-store'});
    const body=await r.text();
    record('Health endpoint',r.status===200 && /"status":"ok"/.test(body),`${r.status} ${body.slice(0,120)}`);
  }catch(e){record('Health endpoint',false,e.message)}

  for(const [label,url,admin] of [['Public headers',PUBLIC+'/',false],['Admin headers',ADMIN+'/',true]]){
    try{
      const r=await fetch(url,{redirect:'follow'});
      const h=r.headers;
      const required=[
        ['content-security-policy',v=>Boolean(v)],
        ['strict-transport-security',v=>/max-age=/i.test(v||'')],
        ['x-content-type-options',v=>(v||'').toLowerCase()==='nosniff'],
        ['x-frame-options',v=>(v||'').toUpperCase()==='DENY'],
        ['referrer-policy',v=>Boolean(v)],
        ['permissions-policy',v=>Boolean(v)],
        ['cross-origin-opener-policy',v=>(v||'').toLowerCase()==='same-origin']
      ];
      if(admin) required.push(['x-robots-tag',v=>/noindex/i.test(v||'')]);
      const missing=required.filter(([k,test])=>!test(h.get(k))).map(([k])=>k);
      record(label,missing.length===0,missing.length?'missing/incorrect: '+missing.join(', '):'all expected headers present');
    }catch(e){record(label,false,e.message)}
  }

  const endpoint=PUBLIC+'/api/inquiries';
  const calls=[
    ['Reject wrong content type',()=>fetch(endpoint,{method:'POST',headers:{'content-type':'text/plain'},body:'{}'}),415],
    ['Reject cross-origin POST',()=>fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','origin':'https://evil.example'},body:JSON.stringify({})}),403],
    ['Reject cross-site fetch metadata',()=>fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','sec-fetch-site':'cross-site'},body:JSON.stringify({})}),403],
    ['Reject oversized request',()=>fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'x'.repeat(12500)})}),413],
    ['Reject malformed JSON',()=>fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:'{not-json'}),400],
  ];
  for(const [name,fn,expected] of calls){
    try{const r=await fn();record(name,r.status===expected,`expected ${expected}, got ${r.status}`)}
    catch(e){record(name,false,e.message)}
  }
  try{
    const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:'{not-json}'});
    record('Rate limit enforced',r.status===429,`expected 429 after 5 prior requests, got ${r.status}`);
  }catch(e){record('Rate limit enforced',false,e.message)}
}

async function browserCheck(){
  const pwPath=path.join(ROOT,'live-check','node_modules','playwright','index.mjs');
  const {chromium}=await import(pathToFileURL(pwPath).href);
  const browser=await chromium.launch({headless:true});
  const discovery=await browser.newContext({viewport:{width:1366,height:768}});
  const discoveryPage=await discovery.newPage();
  await discoveryPage.goto(PUBLIC+'/cars',{waitUntil:'networkidle',timeout:45000});
  const detailHref=await discoveryPage.locator('.simpleInventoryPhoto').first().getAttribute('href').catch(()=>null);
  await discovery.close();
  record('Vehicle detail route discovered',Boolean(detailHref),detailHref||'no listed vehicle link found');

  const viewports=[
    ['mobile360',{width:360,height:800}],
    ['mobile390',{width:390,height:844}],
    ['tablet768',{width:768,height:1024}],
    ['desktop1366',{width:1366,height:768}],
    ['desktop1920',{width:1920,height:1080}]
  ];
  const pages=[
    ['home','/'],['cars','/cars'],['vehicle-detail',detailHref],['repairs','/repairs'],['about','/about'],['contact','/contact'],['privacy','/privacy']
  ].filter(([,p])=>p);

  for(const [vpName,viewport] of viewports){
    const context=await browser.newContext({viewport});
    for(const [name,p] of pages){
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push('pageerror:'+e.message));
      page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
      try{
        const res=await page.goto(PUBLIC+p,{waitUntil:'networkidle',timeout:45000});
        const metrics=await page.evaluate(()=>({
          sw:document.documentElement.scrollWidth,
          cw:document.documentElement.clientWidth,
          header:!!document.querySelector('header'),
          main:!!document.querySelector('main'),
          footer:!!document.querySelector('footer')
        }));
        const overflow=metrics.sw-metrics.cw;
        record(`${vpName} ${name} layout`,Boolean(res?.ok())&&metrics.header&&metrics.main&&metrics.footer&&overflow<=2,
          `status=${res?.status()} overflow=${overflow}px jsErrors=${errors.length}`);
        if(errors.length) record(`${vpName} ${name} JS console`,false,errors.slice(0,3).join(' | '));
        if(vpName==='mobile390' || vpName==='desktop1366'){
          await page.screenshot({path:path.join(OUT,`${name}-${vpName}.png`),fullPage:true});
        }
        if(name==='cars' && vpName==='desktop1366'){
          const card=page.locator('.inventoryBrowser .simpleInventoryCard').first();
          if(await card.count()){
            const box=await card.boundingBox();
            record('Desktop inventory card compact',Boolean(box)&&box.width<=420,`width=${box?Math.round(box.width):'n/a'}px`);
            const img=page.locator('.inventoryBrowser .simpleInventoryPhoto').first();
            const ib=await img.boundingBox();
            record('Desktop inventory image compact',Boolean(ib)&&ib.height<=270,`height=${ib?Math.round(ib.height):'n/a'}px`);
          } else record('Desktop inventory card compact',false,'no inventory card found');
        }
        if(name==='home' && vpName==='mobile390'){
          const menu=page.getByRole('button',{name:/menu/i}).first();
          if(await menu.count()){
            await menu.click();
            const nav=page.locator('#mobile-site-links');
            record('Mobile menu opens',await nav.isVisible(),'390px viewport');
            const link=nav.getByRole('link',{name:'Cars for Sale'});
            record('Mobile menu links usable',await link.isVisible(),'Cars for Sale visible');
          } else record('Mobile menu opens',false,'menu button not found');
        }
      }catch(e){record(`${vpName} ${name} layout`,false,e.message)}
      await page.close();
    }
    await context.close();
  }

  const context=await browser.newContext({viewport:{width:1366,height:768}});
  const page=await context.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  let captured=null;
  page.on('request',req=>{
    if(captured)return;
    if(req.url().includes('.supabase.co/auth/v1/token')){
      const h=req.headers();
      if(h.apikey)captured={origin:new URL(req.url()).origin,key:h.apikey};
    }
  });
  try{
    const r=await page.goto(ADMIN,{waitUntil:'networkidle',timeout:45000});
    const text=await page.locator('body').innerText();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    record('Admin login loads',Boolean(r?.ok())&&/Welcome back|PRIVATE STAFF PORTAL|Sign in/i.test(text),`status=${r?.status()} overflow=${overflow}px`);
    record('Admin unauthenticated gate',/Welcome back|Sign in/i.test(text)&&!/Available vehicles|Action centre/i.test(text),'login shown; dashboard data hidden');
    record('Admin login no horizontal overflow',overflow<=2,`${overflow}px`);
    record('Admin login no page errors',errs.length===0,errs.slice(0,3).join(' | '));
    await page.screenshot({path:path.join(OUT,'admin-login-desktop1366.png'),fullPage:true});

    const email=page.locator('input[type=email]');
    const password=page.locator('input[type=password]');
    if(await email.count()&&await password.count()){
      await email.fill('rca-security-check@example.invalid');
      await password.fill('NotARealPassword-2026!');
      await page.getByRole('button',{name:/sign in to manager/i}).click();
      await page.waitForTimeout(1500);
    }
    record('Supabase anonymous credential captured for RLS test',Boolean(captured),'publishable credential observed from login request; value not logged');
    if(captured){
      const headers={'apikey':captured.key,'content-type':'application/json'};
      if(captured.key.startsWith('eyJ'))headers.authorization='Bearer '+captured.key;
      const checks=[
        ['Anon cannot read vehicle inquiries',captured.origin+'/rest/v1/vehicle_inquiries?select=id&limit=1','GET',null],
        ['Anon cannot write vehicle inquiries',captured.origin+'/rest/v1/vehicle_inquiries','POST','{}'],
        ['Anon cannot write repair requests',captured.origin+'/rest/v1/repair_requests','POST','{}'],
        ['Anon cannot write analytics events',captured.origin+'/rest/v1/analytics_events','POST','{}']
      ];
      for(const [name,url,method,body] of checks){
        try{
          const rr=await fetch(url,{method,headers,body:body??undefined});
          record(name,[401,403].includes(rr.status),`status=${rr.status}`);
        }catch(e){record(name,false,e.message)}
      }
    }
  }catch(e){record('Admin login loads',false,e.message)}
  await context.close();
  await browser.close();
}

await httpCheck();
try{await browserCheck()}catch(e){record('Playwright browser suite',false,e.stack||e.message)}
fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(results,null,2));
const failed=results.filter(x=>!x.ok);
console.log(`\nSUMMARY: ${results.length-failed.length}/${results.length} checks passed`);
if(failed.length){
  console.log('FAILED CHECKS:');
  failed.forEach(x=>console.log(`- ${x.name}: ${x.detail}`));
  process.exit(1);
}
