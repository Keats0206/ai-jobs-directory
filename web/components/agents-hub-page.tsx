'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Container, PageHeading, PageIntroBand, SectionLabel } from '@/components/page-shell';
import { EcosystemTabs } from '@/components/ecosystem-tabs';
import { AgentEntryList } from '@/components/agent-entry-list';
import { ChipLink } from '@/components/chip';
import { Input } from '@/components/ui/input';
import {
  type Ecosystem,
  type AgentEntry,
  openclawPlugins,
  openclawMcps,
  hermesPlugins,
  getAllCategories,
  categorySlug,
  directoryMeta,
  listPath,
} from '@/lib/agent-directory';

function filterEntries(entries: AgentEntry[], query: string, category: string | null) {
  const q = query.trim().toLowerCase();
  return entries.filter((e) => {
    const matchesQuery =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = !category || e.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function AgentsHubPage() {
  const [ecosystem, setEcosystem] = useState<Ecosystem>('openclaw');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const entries = useMemo(() => {
    const source =
      ecosystem === 'openclaw'
        ? openclawPlugins
        : ecosystem === 'mcp'
          ? openclawMcps
          : hermesPlugins;
    return filterEntries(source, search, selectedCategory);
  }, [ecosystem, search, selectedCategory]);

  const categories = useMemo(() => getAllCategories().slice(0, 12), []);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <PageIntroBand>
          <Container className="pb-8 pt-14">
            <PageHeading
              title="Agent plugins & MCP servers"
              lead="Curated OpenClaw, MCP, and Hermes extensions — ranked by docs coverage and community adoption."
              meta={`150 entries · Last updated ${directoryMeta.updated}`}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <Link href="/agentic" className="transition-colors hover:text-brand">
                Agentic hub
              </Link>
              <Link href="/compare/ai-coding-agents" className="transition-colors hover:text-brand">
                Agent rankings
              </Link>
              <Link href="/openclaw/mcps" className="transition-colors hover:text-brand">
                MCP directory
              </Link>
            </div>
          </Container>
        </PageIntroBand>

        <Container className="pb-8">
          <EcosystemTabs
            active={ecosystem}
            onChange={(e) => {
              setEcosystem(e);
              setSelectedCategory(null);
            }}
          />

          <Input
            type="search"
            placeholder={`Search ${ecosystem === 'openclaw' ? 'OpenClaw plugins' : ecosystem === 'mcp' ? 'MCP servers' : 'Hermes plugins'}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-6"
            aria-label="Search agent directory"
          />

          <section className="mt-6">
            <SectionLabel>Categories</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                  selectedCategory === null
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/30'
                }`}
              >
                All
              </button>
              {categories.map(({ category, count }) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    selectedCategory === category
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  }`}
                >
                  {category}
                  <span className="ml-1 tabular-nums opacity-50">{count}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel>
                Top 50 {ecosystem === 'openclaw' ? 'OpenClaw Plugins' : ecosystem === 'mcp' ? 'MCP Servers' : 'Hermes Plugins'}
              </SectionLabel>
              <Link
                href={listPath(ecosystem)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View full list →
              </Link>
            </div>
            <AgentEntryList entries={entries} />
          </section>

          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Browse by category</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {categories.map(({ category, count }) => (
                <ChipLink key={category} href={`/agents/${categorySlug(category)}`}>
                  {category}
                  <span className="tabular-nums opacity-50">{count}</span>
                </ChipLink>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
