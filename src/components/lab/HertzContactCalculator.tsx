import { useMemo, useState } from "react";
import { buttonStyles } from "@/components/site/CTA";
import {
  calculateSphereFlatHertz,
  defaultHertzForm,
  pressureAt,
  validateHertzForm,
} from "@/lib/hertzContact.logic";
import type {
  ForceUnit,
  HertzFormState,
  HertzResults,
  HertzSIInputs,
  LengthUnit,
  ModulusUnit,
} from "@/lib/hertzContact.types";
import {
  forceUnits,
  formatArea,
  formatLength,
  formatMicron,
  formatModulus,
  formatPressure,
  lengthUnits,
  modulusUnits,
} from "@/lib/hertzContact.units";

const labelClass = "block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase";
const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const selectClass =
  "border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none";

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-destructive">{message}</p>;
}

function ResultRow({
  label,
  symbol,
  value,
  unit,
  emphasis,
}: {
  label: string;
  symbol: string;
  value: string;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`border border-border p-4 ${emphasis ? "bg-muted/50" : "bg-card"}`}>
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={`mt-2 font-display font-semibold text-foreground ${
          emphasis ? "text-2xl" : "text-lg"
        }`}
      >
        {value} <span className="font-mono text-sm font-normal">{unit}</span>
      </p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{symbol}</p>
    </div>
  );
}

