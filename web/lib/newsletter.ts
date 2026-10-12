import 'server-only';
import { Resend } from 'resend';
export const newsletterFrom = () => process.env.NEWSLETTER_FROM || 'Artificial Jobs <noreply@artificialjobs.dev>';
export const newsletterSegmentName = 'Artificial Jobs — Weekly Jobs';
export const newsletterBaseUrl = 'https://www.artificialjobs.dev';
export function newsletterClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('Newsletter provider is not configured');
  return new Resend(process.env.RESEND_API_KEY);
}
export function newsletterSecret() {
  const secret = process.env.NEWSLETTER_SIGNING_SECRET;
  if (!secret || secret.length < 32) throw new Error('Newsletter signing secret is not configured');
  return secret;
}
export async function newsletterSegments(resend: Resend) {
  const list = await resend.segments.list();
  if (list.error) throw new Error(`Cannot list newsletter segments: ${list.error.name}`);
  const configured = process.env.RESEND_JOBS_SEGMENT_ID;
  const existing = list.data?.data.find(segment => segment.id === configured || segment.name === newsletterSegmentName);
  if (!existing) throw new Error('Newsletter jobs segment is not configured');
  return { jobs: existing.id };
}
