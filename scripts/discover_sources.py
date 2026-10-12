"""Bounded Exa discovery of candidate ATS boards; never auto-publishes search text.
EXA_API_KEY=... python3 scripts/discover_sources.py --queries 3 --results 20
Candidates retain evidence URLs and need a confirmed company name in job-sources.json.
"""
import argparse
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path
from datetime import datetime, timezone
from refresh_jobs import SSL
ROOT = Path(__file__).resolve().parents[1]
QUERIES = ['AI engineering startup careers jobs Ashby', 'machine learning AI research careers Greenhouse', 'LLM AI infrastructure engineering jobs Lever']

def board_from_url(value):
    url = urllib.parse.urlparse(value)
    providers = {'jobs.ashbyhq.com':'ashby', 'boards.greenhouse.io':'greenhouse', 'job-boards.greenhouse.io':'greenhouse', 'jobs.lever.co':'lever'}
    ats = providers.get(url.hostname)
    slug = url.path.strip('/').split('/')[0]
    if not ats or not re.fullmatch(r'[A-Za-z0-9_-]+', slug) or slug in ('embed','jobs'): return None
    return ats, slug

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--queries', type=int, default=3, choices=range(1,4))
    parser.add_argument('--results', type=int, default=20, choices=range(1,26))
    args = parser.parse_args()
    key = os.getenv('EXA_API_KEY')
    if not key: raise SystemExit('Set EXA_API_KEY in your environment; do not put it in source code.')
    existing = json.loads((ROOT/'web/data/job-sources.json').read_text())
    known = {(item['ats'], item['slug'].lower()) for item in existing}
    candidates = {}
    for query in QUERIES[:args.queries]:
        payload = json.dumps({'query':query, 'type':'auto', 'numResults':args.results, 'includeDomains':['jobs.ashbyhq.com','job-boards.greenhouse.io','boards.greenhouse.io','jobs.lever.co']}).encode()
        req = urllib.request.Request('https://api.exa.ai/search', data=payload, headers={'x-api-key':key, 'Content-Type':'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=45, context=SSL) as response: result=json.load(response)
        for row in result.get('results',[]):
            board = board_from_url(row.get('url',''))
            if not board or (board[0],board[1].lower()) in known: continue
            candidates[f'{board[0]}:{board[1]}'] = {'ats':board[0], 'slug':board[1], 'evidenceUrl':row['url'], 'sourceTitle':row.get('title',''), 'status':'needs_company_verification'}
    output = {'checkedAt':datetime.now(timezone.utc).isoformat(),'requests':args.queries,'candidates':list(candidates.values())}
    path=ROOT/'web/data/source-candidates.json'
    path.write_text(json.dumps(output,indent=2)+'\n')
    print(f'{len(candidates)} candidate boards saved for review after {args.queries} Exa requests.')
if __name__=='__main__': main()
