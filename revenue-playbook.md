# AI Jobs revenue playbook

The immediate business is a focused employer distribution service. SEO supplies intent; the sale is access to qualified AI candidates plus evidence that the listing was seen.

## Offer

Start with three packages and sell them manually to companies already hiring:

| Package | Price | Promise |
| --- | ---: | --- |
| Standard job | $99 one-time | Reviewed listing, searchable landing page, inclusion in the AI jobs feed |
| Featured job | $199/month | Standard listing plus 30-day top placement and newsletter inclusion |
| Recruiting pilot | $499/month | Up to five active roles, weekly performance report, and priority edits |

Do not promise hires. Promise distribution, review speed, and transparent reporting.

## First 14 days

1. Confirm `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and the revenue migration are live before accepting paid listings.
2. Build a list of 50 companies with active AI openings. Prioritize companies with two or more current roles and an identifiable hiring contact.
3. Send a personal note with one relevant role, one sentence about the audience, and a link to `/post-job`. Do not bulk-send until opt-out handling and sender reputation are ready.
4. Follow up once after three business days. Offer three pilot slots at $199/month in exchange for permission to publish performance numbers.
5. Report views, apply clicks, and time-to-publish to every buyer. Ask for a renewal or referral after 14 days.

## Success thresholds

- 50 qualified contacts
- 10 replies
- 5 calls or detailed conversations
- 3 paid listings
- At least 1 monthly renewal or referral

If fewer than 3 companies pay, change the offer or audience before building more SEO pages. If 3 pay and at least 1 renews, automate fulfillment and expand the recruiter package.

## Instrumentation

Use the durable `analytics_events` table for `checkout_started`, `checkout_completed`, and `apply_click`. Add UTM parameters to outbound links and review weekly: employer-page visits, checkout-start rate, paid conversion rate, listing publish time, apply clicks per listing, and renewal rate.

## Outreach template

Subject: AI candidates for {{role}}

Hi {{name}} — I saw {{company}} is hiring for {{role}}. Artificial Jobs reaches developers searching specifically for AI, LLM, and ML roles, and we can publish a reviewed listing within 24 hours. Featured placement is $199/month and includes our email digest. Want me to send the short posting form?

— Pete
