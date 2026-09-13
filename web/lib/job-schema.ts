import type { Job } from './jobs';
import { datePosted, validThrough, employmentType, parseLocationAddress, displayTitle, displayCompany, salaryRange } from './job-quality';

/** Rich-result data is limited to facts available in the source posting. */
export function jobStructuredData(job: Job, url: string, now = new Date()): Record<string, unknown> {
  const title = displayTitle(job);
  const company = displayCompany(job);
  const posted = datePosted(job);
  const expires = validThrough(job);
  const page = { '@context': 'https://schema.org', '@type': 'WebPage', name: `${title} at ${company}`, url, description: job.description };
  // Keep ordinary job pages indexable when we cannot establish required rich-result facts.
  if (!posted || new Date(posted) > now || !job.description.trim() || !title || !company) return page;
  if (expires && new Date(expires) < now) return page;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    hiringOrganization: { '@type': 'Organization', name: company },
    url,
    description: job.description,
    datePosted: posted,
    ...(expires ? { validThrough: expires } : {}),
    ...(employmentType(job) ? { employmentType: employmentType(job) } : {}),
  };
  const address = parseLocationAddress(job.location);
  if (job.is_remote) {
    schema.jobLocationType = 'TELECOMMUTE';
    if (address.addressCountry) schema.applicantLocationRequirements = { '@type': 'Country', name: address.addressCountry };
  }
  if (Object.keys(address).length) schema.jobLocation = { '@type': 'Place', address: { '@type': 'PostalAddress', ...address } };
  const range = salaryRange(job);
  if (range) schema.baseSalary = {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: { '@type': 'QuantitativeValue', minValue: range.min, maxValue: range.max, unitText: 'YEAR' },
  };
  return schema;
}
