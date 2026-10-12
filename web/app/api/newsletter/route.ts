import { createHash } from 'node:crypto';
import { newsletterClient, newsletterSecret, newsletterBaseUrl, newsletterFrom } from '@/lib/newsletter';
import { createSubscriptionToken, validEmail } from '@/lib/newsletter-token';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 4096) return Response.json({ error: 'Request too large' }, { status: 413 });
  let body;
  try {
    const text = await request.text();
    if (text.length > 4096) return Response.json({ error: 'Request too large' }, { status: 413 });
    body = JSON.parse(text);
  } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
  if (body?.website) return Response.json({ success: true });
  if (!validEmail(body?.email) || body?.consent !== true) {
    return Response.json({ error: 'Enter a valid email and agree to receive the digest.' }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  try {
    const token = createSubscriptionToken(email, newsletterSecret());
    const url = `${newsletterBaseUrl}/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const result = await newsletterClient().emails.send({
      from: newsletterFrom(), to: email, subject: 'Confirm your Artificial Jobs subscription',
      html: `<h1>One more step</h1><p>Confirm that you want the weekly AI jobs digest.</p><p><a href="${url}">Confirm my subscription</a></p><p>This link expires within 48 hours. If you didn’t request this, ignore this email. You won’t be added to the mailing list.</p>`,
      text: `Confirm your Artificial Jobs subscription: ${url}\nIf you did not request this, ignore this email.`,
    }, { idempotencyKey: `newsletter-confirm-${createHash('sha256').update(token).digest('hex')}` });
    if (result.error) throw new Error(result.error.name);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter confirmation unavailable:', error instanceof Error ? error.message : 'provider error');
    return Response.json({ error: 'Email signup is temporarily unavailable. Please try again later.' }, { status: 503 });
  }
}
