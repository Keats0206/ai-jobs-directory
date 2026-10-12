import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection, getCollections } from '@/lib/job-collections';
import { jobs, jobSlug } from '@/lib/jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, Breadcrumb, PageHeading } from '@/components/page-shell';
import { JobList } from '@/components/job-list';
import { NewsletterSignup } from '@/components/newsletter-signup';

type Props = { params: Promise<{ skill: string; market: string }> };
export const revalidate = 86400;
export function generateStaticParams() { return getCollections().map(item => ({ skill: item.skill, market: item.market.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skill, market } = await params;
  const collection = getCollection(skill, market);
  if (!collection) return { title: 'Collection unavailable', robots: { index: false } };
  const title = `${collection.jobs.length} ${collection.tag} Jobs — ${collection.market.label}`;
  const description = `${collection.tag} roles at ${collection.companies.slice(0, 3).join(', ')} and other employers. Browse source-verified ${collection.market.label} jobs and apply directly.`;
  return { title, description, alternates: { canonical: `/browse/${skill}/${market}` }, openGraph: { title, description, url: `/browse/${skill}/${market}` } };
}
export default async function CollectionPage({ params }: Props) {
  const { skill, market } = await params;
  const collection = getCollection(skill, market);
  if (!collection) notFound();
  const related = getCollections().filter(item => (item.skill === skill || item.market.slug === market) && item !== collection && !(item.skill === skill && item.market.slug === market)).slice(0, 8);
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${collection.tag} jobs in ${collection.market.label}`, url: `https://www.artificialjobs.dev/browse/${skill}/${market}`, mainEntity: { '@type': 'ItemList', numberOfItems: collection.jobs.length, itemListElement: collection.jobs.map((job, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://www.artificialjobs.dev/jobs/${jobSlug(job, jobs.indexOf(job))}`, name: `${job.title} at ${job.company}` })) } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><SiteHeader /><main className="flex-1"><Container className="py-12"><Breadcrumb segments={[{ label: 'Browse', href: '/browse' }]} current={`${collection.tag} · ${collection.market.label}`} /><PageHeading title={`${collection.tag} jobs · ${collection.market.label}`} lead={`${collection.jobs.length} roles across ${collection.companies.length} employers. Checked against employer hiring feeds within the past 14 days.`} />
    <section className="mb-8 text-sm leading-relaxed text-muted-foreground"><h2 className="mb-3 text-lg font-semibold text-foreground">Who is hiring?</h2><p>{collection.companies.slice(0, 8).join(', ')}{collection.companies.length > 8 ? ` and ${collection.companies.length - 8} other employers` : ''} list roles mentioning {collection.tag}. Skill tags are matched to the source description; read the full requirements to understand how central a skill is to each role.</p><p className="mt-3">{market === 'remote' ? 'Remote describes a working arrangement, not worldwide eligibility. Review country, time-zone, and work-authorization requirements before applying.' : `These roles name ${collection.market.label} in the employer’s location field. Some employers list multiple offices or hybrid arrangements; the original posting is the source of truth.`}</p></section>
    <section><h2 className="mb-4 text-lg font-semibold">Available roles</h2><JobList jobs={collection.jobs} indexOf={job => jobs.indexOf(job)} /></section>
    <section className="mt-12 rounded-xl bg-muted/50 p-6"><NewsletterSignup /></section>
    <section className="mt-10"><h2 className="text-lg font-semibold">Related searches</h2><div className="mt-4 flex flex-wrap gap-3">{related.map(item => <Link className="rounded-lg border border-border px-3 py-2 text-sm hover:border-brand" key={`${item.skill}/${item.market.slug}`} href={`/browse/${item.skill}/${item.market.slug}`}>{item.tag} · {item.market.label}</Link>)}</div></section>
    <p className="mt-8 text-sm text-muted-foreground">These counts cover recently verified listings, not every job in the market. <Link href="/sources" className="underline">Read our sourcing policy</Link> and <Link href="/browse" className="underline">browse all collections</Link>.</p>
  </Container></main><SiteFooter /></>;
}
