import {baseMetadata} from '../../lib/seo';
import {getSiteData} from '../../lib/supabase';
import {Header,Footer} from '../components';
import FavouritesBrowser from '../FavouritesBrowser';
export const revalidate=30;
export const metadata=baseMetadata({title:'Saved Vehicles',description:'Your saved used vehicles at Right Choice Auto in Winnipeg.',path:'/favourites'});
export default async function Favourites(){const{vehicles}=await getSiteData();return <><Header/><main><section className="pageHero"><p className="eyebrow">YOUR SHORTLIST</p><h1>Saved Vehicles</h1></section><section className="section"><FavouritesBrowser vehicles={vehicles}/></section></main><Footer/></>}
