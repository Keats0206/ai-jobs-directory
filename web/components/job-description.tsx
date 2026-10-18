import ReactMarkdown from 'react-markdown';

/**
 * Renders the light markdown scripts/refresh_jobs.py stores ('## ' headings, '- ' bullets).
 * Links and images from employer HTML are already stripped at ingest.
 */
const components = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-10 text-base font-semibold tracking-tight text-foreground first:mt-0">{children}</h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => <p className="mt-4 first:mt-0">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-border">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 marker:text-muted-foreground">{children}</ol>
  ),
};

export function JobDescription({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-prose text-[15px] leading-7 text-foreground/80">
      <ReactMarkdown components={components} allowedElements={['h2', 'p', 'ul', 'ol', 'li', 'strong', 'em']} unwrapDisallowed>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
