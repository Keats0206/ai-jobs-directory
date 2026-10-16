'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { jobs, slugify, getAllTags, getAllLocations } from '@/lib/jobs';
import { displayCompany, displayTitle } from '@/lib/job-quality';
import { Input } from '@/components/ui/input';
import { SiteHeader } from '@/components/site-header';
import { Container, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipButton } from '@/components/chip';
import { PostJobDialog } from '@/components/post-job-dialog';
import { NewsletterSignup } from '@/components/newsletter-signup';

const MAX_VISIBLE = 100;

export function HomeBoard() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => getAllTags().slice(0, 15), []);
  const allLocations = useMemo(() => getAllLocations().slice(0, 6), []);

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
  }, [search, selectedTags]);

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
      <SiteHeader action={<PostJobDialog />} />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-atmosphere absolute inset-0" aria-hidden />
          <Container className="relative pb-10 pt-14 sm:pt-16">
            <h1 className="font-heading animate-fade-up text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Artificial Jobs
            </h1>
            <p className="animate-fade-up-delay-1 mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
              {jobs.length.toLocaleString()} open AI engineering roles at LLM labs, startups, and
              infra companies. Updated daily.
            </p>

            <div className="animate-fade-up-delay-2 mt-8 max-w-xl">
              <Input
                type="search"
                placeholder="Search roles or companies…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-lg border-border/80 bg-background/90 px-4 text-base shadow-none"
                aria-label="Search roles or companies"
              />
            </div>

            <div className="animate-fade-up-delay-2 mt-5 flex flex-wrap gap-2">
              {allTags.map(({ tag, count }) => (
                <ChipButton key={tag} active={selectedTags.has(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                  <span className="font-mono text-[11px] tabular-nums opacity-50">{count}</span>
                </ChipButton>
              ))}
            </div>
          </Container>
        </section>

        <Container className="pb-12 pt-2">
          <SectionLabel>
            {filteredJobs.length.toLocaleString()}{' '}
            {filteredJobs.length === 1 ? 'role' : 'roles'}
            {filteredJobs.length > MAX_VISIBLE ? ` · showing first ${MAX_VISIBLE}` : ''}
          </SectionLabel>
          <JobList jobs={visible} indexOf={(job) => jobs.indexOf(job)} />
        </Container>

        <Container className="border-t border-border/60 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <BrowseGroup
              title="Agentic dev"
              links={[
                { href: '/agentic', label: 'Agentic dev hub' },
                { href: '/compare/ai-coding-agents', label: 'Best AI coding agents (2026)' },
                { href: '/openclaw/mcps', label: 'MCP server directory' },
                { href: '/agents', label: 'OpenClaw & Hermes plugins' },
                { href: '/cursor-rules', label: 'Cursor rules library' },
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
