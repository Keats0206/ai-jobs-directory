import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs, jobSlug, getJobBySlug, formatSalary, slugify, salaryRange } from '@/lib/jobs';
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
import { Container, Breadcrumb } from '@/components/page-shell';
import { Chip, ChipLink } from '@/components/chip';
import ApplyButton from '@/app/components/ApplyButton';

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
  if (!result) return { title: 'Job Not Found' };
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

  // Clean description — strip markdown junk
  const cleanDesc = job.description
    .replace(/[#*[\]]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 3000);

  const applyProps = {
    jobId: jobSlug(job, index),
    company,
    applyUrl: job.apply_url,
  };

  // Find related jobs (same skill, location, or company)
  const getRelatedJobs = () => {
    const related = new Set<number>();
    
    // Same company
    jobs.forEach((j, i) => {
      if (j.company === job.company && i !== index) related.add(i);
    });
    
    // Same location (if fewer than 4)
    if (related.size < 4) {
      jobs.forEach((j, i) => {
        if (j.location === job.location && i !== index && related.size < 4) related.add(i);
      });
    }
    
    // Same tags (if still fewer)
    if (related.size < 4 && job.tags?.length) {
      jobs.forEach((j, i) => {
        if (j.tags?.some(t => job.tags?.includes(t)) && i !== index && related.size < 4) related.add(i);
      });
    }
    
    return Array.from(related).slice(0, 4).map(i => ({ job: jobs[i], index: i }));
  };

  const relatedJobs = getRelatedJobs();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader
        action={<ApplyButton {...applyProps} className="h-8 px-3.5 text-xs">Apply</ApplyButton>}
      />

      <main className="flex-1">
        <Container className="py-12">
          <article>
            <Breadcrumb current={title} />

            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">{company}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>{job.location}</Chip>
              <Chip>{job.is_remote ? 'Remote OK' : 'On-site'}</Chip>
              <Chip>{job.job_type || 'Full-time'}</Chip>
              {salary && (
                <Chip variant="brand" className="font-medium font-mono">
                  {salary} / year
                </Chip>
              )}
            </div>

            {job.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <ChipLink key={tag} href={`/remote/${slugify(tag)}`}>
                    {tag}
                  </ChipLink>
                ))}
              </div>
            )}

            <section className="mt-12">
              <h2 className="font-heading text-lg font-semibold">About this role</h2>
              <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                {cleanDesc}
              </div>
            </section>

            <aside className="mt-12 border-t border-border/60 pt-10 text-center sm:text-left">
              <h2 className="font-heading text-base font-semibold">Interested in this role?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Apply directly with {company}.
              </p>
              <ApplyButton {...applyProps} className="mt-5 px-8 py-2.5">
                Apply for this job
              </ApplyButton>
            </aside>

            {relatedJobs.length > 0 && (
              <section className="mt-14 border-t border-border/60 pt-10">
                <h2 className="font-heading mb-2 text-lg font-semibold">Related opportunities</h2>
                <div className="divide-y divide-border/60">
                  {relatedJobs.map(({ job: relJob, index: relIndex }) => {
                    const relRange = salaryRange(relJob);
                    return (
                      <a
                        key={relIndex}
                        href={`/jobs/${jobSlug(relJob, relIndex)}`}
                        className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-brand-muted/30 sm:-mx-3 sm:rounded-lg sm:px-3"
                      >
                        <div className="min-w-0 flex-1 text-left">
                          <h3 className="font-medium transition-colors group-hover:text-brand">
                            {displayTitle(relJob)}
                          </h3>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {displayCompany(relJob)}
                            {relJob.location ? ` · ${relJob.location}` : ''}
                          </p>
                          {relRange && (
                            <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                              {formatSalary(relRange.min, relRange.max)}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                          View
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </article>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
