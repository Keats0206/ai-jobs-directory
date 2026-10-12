import { MetadataRoute } from 'next';
import { getCollections } from '@/lib/job-collections';
import { jobs, jobSlug, getAllTags, getAllLocations, slugify, type Job } from '@/lib/jobs';

// Real data dates, not build time: freshness is a ranking and citation signal.
function latest(list: Job[]): Date | undefined {
  const times = list.map(job => Date.parse(job.last_verified || job.first_seen || '')).filter(Number.isFinite);
  return times.length ? new Date(Math.max(...times)) : undefined;
}

const has = (tag: string) => (job: Job) => job.tags?.some(t => t.toLowerCase() === tag.toLowerCase());

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.artificialjobs.dev';
  const boardDate = latest(jobs);

  const jobUrls = jobs.map((job, i) => ({
    url: `${base}/jobs/${jobSlug(job, i)}`,
    lastModified: latest([job]),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillUrls = getAllTags().map(({ tag }) => ({
    url: `${base}/remote/${slugify(tag)}`,
    lastModified: latest(jobs.filter(has(tag))),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const salaryUrls = getAllTags().slice(0, 20).map(({ tag }) => ({
    url: `${base}/salary/${slugify(tag)}`,
    lastModified: latest(jobs.filter(has(tag))),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const locationUrls = getAllLocations().map(({ location }) => ({
    url: `${base}/location/${slugify(location)}`,
    lastModified: latest(jobs.filter(job => job.location?.toLowerCase().includes(location.toLowerCase()))),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const guideUrls = ['ai-engineer-career', 'agentic-engineer-jobs'].map(slug => ({
    url: `${base}/use-cases/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Company pages for companies with >1 job (excluding AI Startup placeholder)
  const byCompany = new Map<string, Job[]>();
  jobs.forEach(job => {
    if (job.company === 'AI Startup') return;
    byCompany.set(job.company, [...(byCompany.get(job.company) || []), job]);
  });
  const companyUrls = [...byCompany].filter(([, list]) => list.length > 1).map(([company, list]) => ({
    url: `${base}/company/${slugify(company)}`,
    lastModified: latest(list),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: boardDate, changeFrequency: 'daily', priority: 1 },
    ...['stats', 'sources', 'browse', 'newsletter'].map(path => ({ url: `${base}/${path}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...getCollections().map(item => ({ url: `${base}/browse/${item.skill}/${item.market.slug}`, lastModified: latest(item.jobs), changeFrequency: 'daily' as const, priority: 0.85 })),
    ...guideUrls,
    ...skillUrls,
    ...salaryUrls,
    ...locationUrls,
    ...companyUrls,
    ...jobUrls,
  ];
}
