import { trainingJobs, type Job } from './jobs';

/** Who each micro1 field is for, phrased the way people search ("AI training jobs for lawyers"). */
const AUDIENCE: Record<string, string> = {
  law: 'lawyers',
  medicine: 'doctors',
  finance: 'finance professionals',
  'software-engineering': 'software engineers',
  'sciences-research': 'scientists & PhDs',
  'language-audio': 'linguists & translators',
  'applied-engineering': 'engineers',
  'ai-machine-learning': 'ML engineers',
  robotics: 'robotics experts',
  'sales-marketing': 'marketers',
  'business-operations': 'operators',
  'data-analysis': 'data analysts',
  'arts-design': 'artists & designers',
  humanities: 'humanities experts',
  education: 'teachers',
  'retail-hospitality': 'retail & hospitality pros',
  cybersecurity: 'security experts',
  generalist: 'generalists',
  other: 'specialists',
};

export interface TrainingField {
  slug: string;
  label: string;
  audience: string;
  jobs: Job[];
  topRate: number;
}

export const hourlyMax = (job: Job) => job.hourly_max || 0;

/** Highest-paying first; newest breaks ties. */
export const byPay = (a: Job, b: Job) =>
  hourlyMax(b) - hourlyMax(a) || (Date.parse(b.date_posted || '') || 0) - (Date.parse(a.date_posted || '') || 0);

/** Hourly rate when listed, else annual salary (a few micro1 roles are salaried). */
export function formatPay(job: Job): string | null {
  const max = job.hourly_max, min = job.hourly_min;
  if (max) return min && min !== max ? `$${Math.round(min)}–$${Math.round(max)}/hr` : `$${Math.round(max)}/hr`;
  if (job.salary_max) return `$${Math.round(job.salary_min / 1000)}k–$${Math.round(job.salary_max / 1000)}k/yr`;
  return null;
}

export function getTrainingFields(): TrainingField[] {
  const groups = new Map<string, Job[]>();
  for (const job of trainingJobs) {
    const slug = job.field || 'other';
    groups.set(slug, [...(groups.get(slug) || []), job]);
  }
  return [...groups].map(([slug, list]) => ({
    slug,
    label: list[0].field_label || slug,
    audience: AUDIENCE[slug] || 'experts',
    jobs: [...list].sort(byPay),
    topRate: Math.max(0, ...list.map(hourlyMax)),
  })).sort((a, b) => b.jobs.length - a.jobs.length);
}

/**
 * Credential and profession pages that cut across micro1 fields, matched on title and skills.
 * Each targets an "AI training jobs for {audience}" search and is published only when it has
 * enough roles to be worth landing on.
 */
const COLLECTIONS: { slug: string; label: string; audience: string; match: RegExp }[] = [
  { slug: 'phds', label: 'PhD', audience: 'PhDs', match: /\bph\.?d\b|doctoral|postdoc/i },
  { slug: 'physicians', label: 'Physician', audience: 'physicians', match: /physician|hospitalist|surgeon|psychiatrist|radiologist|cardiologist|dermatologist|oncologist|\bM\.?D\.?\b/i },
  { slug: 'nurses', label: 'Nursing', audience: 'nurses', match: /\bnurs|\bRN\b|\bBSN\b/i },
  { slug: 'pharmacists', label: 'Pharmacy', audience: 'pharmacists', match: /pharmac/i },
  { slug: 'dentists', label: 'Dental', audience: 'dentists', match: /dentist|dental/i },
  { slug: 'teachers', label: 'Teaching', audience: 'teachers', match: /teacher|educator|tutor|curriculum/i },
  { slug: 'accountants', label: 'Accounting', audience: 'accountants', match: /accountant|\bCPA\b|auditor|\btax\b/i },
  { slug: 'chemists', label: 'Chemistry', audience: 'chemists', match: /chemist|chemistry/i },
  { slug: 'physicists', label: 'Physics', audience: 'physicists', match: /physics|physicist/i },
  { slug: 'biologists', label: 'Biology', audience: 'biologists', match: /biolog|bioinformatic/i },
  { slug: 'mathematicians', label: 'Math', audience: 'mathematicians', match: /\bmath/i },
  { slug: 'bilingual', label: 'Bilingual', audience: 'bilingual speakers', match: /bilingual|native|fluent|speaking|transcription|translat/i },
];
export const MIN_COLLECTION_ROLES = 5;

export function getTrainingCollections(): TrainingField[] {
  return COLLECTIONS.map(({ match, ...collection }) => {
    const jobs = trainingJobs.filter(job => match.test(`${job.title} ${(job.skills || []).join(' ')}`)).sort(byPay);
    return { ...collection, jobs, topRate: Math.max(0, ...jobs.map(hourlyMax)) };
  }).filter(collection => collection.jobs.length >= MIN_COLLECTION_ROLES);
}

export function getTrainingField(slug: string): TrainingField | undefined {
  return [...getTrainingFields(), ...getTrainingCollections()].find(field => field.slug === slug);
}

export function trainingStats() {
  const rates = trainingJobs.map(hourlyMax).filter(Boolean).sort((a, b) => a - b);
  return {
    total: trainingJobs.length,
    highDemand: trainingJobs.filter(job => job.high_demand).length,
    topRate: rates.at(-1) || 0,
    medianRate: rates.length ? rates[Math.floor(rates.length / 2)] : 0,
    fields: getTrainingFields().length,
  };
}

export const REFERRAL_DISCLOSURE =
  'Apply links on these roles include our micro1 referral code. Artificial Jobs may earn a referral fee if you’re hired, at no cost to you.';
