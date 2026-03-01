-- Step 2: RLS policies. Run after Step 1 succeeds.

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.favorites enable row level security;
alter table public.recently_viewed enable row level security;

-- Drop existing policies (safe to re-run)
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can manage own collections" on public.collections;
drop policy if exists "Users can manage own favorites" on public.favorites;
drop policy if exists "Users can manage own recently viewed" on public.recently_viewed;

-- Create policies
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own collections" on public.collections for all using (auth.uid() = user_id);
create policy "Users can manage own favorites" on public.favorites for all using (auth.uid() = user_id);
create policy "Users can manage own recently viewed" on public.recently_viewed for all using (auth.uid() = user_id);
