import {createClient} from '@supabase/supabase-js';
import {rateLimit} from '../../../lib/rate-limit';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const bad=message=>Response.json({error:message},{status:400,headers:{'cache-control':'no-store'}});
const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max+1):'';

async function verifyTurnstile(token,request,expectedOrigin){
 const secret=process.env.TURNSTILE_SECRET_KEY;
 const required=process.env.REQUIRE_TURNSTILE==='true';
 if(!secret){if(required)throw new Error('captcha_not_configured');return true}
 if(!token)return false;
 const ip=(request.headers.get('x-forwarded-for')||'').split(',')[0]?.trim();
 const form=new URLSearchParams({secret,response:token});if(ip)form.set('remoteip',ip);
 const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:form,cache:'no-store'});
 if(!result.ok)throw new Error('captcha_unavailable');
 const verification=await result.json();
 const hostname=new URL(expectedOrigin).hostname;
 return Boolean(verification.success&&verification.hostname===hostname);
}

export async function POST(request){
 try{
  const limited=await rateLimit(request,{scope:'inquiry',limit:Number(process.env.INQUIRY_RATE_LIMIT||5),windowSeconds:Number(process.env.INQUIRY_RATE_WINDOW_SECONDS||600)});
  if(!limited.ok)return Response.json({error:'Too many requests. Please wait a few minutes or call us.'},{status:429,headers:{'retry-after':String(Math.max(1,Math.ceil((limited.resetAt-Date.now())/1000))),'cache-control':'no-store'}});
  if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'Request too large.'},{status:413});
  const origin=request.headers.get('origin');
  const expectedOrigin=new URL(request.url).origin;
  if(origin&&origin!==expectedOrigin)return Response.json({error:'Invalid origin.'},{status:403});
  const fetchSite=request.headers.get('sec-fetch-site');
  if(fetchSite&&!['same-origin','none'].includes(fetchSite))return Response.json({error:'Cross-site submissions are not allowed.'},{status:403});
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return Response.json({error:'JSON requests only.'},{status:415});
  const raw=await request.text();if(raw.length>12000)return Response.json({error:'Request too large.'},{status:413});
  let body;try{body=JSON.parse(raw)}catch{return bad('Invalid request.')}
  if(!body||typeof body!=='object'||body.website)return bad('Invalid submission.');
  const name=clean(body.name,100),email=clean(body.email,180),phone=clean(body.phone,35),message=clean(body.message,2000);
  if(name.length<1||name.length>100||email.length>180||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>35||message.length<10||message.length>2000||body.consent!==true)return bad('Please check the form fields and consent.');
  const kind=body.kind==='repair'?'repair':body.kind==='vehicle'?'vehicle':null;if(!kind)return bad('Invalid inquiry type.');
  try{if(!await verifyTurnstile(clean(body.captchaToken,2048),request,expectedOrigin))return bad('Security check failed. Please try again.')}catch(error){console.error('Turnstile verification error:',error?.message);return Response.json({error:'Security verification unavailable. Please try again later.'},{status:503})}
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const allowLegacy=process.env.ALLOW_LEGACY_PUBLIC_INSERTS==='true';
  const key=serviceKey||(allowLegacy?publicKey:null);
  if(!url||!key)return Response.json({error:'Inquiry service unavailable. Please call us.'},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  let table,payload;
  if(kind==='vehicle'){
   if(typeof body.vehicleId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.vehicleId))return bad('Invalid vehicle.');
   table='vehicle_inquiries';payload={vehicle_id:body.vehicleId,name,email,phone:phone||null,message,consent:true,status:'new'};
  }else{
   const service=clean(body.service,100),vehicle=clean(body.vehicle,120),preferredDate=clean(body.preferredDate,10);
   if(!service||service.length>100||vehicle.length>120||(preferredDate&&!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)))return bad('Please check repair details.');
   table='repair_requests';payload={name,email,phone:phone||null,message,service,vehicle:vehicle||null,preferred_date:preferredDate||null,consent:true,status:'new'};
  }
  const {error}=await supabase.from(table).insert(payload);
  if(error){console.error('Inquiry insert error:',error.code);return Response.json({error:'Unable to send. Please call us instead.'},{status:503,headers:{'cache-control':'no-store'}})}
  return Response.json({ok:true},{status:201,headers:{'cache-control':'no-store'}});
 }catch(error){console.error('Inquiry request error:',error?.name);return Response.json({error:'Unable to process request. Please call us.'},{status:400,headers:{'cache-control':'no-store'}})}
}
