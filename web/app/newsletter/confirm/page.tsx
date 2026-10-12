import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading } from '@/components/page-shell';
export const metadata: Metadata = { title: 'Confirm your subscription', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <><SiteHeader /><main className="flex-1"><Container className="py-16"><PageHeading title="Confirm your subscription" lead="Get the weekly AI jobs digest. Unsubscribe from any email." />
    <form method="post" action="/api/newsletter/confirm"><input type="hidden" name="token" value={typeof token === 'string' ? token : ''} /><button className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground" type="submit">Confirm subscription</button></form>
  </Container></main><SiteFooter /></>;
}
