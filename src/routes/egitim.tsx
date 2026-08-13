import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { ContactCTA } from "@/components/site/CTA";

export const Route = createFileRoute("/egitim")({
  head: () => ({
    meta: [
      { title: "Eğitim ve Danışmanlık — Mühendisler için Yapay Zeka | gmay.me" },
      {
        name: "description",
        content:
          "Mühendisler için yapay zeka eğitimleri, kurumsal eğitim programları, atölyeler ve mühendislik / Ar-Ge danışmanlığı.",
      },
      { property: "og:title", content: "Eğitim ve Danışmanlık — Mühendisler için Yapay Zeka" },
      {
        property: "og:description",
        content: "Kurumsal eğitim, atölye ve Ar-Ge danışmanlığı hizmetleri.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainingPage,
});

const sections = [
  {
    eyebrow: "01",
    title: "AI for Engineers",
    description: "Mühendislik problemlerine odaklı, uygulamalı yapay zeka eğitimi.",
    items: [
      { title: "Program kapsamı", body: "İçerik başlıkları eklenecektir." },
      { title: "Hedef kitle", body: "Mühendisler ve teknik ekipler." },
      { title: "Format", body: "Çevrimiçi veya yüz yüze." },
    ],
  },
  {
    eyebrow: "02",
    title: "Kurumsal eğitim",
    description: "Şirket ekiplerine özel olarak hazırlanan programlar.",
    items: [
      { title: "İhtiyaç analizi", body: "Detaylar eklenecektir." },
      { title: "Özelleştirilmiş içerik", body: "Detaylar eklenecektir." },
      { title: "Uygulama oturumları", body: "Detaylar eklenecektir." },
    ],
  },
  {
    eyebrow: "03",
    title: "Atölyeler",
    description: "Kısa süreli, uygulama ağırlıklı atölye çalışmaları.",
    items: [
      { title: "Atölye başlığı", body: "Yer tutucu." },
      { title: "Atölye başlığı", body: "Yer tutucu." },
      { title: "Atölye başlığı", body: "Yer tutucu." },
    ],
  },
  {
    eyebrow: "04",
    title: "Mühendislik / Ar-Ge danışmanlığı",
    description: "Mühendislik süreçleri ve Ar-Ge projeleri için danışmanlık.",
    items: [
      { title: "Süreç değerlendirme", body: "Detaylar eklenecektir." },
      { title: "Malzeme ve yüzey konuları", body: "Detaylar eklenecektir." },
      { title: "Yapay zeka entegrasyonu", body: "Detaylar eklenecektir." },
    ],
  },
];

function TrainingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eğitim & Danışmanlık"
        title="Eğitim ve Danışmanlık"
        description="Mühendislik ekipleri, kurumlar ve araştırma grupları için uygulamalı eğitim ve danışmanlık programları."
      />

      {sections.map((s) => (
        <Section key={s.title}>
          <SectionHeader eyebrow={s.eyebrow} title={s.title} description={s.description} />
          <GridPanel columns={3} className="mt-8">
            {s.items.map((i, idx) => (
              <InfoCard key={`${s.eyebrow}-${idx}`} title={i.title} body={i.body} />
            ))}
          </GridPanel>
        </Section>
      ))}

      <Section>
        <ContactCTA />
      </Section>
    </>
  );
}
