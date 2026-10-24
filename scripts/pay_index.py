"""Publish a monthly micro1 Pay Index edition from web/data/jobs.json.

Each edition is frozen once written: the JSON (web/data/pay-index/YYYY-MM.json) feeds the
/pay-index pages, and the CSV (web/public/pay-index/YYYY-MM.csv) is the citable download.
Rates are the top and bottom of each role's posted hourly range; salaried roles are counted
but excluded from pay figures.

Usage: python3 scripts/pay_index.py [--edition YYYY-MM] [--force] [--dry-run]
"""
import argparse
import csv
import io
import json
import statistics
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JOBS_JSON = ROOT / 'web/data/jobs.json'
EDITIONS_DIR = ROOT / 'web/data/pay-index'
CSV_DIR = ROOT / 'web/public/pay-index'
METHODOLOGY_VERSION = '2026-10'


def median(values):
    return round(statistics.median(values)) if values else None


def p90(values):
    if len(values) < 10:
        return None
    return round(statistics.quantiles(values, n=10)[-1])


def summarize(jobs):
    hourly = [j for j in jobs if j.get('hourly_max')]
    highs = [j['hourly_max'] for j in hourly]
    lows = [j.get('hourly_min') or j['hourly_max'] for j in hourly]
    return dict(
        roles=len(jobs),
        hourly_roles=len(hourly),
        median_low=median(lows),
        median_high=median(highs),
        p90_high=p90(highs),
        max_high=round(max(highs)) if highs else None,
        high_demand=sum(1 for j in jobs if j.get('high_demand')),
    )


def build(jobs, edition, snapshot):
    active = [j for j in jobs if j.get('source') == 'micro1' and j.get('status', 'active') == 'active']
    groups = {}
    for job in active:
        groups.setdefault(job.get('field') or 'other', []).append(job)
    fields = [
        dict(slug=slug, label=group[0].get('field_label') or slug, **summarize(group))
        for slug, group in groups.items()
    ]
    # Highest-paying field first; fields with no hourly roles last.
    fields.sort(key=lambda f: (f['median_high'] is None, -(f['median_high'] or 0), -f['roles']))
    return dict(
        edition=edition,
        snapshot_date=snapshot,
        published=snapshot,
        methodology_version=METHODOLOGY_VERSION,
        source='micro1 public referral job feed (prod-api.micro1.ai) and public job pages',
        license='CC BY 4.0',
        doi=None,
        overall=dict(**summarize(active), fields=len(fields)),
        fields=fields,
    )


def to_csv(index):
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(['edition', 'snapshot_date', 'field_slug', 'field', 'roles', 'hourly_roles',
                     'median_low_usd_hr', 'median_high_usd_hr', 'p90_high_usd_hr', 'max_high_usd_hr', 'high_demand_roles'])
    rows = [dict(slug='all', label='All fields', **{k: v for k, v in index['overall'].items()
                                                     if k != 'fields'})] + index['fields']
    for f in rows:
        writer.writerow([index['edition'], index['snapshot_date'], f['slug'], f['label'], f['roles'], f['hourly_roles'],
                         f['median_low'], f['median_high'], f['p90_high'], f['max_high'], f['high_demand']])
    return out.getvalue()


def main():
    parser = argparse.ArgumentParser()
    now = datetime.now(timezone.utc)
    parser.add_argument('--edition', default=now.strftime('%Y-%m'))
    parser.add_argument('--force', action='store_true', help='overwrite a published edition')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    target = EDITIONS_DIR / f'{args.edition}.json'
    if target.exists() and not args.force:
        print(f'Edition {args.edition} already published; editions are frozen (use --force to rebuild).')
        return
    index = build(json.loads(JOBS_JSON.read_text()), args.edition, now.strftime('%Y-%m-%d'))
    o = index['overall']
    print(f"{args.edition}: {o['roles']} roles, {o['hourly_roles']} hourly, median ${o['median_low']}–${o['median_high']}/hr, {o['fields']} fields")
    if args.dry_run:
        return
    EDITIONS_DIR.mkdir(parents=True, exist_ok=True)
    CSV_DIR.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(index, indent=2) + '\n')
    (CSV_DIR / f'{args.edition}.csv').write_text(to_csv(index))


if __name__ == '__main__':
    main()
