# artificialjobs.dev — Full SEO Audit

- **Audited:** 2026-10-27 (claude-seo v2.5.0, 11 specialist agents)
- **URL:** https://www.artificialjobs.dev (apex 308 → www)
- **Business type:** Niche job board / affiliate publisher — AI-training contract roles (micro1 referral listings), with Pay Index dataset, guides and a "sell company data" lead-gen section
- **Scope:** 343 sitemap URLs (307 job pages, 25 field/credential pages, 4 blog posts, pay index, /micro1, /sell-company-data ×2, /about); ~35–40 URLs sampled per specialist, all 343 HEAD-checked
- **Not available this run:** Google APIs (no key; public PSI quota exhausted, so CWV are estimates), Moz/Bing/Ahrefs backlink indexes (Ahrefs out of units), drift baseline

## SEO Health Score: 72 / 100

| Category | Weight | Score | Source |
|---|---|---|---|
| Technical SEO | 22% | 84 | findings/technical.md |
| Content Quality | 23% | 60 | findings/content.md |
| On-Page SEO | 20% | 68 | findings/content.md |
| Schema / Structured Data | 10% | 72 | findings/schema.md |
| Performance (CWV) | 10% | 88 *(estimated, not measured)* | findings/performance.md |
| AI Search Readiness | 10% | 62 | findings/geo.md, findings/agentic.md |
| Images | 5% | 88 | findings/visual.md |

Supporting (unweighted): SXO gap scores — homepage 50, /ai-training-jobs/law 53, /micro1 53, /pay-index 68 (findings/sxo.md). Backlinks — insufficient data; no verifiable third-party links (findings/backlinks.md). Agent readiness heuristic — 100/100 (findings/agentic.md).

> The score doesn't capture the most urgent problem: the job data pipeline has been down for three days (Critical #1).

## Executive Summary

The technical foundation is solid: everything is server-rendered and edge-cached, canonicals and redirects are clean, all 343 sitemap URLs return 200, AI crawlers are not blocked, and JobPosting/Dataset schema is in place. The Pay Index is the site's strongest, most citable asset.

The weaknesses are data freshness, content originality and trust:

### Top 5 critical / high issues
1. **Daily micro1 refresh failing since 10-25** (403 from micro1 to GitHub runner IPs) — stale listings while the site claims daily refresh; Nov 1 Pay Index would publish stale data. *Verified via `gh run list`.*
2. **JobPosting location schema says 58 countries for every job**, contradicting "US-only" page text — structured-data policy / Google Jobs risk.
3. **Job pages are ~all micro1 boilerplate**, 20% near-duplicate; `validThrough` computed as +60 days, already in the past for five live jobs.
4. **No named people, privacy policy, terms or contact** — weak E-E-A-T and trust, while forms collect emails.
5. **Scope/intent gap:** micro1-only inventory and no comparison/alternatives pages, while competitors (aitrainer.work: 13 platforms, filters, alerts) win those SERPs.

### Top 5 quick wins
1. Add `founder`, `sameAs`, `contactPoint` to Organization and brand name to homepage title (~1h).
2. Zenodo DOI + Hugging Face + Kaggle + Candyfloss listings for the Pay Index (~1h, first real backlinks).
3. Make `/pay-index` self-canonical (~15m).
4. Fix the even-length median bug and baseSalary `minValue` fallback (~30m).
5. Keep project suffixes in job titles ("… – Executive Presentation Review") — fixes the confusing duplicate-PowerPoint rows on the homepage (~30m).

## Technical SEO — 84
**Works:** 35/35 sampled URLs 200 in 0.15–0.8s; prerendered HTML; one H1, self-canonical, unique title/description per page; clean apex/https/trailing-slash redirects; case/query variants canonicalize; real 404s with noindex; IndexNow live; robots.txt allows all and declares sitemap.

**Issues:** only HSTS among security headers (Medium); unknown job slugs 308 to homepage — soft-404 risk (Medium); `validThrough` = datePosted+60d with build-time fallback (Medium); raw markdown in JobPosting description (Medium); near-duplicate job titles and overlapping hubs (Low).

**Sitemap:** valid, 343 URLs all 200, no expired jobs, nav covered. 339/343 identical `lastmod` (Medium); /about and /sell-company-data lack lastmod; `priority`/`changefreq` noise; /newsletter indexable but unlisted.

## Content Quality — 60
E-E-A-T 53 (Experience 40, Expertise 50, Authoritativeness 45, Trust 70); AI citation readiness 80.

**Works:** clear referral disclosure; original pay data with Dataset/CSV/CC BY 4.0; answer-first page openings; /sell-company-data/what-is-it-worth is well-sourced.

