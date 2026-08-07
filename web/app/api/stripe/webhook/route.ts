import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendAdminNotification, sendPurchaseEmail, type PurchaseType } from '@/lib/email';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // The raw body is required — parsing it first would invalidate the signature.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_email ?? session.customer_details?.email;
  const metadata = session.metadata ?? {};
  const type: PurchaseType = metadata.type === 'featured' ? 'featured' : 'post';
  const company = metadata.company ?? undefined;
  const jobTitle = metadata.jobTitle && metadata.jobTitle !== 'N/A' ? metadata.jobTitle : undefined;

  if (!email) {
    // Nothing to confirm to, but the payment is real — don't ask Stripe to retry.
    console.error('checkout.session.completed with no customer email:', session.id);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  await sendAdminNotification({
    email,
    type,
    company,
    jobTitle,
    amountTotal: session.amount_total,
    sessionId: session.id,
  });

  try {
    await sendPurchaseEmail({ email, type, company, jobTitle });
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want for a transient Resend
    // outage — the admin notification above already recorded the sale.
    console.error('Purchase confirmation email failed:', err);
    return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
