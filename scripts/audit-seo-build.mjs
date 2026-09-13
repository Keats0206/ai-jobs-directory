#!/usr/bin/env node
// Audit every sitemap page in a completed Next.js production build without crawling the network.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect } from '../seo-test.mjs';

const buildRoot = fileURLToPath(new URL('../web/.next/server/app/', import.meta.url));
const out = process.argv.find((arg) => arg.startsWith('--out='))?.slice(6);
try {
  const xml = await readFile(resolve(buildRoot, 'sitemap.xml.body'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, '&'));
  if (!urls.length) throw new Error('No URLs in the built sitemap. Run npm run build first.');
  const siteIssues = new Set(urls).size === urls.length ? [] : ['Duplicate sitemap URLs'];
  const pages = [];
  for (const url of urls) {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const file = resolve(buildRoot, `${pathname === '/' ? 'index' : pathname.slice(1)}.html`);
    if (relative(buildRoot, file).startsWith('..')) throw new Error('Sitemap URL escapes the build directory');
    try { pages.push(inspect(await readFile(file, 'utf8'), url)); }
    catch (error) { pages.push({ url, issues: [`Missing or unreadable prerendered HTML: ${error.code}`] }); }
  }
  const failures = pages.filter((page) => page.issues.length);
  const report = { checkedAt: new Date().toISOString(), mode: 'production-build-html', pagesChecked: pages.length, failedPages: failures.length, siteIssues, pages };
  if (out) await writeFile(out, JSON.stringify(report, null, 2) + '\n');
  for (const page of failures) console.log(`FAIL ${page.url}\n  ${page.issues.join('\n  ')}`);
  console.log(`Checked ${pages.length} prerendered sitemap pages; ${failures.length} failed; ${siteIssues.length} site issues.`);
  if (failures.length || siteIssues.length) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
