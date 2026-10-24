'use client';

import { useState } from 'react';

/** A copy button for a citation or other block of text shown alongside it. */
export function CopyText({ text, label = 'Copy citation' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button type="button" onClick={copy} className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-card">
      {copied ? 'Copied' : label}
    </button>
  );
}
