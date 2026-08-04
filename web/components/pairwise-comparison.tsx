import Link from 'next/link';
import type { Agent, Comparison } from '@/lib/agents';
import { AgentAvatar } from '@/components/agent-avatar';
import { PairwiseComparisonTable } from '@/components/comparison-table';
import { SectionLabel } from '@/components/page-shell';
import { FaqSection } from '@/components/faq-section';

export function PairwiseComparison({
  comparison,
  agentA,
  agentB,
}: {
  comparison: Comparison;
  agentA: Agent;
  agentB: Agent;
}) {
  return (
    <>
      <div className="flex items-center justify-center gap-4 py-2">
        <Link href={`/compare/${agentA.slug}`} className="flex items-center gap-2 hover:underline">
          <AgentAvatar agent={agentA} size={36} />
          <span className="font-medium">{agentA.name}</span>
        </Link>
        <span className="text-muted-foreground">vs</span>
        <Link href={`/compare/${agentB.slug}`} className="flex items-center gap-2 hover:underline">
          <AgentAvatar agent={agentB} size={36} />
          <span className="font-medium">{agentB.name}</span>
        </Link>
      </div>

      <blockquote className="mt-8 border-l-2 border-brand pl-4 text-lg text-foreground">
        {comparison.quickAnswer}
      </blockquote>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Verdict</p>
        <p className="mt-2 text-foreground">{comparison.verdict}</p>
      </div>

      <section className="mt-10">
        <SectionLabel>Head-to-head</SectionLabel>
        <div className="mt-4">
          <PairwiseComparisonTable
            agentA={agentA}
            agentB={agentB}
            criteria={comparison.criteria}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2">
            <AgentAvatar agent={agentA} size={24} />
            <h2 className="font-medium">Best for {agentA.name}</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {comparison.bestForA.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2">
            <AgentAvatar agent={agentB} size={24} />
            <h2 className="font-medium">Best for {agentB.name}</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {comparison.bestForB.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {comparison.faqs.length > 0 && (
        <div className="mt-14">
          <FaqSection faqs={comparison.faqs} />
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
