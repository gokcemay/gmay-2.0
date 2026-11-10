export type FaqItem = { q: string; a: string };

// Visible FAQ block. Items must be passed already localized by the caller
// (pages resolve them with the `tr ? ... : ...` pattern).
export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <dl className="mt-5 grid max-w-4xl gap-4">
        {items.map((item) => (
          <div key={item.q} className="border border-border bg-card p-5 md:p-6">
            <dt className="font-display text-base font-semibold text-foreground">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
