import {getSupabase} from '../../../lib/supabase';
export const dynamic='force-dynamic';
export async function GET(){
 try{
  const supabase=getSupabase();
  if(!supabase)return Response.json({status:'degraded'},{status:503,headers:{'cache-control':'no-store'}});
  const {error}=await supabase.from('site_settings').select('key').limit(1);
  return Response.json({status:error?'degraded':'ok'},{status:error?503:200,headers:{'cache-control':'no-store'}});
 }catch{return Response.json({status:'degraded'},{status:503,headers:{'cache-control':'no-store'}})}
}
