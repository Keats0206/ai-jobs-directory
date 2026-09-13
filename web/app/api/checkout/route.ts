import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { recordAnalyticsEvent } from '@/lib/supabase-admin';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.artificialjobs.dev';

const prices = {
  post: 9900,
  featured: 19900,
  'post-mcp': 19900,
} as const;

type CheckoutType = keyof typeof prices;

function isSubscription(type: CheckoutType) {
  return type === 'featured' || type === 'post-mcp';
}

function cancelUrl(type: CheckoutType) {
  if (type === 'post-mcp') return `${baseUrl}/post-mcp`;
  if (type === 'post') return `${baseUrl}/post-job`;
  return baseUrl;
}

function productName(
  type: CheckoutType,
  fields: { company: string; jobTitle?: string; mcpName?: string }
) {
  if (type === 'featured') return `Featured Listing - ${fields.company}`;
  if (type === 'post-mcp') return `MCP Listing - ${fields.mcpName || 'New Server'}`;
  return `Post a Job - ${fields.jobTitle || 'New Role'}`;
}

function productDescription(type: CheckoutType) {
  if (type === 'featured') return 'Get featured at the top of AI Jobs Directory for 30 days';
  if (type === 'post-mcp') return 'Featured MCP server listing on artificialjobs.dev';
  return 'Post a new job opening to AI Jobs Directory';
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { type, email, company, jobTitle, mcpName, mcpUrl, description } = body;
    const checkoutType = (type as CheckoutType) || 'post';

    if (!email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (checkoutType === 'post-mcp' && (!mcpName || !mcpUrl)) {
      return NextResponse.json({ error: 'Missing required MCP fields' }, { status: 400 });
    }

    const unitAmount = prices[checkoutType] ?? prices.post;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: isSubscription(checkoutType) ? 'subscription' : 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName(checkoutType, { company, jobTitle, mcpName }),
              description: productDescription(checkoutType),
            },
            unit_amount: unitAmount,
            ...(isSubscription(checkoutType) && {
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=${checkoutType}`,
      cancel_url: cancelUrl(checkoutType),
      metadata: {
        type: checkoutType,
        company,
        jobTitle: jobTitle || 'N/A',
        mcpName: mcpName || 'N/A',
        mcpUrl: mcpUrl || 'N/A',
        description: description || 'N/A',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await recordAnalyticsEvent('checkout_started', {
        type: checkoutType,
        company,
        amount_cents: unitAmount,
      });
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
