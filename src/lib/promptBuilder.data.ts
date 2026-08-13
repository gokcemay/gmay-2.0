import type { DetailLevel } from "./promptBuilder.types";

export const engineeringFields = [
  "Makine Mühendisliği",
  "Üretim",
  "Malzeme Mühendisliği",
  "Triboloji",
  "CAD / CAE",
  "Bakım ve Güvenilirlik",
  "Kalite",
  "Ar-Ge",
  "Akademik Araştırma",
  "Genel Mühendislik",
] as const;

export const taskTypes = [
  "Analiz et",
  "Karşılaştır",
  "Problem çöz",
  "Açıkla",
  "Teknik rapor hazırla",
  "Deney planla",
  "Literatür araştırması planla",
  "Kod üret",
  "Kontrol et / gözden geçir",
  "FMEA oluştur",
  "Kök neden analizi yap",
  "Proje planla",
  "Karar desteği sağla",
] as const;

export const outputFormats = [
  "Adım adım analiz",
  "Teknik rapor",
  "Tablo",
  "Kontrol listesi",
  "Mühendislik hesaplama planı",
  "Araştırma planı",
  "Deney planı",
  "FMEA tablosu",
  "Python kodu",
  "Sunum taslağı",
  "Yönetici özeti",
] as const;

export const detailLevels: DetailLevel[] = ["Kısa", "Standart", "Ayrıntılı"];

export const responseStyles = [
  "Varsayımları açıkça belirt",
  "Belirsizlikleri belirt",
  "Gerekirse alternatif çözümler sun",
  "Hesaplamalarda birimleri göster",
  "Avantaj / dezavantaj karşılaştırması yap",
  "Sonuçta uygulanabilir öneriler ver",
  "Kaynak gerektiren iddiaları işaretle",
  "Güvenlik açısından kritik noktaları belirt",
] as const;

export const defaultStyles: string[] = [
  "Varsayımları açıkça belirt",
  "Belirsizlikleri belirt",
  "Hesaplamalarda birimleri göster",
];

/** Alan bazlı, deterministik teknik bağlam satırları. */
export const fieldContext: Record<string, string[]> = {
  "Makine Mühendisliği": [
    "Yükleme koşullarını, gerilme ve deformasyon davranışını, emniyet katsayılarını ve malzeme sınırlarını ilgili olduğu ölçüde dikkate al.",
  ],
  Üretim: [
    "Üretilebilirlik, proses parametreleri, toleranslar, kalite ve maliyet konularını ilgili olduğu ölçüde dikkate al.",
  ],
  "Malzeme Mühendisliği": [
    "Malzeme özellikleri, üretim/işlem süreçleri, mikroyapı ve hasar mekanizmalarını ilgili olduğu ölçüde dikkate al.",
  ],
  Triboloji: [
    "Sürtünme, aşınma, yağlama, temas koşulları, yüzey özellikleri ve test koşullarını ilgili olduğu ölçüde dikkate al.",
  ],
  "CAD / CAE": [
    "Geometri, sınır koşulları, malzeme modeli, ağ (mesh) ve model varsayımları ile doğrulama adımlarını ilgili olduğu ölçüde dikkate al.",
  ],
  "Bakım ve Güvenilirlik": [
    "Hasar modları, muayene yöntemleri, bakım yapılabilirlik, duruş süresi ve güvenilirlik ölçütlerini ilgili olduğu ölçüde dikkate al.",
  ],
  Kalite: [
    "Ölçüm yöntemleri, tolerans ve şartname uygunluğu, değişkenlik kaynakları ve kontrol planlarını ilgili olduğu ölçüde dikkate al.",
  ],
  "Ar-Ge": [
    "Teknik hedefler, alternatif çözüm yolları, doğrulama yöntemleri ve teknik riskleri ilgili olduğu ölçüde dikkate al.",
  ],
  "Akademik Araştırma": [
    "Araştırma sorusu, yöntem, kanıt kalitesi, sınırlılıklar ve tekrarlanabilirliği ilgili olduğu ölçüde dikkate al.",
  ],
  "Genel Mühendislik": [],
};

