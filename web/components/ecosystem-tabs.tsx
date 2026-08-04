'use client';

import { cn } from '@/lib/utils';
import type { Ecosystem } from '@/lib/agent-directory';

const tabs: { id: Ecosystem; label: string }[] = [
  { id: 'openclaw', label: 'OpenClaw Plugins' },
  { id: 'mcp', label: 'MCP Servers' },
  { id: 'hermes', label: 'Hermes Plugins' },
];

export function EcosystemTabs({
  active,
  onChange,
}: {
  active: Ecosystem;
  onChange: (ecosystem: Ecosystem) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ecosystem filter">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            active === tab.id
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
