import { jobs, getAllTags, getAllLocations, salaryRange, type Job } from '@/lib/jobs';
import { getBoardStats } from '@/lib/board-stats';
import { Container } from '@/components/page-shell';
import { SiteFooter } from '@/components/site-footer';
import { HomeBoard } from '@/components/home-board';
import { GeoContent } from '@/components/geo-content';

const posted = (job: Job) => Date.parse(job.date_posted || job.first_seen || '') || 0;

export default function Home() {
  const stats = getBoardStats();
  // Newest first, trimmed to what a row renders: this list is serialized to the client.
  const boardJobs: Job[] = [...jobs].sort((a, b) => posted(b) - posted(a)).map((job) => {
    const range = salaryRange(job);
    return {
      title: job.title, company: job.company, apply_url: '', slug: job.slug, location: job.location,
      is_remote: job.is_remote, tags: job.tags, description: range ? `$${range.min} - $${range.max}` : '',
      salary_min: range?.min || 0, salary_max: range?.max || 0, date_posted: job.date_posted, first_seen: job.first_seen,
      facts: job.facts && ({ seniority: job.facts.seniority, stack: job.facts.stack.slice(0, 3) } as Job['facts']),
    };
  });
  return (
    <>
      <HomeBoard jobs={boardJobs} tags={getAllTags()} locations={getAllLocations()} stats={stats} />
      <Container className="pb-16">
        <GeoContent url="/" />
      </Container>
      <SiteFooter />
    </>
  );
}
