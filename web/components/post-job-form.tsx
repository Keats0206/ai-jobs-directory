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
      const checkoutType = listingType === 'featured' ? 'featured' : 'post';
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: checkoutType, ...form }),
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
      {/* Listing type selector with pricing */}
      <div className="mb-8">
        <label className="text-sm font-medium mb-4 block">Choose your listing type:</label>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['standard', 'featured'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setListingType(type)}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                listingType === type
                  ? 'border-brand bg-brand/5 shadow-md'
                  : 'border-border hover:border-border/70 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold capitalize text-lg">{type} Listing</div>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    {type === 'standard' ? (
                      <>
                        <li>✓ Listed on job board</li>
                        <li>✓ Included in llms.txt</li>
                        <li>✓ Searchable by skill & location</li>
                      </>
                    ) : (
                      <>
                        <li>✓ Everything in Standard</li>
                        <li>✓ Pinned to top for 30 days</li>
                        <li>✓ Featured in email alerts</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {type === 'standard' ? '$99' : '$199'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {type === 'standard' ? 'one-time' : '/month'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4 mb-6">
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

      {/* Submit button and error message */}
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Redirecting to payment…' : buttonText}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  );
}
