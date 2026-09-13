import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { AgentEntryList } from '@/components/agent-entry-list';
import { openclawPlugins, directoryMeta } from '@/lib/agent-directory';

export const metadata: Metadata = {
  alternates: { canonical: "https://www.artificialjobs.dev/openclaw/plugins" },
  title: 'Top 50 OpenClaw Plugins — Install & Setup',
  description:
    'Ranked list of the best OpenClaw plugins for channels, model providers, search, voice, and tools. Install commands included.',
};

export default function OpenClawPluginsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 50 OpenClaw Plugins',
    numberOfItems: openclawPlugins.length,
    itemListElement: openclawPlugins.slice(0, 20).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: `https://www.artificialjobs.dev/openclaw/plugins/${entry.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current="OpenClaw Plugins" />
          <nav className="mb-6 flex gap-4 text-sm text-muted-foreground">
            <Link href="/agents" className="hover:text-foreground">Agents hub</Link>
            <span>/</span>
            <span className="text-foreground">Plugins</span>
          </nav>
          <PageHeading
            title="Top 50 OpenClaw Plugins"
            lead="Native OpenClaw extensions for messaging channels, LLM providers, search, voice, and automation."
            meta={`Updated ${directoryMeta.updated}`}
          />
          <SectionLabel>Ranked list</SectionLabel>
          <AgentEntryList entries={openclawPlugins} />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
