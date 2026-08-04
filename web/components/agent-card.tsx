import Link from 'next/link';
import type { Agent } from '@/lib/agents';
import { formatTokenUsage } from '@/lib/agents';
import { AgentAvatar } from '@/components/agent-avatar';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/compare/${agent.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-border p-4 transition-colors hover:border-foreground/20 hover:bg-muted/30"
    >
      <AgentAvatar agent={agent} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium text-foreground group-hover:underline">
            {agent.rank}. {agent.name}
          </h3>
          {agent.tokenUsage && (
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatTokenUsage(agent.tokenUsage)} tokens
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{agent.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {agent.platforms.slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {p}
            </span>
          ))}
          {agent.openSource && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Open source
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
