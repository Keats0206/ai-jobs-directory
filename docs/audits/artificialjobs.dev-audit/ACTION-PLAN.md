# artificialjobs.dev — SEO Action Plan

Audit date: 2026-10-27 · SEO Health Score: **72/100** · Full report: [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md)

## Critical — fix now

1. **Daily job refresh has been failing since 2026-10-25.** `refresh-jobs.yml` runs on 10-25, 10-26, 10-27 failed in ~12s (micro1 API returns 403 to GitHub-hosted runner IPs). Listings frozen at 10-24, closed roles still have live apply links, site claims "refreshed daily", and the Nov 1 `pay-index.yml` run will publish 10-24 data as November.
   - Move the fetch off GitHub-hosted runners (Vercel Cron, self-hosted runner, or local launchd job).
   - Make `pay_index.py` (and the refresh) fail loudly if the snapshot is >36h old.
   - *Effort: 2–4h. Deadline: before Nov 1.* — findings/geo.md

## High — within 1 week

2. **JobPosting `applicantLocationRequirements` contradicts page text.** Every job lists the same 58 countries, including "US-based only" roles (`web/app/jobs/[slug]/page.tsx:67-69`). Parse countries from each job's location text; omit when unknown. Risks Google Jobs eligibility. — findings/schema.md
3. **`validThrough` = datePosted + 60 days.** Five active jobs already show a past `validThrough`; `FALLBACK_DATE` in `web/lib/job-quality.ts` changes every build. Derive from `last_verified`. — findings/technical.md
4. **Job pages are mostly micro1's text verbatim (89% of indexable pages); 61 jobs are near-duplicates (8 identical pairs).** Add 100+ words of original context per job (pay vs field median, accepted countries, last-checked date, link to field guide / Pay Index); group near-identical jobs to one canonical; keep project suffixes in titles (e.g. "Software Engineering Specialist – Executive Presentation Review"). — findings/content.md
5. **No named human author / weak entity.** Add a named editor (Person schema) to blog, /micro1 and Dataset; add `founder`, `sameAs` (LinkedIn/X/GitHub) and `contactPoint` to Organization; put the brand name in the homepage title. — findings/content.md, findings/geo.md
6. **No privacy policy, terms or contact** while forms collect emails. Add /privacy, /terms, contact email; link in footer and beside forms (`web/components/site-footer.tsx:12-20`). — findings/content.md
7. **No comparison/alternatives pages** (every "outlier ai alternatives" result is one). Build `/alternatives/outlier`, `/compare/micro1-vs-mercor`, `/compare/micro1-vs-outlier` using your micro1 pay data. — findings/sxo.md, findings/cluster.md
8. **/micro1 doesn't serve "is micro1 legit" intent.** Add Deel/payout schedule, complaints addressed, sources for "venture-backed", on-page referral disclosure, Article schema + author; or retitle away from "Review". — findings/sxo.md
9. **Zero third-party link footprint.** Do backlink_plan.md quick wins 1–4 (Zenodo DOI, Hugging Face, Kaggle, Candyfloss — ~1h total); put the DOI in the Dataset schema. — findings/backlinks.md

## Medium — within 1 month

10. **Unknown job slugs 308 → `/`** (`web/app/jobs/[slug]/page.tsx` ~L38). Use `notFound()` for unknown slugs; keep redirects only for known closed jobs. — technical.md
11. **Cannibalization fixes:** retitle `/ai-training-jobs/medicine` to "healthcare professionals" (let /physicians own doctors); retitle `/blog/ai-training-jobs-for-lawyers` → "How to Get AI Training Work as a Lawyer"; split /micro1 intents (new `/micro1/interview`); make `/pay-index` self-canonical hub with dated editions linking back. — cluster.md
12. **Thin/overlapping category pages:** apply the 5-role minimum to field pages (cybersecurity, humanities, retail-hospitality, education have 1–2); merge/noindex /chemists (100% overlap with /applied-engineering) and /other; write 150–300 words of unique copy per field. — content.md
13. **Median bug** for even-length lists ("$28–$70/hr, median $70/hr" on retail) — `web/app/ai-training-jobs/[field]/page.tsx:34`, `web/lib/training-jobs.ts:101`. Also baseSalary `minValue` falls back to `hourly_max`. — content.md, schema.md
14. **JobPosting `description` is raw markdown** (`page.tsx:61`) — render to HTML. — schema.md
15. **Sitemap lastmod:** 339/343 identical. Track per-job `last_changed` (content hash); give blog posts their own dates; add lastmod to /about and /sell-company-data. — sitemap.md
16. **llms.txt is static and stale** (Law 49 vs 50); three pre-pivot scripts (`regenerate_llms_txt.py`, `web/scripts/generate-llms-txt.py`, `update_and_deploy.sh`) would overwrite it with old "AI Engineering" content. Generate as a route from live data; delete those scripts. — geo.md
17. **Internal linking:** link field pages → matching blog post, Pay Index row, /micro1; job pages → field guide and Pay Index. See link matrix in cluster.md.
18. **Mobile nav missing** (Fields/Top paying/Guides unreachable at 390px); 156/190 homepage tap targets < 44px. — visual.md
19. **Homepage weight:** 1,240 DOM nodes, 172KB RSC payload (`web/app/page.tsx:116-125`). Cap fields shown or use `content-visibility:auto`. — performance.md
20. **Security headers:** add CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors in `web/next.config.ts`; add `/.well-known/security.txt`. — technical.md
21. **Blog depth:** posts are 432–780 words with no outbound sources; expand and cite. Add `/blog/get-paid-to-train-ai`. — content.md, cluster.md

## Low — backlog

- Titles >60 chars (22/29 sampled); H1s include subtitle (`web/components/training-ui.tsx:18-24`).
- Remove `priority`/`changefreq` from sitemap; add or noindex `/newsletter` (copy still says "AI engineering jobs").
- `#` permalink and "small sample" badges leak into extracted table text.
- Generalist pay $36 on /micro1 vs $33 on /pay-index — reconcile.
- Dedupe Geist font instances (`web/app/layout.tsx:6-15`); `preload:false` for Geist Mono.
- Content-Signal line in robots.txt once you decide a training stance.
- 11px footer text; blog table scroll hint on mobile.
- Regenerate `keywords.csv` / `plan.csv` (still from the pre-pivot coding-agents site).

## Monitoring

- Add a Google API key (`~/.config/claude-seo/google-api.json`) and re-run `/seo google` + Lighthouse for real CWV and the Agentic Browsing score (PSI quota was exhausted today).
- Add Moz / Bing Webmaster keys for backlink tracking; re-run `/seo backlinks` in 4–6 weeks.
- Run `/seo drift baseline https://www.artificialjobs.dev` now, then `drift compare` after each round of fixes.
