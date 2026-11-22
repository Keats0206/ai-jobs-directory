import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost, dataUpdated } from '@/lib/blog';
import { REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { EDITOR, editorJsonLd } from '@/lib/site';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PROSE, Container } from '@/components/page-shell';
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
    author: editorJsonLd,
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
              By <Link href="/about#editor" className="underline underline-offset-4 hover:text-foreground">{EDITOR.name}</Link> · Published <time dateTime={post.published}>{formatDate(post.published)}</time> · Data updated{' '}
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
