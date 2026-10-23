import { useT, useLanguage } from '@/lib/i18n';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Download, ExternalLink, Info, Moon, Plus, RotateCcw, Sun, Trash2, TriangleAlert, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/site/LanguageSelector';
import { buildCadPrompt, emptyForm, exampleForm, holeTypes, materials, methods, partTypes, restoreForm, rules, slug, storageKey, validForm, type CadForm, type Dimension, type Hole } from '@/lib/cadquery';

function Step({ number, title, description, children }: { number: number; title: string; description: string; children: ReactNode }) {
  const tx = useT();
  return <section className="cq-step"><header className="cq-step-head"><span className="cq-step-number">{tx(number.toString().padStart(2, '0'))}</span><div><h2>{tx(title)}</h2><p>{tx(description)}</p></div></header><div className="cq-step-body">{tx(children)}</div></section>;
}
function Field({ label, id, required, hint, children }: { label: string; id: string; required?: boolean; hint?: string; children: ReactNode }) {
  const tx = useT();
  return <div className="cq-field"><label htmlFor={id}>{tx(label)}{tx(required && <span className="text-destructive"> *</span>)}</label>{tx(children)}{tx(hint && <p className="cq-hint" id={`${id}-hint`}>{tx(hint)}</p>)}</div>;
}

