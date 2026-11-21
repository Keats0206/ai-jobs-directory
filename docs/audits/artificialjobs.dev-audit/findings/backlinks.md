# Backlink Profile: artificialjobs.dev (www)
Date 2026-10-27. Tier 0 (Common Crawl + verification only; no Moz/Bing/DataForSEO keys). Health score: **INSUFFICIENT DATA** (fewer than 4 scoring factors have data; no numeric score given).

## Data
| Metric | Result | Source / confidence |
|---|---|---|
| CC web graph (cc-main-2026-jan-feb-mar) | Not in crawl, not in rankings; PageRank, harmonic centrality null | Common Crawl, domain-level, 0.50. Graph is quarterly and predates the site's recent growth, so "absent" means "too new/small", not "zero links". |
| Referring domains, DA/PA, spam score, anchors, velocity | No data | No source configured |

## What works
- Site is well positioned for link earning: citable assets live (200 OK) at /pay-index/2026-10 and /blog/ai-training-jobs-for-lawyers (direct fetch, 0.95).
- The backlink_plan.md is specific (niche depth on micro1, CC BY CSV, data-first outreach) and has no spam or paid-link tactics.

## Plan link verification (backlink_plan.md, all 9 tracking rows are blank)
Checks run 2026-10-27, direct fetches/APIs (0.90). No planned link is live.
| Planned link | Status |
|---|---|
| Zenodo DOI | Not found (Zenodo API search "artificialjobs": 0 records) |
| Hugging Face artificialjobs/micro1-pay-index | Not found (author listing empty; page returns 401, HF's response for nonexistent repos) |
| Kaggle | Not verifiable (search page is JS-rendered); no evidence it exists, tracking row blank |
| Candyfloss directory | Page live, 0 mentions of artificialjobs |
| awesome-ai-training-jobs | README has 0 mentions; GitHub issue not verified (only 2 hits, both in owner's own repo Keats0206/ai-jobs-directory) |
| Show HN / press / writers | No HN story with the domain (Algolia URL search: 0 hits); press and email replies cannot be observed externally |

## Findings
1. **HIGH: Effectively zero third-party link footprint.** Absent from CC graph and none of the 5 quick-win links exist. Evidence above. Fix: execute plan quick wins 1-4 (Zenodo, HF, Kaggle, Candyfloss) first; these are about 1 hour total and produce indexable, followable-or-citable references. Log each in the Tracking table.
2. **MEDIUM: Pay Index JSON has `"doi": null`** (per plan). Fix: mint the DOI, then add it to Dataset schema `identifier`/`sameAs` so it ties dataset pages back to the site.
3. **MEDIUM: Competitors hold the citation slots** (aitrainer.work awesome-list, AITraining.jobs Datarade, per plan; not independently verified). Fix: lead with micro1 depth; prioritise physician/legal writer outreach where existing pages lack current numbers.
4. **LOW: No monitoring.** Fix: add Bing Webmaster Tools (free, verifies owned property) and Moz free key (2,500 rows/month) to get a real referring-domain baseline; re-run in 4-6 weeks. HF/Kaggle/GitHub links are often nofollow, so value is mainly AI-citation and discovery, not PageRank.

## Caveats
- Tier 0 only. Absence in Common Crawl and in my spot checks is not proof of zero backlinks; I could not query a link index (Ahrefs MCP exists in the environment but was not used per instructions).
- Toxic-link ratio, anchor naturalness, velocity, follow ratio, geography: not scored (no source).
- Third-party page content was treated as untrusted data.
