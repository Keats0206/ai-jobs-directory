import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-heading font-medium text-foreground">artificialjobs.dev</span>
          <span className="mx-1.5 text-border">·</span>
          Live data on AI hiring
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
          <Link href="/stats" className="transition-colors hover:text-foreground">Stats</Link>
          <Link href="/sources" className="transition-colors hover:text-foreground">Sources</Link>
          <Link href="/browse" className="transition-colors hover:text-foreground">Browse</Link>
          <Link href="/" className="transition-colors hover:text-foreground">
            Jobs
          </Link>
          <a href="/llms.txt" className="transition-colors hover:text-foreground">
            llms.txt
          </a>
        </nav>
      </div>
      <div className="mx-auto flex max-w-3xl flex-col gap-2 border-t border-border/40 px-5 py-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Artificial Jobs</span>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://hot100ai.dev"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            AI Tools Directory
          </a>
          <a
            href="https://keatingholdings.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Keating Holdings
          </a>
        </div>
      </div>
    </footer>
  );
}
