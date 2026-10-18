"""Refresh curated public ATS feeds. Preserve URLs; close only verified missing jobs.
Run from any directory: python3 scripts/refresh_jobs.py [--dry-run] [--limit N]
"""
import argparse
import concurrent.futures
import hashlib
import html
import json
from html.parser import HTMLParser
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'web/data'
try:
    import certifi
    SSL = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL = ssl.create_default_context()

ROLE = re.compile(r'engineer|scientist|research|\bml\b|\bai\b|machine learning|data|mlops|solutions architect', re.I)
EXCLUDE = re.compile(r'recruit|sales|account executive|legal|marketing|people ops|talent|security guard|accountant'
                     r'|data cent(?:er|re)|technician|facilit|construction|site selection|electrical engineer|mechanical engineer'
                     r'|manufacturing|quality engineer|supply chain|procurement|network (?:production )?engineer', re.I)
# For companies whose engineering spans hardware, data centers or vehicles, only these titles count as AI roles.
AI_TITLE = re.compile(r'\bAI\b|\bML\b|machine learning|deep learning|data scien|autonom|perception|computer vision'
                      r'|robot learning|reinforcement learning|scientist|research|inference|\bLLMs?\b|MLOps|model|agent|kernel|compiler', re.I)
KEYWORDS = {
    'LLM': r'\bllms?\b|large language model', 'RAG': r'\brag\b|retrieval.augmented',
    'Agent': r'\bagents?\b|agentic', 'Python': r'\bpython\b', 'Rust': r'\brust\b',
    'Fine-tuning': r'fine[ -]tun', 'MLOps': r'\bmlops\b|ml ops',
    'Computer Vision': r'computer vision', 'NLP': r'\bnlp\b|natural language processing',
    'PyTorch': r'\bpytorch\b', 'LangChain': r'\blangchain\b',
    'Infrastructure': r'infrastructure', 'Data Engineering': r'data engineer',
    'Generative AI': r'generative ai|\bgenai\b', 'CUDA': r'\bcuda\b',
}

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def canonical_url(url):
    parsed = urllib.parse.urlparse(url)
    host = (parsed.hostname or '').lower()
    if host == 'boards.greenhouse.io':
        host = 'job-boards.greenhouse.io'
    path = parsed.path.rstrip('/')
    if host == 'jobs.ashbyhq.com':
        path = re.sub(r'/application$', '', path)
    return urllib.parse.urlunparse(('https', host, path, '', '', ''))

def fetch_json(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'ArtificialJobs/1.0 (+https://www.artificialjobs.dev/sources)'})
            with urllib.request.urlopen(request, timeout=35, context=SSL) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)

class _Markdown(HTMLParser):
    """Keeps the structure job pages need (headings, paragraphs, bullets) and drops everything else."""
    BLOCK = {'p', 'div', 'section', 'ul', 'ol', 'table', 'tr', 'blockquote'}
    HEADING = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lines, self.line, self.bold_text, self.skip, self.bold, self.item = [], '', '', 0, 0, False
    def flush(self, prefix=''):
        text = re.sub(r'\s+', ' ', self.line).strip()
        bold = re.sub(r'\s+', ' ', self.bold_text).strip()
        if text:
            if not prefix and self.item: prefix = '- '
            # A short paragraph that is entirely bold is a heading in disguise.
            if not prefix and bold == text and len(text) < 80: prefix = '## '
            self.lines.append(prefix + (text.rstrip(':') if prefix == '## ' else text))
        self.line = self.bold_text = ''
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        elif tag in ('strong', 'b'): self.bold += 1
        elif tag == 'li': self.flush(); self.item = True
        elif tag in self.BLOCK or tag in self.HEADING or tag == 'br': self.flush()
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
        elif tag in ('strong', 'b'): self.bold = max(0, self.bold - 1)
        elif tag in self.HEADING: self.flush('## ')
        elif tag == 'li': self.flush('- '); self.item = False
        elif tag in self.BLOCK: self.flush()
    def handle_data(self, data):
        if self.skip: return
        self.line += data
        if self.bold: self.bold_text += data

# Page chrome some boards include before the actual description.
BOILERPLATE = re.compile(r'^(?:##\s*)?(?:job application for .+|apply(?: now)?|back to jobs)$', re.I)

