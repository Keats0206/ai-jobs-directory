"""Pull micro1's open expert roles into web/data/jobs.json with referral apply links.

Uses the public endpoint behind micro1's shareable referral page
(refer.micro1.ai/referral/jobs?referralCode=...), so no login is needed — only
your referral code, found in the share link on refer.micro1.ai/opportunities.

Roles that disappear from the feed are marked closed (only when the feed returned
jobs), so filled listings drop off the site on the next deploy.

Usage: MICRO1_REFERRAL_CODE=<uuid> python3 scripts/fetch_micro1_jobs.py [--dry-run]
"""
import argparse
import json
import os
import re
import ssl
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JOBS_JSON = ROOT / 'web/data/jobs.json'
PARTNERSHIPS_JSON = ROOT / 'web/data/data-partnerships.json'
API = 'https://prod-api.micro1.ai/api/v1/job/portal/referral'
SOURCE_BOARD = 'micro1:referral'
PAGE_SIZE = 50
# micro1's domain_slug values; anything unlisted is title-cased.
FIELD_LABELS = {
    'ai-machine-learning': 'AI & Machine Learning', 'language-audio': 'Languages & Audio',
    'sciences-research': 'Science & Research', 'sales-marketing': 'Sales & Marketing',
    'business-operations': 'Business Operations', 'arts-design': 'Arts & Design',
    'retail-hospitality': 'Retail & Hospitality', 'data-analysis': 'Data Analysis',
    'software-engineering': 'Software Engineering', 'applied-engineering': 'Applied Engineering',
    'other': 'Specialist',
}
try:
    import certifi
    SSL = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL = ssl.create_default_context()


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def fetch_json(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={
                'Accept': 'application/json', 'x-custom-lang': 'en',
                'User-Agent': 'ArtificialJobs/1.0 (+https://www.artificialjobs.dev/sources)'})
            with urllib.request.urlopen(request, timeout=30, context=SSL) as response:
                return json.load(response)
        except Exception:
            if attempt == 2: raise
            time.sleep(2 ** attempt)


def fetch_all(code, feed='jobs'):
    rows, page = [], 1
    while True:
        query = urllib.parse.urlencode(dict(page=page, limit=PAGE_SIZE))
        payload = fetch_json(f'{API}/{urllib.parse.quote(code)}/{feed}?{query}')
        batch = payload.get('data') or payload.get('jobs') or []
        if isinstance(batch, dict): batch = batch.get('jobs') or batch.get('data') or []
        if not isinstance(batch, list): raise ValueError(f'Unexpected response keys: {list(payload)}')
        rows.extend(batch)
        total = payload.get('total') or 0
        if not batch or len(rows) >= total: return rows
        page += 1


def referral_url(raw, code):
    """Make sure the apply link carries the referral code, whatever micro1 returns."""
    url = raw.get('apply_url') or ''
    if not url.startswith('https://'): return None
    parsed = urllib.parse.urlparse(url)
    params = dict(urllib.parse.parse_qsl(parsed.query))
    if params.get('referralCode') != code:
        params.update(referralCode=code, utm_source='referral', utm_medium='share', utm_campaign='job_referral')
    return urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(params)))


def money(value):
    try: return float(str(value).replace('$', '').replace(',', ''))
    except (TypeError, ValueError): return 0.0


def hourly_range(value):
    if isinstance(value, dict): return money(value.get('min')), money(value.get('max'))
    rate = money(value)
    return rate, rate


