import { MetadataRoute } from 'next';
import { jobs, jobSlug, getAllTags, getAllLocations, slugify } from '@/lib/jobs';
import {
  openclawPlugins,
  openclawMcps,
  hermesPlugins,
  getAllCategories,
  categorySlug,
} from '@/lib/agent-directory';

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

  const agentHubUrls = [
    { url: `${base}/agents`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/openclaw/plugins`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${base}/openclaw/mcps`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${base}/hermes/plugins`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
  ];

  const agentCategoryUrls = getAllCategories().map(({ category }) => ({
    url: `${base}/agents/${categorySlug(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const openclawPluginUrls = openclawPlugins.map((entry) => ({
    url: `${base}/openclaw/plugins/${entry.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const mcpUrls = openclawMcps.map((entry) => ({
    url: `${base}/openclaw/mcps/${entry.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const hermesPluginUrls = hermesPlugins.map((entry) => ({
    url: `${base}/hermes/plugins/${entry.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...skillUrls,
    ...salaryUrls,
    ...locationUrls,
    ...agentHubUrls,
    ...agentCategoryUrls,
    ...openclawPluginUrls,
    ...mcpUrls,
    ...hermesPluginUrls,
    ...jobUrls,
  ];
}
