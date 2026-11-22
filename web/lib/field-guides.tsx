import Link from 'next/link';
import type { Job } from './jobs';
import { hourlyMax, byPay, type TrainingField } from './training-jobs';
import type { FaqItem } from '@/components/faq-section';

/**
 * Editorial guides for the highest-demand field pages. Each guide sits under the role list on
 * /ai-training-jobs/[field] and computes every figure from that field's live listings, so the
 * prose stays true after each daily refresh. Sourced claims link to the reporting they rest on.
 */
export interface FieldGuide {
  heading: string;
  Body: (props: { field: TrainingField }) => React.ReactNode;
  faqs: (field: TrainingField) => FaqItem[];
}

const SOURCES = {
  BLOOMBERG: 'https://www.bloomberg.com/news/articles/2026-10-16/ai-training-jobs-are-attracting-doctors-lawyers-and-engineers',
  PYMNTS: 'https://www.pymnts.com/news/artificial-intelligence/2026/ai-labs-pay-lawyers-400-an-hour-to-train-models/',
  MERCOR_LEGAL: 'https://work.mercor.com/jobs/list_AAABmKp5u6OLRyAhur1NUaEr/legal-expert',
  MICRO1_EXPERTS: 'https://micro1.ai/experts',
  ABA_512: 'https://www.americanbar.org/news/abanews/aba-news-archives/2024/07/aba-issues-first-ethics-guidance-ai-tools/',
};

const ext = (href: string, label: React.ReactNode) =>
  <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{label}</a>;
const jobLink = (job: Job) =>
  <Link href={`/jobs/${job.slug}`} className="underline decoration-border underline-offset-4 hover:decoration-foreground">{job.title}</Link>;

