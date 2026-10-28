import Link from 'next/link';
import { trainingJobs, type Job } from './jobs';
import { getTrainingFields, getTrainingCollections, byPay, hourlyMax, formatPay, trainingStats } from './training-jobs';
import { partnerships, COMPANY_PAYOUT, isDefunct, MERCOR_WANTED, MERCOR_TOP_PAYOUT, MERCOR_REFERRAL_CODE, MERCOR_APPLY_URL } from './data-partnerships';
import type { FaqItem } from '@/components/faq-section';

/**
 * Blog posts. Bodies compute their numbers from the live listings at build time, so every
 * figure matches the daily refresh and `modified` tracks the data, not the prose.
 */
export interface Post {
  slug: string;
  title: string;
  description: string;
  published: string;
  /** Who the post is for; shown on the index. */
  kicker: string;
  Body: () => React.ReactNode;
  faqs: () => FaqItem[];
}

const monthYear = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export function median(values: number[]) {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
}

const medianRate = (jobs: Job[]) => median(jobs.map(hourlyMax));
const hourly = (jobs: Job[]) => jobs.filter((job) => job.hourly_max);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Most recent verification across the listings: the date the data (and so the post) last changed. */
export function dataUpdated(): string {
  const times = trainingJobs.map((job) => Date.parse(job.last_verified || '')).filter(Number.isFinite);
  return new Date(times.length ? Math.max(...times) : Date.now()).toISOString();
}

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

const jobLink = (job: Job) => <Link href={`/jobs/${job.slug}`} className="underline decoration-border underline-offset-4 hover:decoration-foreground">{job.title}</Link>;
const fieldLink = (slug: string, label: string) => <Link href={`/ai-training-jobs/${slug}`} className="underline decoration-border underline-offset-4 hover:decoration-foreground">{label}</Link>;
const SourceNote = ({ children }: { children: React.ReactNode }) => <p className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">{children}</p>;

/* ------------------------------------------------------------------ */

function payData() {
  const withPay = hourly(trainingJobs);
  const rates = withPay.map(hourlyMax);
  const bands: [string, number, number][] = [['Under $30/hr', 0, 30], ['$30–$59/hr', 30, 60], ['$60–$99/hr', 60, 100], ['$100–$199/hr', 100, 200], ['$200/hr and up', 200, Infinity]];
  const fields = getTrainingFields().filter((field) => hourly(field.jobs).length >= 3);
  const salaried = trainingJobs.filter((job) => !job.hourly_max && job.salary_max);
  return { withPay, rates, bands, fields, salaried, stats: trainingStats() };
}

