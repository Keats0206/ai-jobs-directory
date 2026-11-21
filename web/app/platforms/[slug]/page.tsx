import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparisons, getComparison, COMPARE_DISCLOSURE, FACTS_CHECKED, type Fact, type Platform } from '@/lib/compare';
import { micro1Jobs as trainingJobs } from '@/lib/jobs';
import { byPay } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { DisclosureBar, Headline, RoleList } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

export function generateStaticParams() {
  return getComparisons().map((c) => ({ slug: c.slug }));
}

const monthYear = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const checked = new Date(FACTS_CHECKED).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparison((await params).slug);
  if (!c) return { title: 'Not Found' };
  return {
    title: `${c.a.name} vs ${c.b.name} (${monthYear()}): Pay, Interview & Payouts Compared`,
    description: `${c.a.name} vs ${c.b.name} for AI training work: posted pay, how screening works, how you’re paid and who each suits, with every fact sourced.`,
    alternates: { canonical: `/platforms/${c.slug}` },
  };
}

// Rows of the side-by-side table, in reading order.
const ROWS: [keyof Platform['facts'], string][] = [
  ['pay', 'Pay'],
  ['screening', 'How you get in'],
  ['payout', 'How you’re paid'],
  ['hours', 'Hours'],
  ['who', 'Who they hire'],
  ['countries', 'Eligibility'],
  ['company', 'Who runs it'],
];

function FactCell({ fact }: { fact: Fact }) {
  return (
    <td className="py-4 pr-4 align-top leading-relaxed">
      {fact.text}
      {fact.source && (
        <a href={fact.source.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-xs text-muted-foreground underline underline-offset-4">
          [{fact.source.label}]
        </a>
      )}
    </td>
  );
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getComparison((await params).slug);
  if (!c) notFound();
  const { a, b } = c;
  const others = getComparisons().filter((other) => other.slug !== c.slug);
  const top = [...trainingJobs].sort(byPay).slice(0, 5);

  const sources = [...new Map(
    [a, b].flatMap((p) => Object.values(p.facts)).flatMap((f) => (f.source ? [[f.source.url, f.source] as const] : [])),
  ).values()];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI training jobs', item: 'https://www.artificialjobs.dev/' },
      { '@type': 'ListItem', position: 2, name: `${a.name} vs ${b.name}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader />
      <DisclosureBar>{COMPARE_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-12 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">AI training jobs</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{a.name} vs {b.name}</span>
          </nav>
          <p className="mb-4 text-sm text-muted-foreground">Updated {monthYear()} · facts checked {checked}</p>
          <Headline lead={`${a.name} vs ${b.name}.`} rest="Pay, screening and payouts, side by side." />
          <section className="mt-10 max-w-3xl">
            <SectionLabel>The short answer</SectionLabel>
            <p className="text-lg leading-relaxed">{c.verdict}</p>
          </section>
        </Container>

        <Container className="pb-24">
          <SectionLabel>{`${a.name} vs ${b.name} at a glance`}</SectionLabel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] border-t border-border text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="w-40 py-3 pr-4 font-medium" />
                  <th className="py-3 pr-4 font-medium text-foreground">{a.name}</th>
                  <th className="py-3 pr-4 font-medium text-foreground">{b.name}</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([key, label]) => (
                  <tr key={key} className="border-b border-border">
                    <th scope="row" className="py-4 pr-4 align-top font-medium">{label}</th>
                    <FactCell fact={a.facts[key]} />
                    <FactCell fact={b.facts[key]} />
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <th scope="row" className="py-4 pr-4 align-top font-medium">Best for</th>
                  <td className="py-4 pr-4 align-top font-medium">{a.bestFor}</td>
                  <td className="py-4 pr-4 align-top font-medium">{b.bestFor}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="How you get hired." rest="Each platform’s own steps." />
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {[a, b].map((p) => (
              <section key={p.slug}>
                <p className="font-heading text-lg font-medium tracking-tight">{p.name}</p>
                <ol className="mt-4 space-y-3">
                  {p.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 border-t border-border pt-3 text-sm">
                      <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="Which one fits you." rest="Example situations, not real people." />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {c.scenarios.map((s) => (
              <div key={s.who} className="tile rounded-md p-6">
                <p className="text-sm text-muted-foreground">Example: {s.who}</p>
                <p className="font-heading mt-3 text-lg font-medium tracking-tight">{s.pick}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.why}</p>
              </div>
            ))}
          </div>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="Highest-paying micro1 roles right now." rest="Live rates from our listings." />
          <div className="mt-8">
            <RoleList jobs={top} ranked />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Full pay breakdown by field in the <Link href="/pay-index" className="underline underline-offset-4">micro1 Pay Index</Link> and
            our <Link href="/micro1" className="underline underline-offset-4">micro1 review</Link>.
          </p>
        </Container>

        <Container className="pb-24">
          <div className="max-w-3xl space-y-16">
            <FaqSection faqs={c.faqs} />
            <section>
              <SectionLabel>Sources</SectionLabel>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{s.label}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Checked {checked}. Platforms change their terms often; confirm pay and eligibility on the listing before you apply.
              </p>
            </section>
            {others.length > 0 && (
              <section>
                <SectionLabel>More comparisons</SectionLabel>
                <ul className="space-y-2 text-sm">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/platforms/${o.slug}`} className="underline underline-offset-4">{o.a.name} vs {o.b.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
