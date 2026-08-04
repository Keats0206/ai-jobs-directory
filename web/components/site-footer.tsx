import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          <span className="font-medium text-foreground">artificialjobs.dev</span> — AI jobs, updated
          daily.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
          <Link href="/" className="transition-colors hover:text-foreground">
            All jobs
          </Link>
          <Link href="/agents" className="transition-colors hover:text-foreground">
            Agents
          </Link>
          <a href="/llms.txt" className="transition-colors hover:text-foreground">
            llms.txt
          </a>
        </nav>
      </div>
    </footer>
  );
}
