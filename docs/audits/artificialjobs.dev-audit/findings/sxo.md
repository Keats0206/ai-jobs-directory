# SXO Findings: artificialjobs.dev

Date: 2026-10-27. This SXO Gap Score is separate from the SEO Health Score.
Method: target pages rendered with `render_page.py --mode always` (Playwright). None are SPA shells; the server HTML matches the rendered DOM. SERPs came from WebSearch (US). Two competitor pages were fetched for side-by-side checks. All fetched content was treated as untrusted data.

## Primary finding (lead)

**HIGH: Scope mismatch, not page-type mismatch.** For the main job queries, the site uses the right page type: a job-listing hub with category pages. The SERP, however, rewards *multi-platform* AI-training aggregators that have filters, alerts, and platform comparisons. Examples are aitrainer.work, opentrain.ai, aitraining.jobs, and skillora.ai. Artificial Jobs lists **micro1 only**. All 307 roles are micro1, and no parsed page mentions Outlier, Mercor, DataAnnotation, Alignerr or Handshake. Competitor evidence: aitrainer.work/jobs/law shows 223 legal roles from 13 platforms (Mercor 109, micro1 56, AfterQuery, RWS, Turing). It has 8 filter groups, weekly email plus browser alerts, and links to "Compare platforms" and "Pay tracker". In the same SERP, /ai-training-jobs/law has 50 micro1 roles, no filters and no alerts. As a result the site looks like a thinner duplicate of what already ranks.

**CRITICAL: No page exists for "outlier ai alternatives" or other comparison intent.** That SERP is 100% Comparison pages (G2, Capterra, jumptask, getaiwork "12 AI Training Platforms Compared", selfmadesuccess). The site has no comparison or alternatives page at all, so it is not in the running.

## SERP backwards analysis

| Query | Top-10 composition (classified via taxonomy) | Dominant type / confidence | SERP features & signals | Matching page | Mismatch |
|---|---|---|---|---|---|
| ai training jobs | LinkedIn, Indeed x5, ZipRecruiter (job search engines); Braintrust (platform landing); The Muse (guide) | Job listing aggregator, 7/9 = 78% | Massive-volume boards ("229,000+ jobs"), location variants (Texas, Boston, NY) | / (home) | MEDIUM: right type, but the head term is held by mega-boards. Winnable variant: "ai training jobs for experts/professionals" |
| get paid to train ai | Mindrift, Braintrust, Handshake AI, JumpTask, Workbolt (platform Landing); opentrain blog + Goodreads (Blog); aitraining.jobs, nogigiddy (aggregators) | Landing/Hybrid, 5/9 = 55% | Pay ranges in titles ("$15-$100+/hr"); "no experience" angle | / (H1 "Get paid to train AI") | ALIGNED. The H1 matches; the gaps are trust and platform breadth |
| remote ai training jobs for lawyers | opentrain x2, skillora (/ai-training-jobs/law, same URL pattern), aitrainer.work x2, ZipRecruiter, remotejobleads (listing pages); Mindrift, Parailabs (platform pages) | Job category listing, 7/9 = 78% | Rates in titles; multi-platform; guide plus listing pairs (aitrainer.work ranks both /guides/legal-ai-training-jobs and /jobs/law) | /ai-training-jobs/law (+ /blog/ai-training-jobs-for-lawyers) | ALIGNED on type. HIGH on scope (single platform) |
| ai training jobs for doctors/physicians | annotation.academy guide x2, remotive, mozibox, Handshake on VC job boards x3, a direct jobs.micro1.ai post | Mixed listings + guide, ~60% listings | micro1's own posting ranks directly | /ai-training-jobs/medicine AND /ai-training-jobs/physicians | ALIGNED. MEDIUM cannibalization (two pages, same intent) |
| micro1 pay | Glassdoor salaries; secondtalent, aitraining.jobs, knackboard, aiworkexpert, remowork, paidtaskers, aigigjobs x2, remoteworkunion (reviews) | Review/Blog hybrid, 9/10 = 90% | "Is it legit?" framing in 6/10 titles; payout mechanics (Deel, semi-monthly vs weekly); CNBC pay-stub anecdote | /micro1 | ALIGNED. The title "micro1 Review: Pay, AI Interview & Is It Legit?" matches. Content gaps below |
| is micro1 legit | selfmadesuccess, Glassdoor reviews x3 (incl. "fake jobs" review), Trustpilot, eesel x2, paybillke | Review / UGC, ~90% | Strongly trust-seeking; negative UGC ranks | /micro1 | ALIGNED on type. HIGH on trust (see F4) |
| how much do ai training jobs pay per hour | Mercor resource, opentrain blog + /jobs/pay-rates, keepertax, moneypantry, ZipRecruiter salary, raenest, IEEE DataPort "AI training jobs and pay snapshot 2026-10-12" | Blog/data, ~80% | Answer-first numbers ($31 avg vs $70 listing median); dataset pages rank (IEEE) | /blog/how-much-do-ai-training-jobs-pay, /pay-index | ALIGNED. The Pay Index is a strong fit (a dataset page ranks) |
| outlier ai alternatives | G2, Capterra, softwaresuggest, jumptask, selfmadesuccess, getaiwork, toolify, rigorousthemes, softwareworld | Comparison, 9/9 = 100% | Listicles "10 Best..."; entity ambiguity (Outlier BI tool) | none | CRITICAL: missing page |

