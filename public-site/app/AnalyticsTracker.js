'use client';
import {useEffect} from 'react';
import {createClient} from '@supabase/supabase-js';

function client(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url&&key?createClient(url,key,{auth:{persistSession:false}}):null;
}
function vehicleId(path){
  const m=path.match(/^\/cars\/([0-9a-f-]{30,})/i);
  return m?m[1]:null;
}
export default function AnalyticsTracker(){
  useEffect(()=>{
    const sb=client(); if(!sb)return;
    const path=window.location.pathname;
    const vid=vehicleId(path);
    sb.from('analytics_events').insert({event_name:vid?'vehicle_view':'page_view',page_path:path,vehicle_id:vid}).then(()=>{});
    function click(e){
      const a=e.target.closest('a'); if(!a)return;
      const href=a.getAttribute('href')||'';
      let event_name=null;
      if(href.startsWith('tel:'))event_name='call_click';
      else if(/facebook\.com/i.test(href))event_name='facebook_click';
      else if(/instagram\.com/i.test(href))event_name='instagram_click';
      else if(/tiktok\.com/i.test(href))event_name='tiktok_click';
      if(event_name)sb.from('analytics_events').insert({event_name,page_path:path,vehicle_id:vid}).then(()=>{});
    }
    document.addEventListener('click',click);
    return()=>document.removeEventListener('click',click);
  },[]);
  return null;
}
