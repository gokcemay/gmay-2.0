import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { calculateFriction, convertForce, defaultFrictionForm, parseMagnitude, type ForceUnit, type FrictionForm, type FrictionMode } from '@/lib/friction.logic';

export function FrictionCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, turkish: string) => tr ? turkish : en;
  const [form, setForm] = useState<FrictionForm>({ ...defaultFrictionForm });
  const { result, error } = calculateFriction(form);
  const update = <K extends keyof FrictionForm>(key: K, value: FrictionForm[K]) => setForm(old => ({ ...old, [key]: value }));
  const fmt = (n: number) => n.toLocaleString(tr ? 'tr-TR' : 'en-US', { maximumSignificantDigits: 4 });
  const modes: [FrictionMode, string][] = [['coefficient', L('Coefficient μ', 'Katsayı μ')], ['force', L('Friction force', 'Sürtünme kuvveti')], ['normal', L('Normal load', 'Normal yük')], ['angle', L('Friction angle', 'Sürtünme açısı')], ['incline', L('Incline · static', 'Eğik düzlem · statik')]];
  const errors = {
    invalid: L('Enter finite, nonnegative numeric magnitudes in the active fields.', 'Aktif alanlara sonlu, negatif olmayan sayısal büyüklükler girin.'),
    normalZero: L('Normal load must be greater than zero when dividing.', 'Bölen olarak kullanılan normal yük sıfırdan büyük olmalıdır.'),
    muZero: L('Coefficient must be greater than zero to calculate normal load.', 'Normal yükü hesaplamak için katsayı sıfırdan büyük olmalıdır.'),
    angleRange: L('Enter an angle from 0° to less than 90°.', '0° ile 90° arasında, 90° hariç bir açı girin.'),
    overflow: L('The result is too large to represent safely.', 'Sonuç güvenli biçimde gösterilemeyecek kadar büyük.'),
  };
  function switchForceUnit(field: 'ft' | 'fn', next: ForceUnit) {
    const key = field === 'ft' ? 'ftUnit' : 'fnUnit';
    const value = parseMagnitude(form[field]);
    setForm(old => ({ ...old, [key]: next, [field]: Number.isFinite(value) ? String(convertForce(value, old[key], next)) : old[field] }));
  }
  const forceField = (field: 'ft' | 'fn', label: string) => {
    const key = field === 'ft' ? 'ftUnit' : 'fnUnit';
    return <div><label htmlFor={`friction-${field}`} className="text-sm text-foreground">{label} ({field === 'ft' ? 'Ft' : 'Fn'})</label><div className="mt-2 grid grid-cols-[minmax(0,1fr)_5rem] gap-2"><Input id={`friction-${field}`} inputMode="decimal" value={form[field]} onChange={e => update(field, e.target.value)} aria-describedby="friction-error" aria-invalid={Boolean(error)} /><select aria-label={`${label} — ${L('unit', 'birim')}`} value={form[key]} onChange={e => switchForceUnit(field, e.target.value as ForceUnit)} className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground">{(['N', 'kN', 'lbf'] as const).map(u => <option key={u}>{u}</option>)}</select></div></div>;
  };
  return <div className="grid gap-8 lg:grid-cols-2">
    <section aria-label={L('Inputs', 'Girdiler')} className="grid content-start gap-5">
      <h2 className="font-display text-xl font-semibold text-foreground">{L('Calculation', 'Hesaplama')}</h2>
      <fieldset><legend className="text-sm text-foreground">{L('Calculate', 'Hesaplanacak büyüklük')}</legend><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{modes.map(([mode, label]) => <Button key={mode} variant={form.mode === mode ? 'default' : 'outline'} aria-pressed={form.mode === mode} onClick={() => update('mode', mode)} className="h-auto min-h-10 whitespace-normal py-2">{label}</Button>)}</div></fieldset>
      {(form.mode === 'coefficient' || form.mode === 'normal') && forceField('ft', L('Friction force', 'Sürtünme kuvveti'))}
      {(form.mode === 'coefficient' || form.mode === 'force') && forceField('fn', L('Normal load', 'Normal yük'))}
      {form.mode === 'angle' && <fieldset><legend className="text-sm text-foreground">{L('Known quantity', 'Bilinen büyüklük')}</legend><div className="mt-2 flex flex-wrap gap-2"><Button variant={form.angleInput === 'mu' ? 'default' : 'outline'} aria-pressed={form.angleInput === 'mu'} onClick={() => update('angleInput', 'mu')}>μ → φ</Button><Button variant={form.angleInput === 'degrees' ? 'default' : 'outline'} aria-pressed={form.angleInput === 'degrees'} onClick={() => update('angleInput', 'degrees')}>φ → μ</Button></div></fieldset>}
      {(form.mode === 'force' || form.mode === 'normal' || (form.mode === 'angle' && form.angleInput === 'mu')) && <div><label htmlFor="friction-mu" className="text-sm text-foreground">{L('Coefficient of friction μ (dimensionless)', 'Sürtünme katsayısı μ (boyutsuz)')}</label><Input id="friction-mu" className="mt-2" inputMode="decimal" value={form.mu} onChange={e => update('mu', e.target.value)} aria-describedby="friction-error" aria-invalid={Boolean(error)} /></div>}
      {(form.mode === 'incline' || (form.mode === 'angle' && form.angleInput === 'degrees')) && <div><label htmlFor="friction-angle" className="text-sm text-foreground">{form.mode === 'incline' ? L('Inclination at impending sliding θ (°)', 'Kayma başlangıcındaki eğim θ (°)') : L('Friction angle φ (°)', 'Sürtünme açısı φ (°)')}</label><Input id="friction-angle" className="mt-2" inputMode="decimal" value={form.angle} onChange={e => update('angle', e.target.value)} aria-describedby="friction-error" aria-invalid={Boolean(error)} /></div>}
      <p id="friction-error" role={error ? 'alert' : undefined} className="text-sm text-destructive">{error ? errors[error] : ''}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{L('Nonnegative magnitudes only; signed-force analysis is not supported. Forces are converted to N internally. μ may exceed 1; it is not a percentage.', 'Yalnızca negatif olmayan büyüklükler kullanılır; işaretli kuvvet analizi desteklenmez. Kuvvetler hesaplamada N birimine dönüştürülür. μ, 1’i aşabilir; yüzde değildir.')}</p>
      {form.mode === 'incline' && <aside className="border-l-2 border-accent bg-muted/50 p-4 text-sm leading-relaxed text-foreground">{L('Static estimate only: dry block at impending sliding, gravity as the only driving force, no other applied forces, no rolling or tipping. Not a kinetic-friction estimate.', 'Yalnızca statik tahmin: kayma eşiğindeki kuru blok, sürücü olarak yalnızca yerçekimi, başka dış kuvvet yok, yuvarlanma veya devrilme yok. Kinetik sürtünme tahmini değildir.')}</aside>}
      <Button variant="outline" className="justify-self-start" onClick={() => setForm({ ...defaultFrictionForm })}><RotateCcw />{L('Reset example', 'Örneği sıfırla')}</Button>
    </section>
    <section aria-label={L('Results', 'Sonuçlar')} aria-live="polite">
      <h2 className="font-display text-xl font-semibold text-foreground">{L('Results', 'Sonuçlar')}</h2>
      {result ? <><p className="mt-3 font-mono text-sm text-muted-foreground">{result.equation}</p><dl className="mt-4 divide-y divide-border border-y border-border">
        <div className="py-4"><dt className="text-sm text-muted-foreground">{form.mode === 'incline' ? L('Static coefficient μ_s', 'Statik katsayı μ_s') : L('Coefficient of friction μ', 'Sürtünme katsayısı μ')}</dt><dd data-testid="friction-result-mu" className="mt-2 font-mono text-3xl text-foreground">{fmt(result.mu)}</dd><dd className="mt-2 text-xs text-muted-foreground">{L('Dimensionless', 'Boyutsuz')} · {result.equation}</dd></div>
        {result.ft !== undefined && <div className="py-4"><dt className="text-sm text-muted-foreground">{L('Friction force Ft', 'Sürtünme kuvveti Ft')}</dt><dd data-testid="friction-result-ft" className="mt-1 font-mono text-xl text-foreground">{fmt(convertForce(result.ft, 'N', form.ftUnit))} {form.ftUnit}</dd><dd className="mt-2 text-xs text-muted-foreground">Ft = μ · Fn</dd></div>}
        {result.fn !== undefined && <div className="py-4"><dt className="text-sm text-muted-foreground">{L('Normal load Fn', 'Normal yük Fn')}</dt><dd data-testid="friction-result-fn" className="mt-1 font-mono text-xl text-foreground">{fmt(convertForce(result.fn, 'N', form.fnUnit))} {form.fnUnit}</dd><dd className="mt-2 text-xs text-muted-foreground">{result.mu === 0 ? L('Given normal load; inverse equation is undefined at μ = 0.', 'Girilen normal yük; μ = 0 için ters denklem tanımsızdır.') : 'Fn = Ft / μ'}</dd></div>}
        <div className="py-4"><dt className="text-sm text-muted-foreground">{form.mode === 'incline' ? L('Threshold inclination θ', 'Eşik eğimi θ') : L('Friction angle φ', 'Sürtünme açısı φ')}</dt><dd data-testid="friction-result-angle" className="mt-1 font-mono text-xl text-foreground">{fmt(result.angle)}°</dd><dd className="mt-2 text-xs text-muted-foreground">{form.mode === 'incline' ? 'θ = arctan μ_s' : 'φ = arctan μ'}</dd></div>
      </dl><p className="mt-3 text-xs text-muted-foreground">{L('Four significant digits; rounding is not measurement accuracy. Angle equivalence does not determine whether the supplied coefficient is static or kinetic.', 'Dört anlamlı basamak; yuvarlama ölçüm doğruluğu değildir. Açı eşdeğerliği, girilen katsayının statik veya kinetik olduğunu belirlemez.')}</p></> : <p className="mt-4 text-sm text-muted-foreground">{L('No results calculated for invalid input.', 'Geçersiz girdi için sonuç hesaplanmadı.')}</p>}
      <figure className="mt-8"><svg viewBox="0 0 440 220" role="img" aria-label={L('Block on horizontal surface: upward normal force, leftward friction, rightward applied motion', 'Yatay yüzeyde blok: yukarı normal kuvvet, sola sürtünme, sağa uygulanan hareket')} className="w-full text-foreground">
        <path d="M30 170H410" stroke="currentColor" strokeWidth="2"/><rect x="160" y="100" width="120" height="70" fill="var(--muted)" stroke="currentColor"/>
        <path d="M220 135V40M214 50L220 40L226 50" fill="none" stroke="var(--accent)" strokeWidth="2"/><text x="235" y="55" fill="currentColor" fontSize="16">N</text>
        <path d="M160 140H60M70 134L60 140L70 146" fill="none" stroke="var(--accent)" strokeWidth="2"/><text x="85" y="125" fill="currentColor" fontSize="16">F</text>
        <path d="M290 105H395M385 99L395 105L385 111" fill="none" stroke="currentColor" strokeWidth="2"/><text x="320" y="85" fill="currentColor" fontSize="13">{L('Motion', 'Hareket')}</text>
        <text x="30" y="205" fill="currentColor" fontSize="13">{L('Illustrative · not to scale', 'Açıklayıcı · ölçekli değil')}</text>
      </svg><figcaption className="text-xs text-muted-foreground">{L('Friction opposes sliding or impending relative sliding. This schematic shows directions, not a complete free-body diagram.', 'Sürtünme, göreli kaymaya veya kayma eğilimine karşı koyar. Şema yönleri gösterir; tam bir serbest cisim diyagramı değildir.')}</figcaption></figure>
    </section>
  </div>;
}