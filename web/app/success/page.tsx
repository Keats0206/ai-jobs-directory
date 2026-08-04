'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

function BackHome() {
  return (
    <Link
      href="/"
      className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
    >
      Back to jobs
    </Link>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');

  if (!sessionId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t find that checkout session. If you were charged, contact support and
          we&apos;ll sort it out.
        </p>
        <BackHome />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        aria-hidden
        className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-muted text-xl text-brand"
      >
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Payment successful</h1>
      <p className="mt-3 text-muted-foreground">
        {type === 'featured'
          ? 'Your featured listing is now live. Check your email for details.'
          : 'Your job has been posted. Check your email for confirmation.'}
      </p>
      <BackHome />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <div className="w-full max-w-md">
          <Suspense
            fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}
          >
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
