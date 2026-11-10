import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { convertHardness, hardnessCurve, hardnessRanges, hardnessScales, type HardnessScale } from '@/lib/hardness.logic';

export function HardnessCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, turkish: string) => tr ? turkish : en;
  const [scale, setScale] = useState<HardnessScale>('HRC');
  const [input, setInput] = useState('40');
  const [series, setSeries] = useState<'HRC' | 'HRB' | 'HBW'>('HRC');
  const result = convertHardness(scale, input);
  const fmt = (v: number, digits: number) => v.toLocaleString(tr ? 'tr-TR' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const points = hardnessCurve(series);
  const ymax = series === 'HBW' ? 650 : series === 'HRB' ? 110 : 70;
  // Separate SVG paths at every unavailable interval; never connect a gap.
  const paths: string[] = []; let path = '';
  for (const p of points) {
    if (p.value === null) { if (path) paths.push(path); path = ''; continue; }
    path += `${path ? 'L' : 'M'}${45 + (p.hv - 100) / 840 * 390},${190 - p.value / ymax * 155} `;
  }
  if (path) paths.push(path);
  const names = { HV: 'Vickers', HBW: 'Brinell', HRC: 'Rockwell C', HRB: 'Rockwell B' };
  const range = hardnessRanges[scale];
  return <>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label={L('Inputs', 'Girdiler')} className="grid content-start gap-5">
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Measured hardness', 'Ölçülen sertlik')}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{L('Material scope: Non-austenitic carbon/alloy/tool steels', 'Malzeme kapsamı: Östenitik olmayan karbon/alaşım/takım çelikleri')}</p>
        <fieldset>
          <legend className="text-sm text-foreground">{L('Input hardness scale', 'Girdi sertlik ölçeği')}</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">{hardnessScales.map(s => <Button key={s} variant={s === scale ? 'default' : 'outline'} aria-pressed={s === scale} onClick={() => setScale(s)}>{s}</Button>)}</div>
        </fieldset>
        <div>
          <label htmlFor="hardness-value" className="text-sm text-foreground">{L('Measured hardness value', 'Ölçülen sertlik değeri')} ({scale})</label>
          <Input id="hardness-value" inputMode="decimal" value={input} onChange={e => setInput(e.target.value)} aria-invalid={Boolean(result.error)} aria-describedby="hardness-range hardness-error" className="mt-2" />
          <p id="hardness-range" className="mt-2 text-xs text-muted-foreground">{L('Supported input range', 'Desteklenen girdi aralığı')}: {fmt(range[0], scale === 'HV' || scale === 'HBW' ? 0 : 6)}–{fmt(range[1], scale === 'HV' || scale === 'HBW' ? 0 : 6)} {scale}</p>
          <p id="hardness-error" role={result.error ? 'alert' : undefined} className="mt-2 text-sm text-destructive">{result.error === 'invalid' ? L('Enter a positive, finite hardness number.', 'Pozitif ve sonlu bir sertlik sayısı girin.') : result.error === 'range' ? L('This value is outside the validated conversion range for the selected scale.', 'Bu değer seçilen ölçeğin geçerli dönüşüm aralığı dışındadır.') : ''}</p>
        </div>
        <Button variant="outline" className="justify-self-start" onClick={() => { setScale('HRC'); setInput('40'); }}><RotateCcw />{L('Load 40 HRC example', '40 HRC örneğini yükle')}</Button>
      </section>
      <section aria-label={L('Approximate equivalents', 'Yaklaşık eşdeğer değerler')} aria-live="polite">
        <h2 className="font-display text-xl font-semibold text-foreground">{L('Approximate equivalents', 'Yaklaşık eşdeğer değerler')}</h2>
        {result.values ? <>
          <p className="mt-3 text-sm text-muted-foreground">{L('Input', 'Girdi')}: <strong className="text-foreground">{input} {scale}</strong></p>
          <dl className="mt-4 divide-y divide-border border-y border-border">{hardnessScales.map(s => {
            const v = result.values[s];
            return <div key={s} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <dt className="text-sm text-muted-foreground">{names[s]} ({s})</dt>
              <dd className="sm:text-right"><p className="font-display text-xl font-semibold text-foreground">{v === null ? '—' : `${fmt(v, s === 'HV' || s === 'HBW' ? 0 : 1)} ${s}`}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s === scale ? L('Same input scale', 'Girdi ile aynı ölçek') : v === null ? L('Not available for this hardness range', 'Bu sertlik aralığında kullanılamaz') : L('Approximate equivalent', 'Yaklaşık eşdeğer değer')}</p></dd>
            </div>;
          })}</dl>
        </> : <p className="mt-4 text-sm text-muted-foreground">{L('Outside valid range — no equivalents calculated.', 'Geçerli aralık dışında — eşdeğer değer hesaplanmadı.')}</p>}
      </section>
    </div>
    <figure className="mt-10 max-w-2xl">
      <figcaption className="font-display text-lg font-semibold text-foreground">{L('Empirical conversion chart', 'Ampirik dönüşüm grafiği')}</figcaption>
      <div className="mt-3 flex gap-2">{(['HRC','HRB','HBW'] as const).map(s => <Button size="sm" variant={series === s ? 'default' : 'outline'} key={s} aria-pressed={series === s} onClick={() => setSeries(s)}>{s}</Button>)}</div>
      <svg viewBox="0 0 460 230" role="img" aria-label={L(`Empirical ${series} versus Vickers HV, valid ranges only`, `Ampirik ${series} ve Vickers HV ilişkisi, yalnızca geçerli aralıklar`)} className="mt-4 w-full text-foreground">
        <path d="M45 25V190H435" stroke="currentColor" fill="none" strokeOpacity="0.5" />
        {[0,0.5,1].map(f => <g key={f}><text x="38" y={193-f*155} textAnchor="end" fontSize="11" fill="currentColor">{Math.round(f*ymax)}</text><line x1="45" x2="435" y1={190-f*155} y2={190-f*155} stroke="currentColor" strokeOpacity="0.12" /></g>)}
        {[100,300,500,700,940].map(v => <text key={v} x={45+(v-100)/840*390} y="208" textAnchor="middle" fontSize="11" fill="currentColor">{v}</text>)}
        {paths.map((d,i) => <path key={i} d={d} fill="none" stroke="var(--accent)" strokeWidth="2" />)}
        <text x="240" y="226" textAnchor="middle" fontSize="11" fill="currentColor">Vickers HV</text><text x="45" y="15" fontSize="11" fill="currentColor">{series}</text>
      </svg>
      <p className="text-xs text-muted-foreground">{L('Curves stop at the implemented domain limits. No extrapolation.', 'Eğriler uygulanan geçerlilik sınırlarında durur. Ekstrapolasyon yapılmaz.')}</p>
    </figure>
  </>;
}