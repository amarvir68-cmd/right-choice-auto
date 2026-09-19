'use client';
import {useEffect,useState,useRef} from 'react';
import {createPortal} from 'react-dom';

export default function ListingPhotoGallery({images,name,pending=false}){
 const [index,setIndex]=useState(0);
 const [open,setOpen]=useState(false);
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const closeRef=useRef(null),triggerRef=useRef(null);
 useEffect(()=>{
  if(!open)return;
  function onKey(event){
   if(event.key==='Escape')setOpen(false);
   if(event.key==='Tab'){const buttons=[...document.querySelectorAll('.vehiclePhotoOverlay button:not(:disabled)')];if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
   if(event.key==='ArrowLeft')setIndex(i=>(i+images.length-1)%images.length);
   if(event.key==='ArrowRight')setIndex(i=>(i+1)%images.length);
  }
  document.addEventListener('keydown',onKey);
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  closeRef.current?.focus();
  return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=previous;triggerRef.current?.focus()};
 },[open,images.length]);
 if(!images.length)return <div className="photo"><span>PHOTO COMING SOON</span></div>;
 const prev=()=>setIndex(i=>(i+images.length-1)%images.length);
 const next=()=>setIndex(i=>(i+1)%images.length);
 return <>
  <button type="button" ref={triggerRef} className="photo listingPhotoButton" onClick={()=>setOpen(true)} aria-label={`Enlarge photos of ${name}`}>
   <img src={images[0].image_url} alt={name} fetchPriority="high" decoding="async"/>
   {pending&&<span className="pendingWatermark">PENDING</span>}
   <span className="photoZoomLabel">⛶ View photos{images.length>1?` (${images.length})`:''}</span>
  </button>
  {open&&mounted&&createPortal(<div className="vehiclePhotoOverlay" role="dialog" aria-modal="true" aria-label={`${name} photos`}>
   <button type="button" ref={closeRef} className="photoOverlayClose" onClick={()=>setOpen(false)} aria-label="Close photo gallery">×</button>
   <div className="photoOverlayStage">
    {images.length>1&&<button type="button" className="photoOverlayArrow" onClick={prev} aria-label="Previous photo">‹</button>}
    <img src={images[index].image_url} alt={`${name}, photo ${index+1} of ${images.length}`} decoding="async"/>
    {images.length>1&&<button type="button" className="photoOverlayArrow" onClick={next} aria-label="Next photo">›</button>}
   </div>
   <div className="photoOverlayFooter"><span>{index+1} / {images.length}</span><span>{name}</span></div>
   {images.length>1&&<div className="photoOverlayThumbs">{images.map((image,i)=><button type="button" key={image.id||i} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`View photo ${i+1}`}><img src={image.image_url} alt="" loading="lazy" decoding="async"/></button>)}</div>}
  </div>,document.body)}
 </>;
}
