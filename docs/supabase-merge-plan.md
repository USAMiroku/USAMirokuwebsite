# Supabase Merge Plan

Goal: keep both websites on separate domains, but move them onto one shared Supabase project to reduce cost and simplify administration.

Recommended target project:
- `USASangetsu` stays as the shared Supabase project

Why this project:
- It is active now
- It already supports payments, registrations, portal data, and admin flows
- The `worldmessianic` schema can be added without naming collisions because it uses `learning_*` table names

What stays separate:
- `www.worldmessianic.org` and `www.usasangetsu.org` keep separate domains
- each site keeps its own frontend and Vercel project
- each site can keep separate UI, admin pages, and business logic

What becomes shared:
- one Supabase Auth user pool
- one Postgres database
- one storage/account backend

Schema overlap summary:
- `worldmessianic` uses:
  - `organization_centers`
  - `learning_profiles`
  - `learning_activities`
  - `learning_sessions`
  - `learning_registrations`
  - `learning_materials`
- `sangetsu` uses:
  - `profiles`
  - `locations`
  - `centers`
  - `activities`
  - `activity_locations`
  - `workshops`
  - `registrations`
  - `students`
  - `enrollments`
  - `payments`
  - `payment_items`
  - `instructors`

Because the USA site uses `learning_*` names, both systems can coexist in one project without immediate table renames.

Recommended order:
1. Back up both Supabase projects
2. Run the merge SQL in the `USASangetsu` project
3. Seed/import USA organization centers if needed
4. Update `worldmessianic` Vercel env vars to point at the `USASangetsu` project
5. Test admin login, password reset, learning pages, and public centers
6. Only after verification, stop using the old `Miroku USA webpage` project

Important caution:
- Do not delete the old USA project until both websites are fully tested on the shared backend.
- Since auth will be shared, use role checks carefully so Sangetsu admins and USA admins only see the areas they should manage.
