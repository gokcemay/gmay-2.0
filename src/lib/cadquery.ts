import { translate } from './translate';
import type { Language } from './language';

export const partTypes = ['Braket', 'Flanş', 'Plaka', 'Burç / Ara parça', 'Fikstür / Tutucu', 'Kutu / Muhafaza', 'Mil', 'Diğer'];
export const methods = ['CNC freze', 'CNC torna', 'Lazer / su jeti kesim + büküm', 'Sac büküm', 'FDM 3B baskı', 'SLA 3B baskı', 'Döküm', 'Belirtilmedi'];
export const materials = ['Alüminyum 6061-T6', 'Alüminyum 7075', 'S235 çelik', 'Paslanmaz 304', 'PLA', 'PETG', 'POM'];
export const holeTypes = ['Geçme deliği', 'Diş açılmış delik', 'Havşalı', 'Havşa başlı (cıvata başı gömme)', 'Pim deliği', 'Diğer'];
export const rules = [
  'Tüm ölçüler dosyanın başında, açıklamalı BÜYÜK_HARF değişkenler',
  'Her modelleme adımı yorumlu',
  'Sonda sınır kutusu ve hacmi yazdır',
  'Varsayımları yorum satırında belirt',
  'Belirsiz yüz seçicilerinden kaçın (nokta tabanlı seçici veya ayrı gövdeden çıkarma kullan)',
  'Radyüsleri en son adıma bırak',
];
export type Dimension = { name: string; value: string; unit: 'mm' | '°'; unknown: boolean; note: string };
export type Hole = { type: string; size: string; count: string; position: string };
export type CadForm = {
  name: string; type: string; purpose: string; material: string; method: string;
  dimensions: Dimension[]; holes: Hole[]; radius: string; origin: string; direction: string;
  formats: string[]; filename: string; viewer: string; environment: string; rules: string[]; notes: string;
};
export const storageKey = 'gmay-cadquery-form-v1';
export function slug(value: string): string {
  const chars: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u' };
  return value.replace(/[çğıİöşü]/gi, c => chars[c] ?? chars[c.toLocaleLowerCase('tr')] ?? c)
    .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
export function emptyForm(): CadForm {
  return { name: '', type: 'Braket', purpose: '', material: '', method: 'Belirtilmedi', dimensions: [], holes: [], radius: '', origin: '', direction: '', formats: ['STEP', 'STL'], filename: '', viewer: 'OCP CAD Viewer (VS Code)', environment: 'Claude sohbet arayüzü', rules: [...rules], notes: '' };
}
export function exampleForm(language: Language = 'tr'): CadForm {
  const form: CadForm = { ...emptyForm(), name: 'L braket', purpose: 'Bir sensör kutusunu yatay tablaya dik bağlayacak.', material: 'Alüminyum 6061-T6', method: 'CNC freze (5 mm plakadan)', dimensions: ([['Yatay kol', '60'], ['Dikey kol', '50'], ['Genişlik', '40'], ['Kalınlık', '5']] as [string, string][]).map(([name, value]) => ({ name, value, unit: 'mm', unknown: false, note: '' })), holes: [{ type: 'Geçme deliği', size: 'M6 (Ø6,6)', count: '4', position: 'her kolda 2 adet, aralık 25 mm, delik ekseni kol ucundan 15 mm içeride' }], radius: 'İç köşe R4', origin: 'Dış köşede', direction: "Yatay kol +X, dikey kol +Z boyunca, genişlik Y=0'a simetrik.", filename: 'l_braket' };
  if (language === 'tr') return form;
  const t = (value: string) => translate(value, language);
  return { ...form, name: t(form.name), purpose: t(form.purpose), material: t(form.material), method: t(form.method), radius: t(form.radius), origin: t(form.origin), direction: t(form.direction), filename: 'l_bracket', dimensions: form.dimensions.map(d => ({ ...d, name: t(d.name) })), holes: form.holes.map(h => ({ ...h, position: t(h.position) })) };
}
export function validForm(form: CadForm): boolean {
  return Boolean(form.name.trim() && form.purpose.trim()) && form.dimensions.every(d => d.unknown || !d.value || Number.isFinite(Number(d.value))) && form.holes.every(h => !h.count || (Number.isInteger(Number(h.count)) && Number(h.count) > 0));
}
export function restoreForm(value: string): CadForm | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return null;
    const base = emptyForm();
    const record = parsed as Record<string, unknown>;
    for (const key of Object.keys(base) as (keyof CadForm)[]) {
      if (typeof base[key] === 'string' && typeof record[key] !== 'string') return null;
    }
    if (!Array.isArray(record['dimensions']) || !record['dimensions'].every(d => d && typeof d.name === 'string' && typeof d.value === 'string' && ['mm', '°'].includes(d.unit) && typeof d.unknown === 'boolean' && typeof d.note === 'string')) return null;
    if (!Array.isArray(record['holes']) || !record['holes'].every(h => h && ['type', 'size', 'count', 'position'].every(k => typeof h[k] === 'string'))) return null;
    if (!Array.isArray(record['formats']) || !record['formats'].every(f => ['STEP', 'STL', 'DXF', 'SVG'].includes(f))) return null;
    if (!Array.isArray(record['rules']) || !record['rules'].every(r => rules.includes(r))) return null;
    return parsed as CadForm;
  } catch { return null; }
}
export function buildCadPrompt(f: CadForm, language: Language = 'tr'): string {
  if (language === 'en') return buildEnglishCadPrompt(f);
  const parts = ['Rolün: CadQuery ile parametrik parça modelleyen bir makine mühendisi.'];
  const intro: string[] = [];
  if (f.name.trim()) intro.push(`Parça: ${f.name.trim()} (${f.type}).${f.purpose.trim() ? ` ${f.purpose.trim()}` : ''}`);
  else if (f.purpose.trim()) intro.push(f.purpose.trim());
  if (f.material.trim()) intro.push(`Malzeme: ${f.material.trim()}`);
  if (f.method !== 'Belirtilmedi' && f.method.trim()) intro.push(`Üretim: ${f.method}`);
  if (intro.length) parts.push(intro.join('\n'));
  const dims = f.dimensions.filter(d => d.name.trim() && (d.unknown || d.value.trim()));
  if (dims.length) {
    const units = [...new Set(dims.map(d => d.unit))].join(', ');
    parts.push(`Ölçüler (${units}):\n` + dims.map(d => d.unknown
      ? `- ${d.name.trim()}: BİLİNMİYOR — makul bir değer öner, parametre olarak tanımla ve yorumda "VARSAYIM" diye işaretle`
      : `- ${d.name.trim()}: ${d.value} ${d.unit}${d.note.trim() ? ` — ${d.note.trim()}` : ''}`).join('\n'));
  }
  const holes = f.holes.filter(h => h.size.trim() || h.position.trim());
  if (holes.length) parts.push('Delikler ve bağlantılar:\n' + holes.map(h => '- ' + [`${h.count ? `${h.count} adet ` : ''}${h.type}`, h.size.trim(), h.position.trim()].filter(Boolean).join(', ')).join('\n'));
  if (f.radius.trim()) parts.push(`Radyüs / pah: ${f.radius.trim()}`);
  if (f.origin.trim() || f.direction.trim()) parts.push('Koordinat sistemi: ' + [f.origin.trim() ? `Orijin ${f.origin.trim()}.` : '', f.direction.trim()].filter(Boolean).join(' '));
  const code = [...f.rules];
  const filename = slug(f.filename) || slug(f.name) || 'parca';
  if (f.formats.length) code.push(f.formats.map(format => `${filename}.${format.toLowerCase()}`).join(' ve ') + ' olarak dışa aktar');
  if (f.formats.includes('DXF')) code.push('DXF için uygun bir 2B kesit oluştur ve bu kesiti dışa aktar');
  if (f.formats.includes('SVG')) code.push('SVG için uygun görünümü dışa aktar');
  if (f.viewer === 'OCP CAD Viewer (VS Code)') code.push('Kodun sonuna `show(...)` ekle (ocp_vscode)');
  if (f.viewer === 'CQ-editor') code.push('Kodun sonuna `show_object(...)` ekle (CQ-editor)');
  code.push(f.environment === 'Claude Code' ? 'Kodu kendin çalıştır; hata alırsan düzelt, sonunda sınır kutusu ve hacim çıktısını bana raporla' : 'Kodu tek bir Python dosyası olarak ver; çalıştırınca ne göreceğimi kısaca açıkla');
  parts.push('Kod kuralları:\n' + code.map(r => `- ${r}`).join('\n'));
  if (f.notes.trim()) parts.push(`Ek notlar: ${f.notes.trim()}`);
  parts.push('Kodu yazmadan önce şartnamede çelişki veya eksik kritik bir ölçü görürsen önce bunu bana sor.');
  return parts.join('\n\n');
}

