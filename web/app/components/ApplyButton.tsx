'use client';

import { cn } from '@/lib/utils';

interface ApplyButtonProps {
  jobId: string;
  company: string;
  applyUrl: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ApplyButton({
  jobId,
  company,
  applyUrl,
  className,
  children = 'Apply now',
}: ApplyButtonProps) {
  const handleClick = () => {
    try {
      const payload = JSON.stringify({ jobId, company, url: applyUrl });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/track-click', blob);
      } else {
        fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Click tracking error:', err);
    }
  };

  return (
    <a
      href={applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85',
        className
      )}
    >
      {children}
    </a>
  );
}
