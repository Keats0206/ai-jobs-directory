import type { Metadata } from 'next';
import Link from 'next/link';
import { partnerships, COMPANY_PAYOUT, isDefunct, DATA_DISCLOSURE, MERCOR_REFERRAL_CODE, MERCOR_APPLY_URL, MERCOR_TOP_PAYOUT, MERCOR_WANTED } from '@/lib/data-partnerships';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container, SectionLabel } from '@/components/page-shell';
import { DisclosureBar, Headline, StatRow } from '@/components/training-ui';
import { FaqSection } from '@/components/faq-section';
import { PartnerLink } from '@/components/partner-link';
import { CopyCode } from '@/components/copy-code';
import { AnonymizationGraphic } from '@/components/anonymization-graphic';
import { ValuationLeadForm } from '@/components/valuation-lead-form';

export const metadata: Metadata = {
  title: `Sell Your Company Data to AI Labs — ${COMPANY_PAYOUT} per Data Package`,
  description: `AI labs pay for real operational data. Operating and defunct companies with 30+ employees can earn ${COMPANY_PAYOUT} for approved data packages through micro1 and Mercor data partnerships.`,
  alternates: { canonical: '/sell-company-data' },
};

const STEPS = [
  ['Create a company profile', 'A point of contact sets up your company on micro1’s portal and fills in a data manifest: what you have, roughly how much, and from when.'],
  ['micro1 evaluates the fit', 'Their team reviews the company and decides whether there is a fit for a data partnership.'],
  ['Transfer approved data', 'If there is a fit, you agree terms and transfer only the data that’s approved.'],
  ['Get paid', 'Payment is made for approved data packages.'],
];

const DATA_TYPES = [
  ['Internal chat', 'Slack or Microsoft Teams history: how real teams reason, decide and hand off work.'],
  ['Process docs', 'SOPs, playbooks, runbooks and documented workflows.'],
  ['Operational records', 'Tickets, project plans, reports and the datasets your business already runs on.'],
];

const CHECKLIST = [
  'Confirm you own the data and have the right to sell it. Check customer contracts, NDAs and vendor terms.',
  'Plan how personal data about employees and customers will be removed or anonymised before transfer.',
  'Check the privacy laws where your staff and customers are (e.g. GDPR in the EU/UK, state laws in the US).',
  'For a defunct company, find out who controls its assets now: founders, the board, a trustee or a liquidator.',
  'Have a lawyer review the data agreement before anything is transferred.',
];

