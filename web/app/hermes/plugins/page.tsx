import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading, SectionLabel } from '@/components/page-shell';
import { AgentEntryList } from '@/components/agent-entry-list';
import { hermesPlugins, directoryMeta } from '@/lib/agent-directory';

export const metadata: Metadata = {
  title: 'Top 50 Hermes Agent Plugins — Install & Setup',
  description:
    'Ranked Hermes Agent plugins for search, memory, gateway platforms, model providers, and observability. Install with hermes plugins enable.',
};

export default function HermesPluginsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 50 Hermes Agent Plugins',
    numberOfItems: hermesPlugins.length,
    itemListElement: hermesPlugins.slice(0, 20).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: `https://www.artificialjobs.dev/hermes/plugins/${entry.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <nav className="mb-6 flex gap-4 text-sm text-muted-foreground">
            <Link href="/agents" className="hover:text-foreground">Agents hub</Link>
            <span>/</span>
            <span className="text-foreground">Hermes Plugins</span>
          </nav>
          <PageHeading
            title="Top 50 Hermes Agent Plugins"
            lead="Bundled and community plugins for Nous Research Hermes Agent — search, memory, gateways, and more."
            meta={`Updated ${directoryMeta.updated}`}
          />
          <SectionLabel>Ranked list</SectionLabel>
          <AgentEntryList entries={hermesPlugins} />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
