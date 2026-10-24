import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost, dataUpdated } from '@/lib/blog';
import { REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/page-shell';
import { DisclosureBar } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

const BASE = 'https://www.artificialjobs.dev';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description, publishedTime: post.published, modifiedTime: dataUpdated() },
  };
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Long-form typography, scoped to the article body.
const PROSE = [
  'max-w-prose text-[17px] leading-8 text-foreground/85',
  '[&_p]:mt-5 [&_strong]:font-medium [&_strong]:text-foreground',
  '[&_h2]:font-heading [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground',
  '[&_h3]:font-heading [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
].join(' ');

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const modified = dataUpdated();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: modified,
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'Artificial Jobs', url: BASE },
    publisher: { '@type': 'Organization', name: 'Artificial Jobs', url: BASE },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 2, name: post.title, item: `${BASE}/blog/${post.slug}` },
    ],
  };
  const Body = post.Body;
  const others = posts.filter((other) => other.slug !== post.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-24 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{post.kicker}</span>
          </nav>
          <article>
            <h1 className="font-heading max-w-3xl text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-balance sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-sm text-muted-foreground">
              By Artificial Jobs · Published <time dateTime={post.published}>{formatDate(post.published)}</time> · Data updated{' '}
              <time dateTime={modified}>{formatDate(modified)}</time>
            </p>
            <div className={`mt-10 ${PROSE}`}>
              <Body />
            </div>
          </article>
          <div className="mt-16 max-w-prose">
            <FaqSection faqs={post.faqs()} />
          </div>
          <section className="mt-20 border-t border-border pt-8">
            <h2 className="font-heading text-xl font-medium tracking-tight">More guides</h2>
            <ul className="mt-4 space-y-3">
              {others.map((other) => (
                <li key={other.slug}><Link href={`/blog/${other.slug}`} className="hover:underline">{other.title}</Link></li>
              ))}
            </ul>
          </section>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
