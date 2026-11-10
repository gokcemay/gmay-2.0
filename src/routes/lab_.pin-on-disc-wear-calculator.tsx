import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage, localizeHead } from '@/lib/i18n';
import { PageHeader, Section } from '@/components/site/Section';
import { PinOnDiscCalculator } from '@/components/lab/PinOnDiscCalculator';
import { RelatedKnowledge } from '@/components/site/RelatedKnowledge';

const PATH = '/lab/pin-on-disc-wear-calculator';
const DESCRIPTION = 'Calculate pin-on-disc wear volume, sliding distance, volumetric wear rate, specific wear rate and coefficient of friction from common tribology test measurements.';

export const Route = createFileRoute('/lab_/pin-on-disc-wear-calculator')({
  head: ({ match }) => localizeHead({
    meta: [
      { title: 'Pin-on-Disc Wear Calculator | Wear Rate & Sliding Distance' },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: 'Pin-on-Disc Wear Calculator | Wear Rate & Sliding Distance' },
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
        name: 'Pin-on-Disc Wear Test Calculator',
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
  component: PinOnDiscPage,
});

const linkClass = 'text-foreground underline underline-offset-4';

function PinOnDiscPage() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);
  const noSearch = { distance: undefined, distanceUnit: undefined, source: undefined };

  const sections: { title: string; formula?: string; body: string }[] = [
    {
      title: L('What is a pin-on-disc wear test?', 'Pin-on-disc aşınma deneyi nedir?'),
      body: L(
        'A pin or ball is pressed against a rotating disc under a normal load, producing a circular wear track. Mass or volume loss, sliding distance and friction force are recorded to characterise sliding wear and friction of a material pair under the chosen conditions. The method is commonly associated with standards such as ASTM G99; this calculator only processes measurements and is not a compliance tool.',
        'Bir pim veya bilye, normal yük altında dönen bir diske bastırılır ve dairesel bir aşınma izi oluşur. Seçilen koşullarda malzeme çiftinin kaymalı aşınma ve sürtünme davranışını tanımlamak için kütle veya hacim kaybı, kayma mesafesi ve sürtünme kuvveti kaydedilir. Yöntem yaygın olarak ASTM G99 gibi standartlarla ilişkilendirilir; bu hesaplayıcı yalnızca ölçümleri işler, bir uygunluk aracı değildir.',
      ),
    },
    {
      title: L('Sliding distance', 'Kayma mesafesi'),
      formula: 's = 2πrN,  N = n · t',
      body: L(
        'r is the wear-track radius (m), n the rotational speed (rev/min), t the test duration (min) and N the total number of revolutions. Each revolution contributes one track circumference, 2πr.',
        'r aşınma izi yarıçapı (m), n dönme hızı (dev/dak), t deney süresi (dak) ve N toplam devir sayısıdır. Her devir bir iz çevresi, yani 2πr kadar kayma mesafesi ekler.',
      ),
    },
    {
      title: L('Wear volume from mass loss', 'Kütle kaybından aşınma hacmi'),
      formula: 'V = Δm / ρ',
      body: L(
        'Δm = m_initial − m_final is the measured mass loss and ρ the specimen density. Units must be consistent: 1 mg divided by 1 g/cm³ gives 1 mm³. The calculator converts all inputs to SI before calculating.',
        'Δm = m_ilk − m_son ölçülen kütle kaybı, ρ numune yoğunluğudur. Birimler tutarlı olmalıdır: 1 mg / 1 g/cm³ = 1 mm³. Hesaplayıcı tüm girdileri hesaplamadan önce SI birimlerine dönüştürür.',
      ),
    },
    {
      title: L('Specific wear rate', 'Özgül aşınma oranı'),
      formula: 'k_s = V / (F · s)',
      body: L(
        'V — wear volume, F — normal load, s — total sliding distance. Usually reported in mm³/(N·m). Terminology varies in the tribology literature: the same quantity may be called wear coefficient, wear factor or specific wear rate, so always report the equation and units.',
        'V — aşınma hacmi, F — normal yük, s — toplam kayma mesafesi. Genellikle mm³/(N·m) olarak verilir. Triboloji literatüründe adlandırma değişir: aynı büyüklük aşınma katsayısı, aşınma faktörü veya özgül aşınma oranı olarak anılabilir; bu nedenle denklem ve birim her zaman birlikte belirtilmelidir.',
      ),
    },
    {
      title: L('Wear rate vs specific wear rate', 'Aşınma oranı ve özgül aşınma oranı'),
      formula: 'q_v = V / s   ≠   k_s = V / (F · s)',
      body: L(
        'q_v is the worn volume per unit sliding distance (mm³/m) and is not normalised by load. k_s additionally divides by the normal load. They are different quantities with different units and should not be compared with each other.',
        'q_v birim kayma mesafesi başına aşınan hacimdir (mm³/m) ve yüke göre normalize edilmemiştir. k_s ayrıca normal yüke bölünür. Bunlar farklı birimlere sahip farklı büyüklüklerdir ve birbirleriyle karşılaştırılmamalıdır.',
      ),
    },
    {
      title: L('Coefficient of friction', 'Sürtünme katsayısı'),
      formula: 'μ = Ft / Fn',
      body: L(
        'Ft is the measured tangential friction force and Fn the normal load. The result is the coefficient corresponding to the supplied force value — an instantaneous or representative (e.g. steady-state mean) value. A single number does not represent a whole friction curve, and this calculator does not replace statistical analysis of time-series tribometer data.',
        'Ft ölçülen teğetsel sürtünme kuvveti, Fn normal yüktür. Sonuç, girilen kuvvet değerine karşılık gelen anlık veya temsili (ör. kararlı rejim ortalaması) katsayıdır. Tek bir değer bütün sürtünme eğrisini temsil etmez; bu hesaplayıcı tribometre zaman serisi verilerinin istatistiksel analizinin yerini tutmaz.',
      ),
    },
  ];

  const limitations = [
    L('Wear rate describes a tribological system and test condition, not a universal material constant.', 'Aşınma oranı evrensel bir malzeme sabiti değil, bir tribolojik sistemi ve deney koşulunu tanımlar.'),
    L('Temperature, humidity, surface condition, counterbody, load, velocity and lubrication can influence results.', 'Sıcaklık, nem, yüzey durumu, karşı cisim, yük, hız ve yağlama sonuçları etkileyebilir.'),
    L('Measurement uncertainty can dominate very small mass-loss values.', 'Çok küçük kütle kayıplarında ölçüm belirsizliği baskın hale gelebilir.'),
    L('Report calculated values together with the test conditions.', 'Hesaplanan değerler deney koşullarıyla birlikte raporlanmalıdır.'),
    L('This tool does not replace the applicable test standard or laboratory procedure.', 'Bu araç ilgili test standardının veya laboratuvar prosedürünün yerini tutmaz.'),
  ];

  const references = [
    { text: 'J. F. Archard, "Contact and Rubbing of Flat Surfaces", Journal of Applied Physics 24, 981 (1953).', href: 'https://doi.org/10.1063/1.1721448' },
    { text: 'ASTM G99 — Standard Test Method for Wear Testing with a Pin-on-Disk Apparatus (summary page).', href: 'https://www.astm.org/g0099-17.html' },
    { text: L('Wikipedia — Archard equation (overview of the wear framework).', 'Wikipedia — Archard denklemi (aşınma çerçevesine genel bakış).'), href: 'https://en.wikipedia.org/wiki/Archard_equation' },
  ];

  return (
    <>
      <PageHeader
        eyebrow={L('Tribology', 'Triboloji')}
        title={L('Pin-on-Disc Wear Test Calculator', 'Pin-on-Disc Aşınma Deneyi Hesaplayıcı')}
        description={L(
          'Process pin-on-disc measurements: sliding distance, wear volume, volumetric and specific wear rate, and coefficient of friction.',
          'Pin-on-disc ölçümlerini işleyin: kayma mesafesi, aşınma hacmi, hacimsel ve özgül aşınma oranı ile sürtünme katsayısı.',
        )}
      />

      <Section>
        <p className="mb-6 max-w-3xl border-l-2 border-accent bg-muted/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {L('All calculations run in your browser. Results are not an ASTM certification or compliance statement.', 'Tüm hesaplamalar tarayıcınızda yapılır. Sonuçlar ASTM sertifikası veya uygunluk beyanı değildir.')}
        </p>
        <PinOnDiscCalculator />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {L('Need a more detailed sliding-distance calculation, including reciprocating tests? Use the ', 'İleri-geri deneyler dahil daha ayrıntılı kayma mesafesi hesabı mı gerekiyor? ')}
          <Link to="/lab/sliding-distance-calculator" className={linkClass}>{L('Sliding Distance Calculator', 'Kayma Mesafesi Hesaplayıcı')}</Link>
          {L('.', ' aracını kullanın.')}
        </p>
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
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Limitations', 'Sınırlamalar')}</h2>
        <ul className="mt-5 grid max-w-4xl gap-2">
          {limitations.map((item) => (
            <li key={item} className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {L('Wear-scar geometry (volume from scar diameter or depth) is intentionally not included: the correct equation depends on pin/ball geometry and scar shape, and is not implemented without a verified, tested formulation.', 'Aşınma izi geometrisinden hacim hesabı (iz çapı veya derinliğinden) bilinçli olarak eklenmemiştir: doğru denklem pim/bilye geometrisine ve iz şekline bağlıdır ve doğrulanmış, test edilmiş bir formülasyon olmadan uygulanmamıştır.')}
        </p>
      </Section>

      <Section>
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Related tools', 'İlgili araçlar')}</h2>
        <ul className="mt-5 grid max-w-4xl gap-3 text-sm leading-relaxed text-muted-foreground">
          <li><Link to="/lab/wear-rate-calculator" search={noSearch} className={linkClass}>{L('Wear Rate Calculator', 'Aşınma Oranı Hesaplayıcı')}</Link> — {L('normalise measured wear with unit options and the Archard relation.', 'ölçülen aşınmayı birim seçenekleri ve Archard ilişkisiyle normalize edin.')}</li>
          <li><Link to="/lab/sliding-distance-calculator" className={linkClass}>{L('Sliding Distance Calculator', 'Kayma Mesafesi Hesaplayıcı')}</Link> — {L('rotary and reciprocating sliding distance and velocity.', 'döner ve ileri-geri deneylerde kayma mesafesi ve hızı.')}</li>
          <li><Link to="/lab/hertz-contact-calculator" className={linkClass}>{L('Hertz Contact Calculator', 'Hertz Temas Hesaplayıcı')}</Link> — {L('initial contact pressure of a ball-on-flat pin-on-disc configuration.', 'bilye-düzlem pin-on-disc düzeninde başlangıç temas basıncı.')}</li>
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
