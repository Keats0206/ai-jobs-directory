import type { Metadata } from 'next';
import Link from 'next/link';
import { trainingJobs } from '@/lib/jobs';
import { getTrainingFields, trainingStats, byPay, hourlyMax, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { DisclosureBar, Headline, StatRow, RoleList } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';

const monthYear = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export function generateMetadata(): Metadata {
  const stats = trainingStats();
  return {
    title: `micro1 Review (${monthYear()}): Pay, AI Interview & Is It Legit?`,
    description: `How much micro1 pays, from ${stats.total} live roles (median top rate $${stats.medianRate}/hr, up to $${stats.topRate}/hr), how the Zara AI interview works, and what to check before you apply.`,
    alternates: { canonical: '/micro1' },
  };
}

const median = (values: number[]) => {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};

// micro1's own four steps (micro1.ai/experts, Oct 2026).
const STEPS: [string, string][] = [
  ['Apply for a role', 'Pick a listing that matches your credentials. Each one names the field, the skills it wants and an hourly range.'],
  ['Take the AI interview', 'micro1 screens applicants with Zara, its AI interviewer, which asks about your experience in the role’s field.'],
  ['Get onboarded', 'If you pass, micro1 sets up your contract and payment details and matches you to a project.'],
  ['Start earning', 'You work remotely at the role’s hourly rate, reviewing, writing and grading the data AI models learn from.'],
];

export default function Micro1Page() {
  const stats = trainingStats();
  const fields = getTrainingFields().filter((field) => field.jobs.some(hourlyMax));
  const top = [...trainingJobs].sort(byPay).slice(0, 10);
  const remote = trainingJobs.filter((job) => job.is_remote).length;
  const rates = trainingJobs.map(hourlyMax).filter(Boolean);
  const over100 = rates.filter((rate) => rate >= 100).length;

  const faqs = [
    {
      question: 'Is micro1 legit?',
      answer: `micro1 is a real AI data company that vets human experts and pays them to produce training data for AI labs. Forbes reported in September 2026 that it raised over $100 million at a $4 billion valuation. It currently lists ${stats.total} open roles with posted hourly ranges. Apply only through micro1.ai links, and be wary of anyone asking you to pay to apply.`,
    },
    {
      question: 'How much does micro1 pay per hour?',
      answer: `Across ${rates.length} live micro1 roles with posted pay, the top of the range runs up to $${stats.topRate}/hr, with a median of $${stats.medianRate}/hr. ${over100} roles pay $100/hr or more at the top of their range, mostly in law, medicine and research. Rates come from micro1's own listings and are refreshed daily.`,
    },
    {
      question: 'What is the micro1 AI interview?',
      answer: 'After you apply, micro1 interviews you with Zara, its AI interviewer. It asks about your background and expertise in the role’s field. Passing puts you in micro1’s expert pool for that kind of work.',
    },
    {
      question: 'Are micro1 jobs remote?',
      answer: remote
        ? `Yes. ${remote} of the ${stats.total} roles listed here are marked remote by micro1, and the work is done online. Some roles are limited to applicants in certain countries.`
        : 'micro1 work is done online. Some roles are limited to applicants in certain countries, which each listing states.',
    },
    {
      question: 'Do I need experience to work for micro1?',
      answer: 'Most well-paid micro1 roles ask for professional credentials, such as a law license, medical training or a PhD. There are also generalist and language roles with lower bars and lower pay.',
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
            <span className="text-foreground">micro1 review</span>
          </nav>
          <p className="mb-4 text-sm text-muted-foreground">Updated {monthYear()} · pay from {stats.total} live listings</p>
          <Headline lead="micro1 review: what it pays and how to get in." rest="Real pay data from every open micro1 role, refreshed daily." />
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
                micro1 is a legitimate, venture-backed company that pays credentialed experts to train AI models.
                The pay is real and posted up front, but it is contract work: you are paid hourly for projects, and
                passing the interview does not guarantee a steady stream of hours.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The best-paid roles go to lawyers, doctors and PhD researchers. Generalist and language roles are
                easier to get and pay less.
              </p>
            </section>
            <aside className="tile rounded-md p-6">
              <p className="text-sm font-medium">Before you apply</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Apply only through micro1.ai links.</li>
                <li>Don’t pay anyone to apply or to be interviewed.</li>
                <li>Check the listing’s country limits before you start.</li>
                <li>Treat it as contract income, not a salary.</li>
              </ul>
            </aside>
          </div>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="How much micro1 pays, by field." rest="Median and highest top-of-range hourly rate in each field." />
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
            Live figures, updated daily. For a frozen, citable monthly snapshot with CSV, see the{' '}
            <Link href="/pay-index" className="underline underline-offset-4">micro1 Pay Index</Link>.
          </p>
        </Container>

        <Container className="pb-24">
          <Headline as="h2" lead="How to get hired." rest="micro1’s process has four steps." />
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
          <Headline as="h2" lead="Highest-paying micro1 roles right now." />
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
