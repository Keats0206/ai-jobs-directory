import { getContentByUrl } from '@/lib/content';
import { GeoMarkdown } from '@/components/geo-markdown';

export function GeoContent({ url, className }: { url: string; className?: string }) {
  const article = getContentByUrl(url);
  if (!article) return null;

  return (
    <section className={className ?? 'mt-16 border-t border-border/60 pt-12'}>
      {article.jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      ) : null}
      <GeoMarkdown body={article.body} />
    </section>
  );
}
