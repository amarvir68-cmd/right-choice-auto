-- Adds editable social media settings for the public footer. Safe to run more than once.
insert into public.site_settings(key,value) values
 ('facebook_url',''),
 ('instagram_url',''),
 ('tiktok_url','')
on conflict (key) do nothing;
