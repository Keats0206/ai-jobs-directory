# Content Quality and On-Page SEO: artificialjobs.dev

Audit date: 2026-10-27. Sample: 29 live pages fetched at 1 req/s (`render_page.py --mode never`; none are SPA shells). The sample covers the homepage, /about, /micro1, /pay-index/2026-10, /blog plus all 4 posts, /sell-company-data plus /what-is-it-worth, 7 of 25 /ai-training-jobs/* pages, and 11 job pages (every 30th URL in the list). On top of the sample, the full job dataset (`web/data/jobs.json`, 307 active roles) was checked for near-duplicates and thin descriptions. Source code was read to give file:line references.

Note: /blog lists **4** posts, not 5. The fifth "article" is /sell-company-data/what-is-it-worth, which uses Article schema but sits outside /blog.

## Scores

| Score | Value |
|---|---|
| **Content Quality** | **60 / 100** |
| **On-Page SEO** | **68 / 100** |
| E-E-A-T (weighted, internal model) | 53 / 100 |
| AI citation readiness | 80 / 100 |

### E-E-A-T breakdown

| Factor | Weight | Score | Basis |
|---|---|---|---|
| Experience | 20% | 40 | No first-hand signals anywhere. The /micro1 "review" never shows that anyone applied or took the Zara interview. Pay data is original aggregation, which helps. |
| Expertise | 25% | 50 | Pay analysis is accurate and well sourced, but no named people have any credentials. Every byline is "By Artificial Jobs" (Organization). |
| Authoritativeness | 25% | 45 | The deals table cites Reuters, Decrypt, Forbes and MIT Tech Review. The Pay Index is CC BY 4.0 with a Dataset schema. The Organization has no `sameAs` and no external profiles. |
| Trustworthiness | 30% | 70 | Referral disclosure is clear and repeated (good), the method on /about is clear, and HTTPS/HSTS is on. There is no privacy policy, no terms and no contact method, even though two forms collect email addresses. |

## What works

- **Referral transparency is unusually good.** `REFERRAL_DISCLOSURE` (`web/lib/training-jobs.ts:106-107`) appears as a bar on every job, category and blog page. /about explains that ranking is by pay and not by fee (`web/app/about/page.tsx:74`).
- **Original, quotable data.** The Pay Index (Dataset + DataDownload schema, CSV, CC BY 4.0, citation block), /micro1 pay-by-field table, and law skill-frequency table ("Contract drafting: 11 of 50") are original facts that AI engines can cite.
- **Answer-first summaries.** Category pages open with a stat-backed paragraph built for extraction (`web/app/ai-training-jobs/[field]/page.tsx:41-49`), and each blog post opens with a direct answer.
- **/sell-company-data/what-is-it-worth** is the strongest E-E-A-T page. Every deal row cites a named outlet and month, the estimator's method is explained, and a privacy/legal-risk section is included.
- **Clean technical on-page.** Every sampled page returns 200, has a self-referencing canonical, exactly one H1, unique titles and descriptions, and valid JSON-LD (JobPosting, BreadcrumbList, FAQPage, Article, Dataset).
- **Job bodies are not duplicated by the template.** Across the 11 sampled job pages, mean 5-gram Jaccard similarity is 0.02 (max 0.22). Each description is 125-845 words (median 303), and none are under 100.
- **Templated-metadata heuristic:** `metadata_template.py` over the 29 pairs gave `site_risk: low`, `templated_ratio: 0.0`, and no `shared_cta_phrases`. (A manual caveat is in finding M2.)

## Findings

### HIGH

**H1. Job-page main content is micro1's text copied word for word, with little added value.**
Evidence: `<JobDescription markdown={job.description} />` (`web/app/jobs/[slug]/page.tsx:128`) renders the description as scraped from micro1 (`/about`: "We pull the full description ... from each role's own micro1 job page"). The only original content on a job page is the pay line, a 5-row "At a glance" box, skill chips and 5 related roles. These 307 URLs are 89% of the site's indexable pages, and their main content also exists on micro1.ai, which is the canonical source. Under the QRG this is "copied content with little added value", and Google will tend to rank micro1's own page instead.
Fix: add a block to each job page built from data the site already has, e.g. "How this pays vs other {field} roles: Nth of M, field median $X/hr" (data in `getTrainingFields()`), "Countries accepted", "Similar roles at higher pay", "Last verified {date}", and a 2-3 sentence "What the work looks like" per field (write it by hand once per field, not per job). Aim for roughly 100+ words of original text above the scraped description.