**Issues:** job pages reproduce micro1 text (High); 61 jobs near-duplicate, 8 identical pairs (High); no named author anywhere, /micro1 "review" has no first-hand evidence (High); no privacy/terms/contact (High); field pages indexed with 1–2 roles and templated copy (Medium); blog posts 432–780 words without outbound sources (Medium); median bug (Medium).

## On-Page SEO — 68
**Works:** titles follow the winning SERP formula (count + month + top pay); unique metadata; clean heading hierarchy.

**Issues:** 22/29 titles >60 chars; H1s 90–125 chars (subtitle inside H1); micro1 headings ("Key Responsibilities:") on job pages; field pages don't link to blog/Pay Index//micro1; blog only reachable via footer; job meta description mislabels 30 salaried roles as "AI training work".

## Schema & Structured Data — 72
**Works:** server-rendered valid JSON-LD; JobPosting with datePosted, validThrough, hiringOrganization, identifier, directApply, TELECOMMUTE, hourly baseSalary; sitewide Organization+WebSite @graph; BreadcrumbList; strong Dataset on /pay-index.

**Issues:** applicantLocationRequirements identical 58 countries (High); markdown in description (Medium); Article author is Organization only, no image (Medium); baseSalary minValue fallback (Medium); no AboutPage/CollectionPage/ItemList (Low); FAQPage is harmless but earns no rich results (Info). Ready-to-use JSON-LD in findings/schema.md.

## Performance — 88 (estimated)
Lab CWV could not be measured (PSI 429). Evidence: TTFB 0.13–0.20s from edge cache; homepage 22KB brotli / 295KB raw; ~200KB JS; no images; only Vercel Analytics third-party. Likely good LCP and ~0 CLS; INP risk from homepage's 1,240 elements / 172KB RSC payload (Medium). Possible shared-bundle bloat and duplicate Geist instances (Low).

## Images — 88
No content images at all, so no alt/format/size issues; OG image 1200×630 with alt. Opportunity: a chart per Pay Index edition as share image and multi-modal citation asset.

## Visual / Mobile
H1 and primary CTAs above the fold on all pages at 1440 and 390px; no horizontal overflow. **No mobile nav** (Medium); small tap targets sitewide (Medium); 11px footer text, long H1 wrapping, disclosure banner taking ~130px above the fold (Low). Screenshots in `screenshots/`.

## AI Search Readiness — 62
Citability 72 · Structure 78 · Multi-modal 45 · Authority 35 · Technical 75. Platforms: AI Overviews 60, ChatGPT 55, Perplexity 58, Copilot 62.

**Works:** all major AI crawler UAs get 200 identical HTML; SSR; Pay Index has standalone answer, citation block, CC BY licence, CORS CSV; RSS + IndexNow. Agent readiness: apply links are plain named `<a>` tags; no bot challenges; llms.txt valid.

**Issues:** stale data (Critical); no Person author, thin entity (no sameAs, brand missing from title) (High); no off-site brand mentions (High); static stale llms.txt plus legacy scripts that would overwrite it with pre-pivot content (Medium); /pay-index canonical moves monthly (Medium); /sell-company-data lacks answer-first opening and linked source (Medium). Optional: Content-Signal, Markdown delivery, /.well-known discovery files.

## Search Experience (SXO)
Page types match intent, but scope doesn't: competitors aggregate 10+ platforms with filters and alerts. Missing page types: comparisons/alternatives (Critical gap — 9/9 results), micro1 interview guide, "is micro1 legit" trust content. Weakest persona: Platform Shopper (41–43); Trust is the lowest dimension (9–12/25) for every persona.

## Content Architecture (clusters)
Cannibalization: /medicine vs /physicians, /law vs lawyers blog post, /pay-index vs pay blog post, /micro1 serving three disjoint intents, monthly Pay Index editions vs hub. Gaps: /micro1/interview, micro1-vs-mercor, micro1-vs-outlier, get-paid-to-train-ai, unpublished profession pages (nurses, teachers, accountants, dentists, mathematicians). Full hub-and-spoke plan and internal link matrix in findings/cluster.md.

## Backlinks
No numeric score (insufficient data). Domain absent from Common Crawl's latest host graph; none of the backlink_plan.md targets are live yet. Pay Index `doi` is null.

## Limitations
- CWV and Lighthouse Agentic score unmeasured (no Google API key; PSI quota exhausted).
- Backlink data limited to Common Crawl + spot checks; Ahrefs MCP out of API units.
- Job pages sampled (~15–20 of 307), plus full near-duplicate analysis on `web/data/jobs.json`.
- SERP analysis via web search, not a clean Google top 10; no search volumes.

See [ACTION-PLAN.md](ACTION-PLAN.md) for the prioritized fix list.
