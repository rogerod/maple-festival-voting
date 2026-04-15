-- Vermont Maple Festival People's Choice Voting
-- Run this in your Supabase SQL editor

-- Entries table
create table entries (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('art', 'poem', 'window_display', 'photography')),
  title text not null,
  contestant_name text not null,
  description text,
  image_url text,       -- for art, window_display, photography
  poem_text text,       -- for poem category
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Votes table
create table votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references entries(id) on delete cascade,
  category text not null,
  voter_fingerprint text not null,  -- localStorage UUID
  created_at timestamptz default now(),
  unique(category, voter_fingerprint)  -- one vote per category per browser
);

-- Vote counts view for fast reads
create view vote_counts as
  select entry_id, count(*) as vote_count
  from votes
  group by entry_id;

-- Enable RLS
alter table entries enable row level security;
alter table votes enable row level security;

-- Public can read entries
create policy "entries_public_read" on entries for select using (true);

-- Public can read votes (for counts)
create policy "votes_public_read" on votes for select using (true);

-- Public can insert votes
create policy "votes_public_insert" on votes for insert with check (true);

-- Storage bucket for images (create manually in Supabase dashboard)
-- Dashboard > Storage > New Bucket > name: "contest-images" > Public: ON
