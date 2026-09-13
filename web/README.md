This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## SEO release checks

Run these from `web/` after changing content, job data, or page templates:

```sh
npm run seo:test
npm run build
npm run seo:audit:build -- --out=/tmp/ai-jobs-build-seo.json
npm run seo:audit -- --max-pages=60 --out=/tmp/ai-jobs-live-seo.json
```

The build audit checks all prerendered sitemap pages. The live audit checks actual HTTP responses and returns a nonzero exit code on failures. For a local/preview deployment, add `--site=http://localhost:3107 --canonical-site=https://www.artificialjobs.dev` to `seo:audit`; this preserves checks against production canonical URLs. Keep production and preview results separate.

See [the SEO audit and operating plan](../reports/aeo_audit_report.md) for the baseline, validation evidence, limitations, and remaining organic traffic priorities. These technical checks do not replace Search Console performance/indexing data or Google’s Rich Results Test.
