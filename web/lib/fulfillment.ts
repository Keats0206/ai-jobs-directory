import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface PendingJobListing {
  id: string;
  type: 'post';
  email: string;
  company: string;
  jobTitle: string;
  createdAt: string;
  stripeSessionId: string;
}

export interface PendingMcpListing {
  id: string;
  type: 'post-mcp';
  email: string;
  company: string;
  mcpName: string;
  mcpUrl: string;
  description: string;
  createdAt: string;
  stripeSessionId: string;
}

export type PendingListing = PendingJobListing | PendingMcpListing;

const DATA_DIR = join(process.cwd(), 'data');
const PENDING_PATH = join(DATA_DIR, 'pending-listings.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function loadPendingListings(): PendingListing[] {
  ensureDataDir();
  try {
    return JSON.parse(readFileSync(PENDING_PATH, 'utf8')) as PendingListing[];
  } catch {
    return [];
  }
}

export function savePendingListings(listings: PendingListing[]) {
  ensureDataDir();
  writeFileSync(PENDING_PATH, JSON.stringify(listings, null, 2) + '\n');
}

export function addPendingListing(listing: PendingListing) {
  const listings = loadPendingListings();
  if (listings.some((l) => l.stripeSessionId === listing.stripeSessionId)) return;
  listings.push(listing);
  savePendingListings(listings);
}

export function createPendingFromMetadata(
  sessionId: string,
  metadata: Record<string, string>,
  customerEmail: string | null,
): PendingListing | null {
  const type = metadata.type;
  const email = customerEmail ?? metadata.email ?? '';
  const company = metadata.company ?? '';

  if (type === 'post') {
    return {
      id: sessionId,
      type: 'post',
      email,
      company,
      jobTitle: metadata.jobTitle ?? 'New Role',
      createdAt: new Date().toISOString(),
      stripeSessionId: sessionId,
    };
  }

  if (type === 'post-mcp') {
    return {
      id: sessionId,
      type: 'post-mcp',
      email,
      company,
      mcpName: metadata.mcpName ?? 'New Server',
      mcpUrl: metadata.mcpUrl ?? '',
      description: metadata.description ?? '',
      createdAt: new Date().toISOString(),
      stripeSessionId: sessionId,
    };
  }

  return null;
}
