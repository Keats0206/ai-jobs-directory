#!/usr/bin/env python3
"""
Legacy Exa-based job ingest. Prefer scripts/fetch_frontier_jobs.py for
structured ATS data; this script remains for broad discovery.

Improvements vs prior version:
- Repo-relative paths (no machine-specific absolute paths)
- Rejects aggregator / non-job URLs via job_quality_lib
- Does not invent placeholder salary bands (0 when unknown)
- Dedupes by normalized apply_url
- Runs shared normalize_job before save
"""
from __future__ import annotations

import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "scripts"))

from job_quality_lib import (  # noqa: E402
    company_from_url,
    enrich_tags,
    is_valid_listing,
    normalize_apply_url,
    normalize_job,
    parse_salary_from_description,
)

ssl_context = ssl._create_unverified_context()

EXA_API_KEY = os.environ.get("EXA_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pfpnpgmblszljcshztgk.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

JOBS_JSON = ROOT / "web" / "data" / "jobs.json"
SEEDED_JSON = ROOT / "seeded_jobs.json"

QUERIES = [
    "site:ashbyhq.com AI Engineer remote",
    "site:ashbyhq.com Machine Learning Engineer",
    "site:ashbyhq.com LLM Engineer",
    "site:boards.greenhouse.io AI Engineer",
    "site:boards.greenhouse.io Machine Learning",
    "site:jobs.lever.co AI Engineer",
    "site:jobs.lever.co Machine Learning Engineer",
    "site:anthropic.com careers AI",
    "site:openai.com careers engineer",
    "site:cohere.ai careers engineer",
    "site:huggingface.co jobs",
    "site:stability.ai careers",
    "site:replit.com careers AI",
    "AI Engineer remote 2026",
    "LLM Engineer jobs remote",
    "Machine Learning Engineer AI startup",
    "GenAI engineer positions remote",
    "RAG engineer roles hiring",
    "Prompt engineer remote jobs",
    "ML infrastructure engineer remote",
    "Computer vision engineer remote",
    "NLP engineer positions",
]


def search_exa(query: str) -> list[dict]:
    if not EXA_API_KEY:
        print("  ! EXA_API_KEY not set — skipping Exa search")
        return []
    url = "https://api.exa.ai/search"
    payload = {
        "query": query,
        "numResults": 20,
        "contents": {"text": {"maxCharacters": 3000}},
    }
    headers = {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), headers=headers
    )
    try:
        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get("results", [])
    except Exception as e:
        print(f"Error fetching from Exa for '{query}': {e}")
        return []


def extract_job_info(item: dict) -> dict | None:
    title = item.get("title") or "Unknown Role"
    url = item.get("url") or ""
    text = item.get("text") or ""

    company = "AI Startup"
    if " at " in title.lower():
        parts = re.split(r"\s+at\s+", title, flags=re.IGNORECASE)
        title = parts[0].strip()
        potential = parts[1].split("-")[0].split("|")[0].split("(")[0].strip()
        potential = re.sub(r"\s*(\.\.\.|\.\.|…)\s*$", "", potential).strip()
        if potential and len(potential) < 60:
            company = potential

    if company == "AI Startup" and " @ " in title:
        parts = title.split(" @ ")
        title = parts[0].strip()
        potential = parts[1].split("-")[0].split("|")[0].strip()
        potential = re.sub(r"\s*(\.\.\.|\.\.|…)\s*$", "", potential).strip()
        if potential and len(potential) < 60:
            company = potential

    if company == "AI Startup":
        url_company = company_from_url(url)
        if url_company and len(url_company) < 60:
            company = url_company

    if company == "AI Startup" and " - " in title:
        parts = title.rsplit(" - ", 1)
        title = parts[0].strip()
        potential = parts[1].strip()
        potential = re.sub(r"\s*(\.\.\.|\.\.|…)\s*$", "", potential).strip()
        if potential and len(potential) < 60 and not potential.lower().startswith(
            ("http", "remote", "hybrid", "full")
        ):
            company = potential

    # Real salary only — never invent bands
    salary_min = salary_max = 0
    parsed = parse_salary_from_description(text)
    if parsed:
        salary_min, salary_max = parsed

    text_lower = (text + title).lower()
    job_type = "Full-time"
    if "contract" in text_lower:
        job_type = "Contract"
    elif "part-time" in text_lower:
        job_type = "Part-time"

    is_remote = "remote" in text_lower or "remote" in url.lower()
    location = "Remote" if is_remote else "On-site"
    if "san francisco" in text_lower:
        location = "San Francisco, CA"
    elif "new york" in text_lower or "nyc" in text_lower:
        location = "New York, NY"
    elif "london" in text_lower:
        location = "London, UK"
    elif "toronto" in text_lower:
        location = "Toronto, CA"

    job = {
        "title": title,
        "company": company,
        "apply_url": url,
        "location": location,
        "is_remote": is_remote,
        "job_type": job_type,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "tags": [],
        "description": text[:2000],
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "source": "exa",
    }
    enrich_tags(job)
    normalize_job(job)
    ok, reason = is_valid_listing(job)
    if not ok:
        return None
    if job.get("company") in {"AI Startup", "Remote", "RemoteAI"}:
        return None
    return job


