import type { Agent } from '@/lib/agents';
import { AgentAvatar } from '@/components/agent-avatar';

const HUB_CRITERIA = [
  { key: 'platforms' as const, label: 'Platforms' },
  { key: 'pricing' as const, label: 'Pricing' },
  { key: 'openSource' as const, label: 'Open source' },
  { key: 'tokenUsage' as const, label: 'Token usage' },
];

function cellValue(agent: Agent, key: (typeof HUB_CRITERIA)[number]['key']): string {
  switch (key) {
    case 'platforms':
      return agent.platforms.join(', ');
    case 'pricing':
      return agent.pricing;
    case 'openSource':
      return agent.openSource ? 'Yes' : 'No';
    case 'tokenUsage':
      return agent.tokenUsage ?? '—';
  }
}

export function HubComparisonTable({ agents }: { agents: Agent[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Agent</th>
            {HUB_CRITERIA.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.slug} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <AgentAvatar agent={agent} size={24} />
                  <span className="font-medium">{agent.name}</span>
                </div>
              </td>
              {HUB_CRITERIA.map((c) => (
                <td key={c.key} className="px-4 py-3 text-muted-foreground">
                  {cellValue(agent, c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PairwiseComparisonTable({
  agentA,
  agentB,
  criteria,
}: {
  agentA: Agent;
  agentB: Agent;
  criteria: { label: string; agentA: string; agentB: string; winner: 'a' | 'b' | 'tie' }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Criteria</th>
            <th className="px-4 py-3 text-left font-medium">
              <div className="flex items-center gap-2">
                <AgentAvatar agent={agentA} size={20} />
                {agentA.name}
              </div>
            </th>
            <th className="px-4 py-3 text-left font-medium">
              <div className="flex items-center gap-2">
                <AgentAvatar agent={agentB} size={20} />
                {agentB.name}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((row) => (
            <tr key={row.label} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
              <td
                className={`px-4 py-3 ${row.winner === 'a' ? 'bg-muted/50 font-medium text-foreground' : 'text-muted-foreground'}`}
              >
                {row.agentA}
              </td>
              <td
                className={`px-4 py-3 ${row.winner === 'b' ? 'bg-muted/50 font-medium text-foreground' : 'text-muted-foreground'}`}
              >
                {row.agentB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
