import unittest
from enrich_jobs import clean, content_hash, enrich, pending
from snapshot_history import snapshot
NOW = '2026-10-12T12:00:00+00:00'
FACTS = dict(seniority='senior', yoe_min=5, stack=['vLLM', 'PyTorch'], model_providers=[], visa_sponsorship='yes',
             remote_regions=['us'], work_type='infra', team='Inference', salary_min_usd=180000, salary_max_usd=240000)

class EnrichTests(unittest.TestCase):
    def job(self, slug='ai-engineer-acme-0', **changes):
        return {**dict(slug=slug, title='AI Engineer', company='Acme', location='Remote', description='Serve models with vLLM.', status='active'), **changes}
    def test_cached_jobs_make_no_calls_and_changed_jobs_do(self):
        calls = []
        def call(job):
            calls.append(job['slug'])
            return FACTS, 0.001
        cache = {}
        first = enrich([self.job()], cache, call, NOW)
        second = enrich([self.job()], cache, call, NOW)
        third = enrich([self.job(description='Now with JAX.')], cache, call, NOW)
        self.assertEqual((first['enriched'], second['pending'], third['enriched']), (1, 0, 1))
        self.assertEqual(len(calls), 2)
    def test_only_active_jobs_are_sent(self):
        self.assertEqual(pending([self.job(status='closed'), self.job(slug='b', status='duplicate')], {}), [])
    def test_failures_are_counted_not_cached(self):
        def call(job): raise TimeoutError('slow')
        cache = {}
        report = enrich([self.job()], cache, call, NOW)
        self.assertEqual((report['failed'], cache), (1, {}))
    def test_clean_drops_values_outside_vocabulary(self):
        facts = clean(dict(FACTS, seniority='wizard', stack=['vLLM', 'Excel', 'vLLM'], visa_sponsorship='maybe',
                           yoe_min=99, salary_min_usd=300000, salary_max_usd=150000, team='  '))
        self.assertEqual(facts['seniority'], 'unknown')
        self.assertEqual(facts['stack'], ['vLLM'])
        self.assertEqual(facts['visa_sponsorship'], 'unstated')
        self.assertIsNone(facts['yoe_min'])
        self.assertIsNone(facts['team'])
        self.assertEqual((facts['salary_min_usd'], facts['salary_max_usd']), (150000, 300000))
    def test_hourly_or_tiny_salaries_are_rejected(self):
        self.assertIsNone(clean(dict(FACTS, salary_min_usd=45, salary_max_usd=60))['salary_min_usd'])
    def test_hash_ignores_unrelated_fields(self):
        self.assertEqual(content_hash(self.job()), content_hash(self.job(last_verified=NOW)))

class SnapshotTests(unittest.TestCase):
    def test_snapshot_counts_active_jobs_and_prefers_feed_salary(self):
        jobs = [dict(slug=f's{i}', company=f'C{i % 2}', status='active', is_remote=i % 2 == 0, tags=['RAG'],
                     salary_min=100000 if i == 0 else 0, salary_max=200000 if i == 0 else 0, first_seen='2026-10-10')
                for i in range(6)] + [dict(slug='gone', company='C9', status='closed', tags=['RAG'])]
        enrichment = {f's{i}': dict(FACTS) for i in range(6)}
        result = snapshot(jobs, enrichment, '2026-10-12')
        self.assertEqual((result['jobs'], result['remote'], result['companies']), (6, 3, 2))
        self.assertEqual(result['by_stack'], {'PyTorch': 6, 'vLLM': 6})
        self.assertEqual(result['new_last_7_days'], 6)
        self.assertEqual(result['visa_sponsorship'], 6)
        # One feed salary (150k midpoint) plus five description salaries (210k midpoint).
        self.assertEqual(result['median_salary'], 210000)
        self.assertEqual(result['median_salary_by_tag'], {'RAG': 210000})

if __name__ == '__main__': unittest.main()
