import { MetadataRoute } from 'next';
import { trainingJobs, type Job } from '@/lib/jobs';
import { getTrainingFields, getTrainingCollections } from '@/lib/training-jobs';

// Real data dates, not build time: freshness is a ranking and citation signal.
function latest(list: Job[]): Date | undefined {
  const times = list.map(job => Date.parse(job.last_verified || job.first_seen || '')).filter(Number.isFinite);
  return times.length ? new Date(Math.max(...times)) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.artificialjobs.dev';
  return [
    { url: base, lastModified: latest(trainingJobs), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/sell-company-data`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/micro1`, lastModified: latest(trainingJobs), changeFrequency: 'daily', priority: 0.9 },
    ...[...getTrainingFields(), ...getTrainingCollections()].map(field => ({
      url: `${base}/ai-training-jobs/${field.slug}`,
      lastModified: latest(field.jobs),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    ...trainingJobs.map(job => ({
      url: `${base}/jobs/${job.slug}`,
      lastModified: latest([job]),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