## What works

- **Category page titles mirror the SERP pattern exactly.** "50 Best AI Training Jobs for Lawyers (October 2026) — Up to $400/hr" uses a count, the month, and the pay ceiling, the same formula as the ranking titles ("$30-$134/hr Remote Ai Training Jobs", "micro1 Jobs: 250 Open Roles").
- **Answer-first intros with live numbers.** /ai-training-jobs/law opens with "50 open... Top-of-range pay runs from $70 to $400/hr, with a median of $170/hr". That is snippet-ready and better than most aggregators.
- **/micro1 matches the review intent.** It has a "The short answer" block that gives a legit verdict and pay caveats, a pay-by-field table, a 4-step hiring process, and FAQPage schema.
- **The Pay Index is a well-differentiated asset.** It carries Dataset + DataDownload schema, a CSV, CC BY 4.0, and a citation block. IEEE DataPort's dated pay snapshot ranks for the pay query, which shows Google rewards this format.
- **Job detail pages have valid JobPosting schema** (CONTRACTOR, datePosted, validThrough, MonetaryAmount, applicantLocationRequirements). Apply links carry `rel="sponsored"`.
- **Freshness is real.** Listings refresh daily and "Updated October 2026" stamps appear on the pages.
- **Referral disclosure exists**, in the homepage FAQ ("How does Artificial Jobs make money?").

## Findings (severity-tagged)

### F1 CRITICAL: No comparison or alternatives pages for the platform-shopping intent
- Evidence: the "outlier ai alternatives" SERP is 100% comparison pages. aitraining.jobs/platforms/micro1 links to six "micro1 vs" head-to-head pages and four platform cards. A grep of web/app finds no outlier, alternatives, or vs routes. Mercor appears only in /sell-company-data.
- Fix: build /alternatives/outlier, plus /compare/micro1-vs-mercor, /compare/micro1-vs-outlier and /compare/mercor-vs-outlier. Each needs a comparison table (pay range, intake: open/screened/credentialed, payout method, interview type, countries), a "best for [lawyer/physician/generalist]" verdict, and ItemList schema. Use your own micro1 pay data as the differentiator. A Mercor referral code already exists in lib/data-partnerships.ts.

### F2 HIGH: Single-platform inventory against multi-platform SERP winners
- Evidence: 307/307 roles come from micro1. The competitor law page lists 223 roles from 13 platforms. The homepage claims "Hourly expert work for lawyers, doctors..." without saying the roles are micro1 only until the "How it works" step.
- Fix (in order): (a) Add Mercor listings, which have the most volume in legal/medical in the competitor data. (b) Until then, say "micro1" in the hero and position it honestly: "Every open micro1 role, ranked by pay". This matches the /micro1 and Pay Index authority you already have, and it avoids setting multi-platform expectations the page can't meet.

