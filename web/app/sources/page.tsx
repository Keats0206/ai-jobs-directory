import type { Metadata } from 'next';
import Link from 'next/link';
import sources from '@/data/job-sources.json';
import healthData from '@/data/source-health.json';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { formatDate } from '@/lib/public-stats';

const description = 'See the employer hiring feeds behind Artificial Jobs, their last refresh status, and how we handle duplicates, closed roles, and source verification.';
export const metadata: Metadata = { title: 'Job Sources & Data Quality', description, alternates: { canonical: '/sources' }, openGraph: { title: 'Our job sources', description, url: '/sources' } };
type Health = { updatedAt: string | null; sources: { ats: string; slug: string; status: string; roles?: number; checkedAt: string }[] };
export default function SourcesPage() {
  const health = healthData as Health;
  return <><SiteHeader /><main className="flex-1"><Container className="py-12"><Breadcrumb current="Sources" /><PageHeading title="Straight from the hiring team." lead="Structured employer feeds are the foundation of our job collections." meta={health.updatedAt ? `Last refresh attempted: ${formatDate(health.updatedAt)}` : 'Feed refresh has not run yet'} />
    <section className="space-y-4 text-sm leading-relaxed text-muted-foreground"><h2 className="text-xl font-semibold text-foreground">How the board is maintained</h2><p>We import public job postings from employer boards on Ashby, Greenhouse, and Lever. Each verified record keeps its source, original application link, and last successful check. Exa discovery can suggest additional boards; discovery results are reviewed before joining this source list.</p><p>A successful feed refresh updates existing roles and adds new ones. Listings that disappear from a successfully fetched board are archived. Failed or unexpectedly empty feeds keep their existing records for review. We preserve listing URLs so refreshes do not send old links to unrelated jobs.</p><p>The wider board also contains legacy listings that have not been reverified. New <Link href="/browse" className="underline">skill and location collections</Link> only include source-verified listings checked within 14 days, with at least five roles from two employers per page. An employer’s original application page remains the final authority on availability and eligibility.</p></section>
    <section className="mt-10"><h2 className="text-xl font-semibold">Employer feeds</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th scope="col" className="py-3">Employer</th><th scope="col">Source</th><th scope="col" className="text-right">Last refresh</th></tr></thead><tbody>{sources.map(source => {
      const status = health.sources.find(item => item.ats === source.ats && item.slug === source.slug);
      const root = source.ats === 'ashby' ? 'https://jobs.ashbyhq.com/' : source.ats === 'lever' ? 'https://jobs.lever.co/' : 'https://job-boards.greenhouse.io/';
      return <tr key={`${source.ats}:${source.slug}`} className="border-t border-border"><th scope="row" className="py-3 pr-3 font-normal"><a className="hover:underline" href={`${root}${encodeURIComponent(source.slug)}`} target="_blank" rel="noreferrer">{source.company}</a></th><td className="pr-3 capitalize text-muted-foreground">{source.ats}</td><td className="text-right text-muted-foreground">{status?.status === 'ok' ? `${status.roles} roles checked` : status ? 'Needs review' : 'Not checked'}</td></tr>;
    })}</tbody></table></div></section>
    <section className="mt-10 space-y-3 text-sm leading-relaxed text-muted-foreground"><h2 className="text-xl font-semibold text-foreground">What we don’t infer</h2><p>Missing locations are not treated as remote. Pay is not invented when an employer omits it. A refresh date is not a posting date. Skill tags reflect terms in the source and are a starting point for browsing, not a guarantee about the day-to-day work.</p><p>Use the <a className="underline" href="/feed.xml">RSS feed</a> to follow verified roles, subscribe to the <Link className="underline" href="/newsletter">weekly digest</Link>, or see our <Link className="underline" href="/stats">public stats</Link>.</p></section>
  </Container></main><SiteFooter /></>;
}
