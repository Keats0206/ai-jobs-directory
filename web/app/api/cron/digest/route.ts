import { authorizedCron } from '@/lib/admin-auth';
import { newsletterClient, newsletterSegments, newsletterFrom } from '@/lib/newsletter';
import { buildDigest } from '@/lib/digest';

export async function GET(request: Request) {
  if (!authorizedCron(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const digest = buildDigest();
    if (!digest.count) return Response.json({ skipped: true, reason: 'No recently verified jobs' });
    const resend = newsletterClient();
    const segments = await newsletterSegments(resend);
    const previous = await resend.broadcasts.list({ limit: 100 });
    if (previous.error) throw new Error(previous.error.name);
    const existing = previous.data?.data.find(item => item.name === digest.name);
    if (existing) return Response.json({ id: existing.id, status: existing.status, alreadyExists: true });
    const { count, ...content } = digest;
    const created = await resend.broadcasts.create({ ...content, from: newsletterFrom(), segmentId: segments.jobs });
    if (created.error) throw new Error(created.error.name);
    return Response.json({ id: created.data?.id, status: 'draft', jobs: count, sendsEmail: false });
  } catch (error) {
    console.error('Weekly draft failed:', error instanceof Error ? error.message : 'provider error');
    return Response.json({ error: 'Weekly draft unavailable' }, { status: 503 });
  }
}
