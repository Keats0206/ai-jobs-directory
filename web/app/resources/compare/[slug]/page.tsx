import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { GeoContent } from '@/components/geo-content';
import { getContentByUrl } from '@/lib/content';

const PAGES: Record<string, { url: string; breadcrumb: string }> = {
  'cursor-vs-copilot': {
    url: '/resources/compare/cursor-vs-copilot',
    breadcrumb: 'Cursor vs Copilot',
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: 'Not Found' };
  const content = getContentByUrl(page.url);
  if (!content) return { title: 'Not Found' };
  return {
    title: content.frontmatter.title_tag ?? content.frontmatter.title,
    description: content.frontmatter.meta_description,
  };
}

export default async function ResourceComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const content = getContentByUrl(page.url);
  if (!content) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb
            segments={[
              { label: 'Compare', href: '/compare/ai-coding-agents' },
              { label: 'Resources', href: '/resources/compare/cursor-vs-copilot' },
            ]}
            current={page.breadcrumb}
          />
          <PageHeading title={content.frontmatter.title} lead={content.frontmatter.meta_description ?? ''} />
          <GeoContent url={page.url} className="mt-8" />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
