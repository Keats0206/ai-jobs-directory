'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PostJobForm({ compact }: { compact?: boolean }) {
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
    <form onSubmit={submit} className={compact ? undefined : 'mt-8'}>
      <div className={compact ? 'grid gap-3 sm:grid-cols-3' : 'grid gap-4'}>
        <Input
          required
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={set('email')}
          className={compact ? 'h-9' : undefined}
        />
        <Input
          required
          placeholder="Company"
          value={form.company}
          onChange={set('company')}
          className={compact ? 'h-9' : undefined}
        />
        <Input
          placeholder="Job title"
          value={form.jobTitle}
          onChange={set('jobTitle')}
          className={compact ? 'h-9' : undefined}
        />
      </div>
      <div className={`flex items-center gap-3 ${compact ? 'mt-3' : 'mt-6'}`}>
        <Button type="submit" size={compact ? 'sm' : 'default'} disabled={loading}>
          {loading ? 'Redirecting…' : 'Continue to payment — $99'}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </form>
  );
}