### F3 HIGH: No filters, search, or job alerts on listing pages
- Evidence: /, /ai-training-jobs/law and /ai-training-jobs/medicine have 0 forms. The homepage is a single ~1,470-word scroll of 19 field blocks. A newsletter exists only at /newsletter, and its copy is stale ("A weekly selection of AI engineering jobs from employer hiring feeds"). Both competitors offer alerts (aitrainer.work: "500+ subscribers"; aitraining.jobs: two signup forms per page).
- Fix: add a "Get new [Law] roles by email" capture under the intro on every /ai-training-jobs/[field] page, and fix the /newsletter copy. Add client-side filters for pay floor, country/US-only, and hourly vs salaried. Alerts are the retention loop for a contract-work audience that comes back when projects dry up.

### F4 HIGH: /micro1 review lacks the trust content the "is micro1 legit" SERP rewards, and its referral disclosure is missing on that page
- Evidence: /micro1 has 0 mentions of Deel, payment schedule, Trustpilot, Glassdoor, Reddit, complaints or scams. It has no author byline and no Review/Article schema. The SERP is full of payout mechanics (semi-monthly vs weekly via Deel) and negative UGC (a Glassdoor review alleging "fake jobs... to increase number of Signups"). The referral-fee disclosure appears on the homepage FAQ but not on /micro1, even though every Apply link there carries a referral code.
- Fix: add a "How you get paid" section (Deel contract, KYC, payout cadence, approved-hours-only). Add a "Common complaints" section that addresses the fake-jobs and interview-ghosting claims with your own data, for example the share of listings live at least 30 days. Add a dated third-party ratings snapshot, a named author with a bio, and Article schema with author. Put a one-line referral disclosure above the first Apply link.

### F5 HIGH: Data-quality errors in the homepage "Best-paying roles" block
- Evidence: "Software Engineering Specialist", "Finance Specialist", "Consulting Specialist", "Data Science Specialist" and "Brand & Creative Strategy Expert" all show the identical skills "Microsoft PowerPoint · Slide Reconstruction · Presentation Design" at $150–$350/hr. Five of the seven featured rows show this, so a lawyer or engineer scanning the first screen sees what looks like a spam template. "Specialist" (/ai-training-jobs/other, 48 roles, the second-largest field) is a catch-all label that does not describe a profession.
- Fix: dedupe template-cloned roles in the "best-paying" selector, for example by limiting one skill-set signature per block. Re-map "Specialist/other" roles into real fields, or rename the field to something like "Slide & document specialists" if that is what it is.

### F6 MEDIUM: Cannibalization between overlapping pages
- Evidence: /ai-training-jobs/medicine ("24 Best AI Training Jobs for Doctors") and /ai-training-jobs/physicians ("17 Best... for Physicians") target the same intent with overlapping roles. /ai-training-jobs/law and /blog/ai-training-jobs-for-lawyers both target "ai training jobs for lawyers". aitrainer.work makes this pattern work by clearly splitting guide intent from jobs intent.
- Fix: keep /physicians as a strict subset (MD/DO-only roles) and point its canonical anchor text at "physician" queries. Retitle /medicine to "Medical & Healthcare" to cover nurses, coders and dentists. Re-angle the blog post toward "what the work is like / licensing / malpractice / conflicts" questions, and link to the category page as the jobs destination.

### F7 MEDIUM: Thin category pages and missing ItemList schema
- Evidence: /ai-training-jobs/medicine has ~480 words, and /physicians and /generalist have ~460. Category pages have only 2 FAQ questions and no ItemList. The competitor's law page FAQ answers licensing, practicing while employed, task types, and hourly vs per-task.
- Fix: add a 4–6 question, field-specific FAQ (for law: "Do I need an active bar license?", "Can I do this while employed at a firm?", "Is this practicing law?"). Add a "What the work looks like" block that draws on job descriptions, and add ItemList schema of JobPosting URLs.