def text_content(value):
    """ATS HTML -> light markdown: '## ' headings, '- ' bullets, blank lines between blocks."""
    value = html.unescape(value or '')  # Greenhouse sends entity-escaped HTML.
    if '<' not in value:  # Plain text: keep its line breaks as paragraphs.
        value = ''.join(f'<p>{html.escape(line)}</p>' for line in value.splitlines())
    parser = _Markdown()
    parser.feed(value)
    parser.close()
    parser.flush()
    lines = []
    for line in parser.lines:
        if BOILERPLATE.match(line) or (lines and line == lines[-1]): continue
        lines.append(line)
    # Consecutive bullets read as one list; everything else is separated by a blank line.
    out = ''
    for previous, line in zip([''] + lines, lines):
        out += ('\n' if previous.startswith('- ') and line.startswith('- ') else '\n\n' if out else '') + line
    return out[:16000]

def board_url(source):
    ats, slug = source['ats'], urllib.parse.quote(source['slug'], safe='')
    if ats == 'ashby': return f'https://api.ashbyhq.com/posting-api/job-board/{slug}?includeCompensation=true'
    if ats == 'lever': return f'https://api.lever.co/v0/postings/{slug}?mode=json'
    if ats == 'greenhouse': return f'https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true'
    raise ValueError('Unsupported ATS')

def normalize(raw, source, now):
    ats = source['ats']
    if ats == 'ashby':
        title, location = raw.get('title', ''), raw.get('location') or 'Not specified'
        url = raw.get('jobUrl') or raw.get('applyUrl', '')
        description = text_content(raw.get('descriptionHtml') or raw.get('descriptionPlain'))
        remote = raw.get('isRemote') is True
        posted = raw.get('publishedAt')
        job_type = raw.get('employmentType')
    elif ats == 'greenhouse':
        title, location = raw.get('title', ''), (raw.get('location') or {}).get('name') or 'Not specified'
        url, description = raw.get('absolute_url', ''), text_content(raw.get('content'))
        remote = bool(re.search(r'\bremote\b', location, re.I))
        posted, job_type = None, None  # updated_at is NOT a posting date.
    else:
        title, location = raw.get('text', ''), (raw.get('categories') or {}).get('location') or 'Not specified'
        url = raw.get('hostedUrl') or raw.get('applyUrl', '')
        pieces = [raw.get('description') or raw.get('descriptionPlain', '')]
        pieces.extend(f"<h3>{html.escape(item.get('text', ''))}</h3><ul>{item.get('content', '')}</ul>" for item in raw.get('lists', []))
        pieces.append(raw.get('additional') or '')
        description = text_content(''.join(pieces))
        remote = raw.get('workplaceType') == 'remote' or bool(re.search(r'\bremote\b', location, re.I))
        posted = datetime.fromtimestamp(raw['createdAt'] / 1000, timezone.utc).isoformat() if raw.get('createdAt') else None
        job_type = (raw.get('categories') or {}).get('commitment')
    if not title or not url.startswith('https://') or not description or not ROLE.search(title) or EXCLUDE.search(title):
        return None
    if source.get('role_scope') == 'ai' and not AI_TITLE.search(title):
        return None
    all_text = title + ' ' + description
    tags = [tag for tag, pattern in KEYWORDS.items() if re.search(pattern, all_text, re.I)] or ['AI']
    # Only structured annual USD compensation is stored in dollar fields.
    salary_min = salary_max = 0
    comp = raw.get('compensation') or {}
    for item in comp.get('summaryComponents') or []:
        if item.get('compensationType') == 'Salary' and item.get('currencyCode') == 'USD' and item.get('interval') in ('1 YEAR', 'YEAR', 'year'):
            salary_min, salary_max = item.get('minValue') or 0, item.get('maxValue') or 0
    return dict(title=title.strip(), company=source['company'], apply_url=url, location=location,
                is_remote=remote, salary_min=salary_min, salary_max=salary_max, tags=tags,
                description=description, job_type=job_type or '', date_posted=posted,
                source=ats, source_board=f"{ats}:{source['slug']}", source_url=board_url(source),
                source_verified=True, last_verified=now, status='active')

