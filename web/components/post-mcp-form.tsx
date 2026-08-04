'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PostMcpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    company: '',
    mcpName: '',
    mcpUrl: '',
    description: '',
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post-mcp', ...form }),
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
    <form onSubmit={submit} className="mt-8">
      <div className="grid gap-4">
        <Input
          required
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={set('email')}
        />
        <Input
          required
          placeholder="Publisher / company name"
          value={form.company}
          onChange={set('company')}
        />
        <Input
          required
          placeholder="MCP server name"
          value={form.mcpName}
          onChange={set('mcpName')}
        />
        <Input
          required
          type="url"
          placeholder="Repository or install URL"
          value={form.mcpUrl}
          onChange={set('mcpUrl')}
        />
        <textarea
          placeholder="Short description (optional)"
          value={form.description}
          onChange={set('description')}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Redirecting…' : 'Continue to payment — $199/mo'}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </form>
  );
}
