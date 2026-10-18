"""
Shared job listing quality helpers used by clean_jobs.py and ingest_jobs.py.

Focus: durable validation (junk hosts, bad titles/companies, salary placeholders,
location normalization) rather than one-off manual edits.
"""
from __future__ import annotations

import re
from typing import Any
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

# Aggregators, scrape farms, and free-host spam that are not employer apply URLs.
JUNK_HOST_SUFFIXES = (
    "remoteai.io",
    "indeed.com",
    "ziprecruiter.com",
    "glassdoor.com",
    "naukri.com",
    "jobera.com",
    "hiretik.com",
    "remoterocketship.com",
    "wellfound.com",
    "tealhq.com",
    "dejobs.org",
    "builtin.com",
    "builtinsf.com",
    "dailyremote.com",
    "aijobs.net",
    "aijobs.ai",
    "jobgether.com",
    "crossover.com",
    "peopleinai.com",
    "aicareers.jobs",
    "ihireengineering.com",
    "zya.me",
    "infinityfree.me",
    "totalh.net",
    "social-networking.me",
    "10001mb.com",
    "synergize.co",
    "liveblog365.com",
    "kesug.com",
    "onrender.com",
    "jobhub.jl.liveblog365.com",
)

# Hosts that are career/docs hubs, not individual job applications.
NON_JOB_HOST_PATHS = (
    (re.compile(r"(^|\.)docs\."), None),
    (re.compile(r"assets\.cohere"), None),
    (re.compile(r"huggingface\.co"), re.compile(r"^/(docs|spaces)/", re.I)),
    (re.compile(r"anthropic\.com"), re.compile(
        r"^/(careers/jobs/?$|careers/jobs\?|company/?$|engineering/?$|research/?$|claude-corps|/news/|$)",
        re.I,
    )),
    (re.compile(r"openai\.com"), re.compile(r"^/careers/?$", re.I)),
    # LinkedIn search/profile/posts are junk; /jobs/view/{id} can be a real posting.
    (re.compile(r"linkedin\.com"), re.compile(
        r"^/(posts|in|showcase)/|^/jobs/(?!view/)",
        re.I,
    )),
)

PLACEHOLDER_BANDS = {
    (140000, 220000),
    (160000, 240000),
    (180000, 280000),
    (220000, 350000),
}

ROLE_WORDS = re.compile(
    r"\b(engineer|manager|scientist|intern|director|staff|senior|principal|"
    r"researcher|architect|designer|analyst|developer)\b",
    re.I,
)
# Only treat these as company-name signals when they end the string
# (avoids treating "Principal AI Engineer" as a company because of "AI").
COMPANY_OK_SUFFIX = re.compile(
    r"(?:\blabs|\bsystems|\btechnologies|\binc\.?|\bllc|\bcorp|\bgroup|\bai)$",
    re.I,
)

LOCATION_ALIASES = {
    "san francisco": "San Francisco, CA",
    "san francisco, ca": "San Francisco, CA",
    "san francisco, california": "San Francisco, CA",
    "sf": "San Francisco, CA",
    "new york": "New York, NY",
    "new york, ny": "New York, NY",
    "new york city": "New York, NY",
    "new york city, new york": "New York, NY",
    "nyc": "New York, NY",
    "london": "London, UK",
    "london, uk": "London, UK",
    "london, united kingdom": "London, UK",
    "seattle": "Seattle, WA",
    "seattle, wa": "Seattle, WA",
    "seattle, washington": "Seattle, WA",
    "remote": "Remote",
    "united states": "United States",
    "usa": "United States",
}


def normalize_apply_url(url: str) -> str:
    """Strip tracking query params and fragments for dedupe."""
    if not url:
        return ""
    parsed = urlparse(url.strip())
    # Drop common tracking params; keep gh_jid / job ids.
    qs = parse_qs(parsed.query, keep_blank_values=False)
    keep = {}
    for key, vals in qs.items():
        lk = key.lower()
        if lk.startswith(("utm_", "ref", "referrer", "stixel", "fbclid", "gclid")):
            continue
        if lk in {"e45d281a_page", "939688b5_page", "org"}:
            continue
        keep[key] = vals
    query = urlencode(keep, doseq=True)
    # Normalize trailing slash on path (except root)
    path = parsed.path.rstrip("/") if parsed.path != "/" else parsed.path
    return urlunparse((parsed.scheme.lower(), parsed.netloc.lower(), path, "", query, ""))


