#!/usr/bin/env node
/**
 * Generate or enrich AI agent comparison content using web research + Anthropic API.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/generate-agent-comparisons.mjs
 *   node scripts/generate-agent-comparisons.mjs --dry-run
 *
 * Writes:
 *   web/data/agents.json
 *   web/data/comparisons.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const AGENTS_PATH = join(ROOT, 'web/data/agents.json');
const COMPARISONS_PATH = join(ROOT, 'web/data/comparisons.json');

const PAIRWISE_SLUGS = [
  'claude-code-vs-cursor',
  'claude-code-vs-codex',
  'cursor-vs-windsurf',
  'cline-vs-cursor',
  'kilo-code-vs-cline',
  'hermes-agent-vs-openclaw',
  'pi-vs-codebuff',
  'openclaw-vs-claude-code',
  'codex-vs-cursor',
  'hermes-agent-vs-claude-code',
];

const SEED_AGENTS = [
  {
    slug: 'hermes-agent',
    name: 'Hermes Agent',
    company: 'Nous Research',
    website: 'https://nousresearch.com',
    faviconUrl: 'https://nousresearch.com/favicon.ico',
    tokenUsage: '1.4T',
    rank: 1,
    tagline:
      'Open-source, self-improving AI agent with persistent memory and 40+ built-in tools.',
  },
  {
    slug: 'kilo-code',
    name: 'Kilo Code',
    company: 'Kilo Code',
    website: 'https://kilocode.ai',
    faviconUrl: 'https://kilocode.ai/favicon.ico',
    tokenUsage: '296B',
    rank: 2,
    tagline: 'Open-source AI coding agent for VS Code, JetBrains, and CLI.',
  },
  {
    slug: 'cline',
    name: 'Cline',
    company: 'Cline',
    website: 'https://cline.bot',
    faviconUrl: 'https://cline.bot/favicon.ico',
    tokenUsage: '228B',
    rank: 3,
    tagline: 'Open-source AI coding agent inside your IDE with browser automation.',
  },
  {
    slug: 'claude-code',
    name: 'Claude Code',
    company: 'Anthropic',
    website: 'https://claude.ai/code',
    faviconUrl: 'https://claude.ai/apple-touch-icon.png',
    tokenUsage: '222B',
    rank: 4,
    tagline: "Anthropic's agentic coding tool for planning and executing across your codebase.",
  },
  {
    slug: 'openclaw',
    name: 'OpenClaw',
    company: 'OpenClaw',
    website: 'https://openclaw.ai',
    faviconUrl: 'https://openclaw.ai/favicon.ico',
    tokenUsage: '131B',
    rank: 5,
    tagline: 'Open-source AI agent connected to messaging apps for real-world actions.',
  },
  {
    slug: 'pi',
    name: 'pi',
    company: 'pi',
    website: 'https://pi.dev',
    faviconUrl: 'https://pi.dev/favicon.ico',
    tokenUsage: '126B',
    rank: 6,
    tagline: 'There are many coding agents, but this one is yours.',
  },
  {
    slug: 'codebuff',
    name: 'Codebuff',
    company: 'Codebuff',
    website: 'https://codebuff.com',
    faviconUrl: 'https://codebuff.com/favicon.ico',
    tokenUsage: '41.5B',
    rank: 7,
    tagline: 'Self-improving CLI agent.',
  },
  {
    slug: 'codex',
    name: 'Codex',
    company: 'OpenAI',
    website: 'https://openai.com/codex',
    faviconUrl: 'https://openai.com/favicon.ico',
    tokenUsage: '39.9B',
    rank: 8,
    tagline: 'OpenAI coding agent to help you build and ship with AI.',
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    company: 'Anysphere',
    website: 'https://cursor.com',
    faviconUrl: 'https://cursor.com/favicon.ico',
    tokenUsage: null,
    rank: 9,
    tagline: 'The AI-native code editor used by millions of developers.',
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    company: 'Codeium',
    website: 'https://windsurf.com',
    faviconUrl: 'https://windsurf.com/favicon.ico',
    tokenUsage: null,
    rank: 10,
    tagline: 'Agentic IDE by Codeium with Cascade flows.',
  },
];

async function fetchPageText(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'artificialjobs-agent-research/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);
  } catch {
    return null;
  }
}

async function callAnthropic(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in model response');
  return JSON.parse(jsonMatch[0]);
}

function loadExisting(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

async function enrichAgent(agent, researchText, existing) {
  const existingAgent = existing?.find((a) => a.slug === agent.slug);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(`  skip ${agent.slug} (no API key, keeping existing)`);
    return existingAgent ?? agent;
  }

  const prompt = `You are a technical writer for artificialjobs.dev. Generate a JSON object for an AI coding agent profile.

Agent seed data:
${JSON.stringify(agent, null, 2)}

Research excerpt from ${agent.website}:
${researchText ?? 'No research available — use only seed data and mark unknowns conservatively.'}

Return ONLY valid JSON matching this schema (no markdown):
{
  "slug": string,
  "name": string,
  "company": string,
  "website": string,
  "faviconUrl": string,
  "tokenUsage": string | null,
  "rank": number,
  "tagline": string,
  "features": string[3-6],
  "platforms": string[],
  "pricing": string,
  "openSource": boolean,
  "bestFor": string[3],
  "pros": string[3],
  "cons": string[2-3],
  "quickAnswer": string (40-60 words),
  "bodySections": [{"heading": string, "content": string}],
  "faqs": [{"question": string, "answer": string}],
  "relatedSlugs": string[],
  "sourceUrls": string[]
}

Rules:
- Do not fabricate statistics or pricing numbers; use "unknown" or general ranges if unsure
- Preserve slug, rank, tokenUsage, faviconUrl from seed
- relatedSlugs should reference other agent slugs from: hermes-agent, kilo-code, cline, claude-code, openclaw, pi, codebuff, codex, cursor, windsurf
- faqs: 2-3 items`;

  console.log(`  enriching ${agent.slug}...`);
  return callAnthropic(prompt);
}

async function enrichComparison(slug, agents) {
  const [aSlug, bSlug] = slug.split('-vs-');
  const agentA = agents.find((a) => a.slug === aSlug);
  const agentB = agents.find((a) => a.slug === bSlug);
  if (!agentA || !agentB) throw new Error(`Missing agents for ${slug}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    const existing = loadExisting(COMPARISONS_PATH);
    return existing?.find((c) => c.slug === slug);
  }

  const prompt = `Generate a JSON object for a head-to-head AI agent comparison page on artificialjobs.dev.

Agent A: ${JSON.stringify({ slug: agentA.slug, name: agentA.name, tagline: agentA.tagline })}
Agent B: ${JSON.stringify({ slug: agentB.slug, name: agentB.name, tagline: agentB.tagline })}

Slug: ${slug}

Return ONLY valid JSON:
{
  "slug": "${slug}",
  "agentA": "${aSlug}",
  "agentB": "${bSlug}",
  "quickAnswer": string (40-60 words),
  "verdict": string,
  "criteria": [{"label": string, "agentA": string, "agentB": string, "winner": "a"|"b"|"tie"}],
  "bestForA": string[3],
  "bestForB": string[3],
  "faqs": [{"question": string, "answer": string}],
  "sourceUrls": string[]
}

Rules: 4-6 criteria rows, 1-2 faqs, no fabricated stats`;

  console.log(`  enriching comparison ${slug}...`);
  return callAnthropic(prompt);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const existingAgents = loadExisting(AGENTS_PATH) ?? [];
  const existingComparisons = loadExisting(COMPARISONS_PATH) ?? [];

  console.log('Researching agents...');
  const research = {};
  for (const agent of SEED_AGENTS) {
    research[agent.slug] = await fetchPageText(agent.website);
  }

  let agents;
  if (process.env.ANTHROPIC_API_KEY) {
    agents = [];
    for (const seed of SEED_AGENTS) {
      try {
        const enriched = await enrichAgent(seed, research[seed.slug], existingAgents);
        agents.push(enriched);
      } catch (err) {
        console.warn(`  failed ${seed.slug}: ${err.message} — using existing`);
        const fallback = existingAgents.find((a) => a.slug === seed.slug);
        if (fallback) agents.push(fallback);
      }
    }
  } else {
    console.log('No ANTHROPIC_API_KEY — using existing agents.json');
    agents = existingAgents.length ? existingAgents : [];
    if (!agents.length) {
      console.error('No existing agents.json and no API key. Commit seed data first.');
      process.exit(1);
    }
  }

  let comparisons;
  if (process.env.ANTHROPIC_API_KEY) {
    comparisons = [];
    for (const slug of PAIRWISE_SLUGS) {
      try {
        const c = await enrichComparison(slug, agents);
        if (c) comparisons.push(c);
      } catch (err) {
        console.warn(`  failed ${slug}: ${err.message} — using existing`);
        const fallback = existingComparisons.find((c) => c.slug === slug);
        if (fallback) comparisons.push(fallback);
      }
    }
  } else {
    console.log('No ANTHROPIC_API_KEY — using existing comparisons.json');
    comparisons = existingComparisons.length ? existingComparisons : [];
  }

  if (dryRun) {
    console.log('Dry run — would write', agents.length, 'agents and', comparisons.length, 'comparisons');
    return;
  }

  writeFileSync(AGENTS_PATH, JSON.stringify(agents, null, 2) + '\n');
  writeFileSync(COMPARISONS_PATH, JSON.stringify(comparisons, null, 2) + '\n');
  console.log(`Wrote ${agents.length} agents → ${AGENTS_PATH}`);
  console.log(`Wrote ${comparisons.length} comparisons → ${COMPARISONS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
