import { MetadataRoute } from 'next';
import { jobs, jobSlug, getAllTags, getAllLocations, slugify } from '@/lib/jobs';
import {
  openclawPlugins,
  openclawMcps,
  hermesPlugins,
  getAllCategories,
  categorySlug,
} from '@/lib/agent-directory';
import { getAllCompareSlugs } from '@/lib/agents';
import { cursorRules } from '@/lib/cursor-rules';

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

  const compareHubUrl = {
    url: `${base}/compare/ai-coding-agents`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  };

  const compareSlugUrls = getAllCompareSlugs().map((slug) => ({
    url: `${base}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug.includes('-vs-') ? 0.85 : 0.8,
  }));

  const agenticHubUrl = {
    url: `${base}/agentic`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  };

  const submissionUrls = [
    { url: `${base}/post-job`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${base}/post-mcp`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  const cursorRulesUrls = [
    { url: `${base}/cursor-rules`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    ...cursorRules.map((rule) => ({
      url: `${base}/cursor-rules/${rule.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const geoContentUrls = [
    {
      url: `${base}/resources/learn/what-is-ai-coding-agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/use-cases/ai-engineer-career`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/use-cases/agentic-engineer-jobs`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/resources/compare/cursor-vs-copilot`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Company pages for companies with >1 job (excluding AI Startup placeholder)
  const companyCounts: Record<string, number> = {};
  jobs.forEach(j => {
    if (j.company === 'AI Startup') return;
    companyCounts[j.company] = (companyCounts[j.company] || 0) + 1;
  });
  const companyUrls = Object.entries(companyCounts)
    .filter(([, count]) => count > 1)
    .map(([company]) => ({
      url: `${base}/company/${slugify(company)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    compareHubUrl,
    agenticHubUrl,
    ...compareSlugUrls,
    ...submissionUrls,
    ...geoContentUrls,
    ...cursorRulesUrls,
    ...skillUrls,
    ...salaryUrls,
    ...locationUrls,
    ...companyUrls,
    ...agentHubUrls,
    ...agentCategoryUrls,
    ...openclawPluginUrls,
    ...mcpUrls,
    ...hermesPluginUrls,
    ...jobUrls,
  ];
}