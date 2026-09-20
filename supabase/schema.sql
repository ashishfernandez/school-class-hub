-- GISSVROOS Class Events - Supabase schema
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- ============================ ANNOUNCEMENTS ============================
create table if not exists public.announcements (
  id         text primary key,
  title      text not null,
  category   text,
  priority   text default 'general',
  content    text,
  author     text,
  date       text,               -- stored as 'YYYY-MM-DD'
  time       text,
  location   text,
  pinned       boolean default false,
  marquee      boolean default false,
  marquee_only boolean default false, -- shows ONLY in the top banner, not as a tile
  position     integer default 0,  -- controls order shown on the main page
  created_at   timestamptz default now()
);

-- If the announcements table already exists from an earlier version, add the
-- new columns (safe to run repeatedly):
alter table public.announcements add column if not exists time         text;
alter table public.announcements add column if not exists location     text;
alter table public.announcements add column if not exists marquee_only boolean default false;

-- ============================== EVENTS ================================
create table if not exists public.events (
  id          text primary key,
  title       text not null,
  category    text,
  date        text,              -- stored as 'YYYY-MM-DD'
  time        text,
  location    text,
  description text,
  organizer   text,
  created_at  timestamptz default now()
);

-- ============================== ACCESS ================================
-- Enable Row Level Security, then allow public (anon) access.
-- NOTE: This lets anyone with the site read AND write. That matches the app's
-- current model (the admin password is only enforced in the browser). For a
-- small class hub this is usually acceptable. Ask to add real auth later to
-- restrict writes to signed-in admins.
alter table public.announcements enable row level security;
alter table public.events enable row level security;

create policy "public read announcements"  on public.announcements for select using (true);
create policy "public write announcements" on public.announcements for insert with check (true);
create policy "public update announcements" on public.announcements for update using (true) with check (true);
create policy "public delete announcements" on public.announcements for delete using (true);

create policy "public read events"  on public.events for select using (true);
create policy "public write events" on public.events for insert with check (true);
create policy "public update events" on public.events for update using (true) with check (true);
create policy "public delete events" on public.events for delete using (true);
