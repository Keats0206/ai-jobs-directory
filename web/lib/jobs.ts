import jobsData from '@/data/jobs.json';
import { slugify } from './job-utils';
export { slugify, jobSlug, formatSalary } from './job-utils';

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
  /** Contract pay for expert-network roles (micro1); salary_min/max stay annual-only. */
  hourly_min?: number | null;
  hourly_max?: number | null;
  /** Apply link carries our referral code, so it needs a disclosure and rel="sponsored". */
  is_referral?: boolean;
  /** AI training (expert network) fields from micro1. */
  field?: string;
  field_label?: string;
  skills?: string[];
  high_demand?: boolean;
  openings?: number | null;
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

// Freeze slugs before filtering closed records, so filled roles can still redirect.
export const allJobs: Job[] = (jobsData as Job[]).map((job, index) => ({
  ...job,
  slug: job.slug || `${slugify(`${job.title}-${job.company}`)}-${index}`,
}));
/** Open micro1 AI training roles: everything the site lists. */
export const trainingJobs: Job[] = allJobs.filter(job => job.source === 'micro1' && (!job.status || job.status === 'active'));

export function getJobBySlug(slug: string): { job: Job; index: number } | null {
  const index = allJobs.findIndex(job => job.slug === slug);
  if (index < 0) return null;
  return { job: allJobs[index], index };
}

export { salaryRange } from './job-quality';
