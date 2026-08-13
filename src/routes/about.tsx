import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { CTABlock, buttonStyles } from "@/components/site/CTA";
import { profileLinks } from "@/lib/profiles";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Hakkımda | Gökçe Mehmet Ay" },
      {
        name: "description",
        content:
          "Gökçe Mehmet Ay'ın mühendislik, akademik araştırma, yapay zekâ, eğitim ve yazarlık çalışmalarına genel bakış.",
      },
      { property: "og:title", content: "Hakkımda | Gökçe Mehmet Ay" },
      {
        property: "og:description",
        content:
          "Gökçe Mehmet Ay'ın mühendislik, akademik araştırma, yapay zekâ, eğitim ve yazarlık çalışmalarına genel bakış.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const profiles = [
  { label: "LinkedIn", href: profileLinks.linkedin },
  { label: "AVESIS", href: profileLinks.avesis },
  { label: "Google Scholar", href: profileLinks.scholar },
  { label: "ORCID", href: profileLinks.orcid },
  { label: "YouTube", href: profileLinks.youtube },
  { label: "Substack", href: profileLinks.substack },
];

const prose = "max-w-2xl text-base leading-relaxed text-muted-foreground";
const inlineLink = "text-foreground underline underline-offset-4 hover:text-accent";

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımda"
        title="Mühendislikten araştırmaya, yapay zekâdan bilimkurguya"
        description="Mühendislik, akademik araştırma, teknoloji ve yazarlığın kesişiminde çalışıyorum."
      />

      <Section>
        <SectionHeader eyebrow="01" title="Mühendislik & Araştırma" />
        <p className={`mt-6 ${prose}`}>
          Makine mühendisliği, triboloji, yüzey mühendisliği ve mühendislik malzemeleri üzerine
          çalışıyorum. Akademik araştırma ile mühendislik uygulamalarını; deneysel çalışmalar, veri
          analizi ve teknik problem çözme süreçleri üzerinden bir araya getiriyorum.
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow="02" title="Yapay Zekâ & Mühendislik" />
        <p className={`mt-6 ${prose}`}>
          Üretken yapay zekânın mühendislik, araştırma ve eğitim süreçlerinde nasıl daha sistematik
          ve güvenilir kullanılabileceği üzerine çalışıyorum.{" "}
          <Link to="/lab" className={inlineLink}>
            Mühendisler için araçlar
          </Link>{" "}
          geliştiriyor,{" "}
          <Link to="/egitim" className={inlineLink}>
            uygulamalı eğitimler
          </Link>{" "}
          veriyor ve mühendislikte yapay zekâ üzerine{" "}
          <Link to="/articles" className={inlineLink}>
            yazıyorum
          </Link>
          .
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow="03" title="Eğitim & Bilgi Paylaşımı" />
        <p className={`mt-6 ${prose}`}>
          Mühendislik bilgisinin yalnızca akademik yayınlarda kalmaması gerektiğine inanıyorum.
          Eğitimler, teknik yazılar, kitaplar ve dijital araçlar aracılığıyla mühendislerin günlük
          işlerinde kullanabilecekleri yöntemler ve kaynaklar üretmeye çalışıyorum.
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow="04" title="Yazarlık & Bilimkurgu" />
        <p className={`mt-6 ${prose}`}>
          Teknik çalışmalarımın yanında bilimkurgu ve fantastik edebiyatla da ilgileniyorum.
          Mühendislik ile edebiyatı birbirinden tamamen ayrı alanlar olarak değil; merak etmenin,
          problem kurmanın ve olası gelecekleri düşünmenin farklı biçimleri olarak görüyorum.
        </p>
        <p className={`mt-4 ${prose}`}>
          Edebi çalışmalar: <span className="text-foreground">Hekate'deki Sır</span> ve{" "}
          <span className="text-foreground">Kanyonaltı'nda Bir Tekinsiz</span>.{" "}
          <Link to="/kitaplar" className={inlineLink}>
            Kitaplar
          </Link>{" "}
          sayfasında yer alıyor.
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow="05" title="Profesyonel Profiller" />
        <ul className="mt-8 flex flex-wrap gap-3">
          {profiles.map((p) => (
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

      <Section>
        <CTABlock
          title="Birlikte çalışalım"
          description="Mühendislik, araştırma, eğitim veya teknoloji geliştirme odaklı çalışmalar için iletişime geçebilirsiniz."
        >
          <Link to="/egitim" className={buttonStyles.secondary}>
            Eğitim &amp; Danışmanlık
          </Link>
          <Link to="/iletisim" className={buttonStyles.primary}>
            İletişim
          </Link>
        </CTABlock>
      </Section>
    </>
  );
}
