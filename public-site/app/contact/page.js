import {baseMetadata} from '../../lib/seo';
import{getSiteData}from '../../lib/supabase';import{Header,Footer}from '../components';
export const revalidate=60;
export const metadata=baseMetadata({
 title:'Contact Right Choice Auto in Winnipeg',
 description:'Contact Right Choice Auto Repair & Car Sales at 1129 Fife Street in Winnipeg for used vehicles and auto repair service.',
 path:'/contact'
});
export default async function Contact(){const{settings}=await getSiteData();const phone=settings.phone||'204-632-4296';const address=settings.address||'1129 Fife Street, Winnipeg, MB R2X 2N1';const phoneHref=`tel:+1${phone.replace(/\D/g,'').replace(/^1/,'')}`;const map=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;return <><Header/><main><section className="pageHero"><p className="eyebrow">CONTACT</p><h1>Come see us in Winnipeg.</h1></section><section className="section contact"><div><small>PHONE</small><a href={phoneHref}>{phone}</a></div><div><small>ADDRESS</small><strong>{address}</strong><a href={map} target="_blank" rel="noreferrer">Get directions →</a></div>{settings.hours&&<div><small>HOURS</small><strong>{settings.hours}</strong></div>}</section></main><Footer/></>}
