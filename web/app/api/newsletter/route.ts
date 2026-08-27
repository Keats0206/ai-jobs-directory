import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Simple file-based subscriber store (replace with DB later)
let subscribers: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    // Deduplicate
    if (subscribers.includes(normalized)) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    subscribers.push(normalized);
    console.log(`Newsletter signup: ${normalized} (total: ${subscribers.length})`);

    // Send welcome email via Resend if configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'noreply@artificialjobs.dev',
          to: normalized,
          subject: 'Welcome to the AI Jobs Weekly Digest',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>You're subscribed! 🚀</h2>
              <p>You'll now receive a weekly digest of the best AI, LLM, and ML engineering jobs every Monday.</p>
              <p>In the meantime, browse current openings:</p>
              <p><a href="https://www.artificialjobs.dev" style="background: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">View Latest Jobs</a></p>
              <p style="color: #666; font-size: 12px; margin-top: 24px;">
                You're receiving this because you signed up at artificialjobs.dev.<br/>
                To unsubscribe, reply to this email with "unsubscribe".
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Welcome email failed:', err);
        // Don't fail the request — subscriber is still added
      }
    }

    return NextResponse.json({ success: true, count: subscribers.length });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}