import { useT, useLanguage, localizeHead } from '@/lib/i18n';
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { HertzContactCalculator } from "@/components/lab/HertzContactCalculator";
import { Faq } from "@/components/site/Faq";

export const Route = createFileRoute("/lab_/hertz-contact-calculator")({
  head: ({ match }) => (localizeHead({
    meta: [
      { title: "Hertz Contact Calculator | GMA Engineering Lab" },
      {
        name: "description",
        content:
          "Küre-düzlem Hertz temasında temas yarıçapı, temas alanı, maksimum basınç ve elastik yaklaşmayı hesaplayan ücretsiz mühendislik aracı.",
      },
      { property: "og:title", content: "Hertz Contact Calculator | GMA Engineering Lab" },
      {
        property: "og:description",
        content:
          "Küre-düzlem elastik Hertz teması için temas alanı, maksimum temas basıncı ve elastik yaklaşma hesaplayıcısı.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lab/hertz-contact-calculator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/lab/hertz-contact-calculator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Hertz Contact Calculator",
          url: "https://gmay.me/lab/hertz-contact-calculator",
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          inLanguage: "tr-TR",
          description: "Küre-düzlem Hertz elastik temasında temas yarıçapı, temas alanı, maksimum basınç ve elastik yaklaşmayı hesaplayan ücretsiz mühendislik aracı.",
          isPartOf: { "@type": "WebSite", "@id": "https://gmay.me/#website" },
          author: { "@id": "https://gmay.me/#person" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        }),
      },
    ],
  }, match.context.language ?? 'en', "/lab/hertz-contact-calculator")),
  component: HertzPage,
});

const equations: { label: string; formula: string }[] = [
  { label: "Efektif elastisite modülü", formula: "1/E* = (1 − ν₁²)/E₁ + (1 − ν₂²)/E₂" },
  { label: "Küre yarıçapı", formula: "R = D / 2" },
  { label: "Temas yarıçapı", formula: "a = [ (3 F R) / (4 E*) ]^(1/3)" },
  { label: "Temas alanı", formula: "A = π a²" },
  { label: "Maksimum Hertz basıncı", formula: "p₀ = 3F / (2 π a²)" },
  { label: "Ortalama temas basıncı", formula: "p_mean = F / (π a²) = (2/3) p₀" },
  { label: "Elastik yaklaşma", formula: "δ = a² / R" },
  {
    label: "Basınç dağılımı (radyal, r ≥ 0)",
    formula: "p(r) = p₀ · √(1 − (r/a)²),  0 ≤ r ≤ a",
  },
  {
    label: "Basınç dağılımı (çap boyunca kesit, işaretli x)",
    formula: "p(x) = p₀ · √(1 − (x/a)²),  −a ≤ x ≤ +a",
  },
];

const assumptions = [
  "Malzemeler homojen ve izotropiktir.",
  "Davranış lineer elastiktir.",
  "Temas, sürtünmesiz normal yükleme olarak ele alınır.",
  "Yüzeyler düzgün (pürüzsüz) kabul edilir.",
  "Temas alanı, küre yarıçapına ve cisim boyutlarına göre küçüktür.",
  "Temas non-conformal (localized contact) olup Hertz yaklaşımını sağlar.",
  "Adezyon etkileri ihmal edilir.",
  "Plastik deformasyon ihmal edilir.",
  "Kaplama ve katmanlı malzeme etkileri ihmal edilir.",
];

const interpretations = [
  {
    title: "Temas yarıçapı, a",
    text: "Yükün elastik olarak aktarıldığı dairesel temas bölgesinin yarıçapıdır.",
  },
  {
    title: "Maksimum Hertz basıncı, p₀",
    text: "Temas alanının merkezindeki ideal Hertz basıncıdır.",
  },
  {
    title: "Ortalama temas basıncı, p_mean",
    text: "Toplam normal yükün Hertz temas alanına bölünmesiyle elde edilir.",
  },
  {
    title: "Elastik yaklaşma, δ",
    text: "Yük altında iki cismin Hertz modeline göre elastik normal yaklaşmasını temsil eder.",
  },
];

