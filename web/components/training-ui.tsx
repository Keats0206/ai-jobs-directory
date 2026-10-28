import Link from 'next/link';
import type { Job } from '@/lib/jobs';
import { formatPay, type TrainingField } from '@/lib/training-jobs';
import ApplyButton from '@/app/components/ApplyButton';

/** NerdWallet-style disclosure that sits above the fold on every money page. */
export function DisclosureBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border bg-card/60">
      <p className="w-full px-5 py-2 text-xs text-muted-foreground sm:px-8 lg:px-12">
        <span className="font-medium text-foreground">Disclosure:</span> {children}
      </p>
    </div>
  );
}

/** Headline in the Cursor pattern: a dark statement, then a muted continuation. */
export function Headline({ lead, rest, as: Tag = 'h1' }: { lead: React.ReactNode; rest?: React.ReactNode; as?: 'h1' | 'h2' }) {
  return (
    <Tag className={`font-heading max-w-4xl font-medium tracking-[-0.03em] text-balance ${Tag === 'h1' ? 'text-4xl leading-[1.05] sm:text-6xl' : 'text-3xl leading-tight sm:text-4xl'}`}>
      {lead}
      {rest && <span className="text-muted-foreground"> {rest}</span>}
    </Tag>
  );
}

export function StatRow({ stats }: { stats: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
      {stats.map(([value, label], i) => (
        <div key={label} className={`flex flex-col-reverse px-1 py-5 sm:px-6 ${i % 2 ? 'border-l border-border' : ''} ${i >= 1 ? 'sm:border-l sm:border-border' : ''} ${i >= 2 ? 'border-t border-border sm:border-t-0' : ''}`}>
          <dt className="mt-1 text-sm text-muted-foreground">{label}</dt>
          <dd className="font-heading text-3xl font-medium tabular-nums tracking-tight">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Square-ish tile in the Cursor logo-wall style: the way into a profession page. */
export function FieldTile({ field }: { field: TrainingField }) {
  return (
    <Link href={`/ai-training-jobs/${field.slug}`} className="tile flex min-h-28 flex-col justify-between rounded-md p-4">
      <span className="font-heading text-lg font-medium leading-tight tracking-tight">{field.label}</span>
      <span className="flex items-baseline justify-between gap-2 text-sm text-muted-foreground">
        <span className="tabular-nums">{field.jobs.length} {field.jobs.length === 1 ? 'role' : 'roles'}</span>
        {field.topRate > 0 && <span className="font-medium tabular-nums text-brand">to ${field.topRate}/hr</span>}
      </span>
    </Link>
  );
}

/** Pill links to the cross-field pages ("AI training jobs for PhDs"), credentials and coding languages in separate rows. */
export function CollectionLinks({ collections }: { collections: TrainingField[] }) {
  const rows: [string, TrainingField[]][] = [
    ['By credential:', collections.filter((c) => !c.group)],
    ['By language:', collections.filter((c) => c.group === 'language')],
  ];
  return rows.filter(([, list]) => list.length).map(([label, list]) => (
    <div key={label} className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
      <span className="mr-1 text-muted-foreground">{label}</span>
      {list.map((c) => (
        <Link key={c.slug} href={`/ai-training-jobs/${c.slug}`} className="rounded-full border border-border px-3 py-1 transition-colors hover:bg-card">
          {`For ${c.audience}`} <span className="tabular-nums text-muted-foreground">{c.jobs.length}</span>
        </Link>
      ))}
    </div>
  ));
}

/** One comparison row: what it is, what it pays, and a direct apply button. */
export function RoleRow({ job, rank, showField = true }: { job: Job; rank?: number; showField?: boolean }) {
  const pay = formatPay(job);
  const skills = (job.skills || []).slice(0, 3);
  return (
    <li className={`grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-b border-border py-5 ${rank !== undefined ? 'sm:grid-cols-[2.5rem_1fr_9rem_auto]' : 'sm:grid-cols-[1fr_9rem_auto]'}`}>
      {rank !== undefined && (
        <span className="hidden font-mono text-sm text-muted-foreground sm:block">{String(rank).padStart(2, '0')}</span>
      )}
      <div className="col-span-2 min-w-0 sm:col-span-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {showField && job.field_label && <span className="font-medium uppercase tracking-[0.08em]">{job.field_label}</span>}
          {job.high_demand && <span className="rounded-sm bg-accent px-1.5 py-0.5 font-medium text-accent-foreground">High demand</span>}
          {job.openings && job.openings > 1 ? <span>{job.openings} openings</span> : null}
        </div>
        <h3 className="font-heading mt-1 text-lg font-medium leading-snug tracking-tight">
          <Link href={`/jobs/${job.slug}`} className="hover:underline">{job.title}</Link>
        </h3>
        {skills.length > 0 && <p className="mt-0.5 truncate text-sm text-muted-foreground">{skills.join(' · ')}</p>}
      </div>
      <div>
        <p className="font-heading text-xl font-medium tabular-nums tracking-tight">{pay ?? '—'}</p>
        <p className="text-xs text-muted-foreground">{pay ? (job.hourly_max ? 'hourly pay' : 'annual pay') : 'pay on application'}</p>
      </div>
      <ApplyButton
        applyUrl={job.apply_url}
        field={job.field}
        placement="row"
        sponsored
        className="btn-money h-10 rounded-full px-5 text-sm font-medium"
      >
        Apply
      </ApplyButton>
    </li>
  );
}

export function RoleList({ jobs, ranked = false, showField = true }: { jobs: Job[]; ranked?: boolean; showField?: boolean }) {
  return (
    <ul className="border-t border-border">
      {jobs.map((job, i) => <RoleRow key={job.slug} job={job} rank={ranked ? i + 1 : undefined} showField={showField} />)}
    </ul>
  );
}
