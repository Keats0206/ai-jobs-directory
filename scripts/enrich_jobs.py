"""Extract structured hiring facts from job descriptions with a small model.
Only new or changed active jobs are sent; results are cached by content hash.
Run from any directory: python3 scripts/enrich_jobs.py [--dry-run] [--limit N]
Requires AI_GATEWAY_API_KEY (Vercel AI Gateway). Without it, exits without changes.
"""
import argparse
import concurrent.futures
import hashlib
import json
import os
import ssl
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'web/data'
CACHE = DATA / 'job-enrichment.json'
MODEL = 'anthropic/claude-haiku-5.5'
ENDPOINT = 'https://ai-gateway.vercel.sh/v1/chat/completions'
VERSION = 1  # Bump when the schema or prompt changes to re-enrich everything.
try:
    import certifi
    SSL = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL = ssl.create_default_context()

# Closed vocabularies keep aggregates countable: "vLLM", "vllm" and "VLLM" are one bucket.
STACK = ['PyTorch', 'JAX', 'TensorFlow', 'CUDA', 'Triton', 'vLLM', 'TensorRT', 'SGLang', 'Ray', 'Kubernetes',
         'Spark', 'Kafka', 'Airflow', 'dbt', 'Snowflake', 'Databricks', 'AWS', 'GCP', 'Azure', 'Terraform',
         'LangChain', 'LlamaIndex', 'LangGraph', 'DSPy', 'MCP', 'Hugging Face', 'Weights & Biases', 'MLflow',
         'Pinecone', 'Weaviate', 'pgvector', 'Elasticsearch', 'Postgres', 'Redis',
         'Python', 'Rust', 'Go', 'C++', 'TypeScript', 'Java', 'Scala']
PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere', 'open-source']
REGIONS = ['us', 'canada', 'latam', 'uk', 'europe', 'india', 'apac', 'global']
SCHEMA = {
    'type': 'object', 'additionalProperties': False,
    'required': ['seniority', 'yoe_min', 'stack', 'model_providers', 'visa_sponsorship', 'remote_regions',
                 'work_type', 'team', 'salary_min_usd', 'salary_max_usd'],
    'properties': {
        'seniority': {'type': 'string', 'enum': ['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'manager', 'unknown']},
        'yoe_min': {'type': ['integer', 'null']},
        'stack': {'type': 'array', 'items': {'type': 'string', 'enum': STACK}},
        'model_providers': {'type': 'array', 'items': {'type': 'string', 'enum': PROVIDERS}},
        'visa_sponsorship': {'type': 'string', 'enum': ['yes', 'no', 'unstated']},
        'remote_regions': {'type': 'array', 'items': {'type': 'string', 'enum': REGIONS}},
        'work_type': {'type': 'string', 'enum': ['research', 'applied', 'infra', 'evals', 'data', 'product', 'other']},
        'team': {'type': ['string', 'null']},
        'salary_min_usd': {'type': ['integer', 'null']},
        'salary_max_usd': {'type': ['integer', 'null']},
    },
}
PROMPT = """Extract facts from this job posting. Only report what the text states; never guess.
- stack: technologies the role uses or requires, from the allowed list only.
- model_providers: model vendors the team builds on, only if named.
- visa_sponsorship: "yes" or "no" only if stated explicitly, otherwise "unstated".
- remote_regions: regions a remote hire may live in; empty if the role is not remote.
- team: the team or org name in 2-4 words, or null.
- salary_*_usd: annual base salary range in USD only if stated in USD; null otherwise. Hourly or non-USD pay is null.

Title: {title}
Company: {company}
Location: {location}

{description}"""

def content_hash(job):
    text = '\n'.join([str(VERSION), job.get('title', ''), job.get('location', ''), job.get('description', '')])
    return hashlib.sha256(text.encode()).hexdigest()[:16]

def call_model(job, key):
    body = json.dumps({
        # Extraction gains nothing from thinking: same answers at under half the cost.
        'model': MODEL, 'max_tokens': 800, 'temperature': 0, 'reasoning': {'enabled': False},
        'messages': [{'role': 'user', 'content': PROMPT.format(
            title=job['title'], company=job['company'], location=job.get('location', ''),
            description=job.get('description', '')[:8000])}],
        'response_format': {'type': 'json_schema', 'json_schema': {'name': 'job_facts', 'strict': True, 'schema': SCHEMA}},
    }).encode()
    for attempt in range(3):
        try:
            request = urllib.request.Request(ENDPOINT, data=body, headers={
                'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'})
            with urllib.request.urlopen(request, timeout=60, context=SSL) as response:
                payload = json.load(response)
            choice = payload['choices'][0]
            if choice.get('finish_reason') == 'length': raise ValueError('Response truncated at max_tokens')
            return json.loads(choice['message']['content']), payload.get('usage', {}).get('cost') or 0
        except urllib.error.HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** (attempt + 1))

def clean(facts):
    """Enforce the schema locally too; a provider that ignores strict mode must not corrupt aggregates."""
    def pick(value, allowed, default):
        return value if value in allowed else default
    def picks(values, allowed):
        return sorted({value for value in values or [] if value in allowed})
    def money(value):
        return value if isinstance(value, int) and 20_000 <= value <= 2_000_000 else None
    low, high = money(facts.get('salary_min_usd')), money(facts.get('salary_max_usd'))
    if low and high and low > high: low, high = high, low
    yoe = facts.get('yoe_min')
    team = facts.get('team')
    return dict(
        seniority=pick(facts.get('seniority'), SCHEMA['properties']['seniority']['enum'], 'unknown'),
        yoe_min=yoe if isinstance(yoe, int) and 0 <= yoe <= 30 else None,
        stack=picks(facts.get('stack'), STACK),
        model_providers=picks(facts.get('model_providers'), PROVIDERS),
        visa_sponsorship=pick(facts.get('visa_sponsorship'), ('yes', 'no', 'unstated'), 'unstated'),
        remote_regions=picks(facts.get('remote_regions'), REGIONS),
        work_type=pick(facts.get('work_type'), SCHEMA['properties']['work_type']['enum'], 'other'),
        team=team.strip()[:60] if isinstance(team, str) and team.strip() else None,
        salary_min_usd=low, salary_max_usd=high,
    )

def pending(jobs, cache):
    """Active jobs whose content has no cached result yet."""
    return [job for job in jobs if job.get('status', 'active') == 'active' and job.get('slug')
            and cache.get(job['slug'], {}).get('hash') != content_hash(job)]

def enrich(jobs, cache, call, now, workers=8, save=None):
    todo = pending(jobs, cache)
    done = failed = 0
    cost = 0.0
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(call, job): job for job in todo}
        for future in concurrent.futures.as_completed(futures):
            job = futures[future]
            try:
                facts, spent = future.result()
                cache[job['slug']] = dict(hash=content_hash(job), model=MODEL, enriched_at=now, **clean(facts))
                cost += spent
                done += 1
                if save and done % 100 == 0: save(cache)
            except Exception as error:
                failed += 1
                print(f"{job['slug']}: failed ({str(error)[:120]})")
    return dict(pending=len(todo), enriched=done, failed=failed, cost_usd=round(cost, 4))

def write(path, data):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, indent=1, ensure_ascii=False, sort_keys=True) + '\n')
    temporary.replace(path)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Show how many jobs need enrichment; no API calls')
    parser.add_argument('--limit', type=int, help='Enrich at most N jobs this run')
    args = parser.parse_args()
    jobs = json.loads((DATA / 'jobs.json').read_text())
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    todo = pending(jobs, cache)
    print(f'{len(todo)} active jobs need enrichment')
    if args.dry_run: return
    key = os.environ.get('AI_GATEWAY_API_KEY')
    if not key:
        print('AI_GATEWAY_API_KEY not set; skipping enrichment.')
        return
    if args.limit: jobs = todo[:args.limit]
    # Keep results for every job still in jobs.json (closed jobs feed history); drop removed ones.
    slugs = {job.get('slug') for job in json.loads((DATA / 'jobs.json').read_text())}
    cache = {slug: facts for slug, facts in cache.items() if slug in slugs}
    now = datetime.now(timezone.utc).isoformat()
    report = enrich(jobs, cache, lambda job: call_model(job, key), now, save=lambda data: write(CACHE, data))
    write(CACHE, cache)
    print(json.dumps(report))
    if report['enriched'] == 0 and report['failed'] > 0:
        raise SystemExit('Every enrichment request failed.')

if __name__ == '__main__': main()
