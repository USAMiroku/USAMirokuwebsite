-- Migration: Rich detail fields for learning_activities
-- Run in Supabase SQL Editor before deploying the updated code.

alter table public.learning_activities
  add column if not exists image_url text,
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists registration_required boolean not null default false,
  add column if not exists registration_url text,
  add column if not exists is_published boolean not null default true;

-- Backfill existing rows so they remain publicly visible
update public.learning_activities
  set is_published = true,
      registration_required = false
  where is_published is null or registration_required is null;
