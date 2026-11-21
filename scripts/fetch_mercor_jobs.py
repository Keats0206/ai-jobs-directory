"""Pull Mercor's open expert roles into web/data/jobs.json with referral apply links.

Reads the public JSON feed behind work.mercor.com/explore (no login needed) and appends
your Mercor referral code to every apply link. The code is the UUID that your share link
(t.mercor.com/...) redirects to: work.mercor.com/?referralCode=<uuid>.

Roles that disappear from the feed are marked closed (only when the feed returned roles),
so filled listings drop off the site on the next deploy.

Usage: MERCOR_REFERRAL_CODE=<uuid> python3 scripts/fetch_mercor_jobs.py [--dry-run]
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from fetch_micro1_jobs import JOBS_JSON, fetch_json, merge, money  # noqa: E402

API = 'https://aws.api.mercor.com/work/listings-explore-page'
JOB_URL = 'https://work.mercor.com/jobs/{}'
SOURCE_BOARD = 'mercor:explore'

# Mercor's listingDomain values, mapped onto the site's (micro1-derived) field slugs.
FIELDS = {
    'Software Engineering': 'software-engineering', 'Medicine': 'medicine', 'Law': 'law', 'Finance': 'finance',
    'Life, Physical, and Social Science': 'sciences-research', 'Other Engineering': 'applied-engineering',
    'Business Operations': 'business-operations', 'Language and Audio': 'language-audio',
    'Arts & Design': 'arts-design', 'Data Analysis': 'data-analysis', 'Humanities': 'humanities',
    'Education': 'education', 'Sales & Marketing': 'sales-marketing', 'Cybersecurity': 'cybersecurity',
}
FIELD_LABELS = {
    'software-engineering': 'Software Engineering', 'medicine': 'Medicine', 'law': 'Law', 'finance': 'Finance',
    'sciences-research': 'Science & Research', 'applied-engineering': 'Applied Engineering',
    'business-operations': 'Business Operations', 'language-audio': 'Languages & Audio', 'arts-design': 'Arts & Design',
    'data-analysis': 'Data Analysis', 'humanities': 'Humanities', 'education': 'Education',
    'sales-marketing': 'Sales & Marketing', 'cybersecurity': 'Cybersecurity', 'other': 'Specialist',
}
# A quarter of listings have no domain; these title cues cover most of them.
TITLE_FIELDS = [
    (re.compile(r'linguist|translat|language|native speaker|transcri', re.I), 'language-audio'),
    (re.compile(r'physician|clinical|medical|pharma|nurs|regulatory affairs|pharmacovigilance', re.I), 'medicine'),
    (re.compile(r'attorney|lawyer|legal|paralegal', re.I), 'law'),
    (re.compile(r'software|engineer|developer|coding', re.I), 'software-engineering'),
    (re.compile(r'financ|fp&a|accountant|banking|investment|equity', re.I), 'finance'),
]
JOB_TYPES = {'part-time': 'Part-time', 'full-time': 'Full-time', 'hourly': 'Contract', 'task-based': 'Task-based'}
COUNTRIES = {
    'ALB': 'Albania', 'ARE': 'United Arab Emirates', 'ARG': 'Argentina', 'AUS': 'Australia', 'AUT': 'Austria',
    'BEL': 'Belgium', 'BGR': 'Bulgaria', 'BIH': 'Bosnia and Herzegovina', 'BOL': 'Bolivia', 'BRA': 'Brazil',
    'CAN': 'Canada', 'CHE': 'Switzerland', 'CHL': 'Chile', 'CHN': 'China', 'COL': 'Colombia', 'CRI': 'Costa Rica',
    'CUB': 'Cuba', 'CZE': 'Czechia', 'DEU': 'Germany', 'DNK': 'Denmark', 'DOM': 'Dominican Republic', 'ECU': 'Ecuador',
    'EGY': 'Egypt', 'ESP': 'Spain', 'EST': 'Estonia', 'FIN': 'Finland', 'FRA': 'France', 'GBR': 'United Kingdom',
    'GRC': 'Greece', 'GTM': 'Guatemala', 'GUY': 'Guyana', 'HKG': 'Hong Kong', 'HND': 'Honduras', 'HRV': 'Croatia',
    'HUN': 'Hungary', 'IDN': 'Indonesia', 'IND': 'India', 'IRL': 'Ireland', 'ISL': 'Iceland', 'ISR': 'Israel',
    'ITA': 'Italy', 'JOR': 'Jordan', 'JPN': 'Japan', 'KEN': 'Kenya', 'KOR': 'South Korea', 'LIE': 'Liechtenstein',
    'LTU': 'Lithuania', 'LUX': 'Luxembourg', 'LVA': 'Latvia', 'MCO': 'Monaco', 'MDA': 'Moldova', 'MEX': 'Mexico',
    'MKD': 'North Macedonia', 'MLT': 'Malta', 'MYS': 'Malaysia', 'NGA': 'Nigeria', 'NIC': 'Nicaragua',
    'NLD': 'Netherlands', 'NOR': 'Norway', 'NZL': 'New Zealand', 'PAK': 'Pakistan', 'PAN': 'Panama', 'PER': 'Peru',
    'PHL': 'Philippines', 'POL': 'Poland', 'PRT': 'Portugal', 'PRY': 'Paraguay', 'ROU': 'Romania', 'SAU': 'Saudi Arabia',
    'SGP': 'Singapore', 'SLV': 'El Salvador', 'SMR': 'San Marino', 'SRB': 'Serbia', 'SVK': 'Slovakia', 'SVN': 'Slovenia',
    'SWE': 'Sweden', 'THA': 'Thailand', 'TUR': 'Turkey', 'TWN': 'Taiwan', 'UKR': 'Ukraine', 'URY': 'Uruguay',
    'USA': 'United States', 'VEN': 'Venezuela', 'VNM': 'Vietnam', 'XKX': 'Kosovo', 'ZAF': 'South Africa',
}


def referral_url(listing_id, code):
    query = urllib.parse.urlencode(dict(referralCode=code, utm_source='referral', utm_medium='share', utm_campaign='job_referral'))
    return f'{JOB_URL.format(urllib.parse.quote(listing_id))}?{query}'


def field_for(raw):
    field = FIELDS.get(raw.get('listingDomain') or '')
    if field: return field
    title = raw.get('title') or ''
    return next((slug for pattern, slug in TITLE_FIELDS if pattern.search(title)), 'other')


def clean_markdown(text):
    """Mercor descriptions are already markdown; drop escaped list numbers and links the site doesn't render."""
    text = re.sub(r'^(#+\s*)\d+\\?\.\s*', r'\1', text or '', flags=re.M)  # "## 1\. Overview" -> "## Overview"
    text = re.sub(r'\\([.\-*_#()\[\]])', r'\1', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'^#{1}\s', '## ', text, flags=re.M)
    text = re.sub(r'^#{3,}\s', '## ', text, flags=re.M)
    text = re.sub(r'[ \t]+\n', '\n', text)
    text = re.sub(r'^(- .*)\n\n(?=- )', r'\1\n', text, flags=re.M)  # tighten loose bullet lists
    text = re.sub(r'^(- .*)\n\n(?=- )', r'\1\n', text, flags=re.M)
    return re.sub(r'\n{3,}', '\n\n', text).strip()


