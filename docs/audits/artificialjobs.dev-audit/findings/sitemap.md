# Sitemap audit: https://www.artificialjobs.dev/sitemap.xml (2026-10-27)

Generator: `web/app/sitemap.ts` (Next.js MetadataRoute, static at build). Referenced from `web/app/robots.ts:6`.

## What works
- Valid XML, urlset namespace correct, HTTP 200 `application/xml`, 68 KB, 343 URLs (limits are 50,000 URLs / 50 MB), no duplicate URLs.
- HEAD-checked all 343 URLs (~3 req/s): 343 x 200, 0 redirects, 0 4xx/5xx.
- Spot-checked canonicals (home, /about, /sell-company-data, /micro1, /blog, a blog post, a field page, 8 random jobs): all self-referencing and match the sitemap `<loc>` exactly (no trailing-slash or host mismatch).
- No expired jobs: sitemap uses `trainingJobs` (`web/lib/jobs.ts:61`, filters to source=micro1 and status active). All 307 jobs in `data/jobs.json` are active. Closed jobs 308 to their field page or `/` (`web/app/jobs/[slug]/page.tsx`), so they would drop out of the sitemap and not 404.
- robots.txt allows all and declares the sitemap.
- Mix: 307 jobs, 25 field/collection pages, 5 blog (index + posts), 2 sell-company-data, home, /micro1, /about, /pay-index/2026-10.

## Findings

### MEDIUM - lastmod is effectively identical and not a real change signal
Evidence: 339 of 343 `<lastmod>` are `2026-10-24T17:34:13.595Z`; 2 are `2026-10-24T00:00:00.000Z`; 2 URLs have none. All 307 jobs have `last_verified` and `first_seen` = 2026-10-24, so `latest([job])` (`sitemap.ts:8-11,32`) returns the scrape-run stamp for every job, field page, home and /micro1. Blog index and every post use the same `dataUpdated()` value (`sitemap.ts:22-23`, `web/lib/blog.tsx:34`), so a post's lastmod changes whenever any job is re-verified, even if the post is unchanged.
Impact: Google will learn to ignore lastmod for this site; the point of real dates (freshness signal) is lost.
Fix: (a) Track per-job `last_changed` (hash of title/pay/description/status) in the scraper and use that instead of `last_verified`; keep `last_verified` for on-page display only. (b) Give each blog post its own `updated`/`published` date instead of `dataUpdated()`. (c) Field pages: max of member jobs' `last_changed` plus add/remove events.

### LOW - Missing lastmod on 2 URLs
`/sell-company-data` and `/about` (`sitemap.ts:17,19`). `what-is-it-worth` is hardcoded `new Date('2026-10-24')` (`sitemap.ts:18`) and will go stale. Fix: derive from file/content date constants.

### LOW - priority and changefreq present on every URL
All 343 carry them (27 daily, 314 weekly, 2 monthly); Google ignores both. `changefreq: daily` on a sitemap whose lastmod never differs adds noise. Fix: delete these fields from `sitemap.ts` (lines 16-34). Zero risk.

### LOW - Possibly omitted pages
- `/newsletter` (200, indexable, linked) is not in the sitemap. Add if you want it indexed; otherwise leave it out and consider noindex.
- `/pay-index` is absent by design (its canonical is `/pay-index/2026-10`, which is in the sitemap). OK.
- `/blog/feed.xml` (RSS, 200 `application/rss+xml`), `/pay-index/2026-10.csv` (200 `text/csv`) and `/llms.txt` are not HTML pages and should not be in the page sitemap; they are discoverable via links. Optionally advertise feed via `<link rel="alternate" type="application/rss+xml">`. (`/rss.xml` 404, `/feed.xml` 308 - no issue.)
- Pay-index editions are auto-included via `getEditions()` (`sitemap.ts:21`), so new months will appear.
- Every nav link (/, /micro1, /pay-index, /sell-company-data, /about, /blog) is covered.

### INFO - Split sitemap index: not needed yet
343 URLs is ~0.7% of the limit. A split only helps reporting: Search Console shows indexation per sitemap, so with `generateSitemaps()` (Next.js) you could split into `pages`, `blog`, `fields`, `jobs` and see indexed-vs-submitted for the 307 job pages separately. Worth doing as a low-effort diagnostic once lastmod is fixed, not for size reasons. Revisit if jobs exceed ~10k.

### INFO - Job freshness/expiry hygiene
Closed-job handling is correct (301 + removal). Since everything is generated at build, a job closed in data but not rebuilt would still be listed; ensure the scrape pipeline triggers a redeploy (or use ISR) so the sitemap does not list closed roles for days. Currently the live sitemap was last built 2026-10-26 19:34 GMT with data dated 2026-10-24, so data has not been refreshed in 3 days; confirm the scraper is running.

## Quality gates
No location pages. Job pages are templated programmatic pages (307): ensure each has unique description content (not checked here).
