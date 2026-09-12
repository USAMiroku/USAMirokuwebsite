-- Uploadable banner images for learning activities (events, classes, study sessions).
--
-- Files live in the public `activity-images` bucket at:
--   <center_id>/<activity_id>/<uuid>.webp   (activities assigned to a center)
--   shared/<activity_id>/<uuid>.webp        (activities without a center)
--
-- Write access mirrors the `activities_admin_manage` policy on learning_activities:
-- super admins can manage every folder; admins, instructors, and center admins can
-- manage folders for centers they are allowed to manage. The `shared` folder maps to
-- a null center, which only super admins can manage.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'activity-images',
  'activity-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists activity_images_public_read on storage.objects;
create policy activity_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'activity-images');

drop policy if exists activity_images_admin_insert on storage.objects;
create policy activity_images_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'activity-images'
    and public.learning_can_manage_activity(nullif((storage.foldername(name))[1], 'shared'))
  );

drop policy if exists activity_images_admin_update on storage.objects;
create policy activity_images_admin_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'activity-images'
    and public.learning_can_manage_activity(nullif((storage.foldername(name))[1], 'shared'))
  )
  with check (
    bucket_id = 'activity-images'
    and public.learning_can_manage_activity(nullif((storage.foldername(name))[1], 'shared'))
  );

drop policy if exists activity_images_admin_delete on storage.objects;
create policy activity_images_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'activity-images'
    and public.learning_can_manage_activity(nullif((storage.foldername(name))[1], 'shared'))
  );
