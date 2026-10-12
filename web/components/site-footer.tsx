import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <p>
          <span className="font-medium text-foreground">artificialjobs.dev</span> — Live data on AI hiring.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
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
    </footer>
  );
}
