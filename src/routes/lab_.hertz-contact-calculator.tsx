import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/Section";
import { HertzContactCalculator } from "@/components/lab/HertzContactCalculator";

export const Route = createFileRoute("/lab_/hertz-contact-calculator")({
  head: () => ({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
    status: "Planlanıyor",
    purpose: "Aşınma hacmi, normal yük ve kayma mesafesinden özgül aşınma oranını hesaplayacaktır.",
  },
  {
    name: "Sliding Distance Calculator",
    status: "Planlanıyor",
    purpose: "Dönme hızı, iz yarıçapı ve deney süresinden toplam kayma mesafesini hesaplayacaktır.",
  },
];

function HertzPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mechanical Engineering"
        title="Hertz Contact Calculator"
        description="Küre-düzlem elastik temasında temas alanı, maksimum temas basıncı ve elastik yaklaşmayı hesaplayın."
      />

      <Section>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Sphere-on-Flat
          </span>
        </div>
        <p className="mt-4 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Bu sürüm, sürtünmesiz normal yük altında klasik Hertz elastik temas çözümünü kullanır.
        </p>

        <div className="mt-8">
          <HertzContactCalculator />
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
              </div>
            ))}
          </dl>
        </details>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Hertz Modelinin Varsayımları
        </h2>
        <ul className="mt-5 grid max-w-4xl gap-2 sm:grid-cols-2">
          {assumptions.map((item) => (
            <li
              key={item}
              className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          Yüksek Hertz basıncı tek başına yüzeyin akacağı veya hasar göreceği anlamına gelmez.
          Plastikleşme ve yorulma değerlendirmesi; malzeme dayanımı, yüzey altı gerilme alanı ve
          yükleme koşulları dikkate alınarak ayrıca yapılmalıdır.
        </p>
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
          Bu hesaplayıcı ön mühendislik değerlendirmesi amacıyla hazırlanmıştır. Kritik tasarım ve
          güvenlik kararlarında sonuçlar bağımsız yöntemlerle doğrulanmalıdır.
        </p>

        <Link to="/lab" className="mt-6 inline-block text-sm text-foreground underline underline-offset-4">
          Engineering Lab'e dön
        </Link>
      </Section>
    </>
  );
}
