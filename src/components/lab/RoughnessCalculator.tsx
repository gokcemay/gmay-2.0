import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { compareRoughness, convertRoughnessUnit, roughnessParameters, type RoughnessParameter, type RoughnessUnit } from '@/lib/roughness.logic';

export function RoughnessCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, turkish: string) => tr ? turkish : en;
  const [parameter, setParameter] = useState<RoughnessParameter>('Ra');
  const [input, setInput] = useState('0.8');
  const [unit, setUnit] = useState<RoughnessUnit>('um');
  const result = compareRoughness(parameter, input, unit);
  const label = unit === 'um' ? 'µm' : 'µin';
  const otherLabel = unit === 'um' ? 'µin' : 'µm';
  const fmt = (n: number) => n.toLocaleString(tr ? 'tr-TR' : 'en-US', { maximumSignificantDigits: 3 });
  function switchUnit(next: RoughnessUnit) {
    if (next === unit) return;
    if (result.values) setInput(String(convertRoughnessUnit(result.um, 'um', next)));
    setUnit(next);
  }
  return <div className="grid gap-8 lg:grid-cols-2">
    <section aria-label={L('Inputs', 'Girdiler')} className="grid content-start gap-5">
      <h2 className="font-display text-xl font-semibold text-foreground">{L('Measured roughness', 'Ölçülen pürüzlülük')}</h2>
      <fieldset><legend className="text-sm text-foreground">{L('Input parameter', 'Girdi parametresi')}</legend><div className="mt-2 grid grid-cols-4 gap-2">{roughnessParameters.map(p => <Button key={p} variant={parameter === p ? 'default' : 'outline'} aria-pressed={parameter === p} onClick={() => setParameter(p)}>{p}</Button>)}</div></fieldset>
      <div><label htmlFor="roughness-value" className="text-sm text-foreground">{L('Roughness value', 'Pürüzlülük değeri')} ({parameter})</label><Input id="roughness-value" inputMode="decimal" value={input} onChange={e => setInput(e.target.value)} className="mt-2" aria-invalid={Boolean(result.error)} aria-describedby="roughness-error" /><p id="roughness-error" role={result.error ? 'alert' : undefined} className="mt-2 text-sm text-destructive">{result.error === 'invalid' ? L('Enter a finite, nonnegative roughness value.', 'Sonlu ve negatif olmayan bir pürüzlülük değeri girin.') : result.error === 'overflow' ? L('This value is too large to represent safely.', 'Bu değer güvenli biçimde gösterilemeyecek kadar büyük.') : ''}</p></div>
      <fieldset><legend className="text-sm text-foreground">{L('Units', 'Birimler')}</legend><div className="mt-2 flex gap-2">{(['um','uin'] as const).map(u => <Button key={u} variant={unit === u ? 'default' : 'outline'} aria-pressed={unit === u} onClick={() => switchUnit(u)}>{u === 'um' ? 'µm' : 'µin'}</Button>)}</div></fieldset>
      <div className="border-l-2 border-accent bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground"><p className="font-semibold text-foreground">{L('Ideal-profile comparison band', 'İdeal profil karşılaştırma aralığı')}</p><p className="mt-2">{L('Rq/Ra ≈ 1.11–1.25 spans sinusoidal and Gaussian model landmarks. This is not a universal engineering range or a statistical confidence interval; real surfaces can lie outside it.', 'Rq/Ra ≈ 1,11–1,25 aralığı sinüzoidal ve Gauss modellerinin referanslarını kapsar. Evrensel bir mühendislik aralığı veya istatistiksel güven aralığı değildir; gerçek yüzeyler bu aralığın dışında kalabilir.')}</p></div>
      <Button variant="outline" className="justify-self-start" onClick={() => { setParameter('Ra'); setUnit('um'); setInput('0.8'); }}><RotateCcw />{L('Load Ra 0.8 µm example', 'Ra 0,8 µm örneğini yükle')}</Button>
    </section>
    <section aria-label={L('Approximate comparisons', 'Yaklaşık karşılaştırmalar')} aria-live="polite">
      <h2 className="font-display text-xl font-semibold text-foreground">{L('Approximate comparisons', 'Yaklaşık karşılaştırmalar')}</h2>
      {result.values ? <><p className="mt-3 text-sm text-muted-foreground">{L('Input', 'Girdi')}: <strong className="text-foreground">{parameter} = {fmt(convertRoughnessUnit(result.um, 'um', unit))} {label}</strong></p>
        {result.zero && <p role="status" className="mt-3 text-sm text-foreground">{L('Zero is mathematically accepted; real engineered surfaces normally have nonzero measured roughness. Model ratios are undefined at zero.', 'Sıfır matematiksel olarak kabul edilir; gerçek mühendislik yüzeylerinde ölçülen pürüzlülük genellikle sıfır değildir. Model oranları sıfırda tanımsızdır.')}</p>}
        <dl className="mt-4 divide-y divide-border border-y border-border">{roughnessParameters.map(p => {
          const range = result.values[p];
          const direct = p === parameter;
          return <div key={p} className="py-4"><dt className="font-display text-lg font-semibold text-foreground">{p}</dt><dd><p className="mt-1 font-mono text-lg text-foreground">{range ? `${direct ? '' : '≈ '}${fmt(convertRoughnessUnit(range[0], 'um', unit))}${direct ? '' : `–${fmt(convertRoughnessUnit(range[1], 'um', unit))}`} ${label}` : '—'}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{direct ? L('Strong relationship · direct unit conversion', 'Güçlü ilişki · doğrudan birim dönüşümü') : range ? L('Approximate relationship · ideal sine/Gaussian models, not measured bounds', 'Yaklaşık ilişki · ideal sinüs/Gauss modelleri, ölçüm sınırları değil') : L('Weak / process-dependent · no reliable approximate relationship available', 'Zayıf / proses bağımlı · güvenilir yaklaşık ilişki bulunmuyor')}</p>{direct && <p className="mt-2 text-sm text-foreground">{fmt(convertRoughnessUnit(result.um, 'um', unit === 'um' ? 'uin' : 'um'))} {otherLabel} — {L('exact unit definition: 1 µin = 0.0254 µm', 'kesin birim tanımı: 1 µin = 0,0254 µm')}</p>}</dd></div>;
        })}</dl></> : <p className="mt-4 text-sm text-muted-foreground">{L('No comparisons calculated for invalid input.', 'Geçersiz girdi için karşılaştırma hesaplanmadı.')}</p>}
    </section>
  </div>;
}