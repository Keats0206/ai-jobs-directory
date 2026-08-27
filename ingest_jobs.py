import os
import json
import urllib.request
import urllib.parse
import re
import ssl
from datetime import datetime

ssl_context = ssl._create_unverified_context()

EXA_API_KEY = os.environ.get("EXA_API_KEY", "47c57ecc-77bb-445f-83fd-515ff3fe50fe")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pfpnpgmblszljcshztgk.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

# Expanded query list for better coverage
QUERIES = [
    # Job boards with AI focus
    "site:ashbyhq.com AI Engineer remote",
    "site:ashbyhq.com Machine Learning Engineer",
    "site:ashbyhq.com LLM Engineer",
    "site:boards.greenhouse.io AI Engineer",
    "site:boards.greenhouse.io Machine Learning",
    "site:jobs.lever.co AI Engineer",
    "site:jobs.lever.co Machine Learning Engineer",
    
    # Company career pages
    "site:anthropic.com careers AI",
    "site:openai.com careers engineer",
    "site:cohere.ai careers engineer",
    "site:huggingface.co jobs",
    "site:stability.ai careers",
    "site:replit.com careers AI",
    
    # Generic AI job searches
    "AI Engineer remote 2026",
    "LLM Engineer jobs remote",
    "Machine Learning Engineer AI startup",
    "GenAI engineer positions remote",
    "RAG engineer roles hiring",
    "Prompt engineer remote jobs",
    "Data scientist AI role remote",
    "ML infrastructure engineer remote",
    "Computer vision engineer remote",
    "NLP engineer positions"
]

