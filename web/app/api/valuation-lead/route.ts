import { newsletterClient, newsletterFrom } from '@/lib/newsletter';
import { leadEmail, parseValuationLead } from '@/lib/valuation-lead';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid origin' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 8192) return Response.json({ error: 'Request too large' }, { status: 413 });
  let body;
  try {
    const text = await request.text();
    if (text.length > 8192) return Response.json({ error: 'Request too large' }, { status: 413 });
    body = JSON.parse(text);
  } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
  if (body?.website) return Response.json({ success: true });
  const parsed = parseValuationLead(body);
  if ('error' in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  try {
    const to = process.env.LEADS_TO;
    if (!to) throw new Error('LEADS_TO is not configured');
    const email = leadEmail(parsed.lead);
    const result = await newsletterClient().emails.send({ from: newsletterFrom(), to, replyTo: parsed.lead.email, ...email });
    if (result.error) throw new Error(`${result.error.name}: ${result.error.message}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Valuation lead unavailable:', error instanceof Error ? error.message : 'provider error');
    return Response.json({ error: 'The form is temporarily unavailable.' }, { status: 503 });
  }
}
