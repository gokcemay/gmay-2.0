import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { WearRateCalculator } from "@/components/lab/WearRateCalculator";
import { Faq } from "@/components/site/Faq";
import { parseSlidingTransfer } from "@/lib/wearRate.transfer";

export const Route = createFileRoute("/lab_/wear-rate-calculator")({
  validateSearch: (search: Record<string, unknown>) => ({
    distance: typeof search["distance"] === "string" || typeof search["distance"] === "number"
      ? search["distance"]
      : undefined,
    distanceUnit: typeof search["distanceUnit"] === "string" ? search["distanceUnit"] : undefined,
    source: typeof search["source"] === "string" ? search["source"] : undefined,
  }),
  head: ({ match }) => (localizeHead({
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
  }, match.context.language ?? 'en', "/lab/wear-rate-calculator")),
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
  href: "/lab/hertz-contact-calculator" | "/lab/engineering-prompt-builder" | "/lab/sliding-distance-calculator" | "/lab/pin-on-disc-wear-calculator";
  purpose: string;
}[] = [
  {
    name: "Pin-on-Disc Wear Test Calculator",
    status: "Kullanılabilir",
    href: "/lab/pin-on-disc-wear-calculator" as const,
    purpose: "Pin-on-disc deneyinde kütle kaybından aşınma hacmini, kayma mesafesini, özgül aşınma oranını ve sürtünme katsayısını hesaplayın.",
  },
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

const useCases = [
  "Pin-on-disc ve benzeri kaymalı aşınma deneylerinin değerlendirilmesi",
  "Farklı malzemelerin aşınma davranışının karşılaştırılması",
  "Kaplama performansının kaplamasız referans numuneyle kıyaslanması",
  "Triboloji deney raporlarında aşınma sonuçlarının normalize edilmesi",
  "Malzeme aşınma çalışmalarında literatür değerleriyle ön karşılaştırma",
];

function WearRatePage() {
  const tx = useT();
  const tr = useLanguage() === 'tr';
  const search = Route.useSearch();
  const faqItems = tr
    ? [
        {
          q: "Özgül aşınma oranı nedir?",
          a: "Aşınma hacminin normal yük ve toplam kayma mesafesine bölünmesiyle elde edilen normalize edilmiş bir aşınma ölçüsüdür: k_s = V/(F·s). Birimi genellikle mm³/(N·m) olarak verilir ve farklı deney koşullarının karşılaştırılmasında kullanılır.",
        },
        {
          q: "Aşınma oranı nasıl hesaplanır?",
          a: "Önce aşınma hacmi belirlenir; kütle kaybı ölçülmüşse V = Δm/ρ ile hacme dönüştürülür. Ardından k_s = V/(F·s) formülüyle özgül aşınma oranı, q_v = V/s ile birim kayma mesafesi başına hacimsel aşınma hesaplanır.",
        },
        {
          q: "Kütle kaybı aşınma hacmine nasıl dönüştürülür?",
          a: "Kütle kaybı numune malzemesinin yoğunluğuna bölünür: V = Δm/ρ. Örneğin mg cinsinden kütle kaybı ve g/cm³ cinsinden yoğunluk kullanıldığında sonuç mm³ elde edilir. Bu araç birim dönüşümlerini hesaplamadan önce otomatik olarak yapar.",
        },
        {
          q: "Özgül aşınma oranı hangi birimlerle verilir?",
          a: "En yaygın birim mm³/(N·m) şeklindedir; SI birimlerinde m³/(N·m) = m²/N de kullanılır. Bu araç girdileri SI birimlerine dönüştürür ve sonuçları mm³/(N·m), mm³/m ve mg/m olarak sunar. k_s burada boyutsuz Archard katsayısı K değildir; tutarlı birimlerle k_s = K/H ilişkisi vardır.",
        },
      ]
    : [
        {
          q: "What is specific wear rate?",
          a: "It is a normalized wear measure obtained by dividing the wear volume by the normal load and the total sliding distance: k_s = V/(F·s). It is usually reported in mm³/(N·m) and used to compare different test conditions.",
        },
        {
          q: "How do you calculate wear rate?",
          a: "First determine the wear volume; if mass loss was measured, convert it with V = Δm/ρ. Then compute the specific wear rate with k_s = V/(F·s) and the volumetric wear per sliding distance with q_v = V/s.",
        },
        {
          q: "How do you convert mass loss to wear volume?",
          a: "Divide the mass loss by the density of the specimen material: V = Δm/ρ. For example, with mass loss in mg and density in g/cm³, the result is in mm³. This tool performs the unit conversions automatically before the calculation.",
        },
        {
          q: "What units are used for specific wear rate?",
          a: "The most common unit is mm³/(N·m); in SI units, m³/(N·m) = m²/N is also used. This tool converts inputs to SI units and reports results in mm³/(N·m), mm³/m and mg/m. Here k_s is not the dimensionless Archard coefficient K; with consistent units, k_s = K/H.",
        },
      ];
  const transfer = parseSlidingTransfer(search);
  return (
    <>
      <PageHeader
        eyebrow={tx("Tribology")}
        title={tx("Wear Rate Calculator")}
        description={tx("Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranlarını hesaplayın.")}
      />

      <Section>
        <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{tr ? 'Aşınma oranı formülü ve Archard denklemi' : 'Wear rate formula and the Archard wear equation'}</h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr ? 'Özgül aşınma oranı k_s = V/(F·s) ile hesaplanır: V aşınma hacmi (mm³), F normal yük (N), s kayma mesafesi (m); sonuç mm³/(N·m) olur. Hacimsel aşınma/mesafe q_v = V/s (mm³/m) şeklindedir. Kütle kaybı biliniyorsa hacim V = Δm/ρ ile bulunur ve birimler önce tutarlı hale getirilir.' : 'The specific wear rate formula is k_s = V/(F·s): V is wear volume (mm³), F is normal load (N), and s is sliding distance (m), giving mm³/(N·m). Volumetric wear per sliding distance is q_v = V/s (mm³/m). If mass loss is known, volume is obtained from V = Δm/ρ after converting to consistent units.'}
        </p>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr ? 'Klasik Archard aşınma denklemi V = K·F·s/H şeklindedir; H sertlik, K boyutsuz aşınma katsayısıdır. Tutarlı birimlerle k_s = K/H olur. Bu araç ölçülen kayma aşınmasını normalize eder; sertlikten aşınma tahmini yapmaz ve boyutsuz K katsayısını hesaplamaz.' : 'The classical Archard wear equation is V = K·F·s/H, where H is hardness and K is a dimensionless wear coefficient. With consistent units, k_s = K/H. This tool normalizes measured sliding wear; it does not predict wear from hardness or calculate the dimensionless coefficient K.'}
        </p>
        <p className="max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Bu araç deneysel aşınma miktarını normal yük ve kayma mesafesine göre normalize eder. Literatürde sembol ve adlandırmalar değişebildiğinden, bu araç sonuçları kullanılan denklem ve birimlerle birlikte gösterir.")}</p>

        <div className="mt-8">
          <WearRateCalculator transfer={transfer} />
        </div>
      </Section>

      <Section>
        <details className="border border-border bg-card p-5 md:p-6">
          <summary className="cursor-pointer font-display text-lg font-semibold text-foreground">
            {tx("Kullanılan Denklemler")}</summary>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {tx(equations.map((eq) => (
              <div key={eq.label} className="border border-border p-4">
                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {tx(eq.label)}
                </dt>
                <dd className="mt-2 overflow-x-auto font-mono text-sm break-words text-foreground">
                  {tx(eq.formula)}
                </dd>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {tx(eq.mode)}
                </p>
              </div>
            )))}
          </dl>

          <h3 className="mt-6 font-display text-base font-semibold text-foreground">
            {tx("Değişkenler ve birimler")}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tx(variables.map((v) => (
              <li key={v} className="border-l border-border pl-4 font-mono text-xs text-muted-foreground">
                {tx(v)}
              </li>
            )))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {tx("Girdi birimleri hesaplamadan önce SI birimlerine (m³, kg, kg/m³, N, m) dönüştürülür; sonuçlar mm³, mm³/m, mm³/(N·m) ve mg/m olarak sunulur. k_s bu araçta boyutsuz Archard aşınma katsayısı değildir.")}</p>
        </details>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Sonuçlar nasıl yorumlanır?")}</h2>
        <dl className="mt-5 grid max-w-4xl gap-4 sm:grid-cols-2">
          {tx(interpretations.map((item) => (
            <div key={item.title} className="border border-border p-4">
              <dt className="font-display text-base font-semibold text-foreground">{tx(item.title)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(item.text)}</dd>
            </div>
          )))}
        </dl>

        <p className="mt-8 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Özgül aşınma oranlarının doğrudan karşılaştırılması için karşı cisim, yüzey pürüzlülüğü, yük, hız, kayma mesafesi, sıcaklık, nem, yağlama ve test geometrisi gibi tribolojik koşulların dikkate alınması gerekir.")}</p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Özgül ve hacimsel aşınma oranı arasındaki fark")}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr
            ? "Hacimsel aşınma oranı q_v = V/s, birim kayma mesafesi başına aşınan hacmi verir ve yüke göre normalize edilmemiştir. Özgül aşınma oranı k_s = V/(F·s) ise normal yükü de hesaba katar; bu nedenle farklı yüklerde yapılan deneylerin karşılaştırılmasında tercih edilir. Her iki büyüklük de ölçülen aşınmayı tanımlar; hiçbiri tek başına aşınma mekanizması hakkında bilgi vermez."
            : "The volumetric wear rate q_v = V/s gives the worn volume per unit sliding distance and is not normalized by load. The specific wear rate k_s = V/(F·s) also accounts for the normal load, which is why it is preferred when comparing tests run at different loads. Both quantities describe measured wear; neither alone reveals the wear mechanism."}
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Tipik kullanım alanları")}</h2>
        <ul className="mt-5 grid max-w-4xl gap-2 sm:grid-cols-2">
          {tx(useCases.map((item) => (
            <li
              key={item}
              className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              {tx(item)}
            </li>
          )))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr ? "Triboloji deneyleri ve temas koşulları hakkında daha fazla bağlam için " : "For more context on tribology experiments and contact conditions, see the "}
          <Link to="/research" className="text-foreground underline underline-offset-4">
            {tr ? "araştırma sayfasına" : "research page"}
          </Link>
          {tr ? " bakabilirsiniz." : "."}
        </p>
      </Section>

      <Section>
        <Faq title={tr ? "Sık sorulan sorular" : "Frequently asked questions"} items={faqItems} />
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{tx("İlgili Araçlar")}</h2>
        <div className="mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
          {tx(relatedTools.map((tool) => (
            <article key={tool.name} className="border border-border bg-card p-5">
              <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                {tx(tool.status)}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                {tool.href ? (
                  <Link to={tool.href} className="hover:underline hover:underline-offset-4">
                    {tx(tool.name)}
                  </Link>
                ) : (
                  tool.name
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(tool.purpose)}</p>
            </article>
          )))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {tx("Bu hesaplayıcı deneysel verilerin ön değerlendirmesi ve raporlanmasına yardımcı olmak amacıyla hazırlanmıştır. Sonuçlar test yöntemi, numune hazırlığı ve tribolojik sistem dikkate alınarak değerlendirilmelidir.")}</p>

        <Link to="/lab" className="mt-6 inline-block text-sm text-foreground underline underline-offset-4">
          {tx("Engineering Lab'e dön")}</Link>
      </Section>
      <RelatedKnowledge />
    </>
  );
}
