import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Consistent centred column used by every page. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', className)}>{children}</div>;
}

export function Breadcrumb({
  current,
  segments,
}: {
  current: string;
  segments?: { label: string; href: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Jobs
      </Link>
      {segments?.map((seg) => (
        <span key={seg.href} className="flex items-center gap-2">
          <span aria-hidden className="text-border">
            /
          </span>
          <Link href={seg.href} className="transition-colors hover:text-foreground">
            {seg.label}
          </Link>
        </span>
      ))}
      <span aria-hidden className="text-border">
        /
      </span>
      <span className="truncate text-foreground">{current}</span>
    </nav>
  );
}

/** Page title + supporting copy, shared by all pSEO templates. */
export function PageHeading({
  title,
  lead,
  meta,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lead && <p className="mt-3 text-lg text-muted-foreground">{lead}</p>}
      {meta && <p className="mt-2 text-sm text-muted-foreground">{meta}</p>}
    </div>
  );
}

/** Small caps label that introduces a list or section; an h2 so AI crawlers get a real outline. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </h2>
  );
}
