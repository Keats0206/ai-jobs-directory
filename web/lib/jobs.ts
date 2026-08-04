import jobsData from '@/data/jobs.json';

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
}

export const jobs: Job[] = jobsData as Job[];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function jobSlug(job: Job, index: number): string {
  const base = slugify(`${job.title}-${job.company}`);
  return `${base}-${index}`;
}

export function getJobBySlug(slug: string): { job: Job; index: number } | null {
  const match = slug.match(/-(\d+)$/);
  if (!match) return null;
  const index = parseInt(match[1], 10);
  if (index < 0 || index >= jobs.length) return null;
  return { job: jobs[index], index };
}

export function getJobsByTag(tag: string): Job[] {
  const normalized = tag.toLowerCase();
  return jobs.filter(j => j.tags?.some(t => t.toLowerCase() === normalized));
}

export function getJobsByLocation(location: string): Job[] {
  const normalized = location.toLowerCase();
  return jobs.filter(j => j.location?.toLowerCase().includes(normalized));
}

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

export function getAllLocations(): { location: string; count: number }[] {
  const counts: Record<string, number> = {};
  jobs.forEach(j => {
    const loc = j.location || 'Unknown';
    counts[loc] = (counts[loc] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export function avgSalary(jobList: Job[]): { min: number; max: number } {
  if (jobList.length === 0) return { min: 0, max: 0 };
  const min = Math.round(jobList.reduce((s, j) => s + (j.salary_min || 0), 0) / jobList.length);
  const max = Math.round(jobList.reduce((s, j) => s + (j.salary_max || 0), 0) / jobList.length);
  return { min, max };
}
