import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  jobs,
  getAllLocations,
  getJobsByLocation,
  slugify,
  formatSalary,
  avgSalary,
} from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipLink } from '@/components/chip';

export function generateStaticParams() {
  return getAllLocations().map(({ location }) => ({ city: slugify(location) }));
}

function findLocation(citySlug: string): string | null {
  const match = getAllLocations().find(({ location }) => slugify(location) === citySlug);
  return match ? match.location : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const loc = findLocation(city);
  if (!loc) return { title: 'Not Found' };
  const count = getJobsByLocation(loc).length;
  return {
    title: `${count} AI Jobs in ${loc} — Hiring Now | AI Jobs Directory`,
    description: `Browse ${count} AI and machine learning jobs in ${loc}. LLM engineers, RAG developers, and ML roles at top AI companies. Updated daily.`,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = findLocation(city);
  if (!loc) notFound();

  const locJobs = getJobsByLocation(loc);
  const avg = avgSalary(locJobs);
  const otherLocations = getAllLocations().filter((l) => l.location !== loc).slice(0, 10);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current={loc} />
          <PageHeading
            title={`AI Jobs in ${loc}`}
            lead={`${locJobs.length} open AI engineering roles in ${loc}.`}
            meta={
              <>
                Average salary{' '}
                <span className="font-medium text-foreground">
                  {formatSalary(avg.min, avg.max)}
                </span>{' '}
                / year · Updated daily
              </>
            }
          />

          <JobList jobs={locJobs} indexOf={(job) => jobs.indexOf(job)} showLocation={false} />

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
