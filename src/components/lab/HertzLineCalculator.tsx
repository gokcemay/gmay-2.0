import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { buttonStyles } from '@/components/site/CTA';
import { formatSci } from '@/lib/pinOnDisc.logic';
import {
  calculateLineContact, defaultLineForm, pressureRatio, unusualPoisson, validateLineForm,
  type LineErrorCode, type LineForm,
} from '@/lib/hertzLine.logic';

const labelClass = 'block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase';
const inputClass = 'w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none';
const selectClass = 'border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none';

type Key = keyof LineForm;
type Ctx = { form: LineForm; set: (k: Key, v: string) => void; errors: ReturnType<typeof validateLineForm>; message: (c?: LineErrorCode) => string | undefined };

function Field({ ctx, k, label, unitKey, units, hint }: { ctx: Ctx; k: Key; label: string; unitKey?: Key; units?: readonly string[]; hint?: string | undefined }) {
  const { form, set, errors, message } = ctx;
  return (
    <div>
      <label htmlFor={`hl-${k}`} className={labelClass}>{label}</label>
      <div className={`mt-2 grid gap-2 ${unitKey ? 'grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
        <input id={`hl-${k}`} inputMode="decimal" value={form[k]} onChange={(e) => set(k, e.target.value)}
          aria-invalid={Boolean(errors[k])} className={inputClass} />
        {unitKey && units ? (
          <select aria-label={`${label} unit`} value={form[unitKey]} onChange={(e) => set(unitKey, e.target.value)} className={selectClass}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        ) : null}
      </div>
      {errors[k] ? <p className="mt-2 text-xs text-destructive">{message(errors[k])}</p> : null}
      {hint ? <p className="mt-2 text-xs leading-relaxed text-foreground">⚠ {hint}</p> : null}
    </div>
  );
}

function Result({ title, symbol, value, unit, equation, emphasis }: { title: string; symbol: string; value: string; unit: string; equation: string; emphasis?: boolean }) {
  return (
    <div className={`border border-border p-4 ${emphasis ? 'bg-muted/50' : 'bg-card'}`}>
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">{title}</p>
      <p className={`mt-2 font-display font-semibold break-words text-foreground ${emphasis ? 'text-2xl' : 'text-xl'}`}>
        {value} <span className="font-mono text-sm font-normal">{unit}</span>
      </p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{symbol} · {equation}</p>
    </div>
  );
}

function pressure(pa: number) {
  return pa >= 1e9 ? { v: formatSci(pa / 1e9, 4), u: 'GPa' } : { v: formatSci(pa / 1e6, 4), u: 'MPa' };
}

function PressureGraph({ label, xLabel, yLabel }: { label: string; xLabel: string; yLabel: string }) {
  const W = 360, H = 180, pad = 32;
  const pts = Array.from({ length: 81 }, (_, i) => {
    const x = -1 + (i / 80) * 2;
    return `${pad + ((x + 1) / 2) * (W - 2 * pad)},${H - pad - pressureRatio(x) * (H - 2 * pad)}`;
  }).join(' ');
  const xs = [-1, -0.5, 0, 0.5, 1];
  return (
    <figure className="border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full text-foreground">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={W / 2} y1={pad - 8} x2={W / 2} y2={H - pad} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3 3" />
        <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {xs.map((x) => (
          <text key={x} x={pad + ((x + 1) / 2) * (W - 2 * pad)} y={H - pad + 14} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.7}>{x}</text>
        ))}
        <text x={pad - 6} y={pad + 3} fontSize={10} textAnchor="end" fill="currentColor" opacity={0.7}>1</text>
        <text x={pad - 6} y={H - pad + 3} fontSize={10} textAnchor="end" fill="currentColor" opacity={0.7}>0</text>
        <text x={W / 2} y={H - 4} fontSize={10} textAnchor="middle" fill="currentColor">{xLabel}</text>
        <text x={8} y={14} fontSize={10} fill="currentColor">{yLabel}</text>
      </svg>
      <figcaption className="mt-2 font-mono text-xs text-muted-foreground">p(x) = p0 · √(1 − (x/b)²),  −b ≤ x ≤ b</figcaption>
    </figure>
  );
}

export function HertzLineCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);
  const [form, setForm] = useState<LineForm>(defaultLineForm);
  const set = (key: Key, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const errors = useMemo(() => validateLineForm(form), [form]);
  const r = useMemo(() => calculateLineContact(form), [form]);
  const unusual = unusualPoisson(form);
  const message = (code?: LineErrorCode) => code && {
    invalid: L('Enter a valid finite number.', 'Geçerli, sonlu bir sayı girin.'),
    positive: L('Value must be greater than zero.', 'Değer sıfırdan büyük olmalıdır.'),
    poisson: L('Poisson ratio must satisfy −1 < ν < 0.5.', 'Poisson oranı −1 < ν < 0.5 aralığında olmalıdır.'),
  }[code];
  const warn = (k: 'nu1' | 'nu2') => unusual.includes(k)
    ? L('Mathematically valid, but unusual for ordinary engineering materials. Check the value.', 'Matematiksel olarak geçerli, ancak sıradan mühendislik malzemeleri için alışılmadık. Değeri kontrol edin.')
    : undefined;
  const ctx: Ctx = { form, set, errors, message };
  const lengths = ['mm', 'cm', 'm'] as const;
  const cc = form.geometry === 'cylinder-cylinder';

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="grid content-start gap-6 border border-border bg-card p-5 md:p-6" aria-label={L('Inputs', 'Girdiler')}>
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Inputs', 'Girdiler')}</h2>
        <fieldset>
          <legend className={labelClass}>{L('Geometry', 'Geometri')}</legend>
          <div className="mt-2 grid grid-cols-1 border border-border sm:grid-cols-2">
            {([['cylinder-flat', L('Cylinder – Flat', 'Silindir – Düzlem')], ['cylinder-cylinder', L('Cylinder – Cylinder', 'Silindir – Silindir')]] as const).map(([v, label]) => (
              <button key={v} type="button" aria-pressed={form.geometry === v} onClick={() => set('geometry', v)}
                className={`px-3 py-2 text-sm transition-colors ${form.geometry === v ? 'bg-accent text-accent-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 border-t border-border pt-5">
          <h3 className="font-display text-base font-semibold text-foreground">{L('Geometry and load', 'Geometri ve yük')}</h3>
          <Field ctx={ctx} k="r1" label={cc ? L('Cylinder radius, R1', 'Silindir yarıçapı, R1') : L('Cylinder radius, R', 'Silindir yarıçapı, R')} unitKey="radiusUnit" units={lengths} />
          {cc ? <Field ctx={ctx} k="r2" label={L('Cylinder radius, R2', 'Silindir yarıçapı, R2')} unitKey="radiusUnit" units={lengths} /> : null}
          <Field ctx={ctx} k="length" label={L('Contact length, L', 'Temas uzunluğu, L')} unitKey="lengthUnit" units={lengths} />
          <Field ctx={ctx} k="load" label={L('Total normal load, F', 'Toplam normal yük, F')} unitKey="loadUnit" units={['N', 'kN']} />
        </div>

        <div className="grid gap-5 border-t border-border pt-5">
          <h3 className="font-display text-base font-semibold text-foreground">{L('Materials', 'Malzemeler')}</h3>
          <div>
            <label htmlFor="hl-modulusUnit" className={labelClass}>{L('Modulus unit', 'Modül birimi')}</label>
            <select id="hl-modulusUnit" value={form.modulusUnit} onChange={(e) => set('modulusUnit', e.target.value)} className={`mt-2 ${selectClass}`}>
              <option value="GPa">GPa</option><option value="MPa">MPa</option>
            </select>
          </div>
          <Field ctx={ctx} k="e1" label={L("Body 1 Young's modulus, E1", 'Cisim 1 elastisite modülü, E1')} />
          <Field ctx={ctx} k="nu1" label={L('Body 1 Poisson ratio, ν1', 'Cisim 1 Poisson oranı, ν1')} hint={warn('nu1')} />
          <Field ctx={ctx} k="e2" label={L(cc ? "Body 2 Young's modulus, E2" : "Flat Young's modulus, E2", cc ? 'Cisim 2 elastisite modülü, E2' : 'Düzlem elastisite modülü, E2')} />
          <Field ctx={ctx} k="nu2" label={L(cc ? 'Body 2 Poisson ratio, ν2' : 'Flat Poisson ratio, ν2', cc ? 'Cisim 2 Poisson oranı, ν2' : 'Düzlem Poisson oranı, ν2')} hint={warn('nu2')} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonStyles.secondary} onClick={() => setForm(defaultLineForm)}>
            {L('Load worked example', 'Çözümlü örneği yükle')}
          </button>
        </div>
      </section>

      <section aria-label={L('Results', 'Sonuçlar')} aria-live="polite" className="grid content-start gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Results', 'Sonuçlar')}</h2>
        {r ? <>
          <Result emphasis title={L('Maximum Hertz pressure', 'Maksimum Hertz temas basıncı')} symbol="p0" {...(() => { const p = pressure(r.p0); return { value: p.v, unit: p.u }; })()} equation="p0 = 2F / (π b L) = 2w / (π b)" />
          <Result title={L('Mean contact pressure', 'Ortalama temas basıncı')} symbol="p_mean" {...(() => { const p = pressure(r.pMean); return { value: p.v, unit: p.u }; })()} equation="p_mean = F / (2bL) = π p0 / 4" />
          <Result title={L('Contact half-width', 'Temas yarı genişliği')} symbol="b" value={formatSci(r.b * 1e3, 4)} unit="mm" equation="b = √(4 F R' / (π L E*))" />
          <Result title={L('Full contact width', 'Toplam temas genişliği')} symbol="2b" value={formatSci(r.width * 1e3, 4)} unit="mm" equation="2b" />
          <Result title={L('Effective radius', 'Eşdeğer yarıçap')} symbol="R'" value={formatSci(r.R * 1e3, 4)} unit="mm" equation={cc ? "1/R' = 1/R1 + 1/R2" : "R' = R (R2 → ∞)"} />
          <Result title={L('Effective elastic modulus', 'Eşdeğer elastisite modülü')} symbol="E*" value={formatSci(r.Estar / 1e9, 5)} unit="GPa" equation="1/E* = (1−ν1²)/E1 + (1−ν2²)/E2" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Result title={L('Total normal load', 'Toplam normal yük')} symbol="F" value={formatSci(r.F, 4)} unit="N" equation={L('entered', 'girilen değer')} />
            <Result title={L('Line load', 'Çizgisel yük')} symbol="w" value={formatSci(r.w / 1e3, 4)} unit="N/mm" equation="w = F / L" />
            <Result title={L('Contact length', 'Temas uzunluğu')} symbol="L" value={formatSci(r.L * 1e3, 4)} unit="mm" equation={L('entered', 'girilen değer')} />
          </div>
          <div className="border border-border bg-card p-4">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">{L('Subsurface shear (classical line contact)', 'Yüzey altı kayma gerilmesi (klasik çizgisel temas)')}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              τ_max ≈ 0.30 p0 = <strong>{pressure(r.tauMax).v} {pressure(r.tauMax).u}</strong> {L('at depth', 'derinlikte')} z ≈ 0.786 b = <strong>{formatSci(r.zTau * 1e3, 3)} mm</strong>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {L('Maximum principal shear stress (τ1) below the centerline for frictionless plane-strain Hertz contact. It is a distinct quantity from the surface pressure p0.', 'Sürtünmesiz, düzlem şekil değiştirme Hertz temasında merkez çizgisi altındaki maksimum asal kayma gerilmesi (τ1). Yüzey basıncı p0 ile aynı büyüklük değildir.')}
            </p>
          </div>
          <PressureGraph label={L('Normalised Hertz line-contact pressure distribution', 'Normalize Hertz çizgisel temas basınç dağılımı')} xLabel="x / b" yLabel="p / p0" />
          <p className="border-l-2 border-accent bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            {L('Classical elastic Hertz screening values for the entered inputs. They are not a bearing or gear rating, a design allowable or an engineering recommendation.', 'Girilen değerler için klasik elastik Hertz ön değerlendirme sonuçlarıdır. Rulman veya dişli değerlendirmesi, tasarım sınırı ya da mühendislik önerisi değildir.')}
          </p>
        </> : (
          <div className="border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
            {L('Correct the highlighted inputs to see results.', 'Sonuçları görmek için işaretli girdileri düzeltin.')}
          </div>
        )}
      </section>
    </div>
  );
}
