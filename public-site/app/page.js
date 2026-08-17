import Link from 'next/link';
import { getSiteData } from '../lib/supabase';
import {baseMetadata,jsonLd,absoluteUrl,SITE_NAME,DEFAULT_PHONE,DEFAULT_ADDRESS} from '../lib/seo';
import { Header, Footer, VehicleCard } from './components';
import PromoRotator from './PromoRotator';

const fallbackServices=['Oil Changes','Brake Service','Engine Diagnostics','Suspension & Steering','Tires & Wheels','General Repairs'];
export const revalidate = 60;
export const metadata=baseMetadata({
 title:'Used Cars & Auto Repair in Winnipeg',
 description:'Right Choice Auto Repair & Car Sales offers used vehicles for sale and professional auto repair services in Winnipeg, Manitoba.',
 path:'/'
});
export default async function Home(){
 const {settings,promotions,services,vehicles}=await getSiteData();
 const featured=vehicles.filter(v=>v.featured).slice(0,3).length?vehicles.filter(v=>v.featured).slice(0,3):vehicles.slice(0,3);
 const phone=settings.phone||DEFAULT_PHONE;
 const address=settings.address||DEFAULT_ADDRESS;
 const businessSchema={
   '@context':'https://schema.org',
   '@type':['AutoRepair','AutoDealer'],
   '@id':`${absoluteUrl('/')}#business`,
   name:SITE_NAME,
   url:absoluteUrl('/'),
   telephone:phone,
   image:absoluteUrl('/right-choice-logo.png'),
   logo:absoluteUrl('/right-choice-logo.png'),
   address:{'@type':'PostalAddress',streetAddress:'1129 Fife Street',addressLocality:'Winnipeg',addressRegion:'MB',postalCode:'R2X 2N1',addressCountry:'CA'},
   areaServed:{'@type':'City',name:'Winnipeg'},
   sameAs:[settings.facebook_url,settings.instagram_url,settings.tiktok_url].filter(Boolean)
 };
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(businessSchema)}}/><Header/><main>
  <PromoRotator promotions={promotions}/>
  <section className="hero"><div><p className="eyebrow">WINNIPEG • AUTO REPAIR • USED CARS</p><h1>Your <em>Right Choice</em><br/>for Cars &amp; Auto Care.</h1><p>{settings.home_intro||'Quality used vehicles and dependable auto repair from a local Winnipeg shop.'}</p><div className="actions"><Link className="btn red" href="/cars">View Cars for Sale</Link><Link className="btn outline" href="/repairs">Repair Services</Link></div></div><div className="heroArt"><img className="heroLogo" src="/right-choice-logo.png" alt="Right Choice Auto Repair & Car Sales"/></div></section>
  <section className="section"><div className="sectionHead"><div><p className="eyebrow">CARS FOR SALE</p><h2>Featured Vehicles</h2></div><Link href="/cars">View all cars →</Link></div>{featured.length?<div className="cards">{featured.map(v=><VehicleCard key={v.id} car={v}/>)}</div>:<div className="empty"><h3>New inventory is coming soon.</h3><p>Call us for current vehicle availability.</p><a href={`tel:+1${(settings.phone||'204-632-4296').replace(/\D/g,'').replace(/^1/,'')}`}>{settings.phone||'204-632-4296'}</a></div>}</section>
  <section className="section dark"><p className="eyebrow">AUTO REPAIR</p><h2>Reliable Auto Repair in Winnipeg</h2><div className="services">{(services.length?services.map(s=>s.name):fallbackServices).slice(0,6).map(name=><div key={name}><span>◆</span><h3>{name}</h3></div>)}</div><a className="btn red full" href={`tel:+1${(settings.phone||'204-632-4296').replace(/\D/g,'').replace(/^1/,'')}`}>Call Now: {settings.phone||'204-632-4296'}</a></section>
  <section className="section split"><div><p className="eyebrow">ABOUT RIGHT CHOICE</p><h2>Cars and Auto Repair Under One Roof</h2><p>{settings.about_short||'Right Choice Auto Repair & Car Sales serves Winnipeg drivers from 1129 Fife Street.'}</p></div><div className="panel"><strong>Visit Right Choice Auto</strong><p>{settings.address||'1129 Fife Street, Winnipeg, MB R2X 2N1'}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address||'1129 Fife Street, Winnipeg, MB R2X 2N1')}`} target="_blank" rel="noreferrer">Get directions →</a></div></section>
 </main><Footer/></>;
}
