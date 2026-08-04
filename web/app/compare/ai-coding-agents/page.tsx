import Link from 'next/link';
import { Metadata } from 'next';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AgentCard } from '@/components/agent-card';
import { HubComparisonTable } from '@/components/comparison-table';
import { getAllAgents, comparisons, getAgentName } from '@/lib/agents';
import { GeoContent } from '@/components/geo-content';

export const metadata: Metadata = {
  title: 'Best AI Coding Agents (2026) — Compare Top 15 Agents',
  description:
    'Compare Hermes Agent, Kilo Code, Cline, Claude Code, Cursor, Windsurf, and more. Features, pricing, token usage, and head-to-head matchups.',
};

export default function CompareHubPage() {
  const agents = getAllAgents();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top AI Coding Agents 2026',
    numberOfItems: agents.length,
    itemListElement: agents.map((agent, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: agent.name,
      url: `https://www.artificialjobs.dev/compare/${agent.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb
            segments={[{ label: 'Compare', href: '/compare/ai-coding-agents' }]}
            current="AI coding agents"
          />
          <PageHeading
            title="Best AI Coding Agents (2026)"
            lead="Compare the top AI coding agents by community usage — from IDE assistants to CLI and messaging agents."
            meta="Ranked by public token usage where available · Updated 2026"
          />

          <section>
            <SectionLabel>Quick comparison</SectionLabel>
            <div className="mt-4">
              <HubComparisonTable agents={agents} />
            </div>
          </section>

          <section className="mt-14">
            <SectionLabel>All agents</SectionLabel>
            <div className="mt-4 grid gap-3">
              {agents.map((agent) => (
                <AgentCard key={agent.slug} agent={agent} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionLabel>Agent ecosystem</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Extend your agent stack with plugins and MCP servers.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/agents" className="underline-offset-4 hover:underline">
                  OpenClaw, MCP &amp; Hermes plugin directory
                </Link>
              </li>
              <li>
                <Link href="/openclaw/mcps" className="underline-offset-4 hover:underline">
                  Top 50 MCP servers for OpenClaw
                </Link>
              </li>
              <li>
                <Link href="/cursor-rules" className="underline-offset-4 hover:underline">
                  Cursor rules library
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-14">
            <SectionLabel>Popular head-to-head comparisons</SectionLabel>
            <ul className="mt-4 space-y-2">
              {comparisons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="text-sm text-foreground underline-offset-4 hover:underline"
                  >
                    {getAgentName(c.agentA)} vs {getAgentName(c.agentB)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 border-t border-border/60 pt-10">
            <Link
              href="/remote/agent"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Browse AI agent engineering jobs
            </Link>
          </div>

          <GeoContent url="/compare/ai-coding-agents" />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
