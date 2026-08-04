'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/chip';
import {
  type AgentEntry,
  categorySlug,
  detailPath,
  ecosystemLabel,
} from '@/lib/agent-directory';

function CopyInstall({ install }: { install: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(install);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Install
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <code className="block overflow-x-auto font-mono text-sm leading-relaxed">{install}</code>
    </div>
  );
}

function EcosystemBadge({ ecosystem }: { ecosystem: AgentEntry['ecosystem'] }) {
  return (
    <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
      {ecosystemLabel(ecosystem)}
    </Badge>
  );
}

export function AgentEntryRow({ entry, showRank = true }: { entry: AgentEntry; showRank?: boolean }) {
  return (
    <Link
      href={detailPath(entry)}
      className="group flex items-start gap-4 border-b border-border/60 py-4 transition-colors last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg"
    >
      {showRank && (
        <span className="mt-0.5 w-8 shrink-0 tabular-nums text-sm font-medium text-muted-foreground">
          #{entry.rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium group-hover:text-brand">{entry.name}</span>
          <EcosystemBadge ecosystem={entry.ecosystem} />
          {entry.official && (
            <Badge variant="secondary" className="text-[10px]">
              Official
            </Badge>
          )}
          {entry.bundled && (
            <Badge variant="secondary" className="text-[10px]">
              Bundled
            </Badge>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip variant="brand" className="text-[10px]">
            {entry.category}
          </Chip>
          {entry.autoLoaded !== undefined && (
            <span className="text-[10px] text-muted-foreground">
              {entry.autoLoaded ? 'Auto-loaded' : 'Opt-in'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AgentEntryList({
  entries,
  showRank = true,
}: {
  entries: AgentEntry[];
  showRank?: boolean;
}) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No entries match your search.</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <AgentEntryRow key={`${entry.ecosystem}-${entry.id}`} entry={entry} showRank={showRank} />
      ))}
    </div>
  );
}

export function AgentEntryDetail({ entry }: { entry: AgentEntry }) {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-2">
        <span className="tabular-nums text-sm text-muted-foreground">#{entry.rank}</span>
        <EcosystemBadge ecosystem={entry.ecosystem} />
        {entry.official && <Badge variant="secondary">Official</Badge>}
        {entry.bundled && <Badge variant="secondary">Bundled</Badge>}
        {entry.pluginType && (
          <Badge variant="outline" className="capitalize">
            {entry.pluginType}
          </Badge>
        )}
        {entry.transport && (
          <Badge variant="outline">{entry.transport}</Badge>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{entry.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{entry.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip variant="brand">{entry.category}</Chip>
        {entry.tags.slice(0, 4).map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </div>

      <CopyInstall install={entry.install} />

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {entry.docsUrl && (
          <a
            href={entry.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            Documentation
          </a>
        )}
        {entry.repoUrl && (
          <a
            href={entry.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            Repository
          </a>
        )}
        <Link
          href={`/agents/${categorySlug(entry.category)}`}
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          More {entry.category} tools
        </Link>
      </div>
    </article>
  );
}
