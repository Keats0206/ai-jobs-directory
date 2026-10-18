import Link from 'next/link';

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-5">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href="/"
            className="font-heading shrink-0 text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            Artificial<span className="text-brand"> Jobs</span>
          </Link>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Primary">
            <Link
              href="/browse"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse
            </Link>
            <Link
              href="/stats"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Stats
            </Link>
            <Link
              href="/newsletter"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Newsletter
            </Link>
          </nav>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
