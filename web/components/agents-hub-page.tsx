'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { Container, PageHeading, SectionLabel } from '@/components/page-shell';
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
        <Container className="pb-8 pt-14">
          <PageHeading
            title="Top OpenClaw plugins, MCP servers & Hermes plugins."
            lead="Curated directory of the best agent extensions across three ecosystems. Ranked by official status, docs coverage, and community adoption."
            meta={`150 entries · Last updated ${directoryMeta.updated}`}
          />

          <div className="mb-6 flex flex-wrap gap-3 text-sm">
            <Link href="/agentic" className="text-brand hover:underline">
              Agentic dev hub →
            </Link>
            <Link href="/compare/ai-coding-agents" className="text-brand hover:underline">
              AI coding agent rankings →
            </Link>
            <Link href="/openclaw/plugins" className="text-brand hover:underline">
              All OpenClaw plugins →
            </Link>
            <Link href="/openclaw/mcps" className="text-brand hover:underline">
              All MCP servers →
            </Link>
            <Link href="/hermes/plugins" className="text-brand hover:underline">
              All Hermes plugins →
            </Link>
          </div>

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
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
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
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
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
