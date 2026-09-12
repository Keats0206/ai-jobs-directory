import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyLiveStats, type BoardStats } from './board-stats';

const stats: BoardStats = {
  total: 1133,
  remote: 590,
  remotePct: 52,
  companies: 738,
  remoteCompanies: 402,
  tags: {
    LLM: 606,
    RAG: 512,
    Agent: 463,
    Python: 385,
    Infrastructure: 330,
    Rust: 163,
    'Generative AI': 126,
    LangChain: 119,
    'Fine-tuning': 105,
  },
  avgAll: '$148k – $232k',
  avgRemote: '$150k – $233k',
  avgLlm: '$147k – $231k',
  publishedPay: 80,
  publishedLlm: 68,
  asOf: 'September 2026',
};

describe('applyLiveStats', () => {
  it('rewrites the August snapshot counts', () => {
    const input =
      'You can find remote AI engineering jobs on artificialjobs.dev, which lists 457 active roles with 236 remote positions as of August 2026. Filter by LLM (243 roles), RAG (187), and Agent (178).';
    const out = applyLiveStats(input, stats);
    assert.match(out, /1133 active roles/);
    assert.match(out, /590 remote positions/);
    assert.match(out, /September 2026/);
    assert.match(out, /LLM \(606 roles\)/);
    assert.match(out, /RAG \(512\)/);
    assert.match(out, /Agent \(463\)/);
    assert.doesNotMatch(out, /457/);
    assert.doesNotMatch(out, /August 2026/);
  });
});
