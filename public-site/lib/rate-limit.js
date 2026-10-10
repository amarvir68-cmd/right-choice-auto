import {createClient} from '@supabase/supabase-js';

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

async function upstashLimit(identity,limit,windowSeconds){
  const url=process.env.UPSTASH_REDIS_REST_URL;
  const token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url||!token)return null;
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
  return {ok:count<=limit,remaining:Math.max(0,limit-count),resetAt:Date.now()+Math.max(1,ttl)*1000,mode:'distributed-upstash'};
}

async function supabaseLimit(identity,limit,windowSeconds){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return null;
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await supabase.rpc('consume_rate_limit',{
    p_key:identity,
    p_limit:limit,
    p_window_seconds:windowSeconds
  });
  if(error)throw new Error(`supabase rate-limit unavailable: ${error.code||'rpc_error'}`);
  const row=Array.isArray(data)?data[0]:data;
  if(!row||typeof row.ok!=='boolean')throw new Error('supabase rate-limit returned invalid response');
  const resetMs=Date.parse(row.reset_at||'');
  return {
    ok:row.ok,
    remaining:Number(row.remaining||0),
    resetAt:Number.isFinite(resetMs)?resetMs:Date.now()+windowSeconds*1000,
    mode:'distributed-supabase'
  };
}

export async function rateLimit(request,{scope='form',limit=5,windowSeconds=600}={}){
  const ip=clientIp(request);
  const identity=`rc:${scope}:${ip}`;
  try{
    const upstash=await upstashLimit(identity,limit,windowSeconds);
    if(upstash)return upstash;
  }catch(error){
    console.error('Upstash rate limit backend error:',error?.message);
  }
  try{
    const supabase=await supabaseLimit(identity,limit,windowSeconds);
    if(supabase)return supabase;
  }catch(error){
    console.error('Supabase rate limit backend error:',error?.message);
  }
  return localLimit(identity,Math.max(2,Math.floor(limit/2)),windowSeconds);
}
