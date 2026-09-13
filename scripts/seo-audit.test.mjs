import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inspect } from '../seo-test.mjs';
const url = 'https://example.com/jobs/engineer';
const html = `<title>AI Engineer at Example</title><meta content='Find an AI engineering role with published compensation and requirements.' name='description'><link href='${url}' rel='canonical'><meta content='Engineer' property='og:title'><meta property='og:description' content='Engineering role'><h1><span>AI Engineer</span></h1><script type='application/ld+json'>{"@type":"JobPosting"}</script>`;
test('accepts valid metadata regardless of attribute order and nested H1 content', () => {
  assert.deepEqual(inspect(html, url).issues, []);
});
test('fails an attractive 404 page with otherwise valid SEO', () => {
  assert.ok(inspect(html, url, 404).issues.includes('HTTP 404'));
});
test('detects indexing exclusions from HTTP headers', () => {
  assert.ok(inspect(html, url, 200, { 'x-robots-tag': 'noindex' }).issues.includes('Page is noindex'));
});
test('detects malformed JSON-LD, wrong canonical, and duplicate H1s', () => {
  const issues = inspect(html.replace('{"@type":"JobPosting"}', '{broken}') + '<h1>Duplicate</h1>', 'https://example.com/other').issues;
  assert.ok(issues.includes('Invalid JSON-LD'));
  assert.ok(issues.includes('Expected exactly one H1'));
  assert.ok(issues.some((issue) => issue.startsWith('Canonical differs')));
});
test('supports preview deployments with production canonicals', () => {
  assert.deepEqual(inspect(html, 'http://localhost:3107/jobs/engineer', 200, {}, url).issues, []);
});
