'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
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
        <h3 className="text-lg font-semibold">You're in! 🎉</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Weekly AI job digest coming your way. Check your inbox!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold">Get weekly AI job alerts</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        The best AI, LLM, and ML roles delivered to your inbox every Monday. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
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
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Powered by Resend · {1133}+ subscribers and growing
      </p>
    </div>
  );
}