# AEO/GEO Audit — www.artificialjobs.dev

**Audited:** 2026-10-24 · **Pages crawled:** 20

## Score

| | Score | |
|---|---|---|
| Foundational (16 checks) | 90/100 | |
| Intelligence (6 dimensions) | 53/100 | |
| **Final** | **72/100** | **Grade: B-** |

Technically clean and fully open to AI crawlers, but the site is mostly listings: an AI engine can quote its pay numbers, yet there is little long-form, dated, well-structured prose for it to cite.

## Foundational Checks

| | Check | Detail |
|---|---|---|
| ✗ | Content structure (heading hierarchy) | 3/20 pages pass. Field pages render no H2/H3 at all (section labels are styled `<p>`s, role titles are links). |
| ✗ | RSS/Atom feed | None found. |
| ✓ | Title | 20/20 |
| ✓ | Meta description | 20/20 |
| ✓ | Canonical | 20/20 |
| ✓ | Single H1 | 20/20 |
| ✓ | Structured data present | 20/20 (Organization, WebSite, FAQPage, BreadcrumbList, JobPosting) |
| ✓ | Schema types identified | 20/20 |
| ✓ | Open Graph | 20/20 |
| ✓ | Internal linking | 20/20 |
| ✓ | Image alt coverage | 20/20 |
| ✓ | Content depth (250+ words) | 20/20 |
| ✓ | Indexable | 20/20 |
| ✓ | AI meta tags | 20/20 |
| ✓ | llms.txt | Valid (2,995 chars) |
| ✓ | AI bot access | No AI crawlers blocked |

## Intelligence Evaluation

**Answer Readiness — 3/5 (60).** /micro1 opens with a direct "short answer" on legitimacy and pay, and field pages now lead with a factual summary paragraph; FAQ blocks exist sitewide. The homepage has no answer prose, and questions like "are AI training jobs legit" or "how much do they pay" have no dedicated page. *Key finding: answers exist on new pages; homepage and how-to questions uncovered.*

**Quotability — 3/5 (60).** The field summary paragraphs ("As of October 2026, there are 50 open AI training jobs for lawyers… median of $170/hr") and the /micro1 pay-by-field table are clean, self-contained citations. Most other text is listing fragments ("Law 50 roles to $400/hr") that don't stand alone. *Key finding: one great paragraph per page; the rest is fragments.*

**Evidence Density — 3/5 (60).** Dense, specific, verifiable numbers on every page (counts, rates, medians, dates). Almost no named external sources or in-text citations, and no author attribution. *Key finding: strong first-party data, near-zero external citations.*

**Content Depth — 2/5 (40).** Pages pass the word-count bar on the strength of role listings, not explanation. There is no long-form guide on what the work involves, how to qualify, pay by profession, or how data sales work. *Key finding: no 1,500+ word guides anywhere on the site.*

**Freshness — 3/5 (60).** "Updated October 2026" is visible and data refreshes daily, but no page exposes `datePublished`/`dateModified` in markup and there is no feed. *Key finding: fresh data, but machines can't see the dates.*

**Structural Clarity — 2/5 (40).** Single H1s throughout, but the H1s contain the muted continuation sentence, and field pages have an empty heading outline. /micro1 has three H2s and no H3s. *Key finding: field pages have no heading outline for chunking.*

Intelligence score = avg(3, 3, 3, 2, 3, 2) × 20 = 53.

## Prioritized Fixes

1. **Real heading outline on every template** — render section labels as `<h2>` and role titles as `<h3>`; keep the H1 to the lead sentence. High impact, low effort. Fixes the failing check and Structural Clarity.
2. **Blog of long-form, data-backed guides** — "How much AI training jobs pay", "AI training jobs for lawyers", "AI training jobs with no experience", "How to sell company data to AI labs". High impact, medium effort. Lifts Depth, Answer Readiness and Quotability.
3. **RSS feed + Article schema with datePublished/dateModified** — Medium impact, low effort. Fixes the failing check and Freshness.
4. **Cite primary sources in prose** (micro1's own pages, Mercor's referral page, press on funding). Medium impact, low effort.

## Weakest Pages

95% each: /about, /ai-training-jobs/law, /ai-training-jobs/other, /ai-training-jobs/generalist, /ai-training-jobs/language-audio (all fail only the heading-hierarchy check).

## Recommendation

The foundation is done; the gap is citable prose. Fix headings and ship the blog with dated Article markup and a feed, then re-run this audit — fixes 1–3 should move the grade into the B+/A- range.

---

# Re-audit after fixes — 2026-10-24

Deployed in cbc85cd (blog, RSS, heading outline, Article dates). Raw output in `aeo-audit-after.json`.

| | Before | After |
|---|---|---|
| Foundational | 90 | **100** (16/16 checks pass) |
| Intelligence | 53 | **73** |
| **Final** | **72 (B-)** | **87 (A-)** |

| Dimension | Before | After | Why |
|---|---|---|---|
| Answer Readiness | 3 | 4 | Every guide opens with a direct, dated answer; FAQ blocks with Q-style H3s. Homepage still has no answer prose. |
| Quotability | 3 | 4 | Definition-first opening paragraphs, by-field tables and FAQ answers all stand alone. |
| Evidence Density | 3 | 3 | Numbers everywhere, but still few named external sources and no named human author. |
| Content Depth | 2 | 3 | Four guides with sub-topics, but 500–700 words each, well short of 2,000+. |
| Freshness | 3 | 4 | datePublished/dateModified in Article markup, visible dates, RSS feed. |
| Structural Clarity | 2 | 4 | Clean H1→H2→H3 outline on every template. |

## Next fixes
1. **Lengthen the guides to 1,500–2,500 words** with worked examples and more sub-sections (Depth 3→4+).
2. **Cite primary sources inline** (micro1/Mercor program pages, funding press) and add a named editor/author with an author page (Evidence 3→4).
3. **Answer prose on the homepage** — a 50-word "what AI training jobs are and what they pay" paragraph above the fold.
4. **More question-shaped pages**: micro1 vs Mercor/Outlier comparisons, "is AI training legit", rlhf/ai-tutor synonym hubs.
