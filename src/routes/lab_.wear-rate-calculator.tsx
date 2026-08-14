import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { WearRateCalculator } from "@/components/lab/WearRateCalculator";
import { parseSlidingTransfer } from "@/lib/wearRate.transfer";

export const Route = createFileRoute("/lab_/wear-rate-calculator")({
  validateSearch: (search: Record<string, unknown>) => ({
    distance: typeof search["distance"] === "string" || typeof search["distance"] === "number"
      ? search["distance"]
      : undefined,
    distanceUnit: typeof search["distanceUnit"] === "string" ? search["distanceUnit"] : undefined,
    source: typeof search["source"] === "string" ? search["source"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Wear Rate Calculator | GMA Engineering Lab" },
      {
        name: "description",
        content:
          "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayan ücretsiz triboloji aracı.",
      },
      { property: "og:title", content: "Wear Rate Calculator | GMA Engineering Lab" },
      {
        property: "og:description",
        content:
          "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayan ücretsiz triboloji aracı.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lab/wear-rate-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/lab/wear-rate-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Wear Rate Calculator",
          url: "https://gmay.me/lab/wear-rate-calculator",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          inLanguage: "tr-TR",
          description: "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranını hesaplayan ücretsiz triboloji aracı.",
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          author: { "@id": "https://gmay.me/#person" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }),
  component: WearRatePage,
});

const equations: { label: string; formula: string; mode: string }[] = [
  { label: "Kütle → hacim dönüşümü", formula: "V = Δm / ρ", mode: "Kütle kaybı biliniyor" },
  { label: "Kütlesel aşınma / kayma mesafesi", formula: "q_m = Δm / s", mode: "Kütle kaybı biliniyor" },
  { label: "Hacimsel aşınma / kayma mesafesi", formula: "q_v = V / s", mode: "Her iki yöntem" },
  { label: "Özgül aşınma oranı", formula: "k_s = V / (F · s)", mode: "Her iki yöntem" },
];

const variables = [
  "V = aşınma hacmi",
  "Δm = kütle kaybı",
  "ρ = yoğunluk",
  "F = normal yük",
  "s = kayma mesafesi",
  "q_v = hacimsel aşınma / kayma mesafesi",
  "q_m = kütlesel aşınma / kayma mesafesi",
  "k_s = özgül aşınma oranı",
];

const interpretations = [
  {
    title: "Aşınma hacmi, V",
    text: "Deney sırasında numuneden uzaklaştırıldığı veya kaybedildiği kabul edilen malzeme hacmidir.",
  },
  {
    title: "Hacimsel aşınma / kayma mesafesi, q_v",
    text: "Birim kayma mesafesi başına hesaplanan aşınma hacmidir. Normal yüke göre normalize edilmemiştir.",
  },
  {
    title: "Özgül aşınma oranı, k_s",
    text: "Aşınma hacminin normal yük ve toplam kayma mesafesine bölünmesiyle elde edilir. Farklı deneylerin karşılaştırılmasında kullanılabilir; ancak karşılaştırma yalnızca tribolojik sistem ve deney koşulları dikkate alınarak yapılmalıdır.",
  },
  {
    title: "Kütlesel aşınma / kayma mesafesi, q_m",
    text: "Birim kayma mesafesi başına ölçülen kütle kaybıdır.",
  },
];

const relatedTools: {
  name: string;
  status: string;
  href: "/lab/hertz-contact-calculator" | "/lab/engineering-prompt-builder" | "/lab/sliding-distance-calculator";
  purpose: string;
}[] = [
  {
    name: "Hertz Contact Calculator",
    status: "Kullanılabilir",
    href: "/lab/hertz-contact-calculator" as const,
    purpose:
      "Küre-düzlem elastik temasında temas alanı, maksimum temas basıncı ve elastik yaklaşmayı hesaplar.",
  },
  {
    name: "Engineering Prompt Builder",
    status: "Kullanılabilir",
    href: "/lab/engineering-prompt-builder" as const,
    purpose: "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları oluşturur.",
  },
  {
    name: "Sliding Distance Calculator",
    status: "Kullanılabilir",
    href: "/lab/sliding-distance-calculator" as const,
    purpose:
      "Döner ve ileri-geri deneylerde toplam kayma mesafesini, çevrim sayısını ve ortalama kayma hızını hesaplar.",
  },
];

function WearRatePage() {
  const search = Route.useSearch();
  const transfer = parseSlidingTransfer(search);
  return (
    <>
      <PageHeader
        eyebrow="Tribology"
        title="Wear Rate Calculator"
        description="Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayın."
      />

      <Section>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Bu araç deneysel aşınma miktarını normal yük ve kayma mesafesine göre normalize eder.
          Literatürde sembol ve adlandırmalar değişebildiğinden, bu araç sonuçları kullanılan
          denklem ve birimlerle birlikte gösterir.
        </p>

        <div className="mt-8">
          <WearRateCalculator transfer={transfer} />
        </div>
      </Section>

      <Section>
        <details className="border border-border bg-card p-5 md:p-6">
          <summary className="cursor-pointer font-display text-lg font-semibold text-foreground">
            Kullanılan Denklemler
          </summary>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {equations.map((eq) => (
              <div key={eq.label} className="border border-border p-4">
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {eq.label}
                </dt>
                <dd className="mt-2 overflow-x-auto font-mono text-sm break-words text-foreground">
                  {eq.formula}
                </dd>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {eq.mode}
                </p>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 font-display text-base font-semibold text-foreground">
            Değişkenler ve birimler
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {variables.map((v) => (
              <li key={v} className="border-l border-border pl-4 font-mono text-xs text-muted-foreground">
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Girdi birimleri hesaplamadan önce SI birimlerine (m³, kg, kg/m³, N, m) dönüştürülür;
            sonuçlar mm³, mm³/m, mm³/(N·m) ve mg/m olarak sunulur. k_s bu araçta boyutsuz Archard
            aşınma katsayısı değildir.
          </p>
        </details>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Sonuçlar nasıl yorumlanır?
        </h2>
        <dl className="mt-5 grid max-w-4xl gap-4 sm:grid-cols-2">
          {interpretations.map((item) => (
            <div key={item.title} className="border border-border p-4">
              <dt className="font-display text-base font-semibold text-foreground">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Özgül aşınma oranlarının doğrudan karşılaştırılması için karşı cisim, yüzey pürüzlülüğü,
          yük, hız, kayma mesafesi, sıcaklık, nem, yağlama ve test geometrisi gibi tribolojik
          koşulların dikkate alınması gerekir.
        </p>
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
                {tool.href ? (
                  <Link to={tool.href} className="hover:underline hover:underline-offset-4">
                    {tool.name}
                  </Link>
                ) : (
                  tool.name
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.purpose}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Bu hesaplayıcı deneysel verilerin ön değerlendirmesi ve raporlanmasına yardımcı olmak
          amacıyla hazırlanmıştır. Sonuçlar test yöntemi, numune hazırlığı ve tribolojik sistem
          dikkate alınarak değerlendirilmelidir.
        </p>

        <Link to="/lab" className="mt-6 inline-block text-sm text-foreground underline underline-offset-4">
          Engineering Lab'e dön
        </Link>
      </Section>
    </>
  );
}
