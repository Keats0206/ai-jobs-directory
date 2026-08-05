'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PostJobForm({ compact }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listingType, setListingType] = useState<'standard' | 'featured'>('standard');
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
        body: JSON.stringify({ type: 'post', featured: listingType === 'featured', ...form }),
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

  const buttonText = listingType === 'featured' ? 'Continue to payment — $199/mo' : 'Continue to payment — $99';

  if (compact) {
    return (
      <form onSubmit={submit}>
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
        <div className="flex items-center gap-3 mt-3">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? 'Redirecting…' : buttonText}
          </Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8">
      {/* Listing type selector */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Choose your listing type:</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {['standard', 'featured'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setListingType(type as 'standard' | 'featured')}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                listingType === type
                  ? 'border-brand bg-brand/5'
                  : 'border-border hover:border-border/70'
              }`}
            >
              <div className="font-medium capitalize">{type} Listing</div>
              <div className="text-xs text-muted-foreground mt-1">
                {type === 'standard' ? '$99 one-time' : '$199/month'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <Input
            required
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={set('email')}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Company</label>
          <Input
            required
            placeholder="Your company name"
            value={form.company}
            onChange={set('company')}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Job Title</label>
          <Input
            required
            placeholder="e.g., Senior LLM Engineer"
            value={form.jobTitle}
            onChange={set('jobTitle')}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? 'Redirecting…' : buttonText}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </form>
  );
}
