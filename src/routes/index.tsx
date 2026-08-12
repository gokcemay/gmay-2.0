import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        name: "description",
        content:
          "Personal site of Gökçe Mehmet Ay: engineering tools, AI for engineers, academic research, articles, books, training and consulting.",
      },
      { property: "og:title", content: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        property: "og:description",
        content:
          "Engineering tools, AI for engineers, academic research, articles, books, training and consulting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  { title: "Engineering", body: "Practical tools and methods for real-world engineering work." },
  { title: "AI", body: "Applied artificial intelligence built for engineering problems." },
  { title: "Research", body: "Academic work, articles, and books grounded in practice." },
];

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.55]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 md:px-10">
        <header className="flex items-center justify-between">
          <span className="font-display text-sm tracking-[0.35em] text-muted-foreground uppercase">
            gmay.me
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-muted-foreground">
            In progress
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            Engineering × AI × Research
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-7xl">
            Gökçe Mehmet Ay
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Building the intersection of engineering practice, applied AI, and research —
            tools, writing, and teaching for engineers.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className="bg-card p-6">
                <h2 className="font-display text-base font-semibold text-foreground">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Gökçe Mehmet Ay</span>
          <span className="font-mono">Full site coming step by step</span>
        </footer>
      </div>
    </main>
  );
}
