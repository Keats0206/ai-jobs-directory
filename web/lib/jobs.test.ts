import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobs, jobSlug, getJobBySlug, getRemoteTags, getRemoteJobsByTag, getSalaryTags, getJobsByTag, salaryRange } from './jobs';

test('existing job URLs resolve but an unrelated prefix cannot select a job by index', () => {
  assert.equal(getJobBySlug(jobSlug(jobs[0], 0))?.job, jobs[0]);
  assert.equal(getJobBySlug('unrelated-job-0'), null);
  assert.equal(getJobBySlug('unrelated-job-999999'), null);
});

test('every remote landing page count equals its actual remote listings', () => {
  const tags = getRemoteTags();
  assert.ok(tags.length > 0);
  for (const { tag, count } of tags) {
    const listed = getRemoteJobsByTag(tag);
    assert.equal(listed.length, count);
    assert.ok(count > 0);
    assert.ok(listed.every((job) => job.is_remote));
  }
});

test('salary sitemap candidates all have published compensation', () => {
  assert.ok(getSalaryTags().length > 0);
  for (const { tag } of getSalaryTags()) assert.ok(getJobsByTag(tag).some(salaryRange));
});
