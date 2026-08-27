-- Adds per-user language preference used by LanguageContext.js
-- Supported: sw, en, fr, ar, zh, hi

alter table public.users
  add column if not exists language text not null default 'sw';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_language_check'
  ) then
    alter table public.users
      add constraint users_language_check
      check (language in ('sw', 'en', 'fr', 'ar', 'zh', 'hi'));
  end if;
end $$;
