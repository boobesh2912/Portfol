-- Migration 004: server-side analytics aggregation function
-- Replaces the Python full-table-scan approach in routers/analytics.py.
-- Run in Supabase SQL Editor after 001_init.sql.

create or replace function public.get_portfolio_analytics(p_username text)
returns jsonb
language sql
stable
as $$
  with base as (
    select
      viewed_at,
      country,
      device_type,
      referrer
    from public.page_views
    where portfolio_username = p_username
  ),
  totals as (
    select
      count(*)                                                          as total_views,
      count(*) filter (where viewed_at >= now() - interval '7 days')   as views_7d,
      count(*) filter (where viewed_at >= now() - interval '30 days')  as views_30d
    from base
  ),
  -- daily series: last 30 days, zero-filled
  days as (
    select generate_series(
      (now() - interval '29 days')::date,
      now()::date,
      '1 day'::interval
    )::date as day
  ),
  daily_raw as (
    select viewed_at::date as day, count(*) as views
    from base
    where viewed_at >= now() - interval '30 days'
    group by 1
  ),
  daily as (
    select
      to_char(d.day, 'YYYY-MM-DD') as date,
      coalesce(r.views, 0)         as views
    from days d
    left join daily_raw r on r.day = d.day
    order by d.day
  ),
  -- top 5 countries (30d)
  countries as (
    select country, count(*) as cnt
    from base
    where viewed_at >= now() - interval '30 days'
      and country is not null
    group by country
    order by cnt desc
    limit 5
  ),
  -- device breakdown (30d)
  devices as (
    select device_type, count(*) as cnt
    from base
    where viewed_at >= now() - interval '30 days'
      and device_type is not null
    group by device_type
  ),
  -- top 5 referrers (30d)
  referrers as (
    select coalesce(referrer, 'direct') as referrer, count(*) as cnt
    from base
    where viewed_at >= now() - interval '30 days'
    group by 1
    order by cnt desc
    limit 5
  )
  select jsonb_build_object(
    'total_views',      (select total_views  from totals),
    'views_7d',         (select views_7d     from totals),
    'views_30d',        (select views_30d    from totals),
    'daily_views',      (select jsonb_agg(jsonb_build_object('date', date, 'views', views) order by date) from daily),
    'top_countries',    (select jsonb_agg(jsonb_build_object('country', country, 'count', cnt) order by cnt desc) from countries),
    'device_breakdown', (select jsonb_object_agg(device_type, cnt) from devices),
    'top_referrers',    (select jsonb_agg(jsonb_build_object('referrer', referrer, 'count', cnt) order by cnt desc) from referrers)
  );
$$;

-- Allow the service role (used by the FastAPI backend) to call this function.
grant execute on function public.get_portfolio_analytics(text) to service_role;
