import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The site is now AI training jobs and company data partnerships only. Retired sections
      // (the engineering jobs board, agent directories, paid posting) pass their links to the homepage.
      { source: '/jobs', destination: '/', permanent: true },
      { source: '/ai-training-jobs', destination: '/', permanent: true },
      ...['browse', 'remote', 'salary', 'location', 'company', 'use-cases', 'agents', 'compare', 'openclaw', 'hermes', 'cursor-rules', 'resources']
        .flatMap((section) => [
          { source: `/${section}`, destination: '/', permanent: true },
          { source: `/${section}/:path*`, destination: '/', permanent: true },
        ]),
      ...['stats', 'sources', 'agentic', 'mcps', 'post-job', 'post-mcp', 'success', 'feed.xml']
        .map((path) => ({ source: `/${path}`, destination: '/', permanent: true })),
    ];
  },
};

export default nextConfig;
