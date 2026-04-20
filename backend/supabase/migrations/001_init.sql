-- ============================================================
-- Portfol — Initial Database Migration (Clerk Auth version)
-- ============================================================
-- Before running this migration, create two Storage buckets in
-- your Supabase project dashboard:
--
--   1. Bucket name: avatars
--      Public: true (anyone caan read)
--      Allowed MIME types: image/*
--      Max upload size: 5 MB
--
--   2. Bucket name: project-images
--      Public: true (anyone can read)
--      Allowed MIME types: image/*
--      Max upload size: 10 MB
--
-- Run in Supabase SQL Editor.
-- NOTE: profile_id / id columns are TEXT to store Clerk user IDs (user_xxx format)
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.profiles (
  id            text primary key,           -- Clerk user ID (user_xxx)
  username      text unique not null,
  full_name     text,
  tagline       text,
  bio           text,
  avatar_url    text,
  is_pro        boolean not null default false,
  custom_domain text,
  domain_verified boolean not null default false,
  template      text not null default 'minimal',
  is_public     boolean not null default true,
  hidden_sections text[] not null default '{}',
  section_settings jsonb not null default '{}',
  location      text,
  email_public  text,
  phone         text,
  available_for text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  profile_id  text not null references public.profiles on delete cascade,
  name        text not null,
  order_index int not null default 0
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  profile_id  text not null references public.profiles on delete cascade,
  title       text not null,
  description text,
  url         text,
  image_url   text,
  order_index int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  text not null references public.profiles on delete cascade,
  platform    text not null,
  url         text not null
);

create table if not exists public.section_order (
  profile_id  text primary key references public.profiles on delete cascade,
  sections    text[] not null default array['hero','about','skills','projects','contact']
);

create table if not exists public.experiences (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  role         text not null,
  company      text not null,
  period       text,
  description  text,
  order_index  int not null default 0
);

create table if not exists public.educations (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  degree       text not null,
  institution  text not null,
  period       text,
  description  text,
  order_index  int not null default 0
);

create table if not exists public.certifications (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  name         text not null,
  issuer       text,
  year         text,
  url          text,
  order_index  int not null default 0
);

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  title        text not null,
  description  text,
  icon         text default '⚡',
  order_index  int not null default 0
);

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  name         text not null,
  role         text,
  text         text not null,
  avatar_url   text,
  order_index  int not null default 0
);

create table if not exists public.books (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  title        text not null,
  author       text,
  year         text,
  url          text,
  notes        text,
  order_index  int not null default 0
);

create table if not exists public.publications (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  title        text not null,
  publisher    text,
  year         text,
  url          text,
  description  text,
  order_index  int not null default 0
);

create table if not exists public.quotes (
  id           uuid primary key default gen_random_uuid(),
  profile_id   text not null references public.profiles on delete cascade,
  text         text not null,
  author       text,
  order_index  int not null default 0
);

create table if not exists public.custom_sections (
  id            uuid primary key default gen_random_uuid(),
  profile_id    text not null references public.profiles on delete cascade,
  section_key   text not null,
  section_label text not null,
  content       text,
  items         jsonb default '[]',
  order_index   int not null default 0
);

create table if not exists public.page_views (
  id                   uuid primary key default gen_random_uuid(),
  portfolio_username   text not null,
  viewer_ip_hash       text,
  country              text,
  device_type          text,
  referrer             text,
  viewed_at            timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  profile_id           text not null references public.profiles on delete cascade,
  dodo_customer_id     text,
  dodo_subscription_id text,
  status               text,
  current_period_end   timestamptz
);

create index if not exists page_views_username_idx on public.page_views (portfolio_username);
create index if not exists page_views_viewed_at_idx on public.page_views (viewed_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- All writes go through FastAPI (service key) so RLS is
-- intentionally permissive — just block direct anon writes.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.social_links enable row level security;
alter table public.section_order enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.certifications enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.books enable row level security;
alter table public.publications enable row level security;
alter table public.quotes enable row level security;
alter table public.custom_sections enable row level security;
alter table public.page_views enable row level security;
alter table public.subscriptions enable row level security;

-- Public read for portfolio data
create policy "public_read_profiles"      on public.profiles        for select using (is_public = true);
create policy "public_read_skills"        on public.skills          for select using (true);
create policy "public_read_projects"      on public.projects        for select using (true);
create policy "public_read_social"        on public.social_links    for select using (true);
create policy "public_read_section_order" on public.section_order   for select using (true);
create policy "public_read_exp"           on public.experiences     for select using (true);
create policy "public_read_edu"           on public.educations      for select using (true);
create policy "public_read_cert"          on public.certifications  for select using (true);
create policy "public_read_svc"           on public.services        for select using (true);
create policy "public_read_test"          on public.testimonials    for select using (true);
create policy "public_read_books"         on public.books           for select using (true);
create policy "public_read_pubs"          on public.publications    for select using (true);
create policy "public_read_quotes"        on public.quotes          for select using (true);
create policy "public_read_custom"        on public.custom_sections for select using (true);

-- page_views: anyone can insert (public portfolio tracking)
create policy "anyone_insert_views" on public.page_views for insert with check (true);
create policy "anyone_read_views"   on public.page_views for select using (true);
