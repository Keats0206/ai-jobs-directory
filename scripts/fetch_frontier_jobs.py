"""
Pulls open roles directly from AI-native / VC-backed frontier companies' public
ATS APIs (Greenhouse, Lever, Ashby) instead of guessing via search-engine scraping.

Why: the old ingest_jobs.py used Exa search + regex guessing for company name,
location, and salary — which produces exactly the kind of missing/incorrect
JobPosting fields (datePosted, jobLocation, etc.) that Google Search Console
flags. Public ATS APIs return real, structured data straight from the source.

Usage: python3 scripts/fetch_frontier_jobs.py
Writes merged results into web/data/jobs.json (dedup by apply_url).
"""
import json
import re
import ssl
import urllib.request
import urllib.error
from datetime import datetime, timezone

import certifi

SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())

JOBS_JSON = "web/data/jobs.json"

# Curated list of frontier / hot VC-backed AI companies with confirmed public
# ATS board slugs (probed manually — see conversation). Add more as found.
COMPANIES = [
    ("greenhouse", "anthropic", "Anthropic"),
    ("greenhouse", "scaleai", "Scale AI"),
    ("greenhouse", "togetherai", "Together AI"),
    ("greenhouse", "imbue", "Imbue"),
    ("greenhouse", "databricks", "Databricks"),
    ("lever", "mistral", "Mistral AI"),
    ("ashby", "openai", "OpenAI"),
    ("ashby", "cohere", "Cohere"),
    ("ashby", "runway", "Runway"),
    ("ashby", "elevenlabs", "ElevenLabs"),
    ("ashby", "harvey", "Harvey"),
    ("ashby", "cerebras", "Cerebras"),
    ("ashby", "suno", "Suno"),
    ("ashby", "sierra", "Sierra"),
    ("ashby", "mercor", "Mercor"),
    ("ashby", "cursor", "Cursor (Anysphere)"),
    ("ashby", "perplexity", "Perplexity"),
]

TAG_KEYWORDS = {
    "llm": "LLM", "large language model": "LLM",
    "rag": "RAG", "retrieval-augmented": "RAG",
    "agent": "Agent", "agentic": "Agent",
    "pytorch": "PyTorch", "tensorflow": "TensorFlow",
    "vllm": "vLLM", "cuda": "CUDA",
    "langchain": "LangChain",
    "fine-tuning": "Fine-tuning", "fine tuning": "Fine-tuning",
    "infrastructure": "Infrastructure",
    "python": "Python", "rust": "Rust",
    "transformers": "Transformers", "huggingface": "HuggingFace",
    "generative ai": "Generative AI", "genai": "GenAI",
    "computer vision": "Computer Vision",
    "nlp": "NLP", "natural language processing": "NLP",
    "data engineering": "Data Engineering",
    "mlops": "MLOps", "ml ops": "MLOps",
    "prompt engineer": "Prompt Engineering",
    "research scientist": "AI Research", "ai researcher": "AI Research",
    "ai ethics": "AI Ethics", "responsible ai": "AI Ethics", "ai safety": "AI Ethics",
    "solutions architect": "AI Solutions Architect",
    "product manager": "AI Product Management",
    "machine learning engineer": "ML Engineer",
}

# Only keep roles that actually look like AI/frontier-tech engineering roles,
# not sales/legal/office-ops postings that also live on these same boards.
TITLE_INCLUDE = re.compile(
    r"engineer|scientist|research|machine learning|\bml\b|\bai\b|applied|"
    r"infrastructure|data|mlops|solutions architect|technical program",
    re.IGNORECASE,
)
TITLE_EXCLUDE = re.compile(
    r"recruit|sales|account executive|counsel|legal|payroll|people ops|"
    r"executive assistant|office manager|marketing|paralegal",
    re.IGNORECASE,
)


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "artificialjobs.dev-bot/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20, context=SSL_CONTEXT) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        print(f"  ! fetch failed for {url}: {e}")
        return None


def tags_from_text(text):
    text_lower = text.lower()
    tags = []
    for kw, tag in TAG_KEYWORDS.items():
        if kw in text_lower and tag not in tags:
            tags.append(tag)
    return tags[:6] or ["AI"]


