# Visual / Mobile Audit - artificialjobs.dev
Pages: / , /jobs/us-licensed-physician-micro1-5860 , /ai-training-jobs/law , /blog/how-much-do-ai-training-jobs-pay
Viewports: desktop 1440x900, mobile 390x844 (DPR2). Screenshots (viewport + full-page) in ../screenshots/.

## Images score: 88/100
Zero <img> elements and zero inline SVGs on all four pages, so there are no alt, size, format, lazy-load or CLS image problems. Deductions are for having no imagery at all (no trust or visual signals) and for the OG image only.

## What works
- H1 visible above the fold on all pages, both viewports (top 206-258px). Sizes: 60/48px desktop, 36px mobile.
- Primary CTAs above the fold: home "See top-paying roles" + "Browse by field" (y~459); job page sticky header "Apply" (y12) plus "Apply on micro1" (y479 desktop).
- No horizontal overflow (scrollWidth == viewport on all 8 renders). Viewport meta correct.
- Base font 16px; mobile body text large and readable; good contrast on headings.
- OG/Twitter image present: 1200x630 PNG (~59 KB), with alt text; favicon.ico and apple-icon.png return 200.
- Text-only design = fast, no layout shift from images.

## Findings
### MEDIUM - Small tap targets sitewide
Evidence (mobile): home 156/190 interactive elements <44px tall; category page 112/136; job 24/25; blog 31/35. Examples: logo 94x23, "Sell data ->" 77x20, breadcrumb links 20px high, job-title links in category lists 295-317x23, blog category chips 18px high ("Law" 27x18), "Apply" 64x32 (job header) and 78x40, "For PhDs" chips 30px high.
Fix: add padding/min-h-11 (44px) to inline links, chips, list-row links and the header Apply button; make whole job-row cards clickable; give breadcrumbs vertical padding.

### MEDIUM - No navigation on mobile
Evidence: home-mobile.png shows only logo + "Sell data ->"; desktop nav (Fields, Top paying, Sell company data, Guides) is hidden with no hamburger. Guides/blog and Top paying are not reachable from the header on mobile.
Fix: add a menu button (min 44x44) or a compact nav/footer-nav link row.

### LOW - Blog table min-width on mobile
Evidence: TABLE with min-w-[28rem] reaches x=468 at 390px viewport. Page itself does not scroll (likely in an overflow-x container), but there is no visible scroll affordance.
Fix: confirm the wrapper has overflow-x-auto, add a fade/shadow hint or stack rows on mobile.

### LOW - 11px footer text
Evidence: 3 elements at 11px ("(c) 2026 Artificial Jobs", "AI Tools Directory", "Keating Holdings").
Fix: raise to 12-14px.

### LOW - Muted grey secondary H1 text and disclosure
Evidence: second sentence of home H1 and the disclosure banner use mid-grey on off-white (approx 5:1 est.; not measured). The banner consumes ~3 lines (~130px) of mobile above-the-fold space, pushing H1 to y=230.
Fix: verify contrast >=4.5:1; make the disclosure one line/collapsible on mobile.

### LOW - Home H1 is very long, and category H1 is a full sentence
Evidence: home H1 is 2 sentences wrapping to 5 lines on mobile; category H1 "Best AI training jobs for lawyers. 50 open Law roles helping AI labs..." wraps to many lines. Fine for SEO but heavy visually.
Fix: optional; shorten or split the lead sentence into an H1 + subhead <p>.

### INFO - No imagery / alt not applicable
Fix (optional): if images are added later, use next/image (AVIF/WebP), explicit width/height, descriptive alt, lazy-load below fold. Consider employer/field icons as inline SVG with aria-hidden.

## Not done
Accessibility tree, contrast measurement and tablet/laptop viewports were not captured. Only 4 representative pages were sampled.
