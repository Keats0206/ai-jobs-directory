import { jobs, jobSlug } from '@/lib/jobs';
import { recentlyVerified } from '@/lib/job-collections';
const xml = (value: string) => value.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
export const revalidate = 3600;
export function GET() {
  const selected = jobs.filter(job => recentlyVerified(job)).sort((a, b) => (b.first_seen || '').localeCompare(a.first_seen || '')).slice(0, 50);
  const items = selected.map(job => {
    const url = `https://www.artificialjobs.dev/jobs/${jobSlug(job, jobs.indexOf(job))}`;
    const date = job.date_posted || job.first_seen;
    return `<item><title>${xml(`${job.title} at ${job.company}`)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(`${job.location}. ${job.description.slice(0, 500)}`)}</description>${date && Number.isFinite(Date.parse(date)) ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ''}</item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Artificial Jobs — verified AI roles</title><link>https://www.artificialjobs.dev</link><description>AI engineering roles from employer hiring feeds.</description><language>en</language><atom:link href="https://www.artificialjobs.dev/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
