import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEdition, getEditions, editionLabel, editionPath } from '@/lib/pay-index';
import { REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { DisclosureBar } from '@/components/training-ui';
import { PayIndexEditionView } from '@/components/pay-index-edition';

export const dynamicParams = false;

export function generateStaticParams() {
  return getEditions().map((e) => ({ edition: e.edition }));
}

export async function generateMetadata({ params }: { params: Promise<{ edition: string }> }): Promise<Metadata> {
  const e = getEdition((await params).edition);
  if (!e) return { title: 'Not Found' };
  const title = `micro1 Pay Index, ${editionLabel(e.edition)}: AI Trainer Pay by Field`;
  const description = `Median micro1 AI training pay is $${e.overall.median_low}–$${e.overall.median_high}/hr across ${e.overall.hourly_roles} open hourly roles. Pay by field, methodology, CSV and citation. Free under CC BY 4.0.`;
  return {
    title,
    description,
    alternates: { canonical: editionPath(e.edition) },
    openGraph: { type: 'article', title, description, publishedTime: e.published },
  };
}

export default async function PayIndexEditionPage({ params }: { params: Promise<{ edition: string }> }) {
  const e = getEdition((await params).edition);
  if (!e) notFound();
  return (
    <>
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <PayIndexEditionView edition={e} editions={getEditions()} />
      </main>
      <SiteFooter />
    </>
  );
}
