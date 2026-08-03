-- AI Jobs Directory Supabase Schema

-- 1. Companies
create table if not exists public.companies (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    website text,
    logo_url text,
    description text,
    verified boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    slug text unique not null
);

-- Insert default categories
insert into public.categories (name, slug) values
    ('LLM & GenAI', 'llm-genai'),
    ('AI Infrastructure', 'ai-infrastructure'),
    ('Machine Learning & ML Engineering', 'machine-learning'),
    ('AI Product & Design', 'ai-product'),
    ('Robotics & Computer Vision', 'robotics-vision'),
    ('AI Research', 'ai-research')
on conflict (slug) do nothing;

-- 3. Jobs
create table if not exists public.jobs (
    id uuid primary key default gen_random_uuid(),
    company_id uuid references public.companies(id) on delete cascade,
    category_id uuid references public.categories(id),
    title text not null,
    slug text not null,
    location text default 'Remote',
    is_remote boolean default true,
    job_type text default 'Full-time', -- Full-time, Contract, Part-time
    salary_min integer,
    salary_max integer,
    currency text default 'USD',
    tags text[] default '{}',
    description text not null,
    apply_url text not null,
    source text default 'curated', -- ashby, greenhouse, lever, employer_submission
    is_featured boolean default false,
    featured_until timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'active' -- active, filled, expired
);

-- Index for fast querying & LLM exports
create index if not exists jobs_featured_created_idx on public.jobs (is_featured desc, created_at desc);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_slug_idx on public.jobs (slug);

-- 4. Featured Orders (Stripe Payments)
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    stripe_session_id text unique,
    employer_email text not null,
    job_id uuid references public.jobs(id),
    amount_cents integer not null,
    status text default 'pending', -- pending, paid, failed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Public Read)
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.jobs enable row level security;

create policy "Allow public read companies" on public.companies for select using (true);
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read jobs" on public.jobs for select using (true);
