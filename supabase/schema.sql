-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  theme text default 'light',
  background_image_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create links table
create table links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  position integer,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create analytics table
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  link_id uuid references links on delete cascade not null,
  event_type text not null, -- 'view' or 'click'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  ip_address text
);

-- Create RLS policies
alter table profiles enable row level security;
alter table links enable row level security;
alter table analytics enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Links policies
create policy "Public links are viewable by everyone"
  on links for select
  using ( true );

create policy "Users can insert their own links"
  on links for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own links"
  on links for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own links"
  on links for delete
  using ( auth.uid() = user_id );

-- Analytics policies
create policy "Analytics are viewable by link owner"
  on analytics for select
  using ( auth.uid() in (
    select user_id from links where id = analytics.link_id
  ) );

create policy "Analytics can be inserted by anyone"
  on analytics for insert
  with check ( true );

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
