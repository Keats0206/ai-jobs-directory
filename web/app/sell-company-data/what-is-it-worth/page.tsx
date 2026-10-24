import type { Metadata } from 'next';
import Link from 'next/link';
import { partnerships, COMPANY_PAYOUT, isDefunct, DATA_DISCLOSURE, MERCOR_APPLY_URL, MERCOR_REFERRAL_CODE, MERCOR_TOP_PAYOUT, MERCOR_WANTED } from '@/lib/data-partnerships';
import { REPORTED_DEALS, DEAL_SOURCES } from '@/lib/data-deals';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/page-shell';
import { DisclosureBar, Headline } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';
import { PartnerLink } from '@/components/partner-link';
import { DataValueEstimator } from '@/components/data-value-estimator';

const BASE = 'https://www.artificialjobs.dev';
const PATH = '/sell-company-data/what-is-it-worth';
const PUBLISHED = '2026-10-24';
const MODIFIED = '2026-10-24';
const TITLE = 'What Is Your Company’s Data Worth to AI Labs? Every Reported Deal';
const DESCRIPTION = 'Every publicly reported sale of company data to AI buyers, from $10K startup archives to Google’s $10M Spirit Airlines deal, plus a rough estimator and who buys.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: 'article', title: TITLE, description: DESCRIPTION, publishedTime: PUBLISHED, modifiedTime: MODIFIED },
};

const SIMPLECLOSURE_URL = 'https://simpleclosure.com/';

const cite = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-border underline-offset-4 hover:decoration-foreground">{label}</a>
);

