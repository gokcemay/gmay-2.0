import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { SlidingDistanceCalculator } from "@/components/lab/SlidingDistanceCalculator";

const description =
  "Döner ve ileri-geri triboloji deneylerinde toplam kayma mesafesi, çevrim sayısı ve ortalama kayma hızını hesaplayan ücretsiz araç.";

export const Route = createFileRoute("/lab_/sliding-distance-calculator")({
  head: () => ({
    meta: [
      { title: "Sliding Distance Calculator | GMA Engineering Lab" },
      { name: "description", content: description },
      { property: "og:title", content: "Sliding Distance Calculator | GMA Engineering Lab" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lab/sliding-distance-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/lab/sliding-distance-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Sliding Distance Calculator",
          url: "https://gmay.me/lab/sliding-distance-calculator",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          inLanguage: "tr-TR",
          description: "Döner ve ileri-geri tribolojik testlerde toplam kayma mesafesi ve kayma hızını hesaplayan ücretsiz test planlama aracı.",
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          author: { "@id": "https://gmay.me/#person" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }),
  component: SlidingDistancePage,
});

const rotaryEquations = [
  { label: "Toplam devir sayısı", formula: "N = n t / 60" },
  { label: "Tur başına kayma mesafesi", formula: "C = 2πr" },
  { label: "Toplam kayma mesafesi", formula: "s = 2πrN" },
  { label: "Doğrusal kayma hızı", formula: "v = 2πrn / 60" },
];

const reciprocatingEquations = [
  { label: "Toplam çevrim sayısı", formula: "N = f t" },
  { label: "Çevrim başına kayma mesafesi", formula: "s_cycle = 2L" },
  { label: "Toplam kayma mesafesi", formula: "s = 2Lf t" },
  { label: "Ortalama kayma hızı", formula: "v_avg = 2Lf" },
];

const relatedTools = [
  {
    name: "Wear Rate Calculator",
    status: "Kullanılabilir",
    href: "/lab/wear-rate-calculator" as const,
    purpose: "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranını hesaplar.",
  },
  {
    name: "Hertz Contact Calculator",
    status: "Kullanılabilir",
    href: "/lab/hertz-contact-calculator" as const,
    purpose: "Küre-düzlem elastik temasında temas alanı, maksimum basınç ve elastik yaklaşmayı hesaplar.",
  },
  {
    name: "Engineering Prompt Builder",
    status: "Kullanılabilir",
    href: "/lab/engineering-prompt-builder" as const,
    purpose: "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları oluşturur.",
  },
];

function SlidingDistancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Tribology"
        title="Sliding Distance Calculator"
        description="Döner ve ileri-geri triboloji deneylerinde toplam kayma mesafesini, çevrim sayısını ve ortalama kayma hızını hesaplayın."
      />

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Kayma mesafesi, özgül aşınma oranı gibi tribolojik hesaplamalarda temel deney
          parametrelerinden biridir.
        </p>

        <div className="mt-8">
          <SlidingDistanceCalculator />
        </div>
      </Section>

      <Section>
        <details className="border border-border bg-card p-5 md:p-6">
          <summary className="cursor-pointer font-display text-lg font-semibold text-foreground">
            Kullanılan Denklemler
          </summary>

          <h3 className="mt-5 font-display text-base font-semibold text-foreground">
            Döner hareket
          </h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            {rotaryEquations.map((eq) => (
              <div key={eq.formula} className="border border-border p-4">
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {eq.label}
                </dt>
                <dd className="mt-2 overflow-x-auto font-mono text-sm break-words text-foreground">
                  {eq.formula}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {["r = iz yarıçapı [m]", "n = dönme hızı [rpm]", "t = deney süresi [s]"].map((v) => (
              <li
                key={v}
                className="border-l border-border pl-4 font-mono text-xs text-muted-foreground"
              >
                {v}
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-display text-base font-semibold text-foreground">
            İleri-geri hareket
          </h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            {reciprocatingEquations.map((eq) => (
              <div key={eq.formula} className="border border-border p-4">
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {eq.label}
                </dt>
                <dd className="mt-2 overflow-x-auto font-mono text-sm break-words text-foreground">
                  {eq.formula}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              "L = terslenme noktaları arası mesafe [m]",
              "f = saniyedeki tam çevrim sayısı [1/s]",
              "t = deney süresi [s]",
            ].map((v) => (
              <li
                key={v}
                className="border-l border-border pl-4 font-mono text-xs text-muted-foreground"
              >
                {v}
              </li>
            ))}
          </ul>
        </details>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">Hareket tanımları</h2>
        <dl className="mt-5 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="border border-border p-4">
            <dt className="font-display text-base font-semibold text-foreground">
              Döner sistemler
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              İz yarıçapı, dönme merkezinden gerçek temas izine olan mesafedir.
            </dd>
          </div>
          <div className="border border-border p-4">
            <dt className="font-display text-base font-semibold text-foreground">
              İleri-geri sistemler
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Strok uzunluğu, iki terslenme noktası arasındaki tek yönlü mesafedir. Bir tam çevrimde
              2L yol alınır; strok uzunluğu genlik ile aynı anlamda kullanılmaz.
            </dd>
          </div>
          <div className="border border-border p-4">
            <dt className="font-display text-base font-semibold text-foreground">Frekans</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Bu araçta frekans, tam ileri-gidiş ve geri-dönüş çevrimi / zaman olarak tanımlanır.
              Saniyedeki tek yönlü strok sayısı değildir.
            </dd>
          </div>
        </dl>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">İlgili Araçlar</h2>
        <div className="mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
          {relatedTools.map((tool) => (
            <article key={tool.name} className="border border-border bg-card p-5">
              <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                {tool.status}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                <Link to={tool.href} className="hover:underline hover:underline-offset-4">
                  {tool.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.purpose}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Bu araç idealize edilmiş sabit hareket parametrelerinden toplam kayma mesafesini hesaplar.
          Gerçek cihaz hareket profili, hızlanma/yavaşlama, dwell süresi veya kontrol sistemi
          davranışı farklıysa cihazın gerçek hareket verileri esas alınmalıdır.
        </p>

        <Link
          to="/lab"
          className="mt-6 inline-block text-sm text-foreground underline underline-offset-4"
        >
          Engineering Lab'e dön
        </Link>
      </Section>
    </>
  );
}
