-- Step 1: Create tables only. Run this first in Supabase SQL Editor.
-- If this fails, copy the error message.

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_instrument text default 'guitar' check (preferred_instrument in ('guitar', 'piano')),
  preferred_theme text default 'dark' check (preferred_theme in ('dark', 'light', 'mood')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

create index if not exists idx_recently_viewed_user_viewed on public.recently_viewed(user_id, viewed_at desc);
