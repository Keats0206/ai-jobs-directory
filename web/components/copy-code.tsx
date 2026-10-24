'use client';

import { useState } from 'react';

/** A referral code with a copy button, for programs that take the code at application. */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card py-1 pl-4 pr-1">
      <span className="font-mono text-sm font-medium tracking-[0.12em]">{code}</span>
      <button type="button" onClick={copy} className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted" aria-label={`Copy referral code ${code}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
