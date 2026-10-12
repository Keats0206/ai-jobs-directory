import unittest
from refresh_jobs import merge_jobs, normalize, canonical_url
from discover_sources import board_from_url
NOW = '2026-10-12T12:00:00+00:00'

class RefreshTests(unittest.TestCase):
    def job(self, **changes):
        return dict(title='AI Engineer', company='Acme', apply_url='https://jobs.ashbyhq.com/acme/one', source_board='ashby:acme', **changes)
    def test_refresh_preserves_original_slug_and_deduplicates(self):
        old = self.job(slug='old-title-acme-0', first_seen='2026-09-01')
        fresh = self.job(status='active')
        merged, counts = merge_jobs([old], [fresh, dict(fresh)], {'ashby:acme':{canonical_url(fresh['apply_url'])}}, NOW)
        self.assertEqual(len(merged), 1)
        self.assertEqual(merged[0]['slug'], 'old-title-acme-0')
        self.assertEqual(merged[0]['first_seen'], '2026-09-01')
    def test_failed_board_never_closes_jobs(self):
        merged, _ = merge_jobs([self.job(status='active')], [], {}, NOW)
        self.assertEqual(merged[0]['status'], 'active')
    def test_confirmed_missing_job_closes_but_filtered_job_is_excluded(self):
        old = self.job(status='active')
        missing, _ = merge_jobs([old], [], {'ashby:acme':set()}, NOW)
        present, _ = merge_jobs([old], [], {'ashby:acme':{canonical_url(old['apply_url'])}}, NOW)
        self.assertEqual(missing[0]['status'], 'closed')
        self.assertEqual(present[0]['status'], 'excluded')
    def test_legacy_urls_survive_and_duplicates_hide(self):
        merged, _ = merge_jobs([self.job(), self.job()], [], {}, NOW)
        self.assertEqual(merged[0]['slug'], 'ai-engineer-acme-0')
        self.assertEqual(merged[1]['status'], 'duplicate')
    def test_no_fake_remote_or_posted_date(self):
        job = normalize({'title':'AI Engineer','absolute_url':'https://job-boards.greenhouse.io/acme/jobs/1','content':'Build AI systems','updated_at':NOW}, {'ats':'greenhouse','slug':'acme','company':'Acme'}, NOW)
        self.assertFalse(job['is_remote'])
        self.assertEqual(job['location'],'Not specified')
        self.assertIsNone(job['date_posted'])
    def test_discovery_rejects_spoofed_hosts_and_non_board_urls(self):
        self.assertIsNone(board_from_url('https://jobs.ashbyhq.com.evil.test/acme/one'))
        self.assertIsNone(board_from_url('https://boards.greenhouse.io/embed/jobs'))
        self.assertEqual(board_from_url('https://jobs.ashbyhq.com/acme/one'),('ashby','acme'))
if __name__ == '__main__': unittest.main()
