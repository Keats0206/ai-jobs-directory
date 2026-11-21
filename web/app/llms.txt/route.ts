import { posts, dataUpdated } from '@/lib/blog';
import { getTrainingFields, getTrainingCollections, trainingStats } from '@/lib/training-jobs';
import { getEditions, editionLabel, editionPath, citation } from '@/lib/pay-index';
import { getComparisons } from '@/lib/compare';

// Built from the same data as the pages, so counts can't drift from the site.
export const dynamic = 'force-static';

const BASE = 'https://www.artificialjobs.dev';
const link = (title: string, path: string, note: string) => `- [${title}](${BASE}${path}): ${note}`;
const roles = (n: number) => `${n} open role${n === 1 ? '' : 's'}`;

export function GET() {
  const stats = trainingStats();
  const [latest] = getEditions();
  const fields = getTrainingFields().sort((a, b) => b.jobs.length - a.jobs.length);
  const collections = getTrainingCollections();

  const text = `# Artificial Jobs

> Paid AI training jobs for domain experts (lawyers, doctors, engineers, scientists, linguists) and data partnerships for companies, sourced from micro1 and Mercor and refreshed daily. Apply links include our micro1 or Mercor referral code.

Updated: ${dataUpdated().slice(0, 10)} · ${stats.total} open roles in ${stats.fields} fields, median top rate $${stats.medianRate}/hr, highest $${stats.topRate}/hr.

## Pages

${[
    link('AI training jobs', '/', 'all open roles, ranked by pay'),
    link('micro1 review', '/micro1', 'what micro1 pays by field (live data), how its AI interview works, and whether it is legit'),
    link('Mercor review', '/mercor', 'what Mercor pays by field (live data), how its AI interview and work trials work, and whether it is legit'),
    ...getComparisons().map((c) => link(`${c.a.name} vs ${c.b.name}`, `/platforms/${c.slug}`, 'pay, screening and payouts side by side, every fact sourced')),
    link('Sell company data', '/sell-company-data', 'micro1 and Mercor data partnerships for operating and defunct companies'),
    link('What is your company’s data worth?', '/sell-company-data/what-is-it-worth', 'every publicly reported sale of company data to AI buyers, what drives price, who buys, and a rough value estimator'),
    link('About', '/about', 'who runs Artificial Jobs, how listings are sourced and ranked, and how referral fees work'),
  ].join('\n')}

## Data

${link(`micro1 Pay Index (latest: ${editionLabel(latest.edition)})`, '/pay-index', 'monthly, frozen snapshot of micro1 AI training pay by field (median bottom and top of posted hourly ranges, 90th percentile, highest), with methodology')}
${getEditions().map((e) => link(`micro1 Pay Index, ${editionLabel(e.edition)}`, editionPath(e.edition), `permanent edition page; CSV at ${BASE}/pay-index/${e.edition}.csv`)).join('\n')}
- License: CC BY 4.0. Cite as: ${citation(latest)}

## Fields

${fields.map((f) => link(`AI training jobs: ${f.label}`, `/ai-training-jobs/${f.slug}`, roles(f.jobs.length))).join('\n')}

## Credentials and languages

${collections.map((f) => link(`AI training jobs for ${f.audience}`, `/ai-training-jobs/${f.slug}`, roles(f.jobs.length))).join('\n')}

## Guides

${link('Blog', '/blog', `all guides; RSS at ${BASE}/blog/feed.xml`)}
${posts.map((post) => link(post.title, `/blog/${post.slug}`, post.description)).join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
