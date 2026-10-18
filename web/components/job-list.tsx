import Link from 'next/link';
import type { Job } from '@/lib/jobs';
import { jobSlug, formatSalary, timeAgo } from '@/lib/job-utils';
import { salaryRange } from '@/lib/job-quality';
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
  const posted = timeAgo(job.date_posted || job.first_seen);
  const seniority = job.facts?.seniority && job.facts.seniority !== 'unknown' ? job.facts.seniority : null;
  const stack = (job.facts?.stack ?? []).slice(0, 3);

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
        {(job.is_remote || seniority || stack.length > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {job.is_remote && <span className="rounded bg-brand-muted px-1.5 py-0.5 font-medium text-brand">Remote</span>}
            {seniority && <span className="rounded bg-muted px-1.5 py-0.5 capitalize">{seniority}</span>}
            {stack.map((item) => (
              <span key={item} className="rounded bg-muted px-1.5 py-0.5">{item}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
        {salary && (
          <span className="font-mono text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">{salary}</span>
        )}
        {posted && <span suppressHydrationWarning className="text-xs text-muted-foreground">{posted}</span>}
      </div>
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
