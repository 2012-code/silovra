-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  bio text,
  avatar_url text,
  theme text default 'minimal',
  is_pro boolean default false,
  gumroad_sale_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create links table
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create analytics table
create table if not exists public.analytics (
  id uuid default gen_random_uuid() primary key,
  username text not null,
  link_id uuid references public.links(id) on delete cascade,
  type text not null, -- 'view' or 'click'
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.analytics enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Links policies
create policy "Links are viewable by everyone"
  on public.links for select
  using (true);

create policy "Users can insert own links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can update own links"
  on public.links for update
  using (auth.uid() = user_id);

create policy "Users can delete own links"
  on public.links for delete
  using (auth.uid() = user_id);

-- Analytics policies (write only, admin read)
create policy "Anyone can insert analytics"
  on public.analytics for insert
  with check (true);

-- Create indexes
create index profiles_username_idx on public.profiles(username);
create index links_user_id_idx on public.links(user_id);
create index links_order_idx on public.links("order");
create index analytics_username_idx on public.analytics(username);
create index analytics_link_id_idx on public.analytics(link_id);
create index analytics_timestamp_idx on public.analytics(timestamp);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
