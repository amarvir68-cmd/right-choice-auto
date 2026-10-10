const csp=[
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "upgrade-insecure-requests"
].join('; ');
const securityHeaders=[
 {key:'Content-Security-Policy',value:csp},
 {key:'X-Content-Type-Options',value:'nosniff'},
 {key:'X-Frame-Options',value:'DENY'},
 {key:'Referrer-Policy',value:'no-referrer'},
 {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), payment=(), usb=()'},
 {key:'Cross-Origin-Opener-Policy',value:'same-origin'},
 {key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},
 {key:'Strict-Transport-Security',value:'max-age=63072000; includeSubDomains; preload'}
];
export default {output:'standalone',poweredByHeader:false,compress:true,async headers(){return[{source:'/(.*)',headers:securityHeaders}]}};
