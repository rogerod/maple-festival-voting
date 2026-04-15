# 🍁 Vermont Maple Festival — People's Choice Voting App

A full-stack voting app for the Vermont Maple Festival People's Choice Awards. Built with Next.js + Supabase, deployable to Vercel for free.

---

## Features

- **4 contest categories**: Best Art, Best Poem, Best Window Display, Best Photography
- **Image lightbox** — click any image to enlarge full-screen
- **One vote per category per browser** (localStorage fingerprint + DB constraint)
- **Admin panel** at `/admin` — upload entries, images, poems
- **Results page** at `/results` — ranked leaderboard per category
- Scales to thousands of voters on free tiers

---

## Setup (~30 minutes)

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → create a free account
2. Click **New Project** — name it `maple-festival`, choose US East region
3. Wait ~2 minutes for it to spin up

### Step 2 — Run the database schema

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase-setup.sql`
3. Click **Run** — you should see "Success. No rows returned."

### Step 3 — Create the image storage bucket

1. Supabase dashboard → **Storage** → **New Bucket**
2. Name it exactly: `contest-images`
3. Toggle **Public bucket** ON → **Create bucket**

### Step 4 — Get your credentials

Supabase dashboard → **Settings → API** → copy:
- **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
- **anon / public key** (long `eyJ...` string)

### Step 5 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_ADMIN_PASSWORD=Vermont#Maple2025
```

### Step 6 — Run locally

```bash
npm install
npm run dev
```

- Voting page: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Results: [http://localhost:3000/results](http://localhost:3000/results)

---

## Deploy to Vercel

```bash
git init && git add . && git commit -m "initial"
# Push to a new GitHub repo, then:
```

1. [vercel.com](https://vercel.com) → **Add New Project** → import your repo
2. Add the 3 environment variables (same as `.env.local`)
3. Click **Deploy** → your live URL is ready

---

## Adding Contest Entries

Go to `/admin` and log in with your admin password.

**Image categories (Art, Window Display, Photography):**
- Fill in title, contestant name, optional description
- Upload image (JPG/PNG, 1200px+ wide recommended)
- Set Display Order (1, 2, 3...) to control sequence

**Poem category:**
- Select "Best Poem"
- Paste poem text — no image needed

---

## Pages

| URL | Purpose |
|-----|---------|
| `/` | Public voting page |
| `/admin` | Manage entries (password protected) |
| `/results` | Live vote tallies ranked by category |

---

## Resetting Votes (for testing)

In Supabase SQL Editor: `DELETE FROM votes;`
Clears all votes, keeps all entries.

---

## Tech Stack

Next.js 15 · Supabase (Postgres + Storage) · Vercel · Playfair Display + Source Serif 4