function PayBody() {
  const { withPay, rates, bands, fields, salaried, stats } = payData();
  const sortedFields = [...fields].sort((a, b) => medianRate(b.jobs) - medianRate(a.jobs));
  const top = sortedFields[0], bottom = sortedFields.at(-1)!;
  const credentialed = fields.filter((f) => ['law', 'medicine', 'sciences-research', 'finance'].includes(f.slug)).flatMap((f) => f.jobs);
  const entry = fields.filter((f) => ['generalist', 'language-audio'].includes(f.slug)).flatMap((f) => f.jobs);
  return (
    <>
      <p>
        <strong>AI training jobs pay a median of ${stats.medianRate}/hr at the top of their posted range</strong>, based on{' '}
        {withPay.length} live listings on micro1 with posted pay as of {monthYear()}. Rates run from ${Math.min(...rates)}/hr for simple recording
        and transcription gigs to ${stats.topRate}/hr for specialist attorneys and PhD researchers. Credentials are the single biggest driver:
        roles for lawyers, doctors, scientists and finance professionals have a median top rate of ${medianRate(credentialed)}/hr, against ${medianRate(entry)}/hr
        for generalist and language roles.
      </p>
      <h2>How AI training pay is distributed</h2>
      <p>Most listings cluster between $60 and $200 an hour. Here is how the {withPay.length} hourly listings break down by the top of their range:</p>
      <Table
        head={['Top of posted range', 'Listings', 'Share']}
        rows={bands.map(([label, lo, hi]) => {
          const n = rates.filter((rate) => rate >= lo && rate < hi).length;
          return [label, n, `${Math.round((n / rates.length) * 100)}%`];
        })}
      />
      <h2>Pay by field</h2>
      <p>
        {top.label} pays the most, with a median top rate of ${medianRate(top.jobs)}/hr. {bottom.label} pays the least at ${medianRate(bottom.jobs)}/hr.
        Fields with at least three hourly listings:
      </p>
      <Table
        head={['Field', 'Listings', 'Median top rate', 'Highest']}
        rows={sortedFields.map((field) => [fieldLink(field.slug, field.label), field.jobs.length, `$${medianRate(field.jobs)}/hr`, `$${field.topRate}/hr`])}
      />
      <h2>What pushes the rate up</h2>
      <h3>Professional credentials</h3>
      <p>
        AI labs pay for judgment a non-expert can’t supply: whether a contract clause is enforceable, whether a dosing note is safe, whether a proof
        holds. That is why licensed and doctoral roles sit at the top of the table. Listings in these fields usually ask for a license, board
        certification or a PhD in the title itself.
      </p>
      <h3>Scarce languages and specialisms</h3>
      <p>
        Language roles pay more when fewer qualified speakers exist. The best-paid language listings right now are{' '}
        {hourly(entry).filter((job) => job.field === 'language-audio').sort(byPay).slice(0, 2).map((job, i) => <span key={job.slug}>{i ? ' and ' : ''}{jobLink(job)} ({formatPay(job)})</span>)}.
      </p>
      <h3>Demand</h3>
      <p>
        {stats.highDemand} of {stats.total} open roles are flagged high demand by micro1. These are the roles most likely to move applicants quickly
        from interview to paid work.
      </p>
      {salaried.length > 0 && (
        <>
          <h2>Salaried roles</h2>
          <p>
            Not everything is hourly. {plural(salaried.length, 'listing')} {salaried.length === 1 ? 'is a' : 'are'} full-time position{salaried.length === 1 ? '' : 's'} with
            stated base salaries from ${Math.round(Math.min(...salaried.map((job) => job.salary_min)) / 1000)}K to ${Math.round(Math.max(...salaried.map((job) => job.salary_max)) / 1000)}K a year,
            mostly research and engineering staff roles.
          </p>
        </>
      )}
      <h2>What the posted rate doesn’t tell you</h2>
      <ul>
        <li><strong>It’s the top of a range.</strong> Figures here are the top of each posted range; starting rates can be lower.</li>
        <li><strong>Hours aren’t guaranteed.</strong> This is project-based contract work. Passing the interview puts you in the pool; it doesn’t promise a set number of hours.</li>
        <li><strong>Location limits apply.</strong> Many roles are open only to applicants in certain countries, which each listing states.</li>
      </ul>
      <p>
        Browse the <Link href="/" className="underline underline-offset-4">full list of open roles</Link>, ranked by pay, or see{' '}
        <Link href="/micro1" className="underline underline-offset-4">our micro1 review</Link> for how the hiring process works. For a citable monthly
        snapshot with a CSV download, see the <Link href="/pay-index" className="underline underline-offset-4">micro1 Pay Index</Link>.
      </p>
      <SourceNote>
        Source: every open listing in micro1’s referral job feed and its public job pages (jobs.micro1.ai), refreshed daily. Rates are the top of
        each listing’s posted hourly range. Salaried figures are the base salary stated in the listing.
      </SourceNote>
    </>
  );
}

/* ------------------------------------------------------------------ */

function lawData() {
  const jobs = trainingJobs.filter((job) => job.field === 'law').sort(byPay);
  const skills = new Map<string, number>();
  for (const job of jobs) for (const skill of new Set((job.skills || []).map((s) => s.toLowerCase()))) skills.set(skill, (skills.get(skill) || 0) + 1);
  const topSkills = [...skills].filter(([skill]) => !/communication|attention to detail|collaboration|critical thinking/.test(skill)).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return { jobs, topSkills };
}

