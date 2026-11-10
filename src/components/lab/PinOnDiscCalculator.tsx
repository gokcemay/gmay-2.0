import { useMemo, useState, type ReactNode } from 'react';
import { useLanguage } from '@/lib/i18n';
import { buttonStyles } from '@/components/site/CTA';
import {
  calculatePinOnDisc, defaultPodForm, formatSci, validatePodForm,
  type PodErrorCode, type PodForm,
} from '@/lib/pinOnDisc.logic';

const labelClass = 'block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase';
const inputClass = 'w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none';
const selectClass = 'border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none';

type Key = keyof PodForm;

type Ctx = { form: PodForm; set: (k: Key, v: string) => void; errors: ReturnType<typeof validatePodForm>; message: (c?: PodErrorCode) => string | undefined };

function Field({ctx,  k, label, unitKey, units, hint }: {ctx: Ctx;  k: Key; label: string; unitKey?: Key; units?: readonly string[]; hint?: string }) {
  const { form, set, errors, message } = ctx;
  return (
    <div>
      <label htmlFor={`pod-${k}`} className={labelClass}>{label}</label>
      <div className={`mt-2 grid gap-2 ${unitKey ? 'grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
        <input id={`pod-${k}`} inputMode="decimal" value={form[k]} onChange={(e) => set(k, e.target.value)}
          aria-invalid={Boolean(errors[k])} className={inputClass} />
        {unitKey && units ? (
          <select aria-label={`${label} unit`} value={form[unitKey]} onChange={(e) => set(unitKey, e.target.value)} className={selectClass}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        ) : null}
      </div>
      {errors[k] ? <p className="mt-2 text-xs text-destructive">{message(errors[k])}</p> : null}
      {hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Toggle({ctx,  k, legend, options }: {ctx: Ctx;  k: Key; legend: string; options: [string, string][] }) {
  const { form, set } = ctx;
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-2 grid grid-cols-1 border border-border sm:grid-cols-2">
        {options.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={form[k] === value} onClick={() => set(k, value)}
            className={`px-3 py-2 text-sm transition-colors ${form[k] === value ? 'bg-accent text-accent-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}>
            {label}
          </button>
        ))}
      </div>
    </fieldset>
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

export function PinOnDiscCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);
  const [form, setForm] = useState<PodForm>(defaultPodForm);
  const set = (key: Key, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const errors = useMemo(() => validatePodForm(form), [form]);
  const results = useMemo(() => calculatePinOnDisc(form), [form]);

  const message = (code?: PodErrorCode) => {
    if (!code) return undefined;
    return {
      invalid: L('Enter a valid number.', 'Geçerli bir sayı girin.'),
      positive: L('Value must be greater than zero.', 'Değer sıfırdan büyük olmalıdır.'),
      nonNegative: L('Value cannot be negative.', 'Değer negatif olamaz.'),
      finalExceedsInitial: L('Final mass must be smaller than initial mass. Use direct mass loss for other cases.', 'Son kütle ilk kütleden küçük olmalıdır. Diğer durumlar için doğrudan kütle kaybını kullanın.'),
    }[code];
  };




  const ctx: Ctx = { form, set, errors, message };

  const group = (title: string, children: ReactNode) => (
    <div className="grid gap-5 border-t border-border pt-5">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="grid content-start gap-6 border border-border bg-card p-5 md:p-6" aria-label={L('Inputs', 'Girdiler')}>
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Inputs', 'Girdiler')}</h2>
        <Toggle ctx={ctx} k="mode" legend={L('Calculation mode', 'Hesaplama yöntemi')} options={[
          ['mass', L('A — Mass loss', 'A — Kütle kaybı')],
          ['volume', L('B — Known wear volume', 'B — Bilinen aşınma hacmi')],
        ]} />

        {form.mode === 'mass'
          ? group(L('Mass loss', 'Kütle kaybı'), <>
              <Toggle ctx={ctx} k="massEntry" legend={L('Mass input', 'Kütle girişi')} options={[
                ['difference', L('Initial and final mass', 'İlk ve son kütle')],
                ['direct', L('Direct mass loss', 'Doğrudan kütle kaybı')],
              ]} />
              <div>
                <label htmlFor="pod-massUnit" className={labelClass}>{L('Mass unit', 'Kütle birimi')}</label>
                <select id="pod-massUnit" value={form.massUnit} onChange={(e) => set('massUnit', e.target.value)} className={`mt-2 ${selectClass}`}>
                  <option value="mg">mg</option><option value="g">g</option>
                </select>
              </div>
              {form.massEntry === 'difference' ? <>
                <Field ctx={ctx} k="massInitial" label={L('Initial mass, m_initial', 'İlk kütle, m_ilk')} />
                <Field ctx={ctx} k="massFinal" label={L('Final mass, m_final', 'Son kütle, m_son')} />
              </> : <Field ctx={ctx} k="massLoss" label={L('Mass loss, Δm', 'Kütle kaybı, Δm')} />}
              <Field ctx={ctx} k="density" label={L('Specimen density, ρ', 'Numune yoğunluğu, ρ')} unitKey="densityUnit" units={['g/cm³', 'kg/m³']} />
            </>)
          : group(L('Wear volume', 'Aşınma hacmi'), <Field ctx={ctx} k="volume" label={L('Wear volume, V', 'Aşınma hacmi, V')} unitKey="volumeUnit" units={['mm³', 'cm³']} />)}

        {group(L('Load', 'Yük'), <Field ctx={ctx} k="load" label={L('Normal load, F (N)', 'Normal yük, F (N)')} />)}

        {group(L('Sliding distance', 'Kayma mesafesi'), <>
          <Toggle ctx={ctx} k="distanceEntry" legend={L('Distance input', 'Mesafe girişi')} options={[
            ['rotary', L('From radius, rpm and duration', 'Yarıçap, devir ve süreden')],
            ['direct', L('Enter directly', 'Doğrudan gir')],
          ]} />
          {form.distanceEntry === 'direct'
            ? <Field ctx={ctx} k="distance" label={L('Sliding distance, s', 'Kayma mesafesi, s')} unitKey="distanceUnit" units={['m', 'km']} />
            : <>
                <Field ctx={ctx} k="radius" label={L('Wear-track radius, r', 'Aşınma izi yarıçapı, r')} unitKey="radiusUnit" units={['mm', 'cm']} />
                <Field ctx={ctx} k="rpm" label={L('Rotational speed (rpm)', 'Dönme hızı (dev/dak)')} />
                <Field ctx={ctx} k="duration" label={L('Test duration, t', 'Deney süresi, t')} unitKey="durationUnit" units={['s', 'min', 'h']} />
              </>}
        </>)}

        {group(L('Friction (optional)', 'Sürtünme (isteğe bağlı)'), (
          <Field ctx={ctx} k="frictionForce" label={L('Measured friction force, Ft (N)', 'Ölçülen sürtünme kuvveti, Ft (N)')}
            hint={L('Leave blank to skip. Uses the normal load above as Fn.', 'Atlamak için boş bırakın. Fn olarak yukarıdaki normal yük kullanılır.')} />
        ))}

        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonStyles.secondary} onClick={() => setForm(defaultPodForm)}>
            {L('Load example values', 'Örnek değerleri yükle')}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {L('Example values are illustrative inputs for checking the arithmetic, not experimental data.', 'Örnek değerler aritmetiği kontrol etmek için verilmiş girdilerdir; deneysel veri değildir.')}
        </p>
      </section>

      <section aria-label={L('Results', 'Sonuçlar')} aria-live="polite" className="grid content-start gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Results', 'Sonuçlar')}</h2>
        {results ? <>
          <Result emphasis title={L('Specific wear rate', 'Özgül aşınma oranı')} symbol="k_s" value={formatSci(results.ks * 1e9)} unit="mm³/(N·m)" equation="k_s = V / (F · s)" />
          <Result title={L('Volumetric wear per sliding distance', 'Kayma mesafesi başına hacimsel aşınma')} symbol="q_v" value={formatSci(results.qv * 1e9)} unit="mm³/m" equation="q_v = V / s" />
          <Result title={L('Wear volume', 'Aşınma hacmi')} symbol="V" value={formatSci(results.V * 1e9)} unit="mm³"
            equation={results.dm !== undefined ? 'V = Δm / ρ' : L('entered', 'girilen değer')} />
          {results.dm !== undefined ? <Result title={L('Mass loss', 'Kütle kaybı')} symbol="Δm" value={formatSci(results.dm * 1e6)} unit="mg"
            equation={form.massEntry === 'difference' ? 'Δm = m_initial − m_final' : L('entered', 'girilen değer')} /> : null}
          <Result title={L('Sliding distance', 'Kayma mesafesi')} symbol="s" value={formatSci(results.s)} unit="m"
            equation={results.revolutions !== undefined ? `s = 2πrN, N = ${formatSci(results.revolutions)} ${L('rev', 'devir')}` : L('entered', 'girilen değer')} />
          {results.mu !== undefined ? <Result title={L('Coefficient of friction', 'Sürtünme katsayısı')} symbol="μ" value={formatSci(results.mu)} unit="—" equation="μ = Ft / Fn" /> : null}
          <p className="border-l-2 border-accent bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            {L('These are calculated values for the supplied test conditions. They are not a material constant, a compliance result or an engineering recommendation.', 'Bunlar girilen deney koşulları için hesaplanmış değerlerdir. Malzeme sabiti, uygunluk sonucu veya mühendislik önerisi değildir.')}
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
