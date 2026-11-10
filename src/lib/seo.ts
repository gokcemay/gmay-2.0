import type { Language } from './language';

// Locale is a view preference; all views consolidate into the clean route URL.
export function pageUrl(path: string, _language: Language = 'en'): string {
  const cleanPath = path.split(/[?#]/)[0]?.replace(/\/+$/, '') || '/';
  return `https://gmay.me${cleanPath}`;
}

type SearchCopy = { title: string; description: string };
export const searchCopy: Record<string, Record<Language, SearchCopy>> = {
  '/': {
    en: { title: 'Dr. Gökçe Mehmet Ay | Mechanical Engineering, AI & Tribology', description: 'Explore Dr. Gökçe Mehmet Ay’s work in mechanical engineering, tribology and AI: free engineering tools, academic research, books and training.' },
    tr: { title: 'Dr. Gökçe Mehmet Ay | Makine Mühendisliği, Yapay Zekâ ve Triboloji', description: 'Dr. Gökçe Mehmet Ay’ın makine mühendisliği, triboloji ve yapay zekâ çalışmalarını keşfedin: ücretsiz mühendislik araçları, akademik araştırma ve eğitim.' },
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