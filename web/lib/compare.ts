import { trainingStats } from '@/lib/training-jobs';
import { micro1Jobs } from '@/lib/jobs';

/** A claim about a platform and where it came from. Every fact on a comparison page cites one. */
export interface Fact {
  text: string;
  source?: { label: string; url: string };
}

export interface Platform {
  slug: string;
  name: string;
  url: string;
  /** True when apply links carry our referral code. */
  referral: boolean;
  facts: {
    company: Fact;
    pay: Fact;
    screening: Fact;
    payout: Fact;
    hours: Fact;
    who: Fact;
    countries: Fact;
  };
  steps: string[];
  bestFor: string;
}

/** When the platform facts below were last checked against the sources they cite. */
export const FACTS_CHECKED = '2026-10-27';

const FORBES_MICRO1 = { label: 'Forbes, Sep 2026', url: 'https://www.forbes.com/sites/annatong/2026/09/22/this-25-year-old-raised-over-100-million-for-his-ai-data-startup-at-a-4-billion-valuation/' };
const MICRO1_EXPERTS = { label: 'micro1.ai/experts', url: 'https://micro1.ai/experts' };
const MERCOR_HOME = { label: 'mercor.com', url: 'https://www.mercor.com/' };
const MERCOR_LISTING = { label: 'Mercor job listing', url: 'https://work.mercor.com/jobs/list_AAABmKqDzYyJTg1wnqxB9K8r/consulting-expert' };
const OUTLIER_HOME = { label: 'outlier.ai', url: 'https://outlier.ai/' };

function micro1(): Platform {
  const stats = trainingStats(micro1Jobs);
  return {
    slug: 'micro1',
    name: 'micro1',
    url: 'https://micro1.ai/experts',
    referral: true,
    facts: {
      company: { text: 'AI data company that vets experts and supplies training data to AI labs. Forbes reported a $4B valuation in September 2026, citing people familiar with the round.', source: FORBES_MICRO1 },
      pay: { text: `Posted on every listing. Across ${stats.total} live roles we track, the median top rate is $${stats.medianRate}/hr and the highest is $${stats.topRate}/hr.`, source: { label: 'Artificial Jobs listings data', url: 'https://www.artificialjobs.dev/pay-index' } },
      screening: { text: 'Apply to a specific role, then an AI interview with Zara, micro1’s AI interviewer.', source: MICRO1_EXPERTS },
      payout: { text: 'Hourly contract pay. micro1 does not publish its payout provider or schedule.', source: MICRO1_EXPERTS },
      hours: { text: 'Project-based contract work; passing the interview does not guarantee hours.' },
      who: { text: 'Credentialed experts: lawyers, doctors, PhDs and engineers get the top rates; generalist and language roles pay less.' },
      countries: { text: 'micro1 lists 21 countries and regions where it cannot hire; many roles add their own country limits.', source: MICRO1_EXPERTS },
    },
    steps: ['Apply for a role', 'AI interview with Zara', 'Get onboarded', 'Start earning'],
    bestFor: 'Credentialed professionals who want to see the hourly rate before they apply.',
  };
}

const mercor: Platform = {
  slug: 'mercor',
  name: 'Mercor',
  url: 'https://work.mercor.com/',
  referral: false,
  facts: {
    company: { text: 'Expert marketplace that contracts professionals for AI labs. Says it has 5M+ experts in its network.', source: MERCOR_HOME },
    pay: { text: 'Posted on each listing. Mercor’s homepage gives an average contracted rate of $99/hr.', source: MERCOR_HOME },
    screening: { text: 'Upload a resume, then a short AI interview (about 20 minutes total). You join a pool and are invited to matching projects later.', source: MERCOR_LISTING },
    payout: { text: 'Weekly, via Stripe or Wise, as an independent contractor.', source: MERCOR_LISTING },
    hours: { text: 'Remote and on your own schedule; hours depend on being invited to projects.', source: MERCOR_LISTING },
    who: { text: 'Physicians, lawyers, engineers, consultants and other professionals.', source: MERCOR_HOME },
    countries: { text: 'Fully remote; listings note that H-1B and STEM OPT candidates aren’t supported.', source: MERCOR_LISTING },
  },
  steps: ['Apply with your resume', 'Short AI interview', 'Background verified, added to a pool', 'Invited to projects'],
  bestFor: 'Senior professionals happy to join a pool and wait for a matching project.',
};

const outlier: Platform = {
  slug: 'outlier',
  name: 'Outlier',
  url: 'https://outlier.ai/',
  referral: false,
  facts: {
    company: { text: 'Platform operated by Scale AI. Says 900K+ MAs, PhDs and graduates have worked on it, across 50 countries.', source: OUTLIER_HOME },
    pay: { text: 'Not published on its homepage, which promises “competitive pay + quality-based rewards”. Rates are set per project.', source: OUTLIER_HOME },
    screening: { text: 'Profile, skills import, ID verification and skill screenings, typically 30–90 minutes; each project adds its own onboarding.', source: OUTLIER_HOME },
    payout: { text: 'Paid weekly. Outlier’s homepage doesn’t name the payout method.', source: OUTLIER_HOME },
    hours: { text: 'No minimum hours.', source: OUTLIER_HOME },
    who: { text: 'At least undergraduate-level expertise in coding, STEM, languages and more; graduate degrees preferred. No AI experience needed.', source: OUTLIER_HOME },
    countries: { text: 'Needs a valid ID and mobile number from your country of residence, plus a resume and LinkedIn profile.', source: OUTLIER_HOME },
  },
  steps: ['Create a profile', 'Import and review skills', 'Verify your identity', 'Pass skill screenings'],
  bestFor: 'Graduates and generalists who want a large pool of tasks and no minimum hours.',
};

