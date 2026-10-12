import snapshot from '@/data/public-stats.json';

export type SearchStats = {
  since: string;
  until: string;
  clicks: number;
  impressions: number;
  source: string;
};

export const publicStats = snapshot as Omit<typeof snapshot, 'searchConsole'> & {
  searchConsole: SearchStats | null;
};

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
}
