import { jobs, formatSalary, slugify } from './jobs';
import { salaryRange } from './job-quality';

export type BoardStats = {
  total: number;
  remote: number;
  remotePct: number;
  companies: number;
  remoteCompanies: number;
  tags: Record<string, number>;
  avgAll: string;
  avgRemote: string;
  avgLlm: string;
  publishedPay: number;
  publishedLlm: number;
  asOf: string;
};

function tagCount(tag: string): number {
  const needle = tag.toLowerCase();
  return jobs.filter((job) => job.tags?.some((t) => t.toLowerCase() === needle)).length;
}

function avgRange(list: typeof jobs): string {
  const ranges = list.map(salaryRange).filter((r): r is { min: number; max: number } => r !== null);
  if (ranges.length === 0) return 'not published';
  const min = Math.round(ranges.reduce((s, r) => s + r.min, 0) / ranges.length);
  const max = Math.round(ranges.reduce((s, r) => s + r.max, 0) / ranges.length);
  return formatSalary(min, max);
}

export function getBoardStats(): BoardStats {
  const remoteJobs = jobs.filter((job) => job.is_remote);
  const companies = new Set(jobs.map((job) => job.company).filter(Boolean));
  const remoteCompanies = new Set(remoteJobs.map((job) => job.company).filter(Boolean));
  const asOf = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return {
    total: jobs.length,
    remote: remoteJobs.length,
    remotePct: jobs.length ? Math.round((remoteJobs.length / jobs.length) * 100) : 0,
    companies: companies.size,
    remoteCompanies: remoteCompanies.size,
    tags: {
      LLM: tagCount('LLM'),
      RAG: tagCount('RAG'),
      Agent: tagCount('Agent'),
      Python: tagCount('Python'),
      Infrastructure: tagCount('Infrastructure'),
      Rust: tagCount('Rust'),
      'Generative AI': tagCount('Generative AI'),
      LangChain: tagCount('LangChain'),
      'Fine-tuning': tagCount('Fine-tuning'),
    },
    avgAll: avgRange(jobs),
    avgRemote: avgRange(remoteJobs),
    avgLlm: avgRange(jobs.filter((job) => job.tags?.some((t) => t.toLowerCase() === 'llm'))),
    publishedPay: jobs.filter((job) => salaryRange(job)).length,
    publishedLlm: jobs.filter(
      (job) => job.tags?.some((t) => t.toLowerCase() === 'llm') && salaryRange(job)
    ).length,
    asOf,
  };
}

/** Rewrite August 2026 snapshot numbers in GEO copy to live board stats. */
export function applyLiveStats(text: string, stats: BoardStats = getBoardStats()): string {
  const t = stats.tags;
  const replacements: Array<[RegExp, string]> = [
    [/August 2026/g, stats.asOf],
    [/Aug 2026/g, stats.asOf],
    [/\$148k\s*[–-]\s*\$232k/gi, stats.avgAll],
    [/\$148K\s*[–-]\s*\$232K/g, stats.avgAll.replace('k', 'K').replace('k', 'K')],
    [/\$147k\s*[–-]\s*\$231k/gi, stats.avgLlm],
    [/\$150k\s*[–-]\s*\$233k/gi, stats.avgRemote],
    [/\b457\b/g, String(stats.total)],
    [/\b243\b/g, String(t.LLM)],
    [/\b187\b/g, String(t.RAG)],
    [/\b178\b/g, String(t.Agent)],
    [/\b236\b/g, String(stats.remote)],
    [/\b146 unique companies\b/g, `${stats.companies} unique companies`],
    [/\b146 companies\b/g, `${stats.companies} companies`],
    [/\b92 remote-hiring companies\b/g, `${stats.remoteCompanies} remote-hiring companies`],
    [/\b92 companies\b/g, `${stats.remoteCompanies} companies`],
    [/\bPython\*\* \(140/g, `Python** (${t.Python}`],
    [/\bPython\*\* \(140 listings\)/g, `Python** (${t.Python} listings)`],
    [/\bPython\s+\(140\)/g, `Python (${t.Python})`],
    [/\| Python \| 140 \|/g, `| Python | ${t.Python} |`],
    [/\| \/remote\/python \) \| 140 \|/g, `| /remote/python) | ${t.Python} |`],
    [/\(\/remote\/python\) \| 140 \|/g, `(/remote/python) | ${t.Python} |`],
    [/\(\/remote\/infrastructure\) \| 120 \|/g, `(/remote/infrastructure) | ${t.Infrastructure} |`],
    [/\(\/remote\/rust\) \| 72 \|/g, `(/remote/rust) | ${t.Rust} |`],
    [/\(\/remote\/generative-ai\) \| 51 \|/g, `(/remote/generative-ai) | ${t['Generative AI']} |`],
    [/\bInfrastructure\*\* \(120/g, `Infrastructure** (${t.Infrastructure}`],
    [/\| Infrastructure \| 120 \|/g, `| Infrastructure | ${t.Infrastructure} |`],
    [/\bRust\*\* \(72/g, `Rust** (${t.Rust}`],
    [/\| Rust \| 72 \|/g, `| Rust | ${t.Rust} |`],
    [/\bGenerative AI\*\* \(51/g, `Generative AI** (${t['Generative AI']}`],
    [/\b51 Generative AI\b/g, `${t['Generative AI']} Generative AI`],
    [/\| LangChain \| 43 \|/g, `| LangChain | ${t.LangChain} |`],
    [/\bLangChain\*\* \(43/g, `LangChain** (${t.LangChain}`],
    [/\| Fine-tuning \| 39 \|/g, `| Fine-tuning | ${t['Fine-tuning']} |`],
    [/\b39 Fine-tuning\b/g, `${t['Fine-tuning']} Fine-tuning`],
    [/52% of the board/g, `${stats.remotePct}% of the board`],
  ];

  return replacements.reduce((body, [pattern, value]) => body.replace(pattern, value), text);
}

export function skillHref(tag: string): string {
  return `/remote/${slugify(tag)}`;
}
