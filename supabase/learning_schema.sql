-- Learning app schema for Miroku Association USA
-- Run in Supabase SQL Editor (in `public` schema).

create extension if not exists pgcrypto;

-- ----------------------------
-- Profiles / roles (must exist before learning_is_admin)
-- ----------------------------
create table if not exists public.learning_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  full_name text,
  phone text,
  preferred_language text,
  created_at timestamptz not null default now()
);

-- ----------------------------
-- Helper: role check (must run after learning_profiles exists)
-- ----------------------------
create or replace function public.learning_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = auth.uid()
      and lp.role in ('admin', 'instructor')
  );
$$;

-- ----------------------------
-- Activities (classes/events/self-study)
-- ----------------------------
create table if not exists public.learning_activities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('class', 'study_session', 'event', 'self_study')),
  title text not null,
  description text,
  show_on_main_events boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------
-- Sessions (scheduled occurrences)
-- ----------------------------
create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.learning_activities(id) on delete cascade,
  start_time timestamptz,
  end_time timestamptz,
  meeting_url text,
  seats_total integer,
  location text,
  created_at timestamptz not null default now()
);

create index if not exists learning_sessions_activity_id_start_idx
  on public.learning_sessions(activity_id, start_time);

-- ----------------------------
-- Registrations (student enrollment requests)
-- ----------------------------
create table if not exists public.learning_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.learning_sessions(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','cancelled','completed')),
  seats_reserved integer not null default 1,
  custom_fields jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, session_id)
);

create index if not exists learning_registrations_session_status_idx
  on public.learning_registrations(session_id, status);

-- ----------------------------
-- Materials (downloadables)
-- For self-study, session_id can be NULL.
-- ----------------------------
create table if not exists public.learning_materials (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.learning_activities(id) on delete cascade,
  session_id uuid references public.learning_sessions(id) on delete set null,
  title text not null,
  description text,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

create index if not exists learning_materials_activity_session_idx
  on public.learning_materials(activity_id, session_id);

-- ----------------------------
-- RLS
-- ----------------------------
alter table public.learning_profiles enable row level security;
alter table public.learning_activities enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_registrations enable row level security;
alter table public.learning_materials enable row level security;

-- Profiles policies
create policy "profiles_self_select"
  on public.learning_profiles for select
  using (user_id = auth.uid());

create policy "profiles_admin_select"
  on public.learning_profiles for select
  using (public.learning_is_admin());

create policy "profiles_self_insert"
  on public.learning_profiles for insert
  with check (user_id = auth.uid());

create policy "profiles_admin_manage"
  on public.learning_profiles for all
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

-- Activities policies (public read)
create policy "activities_public_select"
  on public.learning_activities for select
  using (true);

create policy "activities_admin_manage"
  on public.learning_activities for all
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

-- Sessions policies (public read)
create policy "sessions_public_select"
  on public.learning_sessions for select
  using (true);

create policy "sessions_admin_manage"
  on public.learning_sessions for all
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

-- Registrations policies
create policy "registrations_self_select"
  on public.learning_registrations for select
  using (user_id = auth.uid());

create policy "registrations_admin_select"
  on public.learning_registrations for select
  using (public.learning_is_admin());

create policy "registrations_self_insert_pending"
  on public.learning_registrations for insert
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );

create policy "registrations_admin_update_status"
  on public.learning_registrations for update
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

create policy "registrations_admin_delete"
  on public.learning_registrations for delete
  using (public.learning_is_admin());

-- Materials policies (enrolled-only)
create policy "materials_enrolled_select"
  on public.learning_materials for select
  using (
    -- Admin can always read
    public.learning_is_admin()
    OR
    (
      -- Session-based materials: approved registration for that session
      session_id is not null
      AND exists (
        select 1
        from public.learning_registrations r
        where r.user_id = auth.uid()
          and r.session_id = learning_materials.session_id
          and r.status in ('approved','completed')
      )
    )
    OR
    (
      -- Self-study materials: approved registration for any approved session of the same activity
      session_id is null
      AND exists (
        select 1
        from public.learning_registrations r
        join public.learning_sessions s on s.id = r.session_id
        where r.user_id = auth.uid()
          and s.activity_id = learning_materials.activity_id
          and r.status in ('approved','completed')
      )
    )
  );

create policy "materials_admin_manage"
  on public.learning_materials for all
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

-- ----------------------------
-- Storage policies
-- ----------------------------
-- Create a storage bucket named: `learning-materials`
-- Then add object-name conventions:
--   - Session materials:   session/<session_uuid>/<filename>
--   - Self-study materials: activity/<activity_uuid>/<filename>
--
-- The app generates signed URLs; RLS must allow object reads.
--
-- Storage object read policy (enrolled-only + admin)
-- Note: object `name` is the object path within the bucket.
create policy "learning_materials_storage_select"
  on storage.objects for select
  using (
    bucket_id = 'learning-materials'
    AND (
      public.learning_is_admin()
      OR
      (
        -- session/<session_uuid>/...
        split_part(name, '/', 1) = 'session'
        AND exists (
          select 1
          from public.learning_registrations r
          where r.user_id = auth.uid()
            and r.session_id = nullif(split_part(name, '/', 2), '')::uuid
            and r.status in ('approved','completed')
        )
      )
      OR
      (
        -- activity/<activity_uuid>/...
        split_part(name, '/', 1) = 'activity'
        AND exists (
          select 1
          from public.learning_registrations r
          join public.learning_sessions s on s.id = r.session_id
          where r.user_id = auth.uid()
            and s.activity_id = nullif(split_part(name, '/', 2), '')::uuid
            and r.status in ('approved','completed')
        )
      )
    )
  );

-- Storage insert/update/delete policy (admin only)
create policy "learning_materials_storage_admin_write"
  on storage.objects for all
  using (bucket_id = 'learning-materials' AND public.learning_is_admin())
  with check (bucket_id = 'learning-materials' AND public.learning_is_admin());
