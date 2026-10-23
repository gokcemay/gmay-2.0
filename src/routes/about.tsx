import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { CTABlock, buttonStyles } from "@/components/site/CTA";
import { profileLinks } from "@/lib/profiles";

export const Route = createFileRoute("/about")({
  head: ({ match }) => (localizeHead({
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
  }, match.context.language ?? 'en', "/about")),
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
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("Hakkımda")}
        title={tx("Mühendislikten araştırmaya, yapay zekâdan bilimkurguya")}
        description={tx("Mühendislik, akademik araştırma, teknoloji ve yazarlığın kesişiminde çalışıyorum.")}
      />

      <Section>
        <SectionHeader eyebrow={tx("01")} title={tx("Mühendislik & Araştırma")} />
        <p className={`mt-6 ${prose}`}>
          {tx("Makine mühendisliği, triboloji, yüzey mühendisliği ve mühendislik malzemeleri üzerine çalışıyorum. Akademik araştırma ile mühendislik uygulamalarını; deneysel çalışmalar, veri analizi ve teknik problem çözme süreçleri üzerinden bir araya getiriyorum.")}</p>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("02")} title={tx("Yapay Zekâ & Mühendislik")} />
        <p className={`mt-6 ${prose}`}>
          {tx("Üretken yapay zekânın mühendislik, araştırma ve eğitim süreçlerinde nasıl daha sistematik ve güvenilir kullanılabileceği üzerine çalışıyorum.")}{tx(" ")}
          {language === 'en' && 'I develop '}
          <Link to="/lab" className={inlineLink}>
            {tx("Mühendisler için araçlar")}</Link>{tx(" ")}
          {tx("geliştiriyor,")}{tx(" ")}
          {language === 'en' && 'deliver '}
          <Link to="/egitim" className={inlineLink}>
            {tx("uygulamalı eğitimler")}</Link>{tx(" ")}
          {tx("veriyor ve mühendislikte yapay zekâ üzerine")}{tx(" ")}
          <Link to="/articles" className={inlineLink}>
            {tx("yazıyorum")}</Link>
          .
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("03")} title={tx("Eğitim & Bilgi Paylaşımı")} />
        <p className={`mt-6 ${prose}`}>
          {tx("Mühendislik bilgisinin yalnızca akademik yayınlarda kalmaması gerektiğine inanıyorum. Eğitimler, teknik yazılar, kitaplar ve dijital araçlar aracılığıyla mühendislerin günlük işlerinde kullanabilecekleri yöntemler ve kaynaklar üretmeye çalışıyorum.")}</p>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("04")} title={tx("Yazarlık & Bilimkurgu")} />
        <p className={`mt-6 ${prose}`}>
          {tx("Teknik çalışmalarımın yanında bilimkurgu ve fantastik edebiyatla da ilgileniyorum. Mühendislik ile edebiyatı birbirinden tamamen ayrı alanlar olarak değil; merak etmenin, problem kurmanın ve olası gelecekleri düşünmenin farklı biçimleri olarak görüyorum.")}</p>
        <p className={`mt-4 ${prose}`}>
          {tx("Edebi çalışmalar:")}<span className="text-foreground">{tx("Hekate'deki Sır")}</span> {tx("ve")}{tx(" ")}
          <span className="text-foreground">{tx("Kanyonaltı'nda Bir Tekinsiz")}</span>.{tx(" ")}
          <Link to="/kitaplar" className={inlineLink}>
            {tx("Kitaplar")}</Link>{tx(" ")}
          {tx("sayfasında yer alıyor.")}</p>
      </Section>

      <Section>
        <SectionHeader eyebrow={tx("05")} title={tx("Profesyonel Profiller")} />
        <ul className="mt-8 flex flex-wrap gap-3">
          {tx(profiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tx(`${p.label} profili (yeni sekmede açılır)`)}
                className="inline-flex border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {tx(p.label)}
              </a>
            </li>
          )))}
        </ul>
      </Section>

      <Section>
        <CTABlock
          title={tx("Birlikte çalışalım")}
          description={tx("Mühendislik, araştırma, eğitim veya teknoloji geliştirme odaklı çalışmalar için iletişime geçebilirsiniz.")}
        >
          <Link to="/egitim" className={buttonStyles.secondary}>
            {tx("Eğitim & Danışmanlık")}</Link>
          <Link to="/iletisim" className={buttonStyles.primary}>
            {tx("İletişim")}</Link>
        </CTABlock>
      </Section>
    </>
  );
}
