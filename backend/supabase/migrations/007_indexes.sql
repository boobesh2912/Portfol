-- Migration 007: Database indexes for performance
-- Run in Supabase SQL Editor after previous migrations.

-- Indexes for analytics performance
create index if not exists idx_page_views_portfolio_username on public.page_views (portfolio_username);
create index if not exists idx_page_views_viewed_at on public.page_views (viewed_at);
create index if not exists idx_page_views_country on public.page_views (country);
create index if not exists idx_page_views_device_type on public.page_views (device_type);

-- Indexes for profiles
create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_is_pro on public.profiles (is_pro);

-- Indexes for projects
create index if not exists idx_projects_profile_id on public.projects (profile_id);

-- Indexes for sections
create index if not exists idx_sections_profile_id on public.sections (profile_id);