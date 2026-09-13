import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { recordAnalyticsEvent, recordPaidListing } from '@/lib/supabase-admin';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendConfirmationEmail(
  email: string,
  type: string,
  fields: { company?: string; jobTitle?: string; mcpName?: string },
) {
  if (!resend || !email) return;

  let subject = '';
  let html = '';

  if (type === 'post') {
    subject = `Your job posted — ${fields.jobTitle ?? 'New Role'}`;
    html = `<p>Your job <strong>${fields.jobTitle}</strong> at <strong>${fields.company}</strong> is queued for review on artificialjobs.dev.</p>`;
  } else if (type === 'post-mcp') {
    subject = `MCP listing active — ${fields.mcpName ?? 'New Server'}`;
    html = `<p>Your MCP server <strong>${fields.mcpName}</strong> from <strong>${fields.company}</strong> is subscribed. We'll feature it in the <a href="https://www.artificialjobs.dev/openclaw/mcps">MCP directory</a>.</p>`;
  } else if (type === 'featured') {
    subject = `Featured listing confirmed — ${fields.company}`;
    html = `<p>Your featured listing for <strong>${fields.company}</strong> is active.</p>`;
  } else {
    return;
  }

  await resend.emails.send({
    from: 'noreply@artificialjobs.dev',
    to: email,
    subject,
    html,
  });
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true, ignored: 'payment not complete' });
    }
    const metadata = session.metadata ?? {};
    const type = metadata.type ?? 'post';
    const email = session.customer_email ?? session.customer_details?.email ?? '';

    const listingType = metadata.type;
    if (listingType !== 'post' && listingType !== 'featured' && listingType !== 'post-mcp') {
      console.error('Unknown paid listing type:', listingType, session.id);
      return NextResponse.json({ error: 'Unknown listing type' }, { status: 400 });
    }
    // Stripe retries events. The unique session ID makes this operation idempotent.
    const inserted = await recordPaidListing({
      stripe_session_id: session.id,
      listing_type: listingType,
      email,
      company: metadata.company ?? '',
      job_title: metadata.jobTitle,
      mcp_name: metadata.mcpName,
      mcp_url: metadata.mcpUrl,
      description: metadata.description,
      amount_cents: session.amount_total ?? 0,
    });
    if (!inserted) return NextResponse.json({ received: true, duplicate: true });
    await recordAnalyticsEvent('checkout_completed', { type: listingType, amount_cents: session.amount_total ?? 0 });

    try {
      await sendConfirmationEmail(email, type, {
        company: metadata.company,
        jobTitle: metadata.jobTitle,
        mcpName: metadata.mcpName,
      });
    } catch (err) {
      console.error('Confirmation email failed:', err);
    }
  }

  return NextResponse.json({ received: true });
}
