#!/usr/bin/env node
/**
 * Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver).
 * Bing's index feeds ChatGPT search and Copilot, so this gets new pages in front of them in minutes.
 * The key is public by design: IndexNow verifies it against web/public/<key>.txt.
 *
 *   node scripts/indexnow.mjs [--dry-run]
 */
const HOST = 'www.artificialjobs.dev';
const KEY = 'fb4e7d130f862e3bf7be80ec710630ac';
const dryRun = process.argv.includes('--dry-run');

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urls.length) throw new Error('No URLs found in sitemap');

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  if (dryRun) {
    console.log(`Would submit ${urlList.length} URLs, e.g. ${urlList.slice(0, 3).join(', ')}`);
    continue;
  }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
  if (res.status >= 400) process.exit(1);
}