def normalize(raw, code, now):
    title, url = (raw.get('job_name') or '').strip(), referral_url(raw, code)
    if not title or not url or not raw.get('job_id'): return None
    hourly_min, hourly_max = hourly_range(raw.get('ideal_hourly_rate'))
    # micro1 sometimes puts annual salaries in the hourly field, and placeholder cents-level rates.
    yearly_min = yearly_max = 0
    if hourly_max >= 1000:
        yearly_min, yearly_max, hourly_min, hourly_max = hourly_min or hourly_max, hourly_max, 0, 0
    elif hourly_max < 5:
        hourly_min = hourly_max = 0
    monthly_min, monthly_max = money(raw.get('ideal_monthly_salary_min')), money(raw.get('ideal_monthly_salary_max'))
    remote = raw.get('location_type') == 'remote'
    if yearly_max:
        pay = f'${yearly_min:,.0f}–${yearly_max:,.0f}/year'
    elif hourly_max:
        pay = f'${hourly_min:,.0f}–${hourly_max:,.0f}/hour' if hourly_min and hourly_min != hourly_max else f'${hourly_max:,.0f}/hour'
    else:
        pay = f'${monthly_min:,.0f}–${monthly_max:,.0f}/month' if monthly_max else ''
    skills = [s for s in raw.get('skills') or [] if isinstance(s, str)]
    engagement = raw.get('engagement_type') or 'contract'
    lines = [f"{title} is an open {engagement} role sourced through micro1, "
             f"which matches domain experts with AI labs for model training and evaluation work."]
    if pay: lines.append(f'Pay: {pay}.')
    if skills: lines.append('Skills: ' + ', '.join(skills) + '.')
    if raw.get('no_of_openings'): lines.append(f"Openings: {raw['no_of_openings']}.")
    lines.append("Applying starts with micro1's AI interview; matched experts are placed on client projects.")
    posted = raw.get('date_posted')
    if posted and 'T' not in posted: posted = posted.replace(' ', 'T') + '+00:00'
    field = (raw.get('domain_slug') or 'other').strip().lower() or 'other'
    label = FIELD_LABELS.get(field) or field.replace('-', ' ').title()
    tags = ['AI Training'] + ([label] if field != 'other' else [])
    # Only annual USD goes in salary_min/max; hourly contract pay has its own fields.
    return dict(
        title=title, company=(raw.get('company_name') or 'micro1').strip(), apply_url=url,
        location='Remote' if remote else 'Not specified', is_remote=remote, salary_min=int(yearly_min), salary_max=int(yearly_max),
        tags=tags, description='\n\n'.join(lines), job_type=engagement.title(), date_posted=posted,
        source='micro1', source_board=SOURCE_BOARD, source_job_id=str(raw['job_id']), field=field, field_label=label,
        source_url=f'{API}/<referral>/jobs', hourly_min=hourly_min or None, hourly_max=hourly_max or None,
        referral_reward=money(raw.get('referral_reward_amount')) or None, is_referral=True,
        openings=int(money(raw.get('no_of_openings'))) or None,
        high_demand=str(raw.get('is_high_demand_job')) in ('1', 'True', 'true'), skills=skills,
        source_verified=True, last_verified=now, status='active')


def normalize_partnership(raw, code, now):
    """Company data deals: a company sells approved operational data; we earn the company referral reward."""
    url = referral_url(raw, code)
    if not url or not raw.get('job_name'): return None
    return dict(id=str(raw['job_id']), title=raw['job_name'].strip(), apply_url=url,
                requirements=[s for s in raw.get('skills') or [] if isinstance(s, str)],
                referral_reward=money(raw.get('referral_reward_amount')) or None,
                date_posted=raw.get('date_posted'), last_verified=now)


def merge(existing, records, now):
    merged = [dict(job) for job in existing]
    by_id = {job['source_job_id']: i for i, job in enumerate(merged)
             if job.get('source_board') == SOURCE_BOARD and job.get('source_job_id')}
    seen, added, updated = set(), 0, 0
    for record in records:
        key = record['source_job_id']
        if key in seen: continue
        seen.add(key)
        if key in by_id:
            old = merged[by_id[key]]
            record['slug'], record['first_seen'] = old['slug'], old.get('first_seen') or now
            merged[by_id[key]] = record
            updated += 1
        else:
            record['slug'] = f"{slugify(record['title'] + '-' + record['company'])}-{len(merged)}"
            record['first_seen'] = now
            by_id[key] = len(merged)
            merged.append(record)
            added += 1
    closed = 0
    for key, index in by_id.items():
        job = merged[index]
        if key not in seen and job.get('status') != 'closed':
            job['status'], job['closed_at'] = 'closed', now
            closed += 1
    return merged, dict(added=added, updated=updated, closed=closed)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    code = os.environ.get('MICRO1_REFERRAL_CODE', '').strip()
    if not code: raise SystemExit('Set MICRO1_REFERRAL_CODE to your micro1 referral code (a UUID).')
    now = datetime.now(timezone.utc).isoformat()
    raw_jobs = fetch_all(code)
    # An empty feed is more likely an API change than every role filling at once.
    if not raw_jobs: raise SystemExit('micro1 returned no jobs; nothing changed.')
    records = [record for raw in raw_jobs if (record := normalize(raw, code, now))]
    records.sort(key=lambda job: job['source_job_id'])
    merged, counts = merge(json.loads(JOBS_JSON.read_text()), records, now)
    print(f'micro1: {len(raw_jobs)} fetched, {len(records)} usable', json.dumps(counts))
    if args.dry_run:
        print(json.dumps(records[:2], indent=2))
        return
    temporary = JOBS_JSON.with_suffix('.tmp')
    temporary.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + '\n')
    temporary.replace(JOBS_JSON)
    # The data-partnership feed is small and fully replaced; an empty response keeps the last good copy.
    deals = [d for raw in fetch_all(code, 'company-vetting/jobs') if (d := normalize_partnership(raw, code, now))]
    print(f'micro1 data partnerships: {len(deals)}')
    if deals:
        PARTNERSHIPS_JSON.write_text(json.dumps(deals, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__': main()
