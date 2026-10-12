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

export function HomeBoard({ jobs, tags, locations }: { jobs: Job[]; tags: { tag: string; count: number }[]; locations: { location: string; count: number }[] }) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => tags.slice(0, 15), [tags]);
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
        <Container className="pb-8 pt-14">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI engineering jobs.
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {jobs.length} open roles at LLM labs, AI startups, and infra companies. Browse by skill, employer, or location.
          </p>

          <Input
            type="search"
            placeholder="Search roles or companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-8 h-11 rounded-xl px-4 text-base"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map(({ tag, count }) => (
              <ChipButton key={tag} active={selectedTags.has(tag)} onClick={() => toggleTag(tag)}>
                {tag}
                <span className="tabular-nums opacity-50">{count}</span>
              </ChipButton>
            ))}
          </div>
        </Container>

        <Container className="pb-12">
          <SectionLabel>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'}
            {filteredJobs.length > MAX_VISIBLE ? ` · showing first ${MAX_VISIBLE}` : ''}
          </SectionLabel>
          <JobList jobs={visible} indexOf={(job) => jobs.indexOf(job)} />
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
