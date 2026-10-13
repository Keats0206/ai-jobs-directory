"""Write today's aggregate hiring snapshot to web/data/history/YYYY-MM-DD.json.
Trend stats ("RAG roles up 31% this month") compare these files. Re-running the same day overwrites.
Run from any directory: python3 scripts/snapshot_history.py [--date YYYY-MM-DD]
"""
import argparse
import json
import statistics
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'web/data'
TOP = 50

def salary(job, facts):
    """Structured feed salary first, then the range stated in the description."""
    low, high = job.get('salary_min') or 0, job.get('salary_max') or 0
    if not (low and high):
        low, high = facts.get('salary_min_usd') or 0, facts.get('salary_max_usd') or 0
    return (low + high) / 2 if low and high else None

def median(values):
    return round(statistics.median(values)) if values else None

def snapshot(jobs, enrichment, date):
    active = [job for job in jobs if job.get('status', 'active') == 'active']
    facts = {job.get('slug'): enrichment.get(job.get('slug'), {}) for job in active}
    midpoints = {job.get('slug'): salary(job, facts[job.get('slug')]) for job in active}
    def count(values):
        return dict(Counter(values).most_common(TOP))
    def salaries_by(key):
        groups = {}
        for job in active:
            for value in key(job):
                if midpoints[job.get('slug')]: groups.setdefault(value, []).append(midpoints[job.get('slug')])
        return {value: median(points) for value, points in sorted(groups.items()) if len(points) >= 5}
    tags = lambda job: job.get('tags') or []
    stack = lambda job: facts[job.get('slug')].get('stack') or []
    return dict(
        date=date,
        jobs=len(active),
        remote=sum(1 for job in active if job.get('is_remote')),
        companies=len({job.get('company') for job in active}),
        enriched=sum(1 for job in active if facts[job.get('slug')]),
        with_salary=sum(1 for point in midpoints.values() if point),
        median_salary=median([point for point in midpoints.values() if point]),
        visa_sponsorship=sum(1 for job in active if facts[job.get('slug')].get('visa_sponsorship') == 'yes'),
        new_last_7_days=sum(1 for job in active if (job.get('first_seen') or '')[:10] >= _days_before(date, 7)),
        by_tag=count(tag for job in active for tag in tags(job)),
        by_stack=count(tool for job in active for tool in stack(job)),
        by_company=count(job.get('company') for job in active),
        by_seniority=count(facts[job.get('slug')].get('seniority') or 'unknown' for job in active),
        by_work_type=count(facts[job.get('slug')].get('work_type') or 'other' for job in active),
        median_salary_by_tag=salaries_by(tags),
        median_salary_by_stack=salaries_by(stack),
    )

def _days_before(date, days):
    return datetime.fromordinal(datetime.fromisoformat(date).toordinal() - days).date().isoformat()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--date', default=datetime.now(timezone.utc).date().isoformat())
    args = parser.parse_args()
    jobs = json.loads((DATA / 'jobs.json').read_text())
    path = DATA / 'job-enrichment.json'
    enrichment = json.loads(path.read_text()) if path.exists() else {}
    result = snapshot(jobs, enrichment, args.date)
    folder = DATA / 'history'
    folder.mkdir(exist_ok=True)
    target = folder / f'{args.date}.json'
    temporary = target.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n')
    temporary.replace(target)
    print(f"{target.name}: {result['jobs']} jobs, {result['enriched']} enriched, median ${result['median_salary']}")

if __name__ == '__main__': main()
