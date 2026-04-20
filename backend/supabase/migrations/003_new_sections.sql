-- Migration 003: Add books, publications, quotes, custom_sections tables
-- Run this if you already ran 001_init.sql

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

alter table public.books enable row level security;
alter table public.publications enable row level security;
alter table public.quotes enable row level security;
alter table public.custom_sections enable row level security;

create policy "public_read_books"  on public.books           for select using (true);
create policy "public_read_pubs"   on public.publications    for select using (true);
create policy "public_read_quotes" on public.quotes          for select using (true);
create policy "public_read_custom" on public.custom_sections for select using (true);
