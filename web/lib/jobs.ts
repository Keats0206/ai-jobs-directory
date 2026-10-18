import jobsData from '@/data/jobs.json';
import enrichmentData from '@/data/job-enrichment.json';
import { salaryRange } from './job-quality';
import { slugify } from './job-utils';
export { slugify, jobSlug, formatSalary } from './job-utils';

// Utility functions shared across pSEO pages
export interface Job {
  title: string;
  company: string;
  apply_url: string;
  location: string;
  is_remote: boolean;
  salary_min: number;
  salary_max: number;
  tags: string[];
  description: string;
  job_type?: string;
  slug?: string;
  status?: string;
  source?: string;
  source_board?: string;
  source_verified?: boolean;
  last_verified?: string;
  first_seen?: string;
  date_posted?: string | null;
  facts?: JobFacts;
}

/** Facts extracted from the description by scripts/enrich_jobs.py; empty or null when not stated. */
export interface JobFacts {
  seniority: 'intern' | 'junior' | 'mid' | 'senior' | 'staff' | 'principal' | 'manager' | 'unknown';
  yoe_min: number | null;
  stack: string[];
  model_providers: string[];
  visa_sponsorship: 'yes' | 'no' | 'unstated';
  remote_regions: string[];
  work_type: 'research' | 'applied' | 'infra' | 'evals' | 'data' | 'product' | 'other';
  team: string | null;
  salary_min_usd: number | null;
  salary_max_usd: number | null;
}

const enrichment = enrichmentData as unknown as Record<string, JobFacts>;

// Freeze legacy URLs before filtering closed records out of the active board.
export const allJobs: Job[] = (jobsData as Job[]).map((job, index) => {
  const slug = job.slug || `${slugify(`${job.title}-${job.company}`)}-${index}`;
  return { ...job, slug, facts: enrichment[slug] };
});
export const jobs: Job[] = allJobs.filter(job => !job.status || job.status === 'active');

export function getJobBySlug(slug: string): { job: Job; index: number } | null {
  const index = allJobs.findIndex(job => job.slug === slug);
  if (index < 0) return null;
  return { job: allJobs[index], index };
}

export function getJobsByTag(tag: string): Job[] {
  const normalized = tag.toLowerCase();
  return jobs.filter(j => j.tags?.some(t => t.toLowerCase() === normalized));
}

export function getJobsByLocation(location: string): Job[] {
  const normalized = location.toLowerCase();
  return jobs.filter(j => j.location?.toLowerCase().includes(normalized));
}

/**
 * Maps a clean, human-friendly URL slug to how that place actually appears
 * in the dataset. Locations are sourced from many ATS boards, so the same
 * city shows up as "San Francisco, CA", "San Francisco", "San Francisco,
 * California", multi-city strings, etc. — getJobsByLocation's substring
 * match handles that once given the right search term.
 */
export const LOCATION_SLUG_ALIASES: Record<string, { label: string; matchTerm: string }> = {
  'san-francisco': { label: 'San Francisco', matchTerm: 'san francisco' },
  'new-york': { label: 'New York', matchTerm: 'new york' },
  'seattle': { label: 'Seattle', matchTerm: 'seattle' },
  'london': { label: 'London', matchTerm: 'london' },
  'remote': { label: 'Remote', matchTerm: 'remote' },
};

/**
 * Maps a clean, human-friendly URL slug to the exact tag string used in the
 * dataset, for skill names that don't slugify to match the stored tag
 * (e.g. "llm-engineer" -> tag "LLM").
 */
export const SKILL_SLUG_ALIASES: Record<string, string> = {
  'llm-engineer': 'LLM',
  'rag-engineer': 'RAG',
  'agent-engineer': 'Agent',
  'prompt-engineer': 'Prompt Engineering',
  'ml-engineer': 'ML Engineer',
  'ai-researcher': 'AI Research',
  'mlops-engineer': 'MLOps',
  'computer-vision-engineer': 'Computer Vision',
  'nlp-engineer': 'NLP',
  'ai-product-manager': 'AI Product Management',
  'ai-ethics-researcher': 'AI Ethics',
  'ai-solutions-architect': 'AI Solutions Architect',
};

export function getRemoteJobs(): Job[] {
  return jobs.filter(j => j.is_remote);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts: Record<string, number> = {};
  jobs.forEach(j => j.tags?.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
  }));
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Collapse common free-text location variants for pSEO index pages. */
function canonicalLocationLabel(location: string): string {
  const key = (location || '').toLowerCase().trim();
  if (!key || key === 'on-site' || key === 'onsite' || key === 'unknown') return 'On-site';
  if (key === 'remote') return 'Remote';
  if (key === 'san francisco' || key === 'san francisco, ca' || key === 'san francisco, california' || key === 'sf') {
    return 'San Francisco, CA';
  }
  if (
    key === 'new york' ||
    key === 'new york, ny' ||
    key === 'new york city' ||
    key === 'new york city, new york' ||
    key === 'nyc'
  ) {
    return 'New York, NY';
  }
  if (key === 'seattle' || key === 'seattle, wa' || key === 'seattle, washington') {
    return 'Seattle, WA';
  }
  if (key === 'london' || key === 'london, uk' || key === 'london, united kingdom') {
    return 'London, UK';
  }
  // Multi-city strings keep their original form
  return location || 'Unknown';
}

export function getAllLocations(): { location: string; count: number }[] {
  const counts: Record<string, number> = {};
  jobs.forEach(j => {
    const loc = canonicalLocationLabel(j.location || 'Unknown');
    counts[loc] = (counts[loc] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export function avgSalary(jobList: Job[]): { min: number; max: number } {
  const ranges = jobList
    .map(salaryRange)
    .filter((range): range is { min: number; max: number } => range !== null);
  if (ranges.length === 0) return { min: 0, max: 0 };
  const min = Math.round(ranges.reduce((sum, range) => sum + range.min, 0) / ranges.length);
  const max = Math.round(ranges.reduce((sum, range) => sum + range.max, 0) / ranges.length);
  return { min, max };
}

export { salaryRange } from './job-quality';
