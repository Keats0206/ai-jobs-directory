# GEO / AI Search Readiness: www.artificialjobs.dev

**Audited:** 2026-10-27 · **Builds on:** `docs/audits/aeo_audit_report.md` (2026-10-24, AEO 87/A-). This audit skips what that one already confirmed and covers what is still open or new since the Pay Index, data-value guide and valuation form shipped.

## AI Search Readiness Score: 62 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 72 | 18.0 |
| Structural Readability | 20% | 78 | 15.6 |
| Multi-Modal Content | 15% | 45 | 6.8 |
| Authority & Brand Signals | 20% | 35 | 7.0 |
| Technical Accessibility | 20% | 75 | 15.0 |
| **Total** | | | **62** |

This score is lower than the earlier AEO 87 because the rubric is different. The AEO audit mostly scored on-page structure. This one gives 20% weight to off-site authority and brand signals, which are close to zero, and it counts the broken data refresh against both citability and technical accessibility.

### Platform-specific readiness

| Platform | Score | Main lever |
|---|---|---|
| Google AI Overviews | 60 | Googlebot has full access and FAQ/Article/Dataset markup is in place. Weak spots: no named human author, few corroborating third-party mentions, and the site's "refreshed daily" claim is currently false. |
| ChatGPT Search | 55 | OAI-SearchBot is allowed and ChatGPT search leans on Bing's index (see Copilot). It favours entities with Wikipedia/Reddit/press presence, and the site has none. |
| Perplexity | 58 | PerplexityBot is allowed. Perplexity weights freshness and Reddit heavily: data is 3 days stale and there is no Reddit footprint. The Pay Index CSV and the "Cite this edition" block are its best assets. |
| Bing Copilot | 62 | IndexNow pings run on every production deploy, so new URLs reach Bing quickly. Weak spots are entity signals (no `sameAs`) and the stale data. |

---

## What works

- **Crawler access is fully open.** robots.txt is `User-Agent: * / Allow: /` plus the sitemap. I sent spoofed requests as GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Perplexity-User, CCBot, bingbot and Googlebot to `/`, `/pay-index`, `/sell-company-data` and `/llms.txt`. All 40 returned 200 with byte-identical bodies (e.g. 294,782 B on `/` for every UA). No Vercel or WAF bot challenge fires on these UAs.
  - What each bot controls: OAI-SearchBot controls ChatGPT Search citation. Claude-SearchBot controls Claude search. PerplexityBot controls Perplexity. Googlebot controls AI Overviews. GPTBot, ClaudeBot, CCBot, Google-Extended and Applebot-Extended are training (plus Gemini grounding for Google-Extended) and are optional. All are allowed today, which is a reasonable choice for a site that wants its CC BY data reused.
- **All key pages are server-rendered** (`is_spa=false` on /, /pay-index, /micro1, /sell-company-data, /what-is-it-worth, /about and the blog). AI crawlers that don't run JavaScript see the full content.
- **The Pay Index is the most citable asset on the site:**
  - It opens with a 56-word answer that stands on its own ("As of October 24, 2026, micro1's 270 open hourly AI training roles pay a median of $50–$90/hr… Science & Research… $200/hr… highest posted rate is $400/hr").
  - It has a by-field table, a numbered methodology, a "Cite this edition" string and a CC BY 4.0 licence.
  - The CSV (`/pay-index/2026-10.csv`) has `access-control-allow-origin: *` and clean headers.
  - The `Dataset` JSON-LD includes `variableMeasured`, `distribution`, `license` and `temporalCoverage`.
- **The /micro1 opening and the opening of "How much do AI training jobs pay"** are good passages to quote: a definition first, then numbers, under 80 words.
- **/sell-company-data/what-is-it-worth** is the only page with real outbound citations (technologyreview.com, gizmodo.com, decrypt.co, itnews.com.au, simpleclosure.com). That evidence pattern should be copied to other pages.
- The RSS feed (`/blog/feed.xml`), Article `datePublished`/`dateModified`, and visible `<time>` elements are all in place.

---

## Findings

