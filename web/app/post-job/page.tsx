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

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Standard listing */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Standard Listing</h3>
              <p className="mt-2 text-sm text-muted-foreground">Perfect for reaching qualified AI engineers</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Listed on artificialjobs.dev job board</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Included in daily llms.txt feed (Perplexity, Claude, ChatGPT)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Searchable by skills, location, and salary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Live within 24 hours</span>
                </li>
              </ul>
              <p className="mt-6 text-2xl font-bold">$99</p>
              <p className="text-xs text-muted-foreground">one-time fee</p>
            </div>

            {/* Featured listing */}
            <div className="rounded-xl border-2 border-brand bg-card p-6 relative">
              <div className="absolute -top-3 right-6 bg-background px-2 py-1 text-xs font-semibold text-brand">
                FEATURED
              </div>
              <h3 className="text-lg font-semibold">Featured Listing</h3>
              <p className="mt-2 text-sm text-muted-foreground">Stand out from the crowd and get noticed first</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Everything in Standard, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Pinned to top of job board for 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Highlighted in daily emails to subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand">✓</span>
                  <span>Priority support for job edits</span>
                </li>
              </ul>
              <p className="mt-6 text-2xl font-bold">$199</p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-10">
            <h3 className="mb-6 text-lg font-semibold">Choose your posting option</h3>
            <PostJobForm />
          </div>

          <div className="mt-8 rounded-lg bg-muted/30 p-6">
            <p className="text-sm font-medium">How it works:</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><strong>1. Submit details:</strong> Tell us about your role, company, and requirements.</li>
              <li><strong>2. Secure payment:</strong> Pay via Stripe (one-time for standard, recurring for featured).</li>
              <li><strong>3. Goes live:</strong> Your job appears on the board and in the llms.txt feed within 24 hours.</li>
              <li><strong>4. Get applications:</strong> We'll send qualified candidates your way.</li>
            </ol>
          </div>

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
