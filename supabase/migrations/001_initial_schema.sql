-- =========================================
-- PRANJAL GIRI PORTFOLIO — SUPABASE SCHEMA
-- =========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  public_id text unique not null,
  username text unique not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup (supports both Email/Password and Google OAuth).
-- pranjalgiri1122005@gmail.com ALWAYS receives 'admin' role.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_role text;
  v_username text;
  v_avatar text;
begin
  -- 1. Determine administrative authorization
  if new.email = 'pranjalgiri1122005@gmail.com' then
    v_role := 'admin';
  else
    v_role := 'user';
  end if;

  -- 2. Determine username / callsign
  v_username := coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- 3. Determine avatar if provided by OAuth provider (e.g. Google)
  v_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    null
  );

  insert into public.profiles (id, public_id, username, role, avatar_url)
  values (
    new.id,
    'PG-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 5)),
    v_username,
    v_role,
    v_avatar
  )
  on conflict (id) do update set
    username = excluded.username,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    role = case when new.email = 'pranjalgiri1122005@gmail.com' then 'admin' else public.profiles.role end;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- PROJECTS
-- =========================================
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  category text not null check (category in ('flight', 'robotics', 'uav', 'ai', 'software', 'embedded')),
  status text not null default 'active' check (status in ('active', 'completed', 'archived', 'simulation')),
  featured boolean default false,
  github_url text,
  demo_url text,
  documentation_url text,
  cover_image text,
  model_url text,
  technologies text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.project_links (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  github_url text,
  demo_url text,
  documentation_url text,
  youtube_url text
);

create table public.project_media (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  url text not null,
  type text default 'image' check (type in ('image', 'video', 'model')),
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.update_updated_at();

-- =========================================
-- POSTS (BLOG)
-- =========================================
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  category text,
  tags text[] default '{}',
  published boolean default false,
  published_at timestamptz,
  read_time integer default 5,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger posts_updated_at before update on public.posts
  for each row execute procedure public.update_updated_at();

create table public.post_tags (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  tag text not null
);

-- =========================================
-- COMMENTS
-- =========================================
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now() not null
);

-- =========================================
-- LIKES & BOOKMARKS
-- =========================================
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, project_id),
  unique(user_id, post_id)
);

create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, project_id)
);

-- =========================================
-- CONTACT MESSAGES
-- =========================================
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  msg_id text unique not null,
  read boolean default false,
  replied boolean default false,
  created_at timestamptz default now() not null
);

-- =========================================
-- SITE STATS
-- =========================================
create table public.site_stats (
  id uuid default gen_random_uuid() primary key,
  active_projects integer default 0,
  completed_projects integer default 0,
  blog_posts integer default 0,
  total_users integer default 0,
  updated_at timestamptz default now() not null
);

insert into public.site_stats (active_projects, completed_projects, blog_posts, total_users)
values (6, 17, 0, 0);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

-- Helper function: is the current user admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles viewable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Projects
alter table public.projects enable row level security;
create policy "Public projects viewable" on public.projects for select using (true);
create policy "Admin insert projects" on public.projects for insert with check (public.is_admin());
create policy "Admin update projects" on public.projects for update using (public.is_admin());
create policy "Admin delete projects" on public.projects for delete using (public.is_admin());

-- Project links + media
alter table public.project_links enable row level security;
create policy "Public project_links viewable" on public.project_links for select using (true);
create policy "Admin manages project_links" on public.project_links for all using (public.is_admin());

alter table public.project_media enable row level security;
create policy "Public project_media viewable" on public.project_media for select using (true);
create policy "Admin manages project_media" on public.project_media for all using (public.is_admin());

-- Posts: published posts are public; admin sees all
alter table public.posts enable row level security;
create policy "Published posts viewable" on public.posts for select using (published = true or public.is_admin());
create policy "Admin manages posts" on public.posts for all using (public.is_admin());

