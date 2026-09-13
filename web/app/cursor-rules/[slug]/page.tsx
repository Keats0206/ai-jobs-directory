import { StructuredData } from '@/components/structured-data';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { cursorRules, getCursorRule, rulesTextFor } from '@/lib/cursor-rules';

export function generateStaticParams() {
  return cursorRules.map((r) => ({ slug: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rule = getCursorRule(slug);
  if (!rule) return { title: 'Not Found' };
  return {
    alternates: { canonical: `https://www.artificialjobs.dev/cursor-rules/${slug}` },
    title: `${rule.name} Cursor Rules — Copy .cursorrules Template`,
    description: rule.description,
  };
}

export default async function CursorRuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rule = getCursorRule(slug);
  if (!rule) notFound();

  const text = rulesTextFor(rule);

  return (
    <>
      <StructuredData data={{ '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: rule.name, description: rule.description, url: `https://www.artificialjobs.dev/cursor-rules/${rule.id}`, text }} />
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb
            segments={[
              { label: 'Agentic', href: '/agentic' },
              { label: 'Cursor rules', href: '/cursor-rules' },
            ]}
            current={rule.name}
          />
          <PageHeading title={rule.name} lead={rule.description} meta={rule.category} />

          <SectionLabel>Tags</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-2">
            {rule.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <SectionLabel>Rules template</SectionLabel>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed">
            {text}
          </pre>

          <p className="mt-6 text-sm text-muted-foreground">
            Copy into <code className="text-foreground">.cursorrules</code> or your Cursor project
            rules.{' '}
            <Link href="/compare/cursor" className="underline-offset-4 hover:underline">
              Cursor review →
            </Link>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
