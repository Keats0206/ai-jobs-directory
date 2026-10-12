/** Refresh the public snapshot with local Vercel CLI auth or VERCEL_TOKEN.
 * Optional --gsc=path.json supplies confirmed Search Console totals and dates.
 * Never serializes provider credentials, contact details, or user-level analytics.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
const path = new URL('../web/data/public-stats.json', import.meta.url);
const previous = JSON.parse(readFileSync(path, 'utf8'));
const until = new Date(); until.setUTCHours(0, 0, 0, 0);
const since = new Date(until.getTime() - 30 * 86400000);
const project = 'prj_e2H7wdLVWSiFheT5fl49AUGuqeVN';
const team = 'team_my1gDSSce9sqt2YgeqdnfNwB';
async function query(kind, by) {
  const params = new URLSearchParams({ projectId: project, teamId: team, since: since.toISOString(), until: new Date(until.getTime() - (by ? 1 : 0)).toISOString() });
  if (by) { params.set('by', by); params.set('limit', by === 'day' ? '31' : '10'); }
  const endpoint = `/v1/query/web-analytics/visits/${kind}?${params}`;
  let result;
  if (process.env.VERCEL_TOKEN) {
    const response = await fetch(`https://api.vercel.com${endpoint}`, { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } });
    if (!response.ok) throw new Error(`Analytics request failed (${response.status})`);
    result = await response.json();
  } else result = JSON.parse(execFileSync('vercel', ['api', endpoint, '--raw'], { encoding: 'utf8', maxBuffer: 1024 * 1024 }));
  if (!result.data || result.error) throw new Error('Invalid analytics response; existing snapshot retained');
  return result.data;
}
const [totals, daily, referrers] = await Promise.all([query('count'), query('aggregate', 'day'), query('aggregate', 'referrerHostname')]);
if (!Number.isFinite(totals.visitors) || !Number.isFinite(totals.pageviews) || !Array.isArray(daily) || !Array.isArray(referrers)) throw new Error('Invalid metrics');
let searchConsole = previous.searchConsole;
const gsc = process.argv.find(arg => arg.startsWith('--gsc='));
if (gsc) {
  const report = JSON.parse(readFileSync(gsc.slice(6), 'utf8'));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(report.since) || !/^\d{4}-\d{2}-\d{2}$/.test(report.until) || report.since > report.until || !Number.isInteger(report.clicks) || !Number.isInteger(report.impressions) || report.clicks < 0 || report.impressions < 0) throw new Error('Search Console needs exact nonnegative totals and a valid date range');
  searchConsole = { since: report.since, until: report.until, clicks: report.clicks, impressions: report.impressions, source: 'Google Search Console · Web search' };
}
const snapshot = { period: { since: since.toISOString().slice(0,10), until: new Date(until.getTime()-1).toISOString().slice(0,10), timezone:'UTC' }, updatedAt: new Date().toISOString(), source:'Vercel Web Analytics', totals, daily, referrers, searchConsole };
const temporary = new URL('../web/data/public-stats.tmp', import.meta.url);
writeFileSync(temporary, JSON.stringify(snapshot,null,2)+'\n'); renameSync(temporary,path);
console.log(`Public snapshot refreshed: ${totals.visitors} visitors, ${totals.pageviews} pageviews.`);
