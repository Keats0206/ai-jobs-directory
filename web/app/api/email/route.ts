import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const { email, type, company, jobTitle, mcpName } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let subject = '';
    let html = '';

    if (type === 'featured') {
      subject = `Your Featured Listing is Live - ${company}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Featured Listing Confirmed</h2>
          <p>Your company <strong>${company}</strong> is now featured at the top of AI Jobs Directory for the next 30 days.</p>
          <p>Your featured listing includes:</p>
          <ul>
            <li>Top placement on homepage</li>
            <li>All job postings highlighted</li>
            <li>Profile badge</li>
            <li>Analytics dashboard</li>
          </ul>
          <p><a href="https://www.artificialjobs.dev/dashboard" style="background: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">View Dashboard</a></p>
          <p style="color: #666; font-size: 12px; margin-top: 24px;">Questions? Reply to this email.</p>
        </div>
      `;
    } else if (type === 'post') {
      subject = `Your Job Posted - ${jobTitle || 'New Role'}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Job Posted Successfully</h2>
          <p>Your job posting <strong>${jobTitle || 'New Role'}</strong> at <strong>${company}</strong> is now live on AI Jobs Directory.</p>
          <p><a href="https://www.artificialjobs.dev" style="background: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">View on Site</a></p>
          <p style="color: #666; font-size: 12px; margin-top: 24px;">Your job will be visible to AI search engines including Perplexity, Claude, and ChatGPT.</p>
        </div>
      `;
    } else if (type === 'post-mcp') {
      subject = `Your MCP Listing is Active - ${mcpName || 'New Server'}`;
      html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>MCP Listing Confirmed</h2>
          <p>Your MCP server <strong>${mcpName || 'New Server'}</strong> from <strong>${company}</strong> is subscribed on artificialjobs.dev.</p>
          <p>Your listing includes:</p>
          <ul>
            <li>Featured placement when the MCP directory launches</li>
            <li>llms.txt inclusion for AI search discovery</li>
            <li>Publisher profile with install link</li>
          </ul>
          <p style="color: #666; font-size: 12px; margin-top: 24px;">Questions? Reply to this email.</p>
        </div>
      `;
    }

    const result = await resend!.emails.send({
      from: 'noreply@artificialjobs.dev',
      to: email,
      subject,
      html,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data?.id }, { status: 200 });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
