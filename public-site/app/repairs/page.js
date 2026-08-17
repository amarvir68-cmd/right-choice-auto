import {baseMetadata} from '../../lib/seo';
import {getSiteData} from '../../lib/supabase';
import {Header,Footer} from '../components';

export const revalidate=60;
export const metadata=baseMetadata({
 title:'Auto Repair Services in Winnipeg',
 description:'Auto repair services in Winnipeg including oil changes, brakes, diagnostics, suspension, steering, tires and general repairs.',
 path:'/repairs',
 image:'/repair/hero.jpg'
});

const fallbackServices=[
 {id:'oil',name:'Oil Changes',description:'Routine oil and filter service to help protect your engine.'},
 {id:'brakes',name:'Brake Service',description:'Brake inspections, pads, rotors and related repairs.'},
 {id:'diagnostics',name:'Engine Diagnostics',description:'Warning lights, drivability issues and mechanical troubleshooting.'},
 {id:'suspension',name:'Suspension & Steering',description:'Repairs for ride quality, handling and steering concerns.'},
 {id:'tires',name:'Tires & Wheels',description:'Tire-related service, wheel concerns and seasonal help.'},
 {id:'general',name:'General Repairs',description:'Everyday maintenance and practical repair solutions.'}
];

function serviceImage(name=''){
 const n=name.toLowerCase();
 if(n.includes('oil')) return '/repair/oil-changes.jpg';
 if(n.includes('brake')) return '/repair/brake-service.jpg';
 if(n.includes('diagnostic')||n.includes('engine')) return '/repair/engine-diagnostics.jpg';
 if(n.includes('suspension')||n.includes('steering')) return '/repair/suspension-steering.jpg';
 if(n.includes('tire')||n.includes('wheel')) return '/repair/tires-wheels.jpg';
 if(n.includes('a/c')||n.includes('air condition')||n.includes('ac service')) return '/repair/ac-service.jpg';
 if(n.includes('transmission')) return '/repair/transmission-service.jpg';
 return '/repair/general-repairs.jpg';
}

function serviceIcon(name=''){
 const n=name.toLowerCase();
 if(n.includes('oil')) return '◉';
 if(n.includes('brake')) return '◎';
 if(n.includes('diagnostic')||n.includes('engine')) return '▣';
 if(n.includes('suspension')||n.includes('steering')) return '◆';
 if(n.includes('tire')||n.includes('wheel')) return '◌';
 if(n.includes('a/c')||n.includes('air condition')) return '✦';
 if(n.includes('transmission')) return '⚙';
 return '⌁';
}

export default async function Repairs(){
 const {services,settings}=await getSiteData();
 const items=services.length?services:fallbackServices;
 const phone=settings.phone||'204-632-4296';
 const phoneHref=`tel:+1${phone.replace(/\D/g,'').replace(/^1/,'')}`;

 return <><Header/><main className="repairPage">
   <section className="repairHero">
     <img src="/repair/hero.jpg" alt="Automotive repair work being performed in a professional shop"/>
     <div className="repairHeroShade"></div>
     <div className="repairHeroCopy">
       <p className="eyebrow">WINNIPEG AUTO REPAIR</p>
       <h1>Auto Repair Services</h1>
       <p className="repairLead">Straightforward service. Dependable repairs. Local experience you can count on.</p>
       <p>From routine maintenance to diagnostics and repairs, Right Choice Auto helps keep Winnipeg drivers safe and moving.</p>
       <a className="btn red" href={phoneHref}>Call Now</a>
     </div>
   </section>

   <section className="section repairServicesSection">
     <div className="repairIntro">
       <p className="eyebrow">WHAT WE DO</p>
       <h2>Complete Auto Repair &amp; Maintenance</h2>
       <p>Explore our repair services below. If you are not sure what your vehicle needs, call us and we’ll help you with the next step.</p>
     </div>
     <div className="repairCards">
       {items.map(s=><article className="repairCard" key={s.id}>
         <div className="repairCardImage">
           <img src={serviceImage(s.name)} alt={`${s.name} auto repair service`}/>
         </div>
         <div className="repairCardBody">
           <div className="repairCardTitle"><span>{serviceIcon(s.name)}</span><h3>{s.name}</h3></div>
           <p>{s.description||'Contact Right Choice Auto for service details.'}</p>
         </div>
       </article>)}
     </div>
     <div className="repairCTA">
       <div><p className="eyebrow">NEED AUTO REPAIR?</p><h2>Let’s Get Your Vehicle Looked At.</h2><p>Call us and tell us what your vehicle is doing. We’ll help you with the next step.</p></div>
       <a className="btn red" href={phoneHref}>Call {phone}</a>
     </div>
   </section>
 </main><Footer/></>;
}
