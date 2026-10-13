"""Find public ATS boards for candidate companies by probing likely slugs. No API keys needed.
python3 scripts/probe_sources.py [--write]
Reads scripts/company-candidates.txt ("Company | scope" per line; scope "ai" filters to AI titles).
--legacy also lists boards that unverified legacy jobs point at, for manual review only: their company
names are unreliable, so approved ones belong in company-candidates.txt. --write adds curated boards to job-sources.json.
"""
import argparse
import concurrent.futures
import json
import re
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from refresh_jobs import DATA, fetch_board, slugify
from discover_sources import board_from_url

ROOT = Path(__file__).resolve().parents[1]
ATS = ('ashby', 'greenhouse', 'lever')
MIN_ROLES = 2

def slug_variants(company):
    base = re.sub(r'\(.*?\)', '', company).strip()
    words = slugify(base).split('-')
    trimmed = [w for w in words if w not in ('ai', 'inc', 'labs', 'technologies', 'the')] or words
    return list(dict.fromkeys([''.join(words), '-'.join(words), ''.join(trimmed), ''.join(words) + 'ai', ''.join(trimmed) + 'ai']))

def candidates_from_file(path):
    rows = []
    for line in path.read_text().splitlines():
        line = line.split('#')[0].strip()
        if not line: continue
        company, _, scope = (part.strip() for part in line.partition('|'))
        rows.append(dict(company=company, scope=scope or None))
    return rows

def candidates_from_legacy(jobs):
    """Boards that unverified legacy jobs point at: each one can turn guesses into verified listings."""
    boards = {}
    for job in jobs:
        if job.get('source_verified') or job.get('status', 'active') != 'active': continue
        board = board_from_url(job.get('apply_url', ''))
        if board: boards.setdefault(board, job.get('company') or board[1])
    return boards

def probe(source, now):
    try:
        records, total, _ = fetch_board(source, now)
        return dict(source, roles=len(records), fetched=total)
    except (urllib.error.HTTPError, urllib.error.URLError, ValueError, TimeoutError, AttributeError, KeyError):
        return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--legacy', action='store_true', help='Probe boards referenced by legacy jobs (review only; never written)')
    args = parser.parse_args()
    now = datetime.now(timezone.utc).isoformat()
    existing = json.loads((DATA / 'job-sources.json').read_text())
    known = {(s['ats'], s['slug'].lower()) for s in existing}
    known_companies = {s['company'].lower() for s in existing}
    attempts = []
    for row in candidates_from_file(ROOT / 'scripts/company-candidates.txt'):
        if row['company'].lower() in known_companies: continue
        for slug in slug_variants(row['company']):
            for ats in ATS:
                attempts.append(dict(ats=ats, slug=slug, company=row['company'], **({'role_scope': row['scope']} if row['scope'] else {})))
    if args.legacy:
        for (ats, slug), company in candidates_from_legacy(json.loads((DATA / 'jobs.json').read_text())).items():
            attempts.append(dict(ats=ats, slug=slug, company=company, role_scope='ai', legacy=True))
    attempts = [a for a in attempts if (a['ats'], a['slug'].lower()) not in known]
    print(f'Probing {len(attempts)} board URLs…')
    found = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
        for result in pool.map(lambda source: probe(source, now), attempts):
            if not result or result['roles'] < MIN_ROLES: continue
            # One board per company: keep whichever ATS/slug returns the most roles.
            best = found.get(result['company'].lower())
            if not best or result['roles'] > best['roles']: found[result['company'].lower()] = result
    boards = sorted(found.values(), key=lambda row: -row['roles'])
    for row in boards:
        print(f"{row['roles']:4} roles  {row['ats']}:{row['slug']}  {row['company']}{'  [ai filter]' if row.get('role_scope') else ''}{'  [legacy: review]' if row.get('legacy') else ''}")
    print(f'{len(boards)} new boards, {sum(row["roles"] for row in boards)} roles')
    if args.write:
        additions = [{k: v for k, v in row.items() if k in ('ats', 'slug', 'company', 'role_scope')} for row in boards if not row.get('legacy')]
        path = DATA / 'job-sources.json'
        path.write_text(json.dumps(existing + additions, indent=2, ensure_ascii=False) + '\n')
        print(f'Added {len(additions)} sources to {path.name}')

if __name__ == '__main__': main()
