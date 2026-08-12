import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, PlaceholderNote } from "@/components/site/Cards";
import { academicProfiles } from "@/lib/profiles";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Araştırma — Triboloji ve Yüzey Mühendisliği | gmay.me" },
      {
        name: "description",
        content:
          "Akademik araştırma alanları: triboloji, yüzey mühendisliği, kaplamalar, mühendislik malzemeleri ve mühendislikte yapay zeka.",
      },
      { property: "og:title", content: "Araştırma — Triboloji ve Yüzey Mühendisliği" },
      {
        property: "og:description",
        content: "Araştırma alanları, yayınlar ve güncel çalışmalar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const areas = [
  { title: "Tribology", body: "Sürtünme ve aşınma davranışı." },
  { title: "Surface Engineering", body: "Yüzey işlemleri ve karakterizasyon." },
  { title: "Coatings", body: "Kaplama teknolojileri ve performansı." },
  { title: "Engineering Materials", body: "Mühendislik malzemeleri." },
  { title: "AI in Engineering", body: "Mühendislikte yapay zeka uygulamaları." },
];

function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Araştırma"
        title="Araştırma"
        description="Triboloji ve yüzey mühendisliği başta olmak üzere akademik ve uygulamalı araştırma alanları."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Araştırma alanları" />
        <GridPanel columns={3} className="mt-8">
          {areas.map((a) => (
            <InfoCard key={a.title} title={a.title} body={a.body} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="02"
          title="Triboloji ve yüzey mühendisliği"
          description="Sürtünme, aşınma, yağlama ve yüzey performansı üzerine çalışmalar."
        />
        <div className="mt-8">
          <PlaceholderNote>
            Bu bölümün detaylı içeriği (yöntemler, ekipman, çalışma konuları) henüz eklenmedi.
          </PlaceholderNote>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="03" title="Seçilmiş yayınlar" />
        <div className="mt-8 border border-border bg-card">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border p-6 last:border-0 md:p-8">
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Yayın {i}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Yayın bilgisi yer tutucusu — başlık, dergi ve yıl bilgisi eklenecektir.
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <PlaceholderNote>
            Yayın listesi doğrulanmış bilgi sağlanana kadar boş bırakılmıştır.
          </PlaceholderNote>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="04" title="Güncel çalışmalar" />
        <div className="mt-8">
          <PlaceholderNote>Güncel çalışma başlıkları henüz eklenmedi.</PlaceholderNote>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="05" title="Akademik profiller" />
        <ul className="mt-8 flex flex-wrap gap-3">
          {academicProfiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.label} profili (yeni sekmede açılır)`}
                className="inline-flex border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