### F8 LOW: No visual trust signals
- Evidence: there are 0 images on all parsed pages, with no platform logos, no screenshots of the micro1 interview, and no founder photo.
- Fix: add a micro1 logo and interview screenshot to /micro1, a pay-by-field chart image to the Pay Index (good for image search and citation), and an author headshot.

## SXO Gap Scores (out of 100)

| Dimension | Home (/) vs "get paid to train ai" | /ai-training-jobs/law vs "remote ai training jobs for lawyers" | /micro1 vs "micro1 pay / is micro1 legit" | /pay-index vs "how much do ai training jobs pay" |
|---|---|---|---|---|
| Page Type (15) | 11: listing hub; SERP mixes platform landings | 13: aligned listing | 13: aligned review | 13: dataset ranks |
| Content Depth (15) | 9 | 8: 2 FAQs, no "what to expect" | 9: no payout/complaints | 10 |
| UX Signals (15) | 6: no filter/alerts; PowerPoint clones above the fold | 8: ranked list, answer-first intro | 10: short answer + table | 11: table + CSV |
| Schema (15) | 8: WebSite/Org/FAQ | 8: Breadcrumb/FAQ, no ItemList | 6: FAQ only, no Article/author | 13: Dataset/DataDownload |
| Media (15) | 2 | 2 | 2 | 3 |
| Authority (15) | 5: single source, disclosure buried | 5 | 4: no author, no 3rd-party ratings, no disclosure on page | 9: citation block, CC BY |
| Freshness (10) | 9 | 9 | 9 | 9 |
| **SXO Gap Score** | **50** | **53** | **53** | **68** |

Missing page for "outlier ai alternatives": SXO Gap Score 0 (no candidate).

## User stories (each cites a SERP signal)

1. **Awareness.** As a practicing attorney, I want to know whether AI training work is real and what it involves, because I'm curious but wary of side-gig scams, but I'm blocked by listings that don't explain the task or the license implications. *Signal: aitrainer.work's law FAQ ("Whether a licensed attorney is needed", "Whether you can do this while practicing law"); the "remote ai training jobs for lawyers" SERP pairs guide and listing pages.*
2. **Consideration.** As a credentialed expert, I want to compare micro1 against Mercor and Outlier on pay and acceptance, because I don't want to waste time on a low-yield interview, but I'm blocked because Artificial Jobs shows only one platform. *Signal: the 100%-comparison SERP for "outlier ai alternatives"; getaiwork's "12 AI Training Platforms Compared"; aitraining.jobs' "micro1 vs" pages.*
3. **Consideration (trust).** As a cautious applicant, I want to know how and when micro1 actually pays, because I've seen "fake jobs" claims, but I'm blocked by a review page that never mentions Deel, payout cadence or complaints. *Signal: Glassdoor "fake jobs" review ranking for "is micro1 legit"; payout schedule disagreements in the "micro1 pay" SERP.*
4. **Decision.** As a physician with limited time, I want to see only MD/DO roles above $150/hr that I can do from my country, because my time is expensive, but I'm blocked by no pay or country filters and split /medicine vs /physicians pages. *Signal: physician SERP pay range of $80–$200/hr; "Some roles are country-restricted" (Prolific UK-only listing).*
5. **Retention.** As a contractor whose project just ended, I want to be alerted when new roles in my field open, because hours aren't guaranteed, but I'm blocked by no alert signup on field pages. *Signal: "passing the AI interview does not guarantee paid work" across micro1 reviews; both competitors run alert signups.*

## Persona scoring

Personas: **Credentialed Professional** (lawyer/physician; Decision), **Skeptical Vetter** ("is micro1 legit"; Consideration), **Platform Shopper** ("outlier alternatives"; Consideration). They are weighted toward the Credentialed Professional because the highest-value queries and the referral revenue sit there.

