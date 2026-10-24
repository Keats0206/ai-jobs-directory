import type { Metadata } from 'next';
import Link from 'next/link';
import { trainingStats, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { Headline, StatRow } from '@/components/training-ui';

export const metadata: Metadata = {
  title: 'About Artificial Jobs — How Listings Are Sourced and How We Get Paid',
  description: 'Artificial Jobs lists paid AI training work for domain experts, sourced daily from micro1. How listings are collected, ranked and verified, and how the site earns referral fees.',
  alternates: { canonical: '/about' },
};

const METHOD = [
  ['Sourced from micro1', 'Every role comes from micro1’s public job feed. We pull the full description, pay range, location and remote status from each role’s own micro1 job page.'],
  ['Refreshed daily', 'An automated job re-checks every listing once a day. Roles micro1 closes are removed, and their pages redirect to the field they belonged to.'],
  ['Ranked by pay', 'Roles are ordered by the top of their hourly pay range, newest first on ties. Pay figures are the ranges micro1 publishes; we don’t estimate or adjust them.'],
  ['Grouped by field', 'Each role is filed under the field micro1 assigns it (Law, Medicine, Software Engineering and so on), plus credential pages such as PhDs and physicians matched on the role’s title and skills.'],
];

export default function AboutPage() {
  const stats = trainingStats();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="pb-16 pt-16 sm:pt-24">
          <p className="mb-6 text-sm text-muted-foreground">About</p>
          <Headline
            lead="One place to find paid AI training work."
            rest="Artificial Jobs lists hourly roles where domain experts help AI labs improve their models."
          />
          <div className="mt-12">
            <StatRow stats={[
              [String(stats.total), 'Open roles'],
              [String(stats.fields), 'Fields'],
              [stats.medianRate ? `$${stats.medianRate}/hr` : '—', 'Median top rate'],
              [stats.topRate ? `$${stats.topRate}/hr` : '—', 'Top hourly rate'],
            ]} />
          </div>
        </Container>

        <Container className="pb-20">
          <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed">
            <p>
              AI labs pay lawyers, doctors, engineers, scientists and linguists to write, review and grade the examples their models learn from.
              The work is real and often well paid, but it’s scattered across job posts that are hard to compare. Artificial Jobs collects those
              roles into one list, ranked by pay and grouped by profession, so you can see what your expertise is worth before you apply.
            </p>
            <p>
              The site is run by <a href="https://keatingholdings.com" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">Keating Holdings</a>.
              We don’t employ anyone listed here and we don’t run the hiring process: applications, interviews and payment all happen on micro1.
            </p>
          </div>
        </Container>

        <Container className="pb-20">
          <SectionLabel>How listings work</SectionLabel>
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {METHOD.map(([title, body]) => (
              <div key={title} className="max-w-md">
                <dt className="font-medium">{title}</dt>
                <dd className="mt-2 text-muted-foreground leading-relaxed">{body}</dd>
              </div>
            ))}
          </dl>
        </Container>

        <Container className="pb-24">
          <SectionLabel>How we get paid</SectionLabel>
          <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed">
            <p>{REFERRAL_DISCLOSURE} Referral fees don’t affect ranking: every role is ordered by pay, and every listing carries the same referral code.</p>
            <p>
              We also refer companies to AI data partnerships. See <Link href="/sell-company-data" className="underline underline-offset-4 hover:text-foreground">Sell company data</Link> for
              how those programs work and what we earn from them.
            </p>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
