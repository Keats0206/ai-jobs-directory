import Link from 'next/link';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors';

const styles = {
  default: 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
  active: 'border-foreground bg-foreground text-background',
  brand: 'border-transparent bg-brand-muted text-brand hover:brightness-95',
} as const;

/** Filter pill — interactive, toggles on click. */
export function ChipButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(base, 'cursor-pointer', active ? styles.active : styles.default)}
    >
      {children}
    </button>
  );
}

/** Navigational pill used for skill/location cross-links. */
export function ChipLink({
  href,
  variant = 'default',
  children,
}: {
  href: string;
  variant?: 'default' | 'brand';
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, styles[variant])}>
      {children}
    </Link>
  );
}

/** Non-interactive fact pill (location, job type, salary). */
export function Chip({
  variant = 'default',
  className,
  children,
}: {
  variant?: 'default' | 'brand';
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn(base, styles[variant], 'hover:brightness-100', className)}>{children}</span>;
}
