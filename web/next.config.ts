import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/jobs', destination: '/', permanent: true },
      // Retired sections: agent tooling directories and paid posting. Send their
      // links and rankings to the closest hiring page.
      { source: '/agentic', destination: '/remote/agent', permanent: true },
      { source: '/agents/:path*', destination: '/remote/agent', permanent: true },
      { source: '/compare/:path*', destination: '/remote/agent', permanent: true },
      { source: '/compare', destination: '/remote/agent', permanent: true },
      { source: '/mcps', destination: '/remote/agent', permanent: true },
      { source: '/openclaw/:path*', destination: '/remote/agent', permanent: true },
      { source: '/hermes/:path*', destination: '/remote/agent', permanent: true },
      { source: '/cursor-rules/:path*', destination: '/', permanent: true },
      { source: '/cursor-rules', destination: '/', permanent: true },
      { source: '/resources/:path*', destination: '/use-cases/ai-engineer-career', permanent: true },
      { source: '/post-job', destination: '/', permanent: true },
      { source: '/post-mcp', destination: '/', permanent: true },
      { source: '/success', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
