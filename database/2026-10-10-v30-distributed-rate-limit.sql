-- Right Choice Auto v30 distributed rate limiting
-- Safe deployment order:
-- 1) Deploy the matching application code first. Until this migration is applied,
--    the app automatically keeps the existing conservative local fallback.
-- 2) Run this migration in Supabase SQL Editor.
-- 3) Re-run the live production validation.

create table if not exists public.rate_limit_buckets (
  key text primary key,
  count integer not null check (count >= 0),
  reset_at timestamptz not null
);

alter table public.rate_limit_buckets enable row level security;
revoke all on public.rate_limit_buckets from public, anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  ok boolean,
  remaining integer,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count integer;
  v_reset timestamptz;
  v_now timestamptz := clock_timestamp();
begin
  if p_key is null or length(p_key) < 3 or length(p_key) > 300 then
    raise exception 'invalid rate-limit key';
  end if;
  if p_limit < 1 or p_limit > 1000 then
    raise exception 'invalid rate-limit limit';
  end if;
  if p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate-limit window';
  end if;

  insert into public.rate_limit_buckets as b (key, count, reset_at)
  values (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set count = case
      when b.reset_at <= v_now then 1
      else b.count + 1
    end,
    reset_at = case
      when b.reset_at <= v_now then v_now + make_interval(secs => p_window_seconds)
      else b.reset_at
    end
  returning count, rate_limit_buckets.reset_at into v_count, v_reset;

  if v_count = 1 then
    delete from public.rate_limit_buckets
      where reset_at < v_now - interval '1 day';
  end if;

  return query
    select
      v_count <= p_limit,
      greatest(0, p_limit - v_count),
      v_reset;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
