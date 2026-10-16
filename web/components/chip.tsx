import Link from 'next/link';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors';

const styles = {
  default:
    'border-border bg-background/80 text-muted-foreground hover:border-foreground/25 hover:text-foreground',
  active: 'border-foreground/80 bg-foreground text-background',
  brand: 'border-transparent bg-brand-muted text-brand hover:brightness-95',
} as const;

/** Filter chip — interactive, toggles on click. */
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

/** Navigational chip used for skill/location cross-links. */
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

/** Non-interactive fact chip (location, job type, salary). */
export function Chip({
  variant = 'default',
  className,
  children,
}: {
  variant?: 'default' | 'brand';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn(base, styles[variant], 'hover:brightness-100', className)}>{children}</span>
  );
}
