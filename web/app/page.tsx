import type { Metadata } from 'next';
import Link from 'next/link';
import { trainingJobs } from '@/lib/jobs';
import { getTrainingFields, getTrainingCollections, trainingStats, byPay, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/page-shell';
import { DisclosureBar, Headline, StatRow, FieldTile, RoleList, CollectionLinks } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

export function generateMetadata(): Metadata {
  const { total, topRate } = trainingStats();
  return {
    title: `${total} AI Training Jobs for Experts — Up to $${topRate}/hr`,
    description: `Get paid to train AI with your expertise. ${total} open roles for lawyers, doctors, engineers, scientists and linguists, refreshed daily.`,
    alternates: { canonical: '/' },
  };
}

const STEPS = [
  ['Pick a role', 'Find work that matches your credentials, from bar-admitted attorneys to board-certified physicians.'],
  ['Take the AI interview', 'micro1 verifies your expertise with a short AI-led interview. There is no fee to apply.'],
  ['Get matched and paid', 'Matched experts join AI lab projects and are paid hourly for flexible contract work.'],
];

export default function Home() {
  const stats = trainingStats();
  const fields = getTrainingFields();
  // Best-paid high-demand role from each field, so the shortlist spans professions.
  const shortlist = fields
    .map((field) => field.jobs.find((job) => job.high_demand && job.hourly_max))
    .filter((job): job is (typeof trainingJobs)[number] => Boolean(job))
    .sort(byPay)
    .slice(0, 8);

  const faqs = [
    {
      question: 'What is an AI training job?',
      answer: 'AI labs hire domain experts to write, review and grade the examples their models learn from. A lawyer might evaluate legal reasoning; a physician might check clinical answers. The work is paid hourly, usually as a flexible contract.',
    },
    {
      question: 'How much do AI training jobs pay?',
      answer: `Across ${stats.total} open roles, the median top-of-range rate is $${stats.medianRate}/hr and the highest is $${stats.topRate}/hr. Specialist credentials such as medical licences, bar admission or PhDs command the highest rates.`,
    },
    {
      question: 'How do I apply?',
      answer: 'Each role links to micro1, which runs a short AI interview to verify your expertise, then matches you to client projects. There is no fee to apply.',
    },
    {
      question: 'How does Artificial Jobs make money?',
      answer: 'Apply links include our micro1 referral code. If you are hired, micro1 may pay us a referral fee. It costs you nothing and does not change your pay.',
    },
  ];

  return (
    <>
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-16 pt-16 sm:pt-24">
          <p className="mb-6 text-sm text-muted-foreground">
            <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-brand align-middle" aria-hidden />
            {stats.total} roles open · updated daily
          </p>
          <Headline lead="Get paid to train AI." rest="Hourly expert work for lawyers, doctors, engineers, scientists and linguists." />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#top-roles" className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85">
              See top-paying roles
            </a>
            <a href="#fields" className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-card">
              Browse by field
            </a>
          </div>
          <div className="mt-16">
            <StatRow stats={[
              [`$${stats.topRate}/hr`, 'Top hourly rate'],
              [`$${stats.medianRate}/hr`, 'Median top rate'],
              [String(stats.highDemand), 'High-demand roles'],
              [String(stats.fields), 'Fields hiring'],
            ]} />
          </div>
        </Container>

        <Container className="pb-24">
          <section id="fields" className="scroll-mt-20">
            <p className="mb-6 text-center text-muted-foreground">Open roles across {stats.fields} fields</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {fields.map((field) => <FieldTile key={field.slug} field={field} />)}
            </div>
            <CollectionLinks collections={getTrainingCollections()} />
          </section>
        </Container>

        <Container className="pb-24">
          <section id="top-roles" className="scroll-mt-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <Headline as="h2" lead="Best-paying roles right now." rest="The top high-demand role in each field." />
            </div>
            <RoleList jobs={shortlist} ranked />
          </section>
        </Container>

        <Container className="pb-24">
          <section className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <div key={title} className="tile rounded-md p-6">
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <h3 className="font-heading mt-6 text-xl font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-muted-foreground">{body}</p>
              </div>
            ))}
          </section>
        </Container>

        <Container className="pb-24">
          {fields.filter((field) => field.jobs.length >= 5).map((field) => (
            <section key={field.slug} className="mb-20">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <Headline as="h2" lead={field.label} rest={field.topRate ? `up to $${field.topRate}/hr` : undefined} />
                <Link href={`/ai-training-jobs/${field.slug}`} className="text-sm font-medium hover:underline">
                  {`All ${field.jobs.length} ${field.label.toLowerCase()} roles →`}
                </Link>
              </div>
              <RoleList jobs={field.jobs.slice(0, 4)} showField={false} />
            </section>
          ))}
        </Container>

        <Container className="pb-24">
          <Link href="/sell-company-data" className="tile flex flex-col justify-between gap-6 rounded-md p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">For companies</p>
              <p className="font-heading mt-1 text-2xl font-medium tracking-tight">
                Sell your company&rsquo;s data to AI labs. <span className="text-muted-foreground">$100K–$2M+ per approved package.</span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium">Learn more &rarr;</span>
          </Link>
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
