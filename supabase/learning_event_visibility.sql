-- Adds public Events-page visibility control.
-- Run in Supabase SQL Editor for existing deployments.

alter table public.learning_activities
  add column if not exists show_on_main_events boolean not null default true;

comment on column public.learning_activities.show_on_main_events is
  'When true, the event appears on the public /events listing. Center-linked events still appear on their center/group event page when false.';
