-- 1. Table Updates (Safe to run multiple times)
create table if not exists surprises (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist (in case table was created earlier without them)
alter table surprises add column if not exists sender_name text;
alter table surprises add column if not exists recipient_name text;
alter table surprises add column if not exists intro_message text;
alter table surprises add column if not exists personal_note text;
alter table surprises add column if not exists final_message text;
alter table surprises add column if not exists cake_flavor text;
alter table surprises add column if not exists cake_style text;
alter table surprises add column if not exists candle_count int;
alter table surprises add column if not exists song_url text;
alter table surprises add column if not exists voice_message_url text;
alter table surprises add column if not exists wheel_options jsonb;
alter table surprises add column if not exists is_public boolean default true;
alter table surprises add column if not exists is_viewed boolean default false;

-- 2. Security Policies (Data)
alter table surprises enable row level security;

-- Drop old policies to avoid "already exists" errors
drop policy if exists "Public Create" on surprises;
drop policy if exists "Public Read" on surprises;
drop policy if exists "Public Update" on surprises;

create policy "Public Create" on surprises for insert with check (true);
create policy "Public Read" on surprises for select using (true);
create policy "Public Update" on surprises for update using (true);

-- 3. Storage Setup (Safe to run multiple times)
insert into storage.buckets (id, name, public) 
values ('media', 'media', true) 
on conflict (id) do nothing;

-- Drop old storage policies
drop policy if exists "Public Media Upload" on storage.objects;
drop policy if exists "Public Media Select" on storage.objects;
drop policy if exists "Public Media Delete" on storage.objects;

-- Create Storage Policies
create policy "Public Media Upload" on storage.objects 
  for insert with check ( bucket_id = 'media' );

create policy "Public Media Select" on storage.objects 
  for select using ( bucket_id = 'media' );

create policy "Public Media Delete" on storage.objects 
  for delete using ( bucket_id = 'media' );