export default function SellCompanyDataPage() {
  const operating = partnerships.find((deal) => !isDefunct(deal));
  const primary = operating ?? partnerships[0];

  const faqs = [
    {
      question: 'Why do AI labs buy company data?',
      answer: 'Models learn to do real work from examples of real work. Internal chat, documented processes and operational records show how businesses actually operate, which public web data does not.',
    },
    {
      question: 'How much can a company earn?',
      answer: `micro1 says approved data packages earn companies ${COMPANY_PAYOUT}. Reported deals range from about $10,000 for a small startup archive to $10 million for Spirit Airlines’ data (Reuters, August 2026). The price depends on what data you have and how much of it is approved.`,
    },
    {
      question: 'Which companies is Mercor looking for?',
      answer: `Mercor is currently buying data from construction, semiconductor and materials, digital health, manufacturing, law and cybersecurity companies, paying companies up to ${MERCOR_TOP_PAYOUT}. Apply at data.mercor.com and enter referral code ${MERCOR_REFERRAL_CODE}.`,
    },
    {
      question: 'Can a company that has shut down still sell its data?',
      answer: 'Yes. micro1 runs a separate partnership for defunct companies. Whoever controls the company’s assets now has to authorise the sale.',
    },
    {
      question: 'Which companies qualify?',
      answer: 'Generally 30+ employees and English-language data. The defunct-company program looks for 50+ peak employees and substantial Slack or Teams history. The current requirements are listed on each program above.',
    },
  ];

  return (
    <>
      <SiteHeader />
      <DisclosureBar>{DATA_DISCLOSURE}</DisclosureBar>
      <main className="flex-1">
        <Container className="pb-16 pt-16 sm:pt-24">
          <p className="mb-6 text-sm text-muted-foreground">For founders, operators and former owners</p>
          <Headline
            lead={`Your company’s data is worth ${COMPANY_PAYOUT}.`}
            rest="AI labs pay for real operational data, even from companies that have shut down."
          />
          {primary && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PartnerLink href={primary.apply_url} program={isDefunct(primary) ? 'defunct' : 'enterprise'} placement="hero" className="btn-money inline-flex h-11 items-center rounded-full px-6 text-sm font-medium">
                Check if your company qualifies
              </PartnerLink>
              <a href="#programs" className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-card">
                Compare programs
              </a>
            </div>
          )}
          <div className="mt-16">
            <StatRow stats={[
              [COMPANY_PAYOUT, 'Per approved data package'],
              ['30+', 'Employees to qualify'],
              [String(partnerships.length + 1), 'Open programs'],
              ['Any', 'Industry'],
            ]} />
          </div>
        </Container>

        <Container className="pb-24">
          <section id="programs" className="scroll-mt-20">
            <div className="mb-8">
              <Headline as="h2" lead="Compare programs." rest="Both are run by micro1 and pay companies for approved data." />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {partnerships.map((deal) => (
                <article key={deal.id} className="tile flex flex-col rounded-md p-7">
                  <p className="text-sm text-muted-foreground">{isDefunct(deal) ? 'Best for closed or defunct companies' : 'Best for operating companies'}</p>
                  <h3 className="font-heading mt-2 text-2xl font-medium tracking-tight">{deal.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {isDefunct(deal)
                      ? 'Your company shut down, but its records didn’t. Turn its archived chat and documents into a payout.'
                      : 'Earn from the business documentation and operational datasets you already have.'}
                  </p>
                  <dl className="mb-7 mt-6 divide-y divide-border border-y border-border text-sm">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">Company payout</dt>
                      <dd className="font-heading text-lg font-medium tabular-nums">{COMPANY_PAYOUT}</dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="shrink-0 text-muted-foreground">Requirements</dt>
                      <dd className="text-right">{deal.requirements.join(', ') || 'See program'}</dd>
                    </div>
                  </dl>
                  <PartnerLink
                    href={deal.apply_url}
                    program={isDefunct(deal) ? 'defunct' : 'enterprise'}
                    placement="program_card"
                    className="btn-money mt-auto inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium"
                  >
                    {`Start a ${isDefunct(deal) ? 'defunct company' : 'company'} profile`}
                  </PartnerLink>
                </article>
              ))}
            </div>
          </section>
        </Container>

        <Container className="pb-24">
          <section id="mercor" className="scroll-mt-20">
            <div className="mb-8 grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end">
              <Headline as="h2" lead="Mercor is buying industry data." rest={`Up to ${MERCOR_TOP_PAYOUT} for the right company. These are the types it wants now.`} />
              <div className="flex flex-col gap-3 lg:items-end">
                <p className="text-sm text-muted-foreground">Enter this referral code when you apply</p>
                <CopyCode code={MERCOR_REFERRAL_CODE} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MERCOR_WANTED.map((item) => (
                <article key={item.title} className="tile flex flex-col rounded-md p-6">
                  <p className="text-sm text-muted-foreground">{item.sector} · {item.size}</p>
                  <h3 className="font-heading mt-2 text-xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mb-6 mt-2 text-muted-foreground">{item.data}</p>
                  <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Company earns</span>
                    <span className="font-heading text-lg font-medium tabular-nums">{item.earns}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PartnerLink href={MERCOR_APPLY_URL} program="mercor" placement="mercor_section" className="btn-money inline-flex h-11 items-center rounded-full px-6 text-sm font-medium">
                Apply with Mercor
              </PartnerLink>
              <p className="text-sm text-muted-foreground">Use code <span className="font-mono font-medium text-foreground">{MERCOR_REFERRAL_CODE}</span> on the application.</p>
            </div>
          </section>
        </Container>

        <Container className="pb-24">
          <SectionLabel>What labs are buying</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-3">
            {DATA_TYPES.map(([title, body]) => (
              <div key={title} className="tile rounded-md p-6">
                <h3 className="font-heading text-xl font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </Container>

        <Container className="pb-24">
          <SectionLabel>How it works</SectionLabel>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="tile rounded-md p-6">
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <h3 className="font-heading mt-6 text-xl font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </Container>

        <Container className="pb-24">
          <div className="mb-8">
            <Headline as="h2" lead="Labs buy the work, not the people." rest="Names, contact details and other personal data are stripped out before anything is transferred." />
          </div>
          <AnonymizationGraphic />
          <p className="mt-4 text-sm text-muted-foreground">Illustration with made-up details. Each program agrees the exact anonymisation steps with you before transfer.</p>
        </Container>

        <Container className="pb-24">
          <Link href="/sell-company-data/what-is-it-worth" className="tile flex flex-col justify-between gap-6 rounded-md p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Every reported deal, from $10K startup archives to Google’s $10M Spirit Airlines purchase</p>
              <p className="font-heading mt-1 text-2xl font-medium tracking-tight">
                What is your company’s data worth? <span className="text-muted-foreground">Get a rough range in 30 seconds.</span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium">Estimate &rarr;</span>
          </Link>
        </Container>

        <Container className="pb-24">
          <div id="valuation" className="grid scroll-mt-20 gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <Headline as="h2" lead="Get a valuation." rest="Tell us what you have and we’ll reply by email with the buyers that fit." />
            </div>
            <ValuationLeadForm source="/sell-company-data" applyHref={primary?.apply_url ?? MERCOR_APPLY_URL} />
          </div>
        </Container>

        <Container className="pb-24">
          <div id="before-you-sell" className="grid scroll-mt-20 gap-10 border-t border-border pt-12 lg:grid-cols-[1fr_2fr]">
            <Headline as="h2" lead="Before you sell." rest="Do these first." />
            <ul className="divide-y divide-border border-y border-border">
              {CHECKLIST.map((item, i) => (
                <li key={item} className="flex gap-4 py-4">
                  <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        <Container className="pb-24">
          <Link href="/" className="tile flex flex-col justify-between gap-6 rounded-md p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Not a company owner?</p>
              <p className="font-heading mt-1 text-2xl font-medium tracking-tight">
                Get paid hourly to train AI. <span className="text-muted-foreground">Roles for lawyers, doctors, engineers and more.</span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium">Browse roles &rarr;</span>
          </Link>
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
