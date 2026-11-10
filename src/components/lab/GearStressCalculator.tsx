import { useMemo, useState, type ReactNode } from 'react';
import { useLanguage } from '@/lib/i18n';
import { buttonStyles } from '@/components/site/CTA';
import { formatSci } from '@/lib/pinOnDisc.logic';
import {
  calculateGear, defaultGearForm, degToRad, gearWarnings, parseNumber, undercutLimit, validateGearForm,
  type GearErrorCode, type GearForm, type GearWarning,
} from '@/lib/gearStress.logic';

const labelClass = 'block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase';
const inputClass = 'w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none';
const selectClass = 'border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none';

type Key = keyof GearForm;
type Ctx = { form: GearForm; set: (k: Key, v: string) => void; errors: ReturnType<typeof validateGearForm>; message: (c?: GearErrorCode) => string | undefined };

function Field({ ctx, k, label, unitKey, units, unit, hint, text }: { ctx: Ctx; k: Key; label: string; unitKey?: Key; units?: readonly string[]; unit?: string; hint?: string | undefined; text?: boolean }) {
  const { form, set, errors, message } = ctx;
  const suffix = unitKey && units;
  return (
    <div>
      <label htmlFor={`gs-${k}`} className={labelClass}>{label}{unit ? ` (${unit})` : ''}</label>
      <div className={`mt-2 grid gap-2 ${suffix ? 'grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
        <input id={`gs-${k}`} inputMode={text ? 'text' : 'decimal'} value={form[k]} onChange={(e) => set(k, e.target.value)}
          aria-invalid={Boolean(errors[k])} className={inputClass} />
        {suffix ? (
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

const f = (v: number, d = 4) => formatSci(v, d);

/** Schematic only: circles are pitch circles, not tooth profiles. */
function GearSchematic({ z1, z2, alphaDeg, labels }: { z1: number; z2: number; alphaDeg: number; labels: Record<string, string> }) {
  const W = 420, H = 260;
  const total = 300;
  const r1 = (total * z1) / (z1 + z2) / 2, r2 = (total * z2) / (z1 + z2) / 2;
  const cx1 = 60 + r1, cx2 = cx1 + r1 + r2, cy = 140, px = cx1 + r1;
  const a = degToRad(alphaDeg);
  const L = 70;
  // Line of action through pitch point, tilted by α from the common tangent (vertical).
  const dx = Math.sin(a) * L, dy = Math.cos(a) * L;
  return (
    <figure className="border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={labels.aria} className="w-full text-foreground">
        <defs>
          <marker id="gs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <circle cx={cx1} cy={cy} r={r1} fill="none" stroke="currentColor" strokeOpacity={0.6} />
        <circle cx={cx2} cy={cy} r={r2} fill="none" stroke="currentColor" strokeOpacity={0.6} />
        <circle cx={cx1} cy={cy} r={2.5} fill="currentColor" />
        <circle cx={cx2} cy={cy} r={2.5} fill="currentColor" />
        <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="3 3" />
        <line x1={px} y1={cy - 90} x2={px} y2={cy + 90} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="3 3" />
        <line x1={px - dx * 1.4} y1={cy - dy * 1.4} x2={px + dx * 1.4} y2={cy + dy * 1.4} stroke="currentColor" strokeWidth={1.2} />
        <line x1={px} y1={cy} x2={px} y2={cy - 60} stroke="var(--accent)" strokeWidth={2} markerEnd="url(#gs-arrow)" />
        <line x1={px} y1={cy} x2={px - 45} y2={cy} stroke="var(--accent)" strokeWidth={2} markerEnd="url(#gs-arrow)" />
        <line x1={px} y1={cy} x2={px - dx} y2={cy - dy} stroke="var(--accent)" strokeWidth={2.5} markerEnd="url(#gs-arrow)" />
        <text x={px + 6} y={cy - 56} fontSize={11} fill="currentColor">Ft</text>
        <text x={px - 46} y={cy - 6} fontSize={11} fill="currentColor">Fr</text>
        <text x={px - dx - 18} y={cy - dy - 4} fontSize={11} fill="currentColor">Fn</text>
        <text x={px + 8} y={cy - 20} fontSize={11} fill="currentColor">α = {alphaDeg}°</text>
        <text x={px + dx * 1.4 + 4} y={cy + dy * 1.4} fontSize={10} fill="currentColor" opacity={0.75}>{labels.loa}</text>
        <text x={cx1} y={cy + r1 + 16} fontSize={11} textAnchor="middle" fill="currentColor">{labels.pinion} (z1 = {z1})</text>
        <text x={cx2} y={Math.min(cy + r2 + 16, H - 4)} fontSize={11} textAnchor="middle" fill="currentColor">{labels.gear} (z2 = {z2})</text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">{labels.caption}</figcaption>
    </figure>
  );
}

export function GearStressCalculator() {
  const tr = useLanguage() === 'tr';
  const L = (en: string, trText: string) => (tr ? trText : en);
  const [form, setForm] = useState<GearForm>(defaultGearForm);
  const set = (key: Key, value: string) => setForm((s) => ({ ...s, [key]: value }));
  const errors = useMemo(() => validateGearForm(form), [form]);
  const r = useMemo(() => calculateGear(form), [form]);
  const warnings = gearWarnings(form);
  const alphaNum = parseNumber(form.alpha);
  const lim = alphaNum > 0 && alphaNum < 45 ? undercutLimit(degToRad(alphaNum)) : NaN;

  const message = (code?: GearErrorCode) => code && {
    invalid: L('Enter a valid finite number.', 'Geçerli, sonlu bir sayı girin.'),
    positive: L('Value must be greater than zero.', 'Değer sıfırdan büyük olmalıdır.'),
    nonNegative: L('Value cannot be negative.', 'Değer negatif olamaz.'),
    teeth: L('Tooth count must be at least 5.', 'Diş sayısı en az 5 olmalıdır.'),
    integer: L('Tooth count must be a whole number.', 'Diş sayısı tam sayı olmalıdır.'),
    poisson: L('Poisson ratio must satisfy −1 < ν < 0.5.', 'Poisson oranı −1 < ν < 0.5 aralığında olmalıdır.'),
    alpha: L('Pressure angle must be between 0° and 45°.', 'Basınç açısı 0° ile 45° arasında olmalıdır.'),
    yRange: L('Form factor must be between 0 and 1.', 'Form faktörü 0 ile 1 arasında olmalıdır.'),
    yRequired: L('No tabulated Y for this tooth count (table covers 12–400). Enter Y manually.', 'Bu diş sayısı için tablo değeri yok (tablo 12–400 dişi kapsar). Y değerini elle girin.'),
  }[code];

  const warnText: Record<GearWarning, string> = {
    lowTeeth: L('Very low tooth count: Lewis and pitch-point assumptions become less representative.', 'Çok düşük diş sayısı: Lewis ve bölüm noktası varsayımları daha az temsil edici hale gelir.'),
    undercut1: L(`Pinion tooth count is below the theoretical undercut limit z_min = 2/sin²α ≈ ${f(lim, 3)} (standard rack generation, addendum 1·m, no profile shift). Undercut weakens the root but is not automatically unacceptable; profile shift is often used to avoid it.`, `Pinyon diş sayısı teorik alttan kesilme sınırının altında: z_min = 2/sin²α ≈ ${f(lim, 3)} (standart kremayer ile üretim, diş başı 1·m, profil kaydırmasız). Alttan kesilme diş dibini zayıflatır ancak her durumda kabul edilemez değildir; genellikle profil kaydırma ile önlenir.`),
    undercut2: L('Gear tooth count is also below the theoretical undercut limit.', 'Çark diş sayısı da teorik alttan kesilme sınırının altında.'),
    alpha: L('Unusual pressure angle. Common standard spur gears use 20° (also 14.5° or 25°). The Lewis Y table applies only to 20° full-depth teeth — enter Y manually for other angles.', 'Alışılmadık basınç açısı. Standart düz dişlilerde yaygın değer 20°’dir (ayrıca 14,5° veya 25°). Lewis Y tablosu yalnızca 20° tam diş boyu için geçerlidir — diğer açılarda Y değerini elle girin.'),
    faceSmall: L('Face width is very small relative to module (b/m < 3).', 'Diş genişliği modüle göre çok küçük (b/m < 3).'),
    faceLarge: L('Face width is very large relative to module (b/m > 25); uniform load distribution across the face becomes unlikely.', 'Diş genişliği modüle göre çok büyük (b/m > 25); yükün genişlik boyunca düzgün dağılması olası değildir.'),
    ratio: L('z2 < z1: check whether pinion and gear labels were swapped. Torque input is taken as pinion torque.', 'z2 < z1: pinyon ve çark etiketlerinin yer değiştirip değiştirmediğini kontrol edin. Tork girdisi pinyon torku olarak alınır.'),
    poisson: L('A Poisson ratio is mathematically valid but unusual for ordinary engineering materials.', 'Poisson oranlarından biri matematiksel olarak geçerli ancak sıradan mühendislik malzemeleri için alışılmadık.'),
  };

  const ctx: Ctx = { form, set, errors, message };
  const group = (title: string, children: ReactNode) => (
    <div className="grid gap-5 border-t border-border pt-5">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
  const m1 = form.label1.trim() || L('Pinion', 'Pinyon');
  const m2 = form.label2.trim() || L('Gear', 'Çark');
  const ySrc = (s: 'table' | 'manual') => (s === 'table' ? L('table, interpolated', 'tablo, enterpolasyon') : L('entered', 'girilen değer'));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="grid content-start gap-6 border border-border bg-card p-5 md:p-6" aria-label={L('Inputs', 'Girdiler')}>
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Inputs', 'Girdiler')}</h2>

        {group(L('Gear geometry', 'Dişli geometrisi'), <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field ctx={ctx} k="z1" label={L('Pinion teeth, z1', 'Pinyon diş sayısı, z1')} />
            <Field ctx={ctx} k="z2" label={L('Gear teeth, z2', 'Çark diş sayısı, z2')} />
          </div>
          <Field ctx={ctx} k="module" label={L('Module, m', 'Modül, m')} unit="mm" />
          <Field ctx={ctx} k="alpha" label={L('Pressure angle, α', 'Basınç açısı, α')} unit="°"
            hint={L('Common standard spur gears use 20°.', 'Standart düz dişlilerde yaygın değer 20°’dir.')} />
          <Field ctx={ctx} k="face" label={L('Face width, b', 'Diş genişliği, b')} unit="mm" />
        </>)}

        {group(L('Loading', 'Yükleme'), <>
          <fieldset>
            <legend className={labelClass}>{L('Load input', 'Yük girişi')}</legend>
            <div className="mt-2 grid grid-cols-1 border border-border sm:grid-cols-2">
              {([['torque', L('A — Pinion torque', 'A — Pinyon torku')], ['force', L('B — Tangential force', 'B — Teğetsel kuvvet')]] as const).map(([v, label]) => (
                <button key={v} type="button" aria-pressed={form.loadMode === v} onClick={() => set('loadMode', v)}
                  className={`px-3 py-2 text-sm transition-colors ${form.loadMode === v ? 'bg-accent text-accent-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          {form.loadMode === 'torque'
            ? <Field ctx={ctx} k="torque" label={L('Pinion torque, T1', 'Pinyon torku, T1')} unitKey="torqueUnit" units={['N·m', 'N·mm']} />
            : <Field ctx={ctx} k="force" label={L('Tangential force, Ft', 'Teğetsel kuvvet, Ft')} unitKey="forceUnit" units={['N', 'kN']} />}
        </>)}

        {group(L('Materials', 'Malzemeler'), <>
          <div>
            <label htmlFor="gs-modulusUnit" className={labelClass}>{L('Modulus unit', 'Modül birimi')}</label>
            <select id="gs-modulusUnit" value={form.modulusUnit} onChange={(e) => set('modulusUnit', e.target.value)} className={`mt-2 ${selectClass}`}>
              <option value="GPa">GPa</option><option value="MPa">MPa</option>
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field ctx={ctx} k="label1" text label={L('Pinion material (optional)', 'Pinyon malzemesi (isteğe bağlı)')} />
            <Field ctx={ctx} k="label2" text label={L('Gear material (optional)', 'Çark malzemesi (isteğe bağlı)')} />
            <Field ctx={ctx} k="e1" label={L('Pinion E1', 'Pinyon E1')} />
            <Field ctx={ctx} k="e2" label={L('Gear E2', 'Çark E2')} />
            <Field ctx={ctx} k="nu1" label={L('Pinion ν1', 'Pinyon ν1')} />
            <Field ctx={ctx} k="nu2" label={L('Gear ν2', 'Çark ν2')} />
          </div>
        </>)}

        {group(L('Lewis form factor (optional override)', 'Lewis form faktörü (isteğe bağlı)'), <>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {L('Leave blank to use the tabulated Y for 20° full-depth teeth (12–400 teeth, linear interpolation). Enter Y from your own source for other tooth forms or pressure angles.', 'Boş bırakırsanız 20° tam diş boyu için tablo değeri kullanılır (12–400 diş, doğrusal enterpolasyon). Diğer diş formları veya basınç açıları için kendi kaynağınızdan Y girin.')}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field ctx={ctx} k="y1" label={L('Pinion Y1', 'Pinyon Y1')} />
            <Field ctx={ctx} k="y2" label={L('Gear Y2', 'Çark Y2')} />
          </div>
        </>)}

        {group(L('Allowable stresses (optional)', 'İzin verilen gerilmeler (isteğe bağlı)'), <>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {L('No allowable values are assigned automatically. Enter values from your own material data to see screening ratios.', 'İzin verilen değerler otomatik atanmaz. Tarama oranlarını görmek için kendi malzeme verilerinizden değer girin.')}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field ctx={ctx} k="allowH" label={L('Allowable contact, σ_H,allow', 'İzin verilen temas, σ_H,izin')} unit="MPa" />
            <Field ctx={ctx} k="allowF" label={L('Allowable bending, σ_F,allow', 'İzin verilen eğilme, σ_F,izin')} unit="MPa" />
          </div>
        </>)}

        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonStyles.secondary} onClick={() => setForm(defaultGearForm)}>
            {L('Load worked example', 'Çözümlü örneği yükle')}
          </button>
        </div>
      </section>

      <section aria-label={L('Results', 'Sonuçlar')} aria-live="polite" className="grid content-start gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">{L('Results', 'Sonuçlar')}</h2>
        <p className="border-l-2 border-accent bg-muted/50 px-4 py-3 text-xs leading-relaxed text-foreground">
          {L('This calculator is a preliminary engineering screening tool. It does not implement the complete ISO 6336 or AGMA gear-rating procedures.', 'Bu hesaplayıcı bir ön mühendislik değerlendirme aracıdır. ISO 6336 veya AGMA dişli değerlendirme prosedürlerinin tamamını uygulamaz.')}
        </p>
        {warnings.length ? (
          <ul className="grid gap-2" aria-label={L('Warnings', 'Uyarılar')}>
            {warnings.map((w) => <li key={w} className="border border-border bg-card px-4 py-3 text-xs leading-relaxed text-foreground">⚠ {warnText[w]}</li>)}
          </ul>
        ) : null}
        {r ? <>
          <h3 className="mt-2 font-display text-base font-semibold text-foreground">{L('Contact', 'Temas')}</h3>
          <Result emphasis title={L('Simplified pitch-point Hertz contact stress', 'Basitleştirilmiş bölüm noktası Hertz temas gerilmesi')} symbol="σ_H" value={f(r.sigmaH)} unit="MPa" equation="√(Fn·E* / (π·b·R'))" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Result title={L('Effective elastic modulus', 'Eşdeğer elastisite modülü')} symbol="E*" value={f(r.Estar / 1000, 5)} unit="GPa" equation="1/E* = (1−ν1²)/E1 + (1−ν2²)/E2" />
            <Result title={L('Equivalent radius', 'Eşdeğer yarıçap')} symbol="R'" value={f(r.R)} unit="mm" equation="ρ1ρ2/(ρ1+ρ2), ρi = (di/2)·sin α" />
            <Result title={L('Flank curvature, pinion', 'Yanak eğrilik yarıçapı, pinyon')} symbol="ρ1" value={f(r.rho1)} unit="mm" equation="(d1/2)·sin α" />
            <Result title={L('Flank curvature, gear', 'Yanak eğrilik yarıçapı, çark')} symbol="ρ2" value={f(r.rho2)} unit="mm" equation="(d2/2)·sin α" />
          </div>

          <h3 className="mt-2 font-display text-base font-semibold text-foreground">{L('Bending', 'Eğilme')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Result emphasis title={`${L('Preliminary Lewis bending stress', 'Ön Lewis eğilme gerilmesi')} — ${m1}`} symbol="σ_F1" value={f(r.sigmaF1)} unit="MPa" equation="Ft / (b·m·Y1)" />
            <Result emphasis title={`${L('Preliminary Lewis bending stress', 'Ön Lewis eğilme gerilmesi')} — ${m2}`} symbol="σ_F2" value={f(r.sigmaF2)} unit="MPa" equation="Ft / (b·m·Y2)" />
            <Result title={`${L('Lewis form factor', 'Lewis form faktörü')} — ${m1}`} symbol="Y1" value={f(r.Y1, 3)} unit="—" equation={ySrc(r.Y1Source)} />
            <Result title={`${L('Lewis form factor', 'Lewis form faktörü')} — ${m2}`} symbol="Y2" value={f(r.Y2, 3)} unit="—" equation={ySrc(r.Y2Source)} />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {L('The member with fewer teeth usually has the smaller Y and therefore the higher root stress, but material and allowable stress decide which member governs — compare both.', 'Daha az dişli eleman genellikle daha küçük Y ve dolayısıyla daha yüksek diş dibi gerilmesine sahiptir; ancak hangi elemanın belirleyici olduğuna malzeme ve izin verilen gerilme karar verir — ikisini de karşılaştırın.')}
          </p>

          {r.SH !== undefined || r.SF1 !== undefined ? <>
            <h3 className="mt-2 font-display text-base font-semibold text-foreground">{L('Screening safety ratios', 'Tarama emniyet oranları')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {r.SH !== undefined ? <Result title={L('Screening safety ratio — contact', 'Tarama emniyet oranı — temas')} symbol="S_H" value={f(r.SH, 3)} unit="—" equation="σ_H,allow / σ_H" /> : null}
              {r.SF1 !== undefined ? <Result title={`${L('Screening safety ratio — bending', 'Tarama emniyet oranı — eğilme')}, ${m1}`} symbol="S_F1" value={f(r.SF1, 3)} unit="—" equation="σ_F,allow / σ_F1" /> : null}
              {r.SF2 !== undefined ? <Result title={`${L('Screening safety ratio — bending', 'Tarama emniyet oranı — eğilme')}, ${m2}`} symbol="S_F2" value={f(r.SF2, 3)} unit="—" equation="σ_F,allow / σ_F2" /> : null}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{L('These are simple stress ratios, not ISO 6336 safety factors.', 'Bunlar basit gerilme oranlarıdır; ISO 6336 emniyet katsayıları değildir.')}</p>
          </> : null}

          <h3 className="mt-2 font-display text-base font-semibold text-foreground">{L('Loads', 'Kuvvetler')}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Result title={L('Tangential force', 'Teğetsel kuvvet')} symbol="Ft" value={f(r.Ft)} unit="N" equation={form.loadMode === 'torque' ? '2T1 / d1' : L('entered', 'girilen değer')} />
            <Result title={L('Radial force', 'Radyal kuvvet')} symbol="Fr" value={f(r.Fr)} unit="N" equation="Ft·tan α" />
            <Result title={L('Normal force', 'Normal kuvvet')} symbol="Fn" value={f(r.Fn)} unit="N" equation="Ft / cos α" />
          </div>

          <h3 className="mt-2 font-display text-base font-semibold text-foreground">{L('Geometry', 'Geometri')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Result title={L('Pitch diameter, pinion', 'Bölüm dairesi çapı, pinyon')} symbol="d1" value={f(r.d1)} unit="mm" equation="m·z1" />
            <Result title={L('Pitch diameter, gear', 'Bölüm dairesi çapı, çark')} symbol="d2" value={f(r.d2)} unit="mm" equation="m·z2" />
            <Result title={L('Gear ratio', 'Dişli oranı')} symbol="u" value={f(r.u)} unit="—" equation="z2 / z1" />
            <Result title={L('Centre distance', 'Eksenler arası mesafe')} symbol="a" value={f(r.a)} unit="mm" equation="(d1 + d2) / 2" />
            <Result title={L('Base diameter, pinion', 'Temel daire çapı, pinyon')} symbol="db1" value={f(r.db1)} unit="mm" equation="d1·cos α" />
            <Result title={L('Base diameter, gear', 'Temel daire çapı, çark')} symbol="db2" value={f(r.db2)} unit="mm" equation="d2·cos α" />
          </div>
          <GearSchematic z1={parseNumber(form.z1)} z2={parseNumber(form.z2)} alphaDeg={alphaNum} labels={{
            aria: L('Schematic of a spur gear pair with forces at the pitch point', 'Bölüm noktasındaki kuvvetlerle düz dişli çifti şeması'),
            pinion: L('Pinion', 'Pinyon'), gear: L('Gear', 'Çark'), loa: L('line of action', 'kavrama doğrusu'),
            caption: L('Schematic only: circles are pitch circles, not tooth profiles. Forces shown acting on the pinion tooth at the pitch point; directions depend on rotation sense.', 'Yalnızca şematiktir: daireler bölüm daireleridir, diş profilleri değildir. Kuvvetler bölüm noktasında pinyon dişine etkiyen olarak gösterilmiştir; yönler dönüş yönüne bağlıdır.'),
          }} />
        </> : (
          <div className="border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
            {L('Correct the highlighted inputs to see results.', 'Sonuçları görmek için işaretli girdileri düzeltin.')}
          </div>
        )}
      </section>
    </div>
  );
}
