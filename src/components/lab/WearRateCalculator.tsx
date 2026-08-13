import { useMemo, useState } from "react";
import { buttonStyles } from "@/components/site/CTA";
import {
  calculateWearRate,
  defaultVolumeForm,
  defaultsForMode,
  toSIInputs,
  validateWearForm,
} from "@/lib/wearRate.logic";
import type {
  DensityUnit,
  DistanceUnit,
  MassUnit,
  VolumeUnit,
  WearForceUnit,
  WearFormState,
  WearMode,
  WearResults,
  WearSIInputs,
} from "@/lib/wearRate.types";
import {
  densityUnits,
  distanceUnits,
  formatPlain,
  formatSci,
  formatVolume,
  massUnits,
  toMgPerM,
  toMm3PerM,
  toMm3PerNm,
  volumeUnits,
  wearForceUnits,
} from "@/lib/wearRate.units";

const labelClass = "block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase";
const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const selectClass =
  "border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none";

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-destructive">{message}</p>;
}

function NumberField({
  id,
  label,
  value,
  unit,
  units,
  onValue,
  onUnit,
  error,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  unit: string;
  units: readonly string[];
  onValue: (v: string) => void;
  onUnit: (u: string) => void;
  error?: string | undefined;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          aria-invalid={Boolean(error)}
        />
        <select
          className={selectClass}
          value={unit}
          onChange={(e) => onUnit(e.target.value)}
          aria-label={`${label} birimi`}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

function ResultRow({
  label,
  symbol,
  value,
  unit,
  secondary,
  emphasis,
}: {
  label: string;
  symbol: string;
  value: string;
  unit: string;
  secondary?: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`border border-border p-4 ${emphasis ? "bg-muted/50" : "bg-card"}`}>
      <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={`mt-2 font-display font-semibold break-words text-foreground ${
          emphasis ? "text-2xl" : "text-lg"
        }`}
      >
        {value} <span className="font-mono text-sm font-normal">{unit}</span>
      </p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{symbol}</p>
      {secondary && <p className="mt-1 text-xs text-muted-foreground">{secondary}</p>}
    </div>
  );
}

function buildSummary(form: WearFormState, si: WearSIInputs, r: WearResults): string {
  const vol = formatVolume(r.V);
  const lines = [
    "Wear Rate Calculator",
    "GMA Engineering Lab",
    "",
    "Hesaplama yöntemi:",
    form.mode === "volume" ? "Aşınma hacmi biliniyor" : "Kütle kaybı biliniyor",
    "",
    "Girdiler:",
  ];
  if (form.mode === "volume") {
    lines.push(`V = ${form.volume} ${form.volumeUnit}`);
  } else {
    lines.push(`dm = ${form.mass} ${form.massUnit}`);
    lines.push(`rho = ${form.density} ${form.densityUnit}`);
  }
  lines.push(`F = ${form.force} ${form.forceUnit}`);
  lines.push(`s = ${form.distance} ${form.distanceUnit}`);
  lines.push("", "Sonuçlar:");
  if (form.mode === "mass") {
    lines.push(`V = ${formatPlain(vol.value)} ${vol.unit}`);
    lines.push(`q_m = ${formatPlain(toMgPerM(r.qm ?? 0))} mg/m`);
  }
  lines.push(`q_v = ${formatPlain(toMm3PerM(r.qv))} mm³/m`);
  lines.push(`k_s = ${formatPlain(toMm3PerNm(r.ks))} mm³/(N·m)`);
  lines.push("", "Denklemler:");
  if (form.mode === "mass") lines.push("V = dm / rho", "q_m = dm / s");
  lines.push("q_v = V / s", "k_s = V / (F × s)");
  lines.push("", `Toplam kayma mesafesi (SI): s = ${formatPlain(si.s)} m`);
  return lines.join("\n");
}

export function WearRateCalculator() {
  const [form, setForm] = useState<WearFormState>(defaultVolumeForm);
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => validateWearForm(form), [form]);
  const si = useMemo(() => toSIInputs(form), [form]);
  const results = useMemo(() => (si ? calculateWearRate(si) : null), [si]);

  const set = <K extends keyof WearFormState>(key: K, value: WearFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const switchMode = (mode: WearMode) => {
    if (mode === form.mode) return;
    setForm(defaultsForMode(mode));
  };

  const copy = async () => {
    if (!si || !results) return;
    try {
      await navigator.clipboard.writeText(buildSummary(form, si, results));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isMass = form.mode === "mass";
  const vol = results ? formatVolume(results.V) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="border border-border bg-card p-5 md:p-6" aria-label="Girdiler">
        <h2 className="font-display text-lg font-semibold text-foreground">Girdiler</h2>

        <fieldset className="mt-5">
          <legend className={labelClass}>Hesaplama yöntemi</legend>
          <div className="mt-2 grid grid-cols-1 border border-border sm:grid-cols-2">
            {(
              [
                ["volume", "Aşınma hacmi biliniyor"],
                ["mass", "Kütle kaybı biliniyor"],
              ] as [WearMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => switchMode(mode)}
                aria-pressed={form.mode === mode}
                className={`px-3 py-2 text-sm transition-colors ${
                  form.mode === mode
                    ? "bg-accent text-accent-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5">
          {!isMass ? (
            <NumberField
              id="wear-volume"
              label="Aşınma hacmi, V"
              value={form.volume}
              unit={form.volumeUnit}
              units={volumeUnits}
              onValue={(v) => set("volume", v)}
              onUnit={(u) => set("volumeUnit", u as VolumeUnit)}
              error={errors.volume}
            />
          ) : (
            <>
              <NumberField
                id="wear-mass"
                label="Kütle kaybı, Δm"
                value={form.mass}
                unit={form.massUnit}
                units={massUnits}
                onValue={(v) => set("mass", v)}
                onUnit={(u) => set("massUnit", u as MassUnit)}
                error={errors.mass}
              />
              <NumberField
                id="wear-density"
                label="Yoğunluk, ρ"
                value={form.density}
                unit={form.densityUnit}
                units={densityUnits}
                onValue={(v) => set("density", v)}
                onUnit={(u) => set("densityUnit", u as DensityUnit)}
                error={errors.density}
                hint="Yoğunluk; alaşım, porozite, bileşim ve malzeme durumuna göre değişebilir. Deney numunesine uygun değeri kullanın."
              />
            </>
          )}

          <NumberField
            id="wear-force"
            label="Normal yük, F"
            value={form.force}
            unit={form.forceUnit}
            units={wearForceUnits}
            onValue={(v) => set("force", v)}
            onUnit={(u) => set("forceUnit", u as WearForceUnit)}
            error={errors.force}
          />

          <NumberField
            id="wear-distance"
            label="Kayma mesafesi, s"
            value={form.distance}
            unit={form.distanceUnit}
            units={distanceUnits}
            onValue={(v) => set("distance", v)}
            onUnit={(u) => set("distanceUnit", u as DistanceUnit)}
            error={errors.distance}
          />
        </div>

        {isMass && (
          <p className="mt-6 border-l-2 border-accent bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Kütle değişimi yalnızca aşınmış malzeme miktarını temsil etmeyebilir. Transfer tabakası,
            oksidasyon, yüzeye yapışan aşınma artıkları, temizleme yöntemi ve terazi çözünürlüğü
            sonucu etkileyebilir.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className={buttonStyles.secondary}
            onClick={() => setForm(defaultsForMode(form.mode))}
          >
            Varsayılanlara Dön
          </button>
          <button
            type="button"
            className={buttonStyles.primary}
            onClick={copy}
            disabled={!results}
          >
            {copied ? "Kopyalandı" : "Sonuçları Kopyala"}
          </button>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Hesaplamalar tarayıcınızda gerçekleştirilir. Girdiğiniz deney verileri bu araç tarafından
          kaydedilmez.
        </p>
      </section>

      <section aria-label="Sonuçlar" className="grid content-start gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Sonuçlar</h2>

        {results && vol ? (
          <>
            <ResultRow
              label={isMass ? "Hesaplanan aşınma hacmi" : "Aşınma hacmi"}
              symbol="V"
              value={formatSci(vol.value)}
              unit={vol.unit}
            />
            {isMass && (
              <ResultRow
                label="Kütlesel aşınma / kayma mesafesi"
                symbol="q_m = Δm / s"
                value={formatSci(toMgPerM(results.qm ?? 0))}
                unit="mg/m"
              />
            )}
            <ResultRow
              label="Hacimsel aşınma / kayma mesafesi"
              symbol="q_v = V / s"
              value={formatSci(toMm3PerM(results.qv))}
              unit="mm³/m"
            />
            <ResultRow
              label="Özgül aşınma oranı"
              symbol="k_s = V / (F × s)"
              value={formatSci(toMm3PerNm(results.ks))}
              unit="mm³/(N·m)"
              secondary="Specific wear rate"
              emphasis
            />
          </>
        ) : (
          <div className="border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
            Sonuçların görüntülenmesi için tüm girdilerin sıfırdan büyük geçerli sayılar olması
            gerekir.
          </div>
        )}
      </section>
    </div>
  );
}
