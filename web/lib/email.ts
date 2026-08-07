import { Resend } from 'resend';

const FROM = 'noreply@artificialjobs.dev';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.artificialjobs.dev';

export type PurchaseType = 'featured' | 'post';

export interface PurchaseDetails {
  email: string;
  type: PurchaseType;
  company?: string;
  jobTitle?: string;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function emailConfigured(): boolean {
  return resend !== null;
}

function shell(inner: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      ${inner}
      <p style="color: #666; font-size: 12px; margin-top: 24px;">Questions? Reply to this email.</p>
    </div>
  `;
}

function button(href: string, label: string): string {
  return `<p><a href="${href}" style="background: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">${label}</a></p>`;
}

export function buildPurchaseEmail({ type, company, jobTitle }: PurchaseDetails): {
  subject: string;
  html: string;
} {
  if (type === 'featured') {
    return {
      subject: `Your Featured Listing is Live - ${company}`,
      html: shell(`
        <h2>Featured Listing Confirmed</h2>
        <p>Your company <strong>${company}</strong> is now featured at the top of AI Jobs Directory for the next 30 days.</p>
        <p>Your featured listing includes:</p>
        <ul>
          <li>Top placement on homepage</li>
          <li>All job postings highlighted</li>
          <li>Profile badge</li>
        </ul>
        ${button(SITE_URL, 'View on Site')}
      `),
    };
  }

  return {
    subject: `Your Job Posted - ${jobTitle || 'New Role'}`,
    html: shell(`
      <h2>Job Posted Successfully</h2>
      <p>Your job posting <strong>${jobTitle || 'New Role'}</strong> at <strong>${company}</strong> is now live on AI Jobs Directory.</p>
      ${button(SITE_URL, 'View on Site')}
      <p style="color: #666; font-size: 12px;">Your job will be visible to AI search engines including Perplexity, Claude, and ChatGPT.</p>
    `),
  };
}

/**
 * Sends the customer-facing purchase confirmation. Returns the Resend message
 * id, or throws if the service is unconfigured or the send fails.
 */
export async function sendPurchaseEmail(details: PurchaseDetails): Promise<string | undefined> {
  if (!resend) throw new Error('Email service not configured');

  const { subject, html } = buildPurchaseEmail(details);
  const result = await resend.emails.send({
    from: FROM,
    to: details.email,
    subject,
    html,
  });

  if (result.error) throw new Error(result.error.message ?? 'Resend rejected the message');
  return result.data?.id;
}

/**
 * Notifies the operator that a paid listing needs to be added to the
 * directory. Jobs are served from a static data file at build time, so a
 * purchase cannot publish itself — this is the handoff. Best-effort: a failure
 * here must not fail the webhook, or Stripe will retry an already-fulfilled
 * payment.
 */
export async function sendAdminNotification(
  details: PurchaseDetails & { amountTotal?: number | null; sessionId?: string }
): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  if (!resend || !to) return;

  const amount =
    typeof details.amountTotal === 'number'
      ? `$${(details.amountTotal / 100).toFixed(2)}`
      : 'unknown';

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `[Action needed] ${details.type === 'featured' ? 'Featured listing' : 'Job post'} purchased - ${details.company}`,
      html: shell(`
        <h2>New paid listing</h2>
        <ul>
          <li><strong>Type:</strong> ${details.type}</li>
          <li><strong>Company:</strong> ${details.company ?? 'N/A'}</li>
          <li><strong>Job title:</strong> ${details.jobTitle ?? 'N/A'}</li>
          <li><strong>Customer:</strong> ${details.email}</li>
          <li><strong>Amount:</strong> ${amount}</li>
          <li><strong>Stripe session:</strong> ${details.sessionId ?? 'N/A'}</li>
        </ul>
        <p>Add this listing to <code>web/data/jobs.json</code> and redeploy.</p>
      `),
    });
  } catch (err) {
    console.error('Admin notification failed:', err);
  }
}
