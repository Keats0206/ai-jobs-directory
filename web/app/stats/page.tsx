import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { publicStats as stats, formatDate } from '@/lib/public-stats';

const description = 'Public traffic and search performance for Artificial Jobs. Dated reports, daily visitors, referral sources, and transparent measurement notes.';
export const metadata: Metadata = {
  title: 'Public Stats — Traffic & Search Performance', description,
  alternates: { canonical: '/stats' },
  openGraph: { title: 'Artificial Jobs, in public', description, url: '/stats' },
};

const number = (value: number) => value.toLocaleString('en-US');

export default function StatsPage() {
  const maxVisitors = Math.max(1, ...stats.daily.map(day => day.visitors));
  const search = stats.searchConsole;
  const period = `${formatDate(stats.period.since)} – ${formatDate(stats.period.until)}`;
  return <>
    <SiteHeader />
    <main className="flex-1">
      <Container className="py-12">
        <Breadcrumb current="Public stats" />
        <PageHeading title="Built in public. Measured in public." lead="A small site, with real numbers. Here’s how people are finding Artificial Jobs." meta={`Reporting period: ${period} · UTC`} />
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Visitors" value={number(stats.totals.visitors)} note="Reported by Vercel Web Analytics" />
          <Metric label="Pageviews" value={number(stats.totals.pageviews)} note="All recorded views, including unusual spikes" />
          <Metric label="Google Search impressions" value={search ? number(search.impressions) : 'Not published'} note={search ? `${formatDate(search.since)} – ${formatDate(search.until)}` : 'Awaiting a dated Search Console report'} />
          <Metric label="Google Search clicks" value={search ? number(search.clicks) : 'Not published'} note={search ? search.source : 'Separate from visits attributed to Google'} />
        </div>

        <section className="mt-12" aria-labelledby="daily-traffic">
          <h2 id="daily-traffic" className="text-xl font-semibold">Daily visitors</h2>
          <p className="mt-2 text-sm text-muted-foreground">Each bar is one day. Daily visitor counts should not be added to calculate unique people across the reporting period.</p>
          <div className="mt-6 flex h-40 items-end gap-1 border-b border-border" role="img" aria-label={`Daily visitors from ${period}. Highest daily count: ${maxVisitors}. Exact values in the table below.`}>
            {stats.daily.map(day => <div key={day.timestamp} className="group relative flex h-full min-w-0 flex-1 items-end">
              <div title={`${formatDate(day.timestamp)}: ${day.visitors} visitors`} className="w-full rounded-t-sm bg-brand/80 transition-colors hover:bg-brand" style={{ height: `${Math.max(2, day.visitors / maxVisitors * 100)}%` }} />
            </div>)}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{formatDate(stats.period.since)}</span><span>{formatDate(stats.period.until)}</span></div>
          <details className="mt-5 rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium">View daily data</summary>
            <table className="mt-4 w-full text-left text-sm"><caption className="sr-only">Daily traffic, UTC</caption><thead><tr><th scope="col" className="py-2">Date</th><th scope="col" className="text-right">Visitors</th><th scope="col" className="text-right">Pageviews</th></tr></thead>
              <tbody>{stats.daily.map(day => <tr key={day.timestamp} className="border-t border-border/60"><th scope="row" className="py-2 font-normal">{formatDate(day.timestamp)}</th><td className="text-right tabular-nums">{number(day.visitors)}</td><td className="text-right tabular-nums">{number(day.pageviews)}</td></tr>)}</tbody>
            </table>
          </details>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">Where visitors come from</h2>
          <table className="mt-4 w-full text-left text-sm"><caption className="sr-only">Referral sources for {period}</caption><thead><tr><th scope="col" className="py-3">Referrer</th><th scope="col" className="text-right">Visitors</th><th scope="col" className="text-right">Pageviews</th></tr></thead>
            <tbody>{stats.referrers.map(row => <tr key={row.referrerHostname} className="border-t border-border"><th scope="row" className="py-3 font-normal">{row.referrerHostname || 'Direct / unknown'}</th><td className="text-right tabular-nums">{number(row.visitors)}</td><td className="text-right tabular-nums">{number(row.pageviews)}</td></tr>)}</tbody>
          </table>
        </section>

        <section className="mt-12 space-y-4 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">How to read these numbers</h2>
          <p>Traffic comes from Vercel Web Analytics for the production site. This is a dated snapshot, updated {formatDate(stats.updatedAt)}, rather than a live visitor counter. Browser privacy settings, blockers, repeat visits, and automated activity can affect measurement. “Visitors” is the analytics provider’s metric, not a verified count of individual humans.</p>
          <p>Direct / unknown means no referring website was recorded. One visitor may appear under multiple referrers, so the referral rows do not add up to the overall visitor total. Google referrals can also differ from Search Console clicks because the two products measure different events.</p>
          <p>September 12, 2026 recorded 2,667 pageviews from 19 visitors. That unusual spike remains in the totals; its cause has not been verified. The daily chart uses visitors so that pageview spike does not dominate the picture.</p>
          <p>Search impressions count appearances in Google results, not visits to this site. We publish those only with a confirmed reporting period. Revenue and subscriber totals are not included without a verified data source.</p>
          <div className="flex flex-wrap gap-5 text-foreground underline underline-offset-4"><a href="/api/public-stats">Download public data (JSON)</a><Link href="/sources">Our job sources</Link><Link href="/browse">Browse jobs by skill</Link><Link href="/">Explore the board</Link></div>
        </section>
      </Container>
    </main>
    <SiteFooter />
  </>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-xl border border-border p-5"><h2 className="text-sm text-muted-foreground">{label}</h2><p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p></div>;
}
