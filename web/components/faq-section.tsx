import type { FaqItem } from '@/lib/agents';
import { SectionLabel } from '@/components/page-shell';

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SectionLabel>FAQ</SectionLabel>
      <dl className="mt-4 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-medium text-foreground">{faq.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