**H2. 61 job pages (20%) sit in near-duplicate clusters, including 5 identical title groups.**
Evidence: a 5-gram Jaccard similarity check on `web/data/jobs.json` found 67 pairs at ≥0.70 similarity, covering 61 jobs. Eight pairs are 1.00 identical, for example `us-licensed-physician-micro1-5860` = `medical-specialist-micro1-6118`, `hospitalist-physician-micro1-5943` = `hospitalist-physician-micro1-5986`, and `law-review-cite-checker-micro1-5898` = `legal-citation-specialist-law-students-micro1-6106` = `bluebook-citation-specialist-...-6151`. Duplicate titles: "Lawyer" ×4, "Hospitalist Physician", "Japanese Language Expert", "Korean Language Expert" and "Software Engineer" ×2 each.
Fix: in the ingest step (`scripts/job_quality_lib.py` / `scripts/refresh_jobs.py`), group jobs whose description similarity is ≥0.9. Keep one canonical URL per group: either list the variants on that page, or point `alternates.canonical` at the highest-paying sibling. Make titles unique by appending the distinguishing attribute (practice area, country, language).

**H3. No named people anywhere; the /micro1 "review" has no evidence of first-hand use.**
Evidence: Article schema `author: { '@type': 'Organization', name: 'Artificial Jobs' }` (`web/app/blog/[slug]/page.tsx:52`), the visible byline "By Artificial Jobs" (`:82`), and no `<meta name="author">` on any of the 29 pages. /about names only "Keating Holdings" (`web/app/about/page.tsx:53`). /micro1 is titled "micro1 Review ... Is It Legit?" and states "micro1 is a legitimate, venture-backed company" without a source, and gives no sign that the author applied, interviewed or got paid. The QRG treats reviews without first-hand experience as low quality. Pay and legitimacy are also YMYL-adjacent (financial decisions, scam risk).
Fix: add a named editor (Person schema with `name`, `jobTitle`, `sameAs` LinkedIn) to /about and every Article/Review byline. On /micro1, add a "How we tested" section (who applied, when, interview length, what Zara asked, payout timing) with screenshots, or rename the page "micro1 pay and hiring guide" and drop "Review". Cite funding claims (e.g. a link to the funding announcement).

**H4. No privacy policy, terms or contact method, while two forms collect email addresses.**
Evidence: the routes in `web/app/` include `newsletter` and `api/valuation-lead`, but there is no `/privacy`, `/terms` or `/contact`. The footer (`web/components/site-footer.tsx:12-20`) has no contact link, and no file in `web/app` or `web/components` contains `mailto`. /sell-company-data asks founders for company details and email, and advises them on GDPR, yet the site has no privacy policy of its own. Trust is the top-weighted E-E-A-T factor.
Fix: add `/privacy` (what the valuation-lead and newsletter forms store, Resend as processor, retention, deletion request), `/terms`, and a contact email. Link all three in the footer, add `contactPoint` to the Organization JSON-LD (`web/app/layout.tsx:43-52`), and link the privacy policy beside each form's consent checkbox.

### MEDIUM

**M1. Thin and overlapping category pages.**
Evidence: four field pages are indexed with ≤2 roles: cybersecurity (1), humanities (2), retail-hospitality (2, 212 words) and education (2). Field pages have no minimum count, while collections require `MIN_COLLECTION_ROLES = 5` (`web/lib/training-jobs.ts:82`). Collections overlap heavily with fields: /chemists has 6 roles and 100% of them are also on /applied-engineering, /physicists overlaps 83% with /sciences-research, /physicians 71% with /medicine, and /biologists 75% with /applied-engineering. The editorial text is the same template on all 25 pages: six variable-filled sentences plus two FAQs (`[field]/page.tsx:42-71`), and the second FAQ answer is word for word identical on every page.
Fix: apply the 5-role floor to field pages as well (noindex or merge below it, e.g. fold cybersecurity/humanities/retail/education into a "More fields" page). For each surviving page, write 150-300 words of unique copy per field (typical tasks, credentials asked for, example prompts, pay drivers), stored in a `FIELD_COPY` map next to `AUDIENCE` (`web/lib/training-jobs.ts:4`). Replace the shared FAQ #2 with field-specific questions.

