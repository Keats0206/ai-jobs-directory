import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/blog';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/page-shell';
import { Headline } from '@/components/training-ui';

export const metadata: Metadata = {
  title: 'Blog — AI Training Jobs Pay, Guides and Data',
  description: 'Data-backed guides to AI training jobs: what they pay, who qualifies, how to get hired, and how companies sell data to AI labs.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/feed.xml' } },
};

export default function BlogIndex() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="pb-24 pt-10 sm:pt-14">
          <Headline lead="Guides to getting paid to train AI." rest="Built on live listing data, refreshed daily." />
          <ul className="mt-14 border-t border-border">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-border py-6">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{post.kicker}</p>
                <h2 className="font-heading mt-1 text-2xl font-medium tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">{post.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