const PROSE = 'max-w-prose text-[17px] leading-8 text-foreground/85 [&_p]:mt-5 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5';
const H2 = 'font-heading text-2xl font-medium tracking-tight sm:text-3xl';

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[40rem] border-t border-border text-left text-sm">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">{head.map((cell) => <th key={cell} className="py-2.5 pr-4 font-medium">{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-border align-top">
              {row.map((cell, i) => <td key={i} className={`py-3 pr-4 ${i === 2 ? 'whitespace-nowrap font-medium tabular-nums' : ''}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const faqs = [
  {
    question: 'How much is a company’s data worth to AI labs?',
    answer: `Reported sales range from about $10,000 for a small startup’s archive to $10 million for Spirit Airlines’ emails and Teams messages (Reuters, August 2026). micro1 says approved data packages earn ${COMPANY_PAYOUT}, and Mercor lists payouts up to ${MERCOR_TOP_PAYOUT}.`,
  },
  {
    question: 'How much can a defunct startup sell its Slack and email data for?',
    answer: 'Forbes reported in April 2026 that SimpleClosure had processed nearly 100 such deals with payouts of $10,000 to $100,000 per company. Larger archives can earn more through programs such as micro1’s Defunct Company Data Partnership, which asks for 50+ peak employees and substantial Slack or Teams history.',
  },
  {
    question: 'What makes company data more valuable?',
    answer: 'Buyers describe valuing headcount, years in operation, data volume and how the team used its tools (Sunset, via MIT Technology Review). Slack history with variety and depth, including disagreements and hard judgment calls, can be worth more than another company’s Slack, email and calendars combined.',
  },
  {
    question: 'Who buys company data for AI training?',
    answer: 'Buyers include foundation AI labs, Google, vendors that build simulated workplaces for AI training such as Surge AI, and data companies such as Mercor and micro1. Wind-down firms such as SimpleClosure and Sunset broker sales for shut-down startups.',
  },
  {
    question: 'Can an operating company sell its data, or only shut-down ones?',
    answer: 'Both. micro1 runs an Enterprise Data Partnership for operating companies with 30–200 employees, and Mercor buys from operating companies in construction, semiconductors, digital health, manufacturing, law and cybersecurity.',
  },
  {
    question: 'Is it legal to sell employee Slack and email data?',
    answer: 'There is no US federal law banning it, but contracts, privacy laws such as GDPR and employee expectations still apply. Sellers and buyers say they strip personal data first, and critics call such archives “legally radioactive.” Get a lawyer to review any data agreement.',
  },
];

export default function DataWorthPage() {
  const defunct = partnerships.find(isDefunct);
  const enterprise = partnerships.find((deal) => !isDefunct(deal));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    mainEntityOfPage: `${BASE}${PATH}`,
    author: { '@type': 'Organization', name: 'Artificial Jobs', url: BASE },
    publisher: { '@id': `${BASE}/#organization` },
    citation: Object.values(DEAL_SOURCES),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sell company data', item: `${BASE}/sell-company-data` },
      { '@type': 'ListItem', position: 2, name: 'What it’s worth', item: `${BASE}${PATH}` },
    ],
  };

  const buyers: React.ReactNode[][] = [
    [
      enterprise ? <PartnerLink key="e" href={enterprise.apply_url} program="enterprise" placement="worth_buyers" className="underline underline-offset-4">micro1 Enterprise Data Partnership</PartnerLink> : 'micro1 Enterprise Data Partnership',
      'Operating companies, 30–200 employees, documented processes',
      COMPANY_PAYOUT,
      'Company profile and data manifest on micro1’s portal',
    ],
    [
      defunct ? <PartnerLink key="d" href={defunct.apply_url} program="defunct" placement="worth_buyers" className="underline underline-offset-4">micro1 Defunct Company Data Partnership</PartnerLink> : 'micro1 Defunct Company Data Partnership',
      'Shut-down companies, 50+ peak employees, substantial Slack or Teams data',
      COMPANY_PAYOUT,
      'Whoever controls the assets now creates the profile',
    ],
    [
      <PartnerLink key="m" href={MERCOR_APPLY_URL} program="mercor" placement="worth_buyers" className="underline underline-offset-4">Mercor Data</PartnerLink>,
      `Operating companies in ${MERCOR_WANTED.map((w) => w.title.toLowerCase()).join(', ')}`,
      `Up to ${MERCOR_TOP_PAYOUT}`,
      `Apply at data.mercor.com with code ${MERCOR_REFERRAL_CODE}`,
    ],
    [
      cite(SIMPLECLOSURE_URL, 'SimpleClosure Asset Hub'),
      'Startups using SimpleClosure to wind down',
      '$10K–$100K reported',
      'Part of a wind-down engagement; scrubs personal data before sale',
    ],
    [
      'Sunset',
      'Failing or closed companies it winds down',
      'Not published',
      'Values assets by headcount, years, data volume and tool use',
    ],
    [
      'Labs and big tech directly (e.g. Google)',
      'Very large archives, often through bankruptcy auctions',
      '$10M (Spirit)',
      'Court-supervised sale or private negotiation',
    ],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <SiteHeader />
      <DisclosureBar>{DATA_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-16 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/sell-company-data" className="hover:text-foreground">Sell company data</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">What it’s worth</span>
          </nav>
          <Headline lead="What is your company’s data worth to AI labs?" rest="Every publicly reported deal, and a rough estimate for yours." />
          <p className="mt-5 text-sm text-muted-foreground">
            By Artificial Jobs · Published <time dateTime={PUBLISHED}>October 24, 2026</time> · Updated <time dateTime={MODIFIED}>October 24, 2026</time>
          </p>
          <div className={`mt-8 ${PROSE}`}>
            <p>
              <strong>Reported sales of company data to AI buyers range from about $10,000 for a small startup’s archive to $10 million for Spirit
              Airlines’ emails and Teams messages.</strong> micro1 says approved data packages earn {COMPANY_PAYOUT}, and Mercor lists payouts up
              to {MERCOR_TOP_PAYOUT}. Price depends mostly on headcount, years of records, and which tools the team worked in.
            </p>
          </div>
        </Container>

        <Container className="pb-20">
          <section id="estimate" className="scroll-mt-20">
            <h2 className={`${H2} mb-6`}>Estimate your company’s range</h2>
            <DataValueEstimator onResultHref="#buyers" />
            <p className="mt-4 max-w-prose text-sm text-muted-foreground">
              How it works: peak headcount × years gives person-years of records, weighted by data type (chat counts most, then tickets and code,
              then email and docs). The bands are anchored to the reported deals below. It is a rough guide, not an offer.
            </p>
          </section>
        </Container>

        <Container className="pb-20">
          <section id="deals" className="scroll-mt-20">
            <h2 className={H2}>Every reported deal</h2>
            <p className="mt-3 max-w-prose text-muted-foreground">Publicly reported sales and bids for company data used in AI training, as of October 2026.</p>
            <Table
              head={['Seller', 'Buyer', 'Price', 'Data', 'Reported']}
              rows={REPORTED_DEALS.map((deal) => [deal.seller, deal.buyer, deal.price, deal.data, <>{deal.date} · {cite(deal.url, deal.source)}</>])}
            />
            <div className={PROSE}>
              <p>
                SimpleClosure has since handled over 150 deals and expects to return more than $10 million to startups by the end of 2026, and 47% of
                its wind-downs now include a code or data sale, according to {cite(DEAL_SOURCES.MIT_TR, 'MIT Technology Review')} (October 13, 2026).
              </p>
            </div>
          </section>
        </Container>

        <Container className="pb-20">
          <section className={PROSE}>
            <h2 className={H2}>What drives the price</h2>
            <ul>
              <li><strong>Headcount and years.</strong> Sunset values a client’s assets by headcount, years in operation, data volume and how the team used its tools.</li>
              <li><strong>Variety, not just volume.</strong> Surge AI looks for archives covering disagreements and hard judgment calls. A Slack history with that depth can be worth more than another company’s Slack, email and calendars combined.</li>
              <li><strong>Usable tasks.</strong> Buyers price against “research theses” that estimate how many useful training tasks a body of data yields, such as from 100,000 lines of code. That is why quotes vary so widely.</li>
              <li><strong>Industry fit.</strong> Mercor publishes a different range for each industry it buys from ({MERCOR_WANTED.map((w) => `${w.title}: ${w.earns}`).join('; ')}).</li>
            </ul>
            <p className="text-sm text-muted-foreground">Source: {cite(DEAL_SOURCES.MIT_TR, 'MIT Technology Review, October 13, 2026')}; Mercor’s data referral page, October 2026.</p>
          </section>
        </Container>

        <Container className="pb-20">
          <section id="buyers" className="scroll-mt-20">
            <h2 className={H2}>Who buys company data</h2>
            <p className="mt-3 max-w-prose text-muted-foreground">
              Programs that publish terms, plus the wind-down firms and direct buyers named in reporting. Only the micro1 and Mercor rows earn us a referral fee.
            </p>
            <Table head={['Buyer', 'Best for', 'Pays', 'How it works']} rows={buyers} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sell-company-data#programs" className="btn-money inline-flex h-11 items-center rounded-full px-6 text-sm font-medium">Compare micro1 and Mercor programs</Link>
            </div>
          </section>
        </Container>

        <Container className="pb-20">
          <section className={PROSE}>
            <h2 className={H2}>The privacy and legal risk</h2>
            <p>
              Sellers and buyers both say they scrub personally identifiable information before transfer, and Spirit said its archive would be
              de-identified. Critics aren’t convinced. Greg Ewing, an attorney who advises AI startups, called these archives “legally radioactive,”
              pointing to private details in emails and calendars. Emory law professor Ifeoma Ajunwa says employers should have express consent
              before selling workers’ data, and notes the proceeds usually go to senior creditors and investors, not employees. Spirit’s flight
              attendants’ union objected to that sale in court.
            </p>
            <p>
              There is no US federal law banning these sales, but customer contracts, NDAs and privacy laws such as GDPR still apply. Work through
              the <Link href="/sell-company-data#before-you-sell" className="underline underline-offset-4">before-you-sell checklist</Link> and have a
              lawyer review any agreement. This page is not legal advice.
            </p>
            <p className="text-sm text-muted-foreground">Sources: {cite(DEAL_SOURCES.MIT_TR, 'MIT Technology Review')}; {cite(DEAL_SOURCES.GIZMODO, 'Gizmodo, citing Forbes')}; {cite(DEAL_SOURCES.DECRYPT, 'Decrypt')}.</p>
          </section>
        </Container>

        <Container className="pb-24">
          <div className="max-w-3xl">
            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
