'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Replaces the previous chain of window.prompt() calls with an inline form.
 * Sends the same payload the /api/checkout route expects.
 */
export function PostJobDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', company: '', jobTitle: '' });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', ...form }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error ?? 'Checkout is not available right now.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="rounded-full px-3.5 text-xs"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Post a job — $99
      </Button>

      {open && (
        <div className="absolute inset-x-0 top-14 border-b border-border/60 bg-background/95 backdrop-blur-md">
          <form onSubmit={submit} className="mx-auto max-w-3xl px-5 py-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                required
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                className="h-9"
              />
              <Input
                required
                placeholder="Company"
                value={form.company}
                onChange={set('company')}
                className="h-9"
              />
              <Input
                placeholder="Job title"
                value={form.jobTitle}
                onChange={set('jobTitle')}
                className="h-9"
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? 'Redirecting…' : 'Continue to payment'}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
