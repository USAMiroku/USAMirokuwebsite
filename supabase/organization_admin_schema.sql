-- Organization admin schema for centers, groups, and scoped admin roles.
-- Run after `learning_schema.sql` and `learning_add_center_id.sql`.

create extension if not exists pgcrypto;

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organization_centers_set_updated_at on public.organization_centers;
create trigger organization_centers_set_updated_at
before update on public.organization_centers
for each row
execute function public.set_updated_at();

insert into public.organization_centers (
  id, slug, kind, name, city, state, address, phone, email, schedule, leadership_head, leadership_assistant, display_order
)
values
  ('boston-johrei-center', 'boston-johrei-center', 'center', 'Boston Johrei Center', 'Boston', 'Massachusetts', '230 Congress Street, 5th Floor, Boston, MA 02110', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', 'Center Head', 'Assistant', 10),
  ('los-angeles-johrei-center', 'los-angeles-johrei-center', 'center', 'Los Angeles Johrei Center', 'Los Angeles', 'California', '2730 W 8th Street, Suite 100, Los Angeles, CA 90005', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', null, null, 20),
  ('miami-johrei-center', 'miami-johrei-center', 'center', 'Miami Johrei Center', 'Miami', 'Florida', '14180 SW 88th Street, Suite 201, Miami, FL 33186', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', null, null, 30),
  ('new-york-johrei-center', 'new-york-johrei-center', 'center', 'New York Johrei Center', 'Long Island City', 'New York', '47-10 32nd Place, Suite 207, Long Island City, NY 11101', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', 'Center Head', 'Assistant', 40),
  ('orlando-johrei-center', 'orlando-johrei-center', 'center', 'Orlando Johrei Center', 'Orlando', 'Florida', '9401 S Orange Blossom Trail, Suite 5, Orlando, FL 32837', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', null, null, 50),
  ('washington-dc', 'washington-dc', 'group', 'Washington DC', 'Washington', 'DC', '', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', null, null, 60),
  ('national-headquarters', 'national-headquarters', 'hq', 'National Headquarters', 'Long Island City', 'New York', '47-10 32nd Place, Suite 207, Long Island City, NY 11101', '+1 (305) 308-8830', 'info@miroku.us', 'By appointment.', null, null, 70)
on conflict (id) do update set
  slug = excluded.slug,
  kind = excluded.kind,
  name = excluded.name,
  city = excluded.city,
  state = excluded.state,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  schedule = excluded.schedule,
  leadership_head = excluded.leadership_head,
  leadership_assistant = excluded.leadership_assistant,
  display_order = excluded.display_order;

alter table public.learning_profiles
  add column if not exists email text,
  add column if not exists managed_center_id text references public.organization_centers(id) on delete set null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'learning_profiles_role_check'
      and conrelid = 'public.learning_profiles'::regclass
  ) then
    alter table public.learning_profiles drop constraint learning_profiles_role_check;
  end if;
end
$$;

alter table public.learning_profiles
  add constraint learning_profiles_role_check
  check (role in ('student', 'instructor', 'admin', 'center_admin', 'super_admin'));

update public.learning_profiles
set role = 'super_admin'
where role = 'admin';

comment on column public.learning_profiles.managed_center_id is 'Assigned center/group for center_admin users.';

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
    where lp.user_id = auth.uid()
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
    where lp.user_id = auth.uid()
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

drop policy if exists organization_centers_public_select on public.organization_centers;
drop policy if exists organization_centers_super_admin_manage on public.organization_centers;
drop policy if exists organization_centers_center_admin_select on public.organization_centers;
drop policy if exists organization_centers_center_admin_update on public.organization_centers;

alter table public.organization_centers enable row level security;

create policy organization_centers_public_select
  on public.organization_centers for select
  using (is_active = true or public.learning_can_manage_center(id));

create policy organization_centers_super_admin_manage
  on public.organization_centers for all
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

create policy organization_centers_center_admin_update
  on public.organization_centers for update
  using (public.learning_can_manage_center(id))
  with check (public.learning_can_manage_center(id));

drop policy if exists profiles_admin_select on public.learning_profiles;
drop policy if exists profiles_admin_manage on public.learning_profiles;

create policy profiles_admin_select
  on public.learning_profiles for select
  using (public.learning_is_super_admin());

create policy profiles_admin_manage
  on public.learning_profiles for all
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

drop policy if exists activities_admin_manage on public.learning_activities;
create policy activities_admin_manage
  on public.learning_activities for all
  using (public.learning_can_manage_activity(center_id))
  with check (public.learning_can_manage_activity(center_id));

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

drop policy if exists registrations_admin_select on public.learning_registrations;
drop policy if exists registrations_admin_update_status on public.learning_registrations;
drop policy if exists registrations_admin_delete on public.learning_registrations;

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
