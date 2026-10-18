#!/usr/bin/env python3
"""Quick sanity check against the canonical jobs dataset."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JOBS_PATH = ROOT / "web" / "data" / "jobs.json"
if not JOBS_PATH.exists():
    JOBS_PATH = ROOT / "seeded_jobs.json"

with open(JOBS_PATH, "r") as f:
    jobs = json.load(f)

print(f"Total jobs in {JOBS_PATH.name}: {len(jobs)}")

unique_urls = len(set(j.get("apply_url", "") for j in jobs))
print(f"Unique apply_urls: {unique_urls}")

ai_startup = sum(1 for j in jobs if j.get("company") == "AI Startup")
empty_title = sum(1 for j in jobs if not (j.get("title") or "").strip())
print(f"'AI Startup' companies: {ai_startup}")
print(f"Empty titles: {empty_title}")

if jobs:
    print("\nSample job:")
    print(f"  Title: {jobs[0]['title']}")
    print(f"  Company: {jobs[0]['company']}")
    print(f"  URL: {jobs[0]['apply_url']}")
    print(f"  Location: {jobs[0]['location']}")
    print(f"  Remote: {jobs[0]['is_remote']}")
