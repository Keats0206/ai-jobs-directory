# GEO Analysis: www.artificialjobs.dev

**Audited:** 2026-10-29 · **Builds on:** `findings/geo.md` (2026-10-27, 62/100). This is a re-check of that audit: what has been fixed, what is still open, and what is new. Points it already confirmed and that haven't changed (40/40 bot-UA test, SSR on every key page, Dataset JSON-LD on the Pay Index) were spot-checked, not repeated in full.

Scores are claude-seo heuristics, not Google ranking signals. Google's AI optimization guide says optimizing for AI Overviews and AI Mode "is still SEO", so every recommendation below is standard SEO work aimed at AI-search surfaces.

## GEO Readiness Score: 64 / 100 (was 62)

| Dimension | Weight | 10-27 | 10-29 | Why it moved |
|---|---|---|---|---|
| Citability | 25% | 72 | 76 | Two new guides (software engineers, selling company data) open with self-contained, number-led answers |
| Structural Readability | 20% | 78 | 78 | Unchanged; H1 concatenation and table glyph leaks still present |
| Multi-Modal Content | 15% | 45 | 45 | Still tables only |
| Authority & Brand Signals | 20% | 35 | 35 | No Person, no `sameAs`, no `founder`; nothing has changed off-site |
| Technical Accessibility | 20% | 75 | 80 | Data is fresh again (sitemap lastmod 2026-10-28, 331 roles), but the new refresh path is not scheduled (see Critical #1) |
| **Total** | | **62** | **64** | |

## Platform readiness (qualitative, not measured)

No citation-tracking tool was run, so there are no platform scores this time. Readiness by platform:

- **Google AI Overviews / AI Mode:** Good technical eligibility (Googlebot allowed, SSR, FAQ/Article/Dataset markup). Held back by no named author and by identical build-time `dateModified` values on every page.
- **ChatGPT Search:** OAI-SearchBot is allowed. The site has no entity presence on Wikipedia, Reddit or the press, and ChatGPT leans heavily on those.
- **Perplexity:** PerplexityBot is allowed and the data is fresh again. There is still no Reddit footprint, which is Perplexity's largest source.
- **Bing Copilot:** IndexNow is live. No `sameAs` entity signals.

## AI crawler access

robots.txt is unchanged: `User-Agent: * / Allow: /` plus the sitemap. Nothing is blocked.

| User-agent | Governs | Status |
|---|---|---|
| Googlebot | Google Search, AI Overviews, AI Mode | Allowed |
| OAI-SearchBot | ChatGPT Search citation | Allowed |
| Claude-SearchBot | Claude search citation | Allowed |
| PerplexityBot | Perplexity search | Allowed |
| Applebot | Siri / Spotlight / Safari | Allowed |
| bingbot | Bing / Copilot | Allowed |
| GPTBot | OpenAI training only | Allowed |
| ClaudeBot | Anthropic training only | Allowed |
| Google-Extended | Gemini/Vertex training and grounding (not Search) | Allowed |
| Applebot-Extended | Apple Intelligence training opt-out (not search) | Allowed |
| CCBot | Common Crawl training | Allowed |

Allowing the training crawlers is consistent with the CC BY 4.0 licence on the Pay Index. Blocking them would not change search citability.

## llms.txt status

Present but **still stale**. It lists Law 49, Finance 15 and only 3 guides. The live site has Law 52, 331 roles and 5 guides: the software-engineer and sell-company-data guides and the coding-language pages are missing. `scripts/generate_llms_txt.py` exists but isn't wired into the build. `/llms-full.txt` and `/license.xml` (RSL) both return 404.

Google says llms.txt doesn't affect Search visibility, and no major AI provider has confirmed using it. This is low priority. If you keep it, generate it at build time so the numbers can't drift away from the pages.

## Brand mention analysis

Not re-checked: two days is too short for anything to have changed. As of 10-27: no Wikipedia or Wikidata entity, no Organization `sameAs`, no LinkedIn/X/YouTube profiles found, no Reddit mentions found. The live Organization JSON-LD still has only `name`, `url`, `logo`, `description` and `parentOrganization`.

## Passage-level citability

**Strong (quote-ready openings):**
- `/blog/ai-training-jobs-for-software-engineers` (new): "There are 31 open AI training jobs for software engineers on micro1 as of October 2026, paying a median of $100/hr at the top of their range and up to $300/hr. 17 of them pay $100/hr or more."
- `/blog/how-to-sell-company-data-to-ai-labs` (new): it opens with the buyer programs, their price ranges (micro1 $100K–$2M+, Mercor up to $1.5M) and what labs want, all inside the first 70 words.
- `/ai-training-jobs/python` and the other new language pages: "As of October 2026, there are 31 open AI training jobs for Python developers… median of $100/hr…"
- `/micro1` "The short answer" block and the Pay Index opening (unchanged and still good).

**Weak:**
- Homepage: the first text is "Get paid to train AI." followed by stat tiles. Nothing defines Artificial Jobs or answers "what are AI training jobs?" in prose.
- `/sell-company-data`: the H1 is a 20-word claim, then program cards. There is still no answer paragraph and the Reuters / Spirit Airlines $10M figure is still unlinked.
- The new guides have **no outbound primary sources** apart from data.mercor.com. The software-engineer guide doesn't link micro1's listings or any source for its claims about coding-model training.

## Server-side rendering check

Unchanged: every key page and the new guides and language pages are server-rendered, and their full text is in the raw HTML.

---

## Findings

### [CRITICAL] The local refresh job is not loaded, so data will go stale again, and the Nov 1 Pay Index has no staleness guard
- **Evidence:**
  - `launchctl print gui/501/dev.artificialjobs.refresh` returns "Could not find service". The plist exists only at `scripts/dev.artificialjobs.refresh.plist`. Nothing in `~/Library/LaunchAgents` matches it, and `~/Library/Logs/artificialjobs-refresh.log` doesn't exist, so the job has never run on its schedule.
  - The two data commits on 10-28 (16:46 and 19:12) were manual runs.
  - `pay-index.yml` still runs at 09:00 UTC on the 1st on GitHub. Its comment assumes a 07:20 UTC refresh, but the plist fires at 07:20 *local* (11:20 UTC on Nov 1, after US DST ends), so it runs *after* the edition is cut.
  - `scripts/pay_index.py` reads `web/data/jobs.json` and never checks how old it is.
- **Impact:** If nothing runs before Sunday, the November edition will freeze data from 10-28, and the "refreshed daily" claims on the homepage, /micro1 and llms.txt will be false again. The Pay Index is the site's most citable asset.
- **Fix (20m):**
  1. `cp scripts/dev.artificialjobs.refresh.plist ~/Library/LaunchAgents/ && launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/dev.artificialjobs.refresh.plist`.
  2. Move `pay-index.yml` to around 13:00 UTC, or trigger the edition from `refresh_local.sh` on the 1st.
  3. In `pay_index.py`, exit non-zero if the newest snapshot is more than 36h old.
  4. Note that launchd skips runs while the Mac is asleep or off. Keep that in mind for the 1st.

### [HIGH] Every page reports the build time as `dateModified`
- **Evidence:** 372 of 374 sitemap `<lastmod>` values are `2026-10-28T23:12:00.973Z`. The Article `dateModified` on both new guides has the same timestamp, including the sell-company-data guide, whose prose didn't change.
- **Impact:** Google and AI engines that weight recency learn to ignore a date that moves for every page on every deploy. Real updates then stop counting.
- **Fix (1h):** For job and field pages, use the data snapshot date. For guides and hub pages, use the date the content last changed (a constant in `lib/blog.tsx`, or git mtime).

### [HIGH] Entity and author gaps (open since 10-24)
- No `Person`, no `founder`, no `sameAs`. The homepage title is still "331 AI Training Jobs for Experts — Up to $400/hr" with no brand. Every byline reads "By Artificial Jobs".
- **Fix (1–2h):** As in `findings/geo.md`: a named editor on /about plus Person schema as Article `author`, `founder` and `sameAs` on the Organization, " | Artificial Jobs" in the homepage title, and a first sentence along the lines of "Artificial Jobs is an independent board of paid AI training jobs…".

### [MEDIUM] /pay-index still canonicalises to /pay-index/2026-10
On Nov 1 the evergreen URL's canonical moves to /2026-11. Make `/pay-index` self-canonical before that happens, so it doesn't need a second migration later.

### [MEDIUM] The new platform comparison pages (uncommitted) need one fix before they ship
`web/lib/compare.ts` is well designed: every `Fact` can carry a source, and it has a `FACTS_CHECKED` date. This is the "micro1 vs Mercor vs Outlier" page the 10-27 audit asked for. One claim lacks a source: micro1's "Forbes reported a $4B valuation in September 2026" has no `source`. Link the Forbes article, or drop the claim. When the pages ship, add them to llms.txt and the sitemap (the `sitemap.ts` change is already staged).

### [MEDIUM] No outbound sources in the new guides
Copy the citation pattern from `/what-is-it-worth`. Link micro1's role pages and its experts page in the software-engineer guide. Link Reuters and micro1's data-partner page in the sell-data guide.

### [LOW] Still open from 10-27
- Pay Index H1/H2 include the subtitle span: "micro1 Pay Index, October 2026. What micro1 pays AI trainers…".
- Table text extracts as `Science & Research#`, `Educationsmall sample#`.
- llms.txt counts are stale (see above).

---

## Top 5 highest-impact changes

| # | Change | Effort |
|---|---|---|
| 1 | Load the launchd job, move the Pay Index run after the refresh, add a 36h staleness guard. **Do this before Sunday, Nov 1.** | 20m |
| 2 | Use real `dateModified`/`lastmod` values instead of the build timestamp | 1h |
| 3 | Named editor, Person schema, Organization `founder` + `sameAs`, brand in the homepage title and opening line | 1–2h |
| 4 | Ship the platform comparison pages with every fact sourced (fix the Forbes claim) | 30m on top of current work |
| 5 | Self-canonical `/pay-index` before the November edition; add a lead answer and the Reuters link to `/sell-company-data` | 1h |

## Schema recommendations

- **Organization:** add `founder` (Person), `sameAs` (LinkedIn, X, GitHub, Zenodo once they exist) and `contactPoint`.
- **Person:** the editor, with `jobTitle`, `url` (/about#editor) and `sameAs`. Use it as `author` on every Article and as a `creator` on the Dataset.
- **WebPage `dateModified`:** add to /about, /micro1 and /sell-company-data. Extractors currently guess 2026-01-01 for these.
- **Platform pages:** use a `WebPage` with `about` pointing at each platform as an `Organization` with a `url`. Don't add Review/AggregateRating, because there is no first-party review data behind it.
- **Pay Index:** add a chart `ImageObject` to the Dataset `image` once a chart exists.

## Content reformatting suggestions

1. **Homepage, above the stat tiles.** Add: "Artificial Jobs is an independent list of paid AI training jobs: remote, hourly contract work where lawyers, doctors, engineers and other experts write and grade the examples AI models learn from. As of [date], micro1 lists [N] open roles paying a median of $[X]/hr, up to $[Y]/hr." Fill the numbers from `trainingStats()`.
2. **`/sell-company-data`, under the H1.** Add a 50–70 word answer: who buys company data (micro1 and Mercor data partnerships), the price range with sources linked, the 30+ employee requirement, that personal data is stripped, and the Spirit Airlines $10M sale (Reuters, Aug 2026) with a link.
3. **Pay Index headings.** Move "What micro1 pays AI trainers, by field…" out of the `<h1>` into a `<p>`. Do the same for the H2 subtitle.
4. **Pay Index table.** Mark the `#` permalink `aria-hidden` and move it out of the cell's text. Render "small sample" as a footnote marker (`Education*`).
5. **Software-engineer guide.** Add a short sourced section titled "Which AI labs hire engineers through micro1?", or link micro1's own description of its clients. The guide is 646 words with no external evidence, which fails Google's "How was this created?" test for a pay claim.
