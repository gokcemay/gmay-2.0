import type { Language } from './language';

// Locale is a view preference; all views consolidate into the clean route URL.
export function pageUrl(path: string, _language: Language = 'en'): string {
  const cleanPath = path.split(/[?#]/)[0]?.replace(/\/+$/, '') || '/';
  return `https://gmay.me${cleanPath}`;
}

type SearchCopy = { title: string; description: string };
export const searchCopy: Record<string, Record<Language, SearchCopy>> = {
  '/lab/coefficient-of-friction-calculator': {
    en: { title: 'Coefficient of Friction Calculator | Friction Force & Angle', description: 'Calculate coefficient of friction, friction force, normal load and friction angle for engineering and tribology applications.' },
    tr: { title: 'Sürtünme Katsayısı Hesaplayıcı | Sürtünme Kuvveti ve Açısı', description: 'Sürtünme katsayısı, sürtünme kuvveti, normal yük ve sürtünme açısını mühendislik ve triboloji uygulamaları için hesaplayın.' },
  },
  '/lab/surface-roughness-converter': {
    en: { title: 'Surface Roughness Converter | Ra, Rq, Rz & Rt', description: 'Compare approximate surface roughness relationships between Ra, Rq, Rz and Rt, with µm/µin conversion and engineering limitations explained.' },
    tr: { title: 'Yüzey Pürüzlülüğü Dönüşüm Aracı | Ra, Rq, Rz ve Rt', description: 'Ra, Rq, Rz ve Rt yüzey pürüzlülüğü parametrelerini yaklaşık ilişkilerle karşılaştırın; µm ve µin dönüşümü ve mühendislik sınırlamalarını görün.' },
  },
  '/lab/hardness-conversion-calculator': {
    en: { title: 'Hardness Conversion Calculator | HRC, HV, HBW & HRB', description: 'Convert approximate hardness values between Rockwell C, Rockwell B, Vickers and Brinell scales for non-austenitic steels.' },
    tr: { title: 'Sertlik Dönüşüm Hesaplayıcı | HRC, HV, HBW ve HRB', description: 'Alaşımlı ve karbon çelikleri için Rockwell C, Rockwell B, Vickers ve Brinell sertlik değerleri arasında yaklaşık dönüşüm yapın.' },
  },
  '/': {
    en: { title: 'Gökçe Mehmet Ay | Engineering × AI × Research', description: 'Free engineering calculators, AI tools for engineers, tribology research, books and training by Dr. Gökçe Mehmet Ay — for engineers, researchers and R&D teams.' },
    tr: { title: 'Gökçe Mehmet Ay | Mühendislik × Yapay Zekâ × Araştırma', description: 'Mühendisler, araştırmacılar ve Ar-Ge ekipleri için ücretsiz mühendislik hesaplayıcıları, yapay zekâ araçları, triboloji araştırmaları, kitaplar ve eğitimler.' },
  },
  '/egitim': {
    en: { title: 'AI & Engineering Training | Dr. Gökçe Mehmet Ay', description: 'Practical generative AI and prompt engineering training for engineers, academics and organizations. Explore corporate workshops and engineering consulting.' },
    tr: { title: 'Yapay Zekâ ve Mühendislik Eğitimleri | Dr. Gökçe Mehmet Ay', description: 'Mühendisler, akademisyenler ve Ar-Ge ekipleri için üretken yapay zekâ, prompt engineering ve mühendislik eğitimleri. Kurumsal programları inceleyin.' },
  },
  '/lab': {
    en: { title: 'Free Engineering Calculators & AI Tools | GMA Lab', description: 'Free engineering calculators, tribology and CAD tools: calculate Hertz contact stress, wear rate and sliding distance, or build structured engineering AI prompts.' },
    tr: { title: 'Mühendislik Hesaplayıcıları ve Yapay Zekâ Araçları | GMA Lab', description: 'Mühendisler ve araştırmacılar için ücretsiz triboloji, CAD ve yapay zekâ araçları. Hertz temas basıncı ve aşınma oranı hesaplayın, mühendislik promptları oluşturun.' },
  },
  '/kitaplar': {
    en: { title: 'Engineering, AI & Research Books | Gökçe Mehmet Ay', description: 'Discover Gökçe Mehmet Ay’s books on AI prompts for mechanical engineers, digital tools for academic research, and science fiction, with available reading links.' },
    tr: { title: 'Mühendislik, Yapay Zekâ ve Araştırma Kitapları | Gökçe Mehmet Ay', description: 'Gökçe Mehmet Ay’ın Makine Mühendisleri için 100 Prompt, Akademik Araştırmalar İçin Bilişim Araçları ve bilimkurgu kitaplarını mevcut okuma bağlantılarıyla keşfedin.' },
  },
  '/lab/hertz-contact-calculator': {
    en: { title: 'Hertz Contact Calculator | Hertzian Contact Stress Calculator', description: 'Calculate sphere-on-flat Hertzian contact radius, maximum contact stress and elastic approach. Free calculator with selectable units, equations and assumptions.' },
    tr: { title: 'Hertz Temas Hesaplayıcı | Hertzian Temas Basıncı', description: 'Küre-düzlem Hertz temasında temas yarıçapı, maksimum temas basıncı ve elastik yaklaşmayı hesaplayın. Birimler, denklemler ve varsayımlar açıkça gösterilir.' },
  },
  '/lab/hertz-line-contact-calculator': {
    en: { title: 'Hertz Line Contact Calculator | Cylinder Contact Stress', description: 'Calculate Hertzian line-contact width, effective radius, line load and maximum contact pressure for cylinder-flat and parallel cylinder-cylinder contacts.' },
    tr: { title: 'Hertz Çizgisel Temas Hesaplayıcı | Silindirik Temas Basıncı', description: 'Silindir-düzlem ve paralel silindir temaslarında Hertz temas genişliği, eşdeğer yarıçap, çizgisel yük ve maksimum temas basıncını hesaplayın.' },
  },
  '/lab/gear-stress-calculator': {
    en: { title: 'Gear Stress Calculator | Contact & Bending Stress', description: 'Estimate spur-gear Hertz contact stress, tooth-root bending stress and transmitted forces for preliminary engineering design.' },
    tr: { title: 'Dişli Gerilme Hesaplayıcı | Temas ve Eğilme Gerilmesi', description: 'Düz dişlilerde Hertz temas gerilmesi, diş dibi eğilme gerilmesi ve aktarılan kuvvetleri ön boyutlandırma amacıyla hesaplayın.' },
  },
  '/lab/wear-rate-calculator': {
    en: { title: 'Wear Rate Calculator & Formula | Specific Wear Rate', description: 'Calculate specific wear rate from wear volume or mass loss, load and sliding distance. See k_s = V/(F·s), units and its relation to the Archard wear equation.' },
    tr: { title: 'Aşınma Oranı Hesaplayıcı ve Formülü | Özgül Aşınma', description: 'Aşınma hacmi veya kütle kaybı, yük ve kayma mesafesinden özgül aşınma oranını hesaplayın. k_s = V/(F·s), birimler ve Archard denklemiyle ilişkisini inceleyin.' },
  },
  '/lab/pin-on-disc-wear-calculator': {
    en: { title: 'Pin-on-Disc Wear Calculator | Wear Rate & Sliding Distance', description: 'Calculate pin-on-disc wear volume, sliding distance, volumetric wear rate, specific wear rate and coefficient of friction from common tribology test measurements.' },
    tr: { title: 'Pin-on-Disc Aşınma Hesaplayıcı | Aşınma Oranı ve Kayma Mesafesi', description: 'Pin-on-disc deney ölçümlerinden aşınma hacmi, kayma mesafesi, hacimsel ve özgül aşınma oranı ile sürtünme katsayısını hesaplayın.' },
  },
};

export function breadcrumbSchema(path: string, language: Language, title: string) {
  const home = { '@type': 'ListItem', position: 1, name: language === 'tr' ? 'Ana sayfa' : 'Home', item: pageUrl('/', language) };
  const lab = path.startsWith('/lab/') || path.startsWith('/araclar/');
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [home,
      ...(lab ? [{ '@type': 'ListItem', position: 2, name: 'Engineering Lab', item: pageUrl('/lab', language) }] : []),
      { '@type': 'ListItem', position: lab ? 3 : 2, name: title, item: pageUrl(path, language) },
    ],
  };
}