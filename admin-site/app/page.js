'use client';
import {useEffect,useState} from 'react';
import {supabaseBrowser} from '../lib/supabase';

const blankVehicle={year:'',make:'',model:'',trim:'',price:'',mileage:'',vin:'',transmission:'',drivetrain:'',fuel_type:'',exterior_color:'',interior_color:'',description:'',status:'available',featured:false,published:false};
export default function Admin(){
 const [supabase]=useState(()=>supabaseBrowser()); const [session,setSession]=useState(undefined); const [tab,setTab]=useState('inventory'); const [notice,setNotice]=useState('');
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[supabase]);
 if(session===undefined)return <div className="center">Loading…</div>;
 if(!session)return <Login supabase={supabase}/>;
 return <AdminGate supabase={supabase}><Dashboard supabase={supabase} session={session} tab={tab} setTab={setTab} notice={notice} setNotice={setNotice}/></AdminGate>;
}
function AdminGate({supabase,children}){const[state,setState]=useState('checking');useEffect(()=>{supabase.from('admin_users').select('user_id').limit(1).then(({data,error})=>{setState(!error&&data?.length?'ok':'denied')})},[supabase]);if(state==='checking')return <div className="center">Verifying admin access…</div>;if(state==='denied')return <main className="login"><div className="loginCard"><h1>Access denied</h1><p>This account is authenticated but is not approved as a Right Choice administrator.</p><button onClick={()=>supabase.auth.signOut()}>Sign out</button></div></main>;return children}
function Login({supabase}){const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[error,setError]=useState('');const[loading,setLoading]=useState(false);async function login(e){e.preventDefault();setError('');setLoading(true);const{error}=await supabase.auth.signInWithPassword({email,password});if(error)setError(error.message);setLoading(false)}return <main className="login"><section className="loginShell"><div className="loginBrand"><img src="/right-choice-logo.png" alt="Right Choice Auto Repair & Car Sales"/><div className="loginBrandCopy"><span className="eyebrow">PRIVATE STAFF PORTAL</span><h1>Manage your inventory and website in one place.</h1><p>Add vehicles, publish promotions, update repair services, and change business information without touching the public website code.</p></div><div className="securityNote"><span className="lockIcon">✓</span><div><strong>Protected access</strong><small>Only approved Right Choice administrator accounts can continue past sign in.</small></div></div></div><div className="loginCard"><div className="loginCardHeader"><span className="loginKicker">RIGHT CHOICE AUTO</span><h2>Welcome back</h2><p>Sign in to the private content manager.</p></div><form onSubmit={login}><label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="error">{error}</div>}<button className="loginButton" disabled={loading}>{loading?'Signing in…':'Sign in to Manager'}</button></form><p className="loginHelp">This page is for authorized staff only.</p></div></section></main>}
function Dashboard({supabase,tab,setTab,notice,setNotice}){return <><header className="top"><div><strong>RIGHT <b>CHOICE</b></strong><small>Private Content Manager</small></div><button className="secondary" onClick={()=>supabase.auth.signOut()}>Log out</button></header><div className="shell"><aside>{[['analytics','Dashboard'],['inventory','Inventory'],['add','Add Vehicle'],['promos','Promotions'],['services','Repair Services'],['site','Website Info']].map(([id,name])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'active':''}>{name}</button>)}</aside><main className="work">{notice&&<div className="notice">{notice}<button onClick={()=>setNotice('')}>×</button></div>}{tab==='analytics'&&<Analytics supabase={supabase}/>} {tab==='inventory'&&<Inventory supabase={supabase} setNotice={setNotice}/>} {tab==='add'&&<VehicleForm supabase={supabase} onDone={()=>{setNotice('Vehicle saved.');setTab('inventory')}}/>}{tab==='promos'&&<Promos supabase={supabase} setNotice={setNotice}/>} {tab==='services'&&<Services supabase={supabase} setNotice={setNotice}/>} {tab==='site'&&<SiteInfo supabase={supabase} setNotice={setNotice}/>}</main></div></>}
function Analytics({supabase}){
 const[data,setData]=useState(null);
 useEffect(()=>{(async()=>{
   const since30=new Date(Date.now()-30*86400000).toISOString(),since7=new Date(Date.now()-7*86400000).toISOString(),today=new Date();today.setHours(0,0,0,0);
   const[eventsRes,vehiclesRes]=await Promise.all([supabase.from('analytics_events').select('event_name,page_path,vehicle_id,created_at').gte('created_at',since30),supabase.from('vehicles').select('id,year,make,model,status')]);
   const events=eventsRes.data||[],vehicles=vehiclesRes.data||[];
   const count=(name,after)=>events.filter(x=>x.event_name===name&&(!after||new Date(x.created_at)>=after)).length;
   const views=events.filter(x=>x.event_name==='page_view'||x.event_name==='vehicle_view');
   const byVehicle={};events.filter(x=>x.event_name==='vehicle_view'&&x.vehicle_id).forEach(x=>byVehicle[x.vehicle_id]=(byVehicle[x.vehicle_id]||0)+1);
   const topId=Object.entries(byVehicle).sort((a,b)=>b[1]-a[1])[0];
   const topCar=topId?vehicles.find(v=>v.id===topId[0]):null;
   const pageCounts={};views.forEach(x=>pageCounts[x.page_path]=(pageCounts[x.page_path]||0)+1);
   const topPages=Object.entries(pageCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
   setData({today:views.filter(x=>new Date(x.created_at)>=today).length,week:views.filter(x=>new Date(x.created_at)>=new Date(since7)).length,month:views.length,calls:count('call_click'),social:count('facebook_click')+count('instagram_click')+count('tiktok_click'),available:vehicles.filter(v=>v.status==='available').length,pending:vehicles.filter(v=>v.status==='pending').length,sold:vehicles.filter(v=>v.status==='sold').length,topCar:topCar?`${topCar.year} ${topCar.make} ${topCar.model}`:'No views yet',topCarViews:topId?topId[1]:0,topPages});
 })()},[supabase]);
 if(!data)return <section><h1>Dashboard</h1><p>Loading analytics…</p></section>;
 return <section><div className="sectionHeading"><div><span className="kicker">BUSINESS OVERVIEW</span><h1>Dashboard</h1><p>Anonymous website activity from the last 30 days.</p></div></div><div className="statGrid"><div className="statCard"><span>Today</span><strong>{data.today}</strong><small>page & vehicle views</small></div><div className="statCard"><span>Last 7 Days</span><strong>{data.week}</strong><small>page & vehicle views</small></div><div className="statCard"><span>Last 30 Days</span><strong>{data.month}</strong><small>page & vehicle views</small></div><div className="statCard accent"><span>Call Now</span><strong>{data.calls}</strong><small>clicks in 30 days</small></div></div><div className="dashboardGrid"><div className="dashPanel"><h2>Inventory</h2><div className="inventoryStats"><div><strong>{data.available}</strong><span>Available</span></div><div><strong>{data.pending}</strong><span>Pending</span></div><div><strong>{data.sold}</strong><span>Sold</span></div></div></div><div className="dashPanel"><h2>Most Viewed Vehicle</h2><strong className="topVehicle">{data.topCar}</strong><p>{data.topCarViews} views in the last 30 days</p></div><div className="dashPanel"><h2>Top Pages</h2><div className="rankList">{data.topPages.length?data.topPages.map(([path,n],i)=><div key={path}><span>{i+1}. {path}</span><strong>{n}</strong></div>):<p>No traffic recorded yet.</p>}</div></div><div className="dashPanel"><h2>Customer Actions</h2><div className="actionMetric"><span>Call Now clicks</span><strong>{data.calls}</strong></div><div className="actionMetric"><span>Social media clicks</span><strong>{data.social}</strong></div></div></div><p className="analyticsNote">Analytics are intentionally anonymous: this dashboard stores event type, page, optional vehicle ID and timestamp—not visitor names or IP addresses.</p></section>
}
function Inventory({supabase,setNotice}){const[items,setItems]=useState([]);const[edit,setEdit]=useState(null);async function load(){const{data,error}=await supabase.from('vehicles').select('*,vehicle_images(*)').order('created_at',{ascending:false});if(error)setNotice(error.message);else setItems(data||[])}useEffect(()=>{load()},[]);async function remove(id){if(!confirm('Delete this vehicle?'))return;const{error}=await supabase.from('vehicles').delete().eq('id',id);if(error)setNotice(error.message);else{setNotice('Vehicle deleted.');load()}}if(edit)return <VehicleForm supabase={supabase} initial={edit} onDone={()=>{setEdit(null);load();setNotice('Vehicle updated.')}}/>;return <section><div className="titleRow"><div><h1>Inventory</h1><p>Only published + available vehicles appear on the public site.</p></div></div><div className="table">{items.map(v=><div className="row" key={v.id}><div><strong>{v.year} {v.make} {v.model}</strong><small>{v.status} • {v.published?'Published':'Draft'} • {v.mileage?`${Number(v.mileage).toLocaleString()} km`:''}</small></div><div className="rowActions"><button className="secondary" onClick={()=>setEdit(v)}>Edit</button><button className="danger" onClick={()=>remove(v.id)}>Delete</button></div></div>)}{!items.length&&<p>No vehicles yet.</p>}</div></section>}
function VehicleForm({supabase,initial,onDone}){
 const[v,setV]=useState(initial||blankVehicle);
 const[files,setFiles]=useState([]);
 const[images,setImages]=useState([...(initial?.vehicle_images||[])].sort((a,b)=>a.sort_order-b.sort_order));
 const[saving,setSaving]=useState(false);

 function change(e){const{name,value,type,checked}=e.target;setV(x=>({...x,[name]:type==='checkbox'?checked:value}))}
 function addFiles(list){
   const valid=[...list].filter(f=>['image/jpeg','image/png','image/webp'].includes(f.type)&&f.size<=8*1024*1024);
   setFiles(prev=>[...prev,...valid]);
 }
 function moveNew(index,dir){const target=index+dir;if(target<0||target>=files.length)return;const next=[...files];[next[index],next[target]]=[next[target],next[index]];setFiles(next)}
 function removeNew(index){setFiles(files.filter((_,i)=>i!==index))}
 function newCover(index){if(index===0)return;setFiles([files[index],...files.filter((_,i)=>i!==index)])}
 async function persistOrder(next){setImages(next);await Promise.all(next.map((x,i)=>supabase.from('vehicle_images').update({sort_order:i}).eq('id',x.id)))}
 async function moveImage(index,dir){const target=index+dir;if(target<0||target>=images.length)return;const next=[...images];[next[index],next[target]]=[next[target],next[index]];await persistOrder(next)}
 async function setCover(index){if(index===0)return;const next=[images[index],...images.filter((_,i)=>i!==index)];await persistOrder(next)}
 async function deleteImage(img){if(!confirm('Delete this photo permanently?'))return;const{error:storageError}=await supabase.storage.from('vehicle-images').remove([img.storage_path]);if(storageError){alert(storageError.message);return}const{error}=await supabase.from('vehicle_images').delete().eq('id',img.id);if(error){alert(error.message);return}await persistOrder(images.filter(x=>x.id!==img.id))}
 async function save(e){
   e.preventDefault();setSaving(true);
   const payload={...v,year:Number(v.year),price:v.price?Number(v.price):null,mileage:v.mileage?Number(v.mileage):null};
   delete payload.vehicle_images;
   let id=v.id;
   if(id){const{error}=await supabase.from('vehicles').update(payload).eq('id',id);if(error){alert(error.message);setSaving(false);return}}
   else{const{data,error}=await supabase.from('vehicles').insert(payload).select().single();if(error){alert(error.message);setSaving(false);return}id=data.id}
   let order=images.length;
   for(const f of files){
     const ext=(f.name.split('.').pop()||'jpg').toLowerCase();
     const path=`vehicles/${id}/${crypto.randomUUID()}.${ext}`;
     const{error:upErr}=await supabase.storage.from('vehicle-images').upload(path,f,{upsert:false,contentType:f.type});
     if(upErr)continue;
     const{data:pub}=supabase.storage.from('vehicle-images').getPublicUrl(path);
     await supabase.from('vehicle_images').insert({vehicle_id:id,image_url:pub.publicUrl,storage_path:path,sort_order:order++})
   }
   setSaving(false);onDone?.()
 }
 return <section className="editorPage">
   <div className="sectionHeading"><div><span className="kicker">INVENTORY MANAGER</span><h1>{v.id?'Edit Vehicle':'Add Vehicle'}</h1><p>{v.id?'Update vehicle details, photos and listing status.':'Create a polished vehicle listing for the public website.'}</p></div></div>
   <form className="form vehicleForm" onSubmit={save}>
     <div className="formCard">
       <div className="formCardTitle"><div><span>01</span><div><h2>Vehicle Details</h2><p>Core information customers will see on the listing.</p></div></div></div>
       <div className="grid2">{[['year','Year','number'],['make','Make','text'],['model','Model','text'],['trim','Trim','text'],['price','Price','number'],['mileage','Mileage (km)','number'],['vin','VIN','text'],['transmission','Transmission','text'],['drivetrain','Drivetrain','text'],['fuel_type','Fuel type','text'],['exterior_color','Exterior colour','text'],['interior_color','Interior colour','text']].map(([name,label,type])=><label key={name}>{label}<input name={name} type={type} value={v[name]??''} onChange={change} required={['year','make','model'].includes(name)}/></label>)}</div>
       <label>Description<textarea name="description" rows="5" value={v.description||''} onChange={change} placeholder="Condition, features, service history, highlights..."/></label>
     </div>

     <div className="formCard">
       <div className="formCardTitle"><div><span>02</span><div><h2>Photos</h2><p>The first image becomes the cover photo on Cars for Sale.</p></div></div></div>
       <label className="uploadBox">Add vehicle photos
         <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>addFiles(e.target.files)}/>
         <span>Choose JPEG, PNG or WebP images • max 8 MB each</span>
       </label>

       {images.length>0&&<div className="photoManager">
         <div className="photoManagerHead"><div><h3>Saved Photos</h3><p>These photos are already uploaded.</p></div><span>{images.length} saved</span></div>
         <div className="photoGrid">{images.map((img,i)=><article className="photoTile" key={img.id}>
           <div className="photoPreview"><img src={img.image_url} alt={`Vehicle photo ${i+1}`}/>{i===0&&<span className="coverBadge">Cover</span>}<span className="photoNumber">{i+1}</span></div>
           <div className="photoActions"><button type="button" className="mini" disabled={i===0} onClick={()=>moveImage(i,-1)}>←</button><button type="button" className="mini" disabled={i===images.length-1} onClick={()=>moveImage(i,1)}>→</button><button type="button" className="mini wide" disabled={i===0} onClick={()=>setCover(i)}>Set Cover</button><button type="button" className="mini delete" onClick={()=>deleteImage(img)}>Delete</button></div>
         </article>)}</div>
       </div>}

       {files.length>0&&<div className="photoManager pendingUploads">
         <div className="photoManagerHead"><div><h3>New Photos</h3><p>Reorder or remove these before saving the vehicle.</p></div><span>{files.length} selected</span></div>
         <div className="photoGrid">{files.map((f,i)=><article className="photoTile" key={`${f.name}-${f.lastModified}-${i}`}>
           <div className="photoPreview"><img src={URL.createObjectURL(f)} alt={`Selected vehicle photo ${i+1}`}/>{images.length===0&&i===0&&<span className="coverBadge">Cover</span>}<span className="photoNumber">{images.length+i+1}</span></div>
           <div className="photoActions"><button type="button" className="mini" disabled={i===0} onClick={()=>moveNew(i,-1)}>←</button><button type="button" className="mini" disabled={i===files.length-1} onClick={()=>moveNew(i,1)}>→</button><button type="button" className="mini wide" disabled={i===0||images.length>0} onClick={()=>newCover(i)}>Set Cover</button><button type="button" className="mini delete" onClick={()=>removeNew(i)}>Remove</button></div>
         </article>)}</div>
       </div>}
       {images.length===0&&files.length===0&&<div className="photoEmpty"><strong>No photos selected yet</strong><span>Add multiple photos above. You can reorder them before saving.</span></div>}
     </div>

     <div className="formCard">
       <div className="formCardTitle"><div><span>03</span><div><h2>Listing Status</h2><p>Control how this vehicle appears on the public website.</p></div></div></div>
       <div className="grid2"><label>Status<select name="status" value={v.status} onChange={change}><option value="available">Available</option><option value="pending">Pending</option><option value="sold">Sold</option></select></label><div className="statusHelp"><strong>Available</strong><span>Normal listing</span><strong>Pending</strong><span>Visible with Pending watermark</span><strong>Sold</strong><span>Hidden from public inventory</span></div></div>
       <div className="checks polishedChecks"><label><input type="checkbox" name="featured" checked={!!v.featured} onChange={change}/><span><strong>Featured vehicle</strong><small>Prioritize this vehicle on the homepage.</small></span></label><label><input type="checkbox" name="published" checked={!!v.published} onChange={change}/><span><strong>Published on website</strong><small>Allow customers to see this listing.</small></span></label></div>
     </div>
     <div className="saveBar"><div><strong>{v.id?'Ready to update this listing?':'Ready to publish this vehicle?'}</strong><span>You can change these details again at any time.</span></div><button className="saveVehicle" disabled={saving}>{saving?'Saving…':'Save Vehicle'}</button></div>
   </form>
 </section>
}
function Promos({supabase,setNotice}){const[items,setItems]=useState([]);const[title,setTitle]=useState('');const[details,setDetails]=useState('');async function load(){const{data}=await supabase.from('promotions').select('*').order('sort_order');setItems(data||[])}useEffect(()=>{load()},[]);async function add(e){e.preventDefault();const{error}=await supabase.from('promotions').insert({title,details,published:true});if(error)setNotice(error.message);else{setTitle('');setDetails('');load();setNotice('Promotion published.')}}async function toggle(x){await supabase.from('promotions').update({published:!x.published}).eq('id',x.id);load()}return <section><h1>Promotions</h1><form className="form compact" onSubmit={add}><label>Promotion title<input value={title} onChange={e=>setTitle(e.target.value)} required/></label><label>Details<textarea value={details} onChange={e=>setDetails(e.target.value)}/></label><button>Add Promotion</button></form><div className="table">{items.map(x=><div className="row" key={x.id}><div><strong>{x.title}</strong><small>{x.details}</small></div><button className="secondary" onClick={()=>toggle(x)}>{x.published?'Hide':'Publish'}</button></div>)}</div></section>}
function Services({supabase,setNotice}){const[items,setItems]=useState([]);const[name,setName]=useState('');const[description,setDescription]=useState('');async function load(){const{data}=await supabase.from('services').select('*').order('sort_order');setItems(data||[])}useEffect(()=>{load()},[]);async function add(e){e.preventDefault();const{error}=await supabase.from('services').insert({name,description,published:true});if(error)setNotice(error.message);else{setName('');setDescription('');load();setNotice('Repair service added.')}}async function remove(id){await supabase.from('services').delete().eq('id',id);load()}return <section><h1>Repair Services</h1><form className="form compact" onSubmit={add}><label>Service name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)}/></label><button>Add Service</button></form><div className="table">{items.map(x=><div className="row" key={x.id}><div><strong>{x.name}</strong><small>{x.description}</small></div><button className="danger" onClick={()=>remove(x.id)}>Delete</button></div>)}</div></section>}
function SiteInfo({supabase,setNotice}){const[form,setForm]=useState({phone:'204-632-4296',address:'1129 Fife Street, Winnipeg, MB R2X 2N1',hours:'',home_intro:'',about_short:'',about_full:'',facebook_url:'',instagram_url:'',tiktok_url:''});useEffect(()=>{supabase.from('site_settings').select('*').then(({data})=>{if(data)setForm(f=>({...f,...Object.fromEntries(data.map(x=>[x.key,x.value]))}))})},[]);async function save(e){e.preventDefault();const rows=Object.entries(form).map(([key,value])=>({key,value}));const{error}=await supabase.from('site_settings').upsert(rows,{onConflict:'key'});setNotice(error?error.message:'Website information updated.')}return <section><h1>Website Info</h1><p>These fields update the public site without changing code.</p><form className="form" onSubmit={save}>{[['phone','Phone'],['address','Address'],['hours','Business hours'],['home_intro','Homepage introduction'],['about_short','Short about text'],['about_full','Full About page text']].map(([k,l])=><label key={k}>{l}{k.includes('about')||k==='home_intro'?<textarea rows="4" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>:<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>}</label>)}<div className="formDivider"><h2>Social Media Links</h2><p>Paste the full profile URL. Leave a field blank to hide that social icon from the public website.</p></div>{[['facebook_url','Facebook URL'],['instagram_url','Instagram URL'],['tiktok_url','TikTok URL']].map(([k,l])=><label key={k}>{l}<input type="url" placeholder={k==='facebook_url'?'https://facebook.com/yourpage':k==='instagram_url'?'https://instagram.com/yourprofile':'https://tiktok.com/@yourprofile'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<button>Save Website Info</button></form></section>}
