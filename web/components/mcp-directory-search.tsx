'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { SectionLabel } from '@/components/page-shell';
import { AgentEntryList } from '@/components/agent-entry-list';
import { ChipButton } from '@/components/chip';
import type { AgentEntry } from '@/lib/agent-directory';

function filterMcps(entries: AgentEntry[], query: string, category: string | null) {
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

export function McpDirectorySearch({
  entries,
  categories,
}: {
  entries: AgentEntry[];
  categories: { category: string; count: number }[];
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterMcps(entries, search, selectedCategory),
    [entries, search, selectedCategory],
  );

  return (
    <>
      <Input
        type="search"
        placeholder="Search MCP servers by name, category, or tag…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6"
        aria-label="Search MCP servers"
      />

      <section className="mt-6">
        <SectionLabel>Categories</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          <ChipButton active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
            All
            <span className="tabular-nums opacity-50">{entries.length}</span>
          </ChipButton>
          {categories.map(({ category, count }) => (
            <ChipButton
              key={category}
              active={selectedCategory === category}
              onClick={() =>
                setSelectedCategory(category === selectedCategory ? null : category)
              }
            >
              {category}
              <span className="tabular-nums opacity-50">{count}</span>
            </ChipButton>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <SectionLabel>
          {filtered.length} {filtered.length === 1 ? 'server' : 'servers'}
        </SectionLabel>
      </div>
      <AgentEntryList entries={filtered} />

      <p className="mt-8 text-sm text-muted-foreground">
        Building an MCP?{' '}
        <Link href="/post-mcp" className="text-foreground underline-offset-4 hover:underline">
          List your server — $199/mo
        </Link>
      </p>
    </>
  );
}
