import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  jobs,
  getAllLocations,
  getJobsByLocation,
  slugify,
  formatSalary,
  avgSalary,
  salaryRange,
  LOCATION_SLUG_ALIASES,
} from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipLink } from '@/components/chip';

export function generateStaticParams() {
  const dataLocations = getAllLocations().map(({ location }) => ({ city: slugify(location) }));
  const aliasedLocations = Object.keys(LOCATION_SLUG_ALIASES).map((city) => ({ city }));
  const seen = new Set<string>();
  return [...dataLocations, ...aliasedLocations].filter(({ city }) => {
    if (seen.has(city)) return false;
    seen.add(city);
    return true;
  });
}

/** Resolves a URL slug to a display label and the substring used to match jobs. */
function resolveCity(citySlug: string): { label: string; matchTerm: string } | null {
  const alias = LOCATION_SLUG_ALIASES[citySlug];
  if (alias) return alias;
  const match = getAllLocations().find(({ location }) => slugify(location) === citySlug);
  return match ? { label: match.location, matchTerm: match.location.toLowerCase() } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const resolved = resolveCity(city);
  if (!resolved) return { title: 'Not Found' };
  const { label: loc, matchTerm } = resolved;
  const count = getJobsByLocation(matchTerm).length;
  return {
    alternates: { canonical: `https://www.artificialjobs.dev/location/${city}` },
    title: `${count} AI Jobs in ${loc} — Hiring Now | AI Jobs Directory`,
    description: `Browse ${count} AI and machine learning jobs in ${loc}. LLM engineers, RAG developers, and ML roles at top AI companies. Updated daily.`,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const resolved = resolveCity(city);
  if (!resolved) notFound();
  const { label: loc, matchTerm } = resolved;

  const locJobs = getJobsByLocation(matchTerm);
  if (locJobs.length === 0) notFound();
  const avg = avgSalary(locJobs);
  const otherLocations = getAllLocations()
    .filter((l) => !l.location.toLowerCase().includes(matchTerm))
    .slice(0, 10);

  // FAQ Schema for SEO
  const faqItems = [
    {
      question: `How many AI jobs are available in ${loc}?`,
      answer: `There are currently ${locJobs.length} open AI, machine learning, and LLM engineering positions in ${loc} listed on our platform.`
    },
    {
      question: `What's the average salary for AI engineers in ${loc}?`,
      answer: avg.min > 0
        ? `AI and machine learning engineers in ${loc} typically earn an average of ${formatSalary(avg.min, avg.max)} per year, based on listings with published pay.`
        : `Most ${loc} listings do not publish a salary range. Compensation appears when the employer shared it.`
    },
    {
      question: `What types of AI roles are hiring in ${loc}?`,
      answer: `${loc} has openings for LLM engineers, RAG developers, machine learning engineers, AI infrastructure engineers, and data scientists at various companies.`
    },
    {
      question: `Are there remote AI jobs in ${loc}?`,
      answer: `Yes, many roles in ${loc} are fully remote or hybrid. Filter by location type on our job listings to find opportunities that match your preferences.`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.artificialjobs.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: 'https://www.artificialjobs.dev/location',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: loc,
        item: `https://www.artificialjobs.dev/location/${city}`,
      },
    ],
  };

  const paidJobs = locJobs.filter((job) => salaryRange(job));
  const publishedRanges = paidJobs.map((job) => salaryRange(job)!);
  const hasPay = publishedRanges.length > 0;
  const aggregateSchema = hasPay
    ? {
        '@context': 'https://schema.org',
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: Math.min(...publishedRanges.map((r) => r.min)),
        highPrice: Math.max(...publishedRanges.map((r) => r.max)),
        offerCount: paidJobs.length,
        url: `https://www.artificialjobs.dev/location/${city}`,
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {aggregateSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current={loc} />
          <PageHeading
            title={`AI Jobs in ${loc}`}
            lead={`${locJobs.length} open AI engineering roles in ${loc}.`}
            meta={
              avg.min > 0 ? (
                <>
                  Average published salary{' '}
                  <span className="font-medium text-foreground">
                    {formatSalary(avg.min, avg.max)}
                  </span>{' '}
                  / year · Updated daily
                </>
              ) : (
                <>Updated daily · salary shown when the employer published a range</>
              )
            }
          />

          <JobList jobs={locJobs} indexOf={(job) => jobs.indexOf(job)} showLocation={false} />

          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Frequently Asked Questions</SectionLabel>
            <div className="space-y-6">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border-b border-border/40 pb-6 last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Browse other locations</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {otherLocations.map(({ location, count }) => (
                <ChipLink key={location} href={`/location/${slugify(location)}`}>
                  {location}
                  <span className="tabular-nums opacity-50">{count}</span>
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
