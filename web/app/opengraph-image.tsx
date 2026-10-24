import { ImageResponse } from 'next/og';
import { trainingStats } from '@/lib/training-jobs';

export const alt = 'Artificial Jobs — Get paid to train AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Shared card for the site and per-field pages: warm paper, one green money figure. */
export function shareCard(lead: string, rest: string, figure: string, caption: string) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#f8f7f3', color: '#1f1e1b', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: -0.5 }}>Artificial Jobs</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5 }}>{lead}</div>
          <div style={{ fontSize: 40, lineHeight: 1.2, color: '#77756f', marginTop: 20 }}>{rest}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <div style={{ fontSize: 56, color: '#0f7a55', letterSpacing: -1.5 }}>{figure}</div>
          <div style={{ fontSize: 28, color: '#77756f' }}>{caption}</div>
        </div>
      </div>
    ),
    size,
  );
}

export default function Image() {
  const stats = trainingStats();
  return shareCard('Get paid to train AI.', 'Hourly expert work for lawyers, doctors, engineers and scientists.', `Up to $${stats.topRate}/hr`, `${stats.total} open roles, refreshed daily`);
}
