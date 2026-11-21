# Content Architecture / Topic Cluster Findings: artificialjobs.dev

Date: 2026-10-27 | Status: COMPLETE (supersedes partial pass 1)

## 0. Inputs and method
- URL inventory: 343 URLs. That is the home page, 25 `/ai-training-jobs/*` pages (19 micro1 fields plus 6 cross-field collections), **4** blog posts (`web/lib/blog.tsx` defines 4, not 5), `/micro1`, `/pay-index/2026-10`, 2 sell-company-data pages, `/about`, and about 300 `/jobs/*` listings (all from micro1).
- Existing artifacts:
  - `prompts.csv` is current. Its clusters were used as seeds: profession_pay, micro1_pay, micro1_trust, micro1_interview, platform_comparisons, entry_level, pay_data, sell_company_data, contractor_basics.
  - `keywords.csv` and `plan.csv` are **stale**. They come from an earlier coding-agents/MCP job-board pivot (cursor, mcp servers, llm engineer) and don't match the current site. Retire them or regenerate them for the AI-training niche.
- SERP overlap: 28 WebSearch pulls of about 9-10 results each. Overlap = the number of exact URLs two pulls share. WebSearch is not a clean Google organic top 10, so treat scores as directional. Thresholds: 7-10 = same post, 4-6 = same cluster, 2-3 = interlink, 0-1 = separate.
- Source code checked: `web/lib/training-jobs.ts` (AUDIENCE map, COLLECTIONS, MIN_COLLECTION_ROLES=5), `web/app/ai-training-jobs/[field]/page.tsx`, `web/app/pay-index/page.tsx`, `web/app/micro1/page.tsx`, `web/components/site-footer.tsx`, `web/lib/blog.tsx`.

## 1. SERP overlap matrix
| Keyword A | Keyword B | Shared | Verdict |
|---|---|---|---|
| ai training jobs | ai trainer jobs | 5 (tech.co, themuse, brandeis, 2x hurley) | Same cluster. Both go on one page (home) |
| ai training jobs | get paid to train ai | 0 | Separate. Needs its own page (GAP) |
| ai training jobs | ai training jobs no experience | 1 | Separate |
| ai training jobs | ai trainer jobs remote | 1 | Separate (remote SERP is listings) |
| get paid to train ai | ai training jobs no experience | 0 (same domains opentrain/mindrift, different URLs) | Separate. Interlink |
| ai training jobs no experience | entry level ai training jobs remote | 0 (opentrain /jobs/no-experience vs blog) | Separate intent: guide vs listing |
| **ai training jobs for doctors** | **ai training jobs for physicians** | **4** (3 greenhouse IDs + glassdoor) | **Same cluster, close to same post. CANNIBALIZATION** |
| ai training jobs for phds | ai training jobs for scientists | 0 | Separate pages are justified |
| bilingual ai training jobs | ai training jobs for translators linguists | 0 | Separate pages are justified |
| ai training jobs for lawyers | ai trainer jobs for lawyers pay per hour | 1 | Guide intent vs listing/pay intent. Split the roles |
| ai training jobs for physicians | ai training jobs for lawyers | 0 | Separate (annotation.academy runs both) |
| ai training jobs for nurses | ai training jobs for doctors | 0 | Separate. Nurses page is a GAP |
| ai training jobs for teachers | (any) | 0 | Mixed SERP (news about AFT plus one aitrainingjobsfinder post). Low competition |
| ai training jobs for software engineers | ai training jobs | 0 | Separate. opentrain owns it |
| how much do ai training jobs pay | ai trainer pay per hour by profession | 3 (mercor, glassdoor x2) | Interlink, or one cluster with two pages |
| micro1 pay per hour | is micro1 legit | 0 | **Separate posts** (/micro1 targets both) |
| micro1 pay per hour | micro1 vs outlier | 0 | Separate |
| is micro1 legit | micro1 zara ai interview questions | 0 | **Separate posts** (/micro1 targets both) |
| micro1 vs outlier | outlier vs dataannotation vs mercor | 0 (same domains: aitrainer.work/compare, annotation.academy/compare) | Separate comparison pages |
| micro1 vs mercor | - | SERP has no relevant result | Open GAP, about zero competition |
| outlier ai pay rate | alignerr pay | 0 | Separate platform-pay pages |
| dataannotation tech pay review | micro1 pay per hour | 0 | Separate |
| sell company data to ai labs | (any jobs keyword) | 0 | Separate silo (B2B, news-dominated SERP) |

