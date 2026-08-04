import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      );
    }

    const { type, email, company, jobTitle } = await request.json();

    if (!email || !company) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Featured Listing: $199/month
    // Post a Job: $99 one-time
    const prices = {
      featured: 19900, // $199 in cents
      post: 9900, // $99 in cents
    };

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: type === 'post' ? 'payment' : 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: type === 'featured' 
                ? `Featured Listing - ${company}` 
                : `Post a Job - ${jobTitle || 'New Role'}`,
              description: type === 'featured'
                ? 'Get featured at the top of AI Jobs Directory for 30 days'
                : 'Post a new job opening to AI Jobs Directory',
            },
            unit_amount: prices[type as keyof typeof prices] || prices.post,
            ...(type === 'featured' && {
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.artificialjobs.dev'}/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.artificialjobs.dev'}/`,
      metadata: {
        type,
        company,
        jobTitle: jobTitle || 'N/A',
      },
    };

    const session = await stripe!.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
