#!/usr/bin/env python3
"""Clean company names in jobs.json using URL-based extraction."""
import json
import re

def extract_company_from_url(url):
    """Extract company name from known ATS URLs."""
    if not url:
        return None
    
    m = re.search(r'jobs\.ashbyhq\.com/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        if raw.lower() not in ('careers', 'jobs', 'apply', 'embed'):
            return raw
    
    m = re.search(r'boards\.greenhouse\.io/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        if raw.lower() not in ('careers', 'jobs', 'apply'):
            return raw
    
    m = re.search(r'jobs\.lever\.co/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        if raw.lower() not in ('careers', 'jobs', 'apply'):
            return raw
    
    m = re.search(r'apply\.workable\.com/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        return raw
    
    m = re.search(r'https?://([^/]+)', url)
    if m:
        domain = m.group(1)
        domain = re.sub(r'^www\.', '', domain)
        parts = domain.split('.')
        if len(parts) >= 2 and parts[-1] in ('com', 'io', 'ai', 'co', 'org', 'dev'):
            name = parts[-2] if parts[-2] not in ('jobs', 'careers', 'boards', 'apply', 'api', 'www') else parts[0]
            if name.lower() in ('ashbyhq', 'greenhouse', 'lever', 'workable', 'recruiting'):
                return None
            return name.replace('-', ' ').title()
    
    return None

with open('/Users/petekeating/ai-jobs-directory/web/data/jobs.json', 'r') as f:
    jobs = json.load(f)

fixed = 0
for job in jobs:
    if job['company'] == 'AI Startup':
        url_company = extract_company_from_url(job.get('apply_url', ''))
        if url_company:
            job['company'] = url_company
            fixed += 1

with open('/Users/petekeating/ai-jobs-directory/web/data/jobs.json', 'w') as f:
    json.dump(jobs, f, indent=2)

# Show stats
companies = set(j['company'] for j in jobs)
remaining = sum(1 for j in jobs if j['company'] == 'AI Startup')
print(f"Total jobs: {len(jobs)}")
print(f"Fixed company names: {fixed}")
print(f"Still 'AI Startup': {remaining}")
print(f"Unique companies: {len(companies)}")