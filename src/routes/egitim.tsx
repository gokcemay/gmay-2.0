import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { ContactCTA } from "@/components/site/CTA";
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';

export const Route = createFileRoute("/egitim")({
  head: ({ match }) => (localizeHead({
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
      { property: "og:url", content: "/egitim" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/egitim" }],
  }, match.context.language ?? 'en', "/egitim")),
  component: TrainingPage,
});

const sections = [
  {
    eyebrow: "01",
    title: "AI for Engineers",
    description: "Mühendislik problemlerine odaklı, uygulamalı yapay zeka eğitimi.",
    items: [
      {
        title: "Program kapsamı",
        body: "Üretken yapay zekânın temel çalışma mantığı, mühendislik görevleri için yapılandırılmış prompt kurgusu, teknik dokümantasyon ve rapor üretimi, veri yorumlama ve model çıktılarının mühendislik gözüyle doğrulanması.",
      },
      {
        title: "Hedef kitle",
        body: "Tasarım, üretim, kalite, bakım ve Ar-Ge alanlarında çalışan mühendisler ile teknik ekipler. Ön koşul olarak programlama bilgisi gerekmez.",
      },
      {
        title: "Format",
        body: "Çevrimiçi veya yüz yüze; yarım günlük tanıtım oturumundan çok oturumlu programa kadar ölçeklenebilir. Her oturumda katılımcılar kendi iş örnekleri üzerinde uygulama yapar.",
      },
    ],
  },
  {
    eyebrow: "02",
    title: "Kurumsal eğitim",
    description: "Şirket ekiplerine özel olarak hazırlanan programlar.",
    items: [
      {
        title: "İhtiyaç analizi",
        body: "Program öncesinde ekibin mevcut iş akışları, kullandığı yazılımlar ve tekrar eden teknik görevleri konuşulur; eğitim içeriği bu görevler üzerine kurulur.",
      },
      {
        title: "Özelleştirilmiş içerik",
        body: "Örnekler, şablonlar ve alıştırmalar şirketin kendi ürün, süreç ve terminolojisiyle hazırlanır; sonunda ekibin kullanabileceği prompt ve kontrol listesi seti teslim edilir.",
      },
      {
        title: "Uygulama oturumları",
        body: "Teorik anlatım yerine ağırlıklı olarak canlı uygulama yapılır: gerçek görevler oturum içinde birlikte çözülür, çıktı kalitesi ve doğrulama yöntemleri tartışılır.",
      },
    ],
  },
  {
    eyebrow: "03",
    title: "Atölyeler",
    description: "Kısa süreli, uygulama ağırlıklı atölye çalışmaları.",
    items: [
      {
        title: "Mühendislikte prompt tasarımı",
        body: "Rol, görev, bağlam, kısıt ve çıktı formatı yaklaşımıyla tekrar üretilebilir promptlar kurma; katılımcılar kendi görevleri için prompt kütüphanesi oluşturur.",
      },
      {
        title: "Teknik doküman ve rapor üretimi",
        body: "Test raporu, teknik şartname ve sunum taslaklarının yapay zekâ desteğiyle hazırlanması; mühendislik doğruluğunun korunması için kontrol adımları.",
      },
      {
        title: "Akademik araştırmada dijital araçlar",
        body: "Literatür tarama, kaynak yönetimi, veri düzenleme ve yazım süreçlerinde kullanılan dijital araçların araştırmacı iş akışına yerleştirilmesi.",
      },
    ],
  },
  {
    eyebrow: "04",
    title: "Mühendislik / Ar-Ge danışmanlığı",
    description: "Mühendislik süreçleri ve Ar-Ge projeleri için danışmanlık.",
    items: [
      {
        title: "Süreç değerlendirme",
        body: "Mevcut tasarım, test ve dokümantasyon süreçlerinin gözden geçirilmesi; darboğazların belirlenmesi ve uygulanabilir iyileştirme önerileri.",
      },
      {
        title: "Malzeme ve yüzey konuları",
        body: "Sürtünme, aşınma, yağlama ve yüzey işlemleri ile ilgili problemlerde literatüre dayalı değerlendirme, test planı kurgusu ve sonuçların yorumlanması.",
      },
      {
        title: "Yapay zeka entegrasyonu",
        body: "Ar-Ge ve mühendislik ekiplerinin iş akışına yapay zekâ araçlarının aşamalı biçimde dahil edilmesi; kullanım kuralları ve doğrulama pratiklerinin tanımlanması.",
      },
    ],
  },
];

function TrainingPage() {
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("Eğitim & Danışmanlık")}
        title={tx("Eğitim ve Danışmanlık")}
        description={tx("Mühendislik ekipleri, kurumlar ve araştırma grupları için uygulamalı eğitim ve danışmanlık programları.")}
      />

      {tx(sections.map((s) => (
        <Section key={s.title}>
          <SectionHeader eyebrow={tx(s.eyebrow)} title={tx(s.title)} description={tx(s.description)} />
          <GridPanel columns={3} className="mt-8">
            {s.items.map((i, idx) => (
              <InfoCard key={`${s.eyebrow}-${idx}`} title={tx(i.title)} body={i.body} />
            ))}
          </GridPanel>
        </Section>
      )))}

      <Section>
        <ContactCTA />
      </Section>
      <RelatedKnowledge />
    </>
  );
}
