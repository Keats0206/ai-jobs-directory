import { NextRequest, NextResponse } from 'next/server';
import { emailConfigured, sendPurchaseEmail, type PurchaseType } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    if (!emailConfigured()) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const { email, type, company, jobTitle } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type !== 'featured' && type !== 'post') {
      return NextResponse.json({ error: 'Unknown purchase type' }, { status: 400 });
    }

    const id = await sendPurchaseEmail({
      email,
      type: type as PurchaseType,
      company,
      jobTitle,
    });

    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
