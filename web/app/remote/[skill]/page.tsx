import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobs, getRemoteTags, getRemoteJobsByTag, jobSlug, slugify, formatSalary, avgSalary } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { ChipLink } from '@/components/chip';

export function generateStaticParams() {
  return getRemoteTags().map(({ tag }) => ({ skill: slugify(tag) }));
}

function findTag(skillSlug: string): string | null {
  const match = getRemoteTags().find(({ tag }) => slugify(tag) === skillSlug);
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
  const count = getRemoteJobsByTag(tag).length;
  return {
    alternates: { canonical: `https://www.artificialjobs.dev/remote/${skill}` },
    title: `${count} Remote ${tag} Jobs — Hiring Now | AI Jobs Directory`,
    description: `Browse ${count} remote ${tag} jobs at AI startups and LLM companies. See salaries, requirements, and apply directly.`,
  };
}

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  const tag = findTag(skill);
  if (!tag) notFound();

  const tagJobs = getRemoteJobsByTag(tag);
  if (!tagJobs.length) notFound();
  const avg = avgSalary(tagJobs);
  const otherTags = getRemoteTags().filter((t) => t.tag !== tag).slice(0, 12);

  // FAQ Schema for SEO
  const faqItems = [
    {
      question: `How many remote ${tag} jobs are available?`,
      answer: `There are currently ${tagJobs.length} remote ${tag} job openings at AI companies and startups on our platform.`
    },
    {
      question: `What's the average salary for remote ${tag} positions?`,
      answer: avg.min > 0
        ? `Remote ${tag} engineers typically earn an average of ${formatSalary(avg.min, avg.max)} per year, based on listings with published pay.`
        : `Most remote ${tag} listings do not publish a salary range. Open a role to see compensation when the employer shared it.`
    },
    {
      question: `What companies are hiring remote ${tag} engineers?`,
      answer: `Top AI companies, well-funded startups, and established tech firms are actively hiring remote ${tag} engineers. Browse our listings to see who's hiring.`
    },
    {
      question: `Are there international remote ${tag} jobs?`,
      answer: `Remote does not always mean worldwide. Check each employer’s listing for eligible countries, time zones, and work authorization requirements.`
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Remote ${tag} Jobs`,
    numberOfItems: tagJobs.length,
    itemListElement: tagJobs.map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${job.title} at ${job.company}`,
      url: `https://www.artificialjobs.dev/jobs/${jobSlug(job, jobs.indexOf(job))}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current={tag} />
          <PageHeading
            title={`Remote ${tag} Jobs`}
            lead={`${tagJobs.length} open roles requiring ${tag} skills.`}
            meta={
              avg.min > 0 ? (
                <>
                  Average published salary{' '}
                  <span className="font-medium text-foreground">
                    {formatSalary(avg.min, avg.max)}
                  </span>{' '}
                  / year
                </>
              ) : (
                <>Salary shown when the employer published a range</>
              )
            }
          />

          <SectionLabel>Remote openings</SectionLabel>
          <JobList jobs={tagJobs} indexOf={(job) => jobs.indexOf(job)} />

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
