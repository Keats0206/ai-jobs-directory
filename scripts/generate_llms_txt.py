#!/usr/bin/env python3
"""Regenerate public/llms.txt from current jobs.json for LLM crawler discovery."""
import json
import re
import sys
from datetime import datetime

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def fmt_salary(mn, mx):
    if not mn and not mx:
        return ""
    mn_s = f"${mn//1000}k" if mn else "?"
    mx_s = f"${mx//1000}k" if mx else "?"
    return f"${mn//1000 if mn else '?'}k – ${mx//1000 if mx else '?'}k"

# Load jobs
jobs_path = sys.argv[1] if len(sys.argv) > 1 else 'web/data/jobs.json'
with open(jobs_path) as f:
    jobs = json.load(f)

# Group by skill tag
skills = {}
for j in jobs:
    for tag in j.get('tags', []):
        if tag not in skills:
            skills[tag] = []
        skills[tag].append(j)

# Top skills by count
top_skills = sorted(skills.items(), key=lambda x: len(x[1]), reverse=True)[:12]

# Top companies by count
company_counts = {}
for j in jobs:
    c = j['company']
    company_counts[c] = company_counts.get(c, 0) + 1
top_companies = sorted(company_counts.items(), key=lambda x: x[1], reverse=True)[:15]

# Locations
location_counts = {}
for j in jobs:
    loc = j.get('location', 'Unknown')
    location_counts[loc] = location_counts.get(loc, 0) + 1
top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:10]

# Remote count
remote_count = sum(1 for j in jobs if j.get('is_remote'))

# Build llms.txt
lines = []
lines.append(f"# AI Jobs Directory — {len(jobs)} AI & ML Engineering Jobs")
lines.append(f"> Updated {datetime.utcnow().strftime('%Y-%m-%d')}. For humans: https://www.artificialjobs.dev")
lines.append(f"> {remote_count} remote roles | {len(set(j['company'] for j in jobs))} companies")
lines.append("")

# Navigation links
lines.append("## Quick Links")
lines.append(f"- [Home](https://www.artificialjobs.dev)")
lines.append(f"- [Post a Job — $99](https://www.artificialjobs.dev/post-job)")
lines.append(f"- [AI Coding Agents Comparison](https://www.artificialjobs.dev/compare/ai-coding-agents)")
lines.append(f"- [MCP Server Directory](https://www.artificialjobs.dev/openclaw/mcps)")
lines.append("")

# Featured / top paying jobs
lines.append("## Top-Paying AI Jobs")
top_paying = sorted(jobs, key=lambda j: j.get('salary_max', 0), reverse=True)[:20]
for j in top_paying:
    sal = fmt_salary(j.get('salary_min', 0), j.get('salary_max', 0))
    loc = j.get('location', 'Remote')
    tags = ', '.join(j.get('tags', [])[:3])
    lines.append(f"- [{j['title']} at {j['company']}]({j['apply_url']}): {loc} | {sal} | [{tags}]")
lines.append("")

# Jobs by skill
for skill, skill_jobs in top_skills:
    lines.append(f"## {skill} Jobs ({len(skill_jobs)} roles)")
    for j in skill_jobs[:10]:
        sal = fmt_salary(j.get('salary_min', 0), j.get('salary_max', 0))
        lines.append(f"- [{j['title']} at {j['company']}]({j['apply_url']}): {j.get('location','Remote')} | {sal}")
    if len(skill_jobs) > 10:
        lines.append(f"- ... and {len(skill_jobs) - 10} more → https://www.artificialjobs.dev/remote/{slugify(skill)}")
    lines.append("")

# All remaining jobs (compact)
other_jobs = [j for j in jobs if not any(tag in dict(top_skills) for tag in j.get('tags', []))]
if other_jobs:
    lines.append(f"## Other AI/ML Roles ({len(other_jobs)} more)")
    for j in other_jobs[:30]:
        tags = ', '.join(j.get('tags', [])[:2])
        lines.append(f"- [{j['title']} at {j['company']}]({j['apply_url']}): {j.get('location','Remote')} | [{tags}]")
    lines.append("")

# Taxonomy / browsing
lines.append("## Browse by Skill (pSEO pages)")
for skill, _ in top_skills:
    lines.append(f"- [{skill} jobs](https://www.artificialjobs.dev/remote/{slugify(skill)})")
lines.append("")

lines.append("## Browse by Location")
for loc, count in top_locations:
    lines.append(f"- [AI Jobs in {loc} ({count})](https://www.artificialjobs.dev/location/{slugify(loc)})")
lines.append("")

lines.append("## Salary Guides")
for skill, _ in top_skills[:8]:
    lines.append(f"- [{skill} engineer salary guide](https://www.artificialjobs.dev/salary/{slugify(skill)})")
lines.append("")

lines.append("## Top Companies Hiring")
for company, count in top_companies:
    if company != 'AI Startup':
        lines.append(f"- [{company} ({count} roles)](https://www.artificialjobs.dev/company/{slugify(company)})")
lines.append("")

lines.append("---")
lines.append(f"Generated {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC | {len(jobs)} jobs | artificialjobs.dev")

output = '\n'.join(lines)

# Write
out_path = sys.argv[2] if len(sys.argv) > 2 else 'web/public/llms.txt'
with open(out_path, 'w') as f:
    f.write(output)

print(f"✓ Wrote {len(output)} chars to {out_path}")
print(f"  {len(jobs)} jobs | {remote_count} remote | {len(skills)} skills")