import { jobs, jobSlug } from './jobs';
import { recentlyVerified } from './job-collections';

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
export function buildDigest(now = new Date()) {
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
  const week = day.toISOString().slice(0, 10);
  const seenCompanies = new Map<string, number>();
  const picks = jobs.filter(job => recentlyVerified(job, now.getTime()))
    .sort((a, b) => Number(b.is_remote) - Number(a.is_remote) || Date.parse(b.first_seen || b.last_verified || '') - Date.parse(a.first_seen || a.last_verified || ''))
    .filter(job => {
      const count = seenCompanies.get(job.company) || 0;
      if (count >= 2) return false;
      seenCompanies.set(job.company, count + 1);
      return true;
    }).slice(0, 10);
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;line-height:1.6"><h1>AI jobs worth a look</h1><p>Week of ${week}. A selection from employer feeds checked within the past 14 days. Check each role for location and eligibility.</p>${picks.map(job => `<section style="border-top:1px solid #eee;padding:16px 0"><h2 style="font-size:18px"><a href="https://www.artificialjobs.dev/jobs/${jobSlug(job, jobs.indexOf(job))}?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=jobs-${week}">${escapeHtml(job.title)}</a></h2><p>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</p></section>`).join('')}<p><a href="https://www.artificialjobs.dev/browse">Browse more jobs</a></p><p style="font-size:12px">You confirmed a subscription to Artificial Jobs. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe or manage preferences</a>.</p></div>`;
  return { name: `Artificial Jobs weekly ${week}`, subject: `${picks.length} AI engineering roles · ${week}`, html, count: picks.length };
}
