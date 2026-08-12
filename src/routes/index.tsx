import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard, ArticleCard } from "@/components/site/Cards";
import { buttonStyles, CTABlock } from "@/components/site/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        name: "description",
        content:
          "Mühendislik pratiği, yapay zeka ve akademik araştırmanın kesişiminde: mühendislik araçları, yazılar, araştırma, kitaplar, eğitim ve danışmanlık.",
      },
      { property: "og:title", content: "Gökçe Mehmet Ay — Engineering × AI × Research" },
      {
        property: "og:description",
        content:
          "Mühendislik araçları, yapay zeka, akademik araştırma, yazılar, kitaplar, eğitim ve danışmanlık.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const labCategories = [
  {
    label: "01",
    title: "AI for Engineers",
    body: "Mühendislik problemleri için yapay zeka destekli pratik araçlar.",
  },
  {
    label: "02",
    title: "Mechanical Engineering",
    body: "Makine mühendisliği hesaplamaları ve mühendislik yardımcıları.",
  },
  {
    label: "03",
    title: "Tribology",
    body: "Sürtünme, aşınma ve yüzey mühendisliği odaklı araçlar.",
  },
  {
    label: "04",
    title: "Research Tools",
    body: "Araştırmacılar ve akademisyenler için yardımcı araçlar.",
  },
];

const researchThemes = [
  { title: "Tribology", body: "Sürtünme ve aşınma davranışı." },
  { title: "Surface Engineering", body: "Yüzey işlemleri ve yüzey karakterizasyonu." },
  { title: "Coatings", body: "Kaplama teknolojileri ve performansı." },
  { title: "Engineering Materials", body: "Mühendislik malzemeleri ve uygulamaları." },
  { title: "AI in Engineering", body: "Mühendislikte yapay zeka uygulamaları." },
];

const services = [
  {
    title: "AI for Engineers",
    body: "Mühendislik iş akışlarında üretken yapay zekânın uygulamalı kullanımı.",
  },
  {
    title: "Kurumsal Yapay Zekâ Eğitimleri",
    body: "Teknik ekiplerin yapay zekâ araçlarını güvenli ve verimli biçimde kullanmasına yönelik uygulamalı eğitimler.",
  },
  {
    title: "Mühendislik & Ar-Ge Danışmanlığı",
    body: "Mühendislik, araştırma ve teknoloji geliştirme süreçleri için teknik danışmanlık.",
  },
];


function Index() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.55]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            Engineering × AI × Research
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-7xl">
            Gökçe Mehmet Ay
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Mühendislik pratiğini, akademik araştırmayı ve üretken yapay zekâyı bir araya
            getiriyorum. Mühendisler ve araştırmacılar için araçlar geliştiriyor, eğitimler veriyor
            ve teknoloji üzerine yazıyorum.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/lab" className={buttonStyles.primary}>
              Engineering Lab'i Keşfet
            </Link>
            <Link to="/egitim" className={buttonStyles.secondary}>
              Eğitim &amp; Danışmanlık
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            <a
              href="https://gmehmetay.substack.com"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              {"“Mühendisliğin Yapay Zeka Mentoru”nu Oku"}
            </a>
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="Engineering Lab"
          title="GMA Engineering Lab"
          description="Mühendislik hesapları, yapay zekâ iş akışları ve araştırma süreçleri için geliştirilen pratik araçlar."
          action={
            <Link to="/lab" className={buttonStyles.secondary}>
              Lab'deki araçları keşfet
            </Link>
          }
        />

        <GridPanel columns={4} className="mt-8">
          {labCategories.map((c) => (
            <InfoCard
              key={c.title}
              label={c.label}
              title={c.title}
              body={c.body}
              footer={
                <Link to="/lab" className={buttonStyles.ghost}>
                  Daha fazla bilgi
                </Link>
              }
            />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Yazılar"
          title="Son yazılar"
          description="Mühendislik, yapay zekâ, akademik araştırma ve teknoloji üzerine notlar, rehberler ve uygulama örnekleri."
          action={
            <Link to="/articles" className={buttonStyles.secondary}>
              Tüm yazılar
            </Link>
          }
        />
        <div className="mt-8 border border-dashed border-border bg-card p-6 md:p-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Substack yazıları yakında burada gösterilecek.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Araştırma"
          title="Araştırma ve mühendislik"
          description="Triboloji, yüzey mühendisliği, kaplamalar ve mühendislikte yapay zekâ başta olmak üzere çalışma alanları."
          action={
            <Link to="/research" className={buttonStyles.secondary}>
              Araştırmaları Gör
            </Link>
          }
        />
        <GridPanel columns={3} className="mt-8">
          {researchThemes.map((t) => (
            <InfoCard key={t.title} title={t.title} body={t.body} />
          ))}
        </GridPanel>
      </Section>


      <Section>
        <SectionHeader eyebrow="Kitaplar" title="Öne çıkan kitap" />
        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-[minmax(0,1fr)_2fr]">
          <div className="flex aspect-[3/4] items-center justify-center bg-muted p-6 md:aspect-auto">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Kapak görseli
            </span>
          </div>
          <div className="bg-card p-8 md:p-12">
            <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Makine Mühendisleri için 100 Prompt
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Mühendislerin üretken yapay zekâyı teknik iş akışlarında daha sistematik kullanmasına
              yardımcı olmak üzere hazırlanmış bir kaynak.
            </p>
            <Link to="/kitaplar" className={`${buttonStyles.secondary} mt-6`}>
              Kitapları Gör
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Eğitim & Danışmanlık"
          title="Eğitim &amp; Danışmanlık"
          description="Mühendisler, teknik ekipler ve kurumlar için yapay zekâ, mühendislik ve Ar-Ge odaklı eğitim ve danışmanlık."
        />
        <GridPanel columns={3} className="mt-8">
          {services.map((s) => (
            <InfoCard key={s.title} title={s.title} body={s.body} />
          ))}
        </GridPanel>
        <div className="mt-6">
          <Link to="/egitim" className={buttonStyles.primary}>
            Eğitim &amp; Danışmanlık
          </Link>
        </div>
      </Section>

      <Section>
        <CTABlock
          title="Mühendis, araştırmacı, eğitmen ve yazar."
          description="Mühendislik uygulamaları, akademik araştırma ve teknoloji geliştirme arasında çalışan; deneyimini eğitim, araştırma, yazılım araçları ve teknik yayınlarla paylaşan bir mühendis."
        >
          <Link to="/about" className={buttonStyles.secondary}>
            Hakkımda
          </Link>
        </CTABlock>
      </Section>

    </>
  );
}
