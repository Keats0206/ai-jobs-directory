#!/usr/bin/env python3
"""
Batch load jobs into Supabase using REST API.
Paths are repo-relative (works in CI / any checkout).
"""
from __future__ import annotations

import json
import os
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path

ssl_context = ssl._create_unverified_context()

ROOT = Path(__file__).resolve().parent
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pfpnpgmblszljcshztgk.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
DEFAULT_JOBS = ROOT / "web" / "data" / "jobs.json"


def load_jobs_from_file(filepath: Path) -> list[dict]:
    with open(filepath, "r") as f:
        return json.load(f)


def batch_insert_jobs(jobs: list[dict], batch_size: int = 50) -> tuple[int, int]:
    if not SUPABASE_ANON_KEY:
        print("SUPABASE_ANON_KEY not set — aborting")
        return 0, len(jobs)

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    url = f"{SUPABASE_URL}/rest/v1/jobs"
    inserted = 0
    failed = 0

    for i in range(0, len(jobs), batch_size):
        batch = jobs[i : i + batch_size]
        payload = []
        for job in batch:
            salary_min = job.get("salary_min") or None
            salary_max = job.get("salary_max") or None
            # Skip invented placeholder bands
            if salary_min and salary_max and (salary_min, salary_max) in {
                (140000, 220000),
                (160000, 240000),
                (180000, 280000),
                (220000, 350000),
            }:
                salary_min = salary_max = None
            payload.append(
                {
                    "title": job["title"][:200],
                    "slug": job["title"][:50].lower().replace(" ", "-"),
                    "location": (job.get("location") or "Remote")[:100],
                    "is_remote": job.get("is_remote", True),
                    "job_type": job.get("job_type", "Full-time"),
                    "salary_min": salary_min,
                    "salary_max": salary_max,
                    "tags": (job.get("tags") or ["AI"])[:5],
                    "description": (job.get("description") or "")[:5000],
                    "apply_url": job["apply_url"][:500],
                    "source": job.get("source", "curated"),
                    "company_id": None,
                }
            )

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, context=ssl_context, timeout=30) as resp:
                resp.read()
                inserted += len(batch)
                print(f"  ✓ Batch {i // batch_size + 1}: Inserted {len(batch)} jobs")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"  ✗ Batch {i // batch_size + 1} failed: {e.code} - {error_body[:200]}")
            failed += len(batch)
        except Exception as e:
            print(f"  ✗ Batch {i // batch_size + 1} error: {e}")
            failed += len(batch)
        time.sleep(0.5)

    return inserted, failed


def main() -> None:
    filepath = Path(os.environ.get("JOBS_FILE", DEFAULT_JOBS))
    print(f"Loading jobs from {filepath}...")
    jobs = load_jobs_from_file(filepath)
    print(f"Loaded {len(jobs)} jobs")
    print(f"\nInserting into Supabase ({SUPABASE_URL})...")
    inserted, failed = batch_insert_jobs(jobs, batch_size=50)
    print(f"\nResults:\n  Inserted: {inserted}\n  Failed: {failed}\n  Total: {len(jobs)}")


if __name__ == "__main__":
    main()