Competitor patterns seen in these SERPs:
- **aitrainer.work**: `/jobs/{field}`, `/compare/{a}-vs-{b}`, `/guides/{platform}-review`.
- **annotation.academy**: `/careers/ai-training-jobs-for-{profession}`, `/compare/*`, `/blog/is-{platform}-legit`.
- **opentrain.ai**: `/ai-training-careers/{field}`, `/jobs/no-experience`, `/jobs/pay-rates`.
- **mozibox**, **remoteworkunion**, **aigigjobs** (micro1 pay guide), **breakingeven.online** (platform pay).

All of them win with platform-review and platform-vs-platform pages. artificialjobs.dev has neither, apart from `/micro1`. A brand search ("artificialjobs.dev ai training jobs") turned up no artificialjobs.dev URL, so the site isn't indexed or isn't ranking yet.

## 2. Cannibalization findings (priority order)
1. **/ai-training-jobs/medicine vs /ai-training-jobs/physicians (HIGH).** `AUDIENCE.medicine = 'doctors'`, so the medicine title reads "Best AI Training Jobs for Doctors". The physicians collection reads "...for Physicians". The two SERPs share 4 URLs. Fix: make /physicians the target for doctor/physician queries. Change `AUDIENCE.medicine` to "healthcare professionals" and position medicine as the umbrella for medical coders, nurses, dentists and psychologists. Cross-link the two pages with distinct anchors.
2. **/micro1 targets 3 SERPs that don't overlap (HIGH).** Title: "micro1 Review: Pay, AI Interview & Is It Legit?". Pay, legit and interview share 0 URLs pairwise, so one page can't win all three. Fix:
   - /micro1 = review/legit
   - new /micro1/interview = Zara AI interview (target "micro1 ai interview questions"). The SERP is micro1.ai, Glassdoor and Trustpilot, which is weak competition.
   - /pay-index = "micro1 pay per hour" (it is literally the micro1 Pay Index)
3. **/pay-index canonical drifts each month (HIGH, structural).** `web/app/pay-index/page.tsx` sets the canonical to the latest edition URL. The footer links sitewide to `/pay-index`, so all of that link equity goes to a URL that stops being "latest" every month. Editions `/pay-index/YYYY-MM` will also compete with each other for "micro1 pay" and "ai trainer pay by field". Fix: make `/pay-index` self-canonical as the evergreen hub ranking for the head terms. Keep editions as dated archive and Dataset pages that link up to the hub.
4. **/pay-index vs /blog/how-much-do-ai-training-jobs-pay (MEDIUM).** Overlap is 3 (interlink tier). Split the roles:
   - blog = "how much do ai training jobs pay" (cross-platform narrative: Outlier/Mercor/DataAnnotation/micro1 tiers)
   - pay-index = "micro1 pay per hour / ai trainer pay by field" (dataset)
   - Remove any duplicate field-by-field tables from the blog and link to the index instead.
