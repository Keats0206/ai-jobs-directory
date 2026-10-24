import partnershipsData from '@/data/data-partnerships.json';

/** micro1 company data partnerships, written by scripts/fetch_micro1_jobs.py. */
export interface DataPartnership {
  id: string;
  title: string;
  apply_url: string;
  requirements: string[];
  referral_reward: number | null;
  date_posted: string | null;
  last_verified: string;
}

export const partnerships = partnershipsData as DataPartnership[];

/** What micro1 says approved data packages earn the company (micro1.ai/company-referral, Oct 2026). */
export const COMPANY_PAYOUT = '$100K–$2M+';

export const isDefunct = (deal: DataPartnership) => /defunct/i.test(deal.title);

export const DATA_DISCLOSURE =
  'Links on this page include our micro1 referral code. Artificial Jobs may earn a referral fee if your company becomes a data partner. This page is not legal advice.';
