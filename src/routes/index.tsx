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

const articles = [
  {
    title: "Yazı başlığı yer tutucusu",
    category: "AI for Engineers",
    date: "—",
    excerpt: "Bu alan yakında yayımlanacak yazılar için ayrılmıştır. İçerik henüz bağlanmadı.",
  },
  {
    title: "Yazı başlığı yer tutucusu",
    category: "Mechanical",
    date: "—",
    excerpt: "Bu alan yakında yayımlanacak yazılar için ayrılmıştır. İçerik henüz bağlanmadı.",
  },
  {
    title: "Yazı başlığı yer tutucusu",
    category: "Research",
    date: "—",
    excerpt: "Bu alan yakında yayımlanacak yazılar için ayrılmıştır. İçerik henüz bağlanmadı.",
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
  { title: "AI for Engineers", body: "Mühendisler için uygulamalı yapay zeka eğitimi." },
  { title: "Corporate AI Training", body: "Kurumsal ekiplere yönelik yapay zeka programları." },
  { title: "Engineering / R&D Consulting", body: "Mühendislik ve Ar-Ge süreçleri için danışmanlık." },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.55]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-32">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            Engineering × AI × Research
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-7xl">
            Gökçe Mehmet Ay
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Mühendislik pratiği, yapay zeka ve akademik araştırmanın kesiştiği noktada çalışıyorum.
            Bu platform; mühendisler ve araştırmacılar için araçlar, yazılar ve kaynaklar sunar.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/lab" className={buttonStyles.primary}>
              Explore Engineering Lab
            </Link>
            <Link to="/egitim" className={buttonStyles.secondary}>
              Training &amp; Consulting
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            <a
              href="https://gmehmetay.substack.com"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Read “Mühendisliğin Yapay Zeka Mentoru”
            </a>
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="Engineering Lab"
          title="GMA Engineering Lab"
          description="Mühendisler ve araştırmacılar için pratik araçlardan oluşan bir koleksiyon."
          action={
            <Link to="/lab" className={buttonStyles.secondary}>
              Tüm kategoriler
            </Link>
          }
        />
        <GridPanel columns={4} className="mt-12">
          {labCategories.map((c) => (
            <InfoCard
              key={c.title}
              label={c.label}
              title={c.title}
              body={c.body}
              footer={
                <Link to="/lab" className={buttonStyles.ghost}>
                  Kategoriye git
                </Link>
              }
            />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Articles"
          title="Son yazılar"
          description="Mühendislik, yapay zeka, araştırma ve teknoloji üzerine yazılar."
          action={
            <Link to="/articles" className={buttonStyles.secondary}>
              Tüm yazılar
            </Link>
          }
        />
        <GridPanel columns={3} className="mt-12">
          {articles.map((a, i) => (
            <ArticleCard key={i} {...a} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Research"
          title="Araştırma ve mühendislik"
          description="Triboloji ve yüzey mühendisliği başta olmak üzere çalışma alanları."
          action={
            <Link to="/research" className={buttonStyles.secondary}>
              Araştırma
            </Link>
          }
        />
        <GridPanel columns={3} className="mt-12">
          {researchThemes.map((t) => (
            <InfoCard key={t.title} title={t.title} body={t.body} />
          ))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader eyebrow="Books" title="Öne çıkan kitap" />
        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-[minmax(0,1fr)_2fr]">
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
              Kitap açıklaması, yayınevi ve künye bilgileri henüz eklenmedi.
            </p>
            <Link to="/kitaplar" className={`${buttonStyles.secondary} mt-8`}>
              Kitaplar
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Training & Consulting"
          title="Eğitim ve danışmanlık"
          description="Mühendislik ekipleri ve kurumlar için uygulamalı programlar."
        />
        <GridPanel columns={3} className="mt-12">
          {services.map((s) => (
            <InfoCard key={s.title} title={s.title} body={s.body} />
          ))}
        </GridPanel>
        <div className="mt-8">
          <Link to="/egitim" className={buttonStyles.primary}>
            Eğitim ve danışmanlık
          </Link>
        </div>
      </Section>

      <Section>
        <CTABlock
          title="Mühendis, araştırmacı, eğitmen ve yazar."
          description="Mühendislik pratiği ile akademik araştırmayı yapay zeka araçlarıyla birleştiriyorum. Ayrıntılı profesyonel hikâye hazırlanıyor."
        >
          <Link to="/about" className={buttonStyles.secondary}>
            Hakkımda
          </Link>
        </CTABlock>
      </Section>
    </>
  );
}