def clean_html(html):
    if not html:
        return ""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:2000]


def fetch_greenhouse(slug, company):
    data = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true")
    if not data:
        return []
    jobs = []
    for j in data.get("jobs", []):
        title = j.get("title", "")
        location = (j.get("location") or {}).get("name", "") or "Remote"
        description = clean_html(j.get("content", ""))
        updated_at = j.get("updated_at")
        date_posted = updated_at[:10] if updated_at else None
        jobs.append({
            "title": title,
            "company": company,
            "apply_url": j.get("absolute_url", ""),
            "location": location,
            "is_remote": "remote" in location.lower(),
            "job_type": "Full-time",
            "salary_min": 0,
            "salary_max": 0,
            "tags": tags_from_text(title + " " + description),
            "description": description,
            "date_posted": date_posted,
            "source": "greenhouse",
        })
    return jobs


def fetch_lever(slug, company):
    data = fetch_json(f"https://api.lever.co/v0/postings/{slug}?mode=json")
    if not data:
        return []
    jobs = []
    for j in data:
        title = j.get("text", "")
        categories = j.get("categories", {}) or {}
        location = categories.get("location") or "Remote"
        description = clean_html(j.get("descriptionPlain") or j.get("description", ""))
        created_at = j.get("createdAt")
        date_posted = None
        if created_at:
            date_posted = datetime.fromtimestamp(created_at / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
        jobs.append({
            "title": title,
            "company": company,
            "apply_url": j.get("hostedUrl", ""),
            "location": location,
            "is_remote": "remote" in location.lower(),
            "job_type": categories.get("commitment", "Full-time"),
            "salary_min": 0,
            "salary_max": 0,
            "tags": tags_from_text(title + " " + description),
            "description": description,
            "date_posted": date_posted,
            "source": "lever",
        })
    return jobs


def fetch_ashby(slug, company):
    data = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{slug}")
    if not data:
        return []
    jobs = []
    for j in data.get("jobs", []):
        title = j.get("title", "")
        location = j.get("location") or "Remote"
        description = clean_html(j.get("descriptionHtml", ""))
        published_at = j.get("publishedAt")
        date_posted = published_at[:10] if published_at else None
        comp = j.get("compensation") or {}
        summary = comp.get("summaryComponents") or []
        salary_min = salary_max = 0
        for c in summary:
            if c.get("compensationType") == "Salary":
                salary_min = c.get("minValue") or 0
                salary_max = c.get("maxValue") or 0
        jobs.append({
            "title": title,
            "company": company,
            "apply_url": j.get("applyUrl") or j.get("jobUrl", ""),
            "location": location,
            "is_remote": bool(j.get("isRemote")) or "remote" in location.lower(),
            "job_type": j.get("employmentType", "Full-time"),
            "salary_min": salary_min,
            "salary_max": salary_max,
            "tags": tags_from_text(title + " " + description),
            "description": description,
            "date_posted": date_posted,
            "source": "ashby",
        })
    return jobs


FETCHERS = {"greenhouse": fetch_greenhouse, "lever": fetch_lever, "ashby": fetch_ashby}


def is_frontier_role(title):
    return bool(TITLE_INCLUDE.search(title)) and not TITLE_EXCLUDE.search(title)


def main():
    with open(JOBS_JSON) as f:
        existing = json.load(f)
    existing_urls = {j.get("apply_url") for j in existing}

    fetched = []
    for ats, slug, company in COMPANIES:
        print(f"Fetching {company} ({ats}:{slug})...")
        jobs = FETCHERS[ats](slug, company)
        kept = [j for j in jobs if is_frontier_role(j["title"])]
        print(f"  {len(jobs)} roles, {len(kept)} match frontier-role filter")
        fetched.extend(kept)

    new_jobs = [j for j in fetched if j["apply_url"] and j["apply_url"] not in existing_urls]
    print(f"\n{len(fetched)} frontier roles fetched, {len(new_jobs)} are new")

    merged = existing + new_jobs
    with open(JOBS_JSON, "w") as f:
        json.dump(merged, f, indent=2)
    print(f"Saved {len(merged)} total jobs to {JOBS_JSON}")


if __name__ == "__main__":
    main()