def host_of(url: str) -> str:
    try:
        return urlparse(url).netloc.lower().removeprefix("www.")
    except Exception:
        return ""


def is_junk_host(url: str) -> bool:
    host = host_of(url)
    if not host:
        return True
    for suffix in JUNK_HOST_SUFFIXES:
        if host == suffix or host.endswith("." + suffix):
            return True
    return False


def is_non_job_url(url: str) -> bool:
    if not url:
        return True
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    path_q = (parsed.path or "") + ("?" + parsed.query if parsed.query else "")
    for host_re, path_re in NON_JOB_HOST_PATHS:
        if host_re.search(host):
            if path_re is None:
                return True
            if path_re.search(path_q):
                return True
    # Personal portfolio / resume sites mistaken for jobs
    if re.search(r"\.(me|cv|dev|tech|site|github\.io)$", host) and not re.search(
        r"(jobs|careers|ashby|greenhouse|lever|workable)", url, re.I
    ):
        # Allow known company career domains that use .ai/.dev
        if not re.search(r"(openai|anthropic|cohere|huggingface|replit|stability)", host):
            # Heuristic: personal sites rarely have ATS path patterns
            if not re.search(r"/(jobs?|careers|apply)/", parsed.path, re.I):
                return True
    return False


def looks_like_role_title(text: str) -> bool:
    if not text:
        return False
    return bool(ROLE_WORDS.search(text)) and not bool(COMPANY_OK_SUFFIX.search(text.strip()))


def is_junk_title(title: str) -> bool:
    """True for career-index pages and scrape artifacts, not real role titles."""
    t = (title or "").strip()
    if len(t) < 5:
        return True
    if re.match(r"^\$\d", t):
        return True
    if t.lower() in {"career", "careers", "job description", ".css", "jobs overview"}:
        return True
    # "Jobs", "Home - Anthropic", "Engineering \\ Anthropic"
    if re.match(
        r"^(jobs?|home|careers?|company|engineering|research|back|act)"
        r"(\s*[\\|/–—-].*)?$",
        t,
        re.I,
    ):
        return True
    if re.match(r"^(introducing\b|claude corps\b|jobs\s*·)", t, re.I):
        return True
    return False


def title_case_slug(slug: str) -> str:
    parts = []
    for word in re.split(r"[-_]", slug.replace("%20", " ")):
        if not word:
            continue
        parts.append(
            word.upper()
            if re.match(r"^(ai|llm|rag|ml|nlp|usa|uk)$", word, re.I)
            else word[:1].upper() + word[1:]
        )
    return " ".join(parts)


def company_from_url(url: str) -> str | None:
    for pattern in (
        r"ashbyhq\.com/([^/]+)",
        r"greenhouse\.io/(?:embed/)?([^/]+)",
        r"job-boards\.greenhouse\.io/([^/]+)",
        r"lever\.co/([^/]+)",
        r"apply\.workable\.com/([^/]+)",
    ):
        match = re.search(pattern, url or "", re.I)
        if match and match.group(1).lower() not in {"job", "jobs", "embed", "careers", "apply"}:
            return title_case_slug(match.group(1))
    return None


def clean_title(title: str, company: str = "") -> str:
    cleaned = re.sub(r"^Job Application for\s+", "", title or "", flags=re.I).strip()
    cleaned = cleaned.replace(" \\ ", " - ").replace("\\", " - ")
    cleaned = re.sub(r"\s+@\s+.+$", "", cleaned).strip()
    if company:
        cleaned = re.sub(
            rf"\s+[–—-]\s+{re.escape(company)}\s*$", "", cleaned, flags=re.I
        ).strip()
    cleaned = re.sub(r"\s+\$[\d.,kK]+(?:\s*[–—-]\s*\$?[\d.,kK]+)?.*$", "", cleaned).strip()
    cleaned = re.sub(r"\s+\([^)]*$", "", cleaned).strip()
    cleaned = re.sub(r"\s+\|\s*$", "", cleaned).strip()
    return re.sub(r"\s+", " ", cleaned)