function LawBody() {
  const { jobs, topSkills } = lawData();
  const rates = hourly(jobs).map(hourlyMax);
  const highDemand = jobs.filter((job) => job.high_demand).length;
  const over100 = rates.filter((rate) => rate >= 100).length;
  const titles = [...new Set(jobs.map((job) => job.title.replace(/\s*\(.*?\)\s*/g, '').trim()))];
  return (
    <>
      <p>
        <strong>There are {jobs.length} open AI training jobs for lawyers on micro1</strong> as of {monthYear()}, paying a median of ${median(rates)}/hr at the
        top of their range and up to ${Math.max(...rates)}/hr. {over100} of them pay $100/hr or more. The work is remote, hourly contracting: attorneys review,
        write and grade the legal answers AI models learn from, so the models reason about contracts, regulations and case law the way a practising lawyer would.
      </p>
      <h2>What the work involves</h2>
      <p>
        AI labs need lawyers to tell them when a model’s legal answer is wrong, incomplete or dangerously confident. In practice that means
        writing model answers to realistic legal questions, grading AI responses against them, and explaining the error when the model misses an
        exception or misstates a rule. The skills micro1’s law listings ask for most often:
      </p>
      <Table head={['Skill', 'Listings asking for it']} rows={topSkills.map(([skill, n]) => [skill[0].toUpperCase() + skill.slice(1), `${n} of ${jobs.length}`])} />
      <h2>Practice areas hiring</h2>
      <p>Listings are split by practice area, so a specialist is matched to questions in their own field. Open roles right now include:</p>
      <ul className="columns-1 sm:columns-2">
        {titles.slice(0, 24).map((title) => <li key={title}>{title}</li>)}
      </ul>
      <h2>What it pays</h2>
      <p>
        {highDemand} of the {jobs.length} law listings are flagged high demand. The ten best-paying roles:
      </p>
      <Table head={['Role', 'Pay']} rows={jobs.slice(0, 10).map((job) => [jobLink(job), formatPay(job) ?? 'On application'])} />
      <h2>Who qualifies</h2>
      <p>
        Most listings are written for licensed attorneys, and many name a jurisdiction or practice area in the title, such as US-licensed or
        BigLaw experience. Pay tracks seniority and specialism: niche transactional and regulatory areas sit at the top of the range. Check each
        listing’s country limits before applying.
      </p>
      <h2>How to apply</h2>
      <ol>
        <li>Pick the listing closest to your practice area and apply on micro1.</li>
        <li>Complete micro1’s AI interview, which asks about your legal background.</li>
        <li>If you pass, micro1 onboards you and matches you to a project at the listed rate.</li>
      </ol>
      <p>
        See all {fieldLink('law', `${jobs.length} AI training jobs for lawyers`)}, ranked by pay, or read{' '}
        <Link href="/blog/how-much-do-ai-training-jobs-pay" className="underline underline-offset-4">how AI training pay compares across fields</Link>.
      </p>
      <SourceNote>Source: open law listings in micro1’s referral job feed and public job pages, refreshed daily. Skill counts are from each listing’s required skills.</SourceNote>
    </>
  );
}

/* ------------------------------------------------------------------ */

function codingData() {
  const jobs = trainingJobs.filter((job) => job.field === 'software-engineering').sort(byPay);
  const languages = getTrainingCollections().filter((c) => c.group === 'language');
  const tasks = new Map<string, number>();
  for (const job of jobs) for (const skill of new Set((job.skills || []).map((s) => s.toLowerCase()))) tasks.set(skill, (tasks.get(skill) || 0) + 1);
  const topTasks = [...tasks].filter(([skill]) => /refactor|bug|feature|performance|review|algorithm|debug/.test(skill)).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return { jobs, languages, topTasks };
}

