'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { COMPANY_STATUSES, type CompanyStatus } from '@/lib/valuation-lead';

/** "Get a valuation" lead capture. Emails the site owner; the micro1 application stays one click away. */
export function ValuationLeadForm({ source, applyHref }: { source: string; applyHref: string }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', status: 'operating' as CompanyStatus, headcount: '', notes: '', website: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/valuation-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent, source }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'The form is temporarily unavailable.');
      setStatus('success');
      track('valuation_lead', { status: form.status, source });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The form is temporarily unavailable.');
      setStatus('error');
    }
  };

  const field = 'mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-base';

  if (status === 'success') {
    return (
      <div className="tile rounded-md p-6 sm:p-8" role="status">
        <p className="font-heading text-2xl font-medium tracking-tight">Thanks. We’ll be in touch by email.</p>
        <p className="mt-3 max-w-prose text-muted-foreground">
          Want to move faster? You can start micro1’s application now. It asks for a short data manifest: what you have, roughly how much, and from when.
        </p>
        <a href={applyHref} target="_blank" rel="sponsored noopener noreferrer" onClick={() => track('partner_click', { program: 'enterprise', placement: 'lead_form_success' })} className="btn-money mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-medium">
          Start the micro1 application
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="tile grid gap-5 rounded-md p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-muted-foreground">Your name<input required maxLength={120} value={form.name} onChange={set('name')} autoComplete="name" className={field} /></label>
        <label className="text-sm text-muted-foreground">Work email<input required type="email" maxLength={254} value={form.email} onChange={set('email')} autoComplete="email" className={field} /></label>
        <label className="text-sm text-muted-foreground">Company<input required maxLength={160} value={form.company} onChange={set('company')} autoComplete="organization" className={field} /></label>
        <label className="text-sm text-muted-foreground">Peak headcount<input required type="number" min={1} max={500000} inputMode="numeric" value={form.headcount} onChange={set('headcount')} className={`${field} tabular-nums`} /></label>
      </div>
      <label className="text-sm text-muted-foreground">
        Where is the company at?
        <select value={form.status} onChange={set('status')} className={field}>
          {COMPANY_STATUSES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </label>
      <label className="text-sm text-muted-foreground">
        What data do you have? <span className="text-muted-foreground/70">(optional)</span>
        <textarea maxLength={2000} rows={3} value={form.notes} onChange={set('notes')} placeholder="e.g. 6 years of Slack, Zendesk tickets, a GitHub monorepo" className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-base" />
      </label>
      <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
      <label className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        I agree to be contacted by email about selling my company’s data.
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'loading'} className="btn-money inline-flex h-11 items-center rounded-full px-6 text-sm font-medium disabled:opacity-60">
          {status === 'loading' ? 'Sending…' : 'Get a valuation'}
        </button>
        {status === 'error' && (
          <p role="alert" className="text-sm text-destructive">
            {error} You can <a href={applyHref} target="_blank" rel="sponsored noopener noreferrer" className="underline">apply to micro1 directly</a>.
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Sent to Artificial Jobs, an independent referral site, not to micro1 or any buyer. We only use it to reply to you. If we refer you and a deal closes, micro1 pays us a referral fee.
      </p>
    </form>
  );
}
