import './globals.css';
import AnalyticsTracker from './AnalyticsTracker';
import {SITE_NAME,siteUrl,absoluteUrl} from '../lib/seo';

export const metadata={
  metadataBase:new URL(siteUrl()),
  title:{default:`${SITE_NAME} | Winnipeg`,template:`%s | Right Choice Auto`},
  description:'Used cars for sale and professional auto repair services in Winnipeg, Manitoba.',
  applicationName:SITE_NAME,
  category:'automotive',
  keywords:['used cars Winnipeg','cars for sale Winnipeg','auto repair Winnipeg','auto repair shop Winnipeg','used vehicles Winnipeg'],
  authors:[{name:SITE_NAME}],
  creator:SITE_NAME,
  publisher:SITE_NAME,
  formatDetection:{telephone:true,address:true,email:false},
  openGraph:{siteName:SITE_NAME,locale:'en_CA',type:'website',images:[{url:absoluteUrl('/right-choice-logo.png'),alt:SITE_NAME}]},
  twitter:{card:'summary_large_image',images:[absoluteUrl('/right-choice-logo.png')]},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}){
  return <html lang="en-CA"><body><AnalyticsTracker/>{children}</body></html>;
}
