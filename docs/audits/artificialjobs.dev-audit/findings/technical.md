# Technical SEO findings: www.artificialjobs.dev (2026-10-27)

**Technical score: 84/100.** Sample: 35 URLs across all types, plus edge-case probes (404, trailing slash, case, query string, unknown job slug). Fetched at 1 req/sec.

| Category | Status |
|---|---|
| Crawlability | Pass |
| Indexability | Pass, with notes |
| Security headers | Fail (HSTS only) |
| URL structure and redirects | Pass, with notes |
| Mobile | Pass |
| Core Web Vitals (source) | Pass, with notes |
| Structured data | Pass, with notes |
| JS rendering | Pass (SSR/prerendered) |
| IndexNow | Pass |

## What works
- All 35 sampled URLs returned 200 in 0.15-0.8s. Pages are prerendered (`x-nextjs-prerender: 1`, `x-vercel-cache: HIT`). `is_spa=false`. Content is in the raw HTML, with one H1 per page.
- Every sampled page has a self-referencing absolute canonical, a unique title and a meta description. The canonical is correct on the uppercase `/Jobs/...` variant and on `?utm=` URLs.
- Apex redirects 308 to www in one hop. http redirects to https. Trailing slashes 308 to the clean path.
- robots.txt is valid and declares `https://www.artificialjobs.dev/sitemap.xml`. The sitemap has 343 URLs with real `lastmod` values (`web/app/sitemap.ts`). Every sampled URL returned 200 and is indexable.
- True 404s (`/blog/nope`, `/ai-training-jobs/nope`) return status 404 with `noindex`.
- The viewport meta tag is correct and `<html lang="en">` is set.
- IndexNow is wired up. The key file `/fb4e7d130f862e3bf7be80ec710630ac.txt` returns 200, and `web/scripts/indexnow.mjs` submits the whole sitemap.
- The RSS feed (`/blog/feed.xml`), `llms.txt` and the Pay Index CSV all serve with correct content types.
- JobPosting JSON-LD is present on every job page: salary, `validThrough`, `employmentType`, remote fields and breadcrumbs. Job pages are about 65KB.

## Findings

### Medium
1. **Security headers missing.**
   - Evidence: only `strict-transport-security: max-age=63072000` is sent. There is no CSP, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy` or `Permissions-Policy`. HSTS has no `includeSubDomains` or `preload`. `/.well-known/security.txt` returns 404. `web/next.config.ts` has no `headers()`.
   - Fix: add an `async headers()` block in `web/next.config.ts` for `/:path*`. Send `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`) and a restrictive `Permissions-Policy`. Add `; includeSubDomains; preload` to HSTS once you have confirmed the subdomains. Add `public/.well-known/security.txt`.

2. **Unknown or removed job slugs 308 to the homepage instead of returning 404/410.**
   - Evidence: `/jobs/does-not-exist` returns 308 with `location: /`. The cause is `permanentRedirect('/')` in `web/app/jobs/[slug]/page.tsx:~38`.
   - Google treats mass redirects to the homepage as soft 404s. Closed jobs redirect to their field page (`page.tsx:40-42`), which is good. But slugs that are not in the data at all, including every future typo or scraped URL, get a permanent redirect to `/`.
   - This is intentional for the retired engineering board, which is covered by `next.config.ts` redirects for `/jobs`, `/browse` and similar.
   - Fix: redirect to `/` only for known legacy slugs. Call `notFound()` for everything else. Closed jobs should go to the field page, or return 410 after a retention window.

3. **Job `validThrough` is a fixed 60 days after `datePosted`, and 5 active jobs are already past it.**
   - Evidence: `web/lib/job-quality.ts` computes `validThrough` as `datePosted` plus 60 days. Five active jobs have `date_posted` of 2026-08-27 or earlier: investment-finance-expert-micro1-5934, tamil-transcription-expert-micro1-6043, telugu-transcription-expert-micro1-6108, data-scientist-micro1-6119 and german-transcription-expert-micro1-6135. They are still in the sitemap and still show an expired `validThrough`, which risks Google excluding them from job rich results.
   - Evidence: `FALLBACK_DATE` is the build date, so any job without a date gets a different `datePosted` on every deploy.
   - Fix: base `validThrough` on `last_verified` plus 14-30 days. Drop or redirect jobs the source no longer lists. Remove the build-time fallback and persist a first-seen date.

4. **Job `description` in JSON-LD contains raw markdown.**
   - Evidence: sampled values start with `**Role Type:** Contractor **Location:**...`, or have `**` fused into the text (`...PhD)**Pay:**`).
   - Google wants plain text or simple HTML in the JobPosting description.
   - Fix: convert the markdown to HTML or plain text before writing it to JSON-LD (`web/app/jobs/[slug]/page.tsx:~55`).

### Low
5. **Near-duplicate and thin-content risk.**
   - The 307 job pages are all templated, with similar structure, intro text and benefits boilerplate. Each has a unique title and unique description body of 1.5-3.4KB, so the risk is moderate.
   - Five title stems are shared by more than one job (hospitalist-physician, japanese-language-expert, korean-language-expert, lawyer, software-engineer). Their titles and meta descriptions are identical apart from the ID.
   - `/ai-training-jobs/medicine` ("Doctors") and `/ai-training-jobs/physicians` overlap heavily in topic and listings. `/ai-training-jobs/retail-hospitality` has only 2 jobs and `/ai-training-jobs/chemists` has 6. Consider consolidating thin hubs, or noindexing hubs with fewer than 3 jobs.
   - Fix: add differentiators to the title or description (location or countries, employment type, a unique intro sentence). Canonicalize or merge the medicine and physicians hubs.

6. **Homepage and hub payload is large.** The homepage is 295KB of HTML. `/ai-training-jobs/law` is 223KB and `/ai-training-jobs/other` is 213KB. The cause is probably all job cards plus RSC payload being serialized into the HTML. This is a minor LCP and INP risk. Paginate or lazy-render long lists, and trim fields passed to client components.

7. **Sitemap hygiene.** `changefreq` and `priority` are ignored by Google, so they are harmless. `/about` and `/sell-company-data` have no `lastmod`. The `lastmod` on blog posts is the global `dataUpdated()` for every post rather than each post's own date, which weakens the freshness signal.

8. **Case-variant and query-string URLs return 200.** `/Jobs/...` and `?utm=x` both work. They are handled by canonical tags, so this is fine. Optionally 308 uppercase paths to lowercase.

9. **robots.txt is bare** (`Allow: /`). It does not block `/api/` or the newsletter confirm routes, and has no explicit AI-crawler policy. Add `Disallow: /api/`.

10. **`Access-Control-Allow-Origin: *` on HTML pages.** This is the Vercel default for static output and is low risk.

## Not tested
Lab Core Web Vitals (no CrUX or Lighthouse run). Full 307-page crawl (sampled at about 1 in 14). Hreflang (single-language site, not applicable).