def search_exa(query):
    """Search Exa API for job listings"""
    url = "https://api.exa.ai/search"
    payload = {
        "query": query,
        "numResults": 20,
        "contents": {
            "text": {"maxCharacters": 3000}
        }
    }
    headers = {
        "x-api-key": EXA_API_KEY,
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            data = json.loads(resp.read().decode())
            return data.get("results", [])
    except Exception as e:
        print(f"Error fetching from Exa for '{query}': {e}")
        return []

def extract_company_from_url(url):
    """Extract company name from known ATS URLs."""
    if not url:
        return None
    
    # Ashby: https://jobs.ashbyhq.com/{company-slug}/...
    m = re.search(r'jobs\.ashbyhq\.com/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        # Filter out non-company-looking slugs
        if raw.lower() not in ('careers', 'jobs', 'apply', 'embed'):
            return raw
    
    # Greenhouse: https://boards.greenhouse.io/{company-slug}/...
    m = re.search(r'boards\.greenhouse\.io/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        if raw.lower() not in ('careers', 'jobs', 'apply'):
            return raw
    
    # Lever: https://jobs.lever.co/{company-slug}/...
    m = re.search(r'jobs\.lever\.co/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        if raw.lower() not in ('careers', 'jobs', 'apply'):
            return raw
    
    # Workable: https://apply.workable.com/{company-slug}/...
    m = re.search(r'apply\.workable\.com/([^/]+)', url)
    if m:
        raw = m.group(1).replace('-', ' ').title()
        return raw
    
    # Generic domain extraction as last resort
    m = re.search(r'https?://([^/]+)', url)
    if m:
        domain = m.group(1)
        # Remove www.
        domain = re.sub(r'^www\.', '', domain)
        # Try to extract meaningful name (before first dot, if it's a known TLD)
        parts = domain.split('.')
        if len(parts) >= 2 and parts[-1] in ('com', 'io', 'ai', 'co', 'org', 'dev'):
            name = parts[-2] if parts[-2] not in ('jobs', 'careers', 'boards', 'apply', 'api', 'www') else parts[0]
            # Handle subdomain company names like "company.ashbyhq.com" → skip, not useful
            if name.lower() in ('ashbyhq', 'greenhouse', 'lever', 'workable', 'recruiting'):
                return None
            return name.replace('-', ' ').title()
    
    return None

def extract_job_info(item):
    """Extract structured job data from Exa result"""
    title = item.get("title", "Unknown Role")
    url = item.get("url", "")
    text = item.get("text", "")
    
    # --- Parse company name ---
    company = "AI Startup"
    
    # 1. Try " at Company" pattern in title (most reliable)
    if " at " in title.lower():
        parts = re.split(r'\s+at\s+', title, flags=re.IGNORECASE)
        title = parts[0].strip()
        potential = parts[1].split("-")[0].split("|")[0].split("(")[0].strip()
        # Clean up common suffixes
        potential = re.sub(r'\s*(\.\.\.|\.\.|…)\s*$', '', potential).strip()
        if potential and len(potential) < 60:
            company = potential
    
    # 2. Try "@ Company" pattern
    if company == "AI Startup" and " @ " in title:
        parts = title.split(" @ ")
        title = parts[0].strip()
        potential = parts[1].split("-")[0].split("|")[0].strip()
        potential = re.sub(r'\s*(\.\.\.|\.\.|…)\s*$', '', potential).strip()
        if potential and len(potential) < 60:
            company = potential
    
    # 3. Try extracting from URL (Ashby, Greenhouse, Lever, etc.)
    if company == "AI Startup":
        url_company = extract_company_from_url(url)
        if url_company and len(url_company) < 60:
            company = url_company
    
    # 4. Check if title ends with a known company name pattern: "Role - Company"
    if company == "AI Startup" and " - " in title:
        parts = title.rsplit(" - ", 1)
        title = parts[0].strip()
        potential = parts[1].strip()
        potential = re.sub(r'\s*(\.\.\.|\.\.|…)\s*$', '', potential).strip()
        if potential and len(potential) < 60 and not potential.lower().startswith(('http', 'remote', 'hybrid', 'full')):
            company = potential
    
    # Extract salary range
    salary_match = re.search(r'\$(\d{2,3}),?(\d{3})\s*-\s*\$(\d{2,3}),?(\d{3})', text)
    if salary_match:
        salary_min = int(salary_match.group(1) + salary_match.group(2))
        salary_max = int(salary_match.group(3) + salary_match.group(4))
    else:
        # Default ranges by role
        if "senior" in title.lower() or "staff" in title.lower():
            salary_min, salary_max = 180000, 280000
        elif "principal" in title.lower():
            salary_min, salary_max = 220000, 350000
        else:
            salary_min, salary_max = 140000, 220000
    
    # Extract tags from keywords
    tags = []
    keywords = {
        "PyTorch": "PyTorch",
        "tensorflow": "TensorFlow",
        "vllm": "vLLM",
        "cuda": "CUDA",
        "llm": "LLM",
        "rag": "RAG",
        "langchain": "LangChain",
        "agent": "Agent",
        "fine-tuning": "Fine-tuning",
        "infrastructure": "Infrastructure",
        "python": "Python",
        "rust": "Rust",
        "transformers": "Transformers",
        "huggingface": "HuggingFace",
        "genai": "GenAI",
        "generative": "Generative AI",
        "computer vision": "Computer Vision",
        "nlp": "NLP",
        "data engineering": "Data Engineering"
    }
    
    text_lower = (text + title).lower()
    for keyword, tag in keywords.items():
        if keyword in text_lower:
            if tag not in tags:
                tags.append(tag)
    
    if not tags:
        tags = ["LLM", "AI"]
    
    # Determine job type
    job_type = "Full-time"
    if "contract" in text_lower:
        job_type = "Contract"
    elif "part-time" in text_lower:
        job_type = "Part-time"
    
    # Determine remote status
    is_remote = "remote" in text_lower or "remote" in url.lower()
    location = "Remote" if is_remote else "On-site"
    if "san francisco" in text_lower or "sf" in text_lower:
        location = "San Francisco, CA"
    elif "new york" in text_lower or "nyc" in text_lower:
        location = "New York, NY"
    elif "london" in text_lower:
        location = "London, UK"
    elif "toronto" in text_lower:
        location = "Toronto, CA"
    
    description = text[:2000] if len(text) > 2000 else text
    
    return {
        "title": title,
        "company": company,
        "apply_url": url,
        "location": location,
        "is_remote": is_remote,
        "job_type": job_type,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "tags": tags[:5],  # Limit to 5 tags
        "description": description,
        "fetched_at": datetime.utcnow().isoformat()
    }

def load_existing_jobs():
    """Load existing jobs to avoid duplicates"""
    try:
        with open("/Users/petekeating/ai-jobs-directory/seeded_jobs.json", "r") as f:
            return json.load(f)
    except:
        return []

def push_to_supabase(jobs):
    """Push jobs to Supabase via REST API"""
    if not jobs:
        print("No jobs to push")
        return 0
    
    url = f"{SUPABASE_URL}/rest/v1/jobs"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    pushed_count = 0
    for job in jobs:
        # Prepare payload for Supabase
        payload = {
            "title": job["title"],
            "slug": re.sub(r'[^a-z0-9]+', '-', job["title"].lower()),
            "location": job["location"],
            "is_remote": job["is_remote"],
            "job_type": job["job_type"],
            "salary_min": job["salary_min"],
            "salary_max": job["salary_max"],
            "tags": job["tags"],
            "description": job["description"],
            "apply_url": job["apply_url"]
        }
        
        # Check if job already exists (by apply_url)
        check_url = f"{SUPABASE_URL}/rest/v1/jobs?apply_url=eq.{urllib.parse.quote(job['apply_url'])}"
        req = urllib.request.Request(check_url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req, context=ssl_context) as resp:
                existing = json.loads(resp.read().decode())
                if existing:
                    continue  # Skip if already exists
        except:
            pass
        
        # Insert job
        req = urllib.request.Request(url, data=json.dumps([payload]).encode('utf-8'), headers=headers)
        try:
            with urllib.request.urlopen(req, context=ssl_context) as resp:
                pushed_count += 1
        except Exception as e:
            print(f"Error pushing job {job['title']}: {e}")
    
    return pushed_count

def main():
    print(f"[{datetime.utcnow().isoformat()}] Starting AI jobs daily ingest...")
    
    # Load existing jobs
    existing_jobs = load_existing_jobs()
    existing_urls = {j.get("apply_url") for j in existing_jobs}
    print(f"Loaded {len(existing_jobs)} existing jobs")
    
    # Fetch new jobs
    all_jobs = []
    seen_urls = set(existing_urls)
    
    for query in QUERIES:
        print(f"  Searching: {query}")
        results = search_exa(query)
        for res in results:
            url = res.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                try:
                    job = extract_job_info(res)
                    all_jobs.append(job)
                except Exception as e:
                    print(f"    Error parsing job: {e}")
    
    # Merge and save
    merged_jobs = existing_jobs + all_jobs
    merged_jobs = list({j["apply_url"]: j for j in merged_jobs}.values())  # Deduplicate
    
    with open("/Users/petekeating/ai-jobs-directory/seeded_jobs.json", "w") as f:
        json.dump(merged_jobs, f, indent=2)
    
    print(f"✓ Saved {len(merged_jobs)} total jobs to seeded_jobs.json")
    print(f"  New jobs today: {len(all_jobs)}")
    
    # Push to Supabase
    pushed = push_to_supabase(all_jobs)
    print(f"✓ Pushed {pushed} jobs to Supabase")
    
    print(f"[{datetime.utcnow().isoformat()}] Daily ingest complete")

if __name__ == "__main__":
    main()