/** Görev bazlı, deterministik talimatlar. */
export const taskInstructions: Record<string, string[]> = {
  "Analiz et": [
    "Analizi mantıksal adımlara böl ve her adımda dayandığın girdileri belirt.",
  ],
  Karşılaştır: [
    "Karşılaştırma ölçütlerini önce açıkça tanımla.",
    "Sonuçta ölçütlere göre bir karşılaştırma tablosu ver.",
  ],
  "Problem çöz": [
    "Olası kök nedenleri listele.",
    "Her neden için gerekli kanıt/veriyi belirt.",
    "Önerilen sonraki adımları öncelik sırasıyla ver.",
  ],
  "Açıkla": [
    "Kavramı önce özetle, ardından teknik ayrıntıya in ve gerekiyorsa örnek ver.",
  ],
  "Teknik rapor hazırla": [
    "Amaç, yöntem, bulgular ve sonuç bölümlerini ayır.",
  ],
  "Deney planla": [
    "Değişkenleri, kontrol edilen faktörleri, yanıt (çıktı) parametrelerini, tekrar sayısını ve ölçüm yöntemlerini belirt.",
  ],
  "Literatür araştırması planla": [
    "Arama terimlerini, kullanılacak veri tabanlarını, dahil etme/hariç tutma ölçütlerini ve kanıt değerlendirme yaklaşımını belirt.",
  ],
  "Kod üret": [
    "Okunabilir ve yorum satırlı kod yaz.",
    "Girdi doğrulaması ekle ve kullandığın varsayımları açıkla.",
  ],
  "Kontrol et / gözden geçir": [
    "Gözden geçirmeyi maddeler halinde yap; her maddede kontrol ölçütünü ve olası hata kaynağını belirt.",
  ],
  "FMEA oluştur": [
    "Her satır için hata modu, etki, neden, mevcut kontroller, şiddet (S), oluşma (O) ve saptanabilirlik (D) değerlerini ver.",
  ],
  "Kök neden analizi yap": [
    "Belirtiden başlayarak nedenleri katmanlı biçimde çözümle ve doğrulama yöntemini belirt.",
  ],
  "Proje planla": [
    "İş paketlerini, bağımlılıkları, kilometre taşlarını ve riskleri belirt.",
  ],
  "Karar desteği sağla": [
    "Seçenekleri, karar ölçütlerini ve her seçeneğin riskini açıkça ver.",
  ],
};

export const detailInstruction: Record<DetailLevel, string> = {
  Kısa: "Yanıtı kısa ve öz tut; yalnızca en kritik noktalara odaklan.",
  Standart: "Yanıtı dengeli bir ayrıntı düzeyinde hazırla.",
  Ayrıntılı:
    "Yanıtı ayrıntılı hazırla; ara adımları, gerekçeleri ve varsa hesaplama detaylarını göster.",
};

export const styleInstruction: Record<string, string> = {
  "Varsayımları açıkça belirt": "Varsayımlarını açıkça belirt.",
  "Belirsizlikleri belirt": "Eksik veya belirsiz bilgileri işaretle.",
  "Gerekirse alternatif çözümler sun": "Uygun olduğunda alternatif çözüm yolları sun.",
  "Hesaplamalarda birimleri göster":
    "Hesaplama gerekiyorsa kullanılan denklemleri ve birimleri göster.",
  "Avantaj / dezavantaj karşılaştırması yap": "Seçenekler için avantaj/dezavantaj karşılaştırması yap.",
  "Sonuçta uygulanabilir öneriler ver": "Sonuç bölümünde uygulanabilir öneriler ver.",
  "Kaynak gerektiren iddiaları işaretle":
    "Kaynak gerektiren iddiaları ayrıca işaretle ve doğrulanması gerektiğini belirt.",
  "Güvenlik açısından kritik noktaları belirt": "Güvenlik açısından kritik noktaları ayrıca belirt.",
};
