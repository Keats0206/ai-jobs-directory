import { jobs, getAllTags, getAllLocations, salaryRange } from '@/lib/jobs';
import { Container } from '@/components/page-shell';
import { SiteFooter } from '@/components/site-footer';
import { HomeBoard } from '@/components/home-board';
import { GeoContent } from '@/components/geo-content';

export default function Home() {
  return (
    <>
      <HomeBoard jobs={jobs.map(job => { const range = salaryRange(job); return { title: job.title, company: job.company, apply_url: '', slug: job.slug, location: job.location, is_remote: job.is_remote, tags: job.tags, description: range ? `$${range.min} - $${range.max}` : '', salary_min: range?.min || 0, salary_max: range?.max || 0 }; })} tags={getAllTags()} locations={getAllLocations()} />
      <Container className="pb-16">
        <GeoContent url="/" />
      </Container>
      <SiteFooter />
    </>
  );
}