-- Comments
alter table public.comments enable row level security;
create policy "Comments viewable" on public.comments for select using (true);
create policy "Authenticated users comment" on public.comments for insert with check (auth.uid() = author_id);
create policy "Users delete own comments" on public.comments for delete using (auth.uid() = author_id);
create policy "Admin deletes any comment" on public.comments for delete using (public.is_admin());

-- Likes
alter table public.likes enable row level security;
create policy "Likes viewable" on public.likes for select using (true);
create policy "Authenticated users like" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users unlike" on public.likes for delete using (auth.uid() = user_id);

-- Bookmarks
alter table public.bookmarks enable row level security;
create policy "Users see own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users bookmark" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users unbookmark" on public.bookmarks for delete using (auth.uid() = user_id);

-- Contact messages
alter table public.contact_messages enable row level security;
create policy "Anyone can submit contact" on public.contact_messages for insert with check (true);
create policy "Admin reads contact" on public.contact_messages for select using (public.is_admin());
create policy "Admin updates contact" on public.contact_messages for update using (public.is_admin());
create policy "Admin deletes contact" on public.contact_messages for delete using (public.is_admin());

-- Site stats
alter table public.site_stats enable row level security;
create policy "Site stats public" on public.site_stats for select using (true);

-- =========================================
-- REALTIME
-- =========================================
alter publication supabase_realtime add table public.contact_messages;

-- =========================================
-- SAMPLE PROJECTS DATA
-- =========================================
insert into public.projects (slug, title, short_description, description, category, status, featured, technologies, sort_order)
values
  ('srad-flight-software', 'SRAD Flight Software', 'ESP32-based flight computer for SRAD rocketry', 'Custom flight computer software for student-researched and designed rockets. Features apogee detection, parachute deployment sequencing, and real-time telemetry via LoRa. Built for Team Ignition''s competition rockets.', 'flight', 'active', true, ARRAY['C++', 'ESP32', 'LoRa', 'BMP390', 'MPU6050', 'GPS'], 1),
  ('rocketpy-simulator', 'RocketPy Simulator', 'Flight simulation and trajectory analysis', 'Python-based 6-DOF rocket flight simulator using RocketPy. Generates altitude, velocity, and apogee predictions for mission planning. Used to validate SRAD-01 flight profile before launch.', 'flight', 'completed', true, ARRAY['Python', 'RocketPy', 'NumPy', 'Matplotlib'], 2),
  ('active-fin-stabilization', 'Active Fin Stabilization', 'PID-controlled aerodynamic stability system', 'Servo-actuated fin system for rocket roll stabilization. Uses IMU feedback through a PID controller to maintain zero-roll flight throughout the boost phase.', 'flight', 'active', false, ARRAY['C++', 'ESP32', 'MPU6050', 'PID', 'Servo'], 3),
  ('glance-telemetry', 'Glance Telemetry Platform', 'Real-time telemetry dashboard for rocket flights', 'Serial-to-browser telemetry platform. Reads sensor data from ESP32 via USB, streams it via WebSocket to a React dashboard showing live altitude, velocity, orientation, and mission phase.', 'software', 'active', true, ARRAY['React', 'Python', 'WebSocket', 'C++', 'Serial', 'Three.js'], 4),
  ('lidar-ugv', 'LiDAR UGV Navigation', 'Autonomous ground vehicle with LiDAR mapping', 'UGV platform with autonomous navigation using RPLIDAR A1, obstacle avoidance via PID control, running on Jetson Nano with ROS. Achieves real-time SLAM mapping at 10Hz.', 'robotics', 'active', true, ARRAY['Python', 'ROS', 'RPLIDAR', 'Jetson Nano', 'PID', 'OpenCV'], 5),
  ('deepfake-detection', 'Deepfake Detection AI', 'ResNet18-based synthetic media classifier', 'Deep learning model using ResNet18 fine-tuned on the FaceForensics++ dataset. Achieves 94% accuracy on detecting AI-generated face videos. Includes a web interface for live classification.', 'ai', 'completed', true, ARRAY['Python', 'PyTorch', 'ResNet18', 'OpenCV', 'CUDA', 'Flask'], 6);
