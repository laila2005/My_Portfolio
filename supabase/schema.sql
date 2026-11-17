-- Portfolio content store.
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It is safe to run again; every statement is idempotent.
--
-- Each content type is one row per item. The item itself lives in the `data`
-- JSON column, using the same field names as the site's TypeScript types, so a
-- new field never needs a migration. `position` orders the items, and
-- `published = false` hides one from the public site while keeping it for you.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position integer not null default 0,
  published boolean not null default true,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  published boolean not null default true,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  published boolean not null default true,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Who may edit. Add yourself once, after creating your login (see SETUP.md).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.projects enable row level security;
alter table public.roles enable row level security;
alter table public.recommendations enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Visitors read only published items. An admin reads and changes everything.
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'roles', 'recommendations'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published = true)', t);
    execute format('create policy "admin full access" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- A signed-in user may see only their own admin row (enough to check "am I admin").
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array['projects', 'roles', 'recommendations'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- Image uploads: a public bucket anyone can read, only admins can change.
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read portfolio images" on storage.objects;
create policy "public read portfolio images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio-images');

drop policy if exists "admin write portfolio images" on storage.objects;
create policy "admin write portfolio images" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin())
  with check (bucket_id = 'portfolio-images' and public.is_admin());

-- CV upload: small key/value settings (the site reads which CV file is current),
-- plus a public bucket for PDFs that only admins can change.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-files', 'portfolio-files', true, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = true, file_size_limit = 10485760, allowed_mime_types = array['application/pdf'];

drop policy if exists "public read portfolio files" on storage.objects;
create policy "public read portfolio files" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio-files');

drop policy if exists "admin write portfolio files" on storage.objects;
create policy "admin write portfolio files" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio-files' and public.is_admin())
  with check (bucket_id = 'portfolio-files' and public.is_admin());
