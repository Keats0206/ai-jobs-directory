import os
import json
import urllib.request
import re
import ssl

ssl_context = ssl._create_unverified_context()

EXA_API_KEY = os.environ.get("EXA_API_KEY", "47c57ecc-77bb-445f-83fd-515ff3fe50fe")

QUERIES = [
    "site:ashbyhq.com AI Engineer remote",
    "site:boards.greenhouse.io LLM Engineer",
    "site:jobs.lever.co Machine Learning Engineer AI"
]

def search_exa(query):
    url = "https://api.exa.ai/search"
    payload = {
        "query": query,
        "numResults": 10,
        "contents": {
            "text": {"maxCharacters": 2000}
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
        print(f"Error fetching from Exa: {e}")
        return []

def extract_job_info(item):
    title = item.get("title", "")
    url = item.get("url", "")
    text = item.get("text", "")
    
    # Simple extraction logic for company name & role
    company = "AI Startup"
    if "at " in title:
        parts = title.split("at ")
        title = parts[0].strip()
        company = parts[1].split("-")[0].split("|")[0].strip()
    elif "-" in title:
        parts = title.split("-")
        title = parts[0].strip()
        company = parts[1].strip()

    # Determine tags
    tags = []
    keywords = ["PyTorch", "vLLM", "CUDA", "LLM", "RAG", "LangChain", "Agent", "Fine-tuning", "Infrastructure", "Python", "Rust"]
    for kw in keywords:
        if kw.lower() in text.lower() or kw.lower() in title.lower():
            tags.append(kw)
    if not tags:
        tags = ["LLM", "AI"]

    # Basic salary check
    salary_match = re.search(r'\$(\d{2,3}),?\d{3}\s*-\s*\$(\d{2,3}),?\d{3}', text)
    salary_min = int(salary_match.group(1)) * 1000 if salary_match else 160000
    salary_max = int(salary_match.group(2)) * 1000 if salary_match else 240000

    return {
        "title": title,
        "company": company,
        "apply_url": url,
        "location": "Remote / USA",
        "is_remote": True,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "tags": tags,
        "description": text[:1000] + "..." if len(text) > 1000 else text
    }

def main():
    print("Fetching active AI roles using Exa...")
    all_jobs = []
    seen_urls = set()

    for q in QUERIES:
        results = search_exa(q)
        for res in results:
            url = res.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                job = extract_job_info(res)
                all_jobs.append(job)

    out_file = "/Users/petekeating/ai-jobs-directory/seeded_jobs.json"
    with open(out_file, "w") as f:
        json.dump(all_jobs, f, indent=2)

    print(f"Successfully seeded {len(all_jobs)} active AI job roles to {out_file}")

if __name__ == "__main__":
    main()
