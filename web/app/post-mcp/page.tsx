import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PostMcpForm } from '@/components/post-mcp-form';

export const metadata: Metadata = {
  title: 'List an MCP Server — $199/mo',
  description:
    'Get your Model Context Protocol (MCP) server featured on artificialjobs.dev. Monthly subscription for top placement and llms.txt inclusion.',
};

export default function PostMcpPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current="List an MCP" />
          <PageHeading
            title="List your MCP server"
            lead="Feature your Model Context Protocol server on artificialjobs.dev. Get discovered by developers building AI agents and tooling."
            meta="$199/month · Cancel anytime"
          />

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>
              Featured placement in the{' '}
              <Link href="/openclaw/mcps" className="text-foreground underline-offset-4 hover:underline">
                MCP server directory
              </Link>
            </li>
            <li>Included in llms.txt for AI search engine discovery</li>
            <li>Publisher profile with install link and description</li>
          </ul>

          <p className="mt-4 text-sm text-muted-foreground">
            Browse the live directory at{' '}
            <Link href="/openclaw/mcps" className="text-foreground underline-offset-4 hover:underline">
              /openclaw/mcps
            </Link>{' '}
            — subscribe to get featured placement.
          </p>

          <PostMcpForm />

          <p className="mt-10 text-sm text-muted-foreground">
            Hiring instead?{' '}
            <Link href="/post-job" className="text-foreground underline-offset-4 hover:underline">
              Post a job — $99
            </Link>
          </p>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