def iso(value):
    if not value: return None
    return value if re.search(r'[+-]\d\d:\d\d$|Z$', value) else value + '+00:00'


def normalize(raw, code, now):
    title, listing_id = (raw.get('title') or '').strip(), raw.get('listingId')
    if not title or not listing_id or raw.get('status') != 'active' or raw.get('isPrivate') or raw.get('disableApplications'):
        return None
    low, high = money(raw.get('rateMin')), money(raw.get('rateMax'))
    if low and not high: high = low
    frequency = raw.get('payRateFrequency') or 'hourly'
    hourly_min = hourly_max = yearly_min = yearly_max = flat_min = flat_max = 0
    if frequency == 'hourly' and 5 <= high < 1000: hourly_min, hourly_max = low or high, high
    elif frequency == 'yearly' and high >= 1000: yearly_min, yearly_max = low or high, high
    elif frequency in ('per-task', 'one-time') and high: flat_min, flat_max = low or high, high
    arrangement = raw.get('workArrangement') or 'remote'
    remote = arrangement == 'remote'
    location = (raw.get('location') or '').strip() or ('Remote' if remote else 'Not specified')
    countries = [COUNTRIES.get(c, c) for c in (raw.get('eligibleLocation') or raw.get('eligibleResidenceLocation') or []) if isinstance(c, str)]
    field = field_for(raw)
    label = FIELD_LABELS.get(field, 'Specialist')
    company = (raw.get('companyName') or '').strip() if raw.get('companyBrandVisible') else ''
    commitment = raw.get('commitment') or 'hourly'
    hours = raw.get('hoursPerWeek')
    body = clean_markdown(raw.get('description') or '')
    if not body:
        body = f'{title} is an open role on Mercor, which hires domain experts to train and evaluate AI models for leading labs.'
    return dict(
        title=title, company=company or 'Mercor', apply_url=referral_url(listing_id, code),
        location=location, is_remote=remote, salary_min=int(yearly_min), salary_max=int(yearly_max),
        tags=['AI Training'] + ([label] if field != 'other' else []), description=body,
        job_type=JOB_TYPES.get(commitment, 'Contract'), date_posted=iso(raw.get('postedAt') or raw.get('createdAt')),
        source='mercor', source_board=SOURCE_BOARD, source_job_id=listing_id, field=field, field_label=label,
        source_url=API, hourly_min=hourly_min or None, hourly_max=hourly_max or None,
        flat_pay_min=flat_min or None, flat_pay_max=flat_max or None,
        pay_frequency=frequency if flat_max else None,
        hours_per_week=int(money(hours)) or None, work_arrangement=arrangement,
        referral_reward=money(raw.get('referralAmount')) or None, is_referral=True,
        openings=int(money(raw.get('remainingSlots'))) or None, high_demand=False, skills=[],
        applicant_countries=countries, source_verified=True, last_verified=now, status='active')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    code = os.environ.get('MERCOR_REFERRAL_CODE', '').strip()
    if not code: raise SystemExit('Set MERCOR_REFERRAL_CODE to your Mercor referral code (a UUID).')
    now = datetime.now(timezone.utc).isoformat()
    payload = fetch_json(API)
    raw_jobs = payload.get('listings') if isinstance(payload, dict) else payload
    if not isinstance(raw_jobs, list): raise SystemExit(f'Unexpected Mercor response: {str(payload)[:200]}')
    # An empty feed is more likely an API change than every role filling at once.
    if not raw_jobs: raise SystemExit('Mercor returned no listings; nothing changed.')
    records = [record for raw in raw_jobs if (record := normalize(raw, code, now))]
    records.sort(key=lambda job: job['source_job_id'])
    merged, counts = merge(json.loads(JOBS_JSON.read_text()), records, now, source_board=SOURCE_BOARD)
    print(f'mercor: {len(raw_jobs)} fetched, {len(records)} usable', json.dumps(counts))
    if args.dry_run:
        print(json.dumps({k: v for k, v in records[0].items() if k != 'description'}, indent=2))
        print(records[0]['description'][:800])
        return
    temporary = JOBS_JSON.with_suffix('.tmp')
    temporary.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + '\n')
    temporary.replace(JOBS_JSON)


if __name__ == '__main__': main()
