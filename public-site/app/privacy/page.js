import {Header,Footer} from '../components';
import Link from 'next/link';

export const metadata={
 title:'Privacy | Right Choice Auto',
 description:'How Right Choice Auto handles website inquiry, repair-request and basic analytics information.',
 robots:{index:true,follow:true}
};

export default function Privacy(){
 return <><Header/><main className="privacyPage privacyV29">
  <section className="privacyIntro">
   <p className="eyebrow">YOUR INFORMATION</p>
   <h1>Privacy</h1>
   <p className="privacyLead">A plain-language overview of what information this website collects, why it is used, and how to contact Right Choice Auto about it.</p>
  </section>

  <section className="privacySummary" aria-label="Privacy at a glance">
   <article><span>01</span><strong>What we collect</strong><p>Information you choose to send in vehicle inquiries or repair requests.</p></article>
   <article><span>02</span><strong>Why we use it</strong><p>To respond, follow up, coordinate service and operate the website.</p></article>
   <article><span>03</span><strong>Who can access it</strong><p>Authorized staff and service providers needed to operate the website securely.</p></article>
  </section>

  <section className="privacyContent">
   <article><h2>Information you provide</h2><p>When you send a vehicle inquiry or repair request, we collect the information you choose to provide, such as your name, email address, phone number, message, vehicle information, requested service and preferred date.</p></article>
   <article><h2>How we use information</h2><p>We use inquiry information to respond to you, follow up about a vehicle, and coordinate requested automotive service. Authorized staff can access these records through the private management portal.</p></article>
   <article><h2>Website analytics and security</h2><p>The website records limited page and interaction analytics to understand website usage. Security services may process technical information needed to prevent spam, abuse and attacks. We do not ask you to submit passwords, payment-card numbers or other highly sensitive information through website inquiry forms.</p></article>
   <article><h2>Service providers</h2><p>Our website uses third-party infrastructure for hosting, database services and optional anti-spam protection. Those providers may process information as necessary to operate and protect the website.</p></article>
   <article><h2>Retention and requests</h2><p>Inquiry and repair-request records should be retained only as long as reasonably needed for customer follow-up, business records and applicable legal requirements. You may ask us about information you submitted, request a correction, or request deletion where appropriate.</p></article>
  </section>

  <section className="privacyContact">
   <div><p className="eyebrow">QUESTIONS OR REQUESTS</p><h2>Contact Right Choice Auto</h2><p>For privacy questions or requests, contact us using the details on our contact page.</p></div>
   <Link className="btn red" href="/contact">Contact Us</Link>
  </section>

  <p className="privacyNote">Please do not include passwords, payment information, government identification numbers or other highly sensitive information in website messages.</p>
 </main><Footer/></>;
}