5. **/ai-training-jobs/law vs /blog/ai-training-jobs-for-lawyers (MEDIUM).** Both target "AI training jobs for lawyers". The SERP mixes guides (annotation.academy) and listings, and the pay-intent variant is listings only (overlap 1). Fix: /law keeps "ai training jobs for lawyers" plus pay. Retitle the blog to "How to Get AI Training Work as a Lawyer (Platforms, Tests, Rates)", which matches the prompts.csv prompt "how to get ai training work as a lawyer". The blog already links to /law. **/law does not link back to the blog**: field pages only link fields, collections and job pages.
6. **/ai-training-jobs/sciences-research vs /phds (LOW-MEDIUM).** `AUDIENCE['sciences-research'] = 'scientists & PhDs'` claims the PhD term too. The SERPs share 0 URLs, so separate pages are fine. Change the audience to "scientists". Same idea for chemists/physicists/biologists: they are subsets, so keep them and link up to sciences-research.
7. **/ai-training-jobs/language-audio vs /bilingual (LOW).** 0 overlap, so no merge is needed. Keep the targets distinct: language-audio = "translators & linguists", bilingual = "bilingual".
8. **/ai-training-jobs/generalist vs /blog/ai-training-jobs-no-experience (LOW).** Different intents (listing vs guide). Interlink only.
9. **/sell-company-data vs /blog/how-to-sell-company-data-to-ai-labs (LOW).** Keep /sell-company-data = "sell company data to ai labs" (transactional) and the blog = "how to prepare/sell" how-to. Make sure the H1s differ.
10. **/ai-training-jobs/other ("specialists") (LOW).** Thin, with no search demand. noindex it or fold it into generalist.

## 3. Gaps (new pages ranked by opportunity)
| # | Target keyword | Proposed URL | Intent | Template | Why |
|---|---|---|---|---|---|
| 1 | micro1 ai interview questions / how to pass micro1 zara interview | /micro1/interview | Info | how-to | Weak SERP (official page + Glassdoor). Already in prompts.csv as easy_win |
| 2 | micro1 vs mercor | /compare/micro1-vs-mercor | Commercial | comparison | SERP returned no relevant page. Zero competition |
| 3 | micro1 vs outlier | /compare/micro1-vs-outlier | Commercial | comparison | Only aitrainer.work and aitrainingjobsfinder rank |
| 4 | get paid to train ai | /blog/get-paid-to-train-ai | Commercial/Info | listicle (platforms + live rates) | 0 overlap with the head term. No page on the site targets it |
| 5 | ai training jobs for nurses | /ai-training-jobs/nurses | Transactional | programmatic + evergreen copy | Collection exists in code but is unpublished (<5 roles). The SERP has a micro1 nursing posting and opentrain |
| 6 | ai training jobs for teachers | /ai-training-jobs/teachers (or retitle /education) | Transactional | programmatic | SERP is mostly news, so easy to win. `education` already uses audience "teachers", so retitling is enough |
| 7 | outlier / mercor / alignerr / dataannotation pay | /blog/{platform}-pay or /platforms/{x} | Commercial | review | Each SERP is separate (0 overlap). Competitors farm these. Do these after the micro1 comparisons |
| 8 | ai training jobs for accountants / dentists / mathematicians | /ai-training-jobs/{x} | Transactional | programmatic | Collections are defined but gated by MIN_COLLECTION_ROLES=5. Publish with evergreen copy, or noindex while under the threshold, rather than 404 |
| 9 | ai training jobs for software engineers | retitle /software-engineering audience to "software engineers & coders" | Transactional | programmatic | opentrain owns it. Already partly covered |
| 10 | how are ai training contractors paid and taxed (1099/Deel) | /blog/ai-training-contractor-taxes | Info | how-to | From prompts.csv. No page |
| 11 | what data do ai labs buy / why ai labs buy dead-startup data | /blog/what-data-do-ai-labs-buy | Info | explainer | Sell-data silo. The SERP is news only (MIT TR, Fast Company) |
| 12 | rlhf jobs / ai tutor jobs (synonym hubs) | later | Transactional | programmatic | Low priority. opentrain/upwork/ziprecruiter rank |

## 4. Proposed hub-and-spoke architecture
Clusters 1 and 2 are programmatic and go past the 2-4 posts-per-cluster limit on purpose. They are generated from listings data, so the limit applies to the editorial clusters (3-5).

**Global pillar: `/`.** Primary keyword "ai training jobs". Secondary: "ai trainer jobs", "remote ai training jobs".

- **C1. Profession hubs (transactional, programmatic).** Hub `/` (field grid). Spokes are the 25 field/collection pages plus nurses, teachers, accountants and dentists. Sub-hubs:
  - medicine → physicians, nurses, dentists
  - sciences-research → phds, chemists, physicists, biologists
  - language-audio ↔ bilingual
