-- Durable revenue, fulfillment, and funnel records. The service role is used
-- only by server-side webhooks and route handlers; public clients get no write access.
create table if not exists public.paid_listings (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  listing_type text not null check (listing_type in ('post', 'featured', 'post-mcp')),
  email text not null,
  company text not null,
  job_title text,
  mcp_name text,
  mcp_url text,
  description text,
  amount_cents integer not null default 0,
  status text not null default 'paid' check (status in ('paid', 'review', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists paid_listings_status_created_idx on public.paid_listings (status, created_at desc);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_idx on public.analytics_events (event_name, created_at desc);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

alter table public.paid_listings enable row level security;
alter table public.analytics_events enable row level security;
alter table public.newsletter_subscribers enable row level security;
