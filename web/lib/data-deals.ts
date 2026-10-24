/**
 * Publicly reported sales of company data to AI buyers, and a rough value estimator.
 * Every deal row cites the report it came from; the estimator is a heuristic, not a quote.
 */

export interface ReportedDeal {
  seller: string;
  buyer: string;
  price: string;
  data: string;
  date: string;
  source: string;
  url: string;
}

const MIT_TR = 'https://www.technologyreview.com/2026/10/13/1145755/ai-labs-buying-data-from-dead-startups-to-train-models/';
const GIZMODO = 'https://gizmodo.com/failed-companies-are-selling-old-slack-chats-and-email-archives-to-train-ai-2000747916';
const REUTERS = 'https://www.itnews.com.au/news/google-to-buy-spirit-airlines-business-data-for-us10-million-628253';
const DECRYPT = 'https://decrypt.co/375883/google-spirit-airlines-data-train-ai';

export const REPORTED_DEALS: ReportedDeal[] = [
  {
    seller: 'Spirit Airlines (in bankruptcy)',
    buyer: 'Google',
    price: '$10M',
    data: '~100M emails, ~500M Teams messages, spreadsheets, calendars and operations records',
    date: 'Aug 2026',
    source: 'Reuters',
    url: REUTERS,
  },
  {
    seller: 'Spirit Airlines (losing bid)',
    buyer: 'Mercor',
    price: '$7.5M bid',
    data: 'Same archive; Google outbid Mercor at auction',
    date: 'Aug 2026',
    source: 'Decrypt',
    url: DECRYPT,
  },
  {
    seller: 'Shut-down startups via SimpleClosure',
    buyer: 'AI labs and training-data vendors',
    price: '$10K–$100K each',
    data: 'Source code, Slack messages and email; nearly 100 deals by April 2026',
    date: 'Apr 2026',
    source: 'Forbes, via Gizmodo',
    url: GIZMODO,
  },
  {
    seller: 'A winding-down crypto startup',
    buyer: 'Not disclosed',
    price: '~$25K + ~$15K pending',
    data: 'Code base, then Google Workspace, Notion, Figma and Slack data',
    date: 'Oct 2026',
    source: 'MIT Technology Review',
    url: MIT_TR,
  },
];

export const DEAL_SOURCES = { MIT_TR, GIZMODO, REUTERS, DECRYPT };

/** Data sources a company might hold, weighted by how much buyers say they value each. */
export const DATA_SOURCES = [
  { id: 'chat', label: 'Slack or Teams history', weight: 1 },
  { id: 'tickets', label: 'Tickets and project tracking (Jira, Linear, Zendesk)', weight: 0.75 },
  { id: 'code', label: 'Source code', weight: 0.75 },
  { id: 'email', label: 'Company email', weight: 0.5 },
  { id: 'docs', label: 'Docs and wikis (Google Docs, Notion, Confluence)', weight: 0.5 },
  { id: 'crm', label: 'CRM and sales records', weight: 0.25 },
  { id: 'design', label: 'Design files (Figma)', weight: 0.25 },
] as const;

export type DataSourceId = (typeof DATA_SOURCES)[number]['id'];

export interface EstimateInput {
  headcount: number;
  years: number;
  sources: DataSourceId[];
}

export interface Estimate {
  /** headcount × years: the volume proxy buyers describe. */
  personYears: number;
  score: number;
  band: string;
  note: string;
}

// Bands are anchored to the reported deals above: small startups land near SimpleClosure's
// $10K–$100K, mid-size archives in the low end of micro1's $100K–$2M+, Spirit-scale far above.
const BANDS: { max: number; band: string; note: string }[] = [
  { max: 60, band: '$10K–$50K', note: 'In line with the small startup deals SimpleClosure reports.' },
  { max: 300, band: '$50K–$150K', note: 'The top of SimpleClosure’s reported range and the bottom of micro1’s.' },
  { max: 1500, band: '$150K–$750K', note: 'Inside the range micro1 and Mercor publish for approved packages.' },
  { max: 6000, band: '$750K–$2M', note: 'The top of what micro1 and Mercor publish.' },
  { max: Infinity, band: '$2M+', note: 'Large-enterprise scale. Spirit Airlines’ archive sold for $10M.' },
];

export function estimateDataValue({ headcount, years, sources }: EstimateInput): Estimate | null {
  const people = Math.max(0, Math.floor(headcount));
  const span = Math.max(0, years);
  const weight = DATA_SOURCES.filter((s) => sources.includes(s.id)).reduce((sum, s) => sum + s.weight, 0);
  // Without chat, code or tickets there is little record of work being done, which is what buyers want.
  if (!people || !span || !sources.some((id) => id === 'chat' || id === 'code' || id === 'tickets')) return null;
  const personYears = Math.round(people * span);
  const score = personYears * weight;
  const { band, note } = BANDS.find((b) => score < b.max)!;
  return { personYears, score, band, note };
}
