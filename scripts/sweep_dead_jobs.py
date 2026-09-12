"""
Dead-link sweep: checks every job's apply_url and removes listings whose
original posting is gone (404/410, or a client-rendered "not found" page —
Ashby/Greenhouse/Lever all return HTTP 200 for those since it's a JS app
shell, so status code alone isn't enough).

Usage: python3 scripts/sweep_dead_jobs.py [--dry-run]
Writes a pruned web/data/jobs.json (backup saved alongside) unless --dry-run.
"""
import json
import re
import ssl
import sys
import threading
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

import certifi

SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())
JOBS_JSON = "web/data/jobs.json"
CONCURRENCY = 16
TIMEOUT = 10

# jobs.ashbyhq.com is a client-rendered SPA — a raw HTTP fetch always
# returns 200 with the same generic app shell whether the job exists or
# not, so status code and body-text checks are both useless there. Ashby's
# real job-board JSON API tells the truth; cache one board fetch per org.
ASHBY_URL_RE = re.compile(r"jobs\.ashbyhq\.com/([^/]+)/([0-9a-f-]{20,})")
_ashby_board_cache = {}
_ashby_lock = threading.Lock()


def get_ashby_board(org_slug):
    with _ashby_lock:
        if org_slug in _ashby_board_cache:
            return _ashby_board_cache[org_slug]
    try:
        req = urllib.request.Request(
            f"https://api.ashbyhq.com/posting-api/job-board/{org_slug}",
            headers={"User-Agent": "Mozilla/5.0 artificialjobs.dev-bot/1.0"},
        )
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=SSL_CONTEXT) as resp:
            data = json.loads(resp.read())
        ids = {j.get("id") for j in data.get("jobs", [])}
    except Exception:
        ids = None  # couldn't verify — treat as ambiguous, don't delete
    with _ashby_lock:
        _ashby_board_cache[org_slug] = ids
    return ids

DEAD_MARKERS = [
    r"job (you requested )?was not found",
    r"job not found",
    r"position (has been )?filled",
    r"no longer accepting applications",
    r"no longer available",
    r"this job is closed",
    r"posting (has expired|is closed|not found)",
    r"404[\s\-]*(not found|error)",
]
DEAD_MARKER_RE = re.compile("|".join(DEAD_MARKERS), re.IGNORECASE)


def check_url(url):
    """Returns (alive: bool, reason: str)."""
    if not url:
        return False, "no url"

    ashby_match = ASHBY_URL_RE.search(url)
    if ashby_match:
        org_slug, job_id = ashby_match.groups()
        ids = get_ashby_board(org_slug)
        if ids is None:
            return True, "ashby board unreachable (kept, ambiguous)"
        return (job_id in ids), ("ashby: live" if job_id in ids else "ashby: not on current board")

    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 artificialjobs.dev-bot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=SSL_CONTEXT) as resp:
            status = resp.status
            body = resp.read(20000).decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        if e.code in (404, 410, 451):
            return False, f"http {e.code}"
        # Some boards 403 bots but the posting is fine — don't kill it on a guess.
        return True, f"http {e.code} (kept, ambiguous)"
    except Exception as e:
        # Network/timeout errors are ambiguous (could be our connection, not
        # the posting) — don't delete real jobs over a flaky request.
        return True, f"error (kept, ambiguous): {e}"

    if status in (404, 410):
        return False, f"http {status}"
    if DEAD_MARKER_RE.search(body):
        return False, "dead-page marker in body"
    return True, "ok"


def main():
    dry_run = "--dry-run" in sys.argv

    with open(JOBS_JSON) as f:
        jobs = json.load(f)
    print(f"Checking {len(jobs)} job URLs with {CONCURRENCY} workers...")

    results = [None] * len(jobs)
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
        futures = {pool.submit(check_url, j.get("apply_url", "")): i for i, j in enumerate(jobs)}
        done = 0
        for fut in as_completed(futures):
            i = futures[fut]
            results[i] = fut.result()
            done += 1
            if done % 250 == 0:
                print(f"  {done}/{len(jobs)} checked...")

    dead = [(jobs[i], reason) for i, (alive, reason) in enumerate(results) if not alive]
    alive_jobs = [jobs[i] for i, (alive, _) in enumerate(results) if alive]

    print(f"\n{len(dead)} dead listings found, {len(alive_jobs)} kept")
    for job, reason in dead[:30]:
        print(f"  DEAD [{reason}] {job.get('title')} @ {job.get('company')} -> {job.get('apply_url')}")
    if len(dead) > 30:
        print(f"  ... and {len(dead) - 30} more")

    if dry_run:
        print("\n--dry-run: not writing changes")
        return

    with open(JOBS_JSON + ".pre-sweep-bak", "w") as f:
        json.dump(jobs, f, indent=2)
    with open(JOBS_JSON, "w") as f:
        json.dump(alive_jobs, f, indent=2)
    print(f"\nSaved {len(alive_jobs)} jobs to {JOBS_JSON} (backup: {JOBS_JSON}.pre-sweep-bak)")


if __name__ == "__main__":
    main()
