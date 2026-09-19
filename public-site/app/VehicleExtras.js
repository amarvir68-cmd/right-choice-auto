'use client';
import {useEffect,useState,useRef} from 'react';
export function VehicleGallery({images,name}){
 const [index,setIndex]=useState(0);
 const [full,setFull]=useState(false);
 const [zoom,setZoom]=useState(false);
 const [startX,setStartX]=useState(null);
 const closeRef=useRef(null);
 const openerRef=useRef(null);
 const count=images.length;
 const next=()=>{setZoom(false);setIndex(i=>(i+1)%count)};
 const previous=()=>{setZoom(false);setIndex(i=>(i+count-1)%count)};
 useEffect(()=>{
  if(!full)return;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  function key(e){if(e.key==='Escape'){setFull(false);setZoom(false)}else if(e.key==='ArrowLeft'){e.preventDefault();setZoom(false);setIndex(i=>(i+count-1)%count)}else if(e.key==='ArrowRight'){e.preventDefault();setZoom(false);setIndex(i=>(i+1)%count)}}
  const onTab=e=>{if(e.key!=='Tab')return;const focusable=[...document.querySelectorAll('.rcLightbox button:not(:disabled)')];if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}};
  window.addEventListener('keydown',key);window.addEventListener('keydown',onTab);closeRef.current?.focus();
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('keydown',onTab);document.body.style.overflow=oldOverflow;openerRef.current?.focus()};
 },[full,count]);
 if(!count)return <div className="photo big"><span>PHOTOS COMING SOON</span></div>;
 return <div className="vehicleGallery">
  <div className="galleryStage">
   <button type="button" className="galleryMain" ref={openerRef} onClick={()=>{setZoom(false);setFull(true)}} aria-label="Enlarge vehicle photo"><img src={images[index].image_url} alt={`${name} photo ${index+1} of ${count}`} decoding="async" fetchPriority={index===0?"high":"auto"}/><span>⛶ View photos · {index+1} / {count}</span></button>
   {count>1&&<><button type="button" className="galleryNav galleryPrev" onClick={previous} aria-label="Previous vehicle photo">‹</button><button type="button" className="galleryNav galleryNext" onClick={next} aria-label="Next vehicle photo">›</button></>}
  </div>
  {count>1&&<div className="galleryThumbs" aria-label="Choose vehicle photo">{images.map((img,i)=><button type="button" className={index===i?'selected':''} key={img.id||i} onClick={()=>{setZoom(false);setIndex(i)}} aria-label={`Show photo ${i+1}`} aria-pressed={index===i}><img loading="lazy" src={img.image_url} alt=""/></button>)}</div>}
  {full&&<div className="galleryLightbox rcLightbox" role="dialog" aria-modal="true" aria-label="Vehicle photo viewer" onTouchStart={e=>setStartX(e.touches[0]?.clientX??null)} onTouchEnd={e=>{if(startX===null)return;const distance=e.changedTouches[0].clientX-startX;if(Math.abs(distance)>55&&count>1){if(distance<0)next();else previous()}setStartX(null)}}>
   <button type="button" className="galleryClose" ref={closeRef} onClick={()=>{setFull(false);setZoom(false)}} aria-label="Close photo viewer">× Close</button>
   <div className="rcLightboxStage">
    {count>1&&<button type="button" className="rcLightboxArrow" onClick={previous} aria-label="Previous photo">‹</button>}
    <button type="button" className={`rcLightboxImage ${zoom?'isZoomed':''}`} onClick={()=>setZoom(z=>!z)} aria-label={zoom?'Fit entire photo':'Zoom photo'}><img src={images[index].image_url} alt={`${name} large photo ${index+1} of ${count}`}/></button>
    {count>1&&<button type="button" className="rcLightboxArrow" onClick={next} aria-label="Next photo">›</button>}
   </div>
   <div className="rcLightboxBottom"><span>{index+1} / {count} · {zoom?'Click photo to fit':'Click photo to zoom'} · Use arrow keys or swipe</span>{count>1&&<div className="rcLightboxThumbs">{images.map((img,i)=><button type="button" key={img.id||i} className={i===index?'selected':''} onClick={()=>{setIndex(i);setZoom(false)}} aria-label={`Show photo ${i+1}`}><img src={img.image_url} alt=""/></button>)}</div>}</div>
  </div>}
 </div>
}
export function VehicleActions({name}){const[message,setMessage]=useState('');async function share(){if(navigator.share){try{await navigator.share({title:name,url:location.href});return}catch{return}}try{await navigator.clipboard.writeText(location.href);setMessage('Vehicle link copied.')}catch{setMessage('Copy this page URL from your address bar.')}}return <div className="vehicleActions"><button type="button" onClick={share}>↗ Share vehicle</button>{message&&<small role="status">{message}</small>}</div>}