### [CRITICAL] The daily micro1 refresh has failed 3 days running, so the "refreshed daily" claim is false and the Nov 1 Pay Index will publish stale data
- **Evidence:**
  - `gh run list --workflow refresh-jobs.yml` shows the runs on 10-25, 10-26 and 10-27 as `failure` after 11–12s, with `urllib.error.HTTPError: HTTP Error 403: Forbidden` at `scripts/fetch_micro1_jobs.py:67`.
  - The same API URL and User-Agent return **200 from a residential IP**. micro1 (prod-api.micro1.ai) is blocking GitHub Actions / Azure datacenter IPs.
  - The last data commit is 2026-10-24. The sitemap has 339 of 341 `<lastmod>` values set to `2026-10-24T17:34:13.595Z`.
  - The homepage says "updated daily". /about says "An automated job re-checks every listing once a day. Roles micro1 closes are removed". Neither is true right now: closed roles stay listed with live apply links.
  - `pay-index.yml` runs `scripts/pay_index.py` from `web/data/jobs.json` at 09:00 UTC on the 1st. If nothing changes, the "November 2026" edition will be a copy of 10-24 data presented as a fresh snapshot. That damages the one asset designed to earn citations.
- **Why it matters for GEO:** Perplexity and AI Overviews weight freshness, and an engine that cross-checks against micro1 will find discrepancies. A wrong "data as of" date on a CC BY dataset hurts trust in every edition that follows.
- **Fix (2–4h):**
  1. Move the fetch off GitHub-hosted runners. Options: a Vercel Cron route that writes to Blob/Edge Config, a self-hosted runner, or a local launchd job that commits and pushes.
  2. Add a staleness guard. `pay_index.py` should exit non-zero if the newest `jobs.json` snapshot is more than 36h old. The workflow should open an issue or alert on failure.
  3. Render "Listings as of <date>" from the real snapshot date, not the build date.
  4. The fetcher UA points to `/sources`, which now 308s to `/`. Point it at `/about`.

### [HIGH] No named human author or editor anywhere (still open from the earlier audit)
- **Evidence:**
  - Every Article and Dataset uses `author`/`creator` = `Organization: Artificial Jobs`.
  - /about says only "The site is run by Keating Holdings". There is no person, LinkedIn or contact.
  - The Pay Index byline is "By Artificial Jobs".
- **Why it matters:** AI Overviews and ChatGPT favour content they can attribute to an accountable person, especially on money topics (pay, selling company data, legal risk). The sell-data pages give quasi-legal guidance with no named author.
- **Fix (1h):**
  1. Add a `Person` (Pete Keating, founder/editor) with an `/about#editor` section, photo, LinkedIn/X `sameAs`, and a one-line credential.
  2. Set it as `author` on the Article schema and as `creator` alongside the Org on the Dataset.
  3. Add `founder` to the Organization schema.

### [HIGH] Entity is under-defined: no `sameAs`, generic brand name, and the brand is almost absent from the homepage
- **Evidence:**
  - The Organization JSON-LD has `name`, `url`, `logo`, `description` and `parentOrganization` (Keating Holdings), with **no `sameAs`**.
  - Wikipedia search for "artificialjobs.dev" returns 0 hits. Wikidata has no entity for "Artificial Jobs".
  - The homepage `<title>`/`og:title` is "307 AI Training Jobs for Experts — Up to $400/hr", with no brand.
  - The homepage extracted text contains "Artificial Jobs" exactly once (an FAQ question). Apart from that the brand appears only in meta tags and the footer.
  - "Artificial jobs" is also a generic phrase (AI replacing jobs), so engines need explicit disambiguation.
- **Fix (1h):**
  1. Append " | Artificial Jobs" to the homepage title.
  2. Open the homepage with a sentence like "Artificial Jobs (artificialjobs.dev) is an independent board of paid AI training jobs…".
  3. Create a LinkedIn company page, an X account, a GitHub org (the repo publishing the Pay Index) and a Zenodo record for the Pay Index (see `docs/zenodo-pay-index.md`), and list them all in `sameAs`.
  4. Zenodo gives the dataset a DOI, which is the fastest legitimate route to a third-party entity record.

