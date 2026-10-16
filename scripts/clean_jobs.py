#!/usr/bin/env python3
"""
Clean and validate web/data/jobs.json.

Removes aggregator/spam listings, fixes swapped title/company, normalizes
locations, clears placeholder salaries, enriches sparse tags, and dedupes
by normalized apply_url.

Usage:
  python3 scripts/clean_jobs.py [--dry-run]
"""
from __future__ import annotations

import json
import shutil
import sys
from collections import Counter
from pathlib import Path

from job_quality_lib import is_valid_listing, normalize_apply_url, normalize_job

ROOT = Path(__file__).resolve().parents[1]
JOBS_PATH = ROOT / "web" / "data" / "jobs.json"
SEEDED_PATH = ROOT / "seeded_jobs.json"


def load_jobs(path: Path) -> list[dict]:
    return json.loads(path.read_text())


def clean_dataset(jobs: list[dict]) -> tuple[list[dict], Counter]:
    stats: Counter = Counter()
    cleaned: list[dict] = []
    seen_urls: set[str] = set()

    for job in jobs:
        stats["input"] += 1
        normalize_job(job)
        ok, reason = is_valid_listing(job)
        if not ok:
            # Last chance: if company is still AI Startup but URL has a slug, accept after clean
            if reason == "junk-company":
                stats[f"drop:{reason}"] += 1
                continue
            stats[f"drop:{reason}"] += 1
            continue

        # Drop listings that still have empty/junk company after cleaning
        company = (job.get("company") or "").strip()
        if not company or company in {"AI Startup", "AI Startups", "Remote", "RemoteAI", "Remoteai"}:
            stats["drop:unresolved-company"] += 1
            continue

        key = normalize_apply_url(job.get("apply_url") or "")
        if not key:
            stats["drop:empty-url"] += 1
            continue
        if key in seen_urls:
            stats["drop:duplicate-url"] += 1
            continue
        seen_urls.add(key)
        cleaned.append(job)
        stats["kept"] += 1

    # Preserve original relative order so jobSlug(index) URLs stay stable
    # for listings that survive the clean pass.
    return cleaned, stats


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    if not JOBS_PATH.exists():
        print(f"Missing {JOBS_PATH}", file=sys.stderr)
        return 1

    jobs = load_jobs(JOBS_PATH)
    cleaned, stats = clean_dataset(jobs)

    print("Job clean summary:")
    for key, value in sorted(stats.items()):
        print(f"  {key}: {value}")
    print(f"  output: {len(cleaned)} (was {len(jobs)})")

    if dry_run:
        print("--dry-run: not writing")
        return 0

    backup = JOBS_PATH.with_suffix(".json.pre-clean-bak")
    shutil.copyfile(JOBS_PATH, backup)
    JOBS_PATH.write_text(json.dumps(cleaned, indent=2) + "\n")
    print(f"Wrote {JOBS_PATH} (backup: {backup.name})")

    # Clean legacy seeded_jobs.json independently (canonical board data is
    # web/data/jobs.json — do not mirror the full set into seeded).
    if SEEDED_PATH.exists():
        seeded_backup = SEEDED_PATH.with_suffix(".json.pre-clean-bak")
        shutil.copyfile(SEEDED_PATH, seeded_backup)
        seeded_cleaned, seeded_stats = clean_dataset(load_jobs(SEEDED_PATH))
        SEEDED_PATH.write_text(json.dumps(seeded_cleaned, indent=2) + "\n")
        print(
            f"Cleaned {SEEDED_PATH.name}: {len(seeded_cleaned)} kept "
            f"(drops={ {k: v for k, v in seeded_stats.items() if k.startswith('drop:')} })"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
