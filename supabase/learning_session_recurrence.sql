-- Monthly recurrence for learning sessions. Existing sessions remain one-time events.
alter table public.learning_sessions
  add column if not exists recurrence_rule text not null default 'none',
  add column if not exists recurrence_ordinal smallint,
  add column if not exists recurrence_weekday smallint,
  add column if not exists recurrence_until date;

alter table public.learning_sessions
  drop constraint if exists learning_sessions_recurrence_rule_check,
  add constraint learning_sessions_recurrence_rule_check
    check (recurrence_rule in ('none', 'monthly_nth_weekday')),
  drop constraint if exists learning_sessions_recurrence_ordinal_check,
  add constraint learning_sessions_recurrence_ordinal_check
    check (recurrence_ordinal is null or recurrence_ordinal between 1 and 5),
  drop constraint if exists learning_sessions_recurrence_weekday_check,
  add constraint learning_sessions_recurrence_weekday_check
    check (recurrence_weekday is null or recurrence_weekday between 0 and 6),
  drop constraint if exists learning_sessions_recurrence_fields_check,
  add constraint learning_sessions_recurrence_fields_check
    check (
      recurrence_rule = 'none'
      or (recurrence_ordinal is not null and recurrence_weekday is not null)
    );

comment on column public.learning_sessions.recurrence_rule is
  'Whether the session occurs once or on an ordinal weekday every month.';
comment on column public.learning_sessions.recurrence_ordinal is
  'Monthly occurrence number: 1 through 5.';
comment on column public.learning_sessions.recurrence_weekday is
  'Day of week using JavaScript convention: Sunday=0 through Saturday=6.';
comment on column public.learning_sessions.recurrence_until is
  'Optional final date for a recurring monthly session.';
