#!/usr/bin/env python3
"""Persist title/company cleanup on jobs.json (salary placeholders stay; UI hides them)."""

from __future__ import annotations

import json
import re
from pathlib import Path

JOBS_PATH = Path(__file__).resolve().parents[1] / "web" / "data" / "jobs.json"


def clean_title(title: str, company: str) -> str:
    cleaned = re.sub(r"^Job Application for\s+", "", title or "", flags=re.I).strip()
    cleaned = re.sub(r"\s+@\s+.+$", "", cleaned).strip()
    if company:
        cleaned = re.sub(rf"\s+[–—-]\s+{re.escape(company)}\s*$", "", cleaned, flags=re.I).strip()
    cleaned = re.sub(r"\s+\$[\d.,kK]+(?:\s*[–—-]\s*\$?[\d.,kK]+)?.*$", "", cleaned).strip()
    cleaned = re.sub(r"\s+\([^)]*$", "", cleaned).strip()
    cleaned = re.sub(r"\s+\|\s*$", "", cleaned).strip()
    return re.sub(r"\s+", " ", cleaned)


def title_case_slug(slug: str) -> str:
    parts = []
    for word in re.split(r"[-_]", slug.replace("%20", " ")):
        if not word:
            continue
        parts.append(word.upper() if re.match(r"^(ai|llm|rag|ml|nlp|usa|uk)$", word, re.I) else word[:1].upper() + word[1:])
    return " ".join(parts)


def company_from_url(url: str) -> str | None:
    for pattern in (
        r"ashbyhq\.com/([^/]+)",
        r"greenhouse\.io/(?:embed/)?([^/]+)",
        r"lever\.co/([^/]+)",
    ):
        match = re.search(pattern, url or "", re.I)
        if match and match.group(1).lower() not in {"job", "jobs", "embed"}:
            return title_case_slug(match.group(1))
    return None


def clean_company(job: dict) -> str:
    company = (job.get("company") or "").split("\n")[0].strip()
    company = re.sub(r"<[^>]+>", "", company)
    company = re.sub(r"\s+", " ", company).strip()

    if "@" in company:
        after = company.split("@")[-1].strip()
        if 1 < len(after) < 50:
            company = after

    looks_like_title = bool(
        re.search(r"engineer|manager|scientist|intern|director|staff|senior|principal", company, re.I)
        and not re.search(r"labs|systems|technologies|inc|llc|ai$", company, re.I)
    )
    corrupted = (
        not company
        or company == "AI Startup"
        or company.lower() == "career page"
        or len(company) > 60
        or any(ch in company for ch in ")|")
        or looks_like_title
    )
    if corrupted:
        title = job.get("title") or ""
        match = re.search(r"@\s*([A-Za-z][A-Za-z0-9.&' -]{1,40})", title)
        if match and len(match.group(1).strip()) < 50 and match.group(1).strip().count(" ") < 5:
            return match.group(1).strip()
        from_url = company_from_url(job.get("apply_url") or "")
        if from_url:
            return from_url
    return company


def main() -> None:
    jobs = json.loads(JOBS_PATH.read_text())
    title_fixes = 0
    company_fixes = 0
    for job in jobs:
        original_title = job.get("title") or ""
        original_company = job.get("company") or ""
        job["company"] = clean_company(job)
        job["title"] = clean_title(job.get("title") or "", job["company"])
        if job["title"] != original_title:
            title_fixes += 1
        if job["company"] != original_company:
            company_fixes += 1
    JOBS_PATH.write_text(json.dumps(jobs, indent=2) + "\n")
    print(f"Updated {title_fixes} titles and {company_fixes} companies in {JOBS_PATH}")


if __name__ == "__main__":
    main()
