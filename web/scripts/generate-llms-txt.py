#!/usr/bin/env python3
"""
Regenerate public/llms.txt from current jobs.json data.
Used by LLM crawlers (Perplexity, Claude, ChatGPT) to discover job listings.
"""
import json
import sys
from pathlib import Path
from collections import Counter


def main():
    jobs_path = Path(__file__).parent.parent / 'data' / 'jobs.json'
    llms_path = Path(__file__).parent.parent / 'public' / 'llms.txt'

    with open(jobs_path, 'r') as f:
        jobs = json.load(f)

    print(f"Generating llms.txt from {len(jobs)} jobs...")

    lines = []
    lines.append("# AI Jobs Board")
    lines.append("")
    lines.append(f"📍 **Updated Daily** • **{len(jobs)}+ AI Job Opportunities** • **Global Remote & On-Site Positions**")
    lines.append("")
    lines.append("Browse and filter thousands of AI, ML, and LLM engineering roles from top companies worldwide.")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Top 50 by salary
    top_salary = sorted(jobs, key=lambda j: j.get('salary_max', 0), reverse=True)[:50]
    lines.append("## 🌟 Featured Roles (Top 50 by Salary)")
    lines.append("")
    lines.append("High-paying AI engineering positions across the globe:")
    lines.append("")

    def fmt_salary(j):
        mn = j.get('salary_min', 0)
        mx = j.get('salary_max', 0)
        if mn and mx:
            return f"${mn:,} - ${mx:,}"
        return "Salary not listed"

    for job in top_salary:
        tags = ', '.join(job.get('tags', [])[:5])
        lines.append(f"- [{job['title']} @ {job['company']}]({job['apply_url']}) — {tags} ({fmt_salary(job)})")

    lines.append("")
    lines.append("---")
    lines.append("")

    # By location
    locations = Counter(j.get('location', 'Unknown') for j in jobs)
    lines.append(f"## 📍 All Positions by Location")
    lines.append("")
    lines.append(f"Browse **{len(jobs)}** AI jobs across **{len(locations)}** locations:")
    lines.append("")

    for loc, count in locations.most_common():
        lines.append(f"### {loc} ({count} jobs)")
        lines.append("")
        loc_jobs = [j for j in jobs if j.get('location') == loc][:5]
        for job in loc_jobs:
            tags = ', '.join(job.get('tags', [])[:3])
            lines.append(f"- [{job['title']} @ {job['company']}]({job['apply_url']}) — {tags} • {fmt_salary(job)}")
        lines.append("")

    lines.append("---")
    lines.append("")

    # By skill/tag
    all_tags = Counter()
    for j in jobs:
        for t in (j.get('tags') or []):
            all_tags[t] += 1

    lines.append(f"## 🔧 Browse by Skill")
    lines.append("")
    lines.append(f"Filter by the most in-demand AI skills ({len(all_tags)} categories):")
    lines.append("")
    
    for tag, count in all_tags.most_common(20):
        lines.append(f"- [{tag} ({count} roles)](https://www.artificialjobs.dev/remote/{tag.lower().replace(' ', '-')})")
    
    lines.append("")
    lines.append("---")
    lines.append("")

    # By company (top companies only)
    companies = Counter(j.get('company') for j in jobs)
    real_companies = [(c, n) for c, n in companies.most_common() if c != 'AI Startup']
    
    lines.append(f"## 🏢 Top Hiring Companies")
    lines.append("")
    
    for company, count in real_companies[:20]:
        slug = company.lower().replace(' ', '-').replace('.', '')
        lines.append(f"- [{company} ({count} roles)](https://www.artificialjobs.dev/company/{slug})")

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f"*Last updated with {len(jobs)} active AI job listings.*")
    lines.append(f"*Visit [artificialjobs.dev](https://www.artificialjobs.dev) for the full, searchable directory.*")

    content = '\n'.join(lines) + '\n'

    with open(llms_path, 'w') as f:
        f.write(content)

    print(f"✓ Generated llms.txt ({len(content):,} bytes) at {llms_path}")
    print(f"  {len(jobs)} jobs indexed across {len(locations)} locations")


if __name__ == '__main__':
    main()