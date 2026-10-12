import { newsletterClient, newsletterSecret, newsletterSegments, newsletterBaseUrl } from '@/lib/newsletter';
import { readSubscriptionToken } from '@/lib/newsletter-token';
export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 4096) return new Response('Request too large', { status: 413 });
    const form = await request.formData();
    const token = form.get('token');
    const subscription = typeof token === 'string' ? readSubscriptionToken(token, newsletterSecret()) : null;
    if (!subscription) return Response.redirect(`${newsletterBaseUrl}/newsletter?status=expired`, 303);
    const resend = newsletterClient();
    const segments = await newsletterSegments(resend);
    const selected = [{ id: segments.jobs }];
    const existing = await resend.contacts.get({ email: subscription.email });
    if (existing.error && existing.error.name !== 'not_found') throw new Error(existing.error.name);
    if (existing.data) {
      const updated = await resend.contacts.update({ id: existing.data.id, unsubscribed: false });
      if (updated.error) throw new Error(updated.error.name);
      for (const segment of selected) {
        const added = await resend.contacts.segments.add({ contactId: existing.data.id, segmentId: segment.id });
        if (added.error) throw new Error(added.error.name);
      }
    } else {
      const created = await resend.contacts.create({ email: subscription.email, unsubscribed: false, segments: selected });
      if (created.error) throw new Error(created.error.name);
    }
    return Response.redirect(`${newsletterBaseUrl}/newsletter?status=confirmed`, 303);
  } catch (error) {
    console.error('Newsletter contact persistence failed:', error instanceof Error ? error.message : 'provider error');
    return Response.redirect(`${newsletterBaseUrl}/newsletter?status=unavailable`, 303);
  }
}
