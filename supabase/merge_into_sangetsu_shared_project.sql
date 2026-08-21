-- Run this in the SQL editor of the active USASangetsu Supabase project.
-- Purpose: add the World Messianic / Miroku USA learning + organization tables
-- into the Sangetsu project so both websites can share one backend.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------
-- World Messianic learning profiles / roles
-- ----------------------------
create table if not exists public.learning_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin', 'center_admin', 'super_admin')),
  full_name text,
  phone text,
  preferred_language text,
  email text,
  managed_center_id text,
  created_at timestamptz not null default now()
);

-- ----------------------------
-- World Messianic centers/groups
-- ----------------------------
create table if not exists public.organization_centers (
  id text primary key,
  slug text not null unique,
  kind text not null default 'center' check (kind in ('center', 'group', 'hq')),
  name text not null,
  city text not null default '',
  state text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  schedule text,
  notes text,
  leadership_head text,
  leadership_assistant text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_centers_kind_active_idx
  on public.organization_centers(kind, is_active, display_order, name);

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'learning_profiles_managed_center_id_fkey'
      and table_name = 'learning_profiles'
  ) then
    alter table public.learning_profiles
      add constraint learning_profiles_managed_center_id_fkey
      foreign key (managed_center_id) references public.organization_centers(id) on delete set null;
  end if;
end
$$;

drop trigger if exists organization_centers_set_updated_at on public.organization_centers;
create trigger organization_centers_set_updated_at
before update on public.organization_centers
for each row
execute function public.set_updated_at();

-- ----------------------------
-- World Messianic learning activities
-- ----------------------------
create table if not exists public.learning_activities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('class', 'study_session', 'event', 'self_study')),
  title text not null,
  description text,
  center_id text,
  show_on_main_events boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.learning_activities
  add column if not exists show_on_main_events boolean not null default true;

comment on column public.learning_activities.show_on_main_events is
  'When true, the event appears on the public /events listing. Center-linked events still appear on their center/group event page when false.';

create index if not exists learning_activities_center_id_idx
  on public.learning_activities(center_id);

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'learning_activities_center_id_fkey'
      and table_name = 'learning_activities'
  ) then
    alter table public.learning_activities
      add constraint learning_activities_center_id_fkey
      foreign key (center_id) references public.organization_centers(id) on delete set null;
  end if;
end
$$;

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.learning_activities(id) on delete cascade,
  start_time timestamptz,
  end_time timestamptz,
  meeting_url text,
  seats_total integer,
  location text,
  recurrence_rule text not null default 'none'
    check (recurrence_rule in ('none', 'monthly_nth_weekday')),
  recurrence_ordinal smallint check (recurrence_ordinal is null or recurrence_ordinal between 1 and 5),
  recurrence_weekday smallint check (recurrence_weekday is null or recurrence_weekday between 0 and 6),
  recurrence_until date,
  created_at timestamptz not null default now()
);

alter table public.learning_sessions
  add column if not exists recurrence_rule text not null default 'none',
  add column if not exists recurrence_ordinal smallint,
  add column if not exists recurrence_weekday smallint,
  add column if not exists recurrence_until date;

create index if not exists learning_sessions_activity_id_start_idx
  on public.learning_sessions(activity_id, start_time);

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
-- Role helpers
-- ----------------------------
create or replace function public.learning_is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = auth.uid()
      and lp.role in ('admin', 'instructor', 'super_admin', 'center_admin')
  );
$$;

create or replace function public.learning_is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = auth.uid()
      and lp.role in ('super_admin', 'admin', 'instructor')
  );
$$;

