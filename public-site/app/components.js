import Link from 'next/link';
import { getSiteSettings } from '../lib/supabase';

const DEFAULT_PHONE='204-632-4296';
const DEFAULT_ADDRESS='1129 Fife Street, Winnipeg, MB R2X 2N1';
function phoneHref(phone){return `tel:+1${String(phone||DEFAULT_PHONE).replace(/\D/g,'').replace(/^1/,'')}`}

export function Logo(){return <Link className="logo" href="/" aria-label="Right Choice Auto Repair & Car Sales home"><img src="/right-choice-logo.png" alt="Right Choice Auto Repair & Car Sales"/></Link>}
export async function Header(){const s=await getSiteSettings();const phone=s.phone||DEFAULT_PHONE;return <header className="header"><Logo/><nav><Link href="/">Home</Link><Link href="/cars">Cars for Sale</Link><Link href="/repairs">Auto Repair</Link><Link href="/about">About Us</Link><Link href="/contact">Contact</Link></nav><a className="call" href={phoneHref(phone)} aria-label={`Call Right Choice Auto at ${phone}`}>☎ Call Now</a></header>}
export async function Footer(){const s=await getSiteSettings();const phone=s.phone||DEFAULT_PHONE;const address=s.address||DEFAULT_ADDRESS;return <footer><Logo/><p>{address}</p><a href={phoneHref(phone)}>{phone}</a>{s.hours&&<p>{s.hours}</p>}<small>© {new Date().getFullYear()} Right Choice Auto Repair &amp; Car Sales</small></footer>}
export function Money({value}){if(value===null||value===undefined||value==='')return <>Call for price</>;return <>${Number(value).toLocaleString('en-CA',{maximumFractionDigits:0})}</>}
export function VehicleCard({car}){const image=[...(car.vehicle_images||[])].sort((a,b)=>a.sort_order-b.sort_order)[0]?.image_url;return <article className="vehicleCard"><Link href={`/cars/${car.id}`} className="photo">{image?<img src={image} alt={`${car.year} ${car.make} ${car.model}`}/>:<span>PHOTO COMING SOON</span>}</Link><div className="cardBody"><div className="price"><Money value={car.price}/></div><h3>{car.year} {car.make} {car.model}</h3><p>{car.trim || ''}{car.mileage ? ` • ${Number(car.mileage).toLocaleString()} km` : ''}</p><Link className="textLink" href={`/cars/${car.id}`}>View vehicle →</Link></div></article>}
