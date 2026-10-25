export const COMPANY_STATUSES = [
  ['operating', 'Still operating'],
  ['winding-down', 'Winding down'],
  ['shut-down', 'Already shut down'],
] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number][0];

export type ValuationLead = {
  name: string;
  email: string;
  company: string;
  status: CompanyStatus;
  headcount: number;
  notes: string;
  source: string;
};

// Same rule as newsletter-token's validEmail, kept here so the client form doesn't pull in node:crypto.
const validEmail = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim());
const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/** Validates a "get a valuation" submission. Returns the clean lead, or an error message for the form. */
export function parseValuationLead(body: unknown): { lead: ValuationLead } | { error: string } {
  const input = (body ?? {}) as Record<string, unknown>;
  const name = text(input.name, 120);
  const company = text(input.company, 160);
  const status = COMPANY_STATUSES.find(([id]) => id === input.status)?.[0];
  const headcount = Math.round(Number(input.headcount));
  if (!name || !company) return { error: 'Add your name and company.' };
  if (!validEmail(input.email)) return { error: 'Enter a valid email.' };
  if (!status) return { error: 'Choose where the company is at.' };
  if (!Number.isFinite(headcount) || headcount < 1 || headcount > 500000) return { error: 'Enter peak headcount.' };
  if (input.consent !== true) return { error: 'Agree to be contacted about your company’s data.' };
  return {
    lead: { name, company, status, headcount, email: input.email.trim().toLowerCase(), notes: text(input.notes, 2000), source: text(input.source, 200) },
  };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Notification email for the site owner. Every field is user input, so the HTML version is escaped. */
export function leadEmail(lead: ValuationLead) {
  const status = COMPANY_STATUSES.find(([id]) => id === lead.status)?.[1] ?? lead.status;
  const rows: [string, string][] = [
    ['Name', lead.name], ['Email', lead.email], ['Company', lead.company], ['Status', status],
    ['Peak headcount', lead.headcount.toLocaleString('en-US')], ['Notes', lead.notes || '—'], ['Page', lead.source || '—'],
  ];
  return {
    subject: `Data valuation lead: ${lead.company} (${status}, ${lead.headcount.toLocaleString('en-US')} people)`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: `<h1>New data valuation lead</h1><table>${rows.map(([k, v]) => `<tr><th align="left">${k}</th><td>${escape(v)}</td></tr>`).join('')}</table>`,
  };
}
