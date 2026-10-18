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
/** "today", "3 days ago", "2 weeks ago" — coarse on purpose; data refreshes daily. */
export function timeAgo(iso: string | null | undefined, now = Date.now()): string | null {
  const time = Date.parse(iso || '');
  if (!Number.isFinite(time)) return null;
  const days = Math.max(0, Math.floor((now - time) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