**M2. Templated job meta descriptions are inaccurate for 30 salaried roles.**
Evidence: `web/app/jobs/[slug]/page.tsx:28` produces "...paid AI training work for {field} professionals at {pay}. Help AI labs evaluate and improve their models. Apply via micro1." on all 307 pages. The heuristic tool did not flag this because the title is not echoed, but the closing two sentences are the same on 100% of job pages. They are also untrue for salaried in-house micro1 jobs, e.g. "AI/ML Engineer, Internal Platforms: paid AI training work ... at $130k–$160k/yr", and `recruitment-ops-manager-micro1-5861`. 30 roles are salaried and 7 have no pay. The field label also produces odd results: "Generalist — U.S. Tax Workflow Evaluation: ... for Finance professionals", and mechanical-engineering and aerodynamics PhD roles are filed under "Specialist".
Fix: branch on `job.salary_max && !job.hourly_max` and on non-training titles, so those pages say "Full-time role at micro1, $X–$Yk/yr". Replace the fixed closing sentence with a job-specific fact (top skill, openings, high demand, countries).

**M3. Blog posts are well below the depth floor for a guide.**
Evidence: the 4 posts are 590, 522, 432 and 443 words (floor 1,500 for blog posts as a coverage benchmark, not a ranking rule). "AI Training Jobs for Lawyers" is mostly two tables and a 24-item list of job titles, and "Who qualifies" is 3 sentences. /about is 327 words.
Fix: expand each post with original material: sample task walkthroughs (an anonymised example prompt and grading rubric), interview prep, tax and contractor notes (1099/W-8BEN), hours-availability reality, and quotes from people doing the work. These add Experience signals that templated data cannot.

**M4. Wrong median on quotable stats.**
Evidence: `rates[Math.floor(rates.length / 2)]` (`web/app/ai-training-jobs/[field]/page.tsx:34`, `web/lib/training-jobs.ts:101`) takes the upper middle value for even-length arrays. Live result on /ai-training-jobs/retail-hospitality: "Top-of-range pay runs from $28 to $70/hr, with a median of $70/hr." AI engines quote these sentences as-is.
Fix: for even n, use `(rates[n/2-1] + rates[n/2]) / 2`. Put this in one shared helper and use it on the pay index, the blog and /micro1 as well, so all figures agree.

**M5. Freshness claim is contradicted by the data.**
Evidence: the site says "refreshed daily" or "updated daily" (meta descriptions, /about, summaries), but the maximum `last_verified` in `jobs.json` is 2026-10-24T17:34Z. On 2026-10-27 the homepage was served with `Age: 218067` (about 2.5 days), and blog `dateModified` is 2026-10-24. Blog `dateModified` is also tied to the data refresh (`web/app/blog/[slug]/page.tsx:43`), so the Article date moves even when the text doesn't, which is a weak freshness signal.
Fix: check `.github/workflows/refresh-jobs.yml` runs and add an alert when a run fails. Change the wording to "checked {date}" using the real date. Keep Article `dateModified` for real text edits and show the data date separately (the byline already does this visually).

### LOW

**L1. Titles are too long and some have grammar quirks.** 22 of 29 sampled titles are over 60 characters. The ` | Artificial Jobs` suffix adds 18 characters (`web/app/layout.tsx:25`). Category titles run 84-101 characters, e.g. "2 Best AI Training Jobs for Retail & hospitality pros (October 2026) — Up to $70/hr | Artificial Jobs". `capitalize()` (`[field]/page.tsx:15`) capitalises only the first word ("Robotics experts"). "N Best" reads badly when N is 1-2, and "Best ... Up to $30/hr" (robotics, median $15/hr) oversells. Fix: drop the brand suffix on job and category pages (use `title.absolute`), use title case, drop "Best" when the count is under 5, and keep titles to 60 characters or less, e.g. "Law AI Training Jobs: 50 Roles, Up to $400/hr (Oct 2026)".

**L2. Long H1/H2s built from lead + subtitle.** `Headline` puts the `rest` span inside the same `<h1>` (`web/components/training-ui.tsx:18-24`), giving 90-125 character H1s ("Best AI training jobs for lawyers. 50 open Law roles helping AI labs improve their models."). Section H2s on the homepage, /micro1 and /sell-company-data are built the same way. Fix: keep only `lead` in the heading and render `rest` as a `<p>`.