function buildEnglishCadPrompt(f: CadForm): string {
  const t = (value: string) => translate(value, 'en');
  const parts = [t('Rolün: CadQuery ile parametrik parça modelleyen bir makine mühendisi.')];
  const intro: string[] = [];
  if (f.name.trim()) intro.push(`Part: ${f.name.trim()} (${t(f.type)}).${f.purpose.trim() ? ` ${f.purpose.trim()}` : ''}`);
  else if (f.purpose.trim()) intro.push(f.purpose.trim());
  if (f.material.trim()) intro.push(`Material: ${t(f.material.trim())}`);
  if (f.method !== 'Belirtilmedi' && f.method.trim()) intro.push(`Manufacturing: ${t(f.method)}`);
  if (intro.length) parts.push(intro.join('\n'));
  const dims = f.dimensions.filter(d => d.name.trim() && (d.unknown || d.value.trim()));
  if (dims.length) parts.push(`Dimensions (${[...new Set(dims.map(d => d.unit))].join(', ')}):\n` + dims.map(d => d.unknown
    ? `- ${d.name.trim()}: UNKNOWN — suggest a reasonable value, define it as a parameter, and mark it as "ASSUMPTION" in a comment`
    : `- ${d.name.trim()}: ${d.value} ${d.unit}${d.note.trim() ? ` — ${d.note.trim()}` : ''}`).join('\n'));
  const holes = f.holes.filter(h => h.size.trim() || h.position.trim());
  if (holes.length) parts.push('Holes and connections:\n' + holes.map(h => '- ' + [`${h.count ? `${h.count} × ` : ''}${t(h.type)}`, h.size.trim(), h.position.trim()].filter(Boolean).join(', ')).join('\n'));
  if (f.radius.trim()) parts.push(`Radius / chamfer: ${f.radius.trim()}`);
  if (f.origin.trim() || f.direction.trim()) parts.push('Coordinate system: ' + [f.origin.trim() ? `Origin ${f.origin.trim()}.` : '', f.direction.trim()].filter(Boolean).join(' '));
  const code = f.rules.map(t);
  const filename = slug(f.filename) || slug(f.name) || 'part';
  if (f.formats.length) code.push('Export as ' + f.formats.map(format => `${filename}.${format.toLowerCase()}`).join(' and '));
  if (f.formats.includes('DXF')) code.push(t('DXF için uygun bir 2B kesit oluştur ve bu kesiti dışa aktar'));
  if (f.formats.includes('SVG')) code.push(t('SVG için uygun görünümü dışa aktar'));
  if (f.viewer === 'OCP CAD Viewer (VS Code)') code.push(t('Kodun sonuna `show(...)` ekle (ocp_vscode)'));
  if (f.viewer === 'CQ-editor') code.push(t('Kodun sonuna `show_object(...)` ekle (CQ-editor)'));
  code.push(t(f.environment === 'Claude Code' ? 'Kodu kendin çalıştır; hata alırsan düzelt, sonunda sınır kutusu ve hacim çıktısını bana raporla' : 'Kodu tek bir Python dosyası olarak ver; çalıştırınca ne göreceğimi kısaca açıkla'));
  parts.push('Code rules:\n' + code.map(r => `- ${r}`).join('\n'));
  if (f.notes.trim()) parts.push(`Additional notes: ${f.notes.trim()}`);
  parts.push(t('Kodu yazmadan önce şartnamede çelişki veya eksik kritik bir ölçü görürsen önce bunu bana sor.'));
  return parts.join('\n\n');
}