export default function CadQueryPrompt() {
  const tx = useT();
  const language = useLanguage();
  const [form, setForm] = useState<CadForm>(emptyForm);
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  const manualTheme = useRef(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prompt = buildCadPrompt(form, language);
  const valid = validForm(form);
  const unknownCount = form.dimensions.filter(d => d.unknown).length;
  const file = slug(form.filename) || slug(form.name) || 'parca';

  useEffect(() => {
    try { const saved = localStorage.getItem(storageKey); if (saved) { const restored = restoreForm(saved); if (restored) setForm(restored); } } catch { setStatus('Tarayıcı kaydı kullanılamıyor; form bu oturumda çalışmaya devam eder.'); }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(media.matches);
    const sync = () => { if (!manualTheme.current) setDark(media.matches); };
    media.addEventListener('change', sync);
    setReady(true);
    return () => { media.removeEventListener('change', sync); if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(form)); } catch { setStatus('Tarayıcı kaydı kullanılamıyor; sayfa yenilenirse girdileriniz kaybolabilir.'); }
  }, [form, ready]);
  useEffect(() => { setCopied(false); }, [prompt]);

  const update = <K extends keyof CadForm>(key: K, value: CadForm[K]) => setForm(prev => ({ ...prev, [key]: value }));
  const updateDimension = (index: number, patch: Partial<Dimension>) => update('dimensions', form.dimensions.map((d, i) => i === index ? { ...d, ...patch } : d));
  const updateHole = (index: number, patch: Partial<Hole>) => update('holes', form.holes.map((h, i) => i === index ? { ...h, ...patch } : h));
  const toggle = (key: 'formats' | 'rules', value: string) => update(key, form[key].includes(value) ? form[key].filter(x => x !== value) : [...form[key], value]);
  const copy = async () => {
    if (!valid) return false;
    try {
      await navigator.clipboard.writeText(prompt); setCopied(true); setStatus('');
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch { setStatus('Panoya erişilemedi. Önizlemedeki metni seçip elle kopyalayabilirsiniz.'); return false; }
  };
  const download = () => {
    if (!valid) return;
    const url = URL.createObjectURL(new Blob([prompt], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${file}_prompt.txt`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const openClaude = async () => {
    if (!valid) return;
    window.open('https://claude.ai/new', '_blank', 'noopener,noreferrer');
    if (await copy()) setStatus("Prompt panoya kopyalandı, Claude'da yapıştırın.");
  };
  const clear = () => { setForm(emptyForm()); setStatus(''); setCopied(false); setConfirmClear(false); };

  return <div className={`cq-tool ${dark ? 'cq-dark dark' : ''}`}>
    <div className="cq-topline"><a href="https://gmay.me" target="_blank" rel="noopener noreferrer" className="cq-brand">{tx("GM")}<span>{tx("AY")}</span><span className="cq-brand-divider" />{tx("MÜHENDİSLİK ARAÇLARI")}</a><div className="flex items-center gap-2"><LanguageSelector /><Button variant="ghost" size="icon" aria-label={tx(dark ? 'Açık temaya geç' : 'Koyu temaya geç')} title={tx(dark ? 'Açık temaya geç' : 'Koyu temaya geç')} onClick={() => { manualTheme.current = true; setDark(!dark); }}>{tx(dark ? <Sun /> : <Moon />)}</Button></div></div>
    <div className="cq-container">
      <header className="cq-intro"><div className="cq-eyebrow"><Box size={16} /> {tx("PARAMETRİK MODELLEME / CADQUERY")}</div><h1>{tx("CadQuery Prompt Üreteci")}</h1><p>{tx("Kafadaki parça fikrini, Claude'un parametrik CAD koduna çevirebileceği net bir şartnameye dönüştürün.")}</p><a href="https://gmehmetay.substack.com" target="_blank" rel="noopener noreferrer">{tx("Yöntemi anlatan yazı")}<span aria-hidden="true">→</span></a></header>
      <div className="cq-workspace">
        <div className="min-w-0"><div className="cq-form-toolbar"><span className="cq-eyebrow">{tx("PARÇA ŞARTNAMESİ")}</span><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => { setForm(exampleForm(language)); setStatus(''); }}><Box />{tx("Örneği yükle (L braket)")}</Button><Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}><RotateCcw />{tx("Formu temizle")}</Button></div></div>
          <form onSubmit={e => e.preventDefault()} className="cq-form">
            <Step number={1} title={tx("Fonksiyon")} description={tx("Parçanın adını ve hangi işi yapacağını tanımlayın.")}>
              <div className="cq-two"><Field label={tx("Parça adı")} id="cq-name" required><input id="cq-name" value={form.name} placeholder={tx("Örn. L braket")} required aria-invalid={!form.name.trim()} className={!form.name.trim() ? 'cq-invalid' : ''} onChange={e => setForm(prev => ({ ...prev, name: e.target.value, filename: !prev.filename || prev.filename === slug(prev.name) ? slug(e.target.value) : prev.filename }))} /></Field><Field label={tx("Parça tipi")} id="cq-type"><select id="cq-type" value={form.type} onChange={e => update('type', e.target.value)}>{tx(partTypes.map(t => <option key={t} value={t}>{tx(t)}</option>))}</select></Field></div>
              <Field label={tx("Ne işe yarayacak?")} id="cq-purpose" required hint={tx("Neye bağlanacak, ne taşıyacak? 'Bir braket' yerine 'NEMA 17 motoru 20×20 profile dik bağlayan braket' yazın.")}><textarea id="cq-purpose" rows={3} value={form.purpose} required aria-invalid={!form.purpose.trim()} aria-describedby="cq-purpose-hint" className={!form.purpose.trim() ? 'cq-invalid' : ''} placeholder={tx("Parçanın görevini ve montaj ilişkisini açıklayın…")} onChange={e => update('purpose', e.target.value)} /></Field>
            </Step>
            <Step number={2} title={tx("Ölçüler ve sınırlar")} description={tx("Bilinen ölçüleri, bağlantıları ve üretim sınırlarını belirtin.")}>
              <div className="cq-two"><Field label={tx("Malzeme")} id="cq-material"><input id="cq-material" list="cq-materials" value={form.material} placeholder={tx("Seçin veya yazın")} onChange={e => update('material', e.target.value)} /><datalist id="cq-materials">{tx(materials.map(m => <option key={m} value={tx(m)} />))}</datalist></Field><Field label={tx("Üretim yöntemi")} id="cq-method"><select id="cq-method" value={form.method} onChange={e => update('method', e.target.value)}>{tx([...methods, ...(methods.includes(form.method) ? [] : [form.method])].map(m => <option key={m} value={m}>{tx(m)}</option>))}</select></Field></div>
              <div className="cq-subhead"><h3>{tx("Ölçüler")}</h3><Button variant="ghost" size="sm" onClick={() => update('dimensions', [...form.dimensions, { name: '', value: '', unit: 'mm', unknown: false, note: '' }])}><Plus />{tx("Ölçü ekle")}</Button></div>
              {tx(form.dimensions.length === 0 && <p className="cq-empty">{tx("Henüz ölçü eklenmedi.")}</p>)}
              {tx(form.dimensions.map((d, i) => <div className="cq-dimension" key={i}><Field label={tx("Ölçü adı")} id={`cq-dname-${i}`}><input id={`cq-dname-${i}`} value={d.name} placeholder={tx("Yatay kol uzunluğu")} onChange={e => updateDimension(i, { name: e.target.value })} /></Field><Field label={tx("Değer")} id={`cq-dvalue-${i}`}><input id={`cq-dvalue-${i}`} type="number" step="any" value={d.value} disabled={d.unknown} onChange={e => updateDimension(i, { value: e.target.value })} /></Field><Field label={tx("Birim")} id={`cq-dunit-${i}`}><select id={`cq-dunit-${i}`} value={d.unit} onChange={e => updateDimension(i, { unit: e.target.value as Dimension['unit'] })}><option>{tx("mm")}</option><option>°</option></select></Field><Button variant="ghost" size="icon" className="cq-delete" aria-label={tx(`${i + 1}. ölçüyü sil`)} title={tx("Ölçüyü sil")} onClick={() => update('dimensions', form.dimensions.filter((_, index) => index !== i))}><Trash2 /></Button><label className="cq-check cq-unknown"><input type="checkbox" checked={d.unknown} onChange={e => updateDimension(i, { unknown: e.target.checked })} />{tx("Bilinmiyor")}</label><Field label={tx("Not (isteğe bağlı)")} id={`cq-dnote-${i}`}><input id={`cq-dnote-${i}`} value={d.note} placeholder={tx("Ölçüye ilişkin not")} onChange={e => updateDimension(i, { note: e.target.value })} /></Field></div>))}
              <div className="cq-subhead"><h3>{tx("Delikler ve bağlantılar")}</h3><Button variant="ghost" size="sm" onClick={() => update('holes', [...form.holes, { type: 'Geçme deliği', size: '', count: '1', position: '' }])}><Plus />{tx("Bağlantı ekle")}</Button></div>
              {tx(form.holes.length === 0 && <p className="cq-empty">{tx("Henüz bağlantı eklenmedi.")}</p>)}
              {tx(form.holes.map((h, i) => <div className="cq-hole" key={i}><Field label={tx("Tip")} id={`cq-htype-${i}`}><select id={`cq-htype-${i}`} value={h.type} onChange={e => updateHole(i, { type: e.target.value })}>{holeTypes.map(t => <option key={t} value={t}>{tx(t)}</option>)}</select></Field><Field label={tx("Standart / ölçü")} id={`cq-hsize-${i}`}><input id={`cq-hsize-${i}`} value={h.size} placeholder={tx("M6, Ø6,6, M6 DIN 7991")} onChange={e => updateHole(i, { size: e.target.value })} /></Field><Field label={tx("Adet")} id={`cq-hcount-${i}`}><input id={`cq-hcount-${i}`} type="number" min="1" step="1" value={h.count} aria-invalid={!!h.count && (!Number.isInteger(Number(h.count)) || Number(h.count) <= 0)} onChange={e => updateHole(i, { count: e.target.value })} /></Field><Button variant="ghost" size="icon" className="cq-delete" aria-label={tx(`${i + 1}. bağlantıyı sil`)} title={tx("Bağlantıyı sil")} onClick={() => update('holes', form.holes.filter((_, index) => index !== i))}><Trash2 /></Button><div className="cq-hole-position"><Field label={tx("Konum açıklaması")} id={`cq-hpos-${i}`}><input id={`cq-hpos-${i}`} value={h.position} placeholder={tx("Her kolda, aralık 25 mm, uçtan 15 mm içeride")} onChange={e => updateHole(i, { position: e.target.value })} /></Field></div></div>))}
              <Field label={tx("Radyüs / pah notları")} id="cq-radius"><input id="cq-radius" value={form.radius} placeholder={tx("İç köşe R4, dış kenarlar 0,5×45° pah")} onChange={e => update('radius', e.target.value)} /></Field>
            </Step>
            <Step number={3} title={tx("Koordinat sistemi")} description={tx("Orijini ve eksen yönlerini açıkça tarif edin.")}>
              <Field label={tx("Orijin konumu")} id="cq-origin"><input id="cq-origin" list="cq-origins" value={form.origin} placeholder={tx("Örn. Dış köşede")} onChange={e => update('origin', e.target.value)} /><datalist id="cq-origins">{tx(['Dış köşede', 'Parçanın merkezinde', 'Alt yüzün merkezinde', 'Montaj deliğinin merkezinde'].map(o => <option key={o} value={tx(o)} />))}</datalist></Field>
              <Field label={tx("Ana yön tanımı")} id="cq-direction" hint={tx("Hangi ölçü hangi eksen boyunca? Örn: 'Yatay kol +X, dikey kol +Z boyunca, genişlik Y=0’a simetrik.'")}><textarea id="cq-direction" rows={3} value={form.direction} aria-describedby="cq-direction-hint" placeholder={tx("X, Y ve Z eksenlerine göre yönleri tanımlayın…")} onChange={e => update('direction', e.target.value)} /></Field>
            </Step>
            <Step number={4} title={tx("Kod kuralları ve çıktı")} description={tx("Dosya formatlarını ve Claude'un çalışma biçimini seçin.")}>
              <fieldset><legend>{tx("Çıktı formatları")}</legend><div className="cq-formats">{tx(['STEP', 'STL', 'DXF', 'SVG'].map(f => <label className={`cq-format ${form.formats.includes(f) ? 'cq-selected' : ''}`} key={f}><input type="checkbox" checked={form.formats.includes(f)} onChange={() => toggle('formats', f)} />{tx(f)}{f === 'DXF' && <span>{tx("(2B kesit)")}</span>}{f === 'SVG' && <span>{tx("(görünüm)")}</span>}</label>))}</div></fieldset>
              <Field label={tx("Dosya adı")} id="cq-filename"><input id="cq-filename" value={form.filename} placeholder={tx("parca_adi")} onChange={e => update('filename', slug(e.target.value))} /></Field>
              <div className="cq-two"><Field label={tx("Görüntüleyici")} id="cq-viewer"><select id="cq-viewer" value={form.viewer} onChange={e => update('viewer', e.target.value)}>{tx(['OCP CAD Viewer (VS Code)', 'CQ-editor', 'Yok'].map(v => <option key={v} value={v}>{tx(v)}</option>))}</select></Field><Field label={tx("Çalışma ortamı")} id="cq-env"><select id="cq-env" value={form.environment} onChange={e => update('environment', e.target.value)}><option value="Claude sohbet arayüzü">{tx("Claude sohbet arayüzü")}</option><option>{tx("Claude Code")}</option></select></Field></div>
              <fieldset><legend>{tx("Kod kuralları")}</legend><div className="cq-rules">{tx(rules.map(r => <label className="cq-check" key={r}><input type="checkbox" checked={form.rules.includes(r)} onChange={() => toggle('rules', r)} />{tx(r)}</label>))}</div></fieldset>
            </Step>
            <Step number={5} title={tx("Ek notlar")} description={tx("Toleransları ve diğer özel gereksinimleri ekleyin.")}><Field label={tx("Ek notlar (isteğe bağlı)")} id="cq-notes"><textarea id="cq-notes" rows={4} value={form.notes} placeholder={tx("Tolerans, yüzey kalitesi, montaj ilişkisi, sonradan değişecek parametreler…")} onChange={e => update('notes', e.target.value)} /></Field></Step>
          </form>
        </div>
        <aside className="cq-preview-column"><div className="cq-preview"><header className="cq-preview-head"><div><span className="cq-eyebrow">{tx("ÇIKTI / CLAUDE")}</span><h2>{tx("Prompt önizlemesi")}</h2></div><span className="cq-live"><span />{tx("CANLI")}</span></header>
          <div className="cq-notices">{tx(!form.origin.trim() && !form.direction.trim() && <p className="cq-notice cq-warning"><TriangleAlert size={16} /><span>{tx("Koordinat sistemi tanımlanmadı. Claude'un en sık hatası yön ve işaret hatalarıdır.")}</span></p>)}{tx(unknownCount > 0 && <p className="cq-notice cq-info"><Info size={16} /><span>{tx(unknownCount)} {tx("ölçü bilinmiyor olarak işaretlendi. Claude bunlar için varsayım önerecek.")}</span></p>)}</div>
          <pre className="cq-prompt" tabIndex={0} aria-label={tx("Oluşturulan CadQuery promptu")}>{tx(prompt)}</pre><div className="cq-preview-bottom"><div className="cq-count"><span>{tx(prompt.length.toLocaleString(language === 'en' ? 'en-US' : 'tr-TR'))} {tx("karakter")}</span><span>{tx(".PY ŞARTNAMESİ")}</span></div><div className="cq-output-actions"><Button disabled={!valid} onClick={() => void copy()}>{tx(copied ? <Check /> : <Copy />)}{tx(copied ? 'Kopyalandı ✓' : 'Kopyala')}</Button><Button disabled={!valid} variant="outline" onClick={download}><Download />{tx(".txt indir")}</Button><Button disabled={!valid} variant="outline" onClick={() => void openClaude()}><ExternalLink />{tx("Claude'da aç")}</Button></div>{tx(!valid && <p className="cq-hint text-destructive">{tx("Parça adı ve fonksiyonu doldurun; bağlantı adetleri pozitif tam sayı olmalıdır.")}</p>)}<p className="cq-status" role="status" aria-live="polite">{tx(status || (copied ? 'Prompt panoya kopyalandı.' : ''))}</p></div>
        </div><p className="cq-privacy">{tx("Bu araç hiçbir veriyi sunucuya göndermez; girdileriniz yalnızca tarayıcınızda saklanır.")}</p></aside>
      </div>
      <footer className="cq-footer"><a href="https://gmay.me" target="_blank" rel="noopener noreferrer">{tx("Gökçe Mehmet Ay · gmay.me")}</a><a href="https://gmehmetay.substack.com" target="_blank" rel="noopener noreferrer">{tx("Mühendisliğin Yapay Zeka Mentoru")}<ExternalLink size={13} /></a><p>{tx("Bu araç hiçbir veriyi sunucuya göndermez; girdileriniz yalnızca tarayıcınızda saklanır.")}</p></footer>
    </div>
    <div className="cq-mobile-copy"><Button disabled={!valid} onClick={() => void copy()}>{tx(copied ? <Check /> : <Copy />)}{tx(copied ? 'Kopyalandı ✓' : 'Promptu kopyala')}</Button></div>
    {tx(confirmClear && <div className="cq-dialog-backdrop"><div role="alertdialog" aria-modal="true" aria-labelledby="cq-clear-title" aria-describedby="cq-clear-description" className="cq-dialog" onKeyDown={e => { if (e.key === 'Escape') setConfirmClear(false); if (e.key === 'Tab') { const buttons = e.currentTarget.querySelectorAll('button'); const first = buttons[0]; const last = buttons[buttons.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } } }}><h2 id="cq-clear-title">{tx("Form temizlensin mi?")}</h2><p id="cq-clear-description">{tx("Tüm girdiler ve tarayıcınızda saklanan form sıfırlanacak.")}</p><div className="flex justify-end gap-3"><Button autoFocus variant="outline" onClick={() => setConfirmClear(false)}>{tx("Vazgeç")}</Button><Button onClick={clear}><Trash2 />{tx("Formu temizle")}</Button></div></div></div>)}
  </div>;
}