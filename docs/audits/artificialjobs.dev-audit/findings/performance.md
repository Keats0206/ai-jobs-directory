# Performance audit: artificialjobs.dev (2026-10-27)

Method limits: PSI API unkeyed returned 429 (daily quota). Lighthouse via npx was blocked by the permission classifier; Playwright is not installed. So NO lab LCP/INP/CLS numbers were measured. Evidence below is from curl (TTFB, size, headers), HTML/chunk inspection and source review. CrUX field data unavailable (no API key).

Score: 88/100 (estimated, static-HTML profile; confirm with a real Lighthouse run).

## Measured (production, curl, edge-cached)
| Page | TTFB | HTML br / raw | Elements | Links | RSC flight data |
|---|---|---|---|---|---|
| / | 0.18s | 22KB / 295KB | 1240 | 194 | 172KB |
| /jobs/us-licensed-physician-micro1-5860 | 0.14s | 10.5KB / 63KB | 218 | 29 | 38KB |
| /ai-training-jobs/law | 0.20s | 16.7KB / 223KB | 935 | 140 | 130KB |
| /blog/how-much-do-ai-training-jobs-pay | 0.13s | 10.5KB / 64KB | 287 | 39 | 40KB |
| /pay-index/2026-10 | 0.14s | 11.3KB / 83KB | 352 | 58 | 51KB |

Shared: 1 CSS (11.8KB br), ~11 JS chunks (~200KB br total, largest 72KB, 41KB, 40KB), 0 images, 2 preloaded woff2, no third-party origins except @vercel/analytics (first-party /_vercel path).

Proxy expectations (unverified): LCP is text, so likely 1.0-1.8s mobile (good); CLS likely about 0 (no images, next/font); INP/TBT low-moderate risk from ~200KB JS plus hydration of 1240-element homepage.

## What works
- All pages prerendered and Vercel edge HIT (x-vercel-cache HIT, TTFB 130-200ms, well under 0.8s).
- Brotli compression: 295KB homepage HTML ships as 22KB.
- No images means no image LCP/CLS risk; no third-party scripts blocking render.
- next/font self-hosted, preloaded woff2 (no layout-shift FOUT from external font CSS).
- Only 7 small 'use client' components; pages mostly server-rendered. Job pages use generateStaticParams (web/app/jobs/[slug]/page.tsx:15).

## Findings
- [MEDIUM] Homepage DOM and flight payload are large: 1240 elements, 194 links, 172KB RSC data duplicating the HTML (58% of the document). web/app/page.tsx:116-125 renders every field with 5+ roles x4 RoleList rows plus FieldTile grid (:88) and shortlist. Fix: cap to top ~6 fields or collapse the rest behind links to /ai-training-jobs/<slug> (already linked); use content-visibility:auto on below-fold sections (`.mb-20` section wrapper at :118). Under the 1,500-element threshold, so not urgent, but it adds hydration cost for INP. Same on /ai-training-jobs/law (935 elements, 130KB RSC).
- [LOW] ~200KB (br) JS on every page including static blog/job pages. Largest chunks 72KB/41KB/40KB are framework/runtime. Verify with `next experimental-analyze`; ensure heavy client components (web/components/data-value-estimator.tsx, valuation-lead-form.tsx) are only imported on /sell-company-data routes, or use next/dynamic.
- [LOW] Three font variables, two from the same family: web/app/layout.tsx:6-10 and :11-15 both create Geist (display and body). Next dedupes the file, but this is redundant; use one Geist instance. Geist Mono (layout.tsx:16) is preloaded on all pages; confirm it is used above the fold, otherwise set `preload: false`.
- [LOW] Cache-Control is public, max-age=0, must-revalidate (Vercel default for ISR/static HTML); each navigation revalidates at the edge. Acceptable (HIT, ~150ms) but not browser-cached. No action unless repeat-view speed matters.
- [LOW] Analytics component (layout.tsx:78) plus track() in partner-link.tsx are lightweight; no action. Do not add GTM/third-party tags without lazyOnload.
- [INFO] Not verified: lab LCP/CLS/INP, mobile throttled TBT, CrUX. Re-run: `npx lighthouse <url> --only-categories=performance --form-factor=mobile` on the 5 URLs, or get a PSI API key (the unkeyed shared quota is exhausted).

## Priority
1. Run real Lighthouse/PSI on the 5 URLs to confirm (no blockers expected).
2. Trim homepage and category DOM (page.tsx:116-125).
3. Bundle analysis for client JS; dedupe font config (layout.tsx:6-15).
