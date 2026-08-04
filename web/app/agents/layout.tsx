import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top OpenClaw & Hermes Plugins + MCP Servers',
  description:
    'Curated directory of the top 50 OpenClaw plugins, 50 MCP servers, and 50 Hermes Agent plugins. Install commands, docs links, and rankings.',
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
