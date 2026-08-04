import Link from 'next/link';
import { Job, jobSlug, formatSalary } from '@/lib/jobs';

/**
 * One row per job, used on the homepage and every pSEO listing page.
 * Hairline dividers instead of bordered cards keep long lists calm.
 */
export function JobRow({
  job,
  index,
  showLocation = true,
}: {
  job: Job;
  index: number;
  showLocation?: boolean;
}) {
  const salary = formatSalary(job.salary_min, job.salary_max);
  const hasSalary = job.salary_min > 0 || job.salary_max > 0;

  return (
    <Link
      href={`/jobs/${jobSlug(job, index)}`}
      className="group flex items-center justify-between gap-4 rounded-lg py-4 transition-colors hover:bg-muted/50 sm:px-3 sm:-mx-3"
    >
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-medium transition-colors group-hover:text-brand">
          {job.title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {job.company}
          {showLocation && job.location ? ` · ${job.location}` : ''}
        </p>
      </div>
      {hasSalary && (
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
          {salary}
        </span>
      )}
    </Link>
  );
}

export function JobList({
  jobs: list,
  indexOf,
  showLocation = true,
}: {
  jobs: Job[];
  indexOf: (job: Job) => number;
  showLocation?: boolean;
}) {
  if (list.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No roles match those filters yet.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {list.map((job) => {
        const idx = indexOf(job);
        return <JobRow key={idx} job={job} index={idx} showLocation={showLocation} />;
      })}
    </div>
  );
}
