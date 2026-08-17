import { notFound } from 'next/navigation';
import { getSupabase, getSiteSettings } from '../../../lib/supabase';
import { Header,Footer,Money } from '../../components';
import {baseMetadata,jsonLd,absoluteUrl,SITE_NAME} from '../../../lib/seo';
export const revalidate=30;
async function getVehicle(id){
 const supabase=getSupabase();
 if(!supabase)return null;
 const {data}=await supabase.from('vehicles').select('*, vehicle_images(*)').eq('id',id).eq('published',true).in('status',['available','pending']).single();
 return data||null;
}
export async function generateMetadata({params}){
 const {id}=await params;
 const car=await getVehicle(id);
 if(!car)return {title:'Vehicle Not Found',robots:{index:false,follow:false}};
 const name=`${car.year} ${car.make} ${car.model}${car.trim?` ${car.trim}`:''}`;
 const description=`${name} for sale in Winnipeg${car.mileage?` with ${Number(car.mileage).toLocaleString('en-CA')} km`:''}. View photos, price and details from Right Choice Auto Repair & Car Sales.`;
 const image=[...(car.vehicle_images||[])].sort((a,b)=>a.sort_order-b.sort_order)[0]?.image_url||'/right-choice-logo.png';
 return baseMetadata({title:`${name} for Sale in Winnipeg`,description,path:`/cars/${car.id}`,image});
}

export default async function Vehicle({params}){const {id}=await params;const settings=await getSiteSettings();const phone=settings.phone||'204-632-4296';const phoneHref=`tel:+1${phone.replace(/\D/g,'').replace(/^1/,'')}`;const car=await getVehicle(id);if(!car)return notFound();const images=[...(car.vehicle_images||[])].sort((a,b)=>a.sort_order-b.sort_order);
 const name=`${car.year} ${car.make} ${car.model}${car.trim?` ${car.trim}`:''}`;
 const vehicleSchema={
  '@context':'https://schema.org',
  '@type':'Vehicle',
  name,
  url:absoluteUrl(`/cars/${car.id}`),
  image:images.map(x=>x.image_url),
  vehicleIdentificationNumber:car.vin||undefined,
  mileageFromOdometer:car.mileage?{'@type':'QuantitativeValue',value:Number(car.mileage),unitCode:'KMT'}:undefined,
  fuelType:car.fuel_type||undefined,
  vehicleTransmission:car.transmission||undefined,
  color:car.exterior_color||undefined,
  offers:car.price?{'@type':'Offer',price:Number(car.price),priceCurrency:'CAD',availability:car.status==='available'?'https://schema.org/InStock':'https://schema.org/LimitedAvailability',url:absoluteUrl(`/cars/${car.id}`),seller:{'@type':'Organization',name:SITE_NAME}}:undefined
 };
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(vehicleSchema)}}/><Header/><main><section className="detail"><div className="gallery">{images.length?images.map(img=><img key={img.id} src={img.image_url} alt={`${car.year} ${car.make} ${car.model}`}/>):<div className="photo big"><span>PHOTOS COMING SOON</span></div>}</div><div className="details"><p className="eyebrow">{car.status==='pending'?'PENDING SALE':'AVAILABLE VEHICLE'}</p><h1>{car.year} {car.make} {car.model}</h1><h2><Money value={car.price}/></h2>{car.status==='pending'&&<span className="statusBadge pending detailBadge">Pending Sale</span>}<dl><dt>Trim</dt><dd>{car.trim||'—'}</dd><dt>Mileage</dt><dd>{car.mileage?`${Number(car.mileage).toLocaleString()} km`:'—'}</dd><dt>Transmission</dt><dd>{car.transmission||'—'}</dd><dt>Drivetrain</dt><dd>{car.drivetrain||'—'}</dd><dt>Fuel</dt><dd>{car.fuel_type||'—'}</dd><dt>Colour</dt><dd>{car.exterior_color||'—'}</dd></dl>{car.description&&<p className="description">{car.description}</p>}<a className="btn red full" href={phoneHref}>Call About This Vehicle</a></div></section></main><Footer/></>}
