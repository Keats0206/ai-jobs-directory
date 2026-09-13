import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { jobs, getAllTags, getSalaryTags, getJobsByTag, slugify, formatSalary, salaryRange, avgSalary, SKILL_SLUG_ALIASES } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { GeoContent } from '@/components/geo-content';

export function generateStaticParams() {
  const topTags = getSalaryTags().map(({ tag }) => ({ skill: slugify(tag) }));
  const aliasedSkills = Object.keys(SKILL_SLUG_ALIASES).map((skill) => ({ skill }));
  const seen = new Set<string>();
  return [...topTags, ...aliasedSkills].filter(({ skill }) => {
    if (seen.has(skill)) return false;
    seen.add(skill);
    return true;
  });
}

function findTag(skillSlug: string): string | null {
  if (SKILL_SLUG_ALIASES[skillSlug]) return SKILL_SLUG_ALIASES[skillSlug];
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
  if (!tag || !getJobsByTag(tag).length) notFound();
  return {
    alternates: { canonical: `https://www.artificialjobs.dev/salary/${slugify(tag)}` },
    robots: { index: getJobsByTag(tag).some(salaryRange), follow: true },
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

  const tagJobs = getJobsByTag(tag);
  if (tagJobs.length === 0) notFound();
  if (skill !== slugify(tag)) permanentRedirect(`/salary/${slugify(tag)}`);

  const paidJobs = tagJobs.filter((job) => salaryRange(job));
  const { min: avgMin, max: avgMax } = avgSalary(paidJobs);
  const hasPay = paidJobs.length > 0 && avgMin > 0;
  const topPaying = [...paidJobs].sort((a, b) => {
    const aMax = salaryRange(a)?.max ?? 0;
    const bMax = salaryRange(b)?.max ?? 0;
    return bMax - aMax;
  }).slice(0, 5);

  const publishedRanges = paidJobs.map((job) => salaryRange(job)!);
  const lowest = hasPay ? Math.min(...publishedRanges.map((r) => r.min)) : 0;
  const highest = hasPay ? Math.max(...publishedRanges.map((r) => r.max)) : 0;

  // FAQ Schema for this page
  const faqItems = [
    {
      question: `What is the average ${tag} engineer salary in 2026?`,
      answer: hasPay
        ? `Based on ${paidJobs.length} listings with published pay, the average ${tag} engineer salary ranges from ${formatSalary(avgMin, avgMax)} per year.`
        : `Most ${tag} listings on the board do not publish a salary range. Browse open roles for the latest offers.`
    },
    {
      question: `How much do senior ${tag} engineers make?`,
      answer: `Pay depends on the employer, location, and responsibilities. The ranges on this page combine seniority levels; check individual senior ${tag} listings for employer-published compensation.`
    },
    {
      question: `What's the salary range for ${tag} roles?`,
      answer: hasPay
        ? `The salary range for ${tag} positions spans from $${Math.round(lowest / 1000)}k to $${Math.round(highest / 1000)}k, depending on experience level, location, and company stage.`
        : `${tagJobs.length} ${tag} roles are listed. Compensation is shown only when the employer published a range.`
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

  const aggregateSchema = hasPay
    ? {
        '@context': 'https://schema.org',
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: lowest,
        highPrice: highest,
        offerCount: paidJobs.length,
        url: `https://www.artificialjobs.dev/salary/${skill}`,
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
          <Breadcrumb current={`${tag} salary`} />
          <PageHeading
            title={`${tag} Engineer Salary Guide`}
            lead={
              hasPay
                ? `Based on ${paidJobs.length} listings with published pay · ${tagJobs.length} open roles`
                : `${tagJobs.length} open roles · most listings do not publish pay`
            }
          />

          {hasPay && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Average range" value={formatSalary(avgMin, avgMax)} />
              <Stat label="Lowest offered" value={`$${Math.round(lowest / 1000)}k`} />
              <Stat label="Highest offered" value={`$${Math.round(highest / 1000)}k`} />
            </div>
          )}

          {topPaying.length > 0 && (
          <section className="mt-14">
            <SectionLabel>Top-paying {tag} roles right now</SectionLabel>
            <JobList jobs={topPaying} indexOf={(job) => jobs.indexOf(job)} />
          </section>
          )}

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
