import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PostJobForm } from '@/components/post-job-form';
import { GeoContent } from '@/components/geo-content';

export const metadata: Metadata = {
  title: 'Post an AI Job — $99',
  description:
    'Post your AI, LLM, or ML engineering role to artificialjobs.dev. Reach candidates and AI search engines for a one-time $99 fee.',
};

export default function PostJobPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current="Post a job" />
          <PageHeading
            title="Post an AI job"
            lead="Reach AI engineers, ML researchers, and LLM developers. Your listing appears on the job board and in llms.txt for AI search engines."
            meta="$99 one-time · Live within 24 hours"
          />

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>Listed on artificialjobs.dev with full job details</li>
            <li>Included in llms.txt for Perplexity, Claude, and ChatGPT discovery</li>
            <li>Remote, salary, and tech stack tags for search and filtering</li>
          </ul>

          <PostJobForm />

          <p className="mt-10 text-sm text-muted-foreground">
            Looking to list an MCP server instead?{' '}
            <Link href="/post-mcp" className="text-foreground underline-offset-4 hover:underline">
              List an MCP — $199/mo
            </Link>
          </p>

          <GeoContent url="/post-job" />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
