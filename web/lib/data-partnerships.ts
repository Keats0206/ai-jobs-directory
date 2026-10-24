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
  'Links on this page include our micro1 referral code, and the Mercor code below is ours. Artificial Jobs may earn a referral fee if your company becomes a data partner. This page is not legal advice.';

/** Mercor Data takes the referral code typed in at application; there is no referral link. */
export const MERCOR_REFERRAL_CODE = 'HMFNVJTM';
export const MERCOR_APPLY_URL = 'https://data.mercor.com/';
export const MERCOR_TOP_PAYOUT = '$1.5M';

/** Company types Mercor is looking for and what each earns the company (Mercor referral page, Oct 2026). */
export const MERCOR_WANTED: { title: string; sector: string; size: string; data: string; earns: string }[] = [
  { title: 'Construction', sector: 'Industrial', size: '50–2,000 employees', data: 'Project records, drawings and site imagery from completed projects.', earns: '$115K–$1M' },
  { title: 'Semiconductor & materials', sector: 'Science & R&D', size: '10–2,000 employees', data: 'Run records that tie each recipe to a measured result.', earns: '$100K–$750K' },
  { title: 'Digital health', sector: 'Healthcare', size: '10–500 employees', data: 'Consented recordings of patient visits, with transcripts and notes.', earns: '$100K–$900K' },
  { title: 'Manufacturing & industrial', sector: 'Industrial', size: '20–2,000 employees', data: 'Production, maintenance and inspection records from the shop floor.', earns: '$100K–$1.5M' },
  { title: 'Law firm', sector: 'Professional services', size: '5–300 attorneys and staff', data: 'Complete files from closed matters and completed deals.', earns: '$50K–$1.2M' },
  { title: 'Cybersecurity', sector: 'Software', size: '20–2,000 employees', data: 'Security alerts, investigations and case write-ups, or security software.', earns: '$20K–$750K' },
];
