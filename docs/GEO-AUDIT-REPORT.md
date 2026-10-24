# GEO Audit Report: Artificial Jobs

**Audit Date:** 2026-10-24
**URL:** https://www.artificialjobs.dev
**Business Type:** Publisher / directory (job board for referral listings)
**Pages Analyzed:** 4 analyzed in depth (home, `/ai-training-jobs/law`, `/jobs/lawyer-micro1-5878`, `/sell-company-data`) plus sitemap (50 URLs), robots.txt, and llms.txt
**Method:** [geo-seo-claude](https://github.com/zubair-trabzada/geo-seo-claude) `geo-audit` workflow and its Python scripts (`fetch_page.py`, `citability_scorer.py`, `llmstxt_generator.py`, `brand_scanner.py`), with the repo source checked for each finding.

---

## Executive Summary

**Overall GEO Score: 38/100 (Critical)**

The technical side is solid: pages are server-rendered, every AI crawler is allowed, the sitemap is valid, llms.txt is well-formed, and FAQPage schema is present. Most of the low score comes from things the code can't fix. The brand is new and has no third-party mentions anywhere (Brand + Platform make up 30% of the score). The rest is on-site and fixable: content is laid out as cards and data, not quotable prose; there's no About/Organization identity; and only 17 of 302 job pages output JobPosting schema.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 40/100 | 25% | 10.0 |
| Brand Authority | 15/100 | 20% | 3.0 |
| Content E-E-A-T | 35/100 | 20% | 7.0 |
| Technical GEO | 80/100 | 15% | 12.0 |
| Schema & Structured Data | 35/100 | 10% | 3.5 |
| Platform Optimization | 20/100 | 10% | 2.0 |
| **Overall GEO Score** | | | **38/100** |

---

## Critical Issues (Fix Immediately)

- **Brand not recognized as an entity.** No mentions found on Reddit, YouTube, Wikipedia, LinkedIn, or other sites. AI engines have nothing third-party to tie "Artificial Jobs" to. This is off-site work (see 30-Day plan).

## High Priority Issues

- **JobPosting schema is suppressed on 285 of 302 job pages.** `web/app/jobs/[slug]/page.tsx` outputs JSON-LD only when `job.is_remote`, and 285 jobs have `location: "Not specified"`. The guard is correct (Google rejects postings with no location and no remote flag). The fix is upstream: check whether micro1 roles are remote by default. If they are, set `is_remote` in `scripts/fetch_micro1_jobs.py` and add `applicantLocationRequirements`. Don't mark roles remote without confirming.
- **No Organization / WebSite schema anywhere.** The homepage only has FAQPage. Add a sitewide `Organization` (name, url, logo, `sameAs` once social profiles exist) and `WebSite` to the root layout.
- **No About page.** `/about` returns 404, and there's no author or operator identity anywhere. For a site that earns referral fees, a short "who runs this, how listings are sourced, how we get paid" page is the biggest E-E-A-T gain available.

## Medium Priority Issues

- **Low citability (average ~40/100, zero A/B passages on any page).** Content is mostly cards ("High demand · 5 openings · up to $400/hr"), which AI engines can't quote as a standalone answer. No passage is in the scorer's best range of 134–167 words.
- **Field pages have almost no prose.** `/ai-training-jobs/law` has 1,343 words, but they're mostly listing cards (citability 35.5). Add a 150-word intro answering "How much do AI training jobs for lawyers pay?" using the live stats you already calculate (median and top rate, role count).
- **Job pages are thin (~309 words).** They're mostly the micro1 description. Add a templated, data-backed summary such as "This role pays $50–$80/hr, below/above the Law median of $X/hr across N open roles".
- **No BreadcrumbList / ItemList schema.** Job pages already render a breadcrumb nav, so marking it up is a small change. Field pages could output `ItemList` for their listings.

## Low Priority Issues

- **Security headers missing:** CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (HSTS is present). These can be added via `headers()` in `next.config`.
- **OG image is SVG** (`/og.svg`). Several platforms (X, LinkedIn, Slack) don't render SVG og:images, so use a 1200×630 PNG.
- **No images on the homepage**, so there's no alt-text surface. Not a real problem.

---

## Category Deep Dives

### AI Citability (40/100)
Scores by page: home 42.2, Law field page 35.5, job page 40.7, sell-company-data 39.8. The best block is the "Specialist" card (55, C). The worst is the referral disclosure (32, F). The cards score 0 on "uniqueness signals" and ~2/10 on structure because they're number fragments, not sentences. The homepage FAQ answers are the most quotable text on the site. More of that, with real stats, is the fix. Example rewrite for each field block:

> "AI training jobs for lawyers currently pay up to $400/hr. Of 49 open Law roles on micro1, the median top rate is $X/hr, and most are flexible hourly contracts reviewing legal reasoning in AI model outputs."

### Brand Authority (15/100)
No YouTube channel or mentions, no Reddit discussion, no Wikipedia entry (not expected), no LinkedIn page found. The domain is new and the site pivoted today, so this is expected. It's still the biggest weighted gap.

### Content E-E-A-T (35/100)
Positives: a clear referral disclosure on every page, source attribution ("via micro1", "per micro1"), and daily refresh with "verified" timestamps. Negatives: no About page, no named operator, no methodology page ("how we rank by pay"), no editorial content since the engineering-board articles were retired.

### Technical GEO (80/100)
- robots.txt: `Allow: /` for all, so all 14 AI crawlers checked are allowed
- llms.txt: valid, 2 sections, 21 links, includes per-field role counts
- SSR: yes (Next.js prerender, Vercel cache HIT)
- Canonicals: correct, apex → www via 308
- Sitemap: 50+ URLs, includes field and job pages
- Missing: most security headers (see Low)

### Schema & Structured Data (35/100)
- Present: FAQPage (home, field pages, sell-company-data), JobPosting (17 remote jobs only)
- Missing: Organization, WebSite, BreadcrumbList, ItemList, JobPosting on 285 pages

### Platform Optimization (20/100)
- Google AI Overviews / Google for Jobs: blocked mostly by the JobPosting gap
- ChatGPT / Perplexity: crawlable, but no quotable stat passages and no third-party corroboration
- Reddit: where people actually ask "is micro1 legit / how much does AI training pay". This is the best channel for this niche

---

## Quick Wins (Implement This Week)

1. **Add Organization + WebSite JSON-LD to the root layout.** About 20 lines, and it's sitewide.
2. **Confirm micro1 remote status, then turn on JobPosting for all 302 jobs.** This could put the site in Google for Jobs.
3. **Ship `/about`**: who runs it, how listings are sourced, the referral model. Link it from the footer and llms.txt.
4. **Add a 150-word stat-backed intro to each field page**, generated from the data you already compute.
5. **Add BreadcrumbList JSON-LD to job pages**, matching the existing breadcrumb nav.

## 30-Day Action Plan

### Week 1: Identity & schema
- [ ] Organization + WebSite schema
- [ ] /about page + methodology section
- [ ] JobPosting for all roles (after confirming remote status)
- [ ] BreadcrumbList on job pages

### Week 2: Citable content
- [ ] Stat intros on all 20 field pages
- [ ] "How much do AI training jobs pay? (October 2026)" data page, using live medians by field
- [ ] Templated pay comparison line on each job page

### Week 3: Off-site presence
- [ ] LinkedIn company page + X account, added to Organization `sameAs`
- [ ] Helpful (disclosed) answers in r/WFHJobs, r/LawyerAdvice-type threads on "AI training jobs" (see the `reddit-opportunity-research` skill)
- [ ] Submit to job-board and remote-work directories

### Week 4: Polish & re-measure
- [ ] Security headers, PNG og:image
- [ ] Re-run `/geo audit` and compare with this baseline

---

## Appendix: Pages Analyzed

| URL | Title | Words | Schema | Citability | Issues |
|---|---|---|---|---|---|
| / | 302 AI Training Jobs for Experts — Up to $400/hr | 1,960 | FAQPage | 42.2 | 3 |
| /ai-training-jobs/law | 49 Best AI Training Jobs for Lawyers (October 2026) | 1,343 | FAQPage | 35.5 | 2 |
| /jobs/lawyer-micro1-5878 | Lawyer — AI Training Job, $50–$80/hr | 309 | none | 40.7 | 3 |
| /sell-company-data | Sell Your Company Data to AI Labs | 574 | FAQPage | 39.8 | 1 |

*Scores for Brand, E-E-A-T, Schema, and Platform are judgment calls based on the tool's rubric. Citability and Technical come from its scripts.*
