import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading } from '@/components/page-shell';
import { CursorRulesSearch } from '@/components/cursor-rules-search';
import { cursorRulesMeta } from '@/lib/cursor-rules';

export const metadata: Metadata = {
  title: 'Cursor Rules Library — .cursorrules for AI Coding Agents',
  description:
    'Curated Cursor rules for TypeScript, Next.js, Python, MCP agents, and more. Copy .cursorrules templates for your agentic dev workflow.',
};

export default function CursorRulesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-12">
          <nav className="mb-6 flex gap-4 text-sm text-muted-foreground">
            <Link href="/agentic" className="hover:text-foreground">
              Agentic hub
            </Link>
            <span>/</span>
            <span className="text-foreground">Cursor rules</span>
          </nav>
          <PageHeading
            title="Cursor rules library"
            lead="Curated .cursorrules templates for agentic developers — frontend, backend, MCP, and testing."
            meta={`Updated ${cursorRulesMeta.updated}`}
          />
          <CursorRulesSearch />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
