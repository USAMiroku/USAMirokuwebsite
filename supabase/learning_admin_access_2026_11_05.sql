-- Admin access allowlist (2026-11-05)
--
-- Purpose: decide admin permission by EMAIL ADDRESS instead of by who happens to
-- have an account. A super admin lists the emails allowed to administer the site;
-- when somebody signs in (password, Google, or any future provider) the matching
-- entry is applied to their profile automatically.
--
-- Rule: an email listed here is authoritative for that person's role. An account
-- whose email is NOT listed keeps whatever role it already has, so existing
-- manually-created admins are never disturbed by this table.
--
-- Apply to the USASangetsu project (gstvlyjpboeimrwxpupv) -- the project the live
-- website uses. Review before applying; committing this file does not apply it.

create table if not exists public.learning_admin_access (
  email text primary key,
  role text not null check (role in ('center_admin', 'super_admin')),
  managed_center_id text references public.organization_centers (id) on delete set null,
  note text,
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  last_applied_at timestamptz,
  last_applied_user_id uuid references auth.users (id) on delete set null,
  constraint learning_admin_access_email_lowercase check (email = lower(email)),
  constraint learning_admin_access_email_shape check (email like '%_@_%._%'),
  constraint learning_admin_access_center_required
    check (role <> 'center_admin' or managed_center_id is not null)
);

comment on table public.learning_admin_access is
  'Email addresses allowed to administer the site. Applied on sign-in by /api/learning/profile.';

alter table public.learning_admin_access enable row level security;

-- Only super admins can read or change the allowlist. Everything else reaches it
-- through the service-role API routes.
drop policy if exists learning_admin_access_super_admin_manage on public.learning_admin_access;
create policy learning_admin_access_super_admin_manage
  on public.learning_admin_access
  for all
  to authenticated
  using (public.learning_is_super_admin())
  with check (public.learning_is_super_admin());

-- Seed the allowlist from the admins that already exist, so turning this on does
-- not change anybody's current access.
insert into public.learning_admin_access (email, role, managed_center_id, note)
select lower(u.email),
       p.role,
       p.managed_center_id,
       'Imported from existing access on 2026-11-05'
from public.learning_profiles p
join auth.users u on u.id = p.user_id
where p.role in ('center_admin', 'super_admin')
  and u.email is not null
  and (p.role <> 'center_admin' or p.managed_center_id is not null)
on conflict (email) do nothing;
