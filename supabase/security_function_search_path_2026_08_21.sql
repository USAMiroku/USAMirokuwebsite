-- Follow-up to security_hardening_2026_08_21.sql.
-- Keep the invoker helper deterministic and immune to caller-controlled paths.
alter function public.learning_is_admin() set search_path = '';
