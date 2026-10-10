const localBuckets = globalThis.__rcRateBuckets || new Map();
globalThis.__rcRateBuckets = localBuckets;

function clientIp(request){
  const forwarded=request.headers.get('x-forwarded-for')||'';
  return forwarded.split(',')[0]?.trim()||request.headers.get('x-real-ip')||'unknown';
}

function localLimit(key,limit,windowSeconds){
  const now=Date.now();
  const existing=localBuckets.get(key);
  if(!existing||existing.resetAt<=now){localBuckets.set(key,{count:1,resetAt:now+windowSeconds*1000});return {ok:true,remaining:limit-1,resetAt:now+windowSeconds*1000,mode:'local'}}
  existing.count+=1;
  if(localBuckets.size>5000){for(const[k,v]of localBuckets){if(v.resetAt<=now)localBuckets.delete(k)}}
  return {ok:existing.count<=limit,remaining:Math.max(0,limit-existing.count),resetAt:existing.resetAt,mode:'local'};
}

export async function rateLimit(request,{scope='form',limit=5,windowSeconds=600}={}){
  const ip=clientIp(request);
  const identity=`rc:${scope}:${ip}`;
  const url=process.env.UPSTASH_REDIS_REST_URL;
  const token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url||!token)return localLimit(identity,limit,windowSeconds);
  try{
    const response=await fetch(`${url}/pipeline`,{
      method:'POST',
      headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},
      body:JSON.stringify([['INCR',identity],['EXPIRE',identity,String(windowSeconds),'NX'],['TTL',identity]]),
      cache:'no-store'
    });
    if(!response.ok)throw new Error('rate-limit backend unavailable');
    const result=await response.json();
    const count=Number(result?.[0]?.result||0);
    const ttl=Number(result?.[2]?.result||windowSeconds);
    return {ok:count<=limit,remaining:Math.max(0,limit-count),resetAt:Date.now()+Math.max(1,ttl)*1000,mode:'distributed'};
  }catch(error){
    console.error('Rate limit backend error:',error?.message);
    return localLimit(identity,Math.max(2,Math.floor(limit/2)),windowSeconds);
  }
}
