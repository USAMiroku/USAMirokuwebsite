-- Prevent caller-controlled schema resolution in profile helper functions.
alter function public.resolve_profile_center_id(uuid) set search_path = '';
alter function public.resolve_profile_center_slug(uuid) set search_path = '';
alter function public.resolve_profile_location_id(uuid) set search_path = '';
alter function public.sync_profile_center_assignment() set search_path = '';
