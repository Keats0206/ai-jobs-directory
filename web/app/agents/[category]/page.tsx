import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading, SectionLabel } from '@/components/page-shell';
import { AgentEntryList } from '@/components/agent-entry-list';
import { ChipLink } from '@/components/chip';
import {
  getAllCategories,
  getEntriesByCategory,
  categorySlug,
  ecosystemLabel,
} from '@/lib/agent-directory';

export function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({ category: categorySlug(category) }));
}

function findCategory(categoryParam: string): string | null {
  const match = getAllCategories().find(({ category }) => categorySlug(category) === categoryParam);
  return match ? match.category : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const category = findCategory(categoryParam);
  if (!category) return { title: 'Not Found' };
  const count = getEntriesByCategory(categoryParam).length;
  return {
    title: `${count} ${category} Agent Tools — OpenClaw, MCP & Hermes`,
    description: `Browse ${count} ${category.toLowerCase()} tools across OpenClaw plugins, MCP servers, and Hermes Agent plugins.`,
  };
}

export default async function AgentCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryParam } = await params;
  const category = findCategory(categoryParam);
  if (!category) notFound();

  const entries = getEntriesByCategory(categoryParam);
  const otherCategories = getAllCategories().filter((c) => c.category !== category).slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category} Agent Tools`,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 30).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${entry.name} (${ecosystemLabel(entry.ecosystem)})`,
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.artificialjobs.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Agents',
        item: 'https://www.artificialjobs.dev/agents',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `https://www.artificialjobs.dev/agents/${categoryParam}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <nav className="mb-6 flex gap-2 text-sm text-muted-foreground">
            <Link href="/agents" className="hover:text-foreground">Agents</Link>
            <span>/</span>
            <span className="text-foreground">{category}</span>
          </nav>

          <PageHeading
            title={`${category} Agent Tools`}
            lead={`${entries.length} tools across OpenClaw, MCP, and Hermes ecosystems.`}
          />

          <SectionLabel>All entries</SectionLabel>
          <AgentEntryList entries={entries} showRank={false} />

          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Other categories</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {otherCategories.map(({ category: c, count }) => (
                <ChipLink key={c} href={`/agents/${categorySlug(c)}`}>
                  {c}
                  <span className="tabular-nums opacity-50">{count}</span>
                </ChipLink>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
