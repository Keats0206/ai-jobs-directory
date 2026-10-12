import type { Job } from './jobs';
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export function jobSlug(job: Job, index: number): string {
  return job.slug || `${slugify(`${job.title}-${job.company}`)}-${index}`;
}
export function formatSalary(min: number, max: number): string {
  const fmt = (value: number) => value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
