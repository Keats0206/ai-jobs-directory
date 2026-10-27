# Backlink & Brand Presence Plan: Artificial Jobs

**Generated:** 2026-10-25
**Based on:** live site (artificialjobs.dev, sitemap + page copy 2026-10-25), reddit_opportunities.md, docs/zenodo-pay-index.md, docs/press-pitch-data-deals.md. `brand_dna.md` is stale (pre-pivot), so I didn't use it.
**Time budget:** assumed ~2 hours/week (none stated). No existing channel activity found, so nothing is skipped as "already active".
**Baseline:** 313 views/wk (Oct 18–24), 26 from Google, 0 tracked conversions.

---

## Summary

- **Total opportunities found:** 14
- **Quick Wins (this week):** 5
- **High Value (this month):** 4
- **Long Play (later):** 2
- **Skipped:** 3

**Read this first.** Your assets compete directly with bigger, multi-platform aggregators that already hold these citation slots:

| Competitor | What they have that you don't |
|---|---|
| aitrainer.work | 4,364 listings across 25 platforms, `llms.txt` with a pay summary, and it maintains the only awesome-list (github.com/pietro93/awesome-ai-training-jobs, linked from sindresorhus/awesome) |
| AITraining.jobs | ~60 platforms, open CC BY JSON (`pay.json`, `roles.json`), a Datarade dataset listing, research pages, and a sister data marketplace (AIData.Broker) covering the company-data side |
| HumanSourcer | 76 providers and its own "Pay Index" (n=737 rates, 29 platforms) |
| HireFeed | Another "Pay Index" |
| Vaultfish / Korra / Smelted | Company-data guides and deal trackers |

Your one differentiated asset is **depth on micro1** (every listing, by field, monthly, with CSV). Every action below leans on that rather than pretending to be broad.

## Target GEO Prompts

1. "How much does micro1 pay [lawyers / doctors / PhDs]?"
2. "What does micro1 pay by field?"
3. "Is micro1 worth it for a [profession]?"
4. "What is my startup's Slack / email data worth to AI labs?"
5. "Which companies have sold their internal data to AI companies, and for how much?"

---

## Quick Wins (This Week)

### 1. Zenodo: mint a DOI for the October Pay Index

**URL:** https://zenodo.org (steps in `docs/zenodo-pay-index.md`)
**Why:** A DOI makes the dataset citable and indexed by OpenAIRE, Google Dataset Search and DataCite. `web/data/pay-index/2026-10.json` still has `"doi": null`.
**Effort:** ~10 minutes
**Action:** Follow the existing doc, then paste the DOI into the JSON and push.

---

### 2. Hugging Face Datasets: publish the Pay Index CSV

**URL:** https://huggingface.co/new-dataset
**Why:** HF dataset pages are high-authority, crawled by AI engines, and nobody in this niche has one (AITraining.jobs chose Datarade).
**Effort:** ~20 minutes
**Action:** Create `artificialjobs/micro1-pay-index`, upload `web/public/pay-index/2026-10.csv`, licence CC-BY-4.0.

**Draft (dataset card README):**

> # micro1 Pay Index
>
> Monthly snapshot of advertised hourly pay for AI training roles on micro1, by field. One row per field per edition.
>
> **October 2026 (snapshot 2026-10-24):** 270 open hourly roles; median posted range $50–$90/hr. Highest-paying fields by median top rate: Science & Research ($200/hr), Law ($170/hr), Finance ($150/hr). Highest posted rate: $400/hr.
>
> **Columns:** `edition, snapshot_date, field_slug, field, roles, hourly_roles, median_low_usd_hr, median_high_usd_hr, p90_high_usd_hr, max_high_usd_hr, high_demand_roles`
>
> **Limits:** advertised ranges only, not earnings or contract rates. Covers micro1's public board only. Fields under 5 roles are small samples.
>
> **Source & methodology:** https://www.artificialjobs.dev/pay-index/2026-10#methodology
>
> **Licence:** CC BY 4.0. Cite as: Artificial Jobs, *micro1 Pay Index, October 2026*.

**Link to include:** https://www.artificialjobs.dev/pay-index/2026-10

---

### 3. Kaggle Datasets: same CSV

**URL:** https://www.kaggle.com/datasets (New Dataset)
**Why:** A second high-authority dataset host. Kaggle pages rank for "[topic] dataset" searches.
**Effort:** ~15 minutes
**Action:** Reuse the HF card text. Tags: `employment`, `artificial intelligence`, `income`.

