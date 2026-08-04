import Link from 'next/link';
import type { Agent } from '@/lib/agents';
import { getAgent, getAgentComparisons } from '@/lib/agents';
import { AgentAvatar } from '@/components/agent-avatar';
import { SectionLabel } from '@/components/page-shell';
import { FaqSection } from '@/components/faq-section';

export function AgentProfile({ agent }: { agent: Agent }) {
  const comparisons = getAgentComparisons(agent.slug);

  return (
    <>
      <div className="flex items-start gap-4">
        <AgentAvatar agent={agent} size={48} />
        <div>
          <p className="text-sm text-muted-foreground">{agent.company}</p>
          <a
            href={agent.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {agent.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </div>

      <blockquote className="mt-8 border-l-2 border-brand pl-4 text-lg text-foreground">
        {agent.quickAnswer}
      </blockquote>

      {agent.bodySections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{section.content}</p>
        </section>
      ))}

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <SectionLabel>Best for</SectionLabel>
          <ul className="mt-2 space-y-2">
            {agent.bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionLabel>Key features</SectionLabel>
          <ul className="mt-2 space-y-2">
            {agent.features.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <SectionLabel>Pros</SectionLabel>
          <ul className="mt-2 space-y-2">
            {agent.pros.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border p-5">
          <SectionLabel>Cons</SectionLabel>
          <ul className="mt-2 space-y-2">
            {agent.cons.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {comparisons.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Comparisons featuring {agent.name}</SectionLabel>
          <ul className="mt-3 space-y-2">
            {comparisons.map((c) => {
              const other =
                c.agentA === agent.slug ? getAgent(c.agentB) : getAgent(c.agentA);
              return (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="text-sm text-foreground underline-offset-4 hover:underline"
                  >
                    {agent.name} vs {other?.name ?? 'Unknown'}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {agent.faqs.length > 0 && (
        <div className="mt-14">
          <FaqSection faqs={agent.faqs} />
        </div>
      )}

      <div className="mt-12 border-t border-border/60 pt-10">
        <Link
          href="/remote/agent"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
        >
          Browse AI agent engineering jobs
        </Link>
      </div>
    </>
  );
}