def fetch_board(source, now):
    payload = fetch_json(board_url(source))
    raw_jobs = payload if source['ats'] == 'lever' else payload.get('jobs')
    if not isinstance(raw_jobs, list): raise ValueError('Unexpected response; not treating as a closed board')
    records = [record for raw in raw_jobs if (record := normalize(raw, source, now))]
    available = {canonical_url(raw.get('jobUrl') or raw.get('absolute_url') or raw.get('hostedUrl') or raw.get('applyUrl') or '') for raw in raw_jobs}
    return records, len(raw_jobs), available

def merge_jobs(existing, records, successful_boards, now):
    merged = [dict(job) for job in existing]
    for index, job in enumerate(merged):
        job.setdefault('slug', f"{slugify(job['title'] + '-' + job['company'])}-{index}")
    positions = {}
    for index, job in enumerate(merged):
        positions.setdefault(canonical_url(job.get('apply_url', '')), index)
    seen = set()
    added = updated = closed = 0
    for record in records:
        key = canonical_url(record['apply_url'])
        if key in seen: continue
        seen.add(key)
        if key in positions:
            index = positions[key]
            old = merged[index]
            record['slug'] = old['slug']
            record['first_seen'] = old.get('first_seen') or old.get('fetched_at') or now
            merged[index] = record
            updated += 1
        else:
            record['slug'] = f"{slugify(record['title'] + '-' + record['company'])}-{len(merged)}"
            record['first_seen'] = now
            positions[key] = len(merged)
            merged.append(record)
            added += 1
    unique = set()
    for job in merged:
        key = canonical_url(job.get('apply_url', ''))
        url = urllib.parse.urlparse(key)
        ats = {'jobs.ashbyhq.com': 'ashby', 'jobs.lever.co': 'lever', 'job-boards.greenhouse.io': 'greenhouse'}.get(url.hostname)
        inferred = f"{ats}:{url.path.strip('/').split('/')[0]}" if ats else None
        board = job.get('source_board') or inferred
        if board in successful_boards and key not in seen:
            if key in successful_boards[board]:
                job['status'] = 'excluded'  # Still open, but outside the role filter.
            else:
                if job.get('status') != 'closed': closed += 1
                job['status'] = 'closed'
                job['closed_at'] = job.get('closed_at') or now
            job['source_board'] = board
        if key in unique:
            job['status'] = 'duplicate'
        unique.add(key)
        # Only jobs confirmed on an employer's own board are published; legacy imports stay as records for their URLs.
        if job.get('status', 'active') == 'active' and not job.get('source_verified'):
            job['status'] = 'unverified'
    return merged, dict(added=added, updated=updated, closed=closed)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--limit', type=int)
    args = parser.parse_args()
    sources = json.loads((DATA / 'job-sources.json').read_text())
    if args.limit: sources = sources[:args.limit]
    now = datetime.now(timezone.utc).isoformat()
    existing = json.loads((DATA / 'jobs.json').read_text())
    records, successful, report = [], {}, []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(fetch_board, source, now): source for source in sources}
        for future in concurrent.futures.as_completed(futures):
            source = futures[future]
            key = f"{source['ats']}:{source['slug']}"
            try:
                found, total, available = future.result()
                # A suddenly empty board needs review, not mass closure.
                if not total: raise ValueError('Empty board; retained existing records for review')
                records.extend(found)
                successful[key] = available
                report.append(dict(**source, status='ok', roles=len(found), fetched=total, checkedAt=now))
                print(f"{key}: {len(found)} relevant roles")
            except Exception as error:
                report.append(dict(**source, status='error', error=str(error)[:180], checkedAt=now))
                print(f"{key}: failed; existing records retained")
    if not successful: raise SystemExit('No feeds succeeded; nothing changed.')
    # Stable sort means results do not depend on which request finished first.
    records.sort(key=lambda job: (job['source_board'], canonical_url(job['apply_url'])))
    merged, counts = merge_jobs(existing, records, successful, now)
    report.sort(key=lambda row: row['company'])
    print(json.dumps(counts))
    if not args.dry_run:
        for name, data in [('jobs.json', merged), ('source-health.json', dict(updatedAt=now, sources=report, **counts))]:
            path = DATA / name
            temporary = path.with_suffix('.tmp')
            temporary.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
            temporary.replace(path)

if __name__ == '__main__': main()
