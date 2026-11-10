import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage, localizeHead } from '@/lib/i18n';
import { PageHeader, Section } from '@/components/site/Section';
import { GearStressCalculator } from '@/components/lab/GearStressCalculator';
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';

const PATH = '/lab/gear-stress-calculator';
const TITLE = 'Gear Stress Calculator | Contact & Bending Stress';
const DESCRIPTION = 'Estimate spur-gear Hertz contact stress, tooth-root bending stress and transmitted forces for preliminary engineering design.';

export const Route = createFileRoute('/lab_/gear-stress-calculator')({
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
        name: 'Gear Contact & Bending Stress Calculator',
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
  component: GearStressPage,
});

const linkClass = 'text-foreground underline underline-offset-4';

function GearStressPage() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);

  const sections: { title: string; formula?: string; body: string }[] = [
    {
      title: L('Gear tooth loading', 'Dişli diş yüklemesi'),
      formula: 'Ft = 2T1 / d1,   Fr = Ft·tan α,   Fn = Ft / cos α',
      body: L(
        'For involute teeth the contact force always acts along the line of action, inclined at the pressure angle α to the pitch-circle tangent. Its tangential component Ft transmits torque; the radial component Fr pushes the gears apart and loads the bearings; Fn is the full tooth normal force that compresses the flanks.',
        'Evolvent dişlerde temas kuvveti her zaman, bölüm dairesi teğetine α basınç açısıyla eğik olan kavrama doğrusu boyunca etkir. Teğetsel bileşen Ft torku iletir; radyal bileşen Fr dişlileri birbirinden uzaklaştırır ve yatakları yükler; Fn yanakları sıkıştıran toplam normal diş kuvvetidir.',
      ),
    },
    {
      title: L('Contact stress', 'Temas gerilmesi'),
      formula: "ρi = (di/2)·sin α,   1/R' = 1/ρ1 + 1/ρ2,   σ_H = √(Fn·E* / (π·b·R'))",
      body: L(
        'Mating flanks touch along a narrow strip, so the contact is modelled as two cylinders whose radii equal the involute radii of curvature at the pitch point. This is classical Hertz line contact with line load Fn/b and the same E* convention as the Hertz Line Contact Calculator. Single-pair contact is assumed: the full load is carried by one tooth pair and load sharing is ignored.',
        'Eşleşen yanaklar dar bir şerit boyunca temas eder; bu nedenle temas, yarıçapları bölüm noktasındaki evolvent eğrilik yarıçaplarına eşit iki silindir olarak modellenir. Bu, Fn/b çizgisel yüklü klasik Hertz çizgisel temasıdır ve Hertz Çizgisel Temas Hesaplayıcı ile aynı E* kuralını kullanır. Tek diş çifti teması varsayılır: tüm yükü bir diş çifti taşır, yük paylaşımı ihmal edilir.',
      ),
    },
    {
      title: L('Tooth-root bending stress', 'Diş dibi eğilme gerilmesi'),
      body: L(
        'In simplified theory a tooth is treated as a short cantilever fixed at the root. The tangential load applied at the tip produces a bending moment that is largest at the root fillet, where fatigue cracks typically start.',
        'Basitleştirilmiş teoride diş, dibinden ankastre kısa bir konsol kiriş olarak ele alınır. Diş ucuna uygulanan teğetsel yük, en büyük değerini diş dibi kavisinde alan bir eğilme momenti oluşturur; yorulma çatlakları genellikle burada başlar.',
      ),
    },
    {
      title: L('Lewis equation', 'Lewis denklemi'),
      formula: 'σ_F = Ft / (b·m·Y)',
      body: L(
        'Y is the dimensionless Lewis form factor, which captures the tooth shape for a given tooth count. This page uses tabulated values for 20° full-depth involute teeth with load at the tip (Shigley, Table 14-2), interpolated linearly between tooth counts. The Lewis equation ignores stress concentration, dynamic load and load sharing; it is a first sizing estimate only.',
        'Y, belirli bir diş sayısı için diş şeklini temsil eden boyutsuz Lewis form faktörüdür. Bu sayfa, yükün diş ucunda olduğu 20° tam diş boyu evolvent dişler için tablo değerlerini (Shigley, Tablo 14-2) diş sayıları arasında doğrusal enterpolasyonla kullanır. Lewis denklemi gerilme yığılmasını, dinamik yükü ve yük paylaşımını ihmal eder; yalnızca ilk boyutlandırma tahminidir.',
      ),
    },
    {
      title: L('Why full ISO 6336 results differ', 'Tam ISO 6336 sonuçları neden farklıdır'),
      body: L(
        'Gear-rating methods multiply the nominal stresses by factors for load application, dynamic effects, load distribution across the face and between teeth, and contact ratio; they include helix angle where applicable, and use allowable stresses that depend on material quality, required life, reliability, lubrication and surface condition. Results can therefore differ substantially from these estimates.',
        'Dişli değerlendirme yöntemleri nominal gerilmeleri; yük uygulama, dinamik etkiler, genişlik boyunca ve dişler arasında yük dağılımı ve kavrama oranı için katsayılarla çarpar; uygun durumlarda helis açısını içerir ve malzeme kalitesi, istenen ömür, güvenilirlik, yağlama ve yüzey durumuna bağlı izin verilen gerilmeler kullanır. Bu nedenle sonuçlar bu tahminlerden belirgin biçimde farklı olabilir.',
      ),
    },
  ];

  const future = [
    L('helical, bevel, worm and internal gears', 'helisel, konik, sonsuz vida ve iç dişliler'),
    L('profile shift and planetary load sharing', 'profil kaydırma ve gezegen dişli yük paylaşımı'),
    L('ISO 6336 / AGMA factors and fatigue life', 'ISO 6336 / AGMA katsayıları ve yorulma ömrü'),
    L('micropitting, scuffing and flash temperature', 'mikro çukurcuklanma, yenme (scuffing) ve flaş sıcaklığı'),
  ];

  const references = [
    { text: 'R. G. Budynas, J. K. Nisbett, Shigley’s Mechanical Engineering Design, McGraw-Hill — ch. 14, Lewis bending equation and Table 14-2.', href: 'https://www.mheducation.com/highered/product/shigley-s-mechanical-engineering-design-budynas-nisbett/M9780073398204.html' },
    { text: 'K. L. Johnson, Contact Mechanics, Cambridge University Press (1985) — two-dimensional Hertz contact.', href: 'https://doi.org/10.1017/CBO9781139171731' },
    { text: L('Wikipedia — Involute gear (geometry and line of action).', 'Wikipedia — Evolvent dişli (geometri ve kavrama doğrusu).'), href: 'https://en.wikipedia.org/wiki/Involute_gear' },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L('Tribology & Contact', 'Triboloji ve Temas')}
        title={L('Gear Contact & Bending Stress Calculator', 'Dişli Temas ve Eğilme Gerilmesi Hesaplayıcı')}
        description={L(
          'Preliminary screening of external involute spur gears: transmitted forces, simplified pitch-point Hertz contact stress and Lewis tooth-root bending stress.',
          'Dış evolvent düz dişlilerin ön boyutlandırması: aktarılan kuvvetler, basitleştirilmiş bölüm noktası Hertz temas gerilmesi ve Lewis diş dibi eğilme gerilmesi.',
        )}
      />

      <Section>
        <p className="mb-6 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {L('All calculations run in your browser. Full ISO 6336 calculations require multiple geometry, load, material and life factors and should be performed using the complete standard or validated specialist software.', 'Tüm hesaplamalar tarayıcınızda yapılır. Tam ISO 6336 hesapları çok sayıda geometri, yük, malzeme ve ömür katsayısı gerektirir; standardın tamamı veya doğrulanmış uzman yazılımlarla yapılmalıdır.')}
        </p>
        <GearStressCalculator />
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Worked example', 'Çözümlü örnek')}</h2>
        <div className="mt-4 max-w-4xl overflow-x-auto font-mono text-sm leading-relaxed text-foreground">
          <p>z1 = 20, z2 = 40, m = 2 mm, α = 20°, b = 20 mm, T1 = 50 N·m, E1 = E2 = 210 GPa, ν1 = ν2 = 0.30</p>
          <p className="mt-3">d1 = 2·20 = 40 mm,  d2 = 2·40 = 80 mm,  u = 2,  a = 60 mm</p>
          <p>Ft = 2·50 000 / 40 = 2500 N,  Fr = 2500·tan 20° ≈ 909.9 N,  Fn = 2500 / cos 20° ≈ 2660 N</p>
          <p>E* = 210 / (2·0.91) ≈ 115.38 GPa</p>
          <p>ρ1 = 20·sin 20° ≈ 6.840 mm,  ρ2 ≈ 13.68 mm,  R' ≈ 4.560 mm</p>
          <p>σ_H = √(2660·115 385 / (π·20·4.560)) ≈ 1035 MPa</p>
          <p>Y1 = 0.322,  Y2 ≈ 0.389  →  σ_F1 = 2500 / (20·2·0.322) ≈ 194.1 MPa,  σ_F2 ≈ 160.6 MPa</p>
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
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{L('ISO-style nominal contact stress', 'ISO tarzı nominal temas gerilmesi')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {L('Not included. The nominal form σ_H0 = Z_H·Z_E·Z_ε·√(Ft/(b·d1)·(u+1)/u) needs the contact-ratio factor Z_ε, which depends on tooth-tip geometry not entered here. Rather than assume a value, the calculator reports only the pitch-point Hertz estimate.', 'Eklenmemiştir. σ_H0 = Z_H·Z_E·Z_ε·√(Ft/(b·d1)·(u+1)/u) nominal biçimi, burada girilmeyen diş ucu geometrisine bağlı kavrama oranı katsayısı Z_ε’yi gerektirir. Bir değer varsaymak yerine hesaplayıcı yalnızca bölüm noktası Hertz tahminini verir.')}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Scope and future extensions', 'Kapsam ve olası genişletmeler')}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{L('Covered: external involute spur gears on parallel shafts, standard pressure-angle geometry, isotropic elastic materials. Not covered:', 'Kapsanan: paralel millerde dış evolvent düz dişliler, standart basınç açısı geometrisi, izotrop elastik malzemeler. Kapsanmayan:')}</p>
        <ul className="mt-3 grid max-w-4xl gap-2">
          {future.map((x) => <li key={x} className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">{x}</li>)}
        </ul>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Related tools', 'İlgili araçlar')}</h2>
        <ul className="mt-5 grid max-w-4xl gap-3 text-sm leading-relaxed text-muted-foreground">
          <li><Link to="/lab/hardness-conversion-calculator" className={linkClass}>{L('Hardness Conversion Calculator', 'Sertlik Dönüşüm Hesaplayıcı')}</Link> — {L('approximate steel hardness equivalents, not allowable gear stresses.', 'yaklaşık çelik sertlik eşdeğerleri; izin verilen dişli gerilmeleri değildir.')}</li>
          <li><Link to="/lab/hertz-line-contact-calculator" className={linkClass}>{L('Hertz Line Contact Calculator', 'Hertz Çizgisel Temas Hesaplayıcı')}</Link> — {L('the cylinder contact model used for the flank stress.', 'yanak gerilmesi için kullanılan silindir temas modeli.')}</li>
          <li><Link to="/lab/hertz-contact-calculator" className={linkClass}>{L('Hertz Point Contact Calculator', 'Hertz Nokta Teması Hesaplayıcı')}</Link> — {L('sphere-on-flat contact.', 'küre-düzlem teması.')}</li>
          <li><Link to="/research" className={linkClass}>{L('Tribology research', 'Triboloji araştırmaları')}</Link> — {L('contact, wear and surface engineering.', 'temas, aşınma ve yüzey mühendisliği.')}</li>
        </ul>
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
