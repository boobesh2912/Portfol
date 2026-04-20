-- ⚠️  DANGER: Wipe ALL user data — keeps schema + RLS intact
-- Run this once in Supabase SQL editor to reset dev data.
-- Tables are deleted in FK-safe order (children first).

delete from public.custom_sections;
delete from public.quotes;
delete from public.publications;
delete from public.books;
delete from public.testimonials;
delete from public.services;
delete from public.certifications;
delete from public.educations;
delete from public.experiences;
delete from public.page_views;
delete from public.section_order;
delete from public.social_links;
delete from public.skills;
delete from public.projects;
delete from public.subscriptions;
delete from public.profiles;
