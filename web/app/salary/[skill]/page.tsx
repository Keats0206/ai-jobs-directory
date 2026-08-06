import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { jobs, getAllTags, getJobsByTag, slugify, formatSalary } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { GeoContent } from '@/components/geo-content';

export function generateStaticParams() {
  return getAllTags().slice(0, 20).map(({ tag }) => ({ skill: slugify(tag) }));
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
  return {
    title: `${tag} Engineer Salary Guide 2026 — Average Pay & Ranges | AI Jobs Directory`,
    description: `How much do ${tag} engineers make in 2026? Real salary data from ${getJobsByTag(tag).length} open roles. Ranges, averages, and top-paying companies.`,
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-5 py-6 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default async function SalaryPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  const tag = findTag(skill);
  if (!tag) notFound();

  const tagJobs = getJobsByTag(tag).filter((j) => j.salary_min > 0);
  if (tagJobs.length === 0) notFound();

  const topPaying = [...tagJobs].sort((a, b) => b.salary_max - a.salary_max).slice(0, 5);

  const mins = tagJobs.map((j) => j.salary_min);
  const maxs = tagJobs.map((j) => j.salary_max);
  const avgMin = Math.round(mins.reduce((a, b) => a + b, 0) / mins.length);
  const avgMax = Math.round(maxs.reduce((a, b) => a + b, 0) / maxs.length);
  const lowest = Math.min(...mins);
  const highest = Math.max(...maxs);

  // FAQ Schema for this page
  const faqItems = [
    {
      question: `What is the average ${tag} engineer salary in 2026?`,
      answer: `Based on ${tagJobs.length} current job postings, the average ${tag} engineer salary ranges from ${formatSalary(avgMin, avgMax)} per year.`
    },
    {
      question: `How much do senior ${tag} engineers make?`,
      answer: `Senior ${tag} engineers typically earn between $${Math.round(avgMax * 1.2 / 1000)}k and $${Math.round(highest / 1000)}k, with the highest-paying roles reaching up to $${Math.round(highest / 1000)}k annually.`
    },
    {
      question: `What's the salary range for ${tag} roles?`,
      answer: `The salary range for ${tag} positions spans from $${Math.round(lowest / 1000)}k to $${Math.round(highest / 1000)}k, depending on experience level, location, and company stage.`
    },
    {
      question: `Which companies pay the most for ${tag} engineers?`,
      answer: `Top-paying companies for ${tag} roles include established tech companies, AI startups, and well-funded research organizations. See our top-paying roles below.`
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
        name: 'Salary Guides',
        item: 'https://www.artificialjobs.dev/salary',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${tag} salary`,
        item: `https://www.artificialjobs.dev/salary/${skill}`,
      },
    ],
  };

  const aggregateSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: lowest,
    highPrice: highest,
    offerCount: tagJobs.length,
    url: `https://www.artificialjobs.dev/salary/${skill}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        <Container className="py-12">
          <Breadcrumb current={`${tag} salary`} />
          <PageHeading
            title={`${tag} Engineer Salary Guide`}
            lead={`Based on ${tagJobs.length} open roles · Updated for 2026`}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Average range" value={formatSalary(avgMin, avgMax)} />
            <Stat label="Lowest offered" value={`$${Math.round(lowest / 1000)}k`} />
            <Stat label="Highest offered" value={`$${Math.round(highest / 1000)}k`} />
          </div>

          <section className="mt-14">
            <SectionLabel>Top-paying {tag} roles right now</SectionLabel>
            <JobList jobs={topPaying} indexOf={(job) => jobs.indexOf(job)} />
          </section>

          <div className="mt-12 border-t border-border/60 pt-10">
            <Link
              href={`/remote/${slugify(tag)}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Browse all {tagJobs.length} {tag} jobs
            </Link>
          </div>

          {/* FAQ Section */}
          <section className="mt-14 border-t border-border/60 pt-10">
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

          {/* Internal linking - related salary guides */}
          <section className="mt-14 border-t border-border/60 pt-10">
            <SectionLabel>Explore other salary guides</SectionLabel>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {getAllTags().slice(0, 6).map(({ tag: t }) => 
                t !== tag && (
                  <Link
                    key={t}
                    href={`/salary/${slugify(t)}`}
                    className="p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                  >
                    {t} salary →
                  </Link>
                )
              )}
            </div>
          </section>

          {skill === 'llm' ? <GeoContent url="/salary/llm" /> : null}
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
