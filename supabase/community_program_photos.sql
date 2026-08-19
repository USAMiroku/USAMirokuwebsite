-- Community Program photo gallery for the public website.
-- Public visitors may read published rows and images. Center admins may contribute
-- photos only to their assigned center; super admins retain full curation control.

create table if not exists public.community_program_photos (
  id uuid primary key default gen_random_uuid(),
  program_key text not null check (program_key in (
    'community-outreach',
    'education',
    'leadership-development',
    'art-and-beauty',
    'nature-and-natural-farming',
    'volunteer-service',
    'spiritual-support',
    'women-and-girls-leadership'
  )),
  center_id text,
  storage_path text not null unique,
  alt_text text not null check (char_length(alt_text) between 3 and 240),
  caption text check (caption is null or char_length(caption) <= 500),
  display_order integer not null default 0 check (display_order >= 0),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_program_photos
  add column if not exists center_id text;

create index if not exists community_program_photos_center_id_idx
  on public.community_program_photos (center_id);

create unique index if not exists community_program_photos_one_featured
  on public.community_program_photos (program_key)
  where is_featured;

create index if not exists community_program_photos_public_order
  on public.community_program_photos (program_key, display_order, created_at)
  where is_published;

alter table public.community_program_photos enable row level security;

drop policy if exists community_program_photos_public_read on public.community_program_photos;
create policy community_program_photos_public_read
  on public.community_program_photos for select
  to anon
  using (is_published);

drop policy if exists community_program_photos_authenticated_read on public.community_program_photos;
create policy community_program_photos_authenticated_read
  on public.community_program_photos for select
  to authenticated
  using (is_published or public.learning_is_super_admin() or public.learning_is_center_admin());

drop policy if exists community_program_photos_center_admin_insert on public.community_program_photos;
create policy community_program_photos_center_admin_insert
  on public.community_program_photos for insert
  to authenticated
  with check (
    public.learning_is_center_admin()
    and public.learning_can_manage_center(center_id)
    and created_by = (select auth.uid())
    and is_published
    and not is_featured
  );

drop policy if exists community_program_photos_super_admin_insert on public.community_program_photos;
create policy community_program_photos_super_admin_insert
  on public.community_program_photos for insert
  to authenticated
  with check (public.learning_is_super_admin() and created_by = (select auth.uid()));

drop policy if exists community_program_photos_super_admin_update on public.community_program_photos;
create policy community_program_photos_super_admin_update
  on public.community_program_photos for update
  to authenticated
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

drop policy if exists community_program_photos_super_admin_delete on public.community_program_photos;
create policy community_program_photos_super_admin_delete
  on public.community_program_photos for delete
  to authenticated
  using (public.learning_is_super_admin());

grant select on public.community_program_photos to anon, authenticated;
grant insert, update, delete on public.community_program_photos to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-programs',
  'community-programs',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists community_program_images_public_read on storage.objects;
create policy community_program_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'community-programs');

drop policy if exists community_program_images_super_admin_insert on storage.objects;
create policy community_program_images_super_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-programs'
    and (
      public.learning_is_super_admin()
      or (
        public.learning_is_center_admin()
        and public.learning_can_manage_center((storage.foldername(name))[1])
      )
    )
  );

drop policy if exists community_program_images_super_admin_update on storage.objects;
create policy community_program_images_super_admin_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'community-programs' and public.learning_is_super_admin())
  with check (bucket_id = 'community-programs' and public.learning_is_super_admin());

drop policy if exists community_program_images_super_admin_delete on storage.objects;
create policy community_program_images_super_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'community-programs' and public.learning_is_super_admin());
