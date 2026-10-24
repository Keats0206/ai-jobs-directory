# Minting a DOI for each Pay Index edition (Zenodo, free)

A DOI makes each edition a citable dataset. That's how aitrainer.work and AITraining.jobs get quoted on pay questions. You do this from your own Zenodo account; it takes about 5 minutes a month.

1. Sign in at https://zenodo.org (GitHub login works) → **New upload**.
2. Upload `web/public/pay-index/YYYY-MM.csv`.
3. Fill in:
   - **Resource type:** Dataset
   - **Title:** micro1 Pay Index, October 2026
   - **Creators:** Artificial Jobs (organization)
   - **Description:** paste the bold summary paragraph from the edition page, then: "Monthly, frozen snapshot of advertised hourly pay for AI training roles on micro1, by field. Methodology: https://www.artificialjobs.dev/pay-index/2026-10#methodology"
   - **License:** Creative Commons Attribution 4.0 International
   - **Keywords:** AI training jobs, AI trainer pay, micro1, RLHF, hourly rates, labor market
   - **Related identifiers:** "Is supplement to" https://www.artificialjobs.dev/pay-index/2026-10
   - **Publication date:** the edition's `published` date
4. Publish. For November onward, open the October record and choose **New version**, so every edition shares one "concept DOI".
5. Paste the DOI (e.g. `10.5281/zenodo.1234567`) into `"doi"` in `web/data/pay-index/YYYY-MM.json`. Commit and push. The page, citation block and Dataset schema pick it up automatically.
