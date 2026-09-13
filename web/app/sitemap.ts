import { MetadataRoute } from 'next';
import { jobs, jobSlug, getRemoteTags, getSalaryTags, getAllLocations, getJobsByLocation, LOCATION_SLUG_ALIASES, slugify } from '@/lib/jobs';
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
  // Omit lastModified until genuine content update timestamps are available.
  const base = 'https://www.artificialjobs.dev';

  const jobUrls = jobs.map((job, i) => ({
    url: `${base}/jobs/${jobSlug(job, i)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const skillUrls = getRemoteTags().map(({ tag }) => ({
    url: `${base}/remote/${slugify(tag)}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const salaryUrls = getSalaryTags().map(({ tag }) => ({
    url: `${base}/salary/${slugify(tag)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const locationUrls = getAllLocations().filter(({ location }) => getJobsByLocation(location).length > 0).map(({ location }) => ({
    url: `${base}/location/${slugify(location)}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const locationAliasUrls = Object.entries(LOCATION_SLUG_ALIASES)
    .filter(([, { matchTerm }]) => getJobsByLocation(matchTerm).length > 0)
    .map(([slug]) => ({ url: `${base}/location/${slug}`, changeFrequency: 'daily' as const, priority: 0.9 }));

  const agentHubUrls = [
    { url: `${base}/agents`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/openclaw/plugins`, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${base}/openclaw/mcps`, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${base}/hermes/plugins`, changeFrequency: 'weekly' as const, priority: 0.85 },
  ];

  const agentCategoryUrls = getAllCategories().map(({ category }) => ({
    url: `${base}/agents/${categorySlug(category)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const openclawPluginUrls = openclawPlugins.map((entry) => ({
    url: `${base}/openclaw/plugins/${entry.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const mcpUrls = openclawMcps.map((entry) => ({
    url: `${base}/openclaw/mcps/${entry.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const hermesPluginUrls = hermesPlugins.map((entry) => ({
    url: `${base}/hermes/plugins/${entry.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const compareHubUrl = {
    url: `${base}/compare/ai-coding-agents`,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  };

  const compareSlugUrls = getAllCompareSlugs().map((slug) => ({
    url: `${base}/compare/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: slug.includes('-vs-') ? 0.85 : 0.8,
  }));

  const agenticHubUrl = {
    url: `${base}/agentic`,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  };

  const submissionUrls = [
    { url: `${base}/post-job`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${base}/post-mcp`, changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  const cursorRulesUrls = [
    { url: `${base}/cursor-rules`, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...cursorRules.map((rule) => ({
      url: `${base}/cursor-rules/${rule.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const geoContentUrls = [
    {
      url: `${base}/resources/learn/what-is-ai-coding-agent`,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/use-cases/ai-engineer-career`,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/use-cases/agentic-engineer-jobs`,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${base}/resources/compare/cursor-vs-copilot`,
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
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    compareHubUrl,
    agenticHubUrl,
    ...compareSlugUrls,
    ...submissionUrls,
    ...geoContentUrls,
    ...cursorRulesUrls,
    ...skillUrls,
    ...salaryUrls,
    ...locationUrls,
    ...locationAliasUrls,
    ...companyUrls,
    ...agentHubUrls,
    ...agentCategoryUrls,
    ...openclawPluginUrls,
    ...mcpUrls,
    ...hermesPluginUrls,
    ...jobUrls,
  ];

  // Different source tags/locations can normalize to the same URL.
  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}