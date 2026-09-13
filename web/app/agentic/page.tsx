import Link from 'next/link';
import { Metadata } from 'next';
import { Container, PageHeading, SectionLabel } from '@/components/page-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AgentCard } from '@/components/agent-card';
import { HubComparisonTable } from '@/components/comparison-table';
import { ChipLink } from '@/components/chip';
import { getAllAgents, comparisons, getAgentName } from '@/lib/agents';
import { openclawMcps, openclawPlugins, hermesPlugins, getAllCategories, categorySlug } from '@/lib/agent-directory';
import { jobs } from '@/lib/jobs';

export const metadata: Metadata = {
  alternates: { canonical: "https://www.artificialjobs.dev/agentic" },
  title: 'Agentic Dev Hub — Coding Agents, MCPs & Tools',
  description:
    'The directory for agentic developers: ranked AI coding agents, head-to-head comparisons, MCP servers, OpenClaw plugins, and AI engineering jobs.',
};

export default function AgenticHubPage() {
  const agents = getAllAgents().slice(0, 6);
  const categories = getAllCategories().slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Agentic Dev Hub',
    description: 'Rankings, comparisons, MCP directory, and jobs for agentic developers.',
    url: 'https://www.artificialjobs.dev/agentic',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <PageHeading
            title="Agentic dev hub"
            lead="Rankings, comparisons, MCP servers, and plugins for developers building with AI agents — plus AI engineering jobs."
            meta="Updated 2026 · For agentic developers"
          />

          <section>
            <SectionLabel>Rankings — AI coding agents</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Ranked by public token usage where available.{' '}
              <Link href="/compare/ai-coding-agents" className="text-brand hover:underline">
                View all {getAllAgents().length} agents →
              </Link>
            </p>
            <div className="mt-4">
              <HubComparisonTable agents={agents} />
            </div>
            <div className="mt-4 grid gap-3">
              {agents.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionLabel>Head-to-head comparisons</SectionLabel>
            <ul className="mt-4 space-y-2">
              {comparisons.slice(0, 12).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    {getAgentName(c.agentA)} vs {getAgentName(c.agentB)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/compare/ai-coding-agents" className="mt-4 inline-block text-sm text-brand hover:underline">
              All comparisons →
            </Link>
          </section>

          <section className="mt-14">
            <SectionLabel>Ecosystem — MCPs &amp; plugins</SectionLabel>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <EcosystemCard
                title="MCP servers"
                count={openclawMcps.length}
                href="/openclaw/mcps"
                description="Model Context Protocol servers for OpenClaw agents."
              />
              <EcosystemCard
                title="OpenClaw plugins"
                count={openclawPlugins.length}
                href="/openclaw/plugins"
                description="Native extensions for messaging, channels, and tools."
              />
              <EcosystemCard
                title="Hermes plugins"
                count={hermesPlugins.length}
                href="/hermes/plugins"
                description="Plugins for the Hermes Agent ecosystem."
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map(({ category, count }) => (
                <ChipLink key={category} href={`/agents/${categorySlug(category)}`}>
                  {category}
                  <span className="tabular-nums opacity-50">{count}</span>
                </ChipLink>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/agents" className="text-brand hover:underline">
                Full agent directory →
              </Link>
              <Link href="/cursor-rules" className="text-brand hover:underline">
                Cursor rules library →
              </Link>
              <Link href="/post-mcp" className="text-brand hover:underline">
                List your MCP — $199/mo →
              </Link>
            </div>
          </section>

          <section className="mt-14 border-t border-border/60 pt-10">
            <SectionLabel>AI engineering jobs</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              {jobs.length} open roles at LLM labs, AI startups, and infra companies.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Browse all jobs
              </Link>
              <Link
                href="/use-cases/agentic-engineer-jobs"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-foreground/20"
              >
                Agentic engineer jobs guide
              </Link>
            </div>
          </section>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}

function EcosystemCard({
  title,
  count,
  href,
  description,
}: {
  title: string;
  count: number;
  href: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-border/60 p-5 transition-colors hover:border-foreground/20"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
