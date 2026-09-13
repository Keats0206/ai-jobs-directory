#!/usr/bin/env node
// Dependency-free server-rendered SEO smoke audit. Node 20+.
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
export function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((m) => [m[1].toLowerCase(), decode(m[2] ?? m[3] ?? m[4])]));
}
export function inspect(html, url, status = 200, headers = {}, canonicalUrl = url) {
  const issues = [];
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = meta.find((m) => m.name === 'description')?.content ?? '';
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((a) => a.rel?.split(/\s+/).includes('canonical'));
  if (status !== 200) issues.push(`HTTP ${status}`);
  if (title.length < 10) issues.push('Missing or very short title');
  if (description.length < 50) issues.push('Missing or very short description');
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) issues.push('Expected exactly one H1');
  if (canonicals.length !== 1) issues.push('Expected exactly one canonical');
  else {
    try {
      const canonical = new URL(canonicals[0].href);
      if (canonical.href !== new URL(canonicalUrl).href) issues.push(`Canonical differs: ${canonical.href}`);
    } catch { issues.push('Canonical must be an absolute URL'); }
  }
  const directives = meta.filter((m) => ['robots', 'googlebot'].includes(m.name?.toLowerCase())).map((m) => m.content).join(',') + ',' + (headers['x-robots-tag'] ?? '');
  if (/\b(noindex|none)\b/i.test(directives)) issues.push('Page is noindex');
  for (const property of ['og:title', 'og:description']) {
    if (!meta.some((m) => m.property === property && m.content)) issues.push(`Missing ${property}`);
  }
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((m) => attributes(m[1]).type === 'application/ld+json');
  if (!blocks.length) issues.push('Missing JSON-LD');
  for (const block of blocks) {
    try { JSON.parse(block[2]); } catch { issues.push('Invalid JSON-LD'); }
  }
  return { url, status, title, description, issues };
}

export async function run(args = process.argv.slice(2)) {
  const options = Object.fromEntries(args.map((arg) => {
    const index = arg.indexOf('=');
    return index < 0 ? [arg, true] : [arg.slice(0, index), arg.slice(index + 1)];
  }));
  const site = new URL(options['--site'] || 'https://www.artificialjobs.dev');
  const canonicalSite = new URL(options['--canonical-site'] || site.href);
  const max = Number(options['--max-pages'] || 30);
  if (!Number.isInteger(max) || max < 1 || max > 5000) throw new Error('--max-pages must be between 1 and 5000');
  const fetchText = async (url) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'ArtificialJobs-SEO-Audit/1.0' } });
    return { response, body: await response.text() };
  };
  const siteIssues = [];
  const urls = new Set([site.href]);
  try {
    const { response, body } = await fetchText(new URL('/sitemap.xml', site));
    if (!response.ok || !/<urlset\b/i.test(body)) throw new Error(`Expected a sitemap urlset, HTTP ${response.status}`);
    const entries = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => decode(m[1].trim()));
    if (!entries.length) siteIssues.push('Sitemap has no URLs');
    if (new Set(entries).size !== entries.length) siteIssues.push('Sitemap contains duplicate URLs');
    // Round-robin route families so large comparison catalogs do not hide job issues.
    const groups = new Map();
    for (const entry of entries) {
      const url = new URL(entry);
      if (url.origin !== canonicalSite.origin) { siteIssues.push(`Foreign sitemap URL: ${entry}`); continue; }
      const group = url.pathname.split('/')[1];
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(new URL(url.pathname + url.search, site).href);
    }
    while (urls.size < max && [...groups.values()].some((group) => group.length)) {
      for (const group of groups.values()) if (group.length && urls.size < max) urls.add(group.shift());
    }
  } catch (error) { siteIssues.push(`Sitemap: ${error.message}`); }
  try {
    const { response, body } = await fetchText(new URL('/robots.txt', site));
    if (!response.ok || !/^Sitemap:\s*https?:\/\//im.test(body)) siteIssues.push('robots.txt missing or lacks sitemap declaration');
  } catch (error) { siteIssues.push(`robots.txt: ${error.message}`); }
  const pages = [];
  for (const url of urls) {
    try {
      const { response, body } = await fetchText(url);
      const page = inspect(body, url, response.status, Object.fromEntries(response.headers), new URL(new URL(url).pathname + new URL(url).search, canonicalSite).href);
      if (response.url !== url) page.issues.push(`Redirects to ${response.url}`);
      if (!response.headers.get('content-type')?.includes('text/html')) page.issues.push('Expected HTML content type');
      pages.push(page);
    } catch (error) { pages.push({ url, issues: [`Fetch: ${error.message}`] }); }
  }
  for (const field of ['title', 'description']) {
    const seen = new Map();
    for (const page of pages) {
      if (!page[field]) continue;
      if (seen.has(page[field])) page.issues.push(`Duplicate ${field}: ${seen.get(page[field])}`);
      else seen.set(page[field], page.url);
    }
  }
  const report = { generatedAt: new Date().toISOString(), site: site.href, canonicalSite: canonicalSite.href, siteIssues, pages, failedPages: pages.filter((p) => p.issues.length).length };
  for (const issue of siteIssues) console.log(`FAIL ${issue}`);
  for (const page of pages) console.log(`${page.issues.length ? 'FAIL' : 'PASS'} ${page.url}${page.issues.length ? '\n  ' + page.issues.join('\n  ') : ''}`);
  console.log(`Audited ${pages.length} pages; ${report.failedPages} failed; ${siteIssues.length} site issues.`);
  if (options['--out']) await writeFile(options['--out'], JSON.stringify(report, null, 2) + '\n');
  if (siteIssues.length || report.failedPages) process.exitCode = 1;
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
