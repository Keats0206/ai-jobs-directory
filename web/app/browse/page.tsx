import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { getCollections, jobMarkets } from '@/lib/job-collections';
import { NewsletterSignup } from '@/components/newsletter-signup';

const description = 'Browse AI engineering jobs by skill and location, using recently verified employer listings. Find remote, San Francisco, New York, London, and Bengaluru roles.';
export const metadata: Metadata = { title: 'Browse AI Jobs by Skill & Location', description, alternates: { canonical: '/browse' }, openGraph: { title: 'Browse AI Jobs', description, url: '/browse' } };

export default function BrowsePage() {
  const collections = getCollections();
  return <><SiteHeader /><main className="flex-1"><Container className="py-12"><Breadcrumb current="Browse jobs" /><PageHeading title="Find the work you want to do." lead="AI engineering roles, organized by the skills you use and the places you can work." />
    <p className="mb-10 text-sm leading-relaxed text-muted-foreground">Each collection needs at least five listings from two employers, checked against their public hiring feeds within the past 14 days. Counts reflect this verified subset of the board. Remote roles may still have country or time-zone restrictions; check each employer’s application page.</p>
    {jobMarkets.map(market => <section key={market.slug} className="mb-10"><h2 className="mb-4 text-xl font-semibold">{market.label}</h2><div className="grid gap-3 sm:grid-cols-2">{collections.filter(item => item.market.slug === market.slug).map(item => <Link key={item.skill} href={`/browse/${item.skill}/${market.slug}`} className="rounded-xl border border-border p-4 transition-colors hover:border-brand"><h3 className="font-medium">{item.tag} jobs</h3><p className="mt-1 text-sm text-muted-foreground">{item.jobs.length} roles · {item.companies.length} employers</p></Link>)}</div>{!collections.some(item => item.market.slug === market.slug) && <p className="text-sm text-muted-foreground">More verified listings are needed before publishing collections here.</p>}</section>)}
    <NewsletterSignup /><p className="mt-8 text-sm text-muted-foreground">Learn <Link className="underline" href="/sources">how listings are sourced</Link> or see our <Link className="underline" href="/stats">public traffic stats</Link>.</p>
  </Container></main><SiteFooter /></>;
}
