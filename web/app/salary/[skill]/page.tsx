import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { jobs, getAllTags, getJobsByTag, slugify, formatSalary } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading, SectionLabel } from '@/components/page-shell';
import { JobList } from '@/components/job-list';

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

  return (
    <>
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
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
