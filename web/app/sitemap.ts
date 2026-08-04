import { MetadataRoute } from 'next';
import { jobs, jobSlug, getAllTags, getAllLocations, slugify } from '@/lib/jobs';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.artificialjobs.dev';

  const jobUrls = jobs.map((job, i) => ({
    url: `${base}/jobs/${jobSlug(job, i)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillUrls = getAllTags().map(({ tag }) => ({
    url: `${base}/remote/${slugify(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const salaryUrls = getAllTags().slice(0, 20).map(({ tag }) => ({
    url: `${base}/salary/${slugify(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const locationUrls = getAllLocations().map(({ location }) => ({
    url: `${base}/location/${slugify(location)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...skillUrls,
    ...salaryUrls,
    ...locationUrls,
    ...jobUrls,
  ];
}
