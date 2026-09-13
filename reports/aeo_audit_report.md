# AI Jobs SEO and AEO audit

Audited 2026-09-13. Live baseline: https://www.artificialjobs.dev, 10 pages. Raw evidence: `aeo-baseline.json`. Local fixes have not been deployed; these scores describe production before the changes.

## Scores

Foundational: **79/100**, unchanged from the bundled audit. Editorial evaluation: **63/100**. Combined: **71/100 (B−)**. This is a diagnostic rubric, not a prediction of rankings or AI citations.

## Foundational checks

| Check | Result |
|---|---|
| Canonical | Fail: absent on all 10 pages |
| Image alt coverage | Fail in tool: only 1/10 pages passed; shared agent-avatar uses intentional empty alt for decorative images, so this needs manual interpretation |
| Heading hierarchy | Fail: 7/10 passed; hub cards skip from H1 to H3 |
| RSS/Atom | Fail: no discoverable feed |
| Title, description, H1 count | Pass |
| JSON-LD presence and recognized types | Pass |
| Open Graph, internal links, content depth | Pass |
| Indexability, AI meta directives | Pass |
| llms.txt, AI bot access | Pass |

## Editorial evaluation

- Answer readiness: agent reviews open with definitions, though the homepage is a job list and rankings leave some pricing unknown. **4/5**. Finding: useful direct answers in reviews.
- Quotability: comparison tables and self-contained product paragraphs offer extractable passages. **4/5**. Finding: tables support comparison questions.
- Evidence density: numeric claims exist, but the sampled excerpts do not establish their sourcing or observation dates. **3/5**. Finding: add source links next to claims.
- Depth: sampled reviews cover capabilities and operation; the homepage includes malformed listings such as “Back” and “...”. **3/5**. Finding: clean imported listings before expanding pages.
- Freshness: year labels appear, but none of the samples expose publication or modification metadata. **1/5**. Finding: record actual verification dates.
- Structure: clear titles and review sections, with skipped heading levels on hubs. **4/5**. Finding: fix hub heading hierarchy.

Mean: 19/30 × 100 = 63.3. Combined: round((79 + 63.3)/2) = 71.

## Changes made locally

1. **Remote search intent:** all remote skill pages now use `is_remote` for titles, counts, lists, FAQ answers, related skill links, and sitemap eligibility. The dataset contains 3,105 jobs, of which 1,120 are remote. `/remote/llm` now correctly lists 316 remote roles instead of all 760 LLM jobs.
2. **Canonical coverage:** every public page template now declares its own canonical. Salary aliases such as `/salary/llm-engineer` permanently redirect to `/salary/llm`. The homepage title and description now focus on AI engineering jobs.
3. **Indexing quality:** sitemap URLs are unique, empty remote pages are excluded, salary guides are listed only when they contain published pay, and salary pages without pay are noindex/follow. Valid location aliases are included. No sitemap timestamp is fabricated from the build date.
4. **Job URL integrity:** lookup requires the complete current slug. An arbitrary or outdated prefix cannot show whichever job happens to occupy the same array index. Valid current links remain unchanged.
5. **Job structured data:** removed nested JobPosting objects from remote listing pages, which now link to individual job pages using ItemList. Individual job pages use the canonical detail URL, original employer posting dates, explicit closing dates only, and known employment types only. Missing/invalid/future posting dates and explicitly expired jobs use ordinary WebPage schema. Those pages remain indexable but do not claim JobPosting rich-result eligibility. The full description is visible instead of being truncated to 3,000 characters. UK addresses are no longer classified as US states.
6. **Content structure:** section labels are actual H2 headings above H3 cards. Added page-specific structured data to the Cursor Rules library/details and MCP submission page. Removed the unsupported senior salary multiplier and the blanket claim that remote roles accept international applicants.
7. **Repeatable tooling:** live/preview audits discover actual sitemap URLs, sample route families, check HTTP status, redirects, canonical URLs, noindex directives, duplicate metadata, and parse JSON-LD. The build audit checks every prerendered sitemap page without a network crawl. Both export JSON and fail with nonzero exit codes when issues are found.

## Validation of the local changes

