import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Job } from './jobs';
import { jobStructuredData } from './job-schema';
import { datePosted, validThrough, parseLocationAddress } from './job-quality';

const job: Job = { title: 'AI Engineer', company: 'Example', location: 'London, UK', is_remote: false, salary_min: 0, salary_max: 0, tags: ['AI'], description: 'Build AI systems with our engineering team.', apply_url: 'https://example.com/apply', date_posted: '2026-08-01' };
const url = 'https://www.artificialjobs.dev/jobs/ai-engineer-example-0';
const now = new Date('2026-09-13T12:00:00Z');

test('preserves original dates and does not invent expiry or employment type', () => {
  const schema = jobStructuredData(job, url, now);
  assert.equal(schema['@type'], 'JobPosting');
  assert.equal(schema.datePosted, '2026-08-01');
  assert.equal(schema.url, url);
  assert.ok(!('validThrough' in schema));
  assert.ok(!('employmentType' in schema));
});

test('missing posting dates use ordinary webpage schema, never the crawl or build date', () => {
  const unknown = { ...job, date_posted: undefined, fetched_at: '2026-09-12' };
  assert.equal(datePosted(unknown), undefined);
  assert.equal(validThrough(unknown), undefined);
  assert.equal(jobStructuredData(unknown, url, now)['@type'], 'WebPage');
});

test('invalid, future, and expired dates cannot produce active JobPosting schema', () => {
  for (const date_posted of ['not-a-date', '2026-02-30', '2027-01-01']) {
    assert.equal(jobStructuredData({ ...job, date_posted }, url, now)['@type'], 'WebPage');
  }
  assert.equal(jobStructuredData({ ...job, valid_through: '2026-09-01' }, url, now)['@type'], 'WebPage');
  assert.equal(jobStructuredData({ ...job, valid_through: '2026-10-01' }, url, now).validThrough, '2026-10-01');
});

test('UK locations are not classified as US states', () => {
  assert.deepEqual(parseLocationAddress('London, UK'), { addressLocality: 'London', addressCountry: 'GB' });
  assert.equal(parseLocationAddress('San Francisco, CA').addressCountry, 'US');
});

test('preserves valid employer timestamps with time-zone offsets', () => {
  const timestamp = '2026-08-01T23:00:00-07:00';
  assert.equal(datePosted({ ...job, date_posted: timestamp }), timestamp);
});
