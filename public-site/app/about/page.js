import Link from 'next/link';
import {baseMetadata} from '../../lib/seo';
import{getSiteData}from '../../lib/supabase';
import{Header,Footer}from '../components';

export const revalidate=60;
export const metadata=baseMetadata({
 title:'About Our Winnipeg Auto Shop',
 description:'Learn about Right Choice Auto Repair & Car Sales, a Winnipeg shop providing practical auto repairs and used vehicle sales.',
 path:'/about'
});

export default async function About(){
 const{settings}=await getSiteData();
 return <><Header/><main className="aboutPage">
  <section className="pageHero aboutHero">
   <div>
    <p className="eyebrow">ABOUT RIGHT CHOICE</p>
    <h1>Local Service. Straightforward Advice. One Trusted Auto Shop.</h1>
    <p>Used vehicle sales and dependable automotive repair from a Winnipeg team focused on practical solutions and clear communication.</p>
   </div>
  </section>

  <section className="section aboutStory">
   <div className="aboutStoryCopy">
    <p className="eyebrow">OUR APPROACH</p>
    <h2>Your Local Winnipeg Auto Shop</h2>
    <p>{settings.about_full||'Right Choice Auto Repair & Car Sales helps Winnipeg drivers with dependable auto repairs and quality used vehicles. We focus on straightforward communication, practical solutions, and service you can feel confident about.'}</p>
    <p>Whether you are shopping for your next vehicle or need help keeping your current one on the road, our goal is to make the process simple, transparent and useful.</p>
   </div>
   <aside className="aboutPromise">
    <span className="aboutPromiseMark">RC</span>
    <h3>What you can expect</h3>
    <ul>
     <li>Clear, direct communication</li>
     <li>Practical repair recommendations</li>
     <li>Carefully presented used vehicles</li>
     <li>Local service from one Winnipeg location</li>
    </ul>
   </aside>
  </section>

  <section className="section dark aboutValues">
   <div className="sectionHead"><div><p className="eyebrow">WHY RIGHT CHOICE</p><h2>Built Around Everyday Drivers</h2></div></div>
   <div className="aboutValueGrid">
    <article><span>01</span><h3>Straightforward</h3><p>We keep the conversation clear so you understand the next step before making a decision.</p></article>
    <article><span>02</span><h3>Practical</h3><p>Our focus is on useful solutions for real vehicles, real budgets and real driving needs.</p></article>
    <article><span>03</span><h3>Local</h3><p>Right Choice Auto serves Winnipeg drivers from one convenient location on Fife Street.</p></article>
   </div>
  </section>

  <section className="section aboutCta">
   <div>
    <p className="eyebrow">VISIT RIGHT CHOICE</p>
    <h2>Need a Vehicle or Auto Repair?</h2>
    <p>Browse current inventory, request repair service, or contact our team directly.</p>
   </div>
   <div className="aboutCtaActions">
    <Link className="btn red" href="/cars">Browse Vehicles</Link>
    <Link className="btn outline" href="/repairs#request-service">Request Repair Service</Link>
    <Link className="textLink" href="/contact">Contact us →</Link>
   </div>
  </section>
 </main><Footer/></>;
}
