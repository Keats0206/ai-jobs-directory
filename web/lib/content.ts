import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export interface ContentFrontmatter {
  title: string;
  title_tag?: string;
  meta_description?: string;
  slug: string;
  url: string;
  primary_keyword?: string;
  page_type?: string;
  section?: string;
  subsection?: string;
  date?: string;
}

export interface ContentArticle {
  frontmatter: ContentFrontmatter;
  body: string;
  jsonLd: string | null;
}

/** Maps site URL paths to markdown files under artificialjobs.dev/content */
const URL_TO_FILE: Record<string, string> = {
  '/': 'product/remote-ai-engineering-jobs.md',
  '/compare/ai-coding-agents': 'resources/comparisons/best-ai-coding-agents-2026.md',
  '/compare/claude-code-vs-cursor': 'resources/comparisons/cursor-vs-claude-code.md',
  '/compare/cline-vs-cursor': 'resources/comparisons/cline-vs-cursor.md',
  '/salary/llm': 'use-cases/llm-engineer-salary-guide.md',
  '/agents': 'resources/comparisons/mcp-agent-ecosystem.md',
  '/resources/learn/what-is-ai-coding-agent': 'resources/learn/what-is-ai-coding-agent.md',
  '/resources/compare/cursor-vs-copilot': 'resources/comparisons/cursor-vs-copilot.md',
  '/use-cases/ai-engineer-career': 'use-cases/ai-engineer-career-path.md',
  '/use-cases/agentic-engineer-jobs': 'use-cases/agentic-engineer-jobs.md',
  '/post-job': 'resources/guides/post-ai-jobs-employers.md',
};

function stripJsonLd(markdown: string): { body: string; jsonLd: string | null } {
  const match = markdown.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  const jsonLd = match ? match[1].trim() : null;
  const body = markdown.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '').trim();
  // Drop duplicate H1 — pages already render PageHeading
  const withoutH1 = body.replace(/^#\s+.+\n+/, '');
  return { body: withoutH1, jsonLd };
}

export function getContentByUrl(url: string): ContentArticle | null {
  const rel = URL_TO_FILE[url];
  if (!rel) return null;

  const filePath = path.join(CONTENT_ROOT, rel);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const { body, jsonLd } = stripJsonLd(content);

  return {
    frontmatter: data as ContentFrontmatter,
    body,
    jsonLd,
  };
}

export function getAllContentUrls(): string[] {
  return Object.keys(URL_TO_FILE);
}
