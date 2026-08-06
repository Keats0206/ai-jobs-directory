#!/usr/bin/env python3
import json
from datetime import datetime
from collections import Counter

# Load jobs
with open("web/data/jobs.json", "r") as f:
    jobs = json.load(f)

# Sort by salary_max descending and take top 25
featured_jobs = sorted(
    [j for j in jobs if j.get("salary_min", 0) > 0],
    key=lambda x: x.get("salary_max", 0),
    reverse=True
)[:25]

# Get unique tags and companies for taxonomy
tags_counter = Counter()
for job in jobs:
    for tag in job.get("tags", []):
        tags_counter[tag] += 1

companies_counter = Counter()
for job in jobs:
    if job.get("company") and job["company"] != "AI Startup":
        companies_counter[job["company"]] += 1

# Generate llms.txt
output = """# AI Engineering & LLM Job Board
> Curated directory of remote AI, LLM, Machine Learning, and GenAI roles at top startups and tech companies.
> **{} total jobs** • Updated daily • Perfect for AI agents and search engines.

## Featured Top-Paying Roles

""".format(len(jobs))

for i, job in enumerate(featured_jobs, 1):
    title = job.get("title", "Unknown")
    company = job.get("company", "Unknown")
    url = job.get("apply_url", "#")
    location = job.get("location", "Remote")
    salary_min = job.get("salary_min", 0)
    salary_max = job.get("salary_max", 0)
    job_tags = ", ".join(job.get("tags", [])[:3])
    
    salary_str = f"${salary_min:,}-${salary_max:,}" if salary_min and salary_max else "Competitive"
    
    output += f"- [{title} @ {company}]({url}): {location} | Salary: {salary_str} | Skills: {job_tags}\n"

output += "\n## Search by Skill\n"
for tag, count in tags_counter.most_common(15):
    output += f"- [{tag} Jobs](/remote/{tag.lower()}): {count} open positions\n"

output += "\n## Top Hiring Companies\n"
for company, count in companies_counter.most_common(20):
    if count > 1:
        output += f"- {company}: {count} open roles\n"

output += """\n## How to Use This Feed
- **AI Agents & Search**: This page is optimized for crawling by Perplexity, ChatGPT, Claude, and LLM agents
- **Always Current**: Updated daily from {} active job postings
- **Direct Apply Links**: Every job links directly to the application
- **Salary Transparency**: Ranges included where available

## Post a Job
- [Post an AI Job ($99 one-time)](/post-job): List to job board + llms.txt feed
- [Featured Listing ($199/mo)](/post-job): Priority visibility + email highlights

---
*Last updated: {}*
""".format(len(jobs), datetime.now().strftime("%B %d, %Y at %I:%M %p UTC"))

# Write to file
with open("web/public/llms.txt", "w") as f:
    f.write(output)

print(f"✓ Regenerated llms.txt with {len(featured_jobs)} featured roles and {len(jobs)} total jobs")