def clean_company(job: dict[str, Any]) -> str:
    company = (job.get("company") or "").split("\n")[0].strip()
    company = re.sub(r"<[^>]+>", "", company)
    company = re.sub(r"\s+", " ", company).strip()

    if "@" in company:
        after = company.split("@")[-1].strip()
        if 1 < len(after) < 50:
            company = after

    corrupted = (
        not company
        or company in {"AI Startup", "AI Startups", "Remote", "RemoteAI", "Remoteai"}
        or company.lower() in {"career page", "flexgen"}
        or len(company) > 60
        # "|" almost always means scrape mash; bare ")" is often a fine
        # parenthetical like "Cursor (Anysphere)".
        or "|" in company
        or (")" in company and ("(" not in company or len(company) > 50))
        or looks_like_role_title(company)
        or company.startswith("$")
        or " NOW HIRING" in company.upper()
        or company.lower().endswith(" jobs")
    )
    if corrupted:
        title = job.get("title") or ""
        match = re.search(r"@\s*([A-Za-z][A-Za-z0-9.&' -]{1,40})", title)
        if match and len(match.group(1).strip()) < 50 and match.group(1).strip().count(" ") < 5:
            return match.group(1).strip()
        # "Role | Company" in title
        pipe = re.search(r"\|\s*([A-Za-z][A-Za-z0-9.&' -]{1,40})\s*$", title)
        if pipe:
            cand = pipe.group(1).strip()
            if not looks_like_role_title(cand) and cand.lower() not in {"remote", "usa"}:
                return cand
        from_url = company_from_url(job.get("apply_url") or "")
        if from_url:
            return from_url
    return company


def maybe_swap_title_company(job: dict[str, Any]) -> None:
    """Lever/Greenhouse scrape sometimes swaps title and company."""
    title = (job.get("title") or "").strip()
    company = (job.get("company") or "").strip()
    if not title or not company:
        return
    url_co = company_from_url(job.get("apply_url") or "")
    title_norm = title.lower().replace(" ", "").replace("-", "")
    url_norm = (url_co or "").lower().replace(" ", "").replace("-", "")

    # Title is literally the ATS company slug; company field holds the role/team.
    if url_co and title_norm == url_norm and company.lower() != url_co.lower():
        if looks_like_role_title(company) or len(company) >= len(title):
            job["title"], job["company"] = company, url_co
            return

    if (
        len(title) <= 24
        and not ROLE_WORDS.search(title)
        and looks_like_role_title(company)
    ):
        job["title"], job["company"] = company, title


def normalize_location(location: str, is_remote: bool = False) -> str:
    raw = (location or "").strip()
    if not raw or raw.lower() in {"on-site", "onsite", "unknown"}:
        return "Remote" if is_remote else "On-site"
    # Single-city aliases only (leave multi-city strings alone)
    key = raw.lower().strip()
    if key in LOCATION_ALIASES:
        return LOCATION_ALIASES[key]
    if ";" not in raw and "|" not in raw and key in LOCATION_ALIASES:
        return LOCATION_ALIASES[key]
    return raw


def parse_salary_from_description(description: str) -> tuple[int, int] | None:
    match = re.search(
        r"\$\s*([\d,.]+)\s*([Kk])?\s*[–—-]\s*\$?\s*([\d,.]+)\s*([Kk])?",
        description or "",
    )
    if not match:
        return None

    def parse_num(raw: str, had_k: bool) -> int:
        n = float(raw.replace(",", ""))
        if had_k or n < 1000:
            return int(round(n * 1000))
        return int(round(n))

    min_v = parse_num(match.group(1), bool(match.group(2)))
    max_v = parse_num(match.group(3), bool(match.group(4)))
    if min_v < 20000 or max_v < min_v:
        return None
    return min_v, max_v


