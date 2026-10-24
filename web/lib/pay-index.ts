import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

/** Monthly micro1 Pay Index editions, written and frozen by scripts/pay_index.py. */
export interface PayStats {
  roles: number;
  hourly_roles: number;
  median_low: number | null;
  median_high: number | null;
  p90_high: number | null;
  max_high: number | null;
  high_demand: number;
}

export interface PayIndexEdition {
  edition: string;
  snapshot_date: string;
  published: string;
  methodology_version: string;
  source: string;
  license: string;
  doi: string | null;
  overall: PayStats & { fields: number };
  fields: (PayStats & { slug: string; label: string })[];
}

const DIR = path.join(process.cwd(), 'data/pay-index');

/** Newest first. */
export function getEditions(): PayIndexEdition[] {
  return fs.readdirSync(DIR)
    .filter((file) => /^\d{4}-\d{2}\.json$/.test(file))
    .sort()
    .reverse()
    .map((file) => JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')));
}

export const getEdition = (edition: string) => getEditions().find((e) => e.edition === edition);

/** Fields with fewer hourly roles than this are shown but flagged as a small sample. */
export const SMALL_SAMPLE = 5;

export const editionLabel = (edition: string) =>
  new Date(`${edition}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const editionPath = (edition: string) => `/pay-index/${edition}`;

export function citation(e: PayIndexEdition) {
  const year = e.published.slice(0, 4);
  const doi = e.doi ? ` https://doi.org/${e.doi}` : '';
  return `Artificial Jobs (${year}). micro1 Pay Index, ${editionLabel(e.edition)} [Data set]. https://www.artificialjobs.dev${editionPath(e.edition)}${doi}`;
}
