'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Job } from '@/lib/jobs';
import { slugify } from '@/lib/job-utils';
import { displayCompany, displayTitle } from '@/lib/job-quality';
import { Input } from '@/components/ui/input';
import { SiteHeader } from '@/components/site-header';
import { Container, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipButton } from '@/components/chip';
import { NewsletterSignup } from '@/components/newsletter-signup';

const MAX_VISIBLE = 100;

type Stats = { total: number; companies: number; remotePct: number; publishedPay: number };

export function HomeBoard({ jobs, tags, locations, stats }: { jobs: Job[]; tags: { tag: string; count: number }[]; locations: { location: string; count: number }[]; stats: Stats }) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => tags.slice(0, 10), [tags]);
  const allLocations = useMemo(() => locations.slice(0, 6), [locations]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        displayTitle(job).toLowerCase().includes(query) ||
        displayCompany(job).toLowerCase().includes(query) ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query);
      const matchesTags =
        selectedTags.size === 0 || job.tags?.some((tag) => selectedTags.has(tag));
      return matchesSearch && matchesTags;
    });
  }, [jobs, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const visible = filteredJobs.slice(0, MAX_VISIBLE);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-atmosphere absolute inset-0" aria-hidden />
          <Container className="relative pb-10 pt-14 sm:pt-16">
            <h1 className="font-heading animate-fade-up text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              AI engineering jobs.
            </h1>
            <p className="animate-fade-up-delay-1 mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Verified roles at LLM labs, AI startups, and infra companies, pulled daily from employers&rsquo; own job boards.
            </p>

            <dl className="animate-fade-up-delay-2 mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                [stats.total.toLocaleString('en-US'), 'open roles'],
                [stats.companies.toLocaleString('en-US'), 'companies hiring'],
                [`${stats.remotePct}%`, 'remote-friendly'],
                [`${Math.round((stats.publishedPay / Math.max(stats.total, 1)) * 100)}%`, 'list salary'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums tracking-tight">{value}</dd>
                  <dd className="text-sm text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>

            <Input
              type="search"
              placeholder="Search roles or companies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-8 h-12 max-w-xl rounded-lg border-border/80 bg-background/90 px-4 text-base shadow-none"
              aria-label="Search roles or companies"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {allTags.map(({ tag, count }) => (
                <ChipButton key={tag} active={selectedTags.has(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                  <span className="font-mono text-[11px] tabular-nums opacity-50">{count}</span>
                </ChipButton>
              ))}
              <Link href="/browse" className="inline-flex items-center px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                All skills &rarr;
              </Link>
            </div>
          </Container>
        </section>

        <Container className="pb-12 pt-2">
          <SectionLabel>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'} · newest first
          </SectionLabel>
          <JobList jobs={visible} indexOf={(job) => jobs.indexOf(job)} />
          {filteredJobs.length > MAX_VISIBLE && (
            <p className="mt-6 text-sm text-muted-foreground">
              Showing the newest {MAX_VISIBLE}. Narrow it down with search, or{' '}
              <Link href="/browse" className="text-brand hover:underline">browse by skill and location</Link>.
            </p>
          )}
        </Container>

        <Container className="border-t border-border/60 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <BrowseGroup
              title="Data & guides"
              links={[
                { href: '/browse', label: 'Jobs by skill & location' },
                { href: '/stats', label: 'Public stats' },
                { href: '/sources', label: 'How we verify jobs' },
                { href: '/newsletter', label: 'Weekly AI jobs digest' },
                { href: '/use-cases/ai-engineer-career', label: 'AI engineer career path' },
                { href: '/use-cases/agentic-engineer-jobs', label: 'Agentic engineer jobs' },
                { href: '/use-cases/rag-engineer-jobs', label: 'RAG engineer jobs' },
                { href: '/use-cases/prompt-engineer-jobs', label: 'Prompt engineer jobs' },
              ]}
            />
            <BrowseGroup
              title="By skill"
              links={allTags.map(({ tag }) => ({
                href: `/remote/${slugify(tag)}`,
                label: `Remote ${tag} jobs`,
              }))}
            />
            <BrowseGroup
              title="By location"
              links={allLocations.map(({ location }) => ({
                href: `/location/${slugify(location)}`,
                label: `AI jobs in ${location}`,
              }))}
            />
            <BrowseGroup
              title="Salary guides"
              links={allTags.slice(0, 8).map(({ tag }) => ({
                href: `/salary/${slugify(tag)}`,
                label: `${tag} engineer salary`,
              }))}
            />
          </div>
        </Container>

        <Container className="border-t border-border/60 py-12">
          <NewsletterSignup className="max-w-md" />
        </Container>
      </main>
    </>
  );
}

function BrowseGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <ul className="space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
