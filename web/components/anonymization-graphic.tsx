// Before/after of one chat export, drawn from the same segments so both sides always line up.
// A string is plain text; a tuple is [personal detail, the placeholder that replaces it].
type Segment = string | [string, string];

const MESSAGES: { author: Segment; time: string; body: Segment[] }[] = [
  {
    author: ['Sarah Chen', 'Person 1'],
    time: '9:14 AM',
    body: ['Called ', ['Mike Ruiz', 'Person 2'], ' at ', ['(415) 555-0142', 'Phone'], '. He approved the change order for ', ['118 Oakwood St', 'Address'], '.'],
  },
  {
    author: ['Dana Patel', 'Person 3'],
    time: '9:21 AM',
    body: ['Great. Invoice ', ['Ruiz Plumbing LLC', 'Company'], ' and cc ', ['dana@harborbuild.com', 'Email'], '. Framing starts Monday once the permit clears.'],
  },
];

function Line({ segments, after }: { segments: Segment[]; after: boolean }) {
  return segments.map((segment, i) => {
    if (typeof segment === 'string') return <span key={i}>{segment}</span>;
    const [detail, placeholder] = segment;
    return after
      ? <span key={i} className="rounded bg-brand-muted px-1 font-mono text-[0.8em] font-medium text-brand">{placeholder}</span>
      : <span key={i} className="rounded bg-amber-100 px-1 text-amber-950 underline decoration-amber-500 decoration-wavy underline-offset-2 dark:bg-amber-400/15 dark:text-amber-200">{detail}</span>;
  });
}

function Panel({ after }: { after: boolean }) {
  return (
    <figure className="tile flex flex-col rounded-md p-5 sm:p-6">
      <figcaption className="mb-5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{after ? 'What the lab receives' : 'Your raw Slack export'}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${after ? 'bg-brand-muted text-brand' : 'bg-muted text-muted-foreground'}`}>
          {after ? 'Anonymised' : '5 personal details'}
        </span>
      </figcaption>
      <div className="grid gap-5">
        {MESSAGES.map((message) => (
          <div key={message.time} className="text-[15px] leading-relaxed">
            <p className="mb-1 text-sm">
              <span className="font-semibold"><Line segments={[message.author]} after={after} /></span>
              <span className="ml-2 text-muted-foreground">{message.time}</span>
            </p>
            <p><Line segments={message.body} after={after} /></p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function AnonymizationGraphic() {
  return (
    <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
      <Panel after={false} />
      <div className="flex justify-center text-muted-foreground" aria-hidden>
        <span className="grid size-10 place-items-center rounded-full border border-border bg-card text-lg">
          <span className="lg:hidden">&darr;</span>
          <span className="hidden lg:inline">&rarr;</span>
        </span>
      </div>
      <Panel after />
    </div>
  );
}
