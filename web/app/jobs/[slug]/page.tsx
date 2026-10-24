import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { trainingJobs, getJobBySlug } from '@/lib/jobs';
import { byPay, formatPay, REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { timeAgo } from '@/lib/job-utils';
import { datePosted, validThrough, employmentType } from '@/lib/job-quality';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SectionLabel } from '@/components/page-shell';
import ApplyButton from '@/app/components/ApplyButton';
import { JobDescription } from '@/components/job-description';
import { DisclosureBar, RoleList } from '@/components/training-ui';

export function generateStaticParams() {
  return trainingJobs.map((job) => ({ slug: job.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const result = getJobBySlug((await params).slug);
  if (!result || !result.job.is_referral || (result.job.status && result.job.status !== 'active')) {
    return { title: 'Job Not Found', robots: { index: false } };
  }
  const { job } = result;
  const pay = formatPay(job);
  return {
    title: `${job.title} — AI Training Job${pay ? `, ${pay}` : ''}`,
    description: `${job.title}: paid AI training work for ${job.field_label || 'expert'} professionals${pay ? ` at ${pay}` : ''}. Help AI labs evaluate and improve their models. Apply via micro1.`,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: { title: `${job.title} — AI Training Job`, description: `${pay ? `${pay} · ` : ''}${job.field_label || 'Expert'} · Artificial Jobs` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const result = getJobBySlug((await params).slug);
  // The engineering board is retired: its job URLs pass their ranking to the homepage.
  if (!result || !result.job.is_referral) permanentRedirect('/');
  const { job } = result;
  if (job.status && job.status !== 'active') {
    if (job.status === 'closed') {
      permanentRedirect(trainingJobs.some((j) => j.field === job.field) ? `/ai-training-jobs/${job.field}` : '/');
    }
    notFound();
  }

  const pay = formatPay(job);
  const fieldHref = `/ai-training-jobs/${job.field || 'other'}`;
  const related = trainingJobs.filter((j) => j !== job && j.field === job.field).sort(byPay).slice(0, 5);
  const posted = timeAgo(job.date_posted || job.first_seen);
  const verified = timeAgo(job.last_verified);
  const applyProps = { applyUrl: job.apply_url, field: job.field, sponsored: true };

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: { '@type': 'Organization', name: job.company, sameAs: 'https://micro1.ai' },
    identifier: { '@type': 'PropertyValue', name: job.company, value: job.source_job_id },
    url: `https://www.artificialjobs.dev/jobs/${job.slug}`,
    directApply: false,
    description: job.description,
    datePosted: datePosted(job),
    validThrough: validThrough(job),
    employmentType: employmentType(job),
  };
  if (job.is_remote) jsonLd.jobLocationType = 'TELECOMMUTE';
  if (job.is_remote && job.applicant_countries?.length) {
    jsonLd.applicantLocationRequirements = job.applicant_countries.map((name) => ({ '@type': 'Country', name }));
  }
  if (job.hourly_max) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: { '@type': 'QuantitativeValue', minValue: job.hourly_min || job.hourly_max, maxValue: job.hourly_max, unitText: 'HOUR' },
    };
  }
  // Google rejects a JobPosting with neither a location nor a remote flag, and micro1 rarely gives one.
  const emitJsonLd = Boolean(job.is_remote);
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI training jobs', item: 'https://www.artificialjobs.dev/' },
      { '@type': 'ListItem', position: 2, name: job.field_label || 'Specialist', item: `https://www.artificialjobs.dev${fieldHref}` },
      { '@type': 'ListItem', position: 3, name: job.title },
    ],
  };

  const facts: [string, string | null][] = [
    ['Pay', pay],
    ['Field', job.field_label || null],
    ['Type', job.job_type || 'Contract'],
    ['Openings', job.openings ? String(job.openings) : null],
    ['Posted', posted],
  ];

  return (
    <>
      {emitJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader action={<ApplyButton {...applyProps} placement="header" className="btn-money h-8 rounded-full px-4 text-xs font-medium">Apply</ApplyButton>} />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>

      <main className="flex-1">
        <div className="w-full px-5 pb-24 pt-10 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">AI training jobs</Link>
            <span aria-hidden>/</span>
            <Link href={fieldHref} className="hover:text-foreground">{job.field_label || 'Specialist'}</Link>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,46rem)_20rem] lg:justify-between">
            <article>
              <p className="text-sm text-muted-foreground">
                {job.field_label || 'Specialist'} · {job.is_remote ? 'Remote' : 'Contract'} · via micro1
                {job.high_demand && <span className="ml-2 rounded-sm bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">High demand</span>}
              </p>
              <h1 className="font-heading mt-3 text-4xl font-medium tracking-[-0.03em] text-balance sm:text-5xl">{job.title}</h1>
              {pay && <p className="font-heading mt-4 text-2xl font-medium tabular-nums text-muted-foreground">{pay}</p>}

              <div className="mt-10 border-t border-border pt-10 text-[17px] leading-relaxed">
                <JobDescription markdown={job.description} />
              </div>
              {job.skills && job.skills.length > 0 && (
                <div className="mt-10">
                  <SectionLabel>Skills they want</SectionLabel>
                  <ul className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => <li key={skill} className="rounded-full border border-border px-3 py-1 text-sm">{skill}</li>)}
                  </ul>
                </div>
              )}
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="tile rounded-md p-6">
                <p className="text-sm font-medium">At a glance</p>
                <dl className="mt-4 divide-y divide-border text-sm">
                  {facts.filter((row): row is [string, string] => Boolean(row[1])).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-right font-medium tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
                <ApplyButton {...applyProps} placement="sidebar" className="btn-money mt-6 h-11 w-full rounded-full text-sm font-medium">Apply on micro1</ApplyButton>
                <p className="mt-3 text-center text-xs text-muted-foreground">Free to apply · short AI interview{verified ? ` · checked ${verified}` : ''}</p>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-heading text-3xl font-medium tracking-tight">More {job.field_label?.toLowerCase() || 'specialist'} roles</h2>
                <Link href={fieldHref} className="text-sm font-medium hover:underline">See all &rarr;</Link>
              </div>
              <RoleList jobs={related} showField={false} />
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
