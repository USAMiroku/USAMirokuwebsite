-- Security hardening for the Miroku Association USA website.

-- Prevent self-service privilege escalation. New self-created profiles must
-- retain the student default and cannot claim management of a center.
drop policy if exists profiles_self_insert on public.learning_profiles;
create policy profiles_self_insert
  on public.learning_profiles for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'student'
    and managed_center_id is null
  );

revoke insert, update, delete, truncate, references, trigger on public.learning_profiles from anon;
revoke insert, update, truncate, references, trigger on public.learning_profiles from authenticated;
grant select on public.learning_profiles to authenticated;
grant insert (user_id, full_name, phone, preferred_language, email) on public.learning_profiles to authenticated;

drop policy if exists profiles_admin_select on public.learning_profiles;
create policy profiles_admin_select
  on public.learning_profiles for select
  to authenticated
  using (public.learning_is_super_admin());

drop policy if exists profiles_admin_manage on public.learning_profiles;
create policy profiles_admin_manage
  on public.learning_profiles for all
  to authenticated
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

-- Public visitors only see published activities and sessions belonging to a
-- published activity. Administrative policies continue to expose drafts to
-- authorized managers.
drop policy if exists activities_public_select on public.learning_activities;
create policy activities_public_select
  on public.learning_activities for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists activities_admin_manage on public.learning_activities;
create policy activities_admin_manage
  on public.learning_activities for all
  to authenticated
  using (public.learning_can_manage_activity(center_id))
  with check (public.learning_can_manage_activity(center_id));

drop policy if exists sessions_public_select on public.learning_sessions;
create policy sessions_public_select
  on public.learning_sessions for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.learning_activities a
      where a.id = learning_sessions.activity_id
        and a.is_published = true
    )
  );

drop policy if exists sessions_admin_manage on public.learning_sessions;
create policy sessions_admin_manage
  on public.learning_sessions for all
  to authenticated
  using (
    exists (
      select 1 from public.learning_activities a
      where a.id = learning_sessions.activity_id
        and public.learning_can_manage_activity(a.center_id)
    )
  )
  with check (
    exists (
      select 1 from public.learning_activities a
      where a.id = learning_sessions.activity_id
        and public.learning_can_manage_activity(a.center_id)
    )
  );

drop policy if exists organization_centers_public_select on public.organization_centers;
create policy organization_centers_public_select
  on public.organization_centers for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists organization_centers_super_admin_manage on public.organization_centers;
create policy organization_centers_super_admin_manage
  on public.organization_centers for all
  to authenticated
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

drop policy if exists organization_centers_center_admin_update on public.organization_centers;
create policy organization_centers_center_admin_update
  on public.organization_centers for update
  to authenticated
  using (public.learning_can_manage_center(id))
  with check (public.learning_can_manage_center(id));

-- Event attachments are explicitly public. Session materials remain private.
alter table public.learning_materials
  add column if not exists is_public boolean not null default false;

update public.learning_materials
set is_public = true
where session_id is null;

drop policy if exists materials_admin_manage on public.learning_materials;
create policy materials_admin_manage
  on public.learning_materials for all
  to authenticated
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

drop policy if exists materials_enrolled_select on public.learning_materials;
create policy materials_enrolled_select
  on public.learning_materials for select
  to authenticated
  using (
    public.learning_is_admin()
    or (
      session_id is not null
      and exists (
        select 1 from public.learning_registrations r
        where r.user_id = (select auth.uid())
          and r.session_id = learning_materials.session_id
          and r.status in ('approved', 'completed')
      )
    )
    or (
      session_id is null
      and is_public = true
      and exists (
        select 1 from public.learning_activities a
        where a.id = learning_materials.activity_id
          and a.is_published = true
      )
    )
  );

-- Registration management functions are only evaluated for signed-in users.
alter policy registrations_self_select on public.learning_registrations to authenticated;
alter policy registrations_self_insert_pending on public.learning_registrations to authenticated;
alter policy registrations_admin_select on public.learning_registrations to authenticated;
alter policy registrations_admin_update_status on public.learning_registrations to authenticated;
alter policy registrations_admin_delete on public.learning_registrations to authenticated;

-- Restrict the private materials bucket even if server-side validation fails.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp']::text[]
where id = 'learning-materials';

-- Remove privileges that bypass row-level security semantics.
revoke truncate, references, trigger on public.learning_activities from anon, authenticated;
revoke truncate, references, trigger on public.learning_sessions from anon, authenticated;
revoke truncate, references, trigger on public.learning_registrations from anon, authenticated;
revoke truncate, references, trigger on public.learning_materials from anon, authenticated;
revoke truncate, references, trigger on public.organization_centers from anon, authenticated;
revoke truncate, references, trigger on public.community_program_photos from anon, authenticated;
revoke truncate, references, trigger on public.website_donations from anon, authenticated;

-- Helper functions must not be callable by anonymous visitors. Authenticated
-- users need them for RLS evaluation.
revoke execute on function public.learning_is_super_admin() from public, anon;
revoke execute on function public.learning_is_admin() from public, anon;
revoke execute on function public.learning_is_center_admin() from public, anon;
revoke execute on function public.learning_can_manage_center(text) from public, anon;
revoke execute on function public.learning_can_manage_activity(text) from public, anon;
grant execute on function public.learning_is_super_admin() to authenticated;
grant execute on function public.learning_is_admin() to authenticated;
grant execute on function public.learning_is_center_admin() to authenticated;
grant execute on function public.learning_can_manage_center(text) to authenticated;
grant execute on function public.learning_can_manage_activity(text) to authenticated;