const relatedTools = [
  {
    name: "Engineering Prompt Builder",
    status: "Kullanılabilir",
    href: "/lab/engineering-prompt-builder" as const,
    purpose: "Mühendislik görevleri için yapılandırılmış yapay zekâ promptları oluşturur.",
  },
  {
    name: "Wear Rate Calculator",
    status: "Kullanılabilir",
    href: "/lab/wear-rate-calculator" as const,
    purpose: "Aşınma hacmi veya kütle kaybından hacimsel ve özgül aşınma oranını hesaplar.",
  },
  {
    name: "Sliding Distance Calculator",
    status: "Kullanılabilir",
    href: "/lab/sliding-distance-calculator" as const,
    purpose: "Döner ve ileri-geri deneylerde toplam kayma mesafesini, çevrim sayısını ve ortalama kayma hızını hesaplar.",
  },
];

const inputParameters = [
  {
    title: "Küre yarıçapı, R",
    text: "Temasa gelen kürenin yarıçapıdır; çap girildiğinde yarıçap R = D/2 olarak alınır. mm, µm veya m olarak girilebilir.",
  },
  {
    title: "Normal yük, F",
    text: "Teması oluşturan dış normal kuvvettir; N veya kN olarak girilir. Temas yarıçapı yükün küp köküyle büyür.",
  },
  {
    title: "Elastisite modülü, E",
    text: "Temas eden iki malzemenin Young modülleridir; GPa veya MPa olarak girilir ve efektif modül E* hesabında birleştirilir.",
  },
  {
    title: "Poisson oranı, ν",
    text: "Her iki malzeme için Poisson oranıdır; efektif elastisite modülü 1/E* = (1 − ν₁²)/E₁ + (1 − ν₂²)/E₂ ifadesinde kullanılır.",
  },
];

const useCases = [
  "Bilyalı ve makaralı rulmanlarda yuvarlanma temasının ön değerlendirmesi",
  "Dişli çark temaslarında yerel temas basıncının ilk tahmini",
  "Yuvarlanmalı ve kaymalı temas içeren triboloji deneylerinin planlanması",
  "Küre-düzlem (ball-on-flat) aşınma ve sürtünme deneylerinde yük seçimi",
  "Temas mekaniği derslerinde ve araştırmalarında Hertz çözümünün doğrulanması",
];

