import {baseMetadata} from '../../lib/seo';
import{getSiteData}from '../../lib/supabase';import{Header,Footer}from '../components';export const revalidate=60;
export const metadata=baseMetadata({
 title:'About Our Winnipeg Auto Shop',
 description:'Learn about Right Choice Auto Repair & Car Sales, a Winnipeg shop providing practical auto repairs and used vehicle sales.',
 path:'/about'
});export default async function About(){const{settings}=await getSiteData();return <><Header/><main><section className="pageHero"><p className="eyebrow">ABOUT US</p><h1>Right Choice Auto Repair &amp; Car Sales</h1></section><section className="section prose"><h2>Your Local Winnipeg Auto Shop</h2><p>{settings.about_full||'Right Choice Auto Repair & Car Sales helps Winnipeg drivers with dependable auto repairs and quality used vehicles. We focus on straightforward communication, practical solutions, and service you can feel confident about.'}</p></section></main><Footer/></>}
