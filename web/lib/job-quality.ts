import type { Job } from './jobs';

/** Accept real ISO calendar dates; never synthesize posting or closing dates. */
function sourceDate(value?: string): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return undefined;
  const day = value.slice(0, 10);
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || new Date(day + 'T00:00:00Z').toISOString().slice(0, 10) !== day) return undefined;
  return value;
}

/** Employer posting date. A crawler's fetched_at is not a posting date. */
export function datePosted(job: Job): string | undefined {
  return sourceDate(job.date_posted) ?? sourceDate(job.posted_at);
}

/** Only emit an expiry when the source actually supplied one. */
export function validThrough(job: Job): string | undefined {
  return sourceDate(job.valid_through) ?? sourceDate(job.expires_at);
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'full-time': 'FULL_TIME',
  fulltime: 'FULL_TIME',
  'part-time': 'PART_TIME',
  parttime: 'PART_TIME',
  contract: 'CONTRACTOR',
  contractor: 'CONTRACTOR',
  intern: 'INTERN',
  internship: 'INTERN',
  temporary: 'TEMPORARY',
  volunteer: 'VOLUNTEER',
};

/** schema.org JobPosting employmentType enum value. */
export function employmentType(job: Job): string | undefined {
  const key = (job.job_type ?? '').toLowerCase().trim();
  return EMPLOYMENT_TYPE_MAP[key];
}

// Minimal US state name/abbreviation map — covers the metros this board
// actually lists jobs in. Not exhaustive; unmatched regions are left out
// of the schema rather than guessed.
const US_STATE_ABBR: Record<string, string> = {
  california: 'CA', 'new york': 'NY', washington: 'WA', texas: 'TX',
  massachusetts: 'MA', illinois: 'IL', colorado: 'CO', georgia: 'GA',
  florida: 'FL', 'north carolina': 'NC', oregon: 'OR', virginia: 'VA',
  pennsylvania: 'PA', michigan: 'MI', 'district of columbia': 'DC',
  arizona: 'AZ', utah: 'UT', ohio: 'OH', tennessee: 'TN', minnesota: 'MN',
};

export interface JobAddress {
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
}

/**
 * Best-effort structured address from a free-text location string like
 * "San Francisco, CA" or "London, UK". Returns only the components we can
 * actually infer — streetAddress/postalCode are never fabricated since
 * source postings don't publish them.
 */
export function parseLocationAddress(location: string): JobAddress {
  const raw = (location ?? '').split(/[|;]/)[0].trim();
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return {};

  const address: JobAddress = {};
  if (parts.length >= 2) {
    address.addressLocality = parts[0];
    const region = parts[1];
    if (new Set(['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']).has(region)) {
      address.addressRegion = region;
      address.addressCountry = 'US';
    } else if (US_STATE_ABBR[region.toLowerCase()]) {
      address.addressRegion = US_STATE_ABBR[region.toLowerCase()];
      address.addressCountry = 'US';
    } else if (/^(UK|United Kingdom)$/i.test(region)) {
      address.addressCountry = 'GB';
    } else if (/^(USA|United States)$/i.test(region)) {
      address.addressCountry = 'US';
    } else {
      address.addressCountry = region.length === 2 ? region.toUpperCase() : undefined;
    }
  } else if (parts.length === 1) {
    const single = parts[0];
    if (/united states|usa/i.test(single)) {
      address.addressCountry = 'US';
    } else if (!/remote|on-?site|hybrid/i.test(single)) {
      address.addressLocality = single;
    }
  }
  return address;
}

/** Imputed bands used when a source posting had no published range. */
const PLACEHOLDER_BANDS = new Set([
  '140000-220000',
  '160000-240000',
  '180000-280000',
]);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseNumber(raw: string, hadK: boolean): number {
  const n = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(n)) return 0;
  return hadK || n < 1000 ? Math.round(n * 1000) : Math.round(n);
}