function CodingBody() {
  const { jobs, languages, topTasks } = codingData();
  const rates = hourly(jobs).map(hourlyMax);
  const over100 = rates.filter((rate) => rate >= 100).length;
  const salaried = jobs.filter((job) => !job.hourly_max && job.salary_max).length;
  return (
    <>
      <p>
        <strong>There are {jobs.length} open AI training jobs for software engineers on micro1</strong> as of {monthYear()}, paying a median of ${median(rates)}/hr at
        the top of their range and up to ${Math.max(...rates)}/hr. {over100} of them pay $100/hr or more. The work is remote, hourly contracting: engineers
        write, fix and review the code AI coding models learn from, so the models handle real codebases the way an experienced developer would.
      </p>
      <h2>What the work involves</h2>
      <p>
        Coding models are trained on examples of real engineering work. Labs pay developers to produce those examples: fixing a real bug in an open
        source repository, implementing a feature end to end, refactoring messy code, or grading an AI-written patch and explaining what it got wrong.
        The tasks micro1’s software listings name most often:
      </p>
      <Table head={['Task', 'Listings asking for it']} rows={topTasks.map(([skill, n]) => [skill[0].toUpperCase() + skill.slice(1), `${n} of ${jobs.length}`])} />
      <h2>Which languages are hiring</h2>
      <p>
        Most coding listings ask for more than one language. Counting every open micro1 role that names each one, across all fields:
      </p>
      <Table
        head={['Language or focus', 'Open roles', 'Top rate']}
        rows={languages.map((c) => [fieldLink(c.slug, c.label), String(c.jobs.length), c.topRate ? `$${c.topRate}/hr` : '—'])}
      />
      <h2>What it pays</h2>
      <p>The ten best-paying software roles right now:</p>
      <Table head={['Role', 'Pay']} rows={jobs.slice(0, 10).map((job) => [jobLink(job), formatPay(job) ?? 'On application'])} />
      {salaried > 0 && (
        <p>
          {plural(salaried, 'listing')} {salaried === 1 ? 'is a salaried role rather than an hourly contract' : 'are salaried roles rather than hourly contracts'} and {salaried === 1 ? 'shows' : 'show'} an annual range instead.
        </p>
      )}
      <h2>Who qualifies</h2>
      <p>
        Listings are written for working engineers. The open source roles are titled for GitHub contributors and maintainers, so a public commit
        history you can point to is the clearest qualification. Check each listing’s country limits before applying.
      </p>
      <h2>How to apply</h2>
      <ol>
        <li>Pick the listing that matches your strongest language and apply on micro1.</li>
        <li>Complete micro1’s AI interview, which asks about your engineering background.</li>
        <li>If you pass, micro1 onboards you and matches you to a project at the listed rate.</li>
      </ol>
      <p>
        See all {fieldLink('software-engineering', `${jobs.length} AI training jobs for software engineers`)}, ranked by pay, or read{' '}
        <Link href="/blog/how-much-do-ai-training-jobs-pay" className="underline underline-offset-4">how AI training pay compares across fields</Link>.
      </p>
      <SourceNote>Source: open software engineering listings in micro1’s referral job feed and public job pages, refreshed daily. Language counts include coding roles in every field.</SourceNote>
    </>
  );
}

/* ------------------------------------------------------------------ */

function entryData() {
  const jobs = trainingJobs.filter((job) => ['generalist', 'language-audio'].includes(job.field || '')).sort(byPay);
  const credentialed = trainingJobs.filter((job) => ['law', 'medicine', 'sciences-research'].includes(job.field || ''));
  return { jobs, credentialed };
}

function EntryBody() {
  const { jobs, credentialed } = entryData();
  const rates = hourly(jobs).map(hourlyMax);
  const language = jobs.filter((job) => job.field === 'language-audio');
  const general = jobs.filter((job) => job.field === 'generalist');
  return (
    <>
      <p>
        <strong>Yes, there are AI training jobs you can get without professional credentials</strong>, but they pay less. As of {monthYear()}, micro1 lists{' '}
        {jobs.length} generalist and language roles with a median top rate of ${median(rates)}/hr, compared with ${medianRate(credentialed)}/hr for law, medicine and
        research roles. The realistic entry points are AI product testing, evaluation and, if you speak a second language natively, transcription
        and language review.
      </p>
      <h2>Generalist roles</h2>
      <p>
        {general.length} generalist roles are open. These ask you to test AI products, evaluate assistant responses or record everyday tasks, and they
        reward careful, consistent work more than a specific degree.
      </p>
      <Table head={['Role', 'Pay']} rows={general.slice(0, 10).map((job) => [jobLink(job), formatPay(job) ?? 'On application'])} />
      <h2>Language and audio roles</h2>
      <p>
        {language.length} language and audio roles are open. Native fluency is the credential here, and rarer languages tend to pay more.
      </p>
      <Table head={['Role', 'Pay']} rows={language.slice(0, 10).map((job) => [jobLink(job), formatPay(job) ?? 'On application'])} />
      <h2>How to get hired without experience</h2>
      <ul>
        <li><strong>Apply where your strengths are real.</strong> A native language or deep hobby knowledge is a genuine qualification for many roles.</li>
        <li><strong>Prepare for the AI interview.</strong> micro1 screens every applicant with an AI interviewer. Answer concretely and give examples.</li>
        <li><strong>Read the country limits.</strong> Many entry-level roles are open only in specific countries, and some, like recording gigs, are regional.</li>
        <li><strong>Treat it as flexible income.</strong> Work comes in projects, and hours aren’t guaranteed.</li>
      </ul>
      <h2>How to spot a fake AI training job</h2>
      <p>
        Real AI training work doesn’t charge you to apply, buy equipment or pay for a “certification” first. Apply through the company’s own site
        (for micro1, links on micro1.ai), and be wary of recruiters who contact you on messaging apps and move fast to payment details.
      </p>
      <p>
        Browse all {fieldLink('generalist', 'generalist')} and {fieldLink('language-audio', 'language')} roles, or see{' '}
        <Link href="/blog/how-much-do-ai-training-jobs-pay" className="underline underline-offset-4">what credentialed roles pay</Link>.
      </p>
      <SourceNote>Source: open generalist and language listings in micro1’s referral job feed, refreshed daily. Rates are the top of each posted hourly range.</SourceNote>
    </>
  );
}