**L3. Imported headings on job pages.** Scraped descriptions add H2s with trailing colons ("Key Responsibilities:", "Qualifications:", "Disclaimer", "Compensation & Benefits Notice"), and some jobs have none. Fix: in `web/components/job-description.tsx`, demote imported headings to H3, strip trailing colons, and drop boilerplate sections such as "Disclaimer".

**L4. Internal linking gaps.** Job pages link only to the parent field and 5 same-field jobs. They don't link to the matching blog guide (e.g. the law jobs → "AI Training Jobs for Lawyers"), /micro1 or the Pay Index. Category pages don't link to their related guide either. Fix: add a "Guides" link per field and a contextual "How this compares: micro1 Pay Index" link on job pages.

**L5. Copy nits.** Category summaries can say "0 are marked high demand" (`[field]/page.tsx:46`). Omit that clause when the count is zero.

## AI citation readiness (80/100)

Strengths: answer-first paragraphs, tables with explicit units, FAQPage on 20 of 29 sampled pages, a Dataset with CSV and a licence, `llms.txt`, and source lines ("Source: open law listings in micro1's referral job feed..."). Gaps: no named author for attribution, the median error (M4), and staleness against the "daily" claim (M5) all make the site a less reliable citation source.

## Structured findings (audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "scores": {"content_quality": 60, "on_page_seo": 68, "eeat": 53, "ai_citation_readiness": 80,
             "eeat_factors": {"experience": 40, "expertise": 50, "authoritativeness": 45, "trustworthiness": 70}},
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}, "pages_checked": 29},
  "findings": [
    {"id": "H1", "severity": "high", "title": "Job pages are verbatim micro1 descriptions with little added value", "evidence": "web/app/jobs/[slug]/page.tsx:128", "pages_affected": 307},
    {"id": "H2", "severity": "high", "title": "61 jobs in near-duplicate clusters (8 identical pairs, 5 duplicate titles)", "evidence": "web/data/jobs.json 5-gram Jaccard >= 0.7"},
    {"id": "H3", "severity": "high", "title": "No named authors; /micro1 review lacks first-hand evidence", "evidence": "web/app/blog/[slug]/page.tsx:52,82; web/app/about/page.tsx:53"},
    {"id": "H4", "severity": "high", "title": "No privacy policy/terms/contact despite email-collecting forms", "evidence": "web/components/site-footer.tsx:12-20; web/app (no privacy route)"},
    {"id": "M1", "severity": "medium", "title": "Thin (1-2 role) and overlapping category pages with templated copy", "evidence": "web/lib/training-jobs.ts:82; web/app/ai-training-jobs/[field]/page.tsx:42-71"},
    {"id": "M2", "severity": "medium", "title": "Templated job meta descriptions inaccurate for 30 salaried roles", "evidence": "web/app/jobs/[slug]/page.tsx:28"},
    {"id": "M3", "severity": "medium", "title": "Blog posts 432-590 words", "evidence": "/blog/* word counts"},
    {"id": "M4", "severity": "medium", "title": "Median uses upper-middle value for even n", "evidence": "web/app/ai-training-jobs/[field]/page.tsx:34; web/lib/training-jobs.ts:101"},
    {"id": "M5", "severity": "medium", "title": "Data last verified 2026-10-24 despite 'refreshed daily' claim", "evidence": "jobs.json max last_verified; homepage Age header 218067s"},
    {"id": "L1", "severity": "low", "title": "Titles over 60 chars (22/29), casing and 'N Best' quirks", "evidence": "web/app/ai-training-jobs/[field]/page.tsx:15,23; web/app/layout.tsx:25"},
    {"id": "L2", "severity": "low", "title": "Over-long H1/H2s from Headline lead+rest", "evidence": "web/components/training-ui.tsx:18-24"},
    {"id": "L3", "severity": "low", "title": "Imported H2s with trailing colons / boilerplate on job pages", "evidence": "web/components/job-description.tsx"},
    {"id": "L4", "severity": "low", "title": "Job/category pages do not link to guides, /micro1 or Pay Index", "evidence": "web/app/jobs/[slug]/page.tsx:157-165"},
    {"id": "L5", "severity": "low", "title": "'0 are marked high demand' copy", "evidence": "web/app/ai-training-jobs/[field]/page.tsx:46"}
  ]
}
```