create or replace function public.learning_can_manage_center(target_center_id text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.learning_profiles lp
    where lp.user_id = auth.uid()
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
as $$
  select
    public.learning_is_super_admin()
    or (
      activity_center_id is not null
      and public.learning_can_manage_center(activity_center_id)
    );
$$;

-- ----------------------------
-- RLS
-- ----------------------------
alter table public.learning_profiles enable row level security;
alter table public.organization_centers enable row level security;
alter table public.learning_activities enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_registrations enable row level security;
alter table public.learning_materials enable row level security;

drop policy if exists profiles_self_select on public.learning_profiles;
create policy profiles_self_select
  on public.learning_profiles for select
  using (user_id = auth.uid());

drop policy if exists profiles_self_insert on public.learning_profiles;
create policy profiles_self_insert
  on public.learning_profiles for insert
  with check (user_id = auth.uid());

drop policy if exists profiles_admin_select on public.learning_profiles;
create policy profiles_admin_select
  on public.learning_profiles for select
  using (public.learning_is_super_admin());

drop policy if exists profiles_admin_manage on public.learning_profiles;
create policy profiles_admin_manage
  on public.learning_profiles for all
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

drop policy if exists organization_centers_public_select on public.organization_centers;
create policy organization_centers_public_select
  on public.organization_centers for select
  using (is_active = true or public.learning_can_manage_center(id));

drop policy if exists organization_centers_super_admin_manage on public.organization_centers;
create policy organization_centers_super_admin_manage
  on public.organization_centers for all
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

drop policy if exists organization_centers_center_admin_update on public.organization_centers;
create policy organization_centers_center_admin_update
  on public.organization_centers for update
  using (public.learning_can_manage_center(id))
  with check (public.learning_can_manage_center(id));

drop policy if exists activities_public_select on public.learning_activities;
create policy activities_public_select
  on public.learning_activities for select
  using (true);

drop policy if exists activities_admin_manage on public.learning_activities;
create policy activities_admin_manage
  on public.learning_activities for all
  using (public.learning_can_manage_activity(center_id))
  with check (public.learning_can_manage_activity(center_id));

drop policy if exists sessions_public_select on public.learning_sessions;
create policy sessions_public_select
  on public.learning_sessions for select
  using (true);

drop policy if exists sessions_admin_manage on public.learning_sessions;
create policy sessions_admin_manage
  on public.learning_sessions for all
  using (
    exists (
      select 1
      from public.learning_activities a
      where a.id = learning_sessions.activity_id
        and public.learning_can_manage_activity(a.center_id)
    )
  )
  with check (
    exists (
      select 1
      from public.learning_activities a
      where a.id = learning_sessions.activity_id
        and public.learning_can_manage_activity(a.center_id)
    )
  );

drop policy if exists registrations_self_select on public.learning_registrations;
create policy registrations_self_select
  on public.learning_registrations for select
  using (user_id = auth.uid());

drop policy if exists registrations_self_insert_pending on public.learning_registrations;
create policy registrations_self_insert_pending
  on public.learning_registrations for insert
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );

drop policy if exists registrations_admin_select on public.learning_registrations;
create policy registrations_admin_select
  on public.learning_registrations for select
  using (
    public.learning_is_super_admin()
    or exists (
      select 1
      from public.learning_sessions s
      join public.learning_activities a on a.id = s.activity_id
      where s.id = learning_registrations.session_id
        and public.learning_can_manage_activity(a.center_id)
    )
  );

drop policy if exists registrations_admin_update_status on public.learning_registrations;
create policy registrations_admin_update_status
  on public.learning_registrations for update
  using (
    public.learning_is_super_admin()
    or exists (
      select 1
      from public.learning_sessions s
      join public.learning_activities a on a.id = s.activity_id
      where s.id = learning_registrations.session_id
        and public.learning_can_manage_activity(a.center_id)
    )
  )
  with check (
    public.learning_is_super_admin()
    or exists (
      select 1
      from public.learning_sessions s
      join public.learning_activities a on a.id = s.activity_id
      where s.id = learning_registrations.session_id
        and public.learning_can_manage_activity(a.center_id)
    )
  );

drop policy if exists registrations_admin_delete on public.learning_registrations;
create policy registrations_admin_delete
  on public.learning_registrations for delete
  using (
    public.learning_is_super_admin()
    or exists (
      select 1
      from public.learning_sessions s
      join public.learning_activities a on a.id = s.activity_id
      where s.id = learning_registrations.session_id
        and public.learning_can_manage_activity(a.center_id)
    )
  );

drop policy if exists materials_enrolled_select on public.learning_materials;
create policy materials_enrolled_select
  on public.learning_materials for select
  using (
    public.learning_is_admin()
    or (
      session_id is not null
      and exists (
        select 1
        from public.learning_registrations r
        where r.user_id = auth.uid()
          and r.session_id = learning_materials.session_id
          and r.status in ('approved','completed')
      )
    )
    or (
      session_id is null
      and exists (
        select 1
        from public.learning_registrations r
        join public.learning_sessions s on s.id = r.session_id
        where r.user_id = auth.uid()
          and s.activity_id = learning_materials.activity_id
          and r.status in ('approved','completed')
      )
    )
  );

drop policy if exists materials_admin_manage on public.learning_materials;
create policy materials_admin_manage
  on public.learning_materials for all
  using (public.learning_is_admin())
  with check (public.learning_is_admin());

-- Storage bucket needed by the USA site:
-- Create bucket `learning-materials` in Storage after running this SQL.
