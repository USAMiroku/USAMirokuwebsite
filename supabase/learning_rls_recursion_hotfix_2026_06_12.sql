-- Fix recursive RLS evaluation in learning admin policies.
--
-- Root cause:
--   learning_profiles policies call helper functions such as learning_is_super_admin().
--   Those helpers read learning_profiles. When they are not SECURITY DEFINER, Postgres
--   evaluates learning_profiles RLS again inside the helper, which can recurse until:
--   "stack depth limit exceeded".
--
-- Run this in the Supabase SQL editor for the live project.

create or replace function public.learning_is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = (select auth.uid())
      and lp.role in ('super_admin', 'admin', 'instructor')
  );
$$;

create or replace function public.learning_is_center_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = (select auth.uid())
      and lp.role = 'center_admin'
  );
$$;

create or replace function public.learning_can_manage_center(target_center_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = (select auth.uid())
      and (
        lp.role in ('super_admin', 'admin', 'instructor')
        or (lp.role = 'center_admin' and lp.managed_center_id = target_center_id)
      )
  );
$$;

create or replace function public.learning_can_manage_activity(activity_center_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.learning_is_super_admin()
    or (
      activity_center_id is not null
      and public.learning_can_manage_center(activity_center_id)
    );
$$;

revoke all on function public.learning_is_super_admin() from public;
revoke all on function public.learning_is_center_admin() from public;
revoke all on function public.learning_can_manage_center(text) from public;
revoke all on function public.learning_can_manage_activity(text) from public;

grant execute on function public.learning_is_super_admin() to anon, authenticated;
grant execute on function public.learning_is_center_admin() to authenticated;
grant execute on function public.learning_can_manage_center(text) to anon, authenticated;
grant execute on function public.learning_can_manage_activity(text) to authenticated;

drop policy if exists website_donations_admin_select on public.website_donations;
create policy website_donations_admin_select
  on public.website_donations
  for select
  to authenticated
  using (
    public.learning_is_super_admin()
    or public.learning_can_manage_center(website_donations.center_id)
  );
