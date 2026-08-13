import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Engineering Lab — Mühendisler için araçlar | gmay.me" },
      {
        name: "description",
        content:
          "GMA Engineering Lab: yapay zeka, makine mühendisliği, triboloji ve araştırma için pratik mühendislik araçları.",
      },
      { property: "og:title", content: "Engineering Lab — Mühendisler için araçlar" },
      {
        property: "og:description",
        content: "Yapay zeka, makine mühendisliği, triboloji ve araştırma araçları.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LabPage,
});

type Tool = {
  name: string;
  purpose: string;
  category: string;
  href?: "/lab/engineering-prompt-builder";
};

type Category = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tools: Tool[];
  note?: string;
};

const categories: Category[] = [
  {
    id: "ai-for-engineers",
    eyebrow: "01",
    title: "AI for Engineers",
    description: "Mühendislik iş akışlarında yapay zekâyı yapılandırılmış biçimde kullanmak için araçlar.",
    tools: [
      {
        name: "Engineering Prompt Builder",
        category: "AI for Engineers",
        href: "/lab/engineering-prompt-builder",
        purpose:
          "Mühendislik görevleri için yapılandırılmış ve tekrar kullanılabilir yapay zekâ promptları oluşturur.",
      },
    ],
  },
  {
    id: "mechanical-engineering",
    eyebrow: "02",
    title: "Mechanical Engineering",
    description: "Makine mühendisliği hesaplamaları için araçlar.",
    tools: [
      {
        name: "Hertz Contact Calculator",
        category: "Mechanical Engineering",
        purpose:
          "Küre-düzlem Hertz temasında temas yarıçapı ve temas basınçlarını hesaplamak için kullanılacaktır.",
      },
    ],
  },
  {
    id: "tribology",
    eyebrow: "03",
    title: "Tribology",
    description: "Sürtünme, aşınma ve yüzey mühendisliği çalışmaları için araçlar.",
    tools: [
      {
        name: "Wear Rate Calculator",
        category: "Tribology",
        purpose:
          "Aşınma hacmi, normal yük ve kayma mesafesinden özgül aşınma oranını hesaplamak için kullanılacaktır.",
      },
      {
        name: "Sliding Distance Calculator",
        category: "Tribology",
        purpose:
          "Dönme hızı, iz yarıçapı ve deney süresinden toplam kayma mesafesini hesaplamak için kullanılacaktır.",
      },
    ],
  },
  {
    id: "research-tools",
    eyebrow: "04",
    title: "Research Tools",
    description: "Araştırmacılar ve akademisyenler için yardımcı araçlar.",
    tools: [],
    note: "Bu kategori için araçlar sonraki bir sürümde eklenecektir.",
  },
];

function StatusBadge({ available }: { available: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      {available ? "Kullanılabilir" : "Planlanıyor"}
    </span>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const available = Boolean(tool.href);
  return (
    <article className="flex flex-col border border-border bg-card p-5 md:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {tool.category}
        </p>
        <div className="shrink-0">
          <StatusBadge available={available} />
        </div>
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-foreground">
        {tool.href ? (
          <Link to={tool.href} className="hover:underline hover:underline-offset-4">
            {tool.name}
          </Link>
        ) : (
          tool.name
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.purpose}</p>
      {tool.href && (
        <Link
          to={tool.href}
          className="mt-4 self-start text-sm font-medium text-foreground underline underline-offset-4"
        >
          Aracı Aç
        </Link>
      )}
    </article>
  );
}

function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering Lab"
        title="GMA Engineering Lab"
        description="Mühendisler ve araştırmacılar için pratik araçlardan oluşan, zaman içinde büyüyen bir koleksiyon. Araçlar dört kategori altında toplanır ve aşamalı olarak yayına alınır."
      />

      {categories.map((cat) => (
        <Section key={cat.id} id={cat.id}>
          <SectionHeader eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />

          {cat.tools.length > 0 ? (
            <div className="mt-8 grid max-w-4xl gap-4 lg:grid-cols-2">
              {cat.tools.map((t) => (
                <ToolCard key={t.name} tool={t} />
              ))}
            </div>
          ) : (
            <div className="mt-8 max-w-2xl border border-dashed border-border p-5 md:p-6">
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Daha sonra
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.note}</p>
            </div>
          )}
        </Section>
      ))}


      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          İlk araçlar geliştirme aşamasındadır. Hesaplama araçlarında kullanılan formüller,
          varsayımlar ve birimler açık biçimde sunulacaktır.
        </p>
      </Section>
    </>
  );
}