---

### 4. Candyfloss directory: request a listing under "Aggregators and trackers"

**URL:** https://candy-floss.ai/ai-training-jobs
**Why:** A 215-entry directory that already lists competitors (AITraining.jobs, aitrainer.work, GetAIWork) in its aggregator section. You're absent.
**Effort:** ~10 minutes (find the contact/suggest link on the page)
**Action:** Send this suggestion.

**Draft:**

> Hi, suggesting an addition to "Aggregators and trackers": **Artificial Jobs** (artificialjobs.dev), which tracks every open micro1 AI-training role (~300) by field with posted pay, plus a monthly micro1 Pay Index with a free CSV (CC BY 4.0): https://www.artificialjobs.dev/pay-index/2026-10. Narrower than the multi-platform boards you list, but deeper on micro1 specifically. Disclosure: I run it, and apply links carry a micro1 referral code.

---

### 5. awesome-ai-training-jobs: open an issue (low odds, 5 minutes)

**URL:** https://github.com/pietro93/awesome-ai-training-jobs/issues/new
**Why:** It's the only awesome-list in the category and it's linked from sindresorhus/awesome. It's maintained by aitrainer.work, a direct competitor, so expect a no. The issue itself is a public GitHub page, though.
**Effort:** ~5 minutes
**Action:** The README says to suggest resources by opening an issue.

**Draft:**

> **Suggestion: micro1 Pay Index (Tools & Resources)**
>
> A monthly, open (CC BY 4.0) CSV of advertised micro1 pay by field, e.g. October 2026: 270 hourly roles, median $50–$90/hr, Law median top rate $170/hr. Could fit under Tools & Resources or the micro1 platform row as a data source.
> https://www.artificialjobs.dev/pay-index/2026-10
>
> Disclosure: I maintain it.

---

## High Value (This Month)

### 1. Hacker News: Show HN for the company-data deal tracker + estimator

**URL:** https://news.ycombinator.com/submit
**Why:** HN covered this story four times this year (item 47811748, 42 pts, 11 comments; 47869253, 25 pts; 47801494, 40 pts; the MIT Tech Review piece, 50069765, got 2 pts and 0 comments on Oct 13). Commenters asked "How are these worth $100k?" and nobody answered with data. Your page does.
**Effort:** ~30 minutes plus an hour around posting to answer comments. Post on a weekday, 8–10am US Eastern.
**Action:** Before posting, consider a version of the page without referral codes in the body (HN reacts badly to affiliate links). Disclose either way.

**Draft:**

> **Title:** Show HN: Every reported sale of company data to AI labs, and a rough estimator
>
> **URL:** https://www.artificialjobs.dev/sell-company-data/what-is-it-worth
>
> **Text:** After the Forbes/Gizmodo/MIT Tech Review stories on dead startups selling Slack and Jira archives, the HN threads kept asking the same thing: how is a failed startup's Slack worth $100k? I collected every publicly reported deal I could find, from ~$10k small-startup archives (SimpleClosure) to Google's $10M for Spirit Airlines' emails and Teams messages, with sources, and built a rough estimator: headcount × years of records, adjusted for which tools you have (Slack, tickets, code, email, docs).
>
> It's crude. Buyers price on "research theses", per Surge's Nick Heiner in MIT TR, and no one has published the per-task math. I'd especially like corrections from anyone who's done one of these deals.
>
> Disclosure: I run the site, and it carries micro1 and Mercor referral codes for data partnerships.

---

### 2. Press: send the existing deal-tracker pitch

**URL:** pitch drafted in `docs/press-pitch-data-deals.md`
**Why:** One mention in MIT Tech Review / Gizmodo / Forbes is worth more than everything else in this plan for both Google and AI citations. Matthew King's MIT TR piece (Oct 13) is the freshest.
**Effort:** ~45 minutes for 5 personalised emails
**Action:** Send one at a time from your own inbox, as the doc says. Lead with King.

---

### 3. Physician side-income writers: offer micro1 medicine data for their tables

**URLs:**
- https://www.physiciansidegigs.com/ai-side-gigs-for-doctors (Nisha Mehta, MD; updated Jul 2026)
- https://medmoneyguide.com/guides/physician-ai-training-side-gig (Joshua Dunigan, DO; has a rate table)
- https://mozibox.com/articles/1769 (reports physicians offered "under $50/hr" on micro1)

