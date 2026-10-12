import { authorizedCron } from '@/lib/admin-auth';
import { newsletterClient, newsletterSegmentName } from '@/lib/newsletter';

export async function POST(request: Request) {
  if (!authorizedCron(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const resend = newsletterClient();
    const domains = await resend.domains.list();
    if (domains.error) return Response.json({ error: domains.error.name }, { status: 502 });
    const domain = domains.data?.data.find(item => item.name === 'artificialjobs.dev');
    if (!domain || domain.status !== 'verified') return Response.json({ error: 'artificialjobs.dev must be verified in Resend', domainStatus: domain?.status || 'missing' }, { status: 409 });
    const segments = await resend.segments.list();
    if (segments.error) return Response.json({ error: segments.error.name }, { status: 502 });
    let id = segments.data?.data.find(item => item.name === newsletterSegmentName)?.id;
    if (!id) {
      const created = await resend.segments.create({ name: newsletterSegmentName });
      if (created.error || !created.data) return Response.json({ error: created.error?.name || 'segment_create_failed' }, { status: 502 });
      id = created.data.id;
    }
    return Response.json({ domainStatus: domain.status, segments: { jobs: id }, sendsEmail: false });
  } catch { return Response.json({ error: 'Newsletter setup unavailable' }, { status: 503 }); }
}