function PressureChart({ p0, a }: { p0: number; a: number }) {
  const width = 640;
  const height = 260;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 44;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const pressure = formatPressure(p0);
  const radius = formatLength(a);
  const aDisp = Number(radius.value);

  const points = useMemo(() => {
    const n = 121;
    return Array.from({ length: n }, (_, i) => {
      const xPos = -a + (2 * a * i) / (n - 1);
      const p = pressureAt(xPos, a, p0);
      const x = padL + ((xPos + a) / (2 * a)) * plotW;
      const y = padT + plotH - (p / p0) * plotH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
  }, [a, p0, plotW, plotH]);

  const pTop = Number(pressure.value);

  return (
    <figure className="border border-border bg-card p-4 md:p-6">
      <figcaption className="font-display text-lg font-semibold text-foreground">
        Hertz Temas Basıncı Dağılımı
      </figcaption>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        p(x) = p₀ · √(1 − (x/a)²), −a ≤ x ≤ +a
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Hertz temas basıncı dağılımı: merkezde ${pressure.value} ${pressure.unit}, x = ±${radius.value} ${radius.unit} konumunda sıfır.`}
      >
        <line
          x1={padL}
          y1={padT + plotH}
          x2={padL + plotW}
          y2={padT + plotH}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={padL + plotW / 2}
          y1={padT}
          x2={padL + plotW / 2}
          y2={padT + plotH}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} className="stroke-border" strokeWidth={1} />
        <polyline points={points} fill="none" className="stroke-accent" strokeWidth={2} />
        <text x={padL - 8} y={padT + 6} textAnchor="end" className="fill-muted-foreground" fontSize="12">
          {pTop}
        </text>
        <text x={padL - 8} y={padT + plotH} textAnchor="end" className="fill-muted-foreground" fontSize="12">
          0
        </text>
        <text x={padL} y={padT + plotH + 20} textAnchor="middle" className="fill-muted-foreground" fontSize="12">
          −{aDisp}
        </text>
        <text
          x={padL + plotW / 2}
          y={padT + plotH + 20}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="12"
        >
          0
        </text>
        <text
          x={padL + plotW}
          y={padT + plotH + 20}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="12"
        >
          +{aDisp}
        </text>
        <text
          x={padL + plotW / 2}
          y={height - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="12"
        >
          Temas merkezinden konum, x [{radius.unit}]
        </text>
        <text
          x={14}
          y={padT + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${padT + plotH / 2})`}
          className="fill-muted-foreground"
          fontSize="12"
        >
          p(x) [{pressure.unit}]
        </text>
      </svg>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        p(0) = {pressure.value} {pressure.unit} · p(±a) = 0 {pressure.unit}
      </p>
    </figure>
  );
}

function buildSummary(form: HertzFormState, si: HertzSIInputs, r: HertzResults): string {
  const eStar = formatModulus(r.EStar);
  const a = formatLength(r.a);
  const d = formatLength(r.contactDiameter);
  const area = formatArea(r.area);
  const p0 = formatPressure(r.p0);
  const pm = formatPressure(r.pMean);
  const delta = formatMicron(r.delta);
  return [
    "Sphere-on-flat Hertz contact",
    "",
    "Girdiler",
    `F = ${form.force} ${form.forceUnit}`,
    `D = ${form.diameter} ${form.diameterUnit} (R = ${formatLength(si.R).value} ${formatLength(si.R).unit})`,
    `E1 = ${form.e1} ${form.e1Unit}`,
    `v1 = ${form.nu1}`,
    `E2 = ${form.e2} ${form.e2Unit}`,
    `v2 = ${form.nu2}`,
    "",
    "Sonuçlar",
    `E* = ${eStar.value} ${eStar.unit}`,
    `a = ${a.value} ${a.unit}`,
    `2a = ${d.value} ${d.unit}`,
    `A = ${area.value} ${area.unit}`,
    `p0 = ${p0.value} ${p0.unit}`,
    `p_mean = ${pm.value} ${pm.unit}`,
    `delta = ${delta.value} ${delta.unit}`,
  ].join("\n");
}

export function HertzContactCalculator() {
  const [form, setForm] = useState<HertzFormState>(defaultHertzForm);
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof HertzFormState>(key: K, value: HertzFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const { errors, si } = validateHertzForm(form);
  const results = si ? calculateSphereFlatHertz(si) : null;

  const handleCopy = async () => {
    if (!results || !si) return;
    try {
      await navigator.clipboard.writeText(buildSummary(form, si, results));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const eStar = results && formatModulus(results.EStar);
  const aVal = results && formatLength(results.a);
  const dVal = results && formatLength(results.contactDiameter);
  const areaVal = results && formatArea(results.area);
  const p0Val = results && formatPressure(results.p0);
  const pmVal = results && formatPressure(results.pMean);
  const deltaVal = results && formatMicron(results.delta);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {/* Inputs */}
        <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-display text-xl font-semibold text-foreground">Girdiler</h2>
          <fieldset className="border border-border p-5 md:p-6">
            <legend className="px-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Yük ve Geometri
            </legend>

            <div className="mt-2">
              <label htmlFor="force" className={labelClass}>
                Normal yük, F *
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="force"
                  inputMode="decimal"
                  className={inputClass}
                  value={form.force}
                  onChange={(e) => update("force", e.target.value)}
                />
                <select
                  aria-label="Yük birimi"
                  className={selectClass}
                  value={form.forceUnit}
                  onChange={(e) => update("forceUnit", e.target.value as ForceUnit)}
                >
                  {forceUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <FieldError message={errors.force} />
            </div>

            <div className="mt-5">
              <label htmlFor="diameter" className={labelClass}>
                Küre çapı, D *
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="diameter"
                  inputMode="decimal"
                  className={inputClass}
                  value={form.diameter}
                  onChange={(e) => update("diameter", e.target.value)}
                />
                <select
                  aria-label="Çap birimi"
                  className={selectClass}
                  value={form.diameterUnit}
                  onChange={(e) => update("diameterUnit", e.target.value as LengthUnit)}
                >
                  {lengthUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Küre yarıçapı R = D / 2 olarak hesaplanır.
              </p>
              <FieldError message={errors.diameter} />
            </div>
          </fieldset>

          <fieldset className="border border-border p-5 md:p-6">
            <legend className="px-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Malzeme Özellikleri
            </legend>

            <h3 className="mt-2 font-display text-base font-semibold text-foreground">
              Malzeme 1 — Küre
            </h3>
            <div className="mt-4">
              <label htmlFor="e1" className={labelClass}>
                Elastisite modülü, E₁ *
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="e1"
                  inputMode="decimal"
                  className={inputClass}
                  value={form.e1}
                  onChange={(e) => update("e1", e.target.value)}
                />
                <select
                  aria-label="E1 birimi"
                  className={selectClass}
                  value={form.e1Unit}
                  onChange={(e) => update("e1Unit", e.target.value as ModulusUnit)}
                >
                  {modulusUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <FieldError message={errors.e1} />
            </div>
            <div className="mt-5">
              <label htmlFor="nu1" className={labelClass}>
                Poisson oranı, ν₁ *
              </label>
              <input
                id="nu1"
                inputMode="decimal"
                className={`${inputClass} mt-2`}
                value={form.nu1}
                onChange={(e) => update("nu1", e.target.value)}
              />
              <FieldError message={errors.nu1} />
            </div>

            <h3 className="mt-8 font-display text-base font-semibold text-foreground">
              Malzeme 2 — Düzlem
            </h3>
            <div className="mt-4">
              <label htmlFor="e2" className={labelClass}>
                Elastisite modülü, E₂ *
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="e2"
                  inputMode="decimal"
                  className={inputClass}
                  value={form.e2}
                  onChange={(e) => update("e2", e.target.value)}
                />
                <select
                  aria-label="E2 birimi"
                  className={selectClass}
                  value={form.e2Unit}
                  onChange={(e) => update("e2Unit", e.target.value as ModulusUnit)}
                >
                  {modulusUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <FieldError message={errors.e2} />
            </div>
            <div className="mt-5">
              <label htmlFor="nu2" className={labelClass}>
                Poisson oranı, ν₂ *
              </label>
              <input
                id="nu2"
                inputMode="decimal"
                className={`${inputClass} mt-2`}
                value={form.nu2}
                onChange={(e) => update("nu2", e.target.value)}
              />
              <FieldError message={errors.nu2} />
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={buttonStyles.secondary}
              onClick={() => {
                setForm(defaultHertzForm);
                setCopied(false);
              }}
            >
              Varsayılanlara Dön
            </button>
            <button
              type="button"
              className={buttonStyles.primary}
              onClick={handleCopy}
              disabled={!results}
            >
              Sonuçları Kopyala
            </button>
            <span
              aria-live="polite"
              className="font-mono text-xs tracking-[0.15em] text-accent uppercase"
            >
              {copied ? "Kopyalandı" : ""}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Hesaplamalar tarayıcınızda gerçekleştirilir. Girdiğiniz mühendislik verileri bu araç
            tarafından kaydedilmez.
          </p>
        </form>

        {/* Results */}
        <section aria-live="polite" className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Sonuçlar</h2>
          {results && eStar && aVal && dVal && areaVal && p0Val && pmVal && deltaVal ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultRow
                  emphasis
                  label="Maksimum Hertz basıncı"
                  symbol="p₀ = 3F / (2πa²)"
                  value={p0Val.value}
                  unit={p0Val.unit}
                />
                <ResultRow
                  emphasis
                  label="Temas yarıçapı"
                  symbol="a = [(3FR)/(4E*)]^(1/3)"
                  value={aVal.value}
                  unit={aVal.unit}
                />
                <ResultRow
                  label="Efektif elastisite modülü"
                  symbol="E*"
                  value={eStar.value}
                  unit={eStar.unit}
                />
                <ResultRow label="Temas çapı" symbol="2a" value={dVal.value} unit={dVal.unit} />
                <ResultRow
                  label="Temas alanı"
                  symbol="A = πa²"
                  value={areaVal.value}
                  unit={areaVal.unit}
                />
                <ResultRow
                  label="Ortalama temas basıncı"
                  symbol="p_mean = F / (πa²)"
                  value={pmVal.value}
                  unit={pmVal.unit}
                />
                <ResultRow
                  label="Elastik yaklaşma"
                  symbol="δ = a² / R"
                  value={deltaVal.value}
                  unit={deltaVal.unit}
                />
              </div>
              <PressureChart p0={results.p0} a={results.a} />
            </>
          ) : (
            <div className="border border-dashed border-border p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sonuçların hesaplanabilmesi için girdileri geçerli değerlerle doldurun. Geçersiz
                girdiler için hata mesajları form alanlarının altında gösterilir.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