**Why:** All three already discuss micro1 pay but with second-hand or stale figures. You have the current listed numbers (Medicine: 24 roles, median $80–$115/hr, 90th pct $221/hr, max $285/hr, Oct 24). These pages are what AI engines quote for "AI training for doctors".
**Effort:** ~30 minutes for 3 emails
**Action:** Send short, data-first emails.

**Draft:**

> Subject: Current micro1 physician rates for your AI-training guide
>
> Hi Dr. [name], your [guide] is one of the few that's honest about how variable micro1 rates are for doctors. In case it's useful for an update: as of Oct 24, micro1 had 24 open medicine roles with a median posted range of $80–$115/hr, a 90th-percentile top rate of $221/hr and a max of $285/hr. That's advertised ranges, not offers, which fits your point about low offers after onboarding. The full table and CSV (free to cite, CC BY 4.0) are here: https://www.artificialjobs.dev/pay-index/2026-10. I update it monthly. No ask beyond that. Happy to send next month's numbers if helpful.
>
> [Your name], Artificial Jobs

---

### 4. Legal AI-training writers: same, for Law

**URLs:**
- https://www.businessinsider.com/lawyers-moonlighting-ai-training-mercor-micro1-2026-7 (Melia Robinson; BI wrote "Micro1 says compensation ranges based on different levels of seniority" without numbers)
- Sara Kubik on LinkedIn (posts Mercor lawyer roles; https://www.linkedin.com/posts/sarakubik_ai-aitraining-activity-7474124104053313536-3Fta)

**Why:** BI had no micro1 lawyer numbers. You have them: 50 roles, median $95–$170/hr, top $400/hr.
**Effort:** ~20 minutes
**Action:** Adapt draft #3 with the Law row. Link https://www.artificialjobs.dev/blog/ai-training-jobs-for-lawyers.

---

## Long Play (Plan for Later)

### 1. Go multi-platform, or own micro1 completely

**Why:** Every channel above already has a broader competitor in it. Either add Mercor/Alignerr/Handshake/AfterQuery (all publish rates), or become *the* micro1 reference with things nobody else has: offer-vs-listing survey data, interview prep, time-to-first-project data.
**What's needed:** your decision. This changes what every future pitch can say.

### 2. Quora answers

**URL:** none found. Exa returned only one stale 2019 question ("Will 'AI trainer' be a common job in the future?").
**Why:** Quora is cited by AI engines, but there's no live demand in this niche yet.
**What's needed:** re-search monthly. Answer only when a question names micro1 or expert pay.

---

## Skipped Opportunities

| Channel | URL | Reason Skipped |
|---------|-----|---------------|
| Old HN data-sale threads | https://news.ycombinator.com/item?id=47811748 | 6 months old. Late replies get no visibility. Use a fresh Show HN instead. |
| Wikipedia | n/a | No notability, and referral-funded sources won't survive editing. |
| G2 / Capterra / Product Hunt | n/a | Built for software buyers, not job seekers. A micro1-only board has no PH story. |

---

## Recurring Actions

| Cadence | Action | Channel | Notes |
|---------|--------|---------|-------|
| Monthly (on each Pay Index edition) | New Zenodo version, update HF + Kaggle CSV, email the 3–5 writers who used last month's numbers | Datasets, email | ~45 min. The repeat sends are what build the citation habit. |
| Weekly | Search HN for "Mercor", "micro1", "AI training", "startup data" | Hacker News | https://hn.algolia.com, last week, stories |
| Weekly | Answer 2–3 micro1 interview/wait threads, no referral links | r/micro1_ai | See reddit_opportunities.md |
| Monthly | Check new aggregator directories and "best AI training sites" roundups for listing requests | Web | Query: "AI training jobs" aggregators OR directory |

---

## Tracking

| # | Channel | Action Taken | Date | Result | Link Gained? |
|---|---------|-------------|------|--------|-------------|
| 1 | Zenodo | | | | |
| 2 | Hugging Face | | | | |
| 3 | Kaggle | | | | |
| 4 | Candyfloss | | | | |
| 5 | awesome-ai-training-jobs | | | | |
| 6 | Show HN | | | | |
| 7 | Press (MIT TR first) | | | | |
| 8 | Physician writers | | | | |
| 9 | Legal writers | | | | |
