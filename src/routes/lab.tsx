import type React from "react";
import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';

export const Route = createFileRoute("/lab")({
  head: ({ match }) => (localizeHead({
    meta: [
      { title: "GMA Engineering Lab — Mühendislik araçları | gmay.me" },
      {
        name: "description",
        content:
          "Mühendisler ve araştırmacılar için ücretsiz hesaplama, triboloji, test planlama ve yapay zekâ araçları.",
      },
      { property: "og:title", content: "GMA Engineering Lab — Mühendislik araçları" },
      {
        property: "og:description",
        content:
          "Mühendisler ve araştırmacılar için ücretsiz hesaplama, triboloji, test planlama ve yapay zekâ araçları.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lab" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/lab" }],
  }, match.context.language ?? 'en', "/lab")),
  component: LabPage,
});

type ToolHref =
  | "/lab/engineering-prompt-builder"
  | "/lab/hertz-contact-calculator"
  | "/lab/wear-rate-calculator"
  | "/lab/sliding-distance-calculator"
  | "/lab/cadquery-prompt"
  | "/araclar/teknik-rapor-stili"
  | "/araclar/teknik-resim-cad";

type Tool = {
  name: string;
  purpose: string;
  href: ToolHref;
};

type Group = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tools: Tool[];
};

const groups: Group[] = [
  {
    id: "ai-for-engineers",
    eyebrow: "01",
    title: "AI for Engineers",
    description: "Mühendislik iş akışlarında yapay zekâyı yapılandırılmış biçimde kullanmak için araçlar.",
    tools: [
      {
        name: "Engineering Prompt Builder",
        href: "/lab/engineering-prompt-builder",
        purpose:
          "Mühendislik görevleri için yapılandırılmış ve tekrar kullanılabilir yapay zekâ promptları oluşturun.",
      },
      {
        name: "CadQuery Prompt Üreteci",
        href: "/lab/cadquery-prompt",
        purpose:
          "Parça fikrinizi parametrik CAD modelleme için yapılandırılmış bir Claude promptuna dönüştürün.",
      },
      {
        name: "Teknik Rapor Stili",
        href: "/araclar/teknik-rapor-stili",
        purpose:
          "Teknik rapor yazımı için Türkçe ve İngilizce Claude skill'i: yazma, düzenleme ve stil denetimi.",
      },
      {
        name: "Teknik Resimden CAD'e",
        href: "/araclar/teknik-resim-cad",
        purpose:
          "Teknik resim kitabındaki üç boyutlu çizimler için galeri, CAD promptu ve model dosyaları.",
      },
    ],
  },
  {
    id: "tribology-contact",
    eyebrow: "02",
    title: "Tribology & Contact",
    description: "Temas mekaniği, sürtünme ve aşınma hesaplamaları için araçlar.",
    tools: [
      {
        name: "Hertz Contact Calculator",
        href: "/lab/hertz-contact-calculator",
        purpose:
          "Küre-düzlem elastik temasında temas alanı, Hertz basıncı ve elastik yaklaşmayı hesaplayın.",
      },
      {
        name: "Wear Rate Calculator",
        href: "/lab/wear-rate-calculator",
        purpose:
          "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayın.",
      },
    ],
  },
  {
    id: "test-data-planning",
    eyebrow: "03",
    title: "Test Data & Planning",
    description: "Deney planlama ve test parametreleri için araçlar.",
    tools: [
      {
        name: "Sliding Distance Calculator",
        href: "/lab/sliding-distance-calculator",
        purpose:
          "Döner ve ileri-geri triboloji deneylerinde toplam kayma mesafesini ve kayma hızını hesaplayın.",
      },
    ],
  },
];

function ToolCard({ tool, group }: { tool: Tool; group: string }) {
  const tx = useT();
  const isStatic = tool.href.endsWith(".html");
  const linkProps = {
    to: tool.href,
    search: { distance: undefined, distanceUnit: undefined, source: undefined },
  } as const;
  const ToolLink = ({ className, children }: { className: string; children: React.ReactNode }) =>
    isStatic ? (
      <a href={tool.href} className={className}>{children}</a>
    ) : (
      <Link {...linkProps} className={className}>{children}</Link>
    );


  return (
    <article className="flex flex-col border border-border bg-card p-5 md:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {tx(group)}
        </p>
        <span className="inline-flex shrink-0 items-center gap-2 border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          {tx("Kullanılabilir")}</span>
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug font-semibold text-foreground">
        <ToolLink className="hover:underline hover:underline-offset-4">
          {tx(tool.name)}
        </ToolLink>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(tool.purpose)}</p>
      <ToolLink className="mt-4 self-start text-sm font-medium text-foreground underline underline-offset-4">
        {tx("Aracı Aç")}</ToolLink>
    </article>
  );
}

