import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
