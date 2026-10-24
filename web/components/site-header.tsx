import Link from 'next/link';

const NAV = [
  { href: '/#fields', label: 'Fields' },
  { href: '/#top-roles', label: 'Top paying' },
  { href: '/sell-company-data', label: 'Sell company data' },
  { href: '/blog', label: 'Guides' },
];

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="flex h-14 w-full items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="font-heading shrink-0 text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            Artificial<span className="text-brand"> Jobs</span>
          </Link>
          <nav className="hidden items-center gap-5 sm:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {action ? (
          <div className="shrink-0">{action}</div>
        ) : (
          <Link href="/sell-company-data" className="shrink-0 text-sm font-semibold text-brand sm:hidden">
            Sell data &rarr;
          </Link>
        )}
      </div>
    </header>
  );
}
