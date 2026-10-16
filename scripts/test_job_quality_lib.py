#!/usr/bin/env python3
"""Lightweight tests for scripts/job_quality_lib.py (stdlib only)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from job_quality_lib import (
    company_from_url,
    is_junk_host,
    is_junk_title,
    is_valid_listing,
    normalize_job,
    parse_salary_from_description,
)


def test_junk_hosts() -> None:
    assert is_junk_host("https://remoteai.io/v2/hire/@x")
    assert is_junk_host("https://www.indeed.com/q-ai-jobs")
    assert not is_junk_host("https://jobs.ashbyhq.com/openai/abc")


def test_junk_titles() -> None:
    assert is_junk_title("Jobs \\ Anthropic")
    assert is_junk_title("Job Description")
    assert not is_junk_title("Full Stack AI Engineer")
    assert not is_junk_title("Research Engineer, Machine Learning")


def test_swap_and_normalize() -> None:
    job = {
        "title": "Egen",
        "company": "Principal AI Engineer",
        "apply_url": "https://jobs.lever.co/egen/d8b8eb1d-e278-4cac-b87d-32520b7e10a8",
        "location": "Remote",
        "is_remote": True,
        "salary_min": 140000,
        "salary_max": 220000,
        "tags": ["AI"],
        "description": "Build ML systems. Pay $180,000 - $220,000.",
    }
    normalize_job(job)
    assert job["title"] == "Principal AI Engineer"
    assert job["company"] == "Egen"
    assert job["salary_min"] == 180000
    assert job["salary_max"] == 220000
    ok, reason = is_valid_listing(job)
    assert ok, reason


def test_company_from_url() -> None:
    assert company_from_url("https://jobs.ashbyhq.com/pulsora-inc/94d2") == "Pulsora Inc"


def test_salary_parse() -> None:
    assert parse_salary_from_description("Compensation $217,000 – $258,000") == (217000, 258000)


if __name__ == "__main__":
    test_junk_hosts()
    test_junk_titles()
    test_swap_and_normalize()
    test_company_from_url()
    test_salary_parse()
    print("ok")
