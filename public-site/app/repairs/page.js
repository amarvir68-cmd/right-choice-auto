import {baseMetadata} from '../../lib/seo';
import {getSiteData} from '../../lib/supabase';import{Header,Footer}from '../components';
export const revalidate=60;
export const metadata=baseMetadata({
 title:'Auto Repair Services in Winnipeg',
 description:'Auto repair services in Winnipeg including oil changes, brakes, diagnostics, suspension, steering, tires and general repairs.',
 path:'/repairs'
});
export default async function Repairs(){const {services,settings}=await getSiteData();const phone=settings.phone||'204-632-4296';const phoneHref=`tel:+1${phone.replace(/\D/g,'').replace(/^1/,'')}`;return <><Header/><main><section className="pageHero"><p className="eyebrow">AUTO REPAIR</p><h1>Repair Services</h1><p>Call us about your vehicle and we’ll help you with the next step.</p></section><section className="section"><div className="services detailed">{services.map(s=><article key={s.id}><span>◆</span><h3>{s.name}</h3><p>{s.description}</p></article>)}</div><a className="btn red full" href={phoneHref}>Call {phone}</a></section></main><Footer/></>}
