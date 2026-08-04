'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { SectionLabel } from '@/components/page-shell';
import { ChipButton } from '@/components/chip';
import { cursorRules, getCursorRuleCategories } from '@/lib/cursor-rules';

export function CursorRulesSearch() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const categories = useMemo(() => getCursorRuleCategories(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cursorRules.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = !category || r.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [search, category]);

  return (
    <>
      <Input
        type="search"
        placeholder="Search rules by name, category, or tag…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6"
        aria-label="Search cursor rules"
      />

      <section className="mt-6">
        <SectionLabel>Categories</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          <ChipButton active={category === null} onClick={() => setCategory(null)}>
            All
          </ChipButton>
          {categories.map(({ category: cat, count }) => (
            <ChipButton
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat === category ? null : cat)}
            >
              {cat}
              <span className="tabular-nums opacity-50">{count}</span>
            </ChipButton>
          ))}
        </div>
      </section>

      <ul className="mt-8 divide-y divide-border/60">
        {filtered.map((rule) => (
          <li key={rule.id} className="py-4">
            <Link href={`/cursor-rules/${rule.id}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium group-hover:text-brand">
                  #{rule.rank} {rule.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{rule.category}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
