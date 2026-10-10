import {baseMetadata} from '../../lib/seo';
import{getSiteData}from '../../lib/supabase';
import{Header,Footer}from '../components';

export const revalidate=60;
export const metadata=baseMetadata({
 title:'Contact Right Choice Auto in Winnipeg',
 description:'Contact Right Choice Auto Repair & Car Sales at 1129 Fife Street in Winnipeg for used vehicles and auto repair service.',
 path:'/contact'
});

export default async function Contact(){
 const{settings}=await getSiteData();
 const phone=settings.phone||'204-632-4296';
 const address=settings.address||'1129 Fife Street, Winnipeg, MB R2X 2N1';
 const phoneHref=`tel:+1${phone.replace(/\D/g,'').replace(/^1/,'')}`;
 const map=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
 return <><Header/><main className="contactPage">
  <section className="pageHero contactHero">
   <div>
    <p className="eyebrow">CONTACT RIGHT CHOICE</p>
    <h1>Easy to Reach. Easy to Visit.</h1>
    <p>Call about a vehicle, ask about a repair, or stop by our Winnipeg location. We’ll help you figure out the next step.</p>
   </div>
  </section>

  <section className="section contactShowcase">
   <div className="contactPrimary">
    <p className="eyebrow">GET IN TOUCH</p>
    <h2>Talk to Our Team</h2>
    <p>For the fastest response, call us directly during business hours.</p>
    <a className="contactPhone" href={phoneHref}>{phone}</a>
    <div className="contactPrimaryActions">
     <a className="btn red" href={phoneHref}>Call Right Choice Auto</a>
     <a className="btn outline" href={map} target="_blank" rel="noreferrer">Get Directions ↗</a>
    </div>
   </div>

   <div className="contactInfoGrid">
    <article>
     <span className="contactIcon" aria-hidden="true">☎</span>
     <small>PHONE</small>
     <strong>{phone}</strong>
     <p>Vehicle questions, repair requests and general inquiries.</p>
    </article>
    <article>
     <span className="contactIcon" aria-hidden="true">⌖</span>
     <small>ADDRESS</small>
     <strong>{address}</strong>
     <p>Visit our Winnipeg shop for vehicle sales and automotive service.</p>
    </article>
    <article>
     <span className="contactIcon" aria-hidden="true">◷</span>
     <small>HOURS</small>
     <strong>{settings.hours||'Call us for current business hours.'}</strong>
     <p>Calling ahead is recommended if you are coming to view a vehicle.</p>
    </article>
   </div>
  </section>

  <section className="section dark visitPanel">
   <div>
    <p className="eyebrow">1129 FIFE STREET · WINNIPEG</p>
    <h2>One Location for Cars &amp; Auto Repair</h2>
    <p>Right Choice Auto brings used vehicle sales and repair service together in one place, making it easier to get help without bouncing between different businesses.</p>
   </div>
   <a className="visitMapCard" href={map} target="_blank" rel="noreferrer">
    <span>WINNIPEG, MANITOBA</span>
    <strong>{address}</strong>
    <b>Open in Google Maps →</b>
   </a>
  </section>
 </main><Footer/></>;
}
