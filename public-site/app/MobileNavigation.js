'use client';
import {useState} from 'react';
import Link from 'next/link';
const links=[['/','Home'],['/cars','Cars for Sale'],['/repairs','Auto Repair'],['/about','About Us'],['/contact','Contact']];
export default function MobileNavigation(){const[open,setOpen]=useState(false);return <div className="mobileNavigation"><button type="button" className="mobileMenuButton" aria-expanded={open} aria-controls="mobile-site-links" onClick={()=>setOpen(x=>!x)}>{open?'Close menu ✕':'Menu ☰'}</button>{open&&<nav id="mobile-site-links" className="mobileNavLinks" aria-label="Mobile navigation">{links.map(([url,label])=><Link key={url} href={url} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}</div>}
