# Schema / Structured Data Audit: artificialjobs.dev

Date: 2026-10-27. Sampled 15 pages (home, about, blog index, 2 posts, pay-index index + 2026-10, 3 field pages, 5 jobs). All JSON-LD is server-rendered; all blocks parse; @context is https://schema.org everywhere.

**Score: 72 / 100**

## What works
- Org + WebSite @graph sitewide with @id (`web/app/layout.tsx:44-74`); publisher refs use @id.
- JobPosting present on all sampled remote jobs, with datePosted, validThrough, employmentType (CONTRACTOR), jobLocationType TELECOMMUTE, applicantLocationRequirements, baseSalary (MonetaryAmount/QuantitativeValue with HOUR), identifier (PropertyValue), directApply:false (`web/app/jobs/[slug]/page.tsx:53-83`). Only emitted when the job is remote, which avoids Google location errors.
- BreadcrumbList on jobs, field pages, blog posts. Dataset on /pay-index/2026-10 is strong (license, distribution CSV, temporalCoverage, creator).
- Absolute URLs and ISO dates throughout.

## Findings

### HIGH-1: applicantLocationRequirements contradicts job description (policy risk)
Sampled job /jobs/us-licensed-physician-micro1-5860 says "Location: United States, Remote" but JSON-LD lists 58 countries (Bangladesh ... Ethiopia). Same 58 on every sampled job, including bankruptcy-attorney ("US-based only") and "Alaska-based" photo contributor. This looks like a default list (`job.applicant_countries`, `page.tsx:67-69`). Google requires structured data to match visible content; mismatches can trigger manual action / loss of Jobs eligibility. Fix: derive countries from the job's own location text (parse "US-based", "United States"), and omit applicantLocationRequirements (or emit only when confidently parsed) rather than falling back to a global default. Verify where `applicant_countries` is populated (ingest scripts, e.g. /ingest_jobs.py).

### HIGH-2: Existing FAQPage everywhere with no SERP benefit
FAQPage on home, blog posts, /pay-index, /pay-index/2026-10, all field pages (`web/components/faq-section.tsx:13-26`). Per current guidance, Google retired FAQ rich results for all sites (May 2026; previously restricted to gov/health, which this site is not). Severity: Info. No harm, no SERP benefit, AI/GEO benefit unconfirmed. Keep if FAQ text is visible on the page; do not spend more effort. Do not add on more pages.

### MEDIUM-1: baseSalary missing on some jobs
Photo contributor job (5883) has no baseSalary; description states "$140 per approved task". Fix: when hourly/salary absent, optionally emit `unitText` is not valid for per-task; safest is omit (current behavior). Ensure the HOUR figures are not derived from the "up to" max only (`minValue: job.hourly_min || job.hourly_max` yields min=max when min missing, which misstates a range).

### MEDIUM-2: Article author is an Organization, no image
`web/app/blog/[slug]/page.tsx:46-53`: author Organization only; no `image`, no Person. Not required for Google Article, but E-E-A-T benefits from a named Person author and image. Also `mainEntityOfPage` is a bare URL string (valid, but a WebPage object with @id is preferred); dateModified mixes date-only datePublished with full timestamp (valid). Fix:
```json
{"@context":"https://schema.org","@type":"BlogPosting","headline":"...","image":["https://www.artificialjobs.dev/blog/<slug>/opengraph-image"],
 "datePublished":"2026-10-24T00:00:00Z","dateModified":"2026-10-24T17:34:13Z",
 "mainEntityOfPage":{"@type":"WebPage","@id":"https://www.artificialjobs.dev/blog/<slug>"},
 "author":{"@type":"Person","name":"Pete Keating","url":"https://www.artificialjobs.dev/about"},
 "publisher":{"@id":"https://www.artificialjobs.dev/#organization"}}
```

### MEDIUM-3: JobPosting description is raw markdown, not HTML/plain text
`page.tsx:61` passes `job.description` containing `**`, `##`, `- ` and stray markers (e.g. "Paid Photo Contributor Opportunity**", "[Link 1] [Link 2]"). Google accepts HTML; markdown syntax shows literally. Fix: render markdown to HTML (or strip) before embedding.

### LOW-1: Organization is thin
No `sameAs` (social/LinkedIn), no `contactPoint`. Logo `/icon.png` should be a >=112x112 raster (verify). The hiringOrganization (micro1) lacks `logo`; add `logo` and `url`. Fix in `page.tsx:57`: `{ '@type':'Organization', name, sameAs:'https://micro1.ai', url:'https://micro1.ai', logo:'<micro1 logo URL>' }`.

### LOW-2: No schema on /about, /blog index, field-page ItemList
- /about: only sitewide Org/WebSite. Add `AboutPage` (mainEntity -> Organization @id).
- /blog: add `CollectionPage`/`Blog` with ItemList.
- /pay-index (index): Dataset present but check it describes a series; consider `DataCatalog` or `hasPart` links to monthly Datasets.
- WebSite lacks `potentialAction` SearchAction (only add if site search exists; Google dropped sitelinks search box, low value).
- Field pages (`[field]/page.tsx:53-75`): BreadcrumbList position 2 has no `item` (ok for last item) but position 1 name "AI training jobs" points to home; consider `ItemList` of top jobs plus CollectionPage.

Example AboutPage:
```json
{"@context":"https://schema.org","@type":"AboutPage","url":"https://www.artificialjobs.dev/about","name":"About Artificial Jobs","mainEntity":{"@id":"https://www.artificialjobs.dev/#organization"}}
```

### LOW-3: Dataset improvements
`variableMeasured` as strings is OK; use PropertyValue objects with unitText for richer Dataset Search. Add `spatialCoverage` ("United States/Global"), `sameAs`/`isBasedOn` -> micro1 feed, and `dateModified`. `creator` and `publisher` fine.

### Info: Jobs closed -> redirect
Closed jobs redirect (`page.tsx:40-43`), correctly avoiding stale JobPosting. Non-remote jobs emit no JobPosting (`page.tsx:83`), which is safe but means those jobs get no job rich result; if micro1 gives a location, emit `jobLocation` PostalAddress instead.

## Not covered
Only 5 job pages sampled of ~300; 3 field pages of 33; no Rich Results Test API run (offline structural validation only).
