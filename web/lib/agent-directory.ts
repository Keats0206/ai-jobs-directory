import openclawPluginsData from '@/data/openclaw-plugins.json';
import openclawMcpsData from '@/data/openclaw-mcps.json';
import hermesPluginsData from '@/data/hermes-plugins.json';
import { slugify as baseSlugify } from '@/lib/jobs';

export type Ecosystem = 'openclaw' | 'mcp' | 'hermes';

export interface AgentEntry {
  rank: number;
  id: string;
  name: string;
  ecosystem: Ecosystem;
  category: string;
  description: string;
  install: string;
  docsUrl?: string | null;
  repoUrl?: string | null;
  official: boolean;
  bundled: boolean;
  transport?: 'stdio' | 'http' | 'sse';
  pluginType?: 'standalone' | 'backend' | 'platform' | 'model-provider' | 'exclusive';
  autoLoaded?: boolean;
  tags: string[];
  popularity?: {
    stars?: number;
    rating?: number;
    installs?: number;
    source?: string;
  };
}

interface AgentDataFile {
  meta: { updated: string; methodology: string };
  entries: AgentEntry[];
}

export const directoryMeta = {
  updated: openclawPluginsData.meta.updated,
  methodology: openclawPluginsData.meta.methodology,
};

export const openclawPlugins: AgentEntry[] = (openclawPluginsData as AgentDataFile).entries;
export const openclawMcps: AgentEntry[] = (openclawMcpsData as AgentDataFile).entries;
export const hermesPlugins: AgentEntry[] = (hermesPluginsData as AgentDataFile).entries;

export const allEntries: AgentEntry[] = [...openclawPlugins, ...openclawMcps, ...hermesPlugins];

export function slugify(text: string): string {
  return baseSlugify(text);
}

export function categorySlug(category: string): string {
  return slugify(category);
}

export function getEntriesByEcosystem(ecosystem: Ecosystem): AgentEntry[] {
  switch (ecosystem) {
    case 'openclaw':
      return openclawPlugins;
    case 'mcp':
      return openclawMcps;
    case 'hermes':
      return hermesPlugins;
  }
}

export function getEntryBySlug(ecosystem: Ecosystem, slug: string): AgentEntry | null {
  return getEntriesByEcosystem(ecosystem).find((e) => e.id === slug) ?? null;
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts: Record<string, number> = {};
  allEntries.forEach((e) => {
    counts[e.category] = (counts[e.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getEntriesByCategory(categorySlugParam: string): AgentEntry[] {
  return allEntries.filter((e) => categorySlug(e.category) === categorySlugParam);
}

export function getRelatedEntries(entry: AgentEntry, limit = 5): AgentEntry[] {
  return getEntriesByEcosystem(entry.ecosystem)
    .filter((e) => e.id !== entry.id && e.category === entry.category)
    .slice(0, limit);
}

export function ecosystemLabel(ecosystem: Ecosystem): string {
  switch (ecosystem) {
    case 'openclaw':
      return 'OpenClaw';
    case 'mcp':
      return 'MCP';
    case 'hermes':
      return 'Hermes';
  }
}

export function detailPath(entry: AgentEntry): string {
  switch (entry.ecosystem) {
    case 'openclaw':
      return `/openclaw/plugins/${entry.id}`;
    case 'mcp':
      return `/openclaw/mcps/${entry.id}`;
    case 'hermes':
      return `/hermes/plugins/${entry.id}`;
  }
}

export function listPath(ecosystem: Ecosystem): string {
  switch (ecosystem) {
    case 'openclaw':
      return '/openclaw/plugins';
    case 'mcp':
      return '/openclaw/mcps';
    case 'hermes':
      return '/hermes/plugins';
  }
}
