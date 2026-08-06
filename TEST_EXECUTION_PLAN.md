# TEST EXECUTION PLAN
# Top 3 Quick Wins (This Week)

## ✅ Test 1: Add BreadcrumbList Schema to Category Pages
**File:** `/app/agents/[category]/page.tsx` + other category pages
**Impact:** LLM navigation, Rich Results
**Time:** 20 mins
**Status:** READY TO IMPLEMENT

```typescript
// Add before return in each category page
const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.artificialjobs.dev'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: category,
      item: `https://www.artificialjobs.dev/agents/${categoryParam}`
    }
  ]
};
```

## ✅ Test 2: Add H1 + Schema to /salary/[skill] Pages
**File:** `/app/salary/[skill]/page.tsx`
**Current Issue:** Missing H1 tag (found in audit)
**Impact:** Fixes failed SEO audit; enables salary aggregation schema
**Time:** 15 mins

```typescript
// Ensure H1 is rendered and add AggregateOffer schema:
const aggregateSchema = {
  '@context': 'https://schema.org',
  '@type': 'AggregateOffer',
  priceCurrency: 'USD',
  lowPrice: minSalary,
  highPrice: maxSalary,
  offerCount: jobCount,
  url: `https://www.artificialjobs.dev/salary/${skill}`
};
```

## ✅ Test 3: Add Related Jobs Links to Job Detail Pages
**File:** `/app/jobs/[slug]/page.tsx`
**Current Finding:** 1 internal link per page (should be 5-10)
**Impact:** Improves crawl depth, keeps users on-site
**Time:** 30 mins

```typescript
// Add section before footer:
<div className="mt-8 border-t pt-6">
  <h2 className="text-lg font-semibold mb-4">Related Roles</h2>
  <div className="grid gap-3">
    {/* Similar skill jobs */}
    {/* Same location jobs */}
    {/* Same company jobs */}
  </div>
</div>
```

---

## 📊 VALIDATION TESTS (Run After Each Implementation)

### Test Hook 1: Schema Validation
```bash
# Test BreadcrumbList on agents page
curl https://www.artificialjobs.dev/agents \
  | grep -o '"@type":"BreadcrumbList"' && echo "✓ BreadcrumbList present" || echo "✗ Missing"

# Test AggregateOffer on salary page
curl https://www.artificialjobs.dev/salary/ai-engineer \
  | grep -o '"@type":"AggregateOffer"' && echo "✓ AggregateOffer present" || echo "✗ Missing"
```

### Test Hook 2: Internal Link Count
```bash
# Check job detail page links (should be 5-10+)
curl https://www.artificialjobs.dev/jobs/ai-engineer-1 \
  | grep -o '<a href="/' | wc -l
# Expected: 10+, Current: 1
```

### Test Hook 3: H1 Presence
```bash
# Check salary pages have H1
curl https://www.artificialjobs.dev/salary/ai-engineer \
  | grep -E '<h1[^>]*>[^<]+</h1>' && echo "✓ H1 found" || echo "✗ Missing H1"
```

---

## 📈 SUCCESS METRICS (Track Over 2 Weeks)

| Metric | Baseline | Target | Method |
|--------|----------|--------|--------|
| Schema coverage | 40% pages | 90% pages | Node SEO test |
| Internal links/page | 1-20 | 5-10 avg | Manual audit |
| Pages with H1 | 95% | 100% | Schema test |
| Organic keywords tracked | 50 | 100+ | Google Search Console |
| LLM citations | TBD (new) | Track via Vercel |

---

## NEXT: Start with Test 1 (BreadcrumbList)
Should take ~20 mins total. After commit + deploy, run validation hooks.
