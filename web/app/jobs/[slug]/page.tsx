import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs, jobSlug, getJobBySlug, formatSalary, slugify } from '@/lib/jobs';
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
  const salary = formatSalary(job.salary_min, job.salary_max);
  return {
    title: `${job.title} at ${job.company} — ${salary} | AI Jobs Directory`,
    description: `${job.company} is hiring: ${job.title}. ${job.location}. Salary ${salary}. Apply for this AI engineering role.`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `${job.location} · ${salary} · AI Jobs Directory`,
    },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getJobBySlug(slug);
  if (!result) notFound();

  const { job, index } = result;
  const salary = formatSalary(job.salary_min, job.salary_max);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: { '@type': 'Organization', name: job.company },
    jobLocation: { '@type': 'Place', address: job.location },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: 'YEAR',
      },
    },
    url: job.apply_url,
    description: job.description,
  };

  // Clean description — strip markdown junk
  const cleanDesc = job.description
    .replace(/[#*[\]]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 3000);

  const applyProps = {
    jobId: jobSlug(job, index),
    company: job.company,
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
            <Breadcrumb current={job.title} />

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{job.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{job.company}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>{job.location}</Chip>
              <Chip>{job.is_remote ? 'Remote OK' : 'On-site'}</Chip>
              <Chip>{job.job_type || 'Full-time'}</Chip>
              <Chip variant="brand" className="font-medium">
                {salary} / year
              </Chip>
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
              <h2 className="text-lg font-semibold">About this role</h2>
              <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                {cleanDesc}
              </div>
            </section>

            <aside className="mt-12 rounded-xl border border-border bg-muted/40 px-6 py-8 text-center">
              <h2 className="text-base font-semibold">Interested in this role?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Apply directly with {job.company}.
              </p>
              <ApplyButton {...applyProps} className="mt-5 px-8 py-2.5">
                Apply for this job
              </ApplyButton>
            </aside>

            {relatedJobs.length > 0 && (
              <section className="mt-14 border-t border-border/60 pt-10">
                <h2 className="text-lg font-semibold mb-6">Related opportunities</h2>
                <div className="space-y-3">
                  {relatedJobs.map(({ job: relJob, index: relIndex }) => (
                    <a
                      key={relIndex}
                      href={`/jobs/${jobSlug(relJob, relIndex)}`}
                      className="flex items-start justify-between rounded-lg border border-border/60 p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-medium group-hover:text-primary transition-colors">{relJob.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{relJob.company}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded">{relJob.location}</span>
                          <span className="text-xs bg-muted px-2 py-1 rounded">{formatSalary(relJob.salary_min, relJob.salary_max)}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground ml-4 flex-shrink-0">
                        <div className="text-primary font-semibold group-hover:underline">View →</div>
                      </div>
                    </a>
                  ))}
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
