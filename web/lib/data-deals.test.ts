import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateDataValue } from './data-deals';
test('a small startup lands in the SimpleClosure range', () => {
  assert.equal(estimateDataValue({ headcount: 8, years: 2, sources: ['chat', 'code', 'docs'] })?.band, '$10K–$50K');
});
test('a 50-person, five-year company lands in the micro1 range', () => {
  const estimate = estimateDataValue({ headcount: 50, years: 5, sources: ['chat', 'email', 'tickets', 'docs'] });
  assert.equal(estimate?.personYears, 250);
  assert.equal(estimate?.band, '$150K–$750K');
});
test('enterprise scale goes past $2M', () => {
  assert.equal(estimateDataValue({ headcount: 5000, years: 10, sources: ['chat', 'email'] })?.band, '$2M+');
});
test('no record of work, or no people, gives no estimate', () => {
  assert.equal(estimateDataValue({ headcount: 40, years: 4, sources: ['email', 'docs'] }), null);
  assert.equal(estimateDataValue({ headcount: 0, years: 4, sources: ['chat'] }), null);
});