function HertzPage() {
  const tx = useT();
  const tr = useLanguage() === 'tr';
  const faqItems = tr
    ? [
        {
          q: "Hertzian temas gerilmesi nedir?",
          a: "İki elastik cismin sürtünmesiz normal temasında, temas bölgesinde oluşan basınç dağılımını ve gerilme alanını tanımlayan klasik temas mekaniği çözümüdür. Basınç temas merkezinde maksimumdur ve temas kenarına doğru yarı-eliptik biçimde azalır.",
        },
        {
          q: "Hertz temas basıncı nasıl hesaplanır?",
          a: "Küre-düzlem temasında önce temas yarıçapı a = [(3FR)/(4E*)]^(1/3) bulunur; maksimum basınç p₀ = 3F/(2πa²), ortalama basınç ise p_mean = F/(πa²) = (2/3)p₀ olur. E* iki malzemenin elastisite modülü ve Poisson oranından hesaplanan efektif modüldür.",
        },
        {
          q: "Hertz teorisi hangi varsayımlara dayanır?",
          a: "Malzemeler homojen, izotropik ve lineer elastiktir; temas sürtünmesizdir, yüzeyler pürüzsüzdür, temas alanı cisim boyutlarına göre küçüktür ve adezyon, plastik deformasyon ile kaplama etkileri ihmal edilir. Bu koşullar sağlanmıyorsa sonuçlar yalnızca ilk yaklaşım olarak kullanılmalıdır.",
        },
      ]
    : [
        {
          q: "What is Hertzian contact stress?",
          a: "It is the classical contact-mechanics solution describing the pressure distribution and stress field in the frictionless normal contact of two elastic bodies. Pressure is maximal at the contact center and decreases semi-elliptically toward the edge of the contact.",
        },
        {
          q: "How is Hertz contact pressure calculated?",
          a: "For sphere-on-flat contact, the contact radius a = [(3FR)/(4E*)]^(1/3) is found first; the maximum pressure is p₀ = 3F/(2πa²) and the mean pressure is p_mean = F/(πa²) = (2/3)p₀. E* is the effective modulus derived from both materials' elastic moduli and Poisson ratios.",
        },
        {
          q: "What assumptions does Hertz theory make?",
          a: "Materials are homogeneous, isotropic and linearly elastic; contact is frictionless, surfaces are smooth, the contact area is small compared with the body dimensions, and adhesion, plastic deformation and coating effects are neglected. When these do not hold, results should be treated as a first approximation only.",
        },
      ];
  return (
    <>
      <PageHeader
        eyebrow={tx("Mechanical Engineering")}
        title={tx("Hertz Contact Calculator")}
        description={tx("Küre-düzlem elastik temasında temas alanı, maksimum temas basıncı ve elastik yaklaşmayı hesaplayın.")}
      />

      <Section>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr ? 'Hertz temas teorisine dayanan bu hesaplayıcı, elastik bir kürenin düzlemle sürtünmesiz temasında temas yarıçapını ve Hertzian temas basıncını hesaplar. Küre-düzlem triboloji deneylerinde ve yerel temasın ön değerlendirmesinde kullanılabilir; çizgisel veya plastik temas için geçerli değildir. Yük N veya kN, boyutlar mm, µm veya m, elastisite modülü GPa veya MPa olarak girilir; basınç büyüklüğüne göre MPa veya GPa olarak gösterilir.' : 'This Hertzian contact calculator uses Hertz contact theory to calculate contact radius and maximum contact stress for an elastic sphere on a flat surface under frictionless normal loading. Use it for sphere-on-flat tribology tests and preliminary localized contact calculations, not line contact or plastic contact. Enter load in N or kN, dimensions in mm, µm or m and elastic modulus in GPa or MPa; pressure is reported in MPa or GPa according to magnitude.'}
        </p>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {tr ? 'Silindir veya makara teması mı gerekiyor? ' : 'Need cylinder or roller contact? Use the '}
          <Link to="/lab/hertz-line-contact-calculator" className="text-foreground underline underline-offset-4">{tr ? 'Hertz Çizgisel Temas Hesaplayıcı' : 'Hertz Line Contact Calculator'}</Link>
          {tr ? ' aracını kullanın.' : '.'}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {tx("Sphere-on-Flat")}</span>
        </div>
        <p className="mt-4 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Bu sürüm, sürtünmesiz normal yük altında klasik Hertz elastik temas çözümünü kullanır.")}</p>

        <div className="mt-8">
          <HertzContactCalculator />
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
              </div>
            )))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {tx("r, temas merkezinden ölçülen radyal uzaklıktır (r ≥ 0). x ise temas çapı boyunca alınan kesitte işaretli konumdur (−a ≤ x ≤ +a). Grafikte x koordinatı kullanılır.")}</p>
        </details>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Hertz Modelinin Varsayımları")}</h2>
        <ul className="mt-5 grid max-w-4xl gap-2 sm:grid-cols-2">
          {tx(assumptions.map((item) => (
            <li
              key={item}
              className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              {tx(item)}
            </li>
          )))}
        </ul>

        <p className="mt-8 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {tx("Yüksek Hertz basıncı tek başına yüzeyin akacağı veya hasar göreceği anlamına gelmez. Plastikleşme ve yorulma değerlendirmesi; malzeme dayanımı, yüzey altı gerilme alanı ve yükleme koşulları dikkate alınarak ayrıca yapılmalıdır.")}</p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Girdi parametreleri")}</h2>
        <dl className="mt-5 grid max-w-4xl gap-4 sm:grid-cols-2">
          {tx(inputParameters.map((item) => (
            <div key={item.title} className="border border-border p-4">
              <dt className="font-display text-base font-semibold text-foreground">{tx(item.title)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(item.text)}</dd>
            </div>
          )))}
        </dl>
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
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {tx("Mühendislik kullanım alanları")}</h2>
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
          {tr ? "Temas mekaniği ve triboloji bağlamı için " : "For the contact mechanics and tribology context, see the "}
          <Link to="/research" className="text-foreground underline underline-offset-4">
            {tr ? "araştırma sayfasındaki triboloji ve temas bölümüne" : "tribology and contact section on the research page"}
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
                <Link to={tool.href} search={{ distance: undefined, distanceUnit: undefined, source: undefined }} className="hover:underline hover:underline-offset-4">
                  {tx(tool.name)}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(tool.purpose)}</p>
            </article>
          )))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {tx("Bu hesaplayıcı ön mühendislik değerlendirmesi amacıyla hazırlanmıştır. Kritik tasarım ve güvenlik kararlarında sonuçlar bağımsız yöntemlerle doğrulanmalıdır.")}</p>

        <Link to="/lab" className="mt-6 inline-block text-sm text-foreground underline underline-offset-4">
          {tx("Engineering Lab'e dön")}</Link>
      </Section>
      <RelatedKnowledge />
    </>
  );
}
