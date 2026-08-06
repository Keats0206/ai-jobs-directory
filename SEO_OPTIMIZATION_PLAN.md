# artificialjobs.dev — SEO/LLM Growth Plan

**Status:** Live with analytics tracking  
**Target:** Rank for AI job keywords + LLM discovery (Perplexity, Claude, Google SGE)  
**Timeline:** 2-week quick wins + 4-week content expansion

---

## Priority 1: Schema Additions (This Week)

### 1a. Add BreadcrumbList to Category Pages
**Pages affected:** `/agents/[category]`, `/compare/[slug]`, `/salary/[skill]`, `/location/[city]`

**Impact:** Helps LLMs understand page hierarchy; improves Rich Results in Google  
**Effort:** ~30 mins total

```typescript
// Add to each category page before return
const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.artificialjobs.dev' },
    // ... category breadcrumbs
  ]
};
```

### 1b. Add CollectionPage Schema to Hub Pages
**Pages:** `/compare/ai-coding-agents`, `/agents`, `/hermes/plugins`, `/openclaw/mcps`

**Impact:** HIGH — signals content authority to LLM crawlers  
**Effort:** ~20 mins

```typescript
const collection = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Coding Agents Comparison',
  description: '...',
  url: 'https://www.artificialjobs.dev/compare/ai-coding-agents',
  hasPart: [/* items */]
};
```

### 1c. Add FAQPage Schema to Comparison Pages
**Pages:** `/compare/ai-coding-agents`  
**Impact:** Eligible for Google Featured Snippets  
**Effort:** ~15 mins

---

## Priority 2: Content Expansion (Weeks 2-3)

### Salary Aggregation Pages (Programmatic pSEO)
**Target keywords:** `"AI engineer salary" + location/skill combos`  
**Expected pages:** 500+ via templates  

**Tier 1 (Quick Win):**
- `/salary/ai-engineer` (aggregate all AI engineer roles)
- `/salary/llm-engineer` 
- `/salary/prompt-engineer`

**Tier 2 (Location x Skill):**
- `/salary/ai-engineer/san-francisco`
- `/salary/ml-engineer/remote`
- `/salary/rag-engineer/new-york`

**Schema for each:**
```typescript
{
  '@type': 'AggregateOffer',
  priceCurrency: 'USD',
  lowPrice: '150000',
  highPrice: '350000',
  offerCount: '42'
}
```

### Location Guide Pages
**Pages:** `/guide/remote-ai-jobs`, `/guide/san-francisco-ai-jobs`  
**Content:** Demand data, salary ranges, company hubs, local AI scenes  

---

## Priority 3: Internal Linking Strategy

### Create Semantic Clusters
Example: AI Engineer → Salary → Location → Skills → Tools

**Link patterns:**
```
/ai-engineer → 
  - /salary/ai-engineer (salary expectations)
  - /compare/ai-coding-agents (tools)
  - /use-cases/agentic-engineer-jobs (career track)
  - /location/san-francisco (job hubs)
```

**Implementation:** Add "Related Jobs" + "Salary Guides" + "Skill Comparisons" sections to job detail pages.

---

## Backlink Targets (Priority 4 - Ongoing)

### Tier 1: High Authority (Publish guest content)
- **Dev.to** — "AI Engineer Salary Guide 2026"
- **Substack AI newsletters** — salary data + trends
- **Hacker News** — monthly AI jobs roundup
- **Papers with Code** — LLM tools index

### Tier 2: Community + Directories
- **AngelList** — startup job board partnerships
- **Reforge** — linked as resource for AI/ML courses
- **Reddit** (r/MachineLearning, r/learnprogramming) — organic mentions

### Tier 3: Niche Targeting
- **AI Safety News** → for AI safety engineer roles
- **MLOps blogs** — for MLOps engineer salary guides
- **Agent framework docs** — Hermes/LlamaIndex/LangChain docs

---

## LLM Optimization Checklist

- [ ] Dense internal linking (5-10 related links per page)
- [ ] Salary aggregates with schema (AggregateOffer)
- [ ] Clear taxonomy (category → skill → location)
- [ ] FAQ schema on top comparison pages
- [ ] CollectionPage schema on hub pages
- [ ] Breadcrumb schema on all category pages
- [ ] Context-rich metadata (120-160 char descriptions)

---

## Expected Impact (8 weeks)

| Metric | Current | Target |
|--------|---------|--------|
| Organic keywords ranking | ~50 | 500+ |
| Backlinks | ~5 | 25+ |
| LLM citations | Low | High (Perplexity, Claude) |
| Monthly organic traffic | TBD | 5-10k |
| Job post conversion rate | ~5% | 8%+ |

---

## Next Actions

1. **This week:** Implement schema additions (1a-1c)
2. **Week 2:** Launch 5 salary aggregation pages
3. **Week 3:** Build location guide pages (3-5 cities)
4. **Week 4+:** Backlink outreach + guest content
