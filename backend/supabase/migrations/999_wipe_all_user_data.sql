-- ⚠️  DANGER: Wipe ALL user data — keeps schema + RLS intact
-- Run this once in Supabase SQL editor to reset dev data.
-- Tables are deleted in FK-safe order (children first).
-- Uses IF EXISTS so it works whether or not migration 003 has been run.

delete from public.custom_sections  where exists (select from information_schema.tables where table_schema='public' and table_name='custom_sections');
delete from public.quotes            where exists (select from information_schema.tables where table_schema='public' and table_name='quotes');
delete from public.publications      where exists (select from information_schema.tables where table_schema='public' and table_name='publications');
delete from public.books             where exists (select from information_schema.tables where table_schema='public' and table_name='books');
delete from public.testimonials      where exists (select from information_schema.tables where table_schema='public' and table_name='testimonials');
delete from public.services          where exists (select from information_schema.tables where table_schema='public' and table_name='services');
delete from public.certifications    where exists (select from information_schema.tables where table_schema='public' and table_name='certifications');
delete from public.educations        where exists (select from information_schema.tables where table_schema='public' and table_name='educations');
delete from public.experiences       where exists (select from information_schema.tables where table_schema='public' and table_name='experiences');
delete from public.page_views        where exists (select from information_schema.tables where table_schema='public' and table_name='page_views');
delete from public.section_order     where exists (select from information_schema.tables where table_schema='public' and table_name='section_order');
delete from public.social_links      where exists (select from information_schema.tables where table_schema='public' and table_name='social_links');
delete from public.skills            where exists (select from information_schema.tables where table_schema='public' and table_name='skills');
delete from public.projects          where exists (select from information_schema.tables where table_schema='public' and table_name='projects');
delete from public.subscriptions     where exists (select from information_schema.tables where table_schema='public' and table_name='subscriptions');
delete from public.profiles          where exists (select from information_schema.tables where table_schema='public' and table_name='profiles');
