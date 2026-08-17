export const SITE_NAME='Right Choice Auto Repair & Car Sales';
export const DEFAULT_SITE_URL='https://rightchoiceauto.ca';
export const DEFAULT_PHONE='204-632-4296';
export const DEFAULT_ADDRESS='1129 Fife Street, Winnipeg, MB R2X 2N1';

export function siteUrl(){
  return (process.env.NEXT_PUBLIC_SITE_URL||DEFAULT_SITE_URL).replace(/\/$/,'');
}
export function absoluteUrl(path='/'){
  const clean=path.startsWith('/')?path:`/${path}`;
  return `${siteUrl()}${clean}`;
}
export function jsonLd(data){
  return JSON.stringify(data).replace(/</g,'\\u003c');
}
export function baseMetadata({title,description,path='/',image='/right-choice-logo.png'}){
  const url=absoluteUrl(path);
  return {
    title,
    description,
    alternates:{canonical:url},
    openGraph:{
      type:'website',
      locale:'en_CA',
      siteName:SITE_NAME,
      title,
      description,
      url,
      images:[{url:absoluteUrl(image),alt:SITE_NAME}]
    },
    twitter:{
      card:'summary_large_image',
      title,
      description,
      images:[absoluteUrl(image)]
    }
  };
}
