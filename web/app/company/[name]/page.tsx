import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs, getAllLocations, getAllTags, slugify, formatSalary, avgSalary } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipLink } from '@/components/chip';
import Link from 'next/link';

// Pre-render pages for all companies with >1 job
export function generateStaticParams() {
  const companyCounts: Record<string, number> = {};
  jobs.forEach(j => {
    const c = j.company;
    companyCounts[c] = (companyCounts[c] || 0) + 1;
  });
  return Object.entries(companyCounts)
    .filter(([, count]) => count > 1)
    .map(([company]) => ({ name: slugify(company) }));
}

function findCompany(slug: string): string | null {
  for (const j of jobs) {
    if (slugify(j.company) === slug) return j.company;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const company = findCompany(name);
  if (!company) return { title: 'Not Found' };
  const companyJobs = jobs.filter(j => j.company === company);
  const avg = avgSalary(companyJobs);
  const isRemote = companyJobs.filter(j => j.is_remote).length;
  return {
    title: `${companyJobs.length} ${company} AI Jobs — Hiring Now | AI Jobs Directory`,
    description: `${company} is hiring for ${companyJobs.length} AI/ML roles ${isRemote > 0 ? `(${isRemote} remote)` : ''}.${avg.min > 0 ? ` Average published salary ${formatSalary(avg.min, avg.max)}.` : ''} View all openings and apply.`,
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const company = findCompany(name);
  if (!company) notFound();

  const companyJobs = jobs.filter(j => j.company === company);
  if (companyJobs.length === 0) notFound();

  const avg = avgSalary(companyJobs);
  const tagsSet = new Set<string>();
  companyJobs.forEach(j => j.tags?.forEach(t => tagsSet.add(t)));
  const uniqueTags = [...tagsSet];

  // FAQ Schema
  const faqItems = [
    {
      question: `How many AI jobs is ${company} hiring for?`,
      answer: `${company} currently has ${companyJobs.length} open AI and machine learning positions listed on our platform.`
    },
    {
      question: `What is the average salary for AI roles at ${company}?`,
      answer: avg.min > 0
        ? `The average salary for AI engineering roles at ${company} ranges from ${formatSalary(avg.min, avg.max)} per year, based on listings with published pay.`
        : `${company} listings on this board do not currently publish a salary range.`
    },
    {
      question: `Does ${company} offer remote AI jobs?`,
      answer: `${companyJobs.some(j => j.is_remote) ? 'Yes, ' + company + ' has remote AI positions available.' : company + '\'s current AI openings are primarily on-site or hybrid.'} Check individual job listings for details.`
    },
    {
      question: `What skills is ${company} looking for in AI engineers?`,
      answer: `${company} is hiring for skills including ${uniqueTags.slice(0, 6).join(', ')}. Browse individual listings for specific requirements.`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.artificialjobs.dev' },
      { '@type': 'ListItem', position: 2, name: 'Companies', item: 'https://www.artificialjobs.dev/company' },
      { '@type': 'ListItem', position: 3, name: company, item: `https://www.artificialjobs.dev/company/${name}` },
    ],
  };

  // Find related companies (same tags)
  const relatedCompanies: { name: string; slug: string; count: number }[] = [];
  if (uniqueTags.length > 0) {
    const seen = new Set([company]);
    for (const j of jobs) {
      if (j.company === company || seen.has(j.company)) continue;
      if (j.tags?.some(t => uniqueTags.includes(t))) {
        seen.add(j.company);
        if (relatedCompanies.length < 6) {
          relatedCompanies.push({ name: j.company, slug: slugify(j.company), count: jobs.filter(jj => jj.company === j.company).length });
        }
      }
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb segments={[{ label: 'Companies', href: '/company' }]} current={company} />
          <PageHeading
            title={`${company} AI Jobs`}
            lead={`${companyJobs.length} open AI, ML, and engineering roles at ${company}.`}
            meta={
              avg.min > 0 ? (
                <>
                  Average published salary{' '}
                  <span className="font-medium text-foreground">
                    {formatSalary(avg.min, avg.max)}
                  </span>{' '}
                  / year · Updated daily
                </>
              ) : undefined
            }
          />

          <JobList jobs={companyJobs} indexOf={(job) => jobs.indexOf(job)} />

          {/* Skills tags */}
          {uniqueTags.length > 0 && (
            <section className="mt-12 border-t border-border/60 pt-10">
              <SectionLabel>Skills in demand at {company}</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <ChipLink key={tag} href={`/remote/${slugify(tag)}`}>
                    {tag}
                  </ChipLink>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="mt-16 border-t border-border/60 pt-10">
            <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border-b border-border/40 pb-6 last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related companies */}
          {relatedCompanies.length > 0 && (
            <section className="mt-16 border-t border-border/60 pt-10">
              <SectionLabel>Similar companies hiring AI talent</SectionLabel>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {relatedCompanies.map(({ name: cName, slug: cSlug, count }) => (
                  <Link
                    key={cSlug}
                    href={`/company/${cSlug}`}
                    className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                  >
                    {cName} <span className="text-muted-foreground">({count})</span> →
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular locations link section */}
          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Browse by location</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {getAllLocations().slice(0, 10).map(({ location, count }) => (
                <ChipLink key={location} href={`/location/${slugify(location)}`}>
                  {location} <span className="tabular-nums opacity-50">{count}</span>
                </ChipLink>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}