export interface Comparison {
  slug: string;
  a: Platform;
  b: Platform;
  /** One-paragraph answer that opens the page. */
  verdict: string;
  /** Labelled, hypothetical scenarios — never presented as real people. */
  scenarios: { who: string; pick: string; why: string }[];
  faqs: { question: string; answer: string }[];
}

export function getComparisons(): Comparison[] {
  const m = micro1();
  const stats = trainingStats(micro1Jobs);
  return [
    {
      slug: 'micro1-vs-mercor',
      a: m,
      b: mercor,
      verdict: `micro1 and Mercor both pay credentialed experts hourly to train AI, and both screen you with an AI interview. The difference is how you get work: micro1 has you apply to a specific role with its rate posted up front (median top rate $${stats.medianRate}/hr across ${stats.total} live roles), while Mercor adds you to a pool after the interview and invites you to projects later. Mercor publishes its payout terms (weekly, via Stripe or Wise); micro1 doesn’t.`,
      scenarios: [
        { who: 'A US-licensed attorney who wants work this month', pick: 'micro1', why: 'Apply straight to an open law role with the rate on the listing, rather than waiting in a pool.' },
        { who: 'A consultant who wants predictable payouts', pick: 'Mercor', why: 'Mercor states weekly payment via Stripe or Wise on its listings.' },
        { who: 'A PhD researcher keeping options open', pick: 'Both', why: 'The interviews are short and neither platform guarantees hours, so applying to both is common.' },
      ],
      faqs: [
        { question: 'Does micro1 or Mercor pay more?', answer: `It depends on the role. micro1’s live listings have a median top rate of $${stats.medianRate}/hr and go up to $${stats.topRate}/hr. Mercor gives an average contracted rate of $99/hr on its homepage. Both post the rate on each listing, so compare the specific role.` },
        { question: 'Do micro1 and Mercor both use AI interviews?', answer: 'Yes. micro1 interviews you with Zara, its AI interviewer, after you apply to a role. Mercor uses a short AI interview, about 20 minutes including the application, then adds you to a pool.' },
        { question: 'How do micro1 and Mercor pay?', answer: 'Mercor pays weekly via Stripe or Wise as an independent contractor. micro1 pays hourly contract rates but does not publish its payout provider or schedule.' },
        { question: 'Can I work for micro1 and Mercor at the same time?', answer: 'Both engage experts as contractors rather than employees, so many people apply to both. Check each project’s contract for exclusivity or confidentiality terms.' },
      ],
    },
    {
      slug: 'micro1-vs-outlier',
      a: m,
      b: outlier,
      verdict: `micro1 suits credentialed professionals who want to see the rate before applying: every listing posts its hourly range, with a median top rate of $${stats.medianRate}/hr across ${stats.total} live roles. Outlier, run by Scale AI, has a much larger pool of contributors and no minimum hours, but doesn’t publish rates on its homepage and adds onboarding for each project. Outlier states weekly pay; micro1 doesn’t publish its schedule.`,
      scenarios: [
        { who: 'A practising physician with limited time', pick: 'micro1', why: 'Rates are posted per role, and the best-paid micro1 roles go to medical and legal experts.' },
        { who: 'A recent graduate without a professional licence', pick: 'Outlier', why: 'Outlier asks for undergraduate-level expertise and has no minimum hours.' },
        { who: 'A bilingual writer', pick: 'Both', why: 'Both hire for language work; compare the posted rate on a micro1 role against the rate Outlier shows for a project.' },
      ],
      faqs: [
        { question: 'Does micro1 or Outlier pay more?', answer: `micro1 posts a rate on every listing: the median top rate is $${stats.medianRate}/hr across ${stats.total} live roles, up to $${stats.topRate}/hr. Outlier doesn’t publish rates on its homepage and sets pay per project, so there is no like-for-like average to compare.` },
        { question: 'Is Outlier owned by Scale AI?', answer: 'Outlier says on its site that it is a platform operated by Scale AI.' },
        { question: 'How long does it take to get started?', answer: 'Outlier says its onboarding typically takes 30 to 90 minutes, plus a separate onboarding for each project. micro1 has you apply to a role and take an AI interview with Zara before onboarding.' },
        { question: 'Which is better with no professional credentials?', answer: 'Outlier asks for undergraduate-level expertise and says no AI experience is needed. micro1’s highest rates go to licensed and PhD-level experts, though it also lists lower-paid generalist and language roles.' },
      ],
    },
  ];
}

export function getComparison(slug: string): Comparison | undefined {
  return getComparisons().find((c) => c.slug === slug);
}

export const COMPARE_DISCLOSURE =
  'micro1 apply links on this page include our referral code, and Artificial Jobs may earn a fee if you’re hired. We have no referral deal with Mercor or Outlier for expert work. Platform facts are taken from each company’s own pages and cited below.';