| Page | Persona | Relevance | Clarity | Trust | Action | Total |
|---|---|---|---|---|---|---|
| /ai-training-jobs/law | Credentialed Professional | 20 | 20 | 12 | 18 | **70** Good |
| /ai-training-jobs/law | Platform Shopper | 8 | 15 | 10 | 8 | **41** Needs Work |
| /micro1 | Skeptical Vetter | 18 | 19 | 9 | 14 | **60** Good (borderline) |
| /micro1 | Platform Shopper | 10 | 15 | 10 | 8 | **43** Needs Work |
| / (home) | Credentialed Professional | 17 | 13 | 10 | 17 | **57** Needs Work |
| / (home) | Skeptical Vetter | 12 | 12 | 9 | 10 | **43** Needs Work |

Weakest persona first:
1. **Platform Shopper (41–43).** No comparison exists anywhere. Fix: F1 comparison pages, plus an "Also hiring on Mercor/Outlier" cross-link module on /micro1 and the field pages.
2. **Skeptical Vetter (43–60).** Trust is the lowest dimension for every persona (9–12/25). Fix: F4 (payout mechanics, complaints, author, disclosure above the fold) and a homepage trust strip ("Data from micro1's public listings · refreshed daily · we earn a referral fee").
3. **Credentialed Professional on home (57).** Clarity is low because the first screen shows PowerPoint-clone "Specialist" roles. Fix: F5, and make "Browse by field" the first block for lawyers and doctors.

## Cross-skill references
- `/seo content`: E-E-A-T on /micro1 and the blog (no author, no first-hand evidence).
- `/seo schema`: ItemList on field pages; Article + author on /micro1; ItemList for future comparison pages.
- `/seo page`: thin pages /ai-training-jobs/medicine, /physicians and /generalist (~460–480 words).
- Local: not applicable; no local pack seen.

## Limitations
- WebSearch gives US results as a link list with summaries. It does not report ad density, AI Overview presence or citations, PAA boxes, featured-snippet format or exact positions, so the SERP feature analysis is inferred from titles and snippets.
- No search volume or ranking data was pulled (no GSC/Ahrefs in this pass). keywords.csv in the repo comes from an earlier "AI engineer jobs / coding agents" positioning and was not used.
- Only two competitor pages were fetched in full. Other SERP results were classified from their title, URL and snippet.
- Persona weights are estimated, not derived from traffic.
- No wireframe was requested.

Generate a PDF report? Use `/seo google report`.

### Structured findings (audit-data.json, category: Search Experience)
```json
[
 {"id":"SXO-1","severity":"critical","title":"No comparison/alternatives pages","url":null,"query":"outlier ai alternatives","fix":"Build /alternatives/outlier + micro1-vs-mercor/outlier compare pages with tables and ItemList"},
 {"id":"SXO-2","severity":"high","title":"Single-platform (micro1-only) inventory vs multi-platform SERP winners","url":"/","fix":"Add Mercor listings; meanwhile state micro1 scope in hero"},
 {"id":"SXO-3","severity":"high","title":"No filters or job alerts on listing pages; /newsletter copy stale","url":"/ai-training-jobs/*","fix":"Field-level email alerts + pay/country filters"},
 {"id":"SXO-4","severity":"high","title":"/micro1 review missing payout, complaints, author, and on-page referral disclosure","url":"/micro1","fix":"Add How you get paid, Common complaints, author + Article schema, disclosure above first Apply"},
 {"id":"SXO-5","severity":"high","title":"PowerPoint-template clone roles dominate homepage best-paying block","url":"/","fix":"Dedupe by skill signature; remap Specialist/other field"},
 {"id":"SXO-6","severity":"medium","title":"Cannibalization medicine vs physicians; law category vs lawyers blog","url":"/ai-training-jobs/medicine","fix":"Differentiate scope and intent; cross-link"},
 {"id":"SXO-7","severity":"medium","title":"Thin category pages, 2-question FAQ, no ItemList","url":"/ai-training-jobs/*","fix":"Field-specific FAQ + what-the-work-looks-like + ItemList"},
 {"id":"SXO-8","severity":"low","title":"Zero images sitewide on audited pages","url":"/","fix":"Logos, interview screenshot, pay chart, author photo"}
]
```
