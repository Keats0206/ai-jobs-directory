import { publicStats } from '@/lib/public-stats';

export function GET() {
  return Response.json(publicStats, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
