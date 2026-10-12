import { jobs, type Job, getAllTags, slugify } from './jobs';

export const jobMarkets = [
  { slug: 'remote', label: 'Remote', matches: (job: Job) => job.is_remote },
  { slug: 'san-francisco', label: 'San Francisco', matches: (job: Job) => /san francisco/i.test(job.location) },
  { slug: 'new-york', label: 'New York', matches: (job: Job) => /new york|\bnyc\b/i.test(job.location) },
  { slug: 'london', label: 'London', matches: (job: Job) => /london/i.test(job.location) },
  { slug: 'bengaluru', label: 'Bengaluru', matches: (job: Job) => /bengaluru|bangalore/i.test(job.location) },
];

/** Only source-verified, recently checked inventory can create new indexable pages. */
export function recentlyVerified(job: Job, now = Date.now()) {
  const checked = Date.parse(job.last_verified || '');
  return job.source_verified === true && job.status !== 'closed' && Number.isFinite(checked) && checked <= now && now - checked <= 14 * 86400000;
}

export function getCollections() {
  const verified = jobs.filter(job => recentlyVerified(job));
  return getAllTags().flatMap(({ tag }) => jobMarkets.map(market => {
    const matches = verified.filter(job => market.matches(job) && job.tags.some(value => value.toLowerCase() === tag.toLowerCase()));
    const companies = [...new Set(matches.map(job => job.company))];
    return { skill: slugify(tag), tag, market, jobs: matches, companies };
  })).filter(collection => collection.jobs.length >= 5 && collection.companies.length >= 2);
}

export function getCollection(skill: string, market: string) {
  return getCollections().find(collection => collection.skill === skill && collection.market.slug === market);
}