def load_existing_jobs() -> list[dict]:
    for path in (JOBS_JSON, SEEDED_JSON):
        if path.exists():
            try:
                return json.loads(path.read_text())
            except json.JSONDecodeError:
                continue
    return []


def push_to_supabase(jobs: list[dict]) -> int:
    if not jobs or not SUPABASE_KEY:
        if not SUPABASE_KEY:
            print("SUPABASE_ANON_KEY not set — skipping push")
        return 0

    url = f"{SUPABASE_URL}/rest/v1/jobs"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    pushed = 0
    for job in jobs:
        payload = {
            "title": job["title"],
            "slug": re.sub(r"[^a-z0-9]+", "-", job["title"].lower()).strip("-"),
            "location": job["location"],
            "is_remote": job["is_remote"],
            "job_type": job.get("job_type", "Full-time"),
            "salary_min": job.get("salary_min") or None,
            "salary_max": job.get("salary_max") or None,
            "tags": job.get("tags", []),
            "description": job["description"],
            "apply_url": job["apply_url"],
            "source": job.get("source", "exa"),
        }
        check_url = (
            f"{SUPABASE_URL}/rest/v1/jobs?apply_url=eq."
            f"{urllib.parse.quote(job['apply_url'], safe='')}"
        )
        req = urllib.request.Request(check_url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req, context=ssl_context, timeout=20) as resp:
                if json.loads(resp.read().decode()):
                    continue
        except Exception:
            pass

        req = urllib.request.Request(
            url, data=json.dumps([payload]).encode("utf-8"), headers=headers
        )
        try:
            with urllib.request.urlopen(req, context=ssl_context, timeout=20) as resp:
                pushed += 1
        except Exception as e:
            print(f"Error pushing job {job['title']}: {e}")
    return pushed


def main() -> None:
    print(f"[{datetime.now(timezone.utc).isoformat()}] Starting AI jobs daily ingest...")

    existing_jobs = load_existing_jobs()
    existing_urls = {
        normalize_apply_url(j.get("apply_url", "")) for j in existing_jobs if j.get("apply_url")
    }
    print(f"Loaded {len(existing_jobs)} existing jobs")

    all_jobs: list[dict] = []
    seen = set(existing_urls)

    for query in QUERIES:
        print(f"  Searching: {query}")
        for res in search_exa(query):
            url = res.get("url") or ""
            key = normalize_apply_url(url)
            if not key or key in seen:
                continue
            seen.add(key)
            try:
                job = extract_job_info(res)
                if job:
                    all_jobs.append(job)
            except Exception as e:
                print(f"    Error parsing job: {e}")

    # Merge into the canonical web dataset
    by_url: dict[str, dict] = {}
    for j in existing_jobs + all_jobs:
        key = normalize_apply_url(j.get("apply_url", ""))
        if key:
            by_url[key] = j
    merged = list(by_url.values())

    JOBS_JSON.parent.mkdir(parents=True, exist_ok=True)
    JOBS_JSON.write_text(json.dumps(merged, indent=2) + "\n")
    SEEDED_JSON.write_text(json.dumps(merged, indent=2) + "\n")

    print(f"✓ Saved {len(merged)} total jobs to {JOBS_JSON.relative_to(ROOT)}")
    print(f"  New jobs today: {len(all_jobs)}")

    pushed = push_to_supabase(all_jobs)
    print(f"✓ Pushed {pushed} jobs to Supabase")
    print(f"[{datetime.now(timezone.utc).isoformat()}] Daily ingest complete")


if __name__ == "__main__":
    main()
