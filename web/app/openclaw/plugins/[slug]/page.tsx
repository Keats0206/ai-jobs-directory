import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { AgentEntryDetail, AgentEntryList } from '@/components/agent-entry-list';
import {
  openclawPlugins,
  getEntryBySlug,
  getRelatedEntries,
  ecosystemLabel,
} from '@/lib/agent-directory';

export function generateStaticParams() {
  return openclawPlugins.map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug('openclaw', slug);
  if (!entry) return { title: 'Not Found' };
  return {
    alternates: { canonical: `https://www.artificialjobs.dev/openclaw/plugins/${slug}` },
    title: `${entry.name} OpenClaw Plugin — Install & Setup`,
    description: `${entry.description} Install: ${entry.install}`,
  };
}

export default async function OpenClawPluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug('openclaw', slug);
  if (!entry) notFound();

  const related = getRelatedEntries(entry);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: entry.name,
    description: entry.description,
    applicationCategory: 'OpenClaw Plugin',
    url: `https://www.artificialjobs.dev/openclaw/plugins/${entry.id}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <nav className="mb-6 flex gap-2 text-sm text-muted-foreground">
            <Link href="/agents" className="hover:text-foreground">Agents</Link>
            <span>/</span>
            <Link href="/openclaw/plugins" className="hover:text-foreground">OpenClaw Plugins</Link>
            <span>/</span>
            <span className="text-foreground">{entry.name}</span>
          </nav>

          <AgentEntryDetail entry={entry} />

          {related.length > 0 && (
            <section className="mt-16 border-t border-border/60 pt-10">
              <SectionLabel>Related {ecosystemLabel('openclaw')} plugins</SectionLabel>
              <AgentEntryList entries={related} showRank={false} />
            </section>
          )}
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
