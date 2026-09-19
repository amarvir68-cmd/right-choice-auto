import {createClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const bad=message=>Response.json({error:message},{status:400});
export async function POST(request){
 try{
  if(Number(request.headers.get('content-length')||0)>12000)return bad('Request too large.');
  const origin=request.headers.get('origin');
  if(origin&&origin!==new URL(request.url).origin)return bad('Invalid origin.');
  const body=await request.json();
  if(!body||typeof body!=='object'||body.website)return bad('Invalid submission.');
  const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max+1):'';
  const name=clean(body.name,100),email=clean(body.email,180),phone=clean(body.phone,35),message=clean(body.message,2000);
  if(name.length<1||name.length>100||email.length>180||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>35||message.length<10||message.length>2000||body.consent!==true)return bad('Please check the form fields and consent.');
  const kind=body.kind==='repair'?'repair':body.kind==='vehicle'?'vehicle':null;
  if(!kind)return bad('Invalid inquiry type.');
  const captchaSecret=process.env.TURNSTILE_SECRET_KEY;
  if(captchaSecret){
   const token=clean(body.captchaToken,2048);
   if(!token)return bad('Please complete the security check.');
   const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:captchaSecret,response:token})});
   const verification=await result.json();if(!verification.success)return bad('Security check failed. Please try again.');
  }
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return Response.json({error:'Inquiry service unavailable. Please call us.'},{status:503});
  const supabase=createClient(url,key,{auth:{persistSession:false}});
  let table,payload;
  if(kind==='vehicle'){
   if(typeof body.vehicleId!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.vehicleId))return bad('Invalid vehicle.');
   table='vehicle_inquiries';payload={vehicle_id:body.vehicleId,name,email,phone,message,consent:true};
  }else{
   const service=clean(body.service,100),vehicle=clean(body.vehicle,120),preferredDate=clean(body.preferredDate,10);
   if(!service||service.length>100||vehicle.length>120||(preferredDate&&!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)))return bad('Please check repair details.');
   table='repair_requests';payload={name,email,phone,message,service,vehicle,preferred_date:preferredDate||null,consent:true};
  }
  const {error}=await supabase.from(table).insert(payload);
  if(error){console.error('Inquiry insert error:',error.code);return Response.json({error:'Unable to send. Please call us instead.'},{status:503});}
  return Response.json({ok:true},{status:201,headers:{'cache-control':'no-store'}});
 }catch(error){console.error('Inquiry request error:',error?.name);return Response.json({error:'Unable to process request. Please call us.'},{status:400});}
}
