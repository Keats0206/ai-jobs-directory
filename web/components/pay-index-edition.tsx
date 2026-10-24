import Link from 'next/link';
import { type PayIndexEdition, SMALL_SAMPLE, citation, editionLabel, editionPath, formatDay } from '@/lib/pay-index';
import { Container } from '@/components/page-shell';
import { Headline, StatRow } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';
import { CopyText } from '@/components/copy-text';

const BASE = 'https://www.artificialjobs.dev';
const usd = (n: number | null) => (n == null ? '—' : `$${n}`);
const PROSE = 'max-w-prose text-[17px] leading-8 text-foreground/85 [&_strong]:font-medium [&_strong]:text-foreground';
const H2 = 'font-heading text-2xl font-medium tracking-tight sm:text-3xl';

/** The Pay Index page body: one frozen edition, with per-figure anchors, CSV, citation and Dataset schema. */
export function PayIndexEditionView({ edition: e, editions }: { edition: PayIndexEdition; editions: PayIndexEdition[] }) {
  const label = editionLabel(e.edition);
  const url = `${BASE}${editionPath(e.edition)}`;
  const csv = `/pay-index/${e.edition}.csv`;
  const o = e.overall;
  const ranked = e.fields.filter((f) => f.hourly_roles >= SMALL_SAMPLE);
  const [first, second, third] = ranked;
  const lowest = ranked.at(-1);

  const summary = `As of ${formatDay(e.snapshot_date)}, micro1’s ${o.hourly_roles} open hourly AI training roles pay a median of ${usd(o.median_low)}–${usd(o.median_high)}/hr, from the bottom to the top of each posted range. ${first.label} pays the most, at a median top rate of ${usd(first.median_high)}/hr, followed by ${second.label} (${usd(second.median_high)}) and ${third.label} (${usd(third.median_high)}). The highest posted rate is ${usd(o.max_high)}/hr.`;

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `micro1 Pay Index, ${label}`,
    description: summary,
    url,
    identifier: e.doi ? `https://doi.org/${e.doi}` : url,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    creator: { '@type': 'Organization', name: 'Artificial Jobs', url: BASE },
    publisher: { '@id': `${BASE}/#organization` },
    datePublished: e.published,
    temporalCoverage: e.snapshot_date,
    keywords: ['AI training jobs', 'AI trainer pay', 'micro1', 'hourly rates', 'RLHF', 'expert data annotation'],
    variableMeasured: ['Open roles', 'Median bottom of posted hourly range (USD)', 'Median top of posted hourly range (USD)', '90th percentile top rate (USD)', 'Highest posted rate (USD)'],
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${BASE}${csv}` }],
  };

  const faqs = [
    { question: 'How much does micro1 pay per hour?', answer: summary },
    { question: 'Which micro1 AI training jobs pay the most?', answer: `${ranked.slice(0, 3).map((f) => `${f.label} (${usd(f.median_high)}/hr median top rate)`).join(', ')} pay the most in the ${label} micro1 Pay Index. ${lowest ? `${lowest.label} pays the least, at ${usd(lowest.median_high)}/hr.` : ''}` },
    { question: 'How is the micro1 Pay Index calculated?', answer: `It takes every open role in micro1’s public referral feed on the snapshot date, reads the bottom and top of each posted hourly range, and reports medians by field. Salaried roles are counted but left out of pay figures. Each monthly edition is frozen once published.` },
    { question: 'Can I use the Pay Index data?', answer: `Yes. Each edition is free under CC BY 4.0: reuse it with credit and a link to the edition page. The CSV is at artificialjobs.dev${csv}.` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }} />
      <Container className="pb-12 pt-10 sm:pt-14">
        <p className="mb-6 text-sm text-muted-foreground">Monthly · {e.license} · Methodology {e.methodology_version}</p>
        <Headline lead={`micro1 Pay Index, ${label}.`} rest="What micro1 pays AI trainers, by field, from every open listing." />
        <p className="mt-5 text-sm text-muted-foreground">
          By Artificial Jobs · Published <time dateTime={e.published}>{formatDay(e.published)}</time> · Listings as of{' '}
          <time dateTime={e.snapshot_date}>{formatDay(e.snapshot_date)}</time>
          {e.doi && <> · DOI <a href={`https://doi.org/${e.doi}`} className="underline underline-offset-4">{e.doi}</a></>}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={csv} download className="btn-money inline-flex h-11 items-center rounded-full px-6 text-sm font-medium">Download CSV</a>
          <a href="#cite" className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-card">Cite this edition</a>
        </div>
        <p id="summary" className={`mt-10 scroll-mt-20 ${PROSE}`}><strong>{summary}</strong></p>
        <div className="mt-12">
          <StatRow stats={[
            [`${usd(o.median_high)}/hr`, 'Median top rate'],
            [`${usd(o.median_low)}/hr`, 'Median bottom rate'],
            [`${usd(o.p90_high)}/hr`, '90th percentile top rate'],
            [String(o.roles), `Open roles in ${o.fields} fields`],
          ]} />
        </div>
      </Container>

      <Container className="pb-20">
        <section id="by-field" className="scroll-mt-20">
          <h2 className={H2}>Pay by field</h2>
          <p className="mt-3 max-w-prose text-muted-foreground">Ranked by median top rate. Each row has a permanent link; click a field name to see its open roles.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-t border-border text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  {['Field', 'Open roles', 'Median bottom', 'Median top', '90th pct top', 'Highest'].map((h, i) => (
                    <th key={h} className={`py-2.5 pr-4 font-medium ${i ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {e.fields.map((f) => (
                  <tr key={f.slug} id={`field-${f.slug}`} className="scroll-mt-20 border-b border-border target:bg-accent">
                    <td className="py-2.5 pr-4">
                      <Link href={`/ai-training-jobs/${f.slug}`} className="underline decoration-border underline-offset-4 hover:decoration-foreground">{f.label}</Link>
                      {f.hourly_roles < SMALL_SAMPLE && <span className="ml-2 text-xs text-muted-foreground">small sample</span>}
                      <a href={`#field-${f.slug}`} aria-label={`Link to ${f.label} row`} className="ml-2 text-muted-foreground/60 hover:text-foreground">#</a>
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{f.roles}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{usd(f.median_low)}</td>
                    <td className="py-2.5 pr-4 text-right font-medium tabular-nums">{usd(f.median_high)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{usd(f.p90_high)}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{usd(f.max_high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Hourly USD. 90th percentile shown for fields with 10+ hourly roles. “Small sample” means fewer than {SMALL_SAMPLE} hourly roles.
          </p>
        </section>
      </Container>

      <Container className="pb-20">
        <section id="methodology" className="max-w-prose scroll-mt-20">
          <h2 className={H2}>Methodology</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-foreground/85">
            <li>Source: {e.source}, read on {formatDay(e.snapshot_date)}.</li>
            <li>Every open role is counted. The {o.roles - o.hourly_roles} salaried or unpriced roles are counted, but left out of pay figures.</li>
            <li>“Bottom” and “top” are the two ends of each role’s posted hourly range; a single posted rate counts as both.</li>
            <li>Fields are micro1’s own categories. Medians are rounded to the nearest dollar.</li>
            <li>These are advertised rates, not earnings: hours aren’t guaranteed, and what contractors actually earn isn’t public.</li>
            <li>Each edition is frozen once published. Live figures are on the <Link href="/micro1" className="underline underline-offset-4">micro1 pay page</Link>.</li>
          </ul>
        </section>
      </Container>

      <Container className="pb-20">
        <section id="cite" className="tile max-w-3xl scroll-mt-20 rounded-md p-6 sm:p-8">
          <h2 className="font-heading text-xl font-medium tracking-tight">Cite this edition</h2>
          <p className="mt-4 font-mono text-sm leading-relaxed">{citation(e)}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CopyText text={citation(e)} />
            <a href={csv} download className="text-sm underline underline-offset-4">CSV</a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to reuse under <a href="https://creativecommons.org/licenses/by/4.0/" className="underline underline-offset-4">CC BY 4.0</a> with credit and a link. To link one figure, use its row’s # link.
          </p>
        </section>
      </Container>

      {editions.length > 1 && (
        <Container className="pb-20">
          <section>
            <h2 className={H2}>All editions</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {editions.map((ed) => (
                <li key={ed.edition} className="flex justify-between gap-4 py-3">
                  <Link href={editionPath(ed.edition)} className="hover:underline">{editionLabel(ed.edition)}</Link>
                  <span className="tabular-nums text-muted-foreground">{usd(ed.overall.median_high)}/hr median top · {ed.overall.roles} roles</span>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}

      <Container className="pb-24">
        <div className="max-w-3xl">
          <FaqSection faqs={faqs} />
        </div>
      </Container>
    </>
  );
}