### [HIGH] Off-site brand signals are essentially zero
- **Evidence:**
  - `backlink_plan.md` (2026-10-25) found "No existing channel activity". Baseline traffic is 313 views/week, 26 from Google.
  - No Wikipedia or Wikidata entity.
  - I could not check Reddit or YouTube unauthenticated (Reddit's JSON API and DDG both blocked the requests). Neither source shows any mention.
  - `reddit_opportunities.md` names roughly 10 multi-platform competitors (aitrainer.work, redpenjobs.com, aipaylist.com…) that already hold the Reddit and citation slots.
- **Why it matters:** YouTube mentions (~0.74 correlation) and Reddit presence are the strongest predictors of AI citation. Backlinks are weak (~0.27).
- **Fix (ongoing, ~2h/week):**
  1. Each month, post the Pay Index as a data post (chart image plus CSV link) to r/WFHJobs, r/BeerMoney-adjacent subreddits and profession subreddits. Follow each sub's rules and disclose the referral link.
  2. Publish a 2–3 minute YouTube walkthrough of each edition ("What micro1 pays lawyers, Oct 2026"), with the CSV linked in the description.
  3. Pitch the data-deals table (`docs/press-pitch-data-deals.md`) to the outlets it already cites.

### [MEDIUM] llms.txt is hand-maintained, already out of date, and could be overwritten by legacy scripts
- **Evidence:**
  - It is a static `web/public/llms.txt` (4,620 chars, valid structure: H1, blockquote, H2 link lists).
  - Its counts don't match the site: llms.txt says Law 49, Finance 15, Business Operations 8; the live pages and Pay Index say 50, 16, 11.
  - No build step regenerates it (`prebuild` only runs `copy-content.mjs`).
  - Three legacy generators remain in the repo: `regenerate_llms_txt.py`, `web/scripts/generate-llms-txt.py` and `update_and_deploy.sh`. They write a pre-pivot "AI Engineering & LLM Job Board" llms.txt. Running any of them by habit would replace the file with off-topic content.
  - The file is missing: the `/blog` index, the RSS feed, the direct CSV URL pattern for the Pay Index as its own entry, a "how to cite / licence" line, and a last-updated date.
  - `/llms-full.txt` returns 404, which is optional. There is no RSL licence (`/license.xml` 404). That is optional too, but a fit, since the Pay Index is CC BY 4.0.
- **Fix (1h):**
  1. Generate llms.txt from `jobs.json` plus the blog content in `copy-content.mjs`, or make it a Next.js route handler (`app/llms.txt/route.ts`) so it can never drift.
  2. Delete the three legacy generators.
  3. Add `Updated: YYYY-MM-DD`, a "## Data" section (Pay Index, CSV pattern, citation string, CC BY 4.0) and "## Guides → /blog, /blog/feed.xml".

### [MEDIUM] /pay-index canonicalises to the dated edition, which splits citation equity every month
- **Evidence:** `/pay-index` has `<link rel="canonical" href=".../pay-index/2026-10">`. In November the evergreen URL will switch its canonical to `/2026-11`, so links and citations earned by `/pay-index` keep moving to a new URL.
- **Fix (30m):** Make `/pay-index` self-canonical as "latest", with its own `Dataset` that carries `hasPart`/`isBasedOn` links to editions. Keep each `/pay-index/YYYY-MM` self-canonical as a frozen record. Answer engines then have one stable URL for "how much does micro1 pay" and a permanent URL for each dated figure.

### [MEDIUM] The /sell-company-data hub has no lead answer and an unlinked key citation
- **Evidence:**
  - The H1 is a claim ("Your company's data is worth $100K–$2M+…") followed straight away by program cards and a form. No definitional paragraph answers "can I sell my company's data to AI labs, and for how much?" in the first 60 words.
  - The strongest fact on the page, "$10 million for Spirit Airlines' data (Reuters, August 2026)", appears only inside FAQ text with **no link** to Reuters.
  - The only outbound domains are data.mercor.com, req.micro1.ai, hot100ai.dev and keatingholdings.com.
- **Fix (45m):**
  1. Add a 50–70 word answer block under the H1 covering who buys, the price range with a source, eligibility, and the "personal data stripped" caveat.
  2. Link the Reuters source and the micro1/Mercor program pages inline.
  3. Add a dated Article schema (or `WebPage` with `dateModified`).

### [MEDIUM] Guides are still short and evidence is thin outside /what-is-it-worth (still open from the earlier audit)
- **Evidence:**
  - Extracted word counts: the "How much do AI training jobs pay" guide is 656 words, /pay-index 778, /about 341, /sell-company-data 448.
  - The blog and /micro1 have **zero** outbound source links. /micro1 states "micro1 is a legitimate, venture-backed company" without linking any funding source.
- **Fix (3–4h per guide):**
  1. Extend the two highest-intent guides (pay; selling company data) to 1,500+ words with sections shaped like questions.
  2. Cite micro1's funding press and program pages inline.
  3. Add a "micro1 vs Mercor vs Outlier" comparison. It is the most common question in `reddit_opportunities.md`, and the site can only answer it credibly with a clearly scoped "we list micro1 only" note.

### [MEDIUM] Multi-modal content is tables only
- **Evidence:** There are no charts, data images, video or audio. The OG images are generic. Pay data appears only as HTML tables and CSV.
- **Fix (2h):**
  1. Add a static SVG/PNG bar chart of median top rate by field to each Pay Index edition, with descriptive alt text and `ImageObject` in the Dataset `image`.
  2. Make the per-edition OG image the chart itself, so it is the asset that gets shared on Reddit, LinkedIn and YouTube.

### [LOW] Headings still concatenate the subtitle into H1/H2 (still open from the earlier audit)
- **Evidence:** H1 is "micro1 Pay Index, October 2026. What micro1 pays AI trainers, by field, from every open listing." H2 is "How much micro1 pays, by field. Median and highest top-of-range hourly rate in each field." /sell-company-data has a 30-word H2. Engines that chunk on headings get diluted section titles.
- **Fix (20m):** Move the muted continuation `<span>` out of the heading element into a sibling `<p>`.

### [LOW] Table cells leak UI glyphs and badges into extracted text
- **Evidence:** Trafilatura output for the Pay Index table reads `Science & Research#`, `Educationsmall sample#`, `Arts & Designsmall sample#`. The permalink `#` anchor and the "small sample" badge merge into the field name, so a model quoting the table may reproduce "Educationsmall sample".
- **Fix (15m):**
  1. Give the anchor `aria-hidden` and put it outside the text node, or use a CSS `::after`.
  2. Put "small sample" in a separate column or a footnote marker (`Education*`) with a space before it.

### [LOW] The same date shows different numbers for one metric
- **Evidence:** For the same 10-24 snapshot, Generalist median top rate is $36/hr on /micro1 and $33/hr on /pay-index. The likely cause is different role filters (all roles vs hourly only). The llms.txt counts also differ (see above).
- **Fix (20m):** Use one shared stats function for both pages, or label the /micro1 figure "all roles incl. salaried".

### [LOW] Pages without explicit dates get guessed dates
- **Evidence:** Date extraction returned `2026-01-01` (a copyright-year fallback) for /about, /micro1 and /sell-company-data. These pages have no `dateModified` in markup. On the Pay Index and the blog, dates are only in `<time>` elements, which some extractors drop ("Published · Listings as of" with blanks).
- **Fix (20m):**
  1. Add `WebPage.dateModified` to all hub pages.
  2. Repeat the date in plain prose in the opening answer, as the Pay Index already does with "As of October 24, 2026".

---

## Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Get the micro1 refresh off GitHub-hosted runners, plus a staleness guard on `pay_index.py` before Nov 1 | Critical: protects freshness claims and the Pay Index's credibility | 2–4h |
| 2 | Named editor (`Person`) as author/creator, Organization `sameAs` + `founder`, brand in the homepage title and opening line | High: authority and entity clarity on all platforms | 1–2h |
| 3 | Zenodo DOI for the Pay Index plus a monthly Reddit/YouTube distribution routine (chart + CSV) | High: the strongest AI-citation correlates (YouTube, Reddit) and an entity record | 2h setup, then 2h/month |
| 4 | Generate llms.txt as a route from live data, delete legacy generators, add Data/Cite/Updated sections | Medium: stops drift and removes the risk of a pre-pivot overwrite | 1h |
| 5 | Self-canonical evergreen `/pay-index` + an answer block and linked Reuters citation on `/sell-company-data` | Medium: concentrates citations, makes the data-sale hub quotable | 1–1.5h |

---

## Structured findings (for audit-data.json → "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 62,
  "dimensions": {"citability": 72, "structural_readability": 78, "multimodal": 45, "authority_brand": 35, "technical_accessibility": 75},
  "platforms": {"google_aio": 60, "chatgpt_search": 55, "perplexity": 58, "bing_copilot": 62},
  "crawler_access": {"robots_txt": "User-Agent: * Allow: /", "blocked": [], "ua_test": "40/40 requests 200 identical bodies (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Perplexity-User, CCBot, bingbot, Googlebot)", "rendering": "SSR"},
  "llms_txt": {"status": "present", "quality": "valid structure, stale counts, static file, legacy overwrite risk", "llms_full_txt": "404", "rsl_license": "absent"},
  "brand_presence": {"wikipedia": "none", "wikidata": "none", "reddit": "none found (unverified, API blocked)", "youtube": "none found", "linkedin": "no sameAs", "org_sameAs": false},
  "findings": [
    {"severity": "critical", "id": "geo-refresh-403", "title": "Daily micro1 refresh failing since 2026-10-25 (403 from GitHub runner IPs)", "fix": "Move fetch off GitHub-hosted runners; staleness guard in pay_index.py", "effort": "2-4h"},
    {"severity": "high", "id": "geo-no-person-author", "title": "No named human author/editor", "fix": "Person schema + about#editor, author on Article/Dataset", "effort": "1h"},
    {"severity": "high", "id": "geo-entity-sameas", "title": "No sameAs, brand absent from homepage title/body, no Wikidata", "fix": "sameAs profiles, brand in title/lead, Zenodo DOI", "effort": "1h"},
    {"severity": "high", "id": "geo-offsite-brand", "title": "No Reddit/YouTube/press mentions", "fix": "Monthly Pay Index distribution (Reddit data post, YouTube walkthrough)", "effort": "2h/week"},
    {"severity": "medium", "id": "geo-llms-stale", "title": "llms.txt static, stale counts, legacy generators can overwrite", "fix": "Route-generated llms.txt, delete legacy scripts", "effort": "1h"},
    {"severity": "medium", "id": "geo-payindex-canonical", "title": "/pay-index canonicalises to dated edition", "fix": "Self-canonical latest page + per-edition canonicals", "effort": "30m"},
    {"severity": "medium", "id": "geo-sell-data-lead", "title": "/sell-company-data lacks lead answer; Reuters citation unlinked", "fix": "50-70 word answer block, inline source links, dated schema", "effort": "45m"},
    {"severity": "medium", "id": "geo-depth-evidence", "title": "Guides 650-780 words; no outbound sources on blog and /micro1", "fix": "Extend to 1500+ words, cite primary sources, comparison page", "effort": "3-4h/guide"},
    {"severity": "medium", "id": "geo-multimodal", "title": "No charts/images/video for data", "fix": "Per-edition chart image as OG + ImageObject", "effort": "2h"},
    {"severity": "low", "id": "geo-heading-concat", "title": "Subtitle text inside H1/H2", "fix": "Move continuation span out of heading", "effort": "20m"},
    {"severity": "low", "id": "geo-table-glyphs", "title": "'#' and 'small sample' badge merge into field names in extracted text", "fix": "aria-hidden anchor, separate badge", "effort": "15m"},
    {"severity": "low", "id": "geo-metric-mismatch", "title": "Generalist median $36 (/micro1) vs $33 (/pay-index) same date", "fix": "Shared stats function or label", "effort": "20m"},
    {"severity": "low", "id": "geo-missing-dates", "title": "Hub pages lack dateModified; extractors guess 2026-01-01", "fix": "WebPage.dateModified + date in prose", "effort": "20m"}
  ]
}
```
