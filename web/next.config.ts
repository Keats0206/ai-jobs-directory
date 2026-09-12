import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/jobs', destination: '/', permanent: true },
      { source: '/compare', destination: '/compare/ai-coding-agents', permanent: true },
      { source: '/mcps', destination: '/openclaw/mcps', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nousresearch.com' },
      { protocol: 'https', hostname: 'kilocode.ai' },
      { protocol: 'https', hostname: 'cline.bot' },
      { protocol: 'https', hostname: 'claude.ai' },
      { protocol: 'https', hostname: 'openclaw.ai' },
      { protocol: 'https', hostname: 'pi.dev' },
      { protocol: 'https', hostname: 'codebuff.com' },
      { protocol: 'https', hostname: 'openai.com' },
      { protocol: 'https', hostname: 'cursor.com' },
      { protocol: 'https', hostname: 'www.cursor.com' },
      { protocol: 'https', hostname: 'windsurf.com' },
      { protocol: 'https', hostname: 'www.windsurf.com' },
    ],
  },
};

export default nextConfig;