function LabPage() {
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("Engineering Lab")}
        title={tx("GMA Engineering Lab")}
        description={tx("Ücretsiz mühendislik hesaplama, test planlama ve yapay zekâ araçları.")}
      />

      <Section>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {tx("Mühendisler ve araştırmacılar için geliştirilen, hesaplama yöntemlerini ve varsayımlarını açık biçimde gösteren pratik araçlar.")}</p>
      </Section>

      {tx(groups.map((g) => (
        <Section key={g.id} id={g.id}>
          <SectionHeader eyebrow={tx(g.eyebrow)} title={tx(g.title)} description={tx(g.description)} />
          <div className="mt-8 grid max-w-4xl gap-4 lg:grid-cols-2">
            {g.tools.map((t) => (
              <ToolCard key={t.name} tool={t} group={g.title} />
            ))}
          </div>
        </Section>
      )))}

      <Section id="birlikte-kullanin">
        <SectionHeader
          eyebrow={tx("04")}
          title={tx("Birlikte kullanın")}
          description={tx("Araçlar tek başına kullanılabilir; bazı durumlarda birlikte kullanıldığında deney planlama ve değerlendirme akışını tamamlar.")}
        />
        <div className="mt-8 grid max-w-4xl gap-4 lg:grid-cols-2">
          <article className="border border-border bg-card p-5 md:p-6">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {tx("İş akışı")}</p>
            <h3 className="mt-3 font-display text-base leading-snug font-semibold text-foreground">
              {tx("Sliding Distance Calculator → Wear Rate Calculator")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Triboloji deneyinizin toplam kayma mesafesini hesaplayın ve sonucu doğrudan Wear Rate Calculator'a aktarın.")}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                to="/lab/sliding-distance-calculator"
                className="text-sm font-medium text-foreground underline underline-offset-4"
              >
                {tx("Sliding Distance Calculator")}</Link>
              <Link
                to="/lab/wear-rate-calculator"
                search={{ distance: undefined, distanceUnit: undefined, source: undefined }}
                className="text-sm font-medium text-foreground underline underline-offset-4"
              >
                {tx("Wear Rate Calculator")}</Link>
            </div>
          </article>

          <article className="border border-border bg-card p-5 md:p-6">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {tx("İlgili değerlendirme")}</p>
            <h3 className="mt-3 font-display text-base leading-snug font-semibold text-foreground">
              {tx("Hertz Contact Calculator → Temas koşullarını değerlendirin")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tx("Deney öncesinde temas yarıçapı ve maksimum temas basıncını hesaplayarak yük seçiminizin temas koşullarını gözden geçirin. Bu araçlar arasında otomatik veri aktarımı bulunmaz.")}</p>
            <div className="mt-4">
              <Link
                to="/lab/hertz-contact-calculator"
                className="text-sm font-medium text-foreground underline underline-offset-4"
              >
                {tx("Hertz Contact Calculator")}</Link>
            </div>
          </article>
        </div>
      </Section>

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Hesaplama araçlarında kullanılan denklemler, varsayımlar ve birimler açık biçimde sunulur. Kritik mühendislik kararlarında sonuçlar bağımsız yöntemlerle doğrulanmalıdır.")}</p>
      </Section>
      <RelatedKnowledge />
    </>
  );
}