const pct = (values: number[], p: number) => {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] : 0;
};
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-t border-border text-left text-sm">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            {head.map((cell, i) => <th key={cell} className={`py-2.5 pr-4 font-medium ${i ? 'text-right' : ''}`}>{cell}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-border">
              {row.map((cell, i) => <td key={i} className={`py-2.5 pr-4 ${i ? 'text-right tabular-nums' : ''}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Law                                                                 */
/* ------------------------------------------------------------------ */

/** Practice areas matched on the role title; anything unmatched counts as a general legal expert role. */
const PRACTICE_AREAS: { label: string; match: RegExp }[] = [
  { label: 'Litigation & disputes', match: /litigat|trial|dispute|arbitrat/i },
  { label: 'Corporate, M&A & finance', match: /corporate|m&a|venture|private equity|capital markets|securities|fund|structured finance|banking/i },
  { label: 'Regulatory & compliance', match: /regulat|compliance|fda|antitrust|product safety|risk/i },
  { label: 'IP & patents', match: /patent|intellectual|trademark|\bIP\b/i },
  { label: 'Tax', match: /\btax/i },
  { label: 'Employment', match: /employ|labou?r/i },
  { label: 'In-house & general counsel', match: /in-house|general counsel|senior counsel/i },
];

const NON_US = /\bUK\b|Germany|France|Spain|Japan|Korea|Australia|worldwide|global/i;
const roleText = (job: Job) => `${job.title} ${job.location}`;
const isParalegalOpen = (job: Job) => /paralegal/i.test(roleText(job));
const isInternational = (job: Job) => (job.applicant_countries || []).some((c) => c !== 'United States') || NON_US.test(roleText(job));
const isUsOnly = (job: Job) => {
  if (isInternational(job)) return false;
  const countries = job.applicant_countries || [];
  return (countries.length === 1 && countries[0] === 'United States') || /\bU\.?S\.?\b|United States/.test(roleText(job));
};

function lawStats(field: TrainingField) {
  const jobs = field.jobs;
  const tops = jobs.map(hourlyMax).filter(Boolean);
  const lows = jobs.map((job) => job.hourly_min || 0).filter(Boolean);
  const platform = (source: string) => {
    const list = jobs.filter((job) => job.source === source);
    return { count: list.length, median: pct(list.map(hourlyMax), 0.5), top: Math.max(0, ...list.map(hourlyMax)) };
  };
  const areas = PRACTICE_AREAS.map(({ label, match }) => {
    const list = jobs.filter((job) => match.test(job.title)).sort(byPay);
    return { label, count: list.length, median: pct(list.map(hourlyMax), 0.5), best: list[0] };
  }).filter((area) => area.count > 0).sort((a, b) => b.median - a.median || b.count - a.count);
  return {
    total: jobs.length,
    medianTop: pct(tops, 0.5),
    p25Top: pct(tops, 0.25),
    p75Top: pct(tops, 0.75),
    medianLow: pct(lows, 0.5),
    topRate: field.topRate,
    atTop: jobs.filter((job) => hourlyMax(job) === field.topRate),
    micro1: platform('micro1'),
    mercor: platform('mercor'),
    areas,
    paralegal: jobs.filter(isParalegalOpen),
    usOnly: jobs.filter(isUsOnly).length,
    international: jobs.filter(isInternational).length,
    intlBySource: (source: string) => jobs.filter((job) => job.source === source && isInternational(job)).length,
    contract: jobs.filter((job) => /contract|part-time/i.test(job.job_type || '')).length,
  };
}

function LawGuide({ field }: { field: TrainingField }) {
  const s = lawStats(field);
  return (
    <>
      <p>
        <strong>
          AI labs pay lawyers to write hard legal problems, grade the answers their models give, and build the rubrics those answers are scored
          against.
        </strong>{' '}
        Across the {s.total} legal roles open on micro1 and Mercor right now, the top of the advertised range has a median of ${s.medianTop}/hr, and
        the bottom of the range has a median of ${s.medianLow}/hr. The ${s.topRate}/hr headline figure is real, but it applies to{' '}
        {plural(s.atTop.length, 'listing')} for specific senior specialties. Most work pays between ${s.p25Top} and ${s.p75Top}/hr at the top of the range.
      </p>
      <p>
        This guide covers what the work involves, which practice areas pay most, how the two platforms compare, how to get through screening,
        and the professional-conduct questions to settle before you take a contract.
      </p>

      <h2>What lawyers actually do in AI training work</h2>
      <p>
        Models already know black-letter law. They fail where a junior associate would: missing the controlling exception, misreading procedural
        posture, or citing a case that does not support the proposition. Labs hire practising lawyers to find and fix those failures. The work
        usually falls into three tasks:
      </p>
      <ul>
        <li>
          <strong>Writing problems.</strong> You draft a realistic, hard question in your practice area along with a reference answer, the kind
          of issue that separates a competent answer from a merely plausible one.
        </li>
        <li>
          <strong>Grading model output.</strong> You review legal work a model has drafted, such as a memo, a contract clause or a research
          answer. You check whether each citation supports the point it is offered for, and flag where the model{' '}
          {ext(SOURCES.MERCOR_LEGAL, '“states the law correctly and would still lose”')}.
        </li>
        <li>
          <strong>Building rubrics.</strong> You turn your judgment into explicit, gradable criteria, so the lab can score thousands of model
          answers consistently.
        </li>
      </ul>
      <p>
        It is closer to writing a law school exam and its model answer than to document review, which is why it pays like expert work rather
        than review work.
      </p>

      <h2>Pay by practice area</h2>
      <p>Median top-of-range hourly rate for open roles, grouped by the practice area named in the role title:</p>
      <Table
        head={['Practice area', 'Open roles', 'Median top rate', 'Best-paying role']}
        rows={s.areas.map((area) => [area.label, area.count, `$${area.median}/hr`, area.best ? jobLink(area.best) : '—'])}
      />
      <p>
        Specialists earn the most.{s.areas.length > 1 && <> Right now {s.areas[0].label} and {s.areas[1].label} roles lead,</>}{' '}
        and named specialty listings generally pay more than general “legal expert” pools, because labs need problems a generalist could not
        write. If you have a specialty, apply to the listing that names it rather than to a general pool.
      </p>

      <h2>micro1 vs Mercor for lawyers</h2>
      <Table
        head={['', 'micro1', 'Mercor']}
        rows={[
          ['Open legal roles', s.micro1.count, s.mercor.count],
          ['Median top rate', s.micro1.median ? `$${s.micro1.median}/hr` : '—', s.mercor.median ? `$${s.mercor.median}/hr` : '—'],
          ['Highest listed rate', s.micro1.top ? `$${s.micro1.top}/hr` : '—', s.mercor.top ? `$${s.mercor.top}/hr` : '—'],
          ['Screening', 'AI interview on your background', 'Résumé, then a ~20-minute AI interview'],
          ['Engagement', 'Independent contractor', 'Independent contractor, paid weekly via Stripe or Wise'],
        ]}
      />
      <p>
        {s.micro1.count >= s.mercor.count ? 'micro1 has more legal listings' : 'Mercor has more legal listings'}, and micro1’s are split more finely by
        practice area. Mercor runs broader talent pools with a narrower pay band
        {s.intlBySource('mercor') > s.intlBySource('micro1') ? ', and more of its roles are open outside the US' : ''}. Applying to both costs nothing. Sources:{' '}
        {ext(SOURCES.MICRO1_EXPERTS, 'micro1’s expert page')}, {ext(SOURCES.MERCOR_LEGAL, 'Mercor’s legal expert listing')}.
      </p>

      <h2>Who qualifies</h2>
      <ul>
        <li>
          <strong>Most roles want a JD and practice experience.</strong> Senior and specialist listings usually ask for bar admission and years in
          the practice area they name.
        </li>
        <li>
          <strong>Not every role needs a licence.</strong> {s.paralegal.length > 0
            ? <>{plural(s.paralegal.length, 'open role')} {s.paralegal.length === 1 ? 'is' : 'are'} open to paralegals with US legal experience, and Mercor’s legal pool also takes compliance and policy professionals.</>
            : <>Mercor’s legal pool also takes paralegals and compliance and policy professionals.</>}
        </li>
        <li>
          <strong>Jurisdiction matters.</strong> About {s.usOnly} of the {s.total} roles are explicitly limited to US-qualified lawyers, and{' '}
          {s.international} {s.international === 1 ? 'is' : 'are'} open in other countries, including the UK, Germany, France, Spain, Japan, South
          Korea and Australia. Labs want local-law expertise in those markets too.
        </li>
      </ul>

      <h2>How to get hired</h2>
      <ol>
        <li>Pick the listing that matches your practice area. A specialist listing pays more and screens for exactly what you know.</li>
        <li>Lead your résumé with the matters you have handled, not your title. Reviewers look for depth in one area.</li>
        <li>
          Prepare for the AI interview as you would for a partner asking you to walk through a hard matter: the issue, the controlling
          authority, the counter-argument, and why you would advise the way you did.
        </li>
        <li>
          Expect a wait. Mercor says project invitations can arrive{' '}
          {ext(SOURCES.MERCOR_LEGAL, 'within a week or several months')}, and acceptance into a pool does not guarantee hours.
        </li>
      </ol>

      <h2>Professional conduct: settle these first</h2>
      <p>
        This work is not practising law for a client, but your professional obligations still follow you. We have not found a state bar opinion
        that addresses AI training work directly. The {ext(SOURCES.ABA_512, 'ABA’s Formal Opinion 512')} (July 2024) covers lawyers <em>using</em>{' '}
        generative AI, not training it. Until one does, the existing rules point to a few clear lines:
      </p>
      <ul>
        <li>
          <strong>Keep client information out of it, completely.</strong> Platforms ask for problems drawn from the kind of matters you have
          worked on. Build them as genuine hypotheticals. Change facts, parties and figures until nothing traces back to a client. Your
          confidentiality duties to current and former clients (Model Rules 1.6 and 1.9) do not stop at the training-data pipeline.
        </li>
        <li>
          <strong>Check your employer’s outside-work policy.</strong> Many firms and legal departments require approval for paid outside
          activity. Get it in writing before you start.
        </li>
        <li>
          <strong>Read the confidentiality agreement.</strong> Platform contracts typically restrict what you can say about the projects and the
          labs behind them. Know what you are signing.
        </li>
        <li>
          <strong>Plan for contractor taxes.</strong> You are paid as an independent contractor, so nothing is withheld. In the US, set aside for
          income and self-employment tax.
        </li>
      </ul>
      <p className="text-sm text-muted-foreground">This is general information, not legal or ethics advice. Check your jurisdiction’s rules.</p>

      <h2>The downsides</h2>
      <ul>
        <li>
          <strong>Hours are irregular.</strong> Projects can be extended, shortened or ended early. Bloomberg reported that work can dry up for
          weeks between assignments, and that Mercor told it its workers average $110/hr but it has no data on what share of tasks pay that rate
          ({ext(SOURCES.BLOOMBERG, 'Bloomberg')}, via {ext(SOURCES.PYMNTS, 'PYMNTS, October 2026')}).
        </li>
        <li>
          <strong>Data security.</strong> Mercor faced several class actions in April 2026 over a data breach, according to the same reporting.
          Share only what an application needs.
        </li>
        <li>
          <strong>Scams copy these listings.</strong> Legitimate platforms never charge you to apply or ask for bank details before a contract.
          Apply only through micro1.ai or mercor.com links.
        </li>
      </ul>

      <h2>Is it worth it?</h2>
      <p>
        For a specialist with a few free evenings a week, often yes. Typical listings run ${s.medianLow}–${s.medianTop}/hr, the work is remote,
        and you choose your hours. Treat it as variable side income, not a salary: apply to the listing that names your specialty, keep
        client information out of every task, and expect gaps between projects.
      </p>
    </>
  );
}

const lawFaqs = (field: TrainingField): FaqItem[] => {
  const s = lawStats(field);
  return [
    {
      question: 'Do you need to be a licensed attorney to do legal AI training work?',
      answer: `For most roles, yes: listings typically ask for a JD, bar admission and practice experience in a named area. ${s.paralegal.length ? `${s.paralegal.length} open ${s.paralegal.length === 1 ? 'role is' : 'roles are'} open to paralegals with US legal experience, and ` : ''}Mercor’s legal pool also takes compliance and policy professionals.`,
    },
    {
      question: 'Is it ethical for a practising lawyer to train AI models?',
      answer: 'Generally yes, provided no client information is used. Write problems as genuine hypotheticals so nothing traces back to a current or former client (Model Rules 1.6 and 1.9), get your employer’s approval for paid outside work, and read the platform’s confidentiality agreement. No state bar has yet issued an opinion specific to this work.',
    },
    {
      question: 'How do lawyers get hired for AI training jobs?',
      answer: 'Apply to the micro1 or Mercor listing that names your practice area, then complete a short AI interview about your background (about 20 minutes on Mercor). Project invitations can take from a week to several months, and joining a pool does not guarantee hours.',
    },
    {
      question: 'How many hours a week is legal AI training work?',
      answer: `It varies by project. ${s.contract} of the ${s.total} open roles are contract or part-time, usually with flexible hours. Projects can be extended or end early, and work can pause for weeks between assignments.`,
    },
  ];
};

const GUIDES: Record<string, FieldGuide> = {
  law: { heading: 'How legal AI training work pays, and how to get it', Body: LawGuide, faqs: lawFaqs },
};

export const getFieldGuide = (slug: string): FieldGuide | undefined => GUIDES[slug];
