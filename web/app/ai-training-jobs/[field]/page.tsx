import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTrainingFields, getTrainingCollections, getTrainingField, hourlyMax, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { DisclosureBar, Headline, StatRow, FieldTile, RoleList, CollectionLinks } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

export function generateStaticParams() {
  return [...getTrainingFields(), ...getTrainingCollections()].map((field) => ({ field: field.slug }));
}

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);
const monthYear = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export async function generateMetadata({ params }: { params: Promise<{ field: string }> }): Promise<Metadata> {
  const field = getTrainingField((await params).field);
  if (!field) return { title: 'Not Found' };
  const pay = field.topRate ? ` — Up to $${field.topRate}/hr` : '';
  return {
    title: `${field.jobs.length} Best AI Training Jobs for ${capitalize(field.audience)} (${monthYear()})${pay}`,
    description: `AI training jobs for ${field.audience}: ${field.jobs.length} open ${field.label} roles evaluating and improving AI models, ranked by pay. Refreshed daily.`,
    alternates: { canonical: `/ai-training-jobs/${field.slug}` },
  };
}

export default async function TrainingFieldPage({ params }: { params: Promise<{ field: string }> }) {
  const field = getTrainingField((await params).field);
  if (!field) notFound();

  const rates = field.jobs.map(hourlyMax).filter(Boolean).sort((a, b) => a - b);
  const median = rates.length ? rates[Math.floor(rates.length / 2)] : 0;
  const highDemand = field.jobs.filter((job) => job.high_demand).length;
  const others = getTrainingFields().filter((other) => other.slug !== field.slug);
  const collections = getTrainingCollections().filter((other) => other.slug !== field.slug);

  const remote = field.jobs.filter((job) => job.is_remote).length;
  const topJob = field.jobs[0];
  // A self-contained, stat-backed answer AI engines can quote without the surrounding cards.
  const summary = [
    `As of ${monthYear()}, there are ${field.jobs.length} open AI training ${field.jobs.length === 1 ? 'job' : 'jobs'} for ${field.audience} listed on micro1.`,
    rates.length > 1 && `Top-of-range pay runs from $${rates[0]} to $${field.topRate}/hr, with a median of $${median}/hr.`,
    topJob && topJob.hourly_max && `The best-paying role right now is ${topJob.title} at up to $${Math.round(topJob.hourly_max)}/hr.`,
    remote && `${remote === field.jobs.length ? 'All' : remote} of these roles are remote, and ${highDemand} ${highDemand === 1 ? 'is' : 'are'} marked high demand.`,
    `The work is flexible hourly contracting: you use your professional expertise to write, review and grade the examples AI models learn from.`,
    `Listings are refreshed daily from micro1, so closed roles drop off within a day.`,
  ].filter(Boolean).join(' ');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI training jobs', item: 'https://www.artificialjobs.dev/' },
      { '@type': 'ListItem', position: 2, name: field.label },
    ],
  };

  const faqs = [
    {
      question: `How much do AI training jobs for ${field.audience} pay?`,
      answer: rates.length
        ? `Across ${field.jobs.length} open ${field.label} roles, top-of-range pay runs from $${rates[0]} to $${field.topRate}/hr, with a median of $${median}/hr.`
        : `Pay is shared during the application for these ${field.label} roles.`,
    },
    {
      question: `What does an AI training job for ${field.audience} involve?`,
      answer: `You use your professional expertise to write, review and grade the examples AI models learn from: checking reasoning, correcting answers and flagging errors a non-expert would miss.`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-12 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">AI training jobs</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{field.label}</span>
          </nav>
          <p className="mb-4 text-sm text-muted-foreground">Updated {monthYear()} · ranked by pay</p>
          <Headline
            lead={`Best AI training jobs for ${field.audience}.`}
            rest={`${field.jobs.length} open ${field.label} ${field.jobs.length === 1 ? 'role' : 'roles'} helping AI labs improve their models.`}
          />
          <div className="mt-12">
            <StatRow stats={[
              [String(field.jobs.length), 'Open roles'],
              [field.topRate ? `$${field.topRate}/hr` : '—', 'Top hourly rate'],
              [median ? `$${median}/hr` : '—', 'Median top rate'],
              [String(highDemand), 'High demand'],
            ]} />
          </div>
          <p className="mt-10 max-w-3xl text-[17px] leading-relaxed text-muted-foreground">{summary}</p>
        </Container>

        <Container className="pb-24">
          <SectionLabel>{`All ${field.jobs.length} ${field.jobs.length === 1 ? 'role' : 'roles'}, ranked by pay`}</SectionLabel>
          <RoleList jobs={field.jobs} ranked showField={false} />
        </Container>

        <Container className="pb-24">
          <SectionLabel>Other fields hiring</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((other) => <FieldTile key={other.slug} field={other} />)}
          </div>
          {collections.length > 0 && <CollectionLinks collections={collections} />}
        </Container>

        <Container className="pb-24">
          <div className="max-w-3xl">
            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
