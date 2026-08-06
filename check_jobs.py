#!/usr/bin/env python3
import json

# Load the current jobs file
with open('seeded_jobs.json', 'r') as f:
    jobs = json.load(f)

print(f"Total jobs in seeded_jobs.json: {len(jobs)}")

# Check for duplicates
unique_urls = len(set(j.get('apply_url', '') for j in jobs))
print(f"Unique apply_urls: {unique_urls}")

if len(jobs) > 0:
    print(f"\nSample job:")
    print(f"  Title: {jobs[0]['title']}")
    print(f"  Company: {jobs[0]['company']}")
    print(f"  URL: {jobs[0]['apply_url']}")
    print(f"  Location: {jobs[0]['location']}")
    print(f"  Remote: {jobs[0]['is_remote']}")
