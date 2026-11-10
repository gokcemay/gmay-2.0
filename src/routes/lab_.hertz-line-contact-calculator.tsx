import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage, localizeHead } from '@/lib/i18n';
import { PageHeader, Section } from '@/components/site/Section';
import { HertzLineCalculator } from '@/components/lab/HertzLineCalculator';
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';

const PATH = '/lab/hertz-line-contact-calculator';
const TITLE = 'Hertz Line Contact Calculator | Cylinder Contact Stress';
const DESCRIPTION = 'Calculate Hertzian line-contact width, effective radius, line load and maximum contact pressure for cylinder-flat and parallel cylinder-cylinder contacts.';

export const Route = createFileRoute('/lab_/hertz-line-contact-calculator')({
  head: ({ match }) => localizeHead({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: PATH },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: PATH }],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Hertz Line Contact Calculator',
        url: `https://gmay.me${PATH}`,
        applicationCategory: 'EngineeringApplication',
        operatingSystem: 'Web',
        inLanguage: 'tr-TR',
        description: DESCRIPTION,
        isPartOf: { '@type': 'WebSite', '@id': 'https://gmay.me/#website' },
        author: { '@id': 'https://gmay.me/#person' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      }),
    }],
  }, match.context.language ?? 'en', PATH),
  component: HertzLinePage,
});

const linkClass = 'text-foreground underline underline-offset-4';

