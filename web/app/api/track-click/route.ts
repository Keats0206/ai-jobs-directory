import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { jobId, url, company, title } = body;

    const eventData = { jobId: jobId || title || null, company: company || null, url: url || null };
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await recordAnalyticsEvent('apply_click', eventData);
    } else {
      console.log(`[CLICK TRACKED] ${JSON.stringify(eventData)}`);
    }

    return NextResponse.json({
      success: true,
      jobId: jobId || title || null,
      company: company || null,
      url: url || null,
      trackedAt: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
