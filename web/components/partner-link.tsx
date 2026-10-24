'use client';

import { track } from '@vercel/analytics';

/** Outbound referral link to a micro1 data partnership, counted as a partner_click. */
export function PartnerLink({ href, program, placement, className, children }: {
  href: string;
  program: string;
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => track('partner_click', { program, placement })}
      className={className}
    >
      {children}
    </a>
  );
}
