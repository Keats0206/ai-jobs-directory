import { posts, dataUpdated } from '@/lib/blog';

export const dynamic = 'force-static';

const BASE = 'https://www.artificialjobs.dev';
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const items = posts.map((post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${BASE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${post.slug}</guid>
      <description>${escape(post.description)}</description>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
    </item>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Artificial Jobs</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Data-backed guides to AI training jobs and company data partnerships.</description>
    <lastBuildDate>${new Date(dataUpdated()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
