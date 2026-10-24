'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { DATA_SOURCES, estimateDataValue, type DataSourceId } from '@/lib/data-deals';

/** Rough "what is my company's data worth" band. Anchored to reported deals; not a quote. */
export function DataValueEstimator({ onResultHref }: { onResultHref: string }) {
  const [headcount, setHeadcount] = useState(50);
  const [years, setYears] = useState(5);
  const [sources, setSources] = useState<DataSourceId[]>(['chat', 'email', 'docs']);
  const estimate = estimateDataValue({ headcount, years, sources });

  const toggle = (id: DataSourceId) => setSources((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));
  const field = 'mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-base tabular-nums';

  return (
    <div className="tile grid gap-8 rounded-md p-6 sm:p-8 lg:grid-cols-[3fr_2fr]">
      <form className="grid gap-6" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-muted-foreground">
            Peak headcount
            <input type="number" min={1} max={500000} inputMode="numeric" value={headcount} onChange={(e) => setHeadcount(Number(e.target.value))} className={field} />
          </label>
          <label className="text-sm text-muted-foreground">
            Years of records
            <input type="number" min={1} max={100} inputMode="numeric" value={years} onChange={(e) => setYears(Number(e.target.value))} className={field} />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm text-muted-foreground">What data do you still have?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DATA_SOURCES.map((source) => (
              <label key={source.id} className="flex items-start gap-3 rounded-md border border-border px-3 py-2.5 text-sm">
                <input type="checkbox" checked={sources.includes(source.id)} onChange={() => toggle(source.id)} className="mt-0.5" />
                {source.label}
              </label>
            ))}
          </div>
        </fieldset>
      </form>
      <div className="flex flex-col border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" aria-live="polite">
        <p className="text-sm text-muted-foreground">Rough value range</p>
        {estimate ? (
          <>
            <p className="font-heading mt-1 text-5xl font-medium tabular-nums tracking-tight text-brand">{estimate.band}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {estimate.personYears.toLocaleString('en-US')} person-years of records. {estimate.note}
            </p>
          </>
        ) : (
          <p className="mt-2 text-muted-foreground">
            Add peak headcount, years, and at least one of chat, tickets or code. Without a record of how work was done, buyers usually pass.
          </p>
        )}
        <a
          href={onResultHref}
          onClick={() => track('data_estimate', { band: estimate?.band ?? 'none', headcount, years, sources: sources.length })}
          className="btn-money mt-auto inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium max-lg:mt-6"
        >
          See which buyers fit
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          A rough guide, not an offer. Real prices depend on what a buyer approves after review.
        </p>
      </div>
    </div>
  );
}
