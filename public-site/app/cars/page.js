import { getSiteData } from '../../lib/supabase';
import { Header, Footer, VehicleCard } from '../components';
export const revalidate=30;
export default async function Cars(){const {vehicles}=await getSiteData();return <><Header/><main><section className="pageHero"><p className="eyebrow">RIGHT CHOICE INVENTORY</p><h1>Cars for Sale</h1><p>Browse current vehicles. Inventory updates automatically when we add or mark a vehicle sold.</p></section><section className="section">{vehicles.length?<div className="cards">{vehicles.map(v=><VehicleCard key={v.id} car={v}/>)}</div>:<div className="empty"><h2>No vehicles published right now.</h2><p>Call us for the latest availability.</p><a href="tel:+12046324296">204-632-4296</a></div>}</section></main><Footer/></>}
