import { useT, localizeHead } from '@/lib/i18n';
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeader } from "@/components/site/Section";
import { GridPanel, InfoCard } from "@/components/site/Cards";
import { academicProfiles } from "@/lib/profiles";

export const Route = createFileRoute("/research")({
  head: ({ match }) => (localizeHead({
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
      { property: "og:url", content: "/research" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/research" }],
  }, match.context.language ?? 'en', "/research")),
  component: ResearchPage,
});

const areas = [
  {
    title: "Tribology",
    body: "Sürtünme ve aşınma davranışının deneysel olarak incelenmesi; aşınma mekanizmalarının ve özgül aşınma oranlarının değerlendirilmesi.",
  },
  {
    title: "Surface Engineering",
    body: "Yüzey işlemleri, yüzey pürüzlülüğü ve yüzey karakterizasyonu ile malzeme performansı arasındaki ilişkiler.",
  },
  {
    title: "Coatings",
    body: "Kaplama süreçleri, kaplama–altlık uyumu ve kaplamaların sürtünme, aşınma ve dayanım performansına etkisi.",
  },
  {
    title: "Engineering Materials",
    body: "Mühendislik malzemelerinin mekanik ve tribolojik özelliklerinin uygulama koşullarıyla birlikte değerlendirilmesi.",
  },
  {
    title: "AI in Engineering",
    body: "Üretken yapay zekâ ve veri odaklı yöntemlerin mühendislik analizi, dokümantasyon ve araştırma iş akışlarında kullanımı.",
  },
];

const methods = [
  {
    title: "Deney kurgusu",
    body: "Yük, kayma hızı, kayma mesafesi ve ortam koşullarının kontrollü biçimde tanımlandığı, tekrar üretilebilir tribolojik test planları.",
  },
  {
    title: "Ölçüm ve değerlendirme",
    body: "Kütle kaybı veya aşınma hacmi üzerinden hacimsel ve özgül aşınma oranlarının hesaplanması; temas koşullarının Hertz elastik temas yaklaşımıyla değerlendirilmesi.",
  },
  {
    title: "Yüzey incelemesi",
    body: "Aşınma izlerinin ve yüzey morfolojisinin incelenerek baskın aşınma mekanizmalarının yorumlanması.",
  },
];

function ResearchPage() {
  const tx = useT();
  return (
    <>
      <PageHeader
        eyebrow={tx("Araştırma")}
        title={tx("Araştırma")}
        description={tx("Triboloji ve yüzey mühendisliği başta olmak üzere akademik ve uygulamalı araştırma alanları.")}
      />

      <Section>
        <SectionHeader eyebrow={tx("01")} title={tx("Araştırma alanları")} />
        <GridPanel columns={3} className="mt-8">
          {tx(areas.map((a) => (
            <InfoCard key={a.title} title={tx(a.title)} body={a.body} />
          )))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={tx("02")}
          title={tx("Triboloji ve yüzey mühendisliği")}
          description={tx("Sürtünme, aşınma, yağlama ve yüzey performansı üzerine çalışmalarda izlenen yaklaşım.")}
        />
        <GridPanel columns={3} className="mt-8">
          {tx(methods.map((m) => (
            <InfoCard key={m.title} title={tx(m.title)} body={m.body} />
          )))}
        </GridPanel>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={tx("03")}
          title={tx("Yayınlar")}
          description={tx("Yayın listesinin güncel ve doğrulanabilir hâli akademik profillerde tutulmaktadır.")}
        />
        <ul className="mt-8 flex flex-wrap gap-3">
          {tx(academicProfiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tx(`${p.label} üzerinde yayın listesi (yeni sekmede açılır)`)}
                className="inline-flex border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {tx(p.label)} {tx("üzerinde yayınlar")}</a>
            </li>
          )))}
        </ul>
      </Section>
    </>
  );
}
