'use client';
import {useEffect,useRef,useState} from 'react';
export default function SpamProtection({onToken}){
 const target=useRef(null),widgetId=useRef(null),callback=useRef(onToken),[error,setError]=useState('');
 useEffect(()=>{callback.current=onToken},[onToken]);
 useEffect(()=>{
  const key=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if(!key)return;
  let cancelled=false;
  function render(){if(cancelled||!target.current||!window.turnstile||widgetId.current!==null)return;widgetId.current=window.turnstile.render(target.current,{sitekey:key,callback:token=>callback.current(token),'expired-callback':()=>callback.current(''),'error-callback':()=>{callback.current('');setError('Security check unavailable. Please refresh and retry.')}})}
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=render;script.onerror=()=>setError('Security check could not load. Please refresh and retry.');document.head.appendChild(script);
  return()=>{cancelled=true;try{if(widgetId.current!==null)window.turnstile?.remove(widgetId.current)}catch{}script.remove()};
 },[]);
 if(!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)return null;
 return <div className="spamProtection"><div ref={target}/>{error&&<p role="alert">{error}</p>}</div>;
}