export function parseSalaryFromDescription(
  description: string
): { min: number; max: number } | null {
  const match = description.match(
    /\$\s*([\d,.]+)\s*([Kk])?\s*[–—-]\s*\$?\s*([\d,.]+)\s*([Kk])?/
  );
  if (!match) return null;
  const min = parseNumber(match[1], Boolean(match[2]));
  const max = parseNumber(match[3], Boolean(match[4]));
  if (min < 20000 || max < min) return null;
  return { min, max };
}

export function isPlaceholderSalaryBand(min: number, max: number): boolean {
  return PLACEHOLDER_BANDS.has(`${min}-${max}`);
}

/** Real published range, or null when the stored numbers are placeholders. */
export function salaryRange(job: Job): { min: number; max: number } | null {
  const fromDescription = parseSalaryFromDescription(job.description ?? '');
  if (fromDescription) return fromDescription;
  if (job.salary_min > 0 && job.salary_max >= job.salary_min) {
    if (isPlaceholderSalaryBand(job.salary_min, job.salary_max)) return null;
    return { min: job.salary_min, max: job.salary_max };
  }
  return null;
}

export function cleanJobTitle(title: string, company?: string): string {
  let cleaned = (title ?? '').replace(/^Job Application for\s+/i, '').trim();
  cleaned = cleaned.replace(/\s+@\s+.+$/, '').trim();
  if (company) {
    cleaned = cleaned
      .replace(new RegExp(`\\s+[–—-]\\s+${escapeRegex(company)}\\s*$`, 'i'), '')
      .trim();
  }
  cleaned = cleaned.replace(/\s+\$[\d.,kK]+(?:\s*[–—-]\s*\$?[\d.,kK]+)?.*$/, '').trim();
  cleaned = cleaned.replace(/\s+\([^)]*$/, '').trim();
  cleaned = cleaned.replace(/\s+\|\s*$/, '').trim();
  return cleaned.replace(/\s+/g, ' ');
}

function titleCaseSlug(slug: string): string {
  return slug
    .replace(/%20/g, ' ')
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) =>
      /^(ai|llm|rag|ml|nlp|usa|uk)$/i.test(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
}

export function companyFromApplyUrl(applyUrl: string): string | null {
  const ashby = applyUrl.match(/ashbyhq\.com\/([^/]+)/i);
  if (ashby?.[1] && !/^(job|jobs)$/i.test(ashby[1])) return titleCaseSlug(ashby[1]);
  const greenhouse = applyUrl.match(/greenhouse\.io\/(?:embed\/)?([^/]+)/i);
  if (greenhouse?.[1] && !/^(jobs|embed)$/i.test(greenhouse[1])) return titleCaseSlug(greenhouse[1]);
  const lever = applyUrl.match(/lever\.co\/([^/]+)/i);
  if (lever?.[1] && lever[1] !== 'jobs') return titleCaseSlug(lever[1]);
  return null;
}

export function cleanCompanyName(job: Pick<Job, 'company' | 'title' | 'apply_url'>): string {
  let company = (job.company ?? '').split('\n')[0].trim();
  company = company.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  if (company.includes('@')) {
    const afterAt = company.split('@').pop()?.trim() ?? '';
    if (afterAt.length > 1 && afterAt.length < 50) company = afterAt;
  }

  const looksLikeTitle =
    /engineer|manager|scientist|intern|director|staff|senior|principal/i.test(company) &&
    !/labs|systems|technologies|inc|llc|ai$/i.test(company);

  const corrupted =
    !company ||
    company === 'AI Startup' ||
    /^career page$/i.test(company) ||
    company.length > 60 ||
    /[)|]/.test(company) ||
    looksLikeTitle;

  if (corrupted) {
    const fromTitle = job.title.match(/@\s*([A-Za-z][A-Za-z0-9.&' -]{1,40})/);
    if (fromTitle?.[1]) {
      const extracted = fromTitle[1].trim();
      if (extracted.length < 50 && extracted.split(' ').length < 6) return extracted;
    }
    const fromUrl = companyFromApplyUrl(job.apply_url ?? '');
    if (fromUrl) return fromUrl;
  }

  return company;
}

export function displayTitle(job: Job): string {
  return cleanJobTitle(job.title, cleanCompanyName(job));
}

export function displayCompany(job: Job): string {
  return cleanCompanyName(job);
}