/* ------------------------------------------------------------------ */

function DataBody() {
  return (
    <>
      <p>
        <strong>Companies can sell their internal data to AI labs through data partnership programs run by micro1 and Mercor</strong>, which pay
        {` ${COMPANY_PAYOUT}`} (micro1) and up to {MERCOR_TOP_PAYOUT} (Mercor) for approved data. Labs want records of real work: internal chat, process
        documentation, project files and operational records that show how professionals actually do their jobs. Even companies that have shut
        down can qualify, because their archives still hold that history.
      </p>
      <h2>Why AI labs buy company data</h2>
      <p>
        Models have already been trained on much of the public web. What they still lack is the messy, multi-step reality of work inside a company:
        how a team scopes a project, resolves an incident or closes a deal. Anonymised internal records are one of the few sources of that.
      </p>
      <h2>micro1’s programs</h2>
      <Table
        head={['Program', 'Best for', 'Requirements']}
        rows={partnerships.map((deal) => [deal.title, isDefunct(deal) ? 'Closed or defunct companies' : 'Operating companies', deal.requirements.slice(0, 3).join(', ')])}
      />
      <p>micro1 says approved data packages earn the company {COMPANY_PAYOUT}, depending on size and quality.</p>
      <h2>What Mercor is buying</h2>
      <p>Mercor publishes the company types it is looking for and what each can earn:</p>
      <Table head={['Company type', 'Size', 'Earns']} rows={MERCOR_WANTED.map((item) => [item.title, item.size, item.earns])} />
      <p>
        Mercor applications go through{' '}
        <a href={MERCOR_APPLY_URL} target="_blank" rel="sponsored noopener noreferrer" className="underline underline-offset-4">data.mercor.com</a>, with referral code{' '}
        <strong className="font-mono">{MERCOR_REFERRAL_CODE}</strong>.
      </p>
      <h2>How the process works</h2>
      <ol>
        <li>Create a company profile describing your size, industry and the data you hold.</li>
        <li>The buyer reviews whether your data matches what labs are asking for.</li>
        <li>If approved, the data is anonymised and packaged, and the company is paid for the approved package.</li>
      </ol>
      <h2>Before you sell</h2>
      <ul>
        <li><strong>Confirm you own it.</strong> For a defunct company, check who holds the rights to its assets after the wind-down.</li>
        <li><strong>Check privacy obligations.</strong> Employee and customer data may be covered by contracts and privacy law in each country you operated in.</li>
        <li><strong>Get legal review.</strong> Have counsel read the data agreement before you sign. This post is not legal advice.</li>
      </ul>
      <p>
        Compare both programs side by side on <Link href="/sell-company-data" className="underline underline-offset-4">our sell company data page</Link>, or see{' '}
        <Link href="/sell-company-data/what-is-it-worth" className="underline underline-offset-4">every reported deal and a rough estimate of what your data is worth</Link>.
      </p>
      <SourceNote>
        Sources: micro1’s company data partnership listings (req.micro1.ai) and Mercor’s data referral page (data.mercor.com), October 2026. Links
        include our referral codes; Artificial Jobs may earn a fee if your company becomes a data partner.
      </SourceNote>
    </>
  );
}

/* ------------------------------------------------------------------ */