- **C2. Pay data (informational/commercial).** Sub-pillar `/pay-index` (self-canonical), primary keyword "micro1 pay per hour / ai trainer pay by field". Spokes:
  - /blog/how-much-do-ai-training-jobs-pay ("how much do ai training jobs pay")
  - /pay-index/YYYY-MM (archive)
  - future platform-pay posts
- **C3. Platforms and trust (commercial).** Sub-pillar `/micro1` ("is micro1 legit / micro1 review"). Spokes:
  - /micro1/interview (new)
  - /compare/micro1-vs-mercor (new)
  - /compare/micro1-vs-outlier (new)
- **C4. Getting started (informational).** Spokes:
  - /blog/get-paid-to-train-ai (new; acts as the cluster's sub-hub)
  - /blog/ai-training-jobs-no-experience
  - /blog/ai-training-jobs-for-lawyers (retitled to the how-to)
  - /blog/ai-training-contractor-taxes (new)
- **C5. Sell company data (separate B2B silo).** Pillar `/sell-company-data`. Spokes:
  - /sell-company-data/what-is-it-worth
  - /blog/how-to-sell-company-data-to-ai-labs
  - /blog/what-data-do-ai-labs-buy (new)
  - Only footer/header links to the jobs silo. Don't mix anchors.

## 5. Internal link matrix (adjacency list)
Notation: M = mandatory, R = recommended, O = optional. Rows marked **(missing)** don't exist today.

- `/` → M: every field/collection page (exists), /pay-index (footer only, so **add a body link**), /micro1 (footer only, so add a body link), /blog/get-paid-to-train-ai **(missing)**, /blog/ai-training-jobs-no-experience **(missing)**
- `/ai-training-jobs/{field}` → M: `/` (breadcrumb, exists). R: /pay-index#field-{slug} **(missing)**, /micro1 **(missing; give it a contextual link, not just the footer)**, sibling sub-hub links (medicine↔physicians↔nurses, sciences-research↔phds/chemists/physicists/biologists, language-audio↔bilingual) (partly exists via the generic grid, but has no contextual anchors)
- `/ai-training-jobs/law` → R: /blog/ai-training-jobs-for-lawyers **(missing)**
- `/ai-training-jobs/generalist` → R: /blog/ai-training-jobs-no-experience **(missing)**
- `/pay-index` → M: `/`, /blog/how-much-do-ai-training-jobs-pay **(missing)**, all editions (exists), field pages (exists), /micro1 (exists)
- `/pay-index/YYYY-MM` → M: /pay-index (the hub; make it explicit in the body)
- `/blog/how-much-do-ai-training-jobs-pay` → M: /pay-index (exists), `/` (exists), /micro1 (exists). R: platform comparisons **(missing)**
- `/micro1` → M: `/`, /micro1/interview **(missing)**, /compare/micro1-vs-mercor **(missing)**, /compare/micro1-vs-outlier **(missing)**, /pay-index (needs checking)
- `/micro1/interview`, `/compare/*` → M: /micro1, `/`. R: each other, /pay-index, the matching field pages
- `/blog/get-paid-to-train-ai` → M: `/`, /blog/ai-training-jobs-no-experience, /micro1, /pay-index. R: /compare/*
- `/blog/ai-training-jobs-no-experience` → M: `/`, /ai-training-jobs/generalist, /ai-training-jobs/bilingual, /blog/get-paid-to-train-ai
- `/blog/ai-training-jobs-for-lawyers` → M: /ai-training-jobs/law (exists), `/`, /pay-index
- `/sell-company-data` ↔ `/sell-company-data/what-is-it-worth` ↔ `/blog/how-to-sell-company-data-to-ai-labs` (exists, 311-312) ↔ `/blog/what-data-do-ai-labs-buy` (new)

Incoming-link check:
- After these fixes, every editorial spoke gets 3 or more contextual inbound links (pillar, sub-hub and sibling).
- The blog posts currently get inbound links only from /blog and the footer. None of them is linked from field pages. They are effectively orphans for topical flow.

## 6. Structured findings (Content Architecture, audit-data.json)
```json
{
  "category": "Content Architecture",
  "findings": [
    {"id":"CA-01","severity":"high","title":"medicine vs physicians cannibalization","evidence":"AUDIENCE.medicine='doctors'; doctors/physicians SERP overlap=4","fix":"Set medicine audience to 'healthcare professionals'; physicians owns doctor/physician queries; contextual cross-links","files":["web/lib/training-jobs.ts"]},
    {"id":"CA-02","severity":"high","title":"/micro1 targets three non-overlapping SERPs","evidence":"micro1 pay / legit / interview pairwise overlap=0","fix":"Split to /micro1 (review/legit), /micro1/interview (new), /pay-index (pay)","files":["web/app/micro1/page.tsx"]},
    {"id":"CA-03","severity":"high","title":"/pay-index canonical drifts monthly","evidence":"pay-index/page.tsx canonical=editionPath(latest); footer links /pay-index sitewide","fix":"Self-canonical evergreen /pay-index; editions as archives linking to hub","files":["web/app/pay-index/page.tsx","web/app/pay-index/[edition]/page.tsx"]},
    {"id":"CA-04","severity":"medium","title":"/law vs lawyers blog post","evidence":"Both target 'ai training jobs for lawyers'; /law has no link to blog","fix":"Retitle blog to how-to-get-work intent; add /law -> blog link","files":["web/lib/blog.tsx","web/app/ai-training-jobs/[field]/page.tsx"]},
    {"id":"CA-05","severity":"medium","title":"pay-index vs pay blog overlap","evidence":"pay SERPs overlap=3","fix":"Blog = cross-platform pay; index = micro1 by field; interlink both ways"},
    {"id":"CA-06","severity":"medium","title":"Field pages never link to editorial content","evidence":"[field]/page.tsx links only fields, collections, jobs","fix":"Add contextual links to pay-index anchor, /micro1, relevant blog post"},
    {"id":"CA-07","severity":"low","title":"sciences-research audience claims PhDs","evidence":"AUDIENCE='scientists & PhDs'; phds collection exists; overlap=0","fix":"Audience -> 'scientists'"},
    {"id":"CA-08","severity":"low","title":"/ai-training-jobs/other thin","fix":"noindex or merge into generalist"},
    {"id":"CA-09","severity":"medium","title":"Content gaps: platform comparisons/interview/get-paid guide","evidence":"micro1 vs mercor SERP empty; micro1 vs outlier weak; 'get paid to train ai' overlap 0 with head term","fix":"Ship /micro1/interview, /compare/micro1-vs-mercor, /compare/micro1-vs-outlier, /blog/get-paid-to-train-ai"},
    {"id":"CA-10","severity":"low","title":"Unpublished profession collections","evidence":"nurses/teachers/accountants/dentists/mathematicians gated by MIN_COLLECTION_ROLES=5","fix":"Publish with evergreen copy (or noindex under threshold); retitle /education for 'teachers'"},
    {"id":"CA-11","severity":"low","title":"Stale keyword artifacts","evidence":"keywords.csv/plan.csv target coding agents/MCP","fix":"Regenerate for AI-training niche from prompts.csv + this plan"}
  ]
}
```

## 7. Pre-delivery checks
- Every page has a unique primary keyword once the CA-01, CA-02, CA-04 and CA-07 retargets are done.
- Every spoke links to its pillar/sub-pillar, and every pillar links to its spokes, under the matrix in section 5.
- No orphans once CA-06 is applied.
- Editorial clusters C3-C5 each hold 3-4 posts. C1 and C2 are programmatic and exempt.
- Word-count targets: pillars and sub-pillars (/micro1, /pay-index, /sell-company-data) 2500-4000 words; editorial spokes 1200-1800 words. Programmatic field pages are listing-driven and need about 300-500 words of unique copy each.
- Caveat on SERP-overlap support: several pairs were tested only for separation (0-1). Cluster grouping for C3-C5 is based on topic and intent, not on 4+ overlap.
