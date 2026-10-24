'use client';

import { track } from '@vercel/analytics';
import { cn } from '@/lib/utils';

interface ApplyButtonProps {
  applyUrl: string;
  /** Reported with the click so conversions can be split by profession. */
  field?: string;
  /** Where on the page the button sits, e.g. "row", "sidebar", "header". */
  placement: string;
  className?: string;
  children?: React.ReactNode;
  /** Referral links must be marked sponsored for search engines. */
  sponsored?: boolean;
}

export default function ApplyButton({
  applyUrl,
  field = 'unknown',
  placement,
  className,
  children = 'Apply now',
  sponsored = false,
}: ApplyButtonProps) {
  return (
    <a
      href={applyUrl}
      target="_blank"
      rel={sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
      onClick={() => track('apply_click', { field, placement })}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85',
        className
      )}
    >
      {children}
    </a>
  );
}
