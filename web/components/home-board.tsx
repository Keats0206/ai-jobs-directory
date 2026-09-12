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
        <Container className="pb-8 pt-14">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI engineering jobs.
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {jobs.length} open roles at LLM labs, AI startups, and infra companies. Updated daily.
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
