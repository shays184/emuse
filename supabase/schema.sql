-- eMuse Phase 6 — Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_instrument text default 'guitar' check (preferred_instrument in ('guitar', 'piano')),
  preferred_theme text default 'dark' check (preferred_theme in ('dark', 'light', 'mood')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Collections (named groups for favorites)
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- Favorites (cloud-synced)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  mood text not null,
  instrument text not null,
  chords jsonb not null,
  key text not null,
  scale text not null,
  complexity int not null,
  theory text not null,
  created_at timestamptz default now()
);
create unique index if not exists idx_favorites_unique on public.favorites(user_id, mood, instrument, key, (chords::text));

-- Recently viewed
create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  instrument text not null,
  chords jsonb not null,
  key text not null,
  scale text not null,
  complexity int not null,
  theory text not null,
  viewed_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.favorites enable row level security;
alter table public.recently_viewed enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can manage own collections" on public.collections;
drop policy if exists "Users can manage own favorites" on public.favorites;
drop policy if exists "Users can manage own recently viewed" on public.recently_viewed;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own collections" on public.collections for all using (auth.uid() = user_id);
create policy "Users can manage own favorites" on public.favorites for all using (auth.uid() = user_id);
create policy "Users can manage own recently viewed" on public.recently_viewed for all using (auth.uid() = user_id);

-- Index for recently viewed (keep last 20 per user)
create index if not exists idx_recently_viewed_user_viewed on public.recently_viewed(user_id, viewed_at desc);
