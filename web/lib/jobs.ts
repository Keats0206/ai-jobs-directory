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
  source_job_id?: string;
  source_verified?: boolean;
  last_verified?: string;
  first_seen?: string;
  date_posted?: string | null;
  /** Contract pay for expert-network roles (micro1, Mercor); salary_min/max stay annual-only. */
  hourly_min?: number | null;
  hourly_max?: number | null;
  /** Mercor paid interviews, surveys and tasks pay a flat amount instead of an hourly rate. */
  flat_pay_min?: number | null;
  flat_pay_max?: number | null;
  pay_frequency?: 'per-task' | 'one-time' | null;
  hours_per_week?: number | null;
  work_arrangement?: string;
  referral_reward?: number | null;
  /** Apply link carries our referral code, so it needs a disclosure and rel="sponsored". */
  is_referral?: boolean;
  /** AI training (expert network) fields; Mercor domains are mapped onto micro1's field slugs. */
  field?: string;
  field_label?: string;
  skills?: string[];
  /** Countries the platform accepts applicants from. */
  applicant_countries?: string[];
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
export const PLATFORMS = {
  micro1: { name: 'micro1', site: 'https://micro1.ai', review: '/micro1' },
  mercor: { name: 'Mercor', site: 'https://mercor.com', review: '/mercor' },
} as const;
export type PlatformId = keyof typeof PLATFORMS;

const isOpen = (job: Job) => !job.status || job.status === 'active';
const isPlatform = (job: Job): job is Job & { source: PlatformId } => Boolean(job.source && job.source in PLATFORMS);

/** Open AI training roles from every expert network: everything the site lists. */
export const trainingJobs: Job[] = allJobs.filter(job => isPlatform(job) && isOpen(job));
export const micro1Jobs: Job[] = trainingJobs.filter(job => job.source === 'micro1');
export const mercorJobs: Job[] = trainingJobs.filter(job => job.source === 'mercor');

/** The expert network a listing comes from (micro1 or Mercor). */
export function platformOf(job: Job) {
  return PLATFORMS[isPlatform(job) ? job.source : 'micro1'];
}

export function getJobBySlug(slug: string): { job: Job; index: number } | null {
  const index = allJobs.findIndex(job => job.slug === slug);
  if (index < 0) return null;
  return { job: allJobs[index], index };
}

export { salaryRange } from './job-quality';
