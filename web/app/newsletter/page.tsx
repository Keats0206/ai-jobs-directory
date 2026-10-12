import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, PageHeading } from '@/components/page-shell';
import { NewsletterSignup } from '@/components/newsletter-signup';
export const metadata: Metadata = { title: 'Weekly AI Jobs Newsletter', description: 'Get a weekly selection of AI engineering jobs from employer hiring feeds. Confirm your email to subscribe and unsubscribe at any time.', alternates: { canonical: '/newsletter' } };
export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const messages: Record<string, string> = { confirmed: 'Your subscription is confirmed. You can unsubscribe from any digest.', expired: 'That confirmation link is invalid or expired. Sign up below to request a new one.', unavailable: 'We could not save your subscription. Please retry your confirmation link later.' };
  return <><SiteHeader /><main className="flex-1"><Container className="py-16"><PageHeading title="Your next role, in your inbox." lead="A weekly selection of AI engineering jobs from employer hiring feeds." />{status && messages[status] && <p role="status" className="mb-8 rounded-xl border border-border p-5 text-sm">{messages[status]}</p>}{status !== 'confirmed' && <NewsletterSignup />}</Container></main><SiteFooter /></>;
}
