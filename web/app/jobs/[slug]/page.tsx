import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { jobs, jobSlug, getJobBySlug, formatSalary, slugify, salaryRange } from '@/lib/jobs';
import { timeAgo } from '@/lib/job-utils';
import {
  displayCompany,
  displayTitle,
  datePosted,
  validThrough,
  employmentType,
  parseLocationAddress,
} from '@/lib/job-quality';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Breadcrumb } from '@/components/page-shell';
import { Chip, ChipLink } from '@/components/chip';
import ApplyButton from '@/app/components/ApplyButton';
import { JobDescription } from '@/components/job-description';
import { JobList } from '@/components/job-list';

export function generateStaticParams() {
  return jobs.map((job, i) => ({ slug: jobSlug(job, i) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = getJobBySlug(slug);
  if (!result || (result.job.status && result.job.status !== 'active')) return { title: 'Job Not Found', robots: { index: false } };
  const { job } = result;
  const title = displayTitle(job);
  const company = displayCompany(job);
  const range = salaryRange(job);
  const salary = range ? formatSalary(range.min, range.max) : null;
  const salaryBit = salary ? ` — ${salary}` : '';
  return {
    title: `${title} at ${company}${salaryBit} | AI Jobs Directory`,
    description: `${company} is hiring: ${title}. ${job.location}.${salary ? ` Salary ${salary}.` : ''} Apply for this AI engineering role.`,
    openGraph: {
      title: `${title} at ${company}`,
      description: `${job.location}${salary ? ` · ${salary}` : ''} · AI Jobs Directory`,
    },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getJobBySlug(slug);
  if (!result) notFound();
  if (result.job.status && result.job.status !== 'active') {
    // A filled role's link equity goes to the employer's open roles when they still have some.
    if (result.job.status === 'closed' && jobs.filter((j) => j.company === result.job.company).length > 1) {
      permanentRedirect(`/company/${slugify(result.job.company)}`);
    }
    notFound();
  }

  const { job, index } = result;
  const title = displayTitle(job);
  const company = displayCompany(job);
  const range = salaryRange(job);
  const salary = range ? formatSalary(range.min, range.max) : null;

  const address = parseLocationAddress(job.location);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    hiringOrganization: { '@type': 'Organization', name: company },
    url: job.apply_url,
    description: job.description,
    datePosted: datePosted(job),
    validThrough: validThrough(job),
    employmentType: employmentType(job),
  };

  if (job.is_remote) {
    jsonLd.jobLocationType = 'TELECOMMUTE';
    if (address.addressCountry) {
      jsonLd.applicantLocationRequirements = {
        '@type': 'Country',
        name: address.addressCountry === 'US' ? 'USA' : address.addressCountry,
      };
    }
  }
  // Even remote roles often anchor to a hiring location (e.g. "Remote / USA");
  // include it when known, per Google's guidance for hybrid/remote postings.
  if (Object.keys(address).length > 0) {
    jsonLd.jobLocation = {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', ...address },
    };
  }

  if (range) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: range.min,
        maxValue: range.max,
        unitText: 'YEAR',
      },
    };
  }

  const applyProps = {
    jobId: jobSlug(job, index),
    company,
    applyUrl: job.apply_url,
  };

  // Related: same company first, then shared skills. Re-uses the list row used everywhere else.
  const related = [
    ...jobs.filter((j) => j.company === job.company),
    ...jobs.filter((j) => j.tags?.some((t) => job.tags?.includes(t))),
  ].filter((j, i, list) => j !== job && list.indexOf(j) === i).slice(0, 5);

  const facts = job.facts;
  const factRows = [
    ['Seniority', facts && facts.seniority !== 'unknown' ? SENIORITY[facts.seniority] : null],
    ['Experience', facts?.yoe_min ? `${facts.yoe_min}+ years` : null],
    ['Focus', facts && facts.work_type !== 'other' ? WORK_TYPE[facts.work_type] : null],
    ['Team', facts?.team ?? null],
    ['Remote regions', facts?.remote_regions.length ? facts.remote_regions.map((r) => REGION[r] ?? r).join(', ') : null],
    ['Visa sponsorship', facts?.visa_sponsorship === 'yes' ? 'Yes' : facts?.visa_sponsorship === 'no' ? 'No' : null],
    ['Employment', job.job_type || null],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const stack = facts?.stack ?? [];
  const posted = timeAgo(job.date_posted || job.first_seen);
  const verified = timeAgo(job.last_verified);
  const hasCompanyPage = jobs.filter((j) => j.company === job.company).length > 1;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader
        action={<ApplyButton {...applyProps} className="h-8 px-3.5 text-xs">Apply</ApplyButton>}
      />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-10">
          <Breadcrumb
            segments={hasCompanyPage ? [{ label: company, href: `/company/${slugify(job.company)}` }] : undefined}
            current={title}
          />

          <header className="border-b border-border/60 pb-8">
            <p className="text-sm font-medium text-brand">
              {hasCompanyPage ? <Link href={`/company/${slugify(job.company)}`} className="hover:underline">{company}</Link> : company}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <Link href={`/location/${slugify(job.location)}`} className="hover:text-foreground">{job.location}</Link>
              <span aria-hidden>·</span>
              <span>{job.is_remote ? 'Remote' : 'On-site'}</span>
              {salary && (<><span aria-hidden>·</span><span className="font-medium text-foreground">{salary}</span></>)}
              {posted && (<><span aria-hidden>·</span><span>Posted {posted}</span></>)}
            </p>
          </header>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article>
              <JobDescription markdown={job.description} />
              <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border/60 pt-8">
                <ApplyButton {...applyProps} className="px-6 py-2.5">Apply on {company}&rsquo;s site</ApplyButton>
                {verified && <span className="text-xs text-muted-foreground">Listing checked {verified}</span>}
              </div>
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                {salary ? (
                  <>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Salary</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{salary}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Salary not listed by {company}</p>
                )}
                <ApplyButton {...applyProps} className="mt-4 w-full py-2.5">Apply now</ApplyButton>

                {factRows.length > 0 && (
                  <dl className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
                    {factRows.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="text-right font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {(stack.length > 0 || job.tags?.length > 0) && (
                <div className="mt-6">
                  <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags?.map((tag) => (
                      <ChipLink key={tag} href={`/remote/${slugify(tag)}`}>{tag}</ChipLink>
                    ))}
                    {stack.filter((s) => !job.tags?.includes(s)).map((s) => <Chip key={s}>{s}</Chip>)}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-border/60 pt-10">
              <h2 className="mb-2 text-lg font-semibold">Similar roles</h2>
              <JobList jobs={related} indexOf={(j) => jobs.indexOf(j)} />
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

const SENIORITY: Record<string, string> = {
  intern: 'Intern', junior: 'Junior', mid: 'Mid-level', senior: 'Senior', staff: 'Staff', principal: 'Principal', manager: 'Manager',
};
const WORK_TYPE: Record<string, string> = {
  research: 'Research', applied: 'Applied ML', infra: 'Infrastructure', evals: 'Evals', data: 'Data', product: 'Product',
};
const REGION: Record<string, string> = {
  us: 'US', canada: 'Canada', latam: 'LatAm', uk: 'UK', europe: 'Europe', india: 'India', apac: 'APAC', global: 'Anywhere',
};
