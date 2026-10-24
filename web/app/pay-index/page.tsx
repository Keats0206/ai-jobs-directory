import type { Metadata } from 'next';
import { getEditions, editionLabel, editionPath } from '@/lib/pay-index';
import { REFERRAL_DISCLOSURE } from '@/lib/training-jobs';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { DisclosureBar } from '@/components/training-ui';
import { PayIndexEditionView } from '@/components/pay-index-edition';

// The hub always shows the latest edition; its canonical is that edition's permanent URL,
// so citations and ranking signals collect on one page per month.
const latest = getEditions()[0];

export const metadata: Metadata = {
  title: `micro1 Pay Index: AI Trainer Pay by Field (${editionLabel(latest.edition)})`,
  description: `Monthly index of what micro1 pays AI trainers by field, from every open listing. Latest median: $${latest.overall.median_low}–$${latest.overall.median_high}/hr. Free under CC BY 4.0.`,
  alternates: { canonical: editionPath(latest.edition) },
};

export default function PayIndexHub() {
  return (
    <>
      <SiteHeader />
      <DisclosureBar>{REFERRAL_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <PayIndexEditionView edition={latest} editions={getEditions()} />
      </main>
      <SiteFooter />
    </>
  );
}
