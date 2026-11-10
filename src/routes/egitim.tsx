import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { ContactCTA } from "@/components/site/CTA";
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';
import { Faq } from '@/components/site/Faq';

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
  const tr = useLanguage() === 'tr';
  const faqItems = tr
    ? [
        {
          q: "Yapay zekâ eğitimleri kimler için?",
          a: "Tasarım, üretim, kalite, bakım ve Ar-Ge alanlarında çalışan mühendisler, teknik ekipler, araştırmacılar ve akademisyenler için tasarlanır. Programlama bilgisi ön koşul değildir; odak, üretken yapay zekânın mühendislik görevlerinde yapılandırılmış ve doğrulanabilir biçimde kullanılmasıdır.",
        },
        {
          q: "Eğitimler mühendislik ve Ar-Ge ekiplerine göre özelleştirilebilir mi?",
          a: "Evet. Kurumsal programlarda öncesinde ekibin iş akışları, kullandığı yazılımlar ve tekrar eden teknik görevleri konuşulur; örnekler, şablonlar ve alıştırmalar şirketin kendi ürün, süreç ve terminolojisiyle hazırlanır.",
        },
        {
          q: "Kurumsal eğitim programı alınabilir mi?",
          a: "Evet. Şirket ekiplerine özel kurumsal yapay zekâ eğitimleri, kısa atölyeler ve çok oturumlu programlar çevrimiçi veya yüz yüze düzenlenebilir. Kapsam ve takvim için iletişim sayfasından ulaşabilirsiniz.",
        },
      ]
    : [
        {
          q: "Who are the AI trainings for?",
          a: "They are designed for engineers working in design, manufacturing, quality, maintenance and R&D, as well as technical teams, researchers and academics. No programming background is required; the focus is using generative AI for engineering tasks in a structured, verifiable way.",
        },
        {
          q: "Can training be customized for engineering and R&D teams?",
          a: "Yes. For corporate programs, the team's workflows, software and recurring technical tasks are discussed beforehand; examples, templates and exercises are prepared with the company's own products, processes and terminology.",
        },
        {
          q: "Are corporate training programs available?",
          a: "Yes. Corporate AI training for company teams, short workshops and multi-session programs can be held online or in person. Use the contact page to discuss scope and scheduling.",
        },
      ];
  return (
    <>
      <PageHeader
        eyebrow={tx("Eğitim & Danışmanlık")}
        title={tx("Eğitim ve Danışmanlık")}
        description={tx("Mühendislik ekipleri, kurumlar ve araştırma grupları için uygulamalı eğitim ve danışmanlık programları.")}
      />

      <Section>
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            {tr
              ? "Bu sayfadaki eğitimler; mühendisler, teknik ekipler, araştırmacılar ve akademisyenler içindir. Konular arasında üretken yapay zekânın temel çalışma mantığı, mühendislik görevleri için prompt tasarımı, teknik dokümantasyon ve rapor üretimi, veri yorumlama ve model çıktılarının mühendislik gözüyle doğrulanması yer alır."
              : "The trainings on this page are for engineers, technical teams, researchers and academics. Topics include how generative AI works, prompt design for engineering tasks, technical documentation and report writing, data interpretation, and verifying model output with an engineer's eye."}
          </p>
          <p>
            {tr
              ? "Kurumsal eğitim alınabilir: programlar şirket ekiplerinin kendi iş akışları, yazılımları ve terminolojisiyle özelleştirilir. Mühendislik ve Ar-Ge ekiplerine uyarlama; gerçek görevler üzerinde canlı uygulama, çıktı kalitesi denetimi ve ekibe teslim edilen prompt ve kontrol listesi setleriyle yapılır."
              : "Corporate training is available: programs are customized around the team's own workflows, software and terminology. Adaptation for engineering and R&D teams happens through hands-on work on real tasks, output-quality checks, and a delivered set of prompts and checklists the team can keep using."}
          </p>
          <p>
            {tr ? "Eğitimlerde kullanılan yaklaşımı ücretsiz denemek isterseniz " : "To try the approach used in the trainings for free, see the "}
            <Link to="/lab/engineering-prompt-builder" className="text-foreground underline underline-offset-4">
              {tr ? "Engineering Prompt Builder" : "Engineering Prompt Builder"}
            </Link>
            {tr ? " aracına ve " : " tool and the "}
            <Link to="/articles" className="text-foreground underline underline-offset-4">
              {tr ? "mühendislikte yapay zekâ yazılarına" : "articles on AI in engineering"}
            </Link>
            {tr ? " göz atabilirsiniz." : "."}
          </p>
        </div>
      </Section>

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
        <Faq title={tr ? "Sık sorulan sorular" : "Frequently asked questions"} items={faqItems} />
      </Section>

      <Section>
        <ContactCTA />
      </Section>
      <RelatedKnowledge />
    </>
  );
}
