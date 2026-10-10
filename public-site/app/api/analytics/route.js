import {createClient} from '@supabase/supabase-js';
import {rateLimit} from '../../../lib/rate-limit';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const allowed=new Set(['page_view','vehicle_view','call_click','facebook_click','instagram_click','tiktok_click','directions_click']);
export async function POST(request){
 try{
  const limited=await rateLimit(request,{scope:'analytics',limit:60,windowSeconds:60});
  if(!limited.ok)return new Response(null,{status:204});
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return new Response(null,{status:415});
  const body=await request.json();
  const event_name=typeof body?.event_name==='string'?body.event_name:'';
  const page_path=typeof body?.page_path==='string'?body.page_path.slice(0,300):'/';
  const vehicle_id=typeof body?.vehicle_id==='string'&&/^[0-9a-f-]{30,}$/i.test(body.vehicle_id)?body.vehicle_id:null;
  if(!allowed.has(event_name)||!page_path.startsWith('/'))return new Response(null,{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return new Response(null,{status:204});
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  await supabase.from('analytics_events').insert({event_name,page_path,vehicle_id});
  return new Response(null,{status:204,headers:{'cache-control':'no-store'}});
 }catch{return new Response(null,{status:204})}
}