- Production build: 3,756 generated routes; TypeScript completed successfully.
- All **3,731 sitemap pages** passed the generated-HTML audit: `seo-build.json`.
- A **60-page HTTP sample** through the local production server passed with zero page failures or site issues: `seo-local-http.json`.
- **21 regression tests passed**: 5 audit tests plus 16 job/domain tests. Targeted ESLint passed for changed code. A broader lint run also found a pre-existing `prefer-const` error in the unrelated newsletter API.
- Browser verification passed: homepage search returned Sardine jobs; the remote LLM page rendered exactly 316 job links; desktop and 390px mobile views rendered without horizontal overflow or browser runtime errors. Screenshots: `remote-llm-desktop.png` and `remote-llm-mobile.png`.
- HTTP behavior verified: salary alias returned **308**, mismatched job URL returned **404**.
- The local 10-page AEO crawl scored **94/100 foundational** (`aeo-local.json`). Its sample differs from production because production canonical URLs are deliberately retained in the local sitemap, so this is **not an apples-to-apples 79→94 gain**. The outstanding check in that local sample was RSS/Atom discovery. No editorial rescoring or improved live score is claimed.

## Remaining organic traffic priorities

1. **Persistent job identity and freshness:** slugs still contain array indexes. A future ingestion change should introduce immutable IDs plus an explicit redirect map. Existing mismatched URLs now 404 instead of showing the wrong job; title changes or dataset reordering can therefore require redirects. Verify active employer application URLs and record actual source dates in ingestion. Do not restore guessed dates merely to qualify more listings for rich results.
2. **Source quality:** reject malformed titles/companies such as “Back” or “...” before publication. Check country/currency provenance before expanding salary comparisons. Structured-data checks do not establish that an employer is still accepting applications.
3. **Evidence:** add source links and actual verification dates to agent pricing and token rankings. Token usage is not measured product quality. A dated RSS feed would help readers follow confirmed new entries.
4. **Measured page selection:** use Search Console queries/pages to identify high-impression, low-CTR pages and queries near page one. Existing keywords.csv, prompts.csv, and plan.csv are planning inputs, not measured ranking evidence. No Search Console or conversion exports were available in this task.

After deployment, submit/check the canonical sitemap in Search Console, inspect representative job and salary URLs, and monitor organic clicks, impressions, CTR, indexed-page counts, and application clicks weekly. Choose new landing pages from observed demand and sufficient real listings rather than producing hundreds of thin templates.

## Tool assessment and operating commands

The old `seo-test.mjs` used a fabricated sample job URL, ignored HTTP statuses, counted text matching @type rather than parsing JSON-LD, and exited successfully despite failures. The live replacement is a server-HTML smoke audit; it does not execute JavaScript, validate full schema.org semantics, measure Core Web Vitals, evaluate robots rules, or prove Google indexing. Its sitemap reader currently supports a flat urlset (the current site format), not sitemap indexes. Requests time out after 15 seconds; page sampling defaults to 30 and caps at 5,000.

From `web/`:

```sh
npm run seo:test
npm run build
npm run seo:audit:build -- --out=/tmp/ai-jobs-build-seo.json
npm run seo:audit -- --max-pages=60 --out=/tmp/ai-jobs-live-seo.json
```

To check a locally running production build (start it with `npm run start -- --port 3107`):

```sh
npm run seo:audit -- --site=http://localhost:3107 --canonical-site=https://www.artificialjobs.dev --max-pages=60 --out=/tmp/ai-jobs-preview-seo.json
```

`--canonical-site` maps production sitemap paths to the local/preview host while validating the production canonicals. Omit it when auditing production. The build command expects prerendered HTML for sitemap pages; if the app later moves those pages to dynamic rendering, use HTTP audits instead. Build checks cannot verify redirects or response headers, which is why both modes were run.

The live tool supports up to `--max-pages=5000` but makes sequential requests; use the build audit for fast full coverage and a representative HTTP sample per release. A nonzero exit means findings or an audit failure; inspect the report.

Use Search Console for actual impressions, clicks, CTR, indexing, and query position. Use the CLI for regressions. Use Rich Results Test for representative job details. Re-run the same live baseline after deployment; no improved live score is claimed here.

## Corrections to the older SEO plan

The existing plan's traffic/ranking baselines and 8-week targets are unverified estimates. Adding FAQ markup does not establish featured-snippet eligibility. Do not represent salary aggregates as product offers just to add schema. Schema should describe visible content and supported entities.

Google states that sitemap `lastmod` should reflect significant real updates, and ignores priority/changefreq: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap



Google’s job-specific structured-data guidance: https://developers.google.com/search/docs/appearance/structured-data/job-posting
