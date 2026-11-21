# Agentic readiness: artificialjobs.dev (checked 2026-10-27; vendor facts as of 2026-09-23)

## Scores
- Lighthouse Agentic Browsing: unavailable (PSI HTTP 429 daily quota, mobile and desktop). Not scored. Fix: configure a Google API key (/seo google setup) and re-run lighthouse_agentic.py.
- Agent-UX heuristic: 100/100, complete, on homepage (193 named links, 0 unnamed interactive, 2667 a11y nodes) and /jobs/us-licensed-physician-micro1-5860 (29 named links, 0 unnamed). Separate from Lighthouse.

## What works
- Server rendered: ~2023 words without JS on homepage.
- Apply link: job pages expose a real <a> to jobs.micro1.ai/post/... with referralCode, rel="sponsored noopener noreferrer", target=_blank. Plain anchor, followable by any agent.
- robots.txt 200, `User-agent: * Allow: /`, sitemap declared. No AI agent blocked.
- llms.txt 200 text/plain, 4612 bytes, passes Lighthouse rules.
- Real 404s (no soft-404 catch-all).
- Vercel does not challenge agent UAs: job page returned 200 for GPTBot, ChatGPT-User, Claude-User, Perplexity-User, ClaudeBot, python-requests (single request each, plain curl; no UA-matrix beyond that).

## Access policy
- Training: allowed (falls through to *), no stated preference
- Search: allowed
- User-triggered: allowed (Claude-User honours robots; ChatGPT-User/Perplexity-User/Google-Agent may not)

## Findings
- P1 (info): Lighthouse fraction not measured (quota). Re-run with API key.
- P2: No Content-Signal and no named AI groups in robots.txt. Policy is implicit "everything allowed". Draft/proposal (Cloudflare Content Signals, checked 2026-09-23); a preference, not enforcement. Fix if you want to state it, e.g. `Content-Signal: search=yes, ai-input=yes, ai-train=no` in the * group (decide training stance first; the site is monetised by referral clicks so ai-input=yes is likely desired).
- P3 (opportunity): No Markdown delivery (Accept: text/markdown returns HTML, no Vary: Accept, /index.md 404). No consumer agent confirmed to request it. llms.txt partly covers this.
- P3 (opportunity): No WebMCP (0 registerTool, 0 forms). Draft W3C CG spec. A search_jobs tool could be a later experiment.
- P3 (opportunity): llms-full.txt 404; ai-catalog.json and /.well-known/{ai-catalog.json,mcp.json,api-catalog,agent-card.json,oauth-*} all 404. Not defects; only needed if you run those services (ai-catalog is a draft).
- P3: llms.txt Fields list is hard-coded counts (49 Law, etc.) and lists only fields, no individual /jobs/*; confirm it regenerates daily (regenerate_llms_txt.py exists) so counts do not go stale.
- P3: Vary header on HTML is only RSC-related; fine.
