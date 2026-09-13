import 'server-only';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseAdmin = Boolean(supabaseUrl && serviceRoleKey);

async function insert(table: string, row: Record<string, unknown>, ignoreDuplicates = false): Promise<boolean> {
  if (!supabaseUrl || !serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: `${ignoreDuplicates ? 'resolution=ignore-duplicates' : 'resolution=merge-duplicates'},return=representation`,
    },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Supabase ${table} insert failed (${response.status})`);
  const inserted = await response.json().catch(() => []);
  return Array.isArray(inserted) ? inserted.length > 0 : true;
}

export function recordAnalyticsEvent(eventName: string, eventData: Record<string, unknown> = {}) {
  return insert('analytics_events', { event_name: eventName, event_data: eventData });
}

export function recordNewsletterSubscriber(email: string, source = 'site') {
  return insert('newsletter_subscribers', { email, source }, true);
}

export function recordPaidListing(row: {
  stripe_session_id: string;
  listing_type: 'post' | 'featured' | 'post-mcp';
  email: string;
  company: string;
  job_title?: string;
  mcp_name?: string;
  mcp_url?: string;
  description?: string;
  amount_cents: number;
}) {
  return insert('paid_listings', row, true);
}
