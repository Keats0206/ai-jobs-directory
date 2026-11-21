import type { Metadata } from 'next';
import Link from 'next/link';
import { mercorJobs } from '@/lib/jobs';
import { getTrainingFields, trainingStats, byPay, hourlyMax, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { DisclosureBar, Headline, StatRow, RoleList } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

const monthYear = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export function generateMetadata(): Metadata {
  const stats = trainingStats(mercorJobs);
  return {
    title: `Mercor Review (${monthYear()}): Pay, AI Interview & Is It Legit?`,
    description: `How much Mercor pays, from ${stats.total} live roles (median top rate $${stats.medianRate}/hr, up to $${stats.topRate}/hr), how its AI interview works, and what to check before you apply.`,
    alternates: { canonical: '/mercor' },
  };
}

const median = (values: number[]) => {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};

// Mercor's process, from its talent docs (talent.docs.mercor.com, Nov 2026).
const STEPS: [string, string][] = [
  ['Apply for a role', 'Pick a listing that matches your background. Each one states the pay, the weekly hours and any country limits.'],
  ['Take the AI interview', 'Mercor screens applicants with an automated, on-camera AI interview about your domain knowledge. You can reset and retake it from your dashboard.'],
  ['Do a work trial', 'Some projects ask for a paid, project-specific work trial before you are hired onto the team.'],
  ['Start earning', 'You work remotely on AI lab projects, tracking hours in Mercor’s tools and getting paid through Stripe or Wise.'],
];

export default function MercorPage() {
  const jobs = mercorJobs;
  const stats = trainingStats(jobs);
  const fields = getTrainingFields(jobs).filter((field) => field.jobs.some(hourlyMax));
  const top = [...jobs].sort(byPay).slice(0, 10);
  const remote = jobs.filter((job) => job.is_remote).length;
  const rates = jobs.map(hourlyMax).filter(Boolean);
  const over100 = rates.filter((rate) => rate >= 100).length;
  const flat = jobs.filter((job) => job.flat_pay_max).length;
  const usOnly = jobs.filter((job) => job.applicant_countries?.length === 1 && job.applicant_countries[0] === 'United States').length;

  const faqs = [
    {
      question: 'Is Mercor legit?',
      answer: `Mercor is a real, venture-backed AI data company that recruits domain experts to train and evaluate AI models for AI labs. TechCrunch reported in October 2025 that it raised $350 million at a $10 billion valuation. It currently lists ${stats.total} open roles with posted pay. Apply only through mercor.com links, and be wary of anyone asking you to pay to apply.`,
    },
    {
      question: 'How much does Mercor pay per hour?',
      answer: `Across ${rates.length} live Mercor roles with hourly pay, the top of the range runs up to $${stats.topRate}/hr, with a median of $${stats.medianRate}/hr. ${over100} roles pay $100/hr or more at the top of their range.${flat ? ` Another ${flat} are paid interviews, surveys or tasks with a flat fee.` : ''} Rates come from Mercor’s own listings and are refreshed daily.`,
    },
    {
      question: 'What is the Mercor AI interview?',
      answer: 'After you apply, Mercor interviews you on camera with an AI interviewer that asks about your background and expertise. Its talent docs describe it as the standard screening step. You can reset it from your dashboard and take it again.',
    },
    {
      question: 'Are Mercor jobs remote?',
      answer: `${remote} of the ${stats.total} roles listed here are remote. ${usOnly ? `${usOnly} are limited to applicants in the United States, and others` : 'Some'} name the countries they accept applicants from.`,
    },
    {
      question: 'Mercor or micro1: which is better?',
      answer: 'Both pay experts hourly to train AI models, and both screen with an AI interview. Many experts apply to both, since each runs its own projects. Compare live pay on the micro1 review and on each field page here.',
    },
  ];

  return (
    <>
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-12 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">AI training jobs</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">Mercor review</span>
          </nav>
          <p className="mb-4 text-sm text-muted-foreground">Updated {monthYear()} · pay from {stats.total} live listings</p>
          <Headline lead="Mercor review: what it pays and how to get in." rest="Real pay data from every open Mercor role, refreshed daily." />
          <div className="mt-12">
            <StatRow stats={[
              [String(stats.total), 'Open roles'],
              [`$${stats.medianRate}/hr`, 'Median top rate'],
              [`$${stats.topRate}/hr`, 'Highest rate'],
              [String(over100), 'Roles at $100+/hr'],
            ]} />
          </div>
        </Container>

        <Container className="pb-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
            <section className="max-w-2xl">
              <SectionLabel>The short answer</SectionLabel>
              <p className="mt-4 text-lg leading-relaxed">
                Mercor is a legitimate, venture-backed company that pays experts to train and evaluate AI models.
                Pay is posted up front on every listing, but most of it is contract work: you are paid for the hours
                or tasks you do, and passing the interview does not guarantee a project.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The best-paid roles go to doctors, lawyers, finance professionals and engineers. Language roles are
                plentiful, and some listings are one-off paid interviews or surveys with a flat fee.
              </p>
            </section>
            <aside className="tile rounded-md p-6">
              <p className="text-sm font-medium">Before you apply</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Apply only through mercor.com links.</li>
                <li>Don’t pay anyone to apply or to be interviewed.</li>
                <li>Check the listing’s country limits before you start.</li>
                <li>Set up for an on-camera interview: camera, mic and a quiet room.</li>
              </ul>
            </aside>
          </div>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="How much Mercor pays, by field." rest="Median and highest top-of-range hourly rate in each field." />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-t border-border text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-medium">Field</th>
                  <th className="py-3 pr-4 text-right font-medium">Open roles</th>
                  <th className="py-3 pr-4 text-right font-medium">Median top rate</th>
                  <th className="py-3 text-right font-medium">Highest rate</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.slug} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <Link href={`/ai-training-jobs/${field.slug}`} className="font-medium hover:underline">{field.label}</Link>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{field.jobs.length}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">${median(field.jobs.map(hourlyMax))}/hr</td>
                    <td className="py-3 text-right font-medium tabular-nums text-brand">${field.topRate}/hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Live figures, updated daily. Field pages list Mercor and micro1 roles side by side; see the{' '}
            <Link href="/micro1" className="underline underline-offset-4">micro1 review</Link> for its numbers.
          </p>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="How to get hired." rest="Mercor’s process has four steps." />
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="border-t border-border pt-4">
                <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-heading mt-2 text-lg font-medium tracking-tight">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="Highest-paying Mercor roles right now." />
          <div className="mt-8">
            <RoleList jobs={top} ranked />
          </div>
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
