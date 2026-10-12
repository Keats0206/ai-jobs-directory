'use client';

import { useId, useState } from 'react';
import { track } from '@vercel/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const id = useId();
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent, website }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        track('newsletter_confirmation_requested');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold">Check your inbox</h3>
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          Confirm your email to join the weekly AI jobs digest.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold">Get weekly AI job alerts</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        AI, LLM, and ML roles from employer hiring feeds. One weekly digest; unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor={id} className="sr-only">Email address</label>
        <div className="flex gap-2">
        <Input
          id={id}
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          className="h-9 flex-1"
        />
        <Button type="submit" size="sm" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </Button>
        </div>
        <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5" />I agree to receive the weekly AI jobs digest.</label>
        <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Email confirmation required. We use Resend to manage subscriptions.
      </p>
    </div>
  );
}
