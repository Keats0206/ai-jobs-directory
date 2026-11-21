export const SITE_URL = 'https://www.artificialjobs.dev';

/** The named person accountable for listings, guides and the Pay Index (schema author/creator, /about#editor). */
export const EDITOR = {
  name: 'Pete Keating',
  jobTitle: 'Founder and editor',
  url: `${SITE_URL}/about#editor`,
};

export const editorJsonLd = {
  '@type': 'Person',
  '@id': EDITOR.url,
  name: EDITOR.name,
  jobTitle: EDITOR.jobTitle,
  url: EDITOR.url,
  worksFor: { '@id': `${SITE_URL}/#organization` },
};