export const posts: Post[] = [
  {
    slug: 'how-much-do-ai-training-jobs-pay',
    kicker: 'Pay data',
    title: 'How Much Do AI Training Jobs Pay? Real Rates From Every Open Listing',
    description: 'Median and top hourly rates for AI training jobs by field, from every open micro1 listing, refreshed daily.',
    published: '2026-10-24',
    Body: PayBody,
    faqs: () => {
      const { stats, fields } = payData();
      const best = [...fields].sort((a, b) => medianRate(b.jobs) - medianRate(a.jobs))[0];
      return [
        { question: 'How much do AI training jobs pay per hour?', answer: `Across ${stats.total} open micro1 listings, the median top-of-range rate is $${stats.medianRate}/hr and the highest is $${stats.topRate}/hr (${monthYear()}).` },
        { question: 'Which AI training jobs pay the most?', answer: `${best.label} roles pay the most, with a median top rate of $${medianRate(best.jobs)}/hr. Licensed attorneys, physicians and PhD researchers command the highest rates.` },
        { question: 'Are AI training jobs full-time?', answer: 'Most are hourly, project-based contract roles with flexible hours that aren’t guaranteed. A minority are salaried full-time positions.' },
      ];
    },
  },
  {
    slug: 'ai-training-jobs-for-lawyers',
    kicker: 'For lawyers',
    title: 'AI Training Jobs for Lawyers: What the Work Is and What It Pays',
    description: 'What AI training work for attorneys involves, which practice areas are hiring, and what it pays, from live micro1 listings.',
    published: '2026-10-24',
    Body: LawBody,
    faqs: () => {
      const { jobs } = lawData();
      const rates = hourly(jobs).map(hourlyMax);
      return [
        { question: 'How much do AI training jobs for lawyers pay?', answer: `${jobs.length} open micro1 law roles pay a median of $${median(rates)}/hr at the top of their range, and up to $${Math.max(...rates)}/hr (${monthYear()}).` },
        { question: 'Do I need to be a licensed attorney?', answer: 'Most listings are written for licensed attorneys and many name a jurisdiction or practice area. A few research and cite-checking roles suit earlier-career lawyers.' },
        { question: 'Is AI training work for lawyers remote?', answer: 'Yes. The roles are remote, flexible hourly contracts, though some are limited to applicants in specific countries.' },
      ];
    },
  },
  {
    slug: 'ai-training-jobs-for-software-engineers',
    kicker: 'For engineers',
    title: 'AI Training Jobs for Software Engineers: What the Work Is and What It Pays',
    description: 'What AI coding-model training work involves, which languages are hiring, and what it pays, from live micro1 listings.',
    published: '2026-10-28',
    Body: CodingBody,
    faqs: () => {
      const { jobs, languages } = codingData();
      const rates = hourly(jobs).map(hourlyMax);
      const top = [...languages].sort((a, b) => b.jobs.length - a.jobs.length)[0];
      return [
        { question: 'How much do AI training jobs for software engineers pay?', answer: `${jobs.length} open micro1 software roles pay a median of $${median(rates)}/hr at the top of their range, and up to $${Math.max(...rates)}/hr (${monthYear()}).` },
        { question: 'Which programming language has the most AI training jobs?', answer: `${top.label}: ${top.jobs.length} open micro1 roles ask for it (${monthYear()}). TypeScript, Rust, Java and C++ follow, often in the same listings.` },
        { question: 'What do software engineers do in AI training jobs?', answer: 'They fix real bugs, implement features, refactor code and review AI-written patches, producing the examples coding models learn from.' },
      ];
    },
  },
  {
    slug: 'ai-training-jobs-no-experience',
    kicker: 'Getting started',
    title: 'AI Training Jobs With No Experience: What’s Actually Open',
    description: 'The generalist and language AI training roles you can get without professional credentials, what they pay, and how to avoid scams.',
    published: '2026-10-24',
    Body: EntryBody,
    faqs: () => {
      const { jobs } = entryData();
      return [
        { question: 'Can I get an AI training job with no experience?', answer: `Yes. micro1 lists ${jobs.length} generalist and language roles that don’t require professional credentials, with a median top rate of $${median(hourly(jobs).map(hourlyMax))}/hr (${monthYear()}).` },
        { question: 'Do AI training jobs charge a fee to apply?', answer: 'Legitimate AI training work doesn’t charge applicants. Apply through the company’s own website and avoid anyone asking for payment up front.' },
      ];
    },
  },
  {
    slug: 'how-to-sell-company-data-to-ai-labs',
    kicker: 'For companies',
    title: 'How to Sell Your Company’s Data to AI Labs',
    description: `What AI labs buy, what micro1 and Mercor pay companies (${COMPANY_PAYOUT}), how the process works and what to check before you sell.`,
    published: '2026-10-24',
    Body: DataBody,
    faqs: () => [
      { question: 'How much can a company earn selling data to AI labs?', answer: `micro1 says approved data packages earn ${COMPANY_PAYOUT}; Mercor lists payouts up to ${MERCOR_TOP_PAYOUT} depending on industry and size.` },
      { question: 'Can a company that has shut down sell its data?', answer: 'Yes. micro1 runs a Defunct Company Data Partnership for closed companies with archived chat and documents, subject to ownership and privacy checks.' },
    ],
  },
];

export const getPost = (slug: string) => posts.find((post) => post.slug === slug);
