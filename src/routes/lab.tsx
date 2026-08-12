import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, PlaceholderNote } from "@/components/site/Cards";

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

const categories = [
  {
    id: "ai-for-engineers",
    title: "AI for Engineers",
    description: "Mühendislik iş akışları için yapay zeka destekli araçlar.",
    tools: [
      { title: "Engineering Prompt Builder", body: "Mühendislik odaklı prompt üretimi. Yakında." },
      { title: "Araç yer tutucusu", body: "Planlanan araç." },
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical Engineering",
    description: "Makine mühendisliği hesaplayıcıları.",
    tools: [
      { title: "Hertz Contact Calculator", body: "Hertz temas hesaplaması. Yakında." },
      { title: "Araç yer tutucusu", body: "Planlanan araç." },
    ],
  },
  {
    id: "tribology",
    title: "Tribology",
    description: "Sürtünme, aşınma ve yüzey mühendisliği araçları.",
    tools: [
      { title: "Wear Rate Calculator", body: "Aşınma hızı hesaplaması. Yakında." },
      { title: "Sliding Distance Calculator", body: "Kayma mesafesi hesaplaması. Yakında." },
    ],
  },
  {
    id: "research-tools",
    title: "Research Tools",
    description: "Araştırmacılar için yardımcı araçlar.",
    tools: [{ title: "Araç yer tutucusu", body: "Planlanan araç." }],
  },
];

function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engineering Lab"
        title="GMA Engineering Lab"
        description="Mühendisler ve araştırmacılar için pratik araçlardan oluşan bir koleksiyon. Araçlar aşamalı olarak yayına alınacaktır."
      />

      {categories.map((cat) => (
        <Section key={cat.id} id={cat.id}>
          <SectionHeader eyebrow="Kategori" title={cat.title} description={cat.description} />
          <GridPanel columns={3} className="mt-10">
            {cat.tools.map((t, i) => (
              <InfoCard key={i} label="Araç" title={t.title} body={t.body} />
            ))}
          </GridPanel>
        </Section>
      ))}

      <Section>
        <PlaceholderNote>
          Araç fonksiyonları henüz uygulanmadı. Hesaplama mantığı, varsayımlar ve birimler bir
          sonraki adımda eklenecektir.
        </PlaceholderNote>
      </Section>
    </>
  );
}
