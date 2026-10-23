import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from '@tanstack/react-query';

import { Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { buttonStyles, CTABlock } from "@/components/site/CTA";
import { ArticleList, substackPostsQueryOptions } from "@/components/site/Articles";
import { book, profileLinks } from "@/lib/profiles";
import bookCover from "@/assets/makine-muhendisleri-icin-100-prompt-kapak.jpg";

export const Route = createFileRoute("/")({
  head: ({ match }) => (localizeHead({
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
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }, match.context.language ?? 'en', "/")),
  loader: ({ context }) => context.queryClient.ensureQueryData(substackPostsQueryOptions),
  component: Index,
});

const labTools = [
  {
    label: "AI for Engineers",
    title: "Engineering Prompt Builder",
    body: "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları oluşturun.",
    href: "/lab/engineering-prompt-builder" as const,
  },
  {
    label: "Tribology & Contact",
    title: "Hertz Contact Calculator",
    body: "Küre-düzlem elastik temasında temas alanı ve Hertz basıncını hesaplayın.",
    href: "/lab/hertz-contact-calculator" as const,
  },
  {
    label: "Tribology & Contact",
    title: "Wear Rate Calculator",
    body: "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayın.",
    href: "/lab/wear-rate-calculator" as const,
  },
  {
    label: "Test Data & Planning",
    title: "Sliding Distance Calculator",
    body: "Döner ve ileri-geri deneylerde toplam kayma mesafesini ve kayma hızını hesaplayın.",
    href: "/lab/sliding-distance-calculator" as const,
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
  const tx = useT();
  const { data } = useSuspenseQuery(substackPostsQueryOptions);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.55]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
            {tx("Engineering × AI × Research")}</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-7xl">
            {tx("Gökçe Mehmet Ay — Mühendislik, Yapay Zekâ ve Araştırma")}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {tx("Mühendislik pratiğini, akademik araştırmayı ve üretken yapay zekâyı bir araya getiriyorum. Mühendisler ve araştırmacılar için araçlar geliştiriyor, eğitimler veriyor ve teknoloji üzerine yazıyorum.")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/lab" className={buttonStyles.primary}>
              {tx("Engineering Lab'i Keşfet")}</Link>
            <Link to="/egitim" className={buttonStyles.secondary}>
              {tx("Eğitim & Danışmanlık")}</Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            <a
              href={profileLinks.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              {tx("“Mühendisliğin Yapay Zeka Mentoru”nu Oku")}
            </a>
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow={tx("Engineering Lab")}
          title={tx("GMA Engineering Lab")}
          description={tx("Mühendislik hesaplamaları, test planlama ve yapay zekâ iş akışları için kullanılabilir durumdaki araçlar.")}
          action={
            <Link to="/lab" className={buttonStyles.secondary}>
              {tx("Tüm Araçları Gör")}</Link>
          }
        />

        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          {tx(labTools.map((t) => (
            <article key={t.title} className="flex flex-col bg-card p-5 md:p-6">
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {tx(t.label)}
              </p>
              <h3 className="mt-3 font-display text-base leading-snug font-semibold text-foreground">
                <Link
                  to={t.href}
                  search={{ distance: undefined, distanceUnit: undefined, source: undefined }}
                  className="hover:underline hover:underline-offset-4"
                >
                  {tx(t.title)}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(t.body)}</p>
            </article>
          )))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={tx("Yazılar")}
          title={tx("Son yazılar")}
          description={tx("Mühendislik, yapay zekâ, akademik araştırma ve teknoloji üzerine notlar, rehberler ve uygulama örnekleri.")}
          action={
            <Link to="/articles" className={buttonStyles.secondary}>
              {tx("Tüm yazılar")}</Link>
          }
        />
        <div className="mt-8">
          <ArticleList
            posts={data?.posts}
            isLoading={false}
            hasError={Boolean(data?.error)}
            limit={3}
            columns={3}
          />
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={tx("Araştırma")}
          title={tx("Araştırma ve mühendislik")}
          description={tx("Triboloji, yüzey mühendisliği, kaplamalar ve mühendislikte yapay zekâ başta olmak üzere çalışma alanları.")}
          action={
            <Link to="/research" className={buttonStyles.secondary}>
              {tx("Araştırmaları Gör")}</Link>
          }
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {tx(researchThemes.map((t, i) => (
            <article
              key={t.title}
              className={`flex flex-col border border-border bg-card p-6 md:p-7 ${
                i < 3 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              <h3 className="font-display text-lg font-semibold text-foreground">{tx(t.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tx(t.body)}</p>
            </article>
          )))}
        </div>
      </Section>


      <Section>
        <SectionHeader eyebrow={tx("Kitaplar")} title={tx("Öne çıkan kitap")} />
        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-[minmax(0,1fr)_2fr]">
          <div className="flex items-center justify-center bg-muted p-6">
            <img
              src={bookCover}
              alt={tx(book.coverAlt)}
              loading="lazy"
              className="max-h-[420px] w-full max-w-[280px] object-contain"
            />
          </div>
          <div className="bg-card p-8 md:p-12">
            <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              {tx(book.shortTitle)}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {tx("Mühendislerin üretken yapay zekâyı teknik iş akışlarında daha sistematik kullanmasına yardımcı olmak üzere hazırlanmış bir kaynak.")}</p>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonStyles.secondary} mt-6`}
            >
              {tx("Kitabı İncele")}</a>
            <div className="mt-4">
              <Link to="/kitaplar" className={buttonStyles.ghost}>
                {tx("Diğer kitaplar")}</Link>
            </div>
          </div>
        </div>
      </Section>


      <Section>
        <SectionHeader
          eyebrow={tx("Eğitim & Danışmanlık")}
          title={tx("Eğitim & Danışmanlık")}
          description={tx("Mühendisler, teknik ekipler ve kurumlar için yapay zekâ, mühendislik ve Ar-Ge odaklı eğitim ve danışmanlık.")}
        />
        <GridPanel columns={3} className="mt-8">
          {tx(services.map((s) => (
            <InfoCard key={s.title} title={tx(s.title)} body={s.body} />
          )))}
        </GridPanel>
        <div className="mt-6">
          <Link to="/egitim" className={buttonStyles.primary}>
            {tx("Eğitim & Danışmanlık")}</Link>
        </div>
      </Section>

      <Section>
        <CTABlock
          title={tx("Mühendis, araştırmacı, eğitmen ve yazar.")}
          description={tx("Mühendislik, akademik araştırma, yapay zekâ ve yazarlığı aynı merakın farklı yönleri olarak ele alıyorum.")}
        >
          <Link to="/about" className={buttonStyles.secondary}>
            {tx("Hakkımda")}</Link>
        </CTABlock>
      </Section>

    </>
  );
}
