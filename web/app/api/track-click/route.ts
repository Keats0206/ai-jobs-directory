import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { jobId, url, company, title } = body;

    console.log(`[CLICK TRACKED] Job: ${jobId || title || 'unknown'} | Company: ${company || 'unknown'} | Target: ${url} | Time: ${new Date().toISOString()}`);

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