def sanitize_salary(job: dict[str, Any]) -> None:
    """Clear placeholder bands; prefer description-parsed pay when present."""
    parsed = parse_salary_from_description(job.get("description") or "")
    if parsed:
        job["salary_min"], job["salary_max"] = parsed
        return
    mn = int(job.get("salary_min") or 0)
    mx = int(job.get("salary_max") or 0)
    if (mn, mx) in PLACEHOLDER_BANDS:
        job["salary_min"] = 0
        job["salary_max"] = 0


TAG_KEYWORDS = {
    "llm": "LLM",
    "large language model": "LLM",
    "rag": "RAG",
    "retrieval-augmented": "RAG",
    "agent": "Agent",
    "agentic": "Agent",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "vllm": "vLLM",
    "cuda": "CUDA",
    "langchain": "LangChain",
    "fine-tuning": "Fine-tuning",
    "fine tuning": "Fine-tuning",
    "infrastructure": "Infrastructure",
    "python": "Python",
    "rust": "Rust",
    "transformers": "Transformers",
    "huggingface": "HuggingFace",
    "generative ai": "Generative AI",
    "genai": "GenAI",
    "computer vision": "Computer Vision",
    "nlp": "NLP",
    "natural language processing": "NLP",
    "data engineering": "Data Engineering",
    "mlops": "MLOps",
    "ml ops": "MLOps",
    "prompt engineer": "Prompt Engineering",
    "research scientist": "AI Research",
    "ai researcher": "AI Research",
    "ai ethics": "AI Ethics",
    "responsible ai": "AI Ethics",
    "ai safety": "AI Ethics",
    "solutions architect": "AI Solutions Architect",
    "product manager": "AI Product Management",
    "machine learning engineer": "ML Engineer",
}


def enrich_tags(job: dict[str, Any]) -> None:
    tags = list(job.get("tags") or [])
    text = f"{job.get('title', '')} {job.get('description', '')}".lower()
    for kw, tag in TAG_KEYWORDS.items():
        if kw in text and tag not in tags:
            tags.append(tag)
    if not tags:
        tags = ["AI"]
    # Drop ultra-generic-only sets by ensuring at least AI remains
    job["tags"] = tags[:6]


def is_valid_listing(job: dict[str, Any]) -> tuple[bool, str]:
    url = job.get("apply_url") or ""
    title = (job.get("title") or "").strip()
    company = (job.get("company") or "").strip()
    description = job.get("description") or ""

    if not url.startswith("http"):
        return False, "bad-url"
    if is_junk_host(url):
        return False, "junk-host"
    if is_non_job_url(url):
        return False, "non-job-url"
    if len(title) < 5:
        return False, "short-title"
    if is_junk_title(title):
        return False, "junk-title"
    if re.search(r"job (you requested )?was not found|job not found|no longer available", description, re.I):
        return False, "dead-description"
    if company.lower() in {"ai startup", "remote", "remoteai", "cluster", "documentation index", "in chat"}:
        # Allow if URL can recover a company — caller should clean first
        if not company_from_url(url) and company.lower() in {"cluster", "documentation index", "in chat"}:
            return False, "junk-company"
    # Personal resume titles
    if re.search(r"\b(hire |freelance|portfolio)\b", title, re.I) and is_junk_host(url):
        return False, "freelancer-listing"
    if re.search(r"^\d{3,}\+?\s", title):  # "1000+ Generative Ai Engineer jobs"
        return False, "search-results-title"
    return True, "ok"


def normalize_job(job: dict[str, Any]) -> dict[str, Any]:
    """In-place clean + return the job."""
    maybe_swap_title_company(job)
    job["company"] = clean_company(job)
    job["title"] = clean_title(job.get("title") or "", job.get("company") or "")
    # Second pass after title clean may still leave company as role — re-clean
    job["company"] = clean_company(job)
    job["location"] = normalize_location(job.get("location") or "", bool(job.get("is_remote")))
    if job.get("location") == "Remote":
        job["is_remote"] = True
    if not job.get("job_type"):
        job["job_type"] = "Full-time"
    sanitize_salary(job)
    enrich_tags(job)
    # Normalize apply_url storage lightly (keep original query that identifies the job)
    return job
