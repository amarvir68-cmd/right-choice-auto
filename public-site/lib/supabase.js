import { createClient } from '@supabase/supabase-js';

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getSiteSettings() {
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data } = await supabase.from('site_settings').select('*');
  return Object.fromEntries((data || []).map(x => [x.key, x.value]));
}

export async function getSiteData() {
  const supabase = getSupabase();
  if (!supabase) return { settings: {}, promotions: [], services: [], vehicles: [] };
  const [settingsRes, promosRes, servicesRes, vehiclesRes] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase.from('promotions').select('*').eq('published', true).order('sort_order'),
    supabase.from('services').select('*').eq('published', true).order('sort_order'),
    supabase.from('vehicles').select('*, vehicle_images(*)').eq('published', true).eq('status', 'available').order('featured', { ascending: false }).order('created_at', { ascending: false })
  ]);
  const settings = Object.fromEntries((settingsRes.data || []).map(x => [x.key, x.value]));
  return { settings, promotions: promosRes.data || [], services: servicesRes.data || [], vehicles: vehiclesRes.data || [] };
}
