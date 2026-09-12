import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanCompanyName,
  cleanJobTitle,
  isPlaceholderSalaryBand,
  parseSalaryFromDescription,
  salaryRange,
} from './job-quality';
import type { Job } from './jobs';

function job(partial: Partial<Job>): Job {
  return {
    title: 'AI Engineer',
    company: 'Acme',
    apply_url: 'https://jobs.ashbyhq.com/acme/abc',
    location: 'Remote',
    is_remote: true,
    salary_min: 140000,
    salary_max: 220000,
    tags: ['LLM'],
    description: 'Build LLM systems for production customers.',
    ...partial,
  };
}

describe('cleanJobTitle', () => {
  it('strips Job Application for prefixes', () => {
    assert.equal(
      cleanJobTitle('Job Application for Staff Software Engineer - AI Assistant', 'Harness'),
      'Staff Software Engineer - AI Assistant'
    );
  });

  it('strips trailing @ company', () => {
    assert.equal(cleanJobTitle('Senior AI Engineer @ DualEntry', 'Dualentry'), 'Senior AI Engineer');
  });

  it('closes mashed unclosed parentheses', () => {
    assert.equal(cleanJobTitle('AI Engineer Backend (Remote', 'Quadrivia'), 'AI Engineer Backend');
  });
});

describe('cleanCompanyName', () => {
  it('pulls the name after @', () => {
    assert.equal(cleanCompanyName(job({ company: 'AI Platform @ ClickUp' })), 'ClickUp');
  });

  it('falls back to the Ashby slug for AI Startup', () => {
    assert.equal(
      cleanCompanyName(
        job({
          company: 'AI Startup',
          apply_url: 'https://jobs.ashbyhq.com/pulsora-inc/94d2',
        })
      ),
      'Pulsora Inc'
    );
  });
});

describe('salaryRange', () => {
  it('hides the default $140k–$220k band when the description has no range', () => {
    assert.equal(salaryRange(job({ salary_min: 140000, salary_max: 220000 })), null);
    assert.equal(isPlaceholderSalaryBand(160000, 240000), true);
  });

  it('prefers a range parsed from the description', () => {
    assert.deepEqual(parseSalaryFromDescription('Compensation\n* $217,000 – $258,000'), {
      min: 217000,
      max: 258000,
    });
    assert.deepEqual(
      salaryRange(
        job({
          salary_min: 140000,
          salary_max: 220000,
          description: 'Pay is $217,000 – $258,000 per year.',
        })
      ),
      { min: 217000, max: 258000 }
    );
  });

  it('keeps uncommon published bands', () => {
    assert.deepEqual(salaryRange(job({ salary_min: 145700, salary_max: 174800 })), {
      min: 145700,
      max: 174800,
    });
  });
});
