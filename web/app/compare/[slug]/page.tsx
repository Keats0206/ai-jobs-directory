import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { AgentProfile } from '@/components/agent-profile';
import { PairwiseComparison } from '@/components/pairwise-comparison';
import {
  getAllCompareSlugs,
  getAgent,
  getComparison,
  getAgentName,
  isPairwiseSlug,
} from '@/lib/agents';
import { GeoContent } from '@/components/geo-content';

const compareHub = { label: 'Compare', href: '/compare/ai-coding-agents' };

export function generateStaticParams() {
  return getAllCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isPairwiseSlug(slug)) {
    const comparison = getComparison(slug);
    if (!comparison) return { title: 'Not Found' };
    const nameA = getAgentName(comparison.agentA);
    const nameB = getAgentName(comparison.agentB);
    return {
      title: `${nameA} vs ${nameB} (2026): Which AI Agent Is Better?`,
      description: `Compare ${nameA} and ${nameB} — features, pricing, platforms, and who each agent is best for. Updated for 2026.`,
    };
  }

  const agent = getAgent(slug);
  if (!agent) return { title: 'Not Found' };
  return {
    title: `${agent.name} Review (2026) — Features, Pricing & Alternatives`,
    description: `${agent.tagline} Compare ${agent.name} to Cursor, Claude Code, Cline, and other top AI coding agents.`,
  };
}

export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (isPairwiseSlug(slug)) {
    const comparison = getComparison(slug);
    if (!comparison) notFound();
    const agentA = getAgent(comparison.agentA);
    const agentB = getAgent(comparison.agentB);
    if (!agentA || !agentB) notFound();

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${agentA.name} vs ${agentB.name}`,
      description: comparison.quickAnswer,
      url: `https://www.artificialjobs.dev/compare/${slug}`,
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
          name: 'Compare',
          item: 'https://www.artificialjobs.dev/compare/ai-coding-agents',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${agentA.name} vs ${agentB.name}`,
          item: `https://www.artificialjobs.dev/compare/${slug}`,
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
            <Breadcrumb
              segments={[compareHub]}
              current={`${agentA.name} vs ${agentB.name}`}
            />
            <PageHeading
              title={`${agentA.name} vs ${agentB.name}`}
              lead="Head-to-head comparison for 2026"
            />
            <PairwiseComparison comparison={comparison} agentA={agentA} agentB={agentB} />
            <GeoContent url={`/compare/${slug}`} />
          </Container>
        </main>
        <SiteFooter />
      </>
    );
  }

  const agent = getAgent(slug);
  if (!agent) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.tagline,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: agent.platforms.join(', '),
    offers: {
      '@type': 'Offer',
      price: agent.pricing.includes('Free') ? '0' : undefined,
      priceCurrency: 'USD',
    },
    url: agent.website,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb segments={[compareHub]} current={agent.name} />
          <PageHeading title={agent.name} lead={agent.tagline} />
          <AgentProfile agent={agent} />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
