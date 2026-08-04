'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Agent } from '@/lib/agents';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AgentAvatar({
  agent,
  size = 32,
}: {
  agent: Pick<Agent, 'name' | 'faviconUrl'>;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !agent.faviconUrl) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {initials(agent.name)}
      </div>
    );
  }

  return (
    <Image
      src={agent.faviconUrl}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-lg"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
