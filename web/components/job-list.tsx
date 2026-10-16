import Link from 'next/link';
import { Job, jobSlug, formatSalary, salaryRange } from '@/lib/jobs';
import { displayCompany, displayTitle } from '@/lib/job-quality';

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
  const range = salaryRange(job);
  const salary = range ? formatSalary(range.min, range.max) : null;
  const tags = job.tags?.slice(0, 3) ?? [];

  return (
    <Link
      href={`/jobs/${jobSlug(job, index)}`}
      className="group flex items-start justify-between gap-4 border-l-2 border-transparent py-4 pl-0 transition-[border-color,background-color,padding] hover:border-brand hover:bg-brand-muted/40 sm:rounded-r-lg sm:px-3 sm:-mx-3 sm:pl-3"
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-medium tracking-tight transition-colors group-hover:text-brand">
          {displayTitle(job)}
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {displayCompany(job)}
          {showLocation && job.location ? ` · ${job.location}` : ''}
          {job.is_remote ? (
            <span className="text-brand/80"> · Remote</span>
          ) : null}
        </p>
        {tags.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[11px] tracking-wide text-muted-foreground/80">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        )}
      </div>
      {salary && (
        <span className="shrink-0 pt-0.5 font-mono text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
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
