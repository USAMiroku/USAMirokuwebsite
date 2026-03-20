-- Add center_id to learning_activities so activities can be linked to centers.
-- Run this in Supabase SQL Editor after the main schema.

alter table public.learning_activities
  add column if not exists center_id text;

create index if not exists learning_activities_center_id_idx
  on public.learning_activities(center_id);

comment on column public.learning_activities.center_id is 'Matches siteConfig center id (e.g. boston-johrei-center). Null = national/general.';
