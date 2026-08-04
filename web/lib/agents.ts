import agentsData from '@/data/agents.json';
import comparisonsData from '@/data/comparisons.json';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BodySection {
  heading: string;
  content: string;
}

export interface Agent {
  slug: string;
  name: string;
  company: string;
  website: string;
  faviconUrl: string;
  tokenUsage: string | null;
  rank: number;
  tagline: string;
  features: string[];
  platforms: string[];
  pricing: string;
  openSource: boolean;
  bestFor: string[];
  pros: string[];
  cons: string[];
  quickAnswer: string;
  bodySections: BodySection[];
  faqs: FaqItem[];
  relatedSlugs: string[];
  sourceUrls?: string[];
}

export interface ComparisonCriterion {
  label: string;
  agentA: string;
  agentB: string;
  winner: 'a' | 'b' | 'tie';
}

export interface Comparison {
  slug: string;
  agentA: string;
  agentB: string;
  quickAnswer: string;
  verdict: string;
  criteria: ComparisonCriterion[];
  bestForA: string[];
  bestForB: string[];
  faqs: FaqItem[];
  sourceUrls?: string[];
}

export const agents: Agent[] = agentsData as Agent[];
export const comparisons: Comparison[] = comparisonsData as Comparison[];

export function getAllAgents(): Agent[] {
  return [...agents].sort((a, b) => a.rank - b.rank);
}

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function isPairwiseSlug(slug: string): boolean {
  return slug.includes('-vs-');
}

export function getAgentComparisons(agentSlug: string): Comparison[] {
  return comparisons.filter((c) => c.agentA === agentSlug || c.agentB === agentSlug);
}

export function getPairwiseSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}

export function getAllCompareSlugs(): string[] {
  return [...agents.map((a) => a.slug), ...getPairwiseSlugs()];
}

export function formatTokenUsage(usage: string | null): string {
  if (!usage) return '—';
  return usage;
}

export function comparisonSlug(agentA: string, agentB: string): string {
  return `${agentA}-vs-${agentB}`;
}

export function getAgentName(slug: string): string {
  return getAgent(slug)?.name ?? slug;
}
