import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading } from '@/components/page-shell';
import { McpDirectorySearch } from '@/components/mcp-directory-search';
import { openclawMcps, directoryMeta } from '@/lib/agent-directory';

function mcpCategories() {
  const counts: Record<string, number> = {};
  openclawMcps.forEach((e) => {
    counts[e.category] = (counts[e.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export const metadata: Metadata = {
  alternates: { canonical: "https://www.artificialjobs.dev/openclaw/mcps" },
  title: 'Top 50 MCP Servers for OpenClaw — Install & Setup',
  description:
    'Best Model Context Protocol servers for OpenClaw agents. Filesystem, GitHub, databases, search, and automation with openclaw mcp add commands.',
};

export default function OpenClawMcpsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 50 MCP Servers for OpenClaw',
    numberOfItems: openclawMcps.length,
    itemListElement: openclawMcps.slice(0, 20).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: `https://www.artificialjobs.dev/openclaw/mcps/${entry.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <nav className="mb-6 flex gap-4 text-sm text-muted-foreground">
            <Link href="/agentic" className="hover:text-foreground">
              Agentic hub
            </Link>
            <span>/</span>
            <Link href="/agents" className="hover:text-foreground">
              Agents
            </Link>
            <span>/</span>
            <span className="text-foreground">MCP Servers</span>
          </nav>
          <PageHeading
            title="Top 50 MCP Servers"
            lead="Model Context Protocol servers you can connect to OpenClaw via openclaw mcp add."
            meta={`Updated ${directoryMeta.updated}`}
          />
          <McpDirectorySearch entries={openclawMcps} categories={mcpCategories()} />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
