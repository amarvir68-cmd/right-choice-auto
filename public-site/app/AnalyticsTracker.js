'use client';
import {useEffect} from 'react';
function vehicleId(path){const m=path.match(/^\/cars\/([0-9a-f-]{30,})/i);return m?m[1]:null}
function record(event_name,page_path,vehicle_id){fetch('/api/analytics',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event_name,page_path,vehicle_id}),keepalive:true,credentials:'same-origin'}).catch(()=>{})}
export default function AnalyticsTracker(){
 useEffect(()=>{
  const path=window.location.pathname,vid=vehicleId(path);
  record(vid?'vehicle_view':'page_view',path,vid);
  function click(e){const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';let event_name=null;if(href.startsWith('tel:'))event_name='call_click';else if(/google\.com\/maps/i.test(href))event_name='directions_click';else if(/facebook\.com/i.test(href))event_name='facebook_click';else if(/instagram\.com/i.test(href))event_name='instagram_click';else if(/tiktok\.com/i.test(href))event_name='tiktok_click';if(event_name)record(event_name,path,vid)}
  document.addEventListener('click',click);return()=>document.removeEventListener('click',click)
 },[]);return null;
}
