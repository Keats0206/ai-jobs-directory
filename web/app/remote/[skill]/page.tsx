import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs, getAllTags, getJobsByTag, slugify, formatSalary, avgSalary } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipLink } from '@/components/chip';

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ skill: slugify(tag) }));
}

function findTag(skillSlug: string): string | null {
  const match = getAllTags().find(({ tag }) => slugify(tag) === skillSlug);
  return match ? match.tag : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>;
}): Promise<Metadata> {
  const { skill } = await params;
  const tag = findTag(skill);
  if (!tag) return { title: 'Not Found' };
  const count = getJobsByTag(tag).length;
  return {
    title: `${count} Remote ${tag} Jobs — Hiring Now | AI Jobs Directory`,
    description: `Browse ${count} remote ${tag} jobs at AI startups and LLM companies. See salaries, requirements, and apply directly. Updated daily.`,
  };
}

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  const tag = findTag(skill);
  if (!tag) notFound();

  const tagJobs = getJobsByTag(tag);
  const avg = avgSalary(tagJobs);
  const otherTags = getAllTags().filter((t) => t.tag !== tag).slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Remote ${tag} Jobs`,
    numberOfItems: tagJobs.length,
    itemListElement: tagJobs.slice(0, 50).map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'JobPosting',
        title: job.title,
        hiringOrganization: { '@type': 'Organization', name: job.company },
        url: job.apply_url,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current={tag} />
          <PageHeading
            title={`Remote ${tag} Jobs`}
            lead={`${tagJobs.length} open roles requiring ${tag} skills.`}
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

          <JobList jobs={tagJobs} indexOf={(job) => jobs.indexOf(job)} />

          <section className="mt-16 border-t border-border/60 pt-10">
            <SectionLabel>Browse other skills</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {otherTags.map(({ tag: t, count }) => (
                <ChipLink key={t} href={`/remote/${slugify(t)}`}>
                  {t}
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
