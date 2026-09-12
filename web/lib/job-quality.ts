import type { Job } from './jobs';

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
