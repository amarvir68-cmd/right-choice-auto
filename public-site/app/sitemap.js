import {getSupabase} from '../lib/supabase';
import {absoluteUrl} from '../lib/seo';

export default async function sitemap(){
 const now=new Date();
 const staticPages=[
  {url:absoluteUrl('/'),lastModified:now,changeFrequency:'weekly',priority:1},
  {url:absoluteUrl('/cars'),lastModified:now,changeFrequency:'daily',priority:.9},
  {url:absoluteUrl('/repairs'),lastModified:now,changeFrequency:'monthly',priority:.8},
  {url:absoluteUrl('/about'),lastModified:now,changeFrequency:'monthly',priority:.5},
  {url:absoluteUrl('/contact'),lastModified:now,changeFrequency:'monthly',priority:.6}
 ];
 const supabase=getSupabase();
 if(!supabase)return staticPages;
 const {data}=await supabase.from('vehicles').select('id,updated_at,created_at').eq('published',true).in('status',['available','pending']);
 const vehicles=(data||[]).map(v=>({url:absoluteUrl(`/cars/${v.id}`),lastModified:new Date(v.updated_at||v.created_at||Date.now()),changeFrequency:'weekly',priority:.8}));
 return [...staticPages,...vehicles];
}
