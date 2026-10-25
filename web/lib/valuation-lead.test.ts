import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadEmail, parseValuationLead } from './valuation-lead';

const valid = { name: 'Ada', email: ' Ada@Example.com ', company: 'Acme', status: 'shut-down', headcount: '40', consent: true, source: '/sell-company-data' };

test('accepts a complete lead and normalises it', () => {
  const result = parseValuationLead(valid);
  assert.ok('lead' in result);
  assert.equal(result.lead.email, 'ada@example.com');
  assert.equal(result.lead.headcount, 40);
});

test('rejects missing consent, bad status and bad headcount', () => {
  assert.ok('error' in parseValuationLead({ ...valid, consent: false }));
  assert.ok('error' in parseValuationLead({ ...valid, status: 'bankrupt' }));
  assert.ok('error' in parseValuationLead({ ...valid, headcount: '0' }));
  assert.ok('error' in parseValuationLead({ ...valid, email: 'nope' }));
});

test('escapes user input in the notification html', () => {
  const result = parseValuationLead({ ...valid, company: '<script>x</script>' });
  assert.ok('lead' in result);
  assert.ok(!leadEmail(result.lead).html.includes('<script>'));
});
