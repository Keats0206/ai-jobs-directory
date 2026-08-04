import Link from 'next/link';

export function SiteHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          artificial<span className="text-brand">jobs</span>
        </Link>
        {action}
      </div>
    </header>
  );
}