function HertzLinePage() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);
  const noSearch = { distance: undefined, distanceUnit: undefined, source: undefined };

  const sections: { title: string; formula?: string; body: string }[] = [
    {
      title: L('What is Hertzian line contact?', 'Hertz çizgisel teması nedir?'),
      body: L(
        'When a cylinder is pressed against a flat, or two cylinders with parallel axes are pressed together, the undeformed bodies touch along a line. Under load the contact spreads into a narrow strip of width 2b along the contact length L. Because L is much larger than b, the problem is treated as two-dimensional (plane strain) and the load is expressed per unit length.',
        'Bir silindir düzleme veya eksenleri paralel iki silindir birbirine bastırıldığında, deforme olmamış cisimler bir çizgi boyunca temas eder. Yük altında temas, L temas uzunluğu boyunca 2b genişliğinde dar bir şeride yayılır. L, b’den çok büyük olduğundan problem iki boyutlu (düzlem şekil değiştirme) kabul edilir ve yük birim uzunluk başına ifade edilir.',
      ),
    },
    {
      title: L('Effective elastic modulus', 'Eşdeğer elastisite modülü'),
      formula: '1 / E* = (1 − ν1²) / E1 + (1 − ν2²) / E2',
      body: L(
        'Both bodies deform, so both compliances add. A softer partner dominates E*. This page uses the E* convention throughout; some texts use E′ = 2E*, which changes the constants in every equation — do not mix them.',
        'Her iki cisim de deforme olduğundan esneklikleri toplanır. Daha yumuşak cisim E* değerine baskın olur. Bu sayfada her yerde E* kuralı kullanılır; bazı kaynaklar E′ = 2E* kullanır ve bu tüm denklemlerdeki sabitleri değiştirir — iki kural karıştırılmamalıdır.',
      ),
    },
    {
      title: L('Effective radius', 'Eşdeğer yarıçap'),
      formula: "1 / R' = 1 / R1 + 1 / R2   →   R' = R1·R2 / (R1 + R2)",
      body: L(
        'For two cylinders in external contact both curvatures add. For a cylinder on a flat, R2 → ∞ and R′ = R1; the flat option therefore asks only for the cylinder radius.',
        'Dıştan temas eden iki silindirde eğrilikler toplanır. Silindir-düzlem durumunda R2 → ∞ ve R′ = R1 olur; bu nedenle düzlem seçeneğinde yalnızca silindir yarıçapı istenir.',
      ),
    },
    {
      title: L('Contact width', 'Temas genişliği'),
      formula: "b = √(4 F R' / (π L E*)) = √(4 w R' / (π E*)),   w = F / L",
      body: L(
        'b is the contact half-width, measured from the centerline to the edge of the strip; the full contact width is 2b. b grows with the square root of the line load.',
        'b temas yarı genişliğidir; merkez çizgisinden şeridin kenarına kadar ölçülür. Toplam temas genişliği 2b’dir. b, çizgisel yükün karekökü ile artar.',
      ),
    },
    {
      title: L('Maximum Hertz pressure', 'Maksimum Hertz temas basıncı'),
      formula: 'p0 = 2F / (π b L) = 2w / (π b),   p_mean = F / (2bL),   p0 = 4 p_mean / π',
      body: L(
        'The surfaces are deepest in each other at the centerline, so the elastic interference — and the pressure — is highest there and falls to zero at x = ±b. p0 is about 27% higher than the mean pressure.',
        'Yüzeyler birbirine en çok merkez çizgisinde girer; bu nedenle elastik girişim ve basınç orada en yüksektir ve x = ±b’de sıfıra düşer. p0, ortalama basınçtan yaklaşık %27 yüksektir.',
      ),
    },
    {
      title: L('Pressure distribution', 'Basınç dağılımı'),
      formula: 'p(x) = p0 √(1 − (x/b)²),   −b ≤ x ≤ b',
      body: L(
        'The pressure across the strip is semi-elliptical, not uniform. The point-contact (sphere) distribution has the same shape over a circle, but different constants — it must not be used for cylinders.',
        'Şerit boyunca basınç düzgün değil, yarı elipstir. Nokta temasında (küre) aynı şekil bir daire üzerinde oluşur ancak sabitler farklıdır — silindirler için kullanılmamalıdır.',
      ),
    },
    {
      title: L('Subsurface shear stress', 'Yüzey altı kayma gerilmesi'),
      formula: 'τ1,max ≈ 0.300 p0   at   z ≈ 0.786 b',
      body: L(
        'In frictionless Hertz line contact the largest principal shear stress occurs below the surface on the centerline, not at the surface. This is the classical result reported by Johnson (Contact Mechanics, 1985, §4.2); yielding or rolling-contact fatigue often initiates near this depth. Friction moves the critical point toward the surface and is not included.',
        'Sürtünmesiz Hertz çizgisel temasında en büyük asal kayma gerilmesi yüzeyde değil, merkez çizgisi altında oluşur. Bu, Johnson’ın (Contact Mechanics, 1985, §4.2) verdiği klasik sonuçtur; akma veya yuvarlanma temas yorulması çoğunlukla bu derinlik civarında başlar. Sürtünme kritik noktayı yüzeye yaklaştırır ve hesaba katılmamıştır.',
      ),
    },
  ];

  const assumptions = [
    L('smooth surfaces', 'pürüzsüz yüzeyler'),
    L('non-conforming contact', 'uyumsuz (non-conforming) temas'),
    L('homogeneous, isotropic materials', 'homojen ve izotrop malzemeler'),
    L('linear elasticity and small strains', 'doğrusal elastisite ve küçük şekil değiştirmeler'),
    L('frictionless normal loading', 'sürtünmesiz normal yükleme'),
    L('contact width small compared with body dimensions', 'temas genişliğinin cisim boyutlarına göre küçük olması'),
    L('parallel cylinder axes and no significant edge effects', 'paralel silindir eksenleri ve önemsiz kenar etkileri'),
  ];

  const uses = [
    L('rollers and cylindrical roller bearings (local contact screening)', 'makaralar ve silindirik makaralı rulmanlar (yerel temas ön değerlendirmesi)'),
    L('cylindrical cams and followers', 'silindirik kamlar ve izleyiciler'),
    L('local gear-tooth contact approximated as two cylinders', 'iki silindir olarak yaklaşıklanan yerel dişli dişi teması'),
    L('rolling/sliding tribological contacts, e.g. block-on-ring tests', 'yuvarlanma/kayma tribolojik temasları, ör. blok-halka deneyleri'),
    L('contact-mechanics education and preliminary engineering calculations', 'temas mekaniği eğitimi ve ön mühendislik hesapları'),
  ];

  const references = [
    { text: 'K. L. Johnson, Contact Mechanics, Cambridge University Press (1985), ch. 4 — two-dimensional Hertz contact.', href: 'https://doi.org/10.1017/CBO9781139171731' },
    { text: 'H. Hertz, "Über die Berührung fester elastischer Körper", J. reine angew. Math. 92, 156–171 (1882).', href: 'https://doi.org/10.1515/crll.1882.92.156' },
    { text: L('Wikipedia — Contact mechanics: contact between two cylinders with parallel axes.', 'Wikipedia — Temas mekaniği: eksenleri paralel iki silindir arasında temas.'), href: 'https://en.wikipedia.org/wiki/Contact_mechanics' },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L('Tribology & Contact', 'Triboloji ve Temas')}
        title={L('Hertz Line Contact Calculator', 'Hertz Çizgisel Temas Hesaplayıcı')}
        description={L(
          'Contact half-width, full contact width, line load and maximum Hertz pressure for cylinder–flat and parallel cylinder–cylinder contacts.',
          'Silindir–düzlem ve paralel silindir–silindir temaslarında temas yarı genişliği, toplam temas genişliği, çizgisel yük ve maksimum Hertz temas basıncı.',
        )}
      />

      <Section>
        <p className="mb-6 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {L('All calculations run in your browser using classical elastic Hertz theory. This is a screening calculator; it does not implement or claim compliance with ISO, AGMA, DIN or bearing-rating standards.', 'Tüm hesaplamalar tarayıcınızda klasik elastik Hertz teorisiyle yapılır. Bu bir ön değerlendirme aracıdır; ISO, AGMA, DIN veya rulman değerlendirme standartlarını uygulamaz ve bunlara uygunluk iddia etmez.')}
        </p>
        <HertzLineCalculator />
      </Section>

      <Section>
        <div className="max-w-4xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">{L('Line Contact vs Point Contact', 'Çizgisel Temas ve Nokta Teması')}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 text-sm leading-relaxed text-muted-foreground">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">{L('Line contact', 'Çizgisel temas')}</h3>
              <ul className="mt-2 grid gap-1">
                <li>{L('parallel cylinders or cylinder–flat', 'paralel silindirler veya silindir–düzlem')}</li>
                <li>{L('idealised rectangular contact strip 2b × L', 'ideal dikdörtgen temas şeridi 2b × L')}</li>
                <li>{L('contact width scales with √load', 'temas genişliği √yük ile ölçeklenir')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">{L('Point contact', 'Nokta teması')}</h3>
              <ul className="mt-2 grid gap-1">
                <li>{L('sphere–flat or sphere–sphere', 'küre–düzlem veya küre–küre')}</li>
                <li>{L('circular (or elliptical) contact area', 'dairesel (veya eliptik) temas alanı')}</li>
                <li>{L('contact radius scales with load^(1/3)', 'temas yarıçapı yük^(1/3) ile ölçeklenir')}</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-sm">
            <Link to="/lab/hertz-contact-calculator" className={linkClass}>{L('Hertz Point Contact Calculator', 'Hertz Nokta Teması Hesaplayıcı')}</Link>
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Worked example', 'Çözümlü örnek')}</h2>
        <div className="mt-4 max-w-4xl overflow-x-auto font-mono text-sm leading-relaxed text-foreground">
          <p>{L('Two identical steel cylinders', 'İki özdeş çelik silindir')}: R1 = R2 = 1.27 mm, L = 1.00 mm, F = 75 N, E1 = E2 = 200 GPa, ν1 = ν2 = 0.30</p>
          <p className="mt-3">R' = 1.27·1.27 / 2.54 = 0.635 mm</p>
          <p>1/E* = 2 · 0.91 / 200 GPa  →  E* ≈ 109.89 GPa</p>
          <p>w = 75 N / 1 mm = 75 N/mm</p>
          <p>b = √(4 · 75 · 0.635 / (π · 109 890)) ≈ 0.02349 mm,  2b ≈ 0.04698 mm</p>
          <p>p0 = 2 · 75 / (π · 0.02349) ≈ 2033 MPa ≈ 2.033 GPa,  p_mean ≈ 1.597 GPa</p>
        </div>
        <p className="mt-3 max-w-3xl text-xs text-muted-foreground">{L('These are the calculator’s default inputs; use “Load worked example” to reproduce them.', 'Bunlar hesaplayıcının varsayılan girdileridir; yeniden üretmek için “Çözümlü örneği yükle” düğmesini kullanın.')}</p>
      </Section>

      <Section>
        <div className="grid max-w-4xl gap-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-semibold text-foreground">{s.title}</h2>
              {s.formula ? <p className="mt-3 overflow-x-auto font-mono text-sm text-foreground">{s.formula}</p> : null}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Assumptions and limitations', 'Varsayımlar ve sınırlamalar')}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{L('The classical Hertz line-contact solution assumes:', 'Klasik Hertz çizgisel temas çözümü şunları varsayar:')}</p>
        <ul className="mt-3 grid max-w-4xl gap-2">
          {assumptions.map((a) => <li key={a} className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">{a}</li>)}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {L('Real finite-length rollers can experience edge loading, with pressure peaks at the roller ends well above p0. Results are not valid for severe misalignment, crowned or profiled rollers, crossed or internal (conformal) cylinders, plastic deformation or adhesive contact; these are possible future extensions.', 'Gerçek sonlu uzunluktaki makaralarda kenar yüklemesi oluşabilir ve makara uçlarında p0’ın belirgin biçimde üzerinde basınç tepeleri görülebilir. Sonuçlar şiddetli eksen kaçıklığı, bombeli veya profilli makaralar, çapraz veya iç (uyumlu) silindirler, plastik deformasyon veya adezif temas için geçerli değildir; bunlar ileride eklenebilecek genişletmelerdir.')}
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Engineering use cases', 'Mühendislik kullanım alanları')}</h2>
        <ul className="mt-5 grid max-w-4xl gap-2">
          {uses.map((u) => <li key={u} className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">{u}</li>)}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {L('This simplified calculator does not replace bearing-rating or gear-rating standards. For related work, see ', 'Bu basitleştirilmiş hesaplayıcı rulman veya dişli değerlendirme standartlarının yerini tutmaz. İlgili çalışmalar için ')}
          <Link to="/research" className={linkClass}>{L('tribology research', 'triboloji araştırmaları')}</Link>
          {L('. To normalise measured wear from a line-contact test such as block-on-ring, use the ', ' sayfasına bakın. Blok-halka gibi bir çizgisel temas deneyinde ölçülen aşınmayı normalize etmek için ')}
          <Link to="/lab/wear-rate-calculator" search={noSearch} className={linkClass}>{L('Wear Rate Calculator', 'Aşınma Oranı Hesaplayıcı')}</Link>
          {L('.', ' aracını kullanın.')}
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('References', 'Kaynaklar')}</h2>
        <ol className="mt-5 grid max-w-4xl list-decimal gap-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {references.map((r) => (
            <li key={r.href}><a href={r.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{r.text}</a></li>
          ))}
        </ol>
        <Link to="/lab" className="mt-8 inline-block text-sm text-foreground underline underline-offset-4">
          {L('Back to Engineering Lab', "Engineering Lab'e dön")}
        </Link>
      </Section>
      <RelatedKnowledge />
    </>
  );
}
