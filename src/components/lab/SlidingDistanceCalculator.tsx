import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { buttonStyles } from "@/components/site/CTA";
import {
  calculateSliding,
  defaultsForMotionMode,
  defaultRotaryForm,
  toSlidingSIInputs,
  validateSlidingForm,
} from "@/lib/slidingDistance.logic";
import type {
  FrequencyUnit,
  LengthUnit,
  MotionMode,
  SlidingFormState,
  SlidingResults,
  TimeUnit,
} from "@/lib/slidingDistance.types";
import {
  formatCount,
  formatDistance,
  formatNumber,
  formatShortLength,
  formatSpeed,
  frequencyUnits,
  lengthUnits,
  rpmUnits,
  timeUnits,
} from "@/lib/slidingDistance.units";

const labelClass = "block font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase";
const inputClass =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const selectClass =
  "border border-border bg-background px-2 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none";

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
          disabled={units.length < 2}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ResultRow({
  label,
  symbol,
  value,
  unit,
  emphasis,
  description,
}: {
  label: string;
  symbol: string;
  value: string;
  unit: string;
  emphasis?: boolean;
  description: string;
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
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function RotaryDiagram() {
  return (
    <svg
      viewBox="0 0 220 130"
      role="img"
      aria-label="Döner hareket şeması: dönme merkezi, iz yarıçapı r ve temas noktası"
      className="h-auto w-full max-w-[260px] text-muted-foreground"
    >
      <circle cx="90" cy="65" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="90" cy="65" r="2.5" fill="currentColor" />
      <line
        x1="90"
        y1="65"
        x2="138"
        y2="65"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <circle cx="138" cy="65" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="108" y="59" fontSize="11" fill="currentColor" fontFamily="monospace">
        r
      </text>
      <text x="60" y="122" fontSize="9" fill="currentColor" fontFamily="monospace">
        dönme merkezi
      </text>
      <text x="150" y="69" fontSize="9" fill="currentColor" fontFamily="monospace">
        temas
      </text>
    </svg>
  );
}

function ReciprocatingDiagram() {
  return (
    <svg
      viewBox="0 0 220 90"
      role="img"
      aria-label="İleri-geri hareket şeması: iki terslenme noktası arasındaki strok uzunluğu L"
      className="h-auto w-full max-w-[260px] text-muted-foreground"
    >
      <line x1="40" y1="45" x2="180" y2="45" stroke="currentColor" strokeWidth="1" />
      <line x1="40" y1="32" x2="40" y2="58" stroke="currentColor" strokeWidth="1.4" />
      <line x1="180" y1="32" x2="180" y2="58" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="110" cy="45" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="103" y="30" fontSize="11" fill="currentColor" fontFamily="monospace">
        L
      </text>
      <text x="16" y="74" fontSize="9" fill="currentColor" fontFamily="monospace">
        terslenme
      </text>
      <text x="156" y="74" fontSize="9" fill="currentColor" fontFamily="monospace">
        terslenme
      </text>
    </svg>
  );
}

function buildSummary(form: SlidingFormState, r: SlidingResults): string {
  const dist = formatDistance(r.s);
  const per = formatShortLength(r.perUnit);
  const speed = formatSpeed(r.v);
  const lines = ["Sliding Distance Calculator", "GMA Engineering Lab", "", "Hareket tipi:"];
  if (form.mode === "rotary") {
    lines.push(
      "Döner",
      "",
      "Girdiler:",
      `r = ${form.radius} ${form.radiusUnit}`,
      `n = ${form.rpm} rpm`,
      `t = ${form.duration} ${form.durationUnit}`,
      "",
      "Sonuçlar:",
      `N = ${formatCount(r.N)} devir`,
      `C = ${per.value} ${per.unit}`,
      `s = ${dist.value} ${dist.unit}`,
      `v = ${speed.value} ${speed.unit}`,
    );
  } else {
    lines.push(
      "İleri-Geri",
      "",
      "Girdiler:",
      `L = ${form.stroke} ${form.strokeUnit}`,
      `f = ${form.frequency} ${form.frequencyUnit}`,
      `t = ${form.duration} ${form.durationUnit}`,
      "",
      "Sonuçlar:",
      `N = ${formatCount(r.N)} çevrim`,
      `2L = ${per.value} ${per.unit}`,
      `s = ${dist.value} ${dist.unit}`,
      `v_avg = ${speed.value} ${speed.unit}`,
    );
  }
  lines.push("", `Toplam kayma mesafesi (SI): s = ${formatNumber(r.s, 8)} m`);
  return lines.join("\n");
}

export function SlidingDistanceCalculator() {
  const [form, setForm] = useState<SlidingFormState>(defaultRotaryForm);
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => validateSlidingForm(form), [form]);
  const si = useMemo(() => toSlidingSIInputs(form), [form]);
  const results = useMemo(() => (si ? calculateSliding(si) : null), [si]);

  const set = <K extends keyof SlidingFormState>(key: K, value: SlidingFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const switchMode = (mode: MotionMode) => {
    if (mode === form.mode) return;
    setForm((prev) => ({ ...prev, mode }));
  };

  const copy = async () => {
    if (!results) return;
    try {
      await navigator.clipboard.writeText(buildSummary(form, results));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isRotary = form.mode === "rotary";
  const dist = results ? formatDistance(results.s) : null;
  const per = results ? formatShortLength(results.perUnit) : null;
  const speed = results ? formatSpeed(results.v) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="border border-border bg-card p-5 md:p-6" aria-label="Girdiler">
        <h2 className="font-display text-lg font-semibold text-foreground">Girdiler</h2>

        <fieldset className="mt-5">
          <legend className={labelClass}>Hareket tipi</legend>
          <div className="mt-2 grid grid-cols-1 border border-border sm:grid-cols-2">
            {(
              [
                ["rotary", "Döner"],
                ["reciprocating", "İleri-Geri"],
              ] as [MotionMode, string][]
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

        <div className="mt-5 border border-border p-4">
          {isRotary ? <RotaryDiagram /> : <ReciprocatingDiagram />}
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {isRotary
              ? "Numune, r yarıçaplı dairesel bir iz üzerinde hareket eder. Bir tam devirde kat edilen mesafe 2πr'dir."
              : "Strok uzunluğu L, iki terslenme noktası arasındaki tek yönlü mesafedir. Bir tam çevrim ileri gidiş + geri dönüş olduğundan toplam 2L yol alınır."}
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          {isRotary ? (
            <>
              <NumberField
                id="sd-radius"
                label="İz yarıçapı, r"
                value={form.radius}
                unit={form.radiusUnit}
                units={lengthUnits}
                onValue={(v) => set("radius", v)}
                onUnit={(u) => set("radiusUnit", u as LengthUnit)}
                error={errors.radius}
                hint="İz yarıçapı, dönme merkezinden temas noktasına olan mesafedir."
              />
              <NumberField
                id="sd-rpm"
                label="Dönme hızı, n"
                value={form.rpm}
                unit="rpm"
                units={rpmUnits}
                onValue={(v) => set("rpm", v)}
                onUnit={() => undefined}
                error={errors.rpm}
                hint="Dakikadaki devir sayısı (rpm). Açısal hız (rad/s) ile karıştırılmamalıdır."
              />
            </>
          ) : (
            <>
              <NumberField
                id="sd-stroke"
                label="Strok uzunluğu, L"
                value={form.stroke}
                unit={form.strokeUnit}
                units={lengthUnits}
                onValue={(v) => set("stroke", v)}
                onUnit={(u) => set("strokeUnit", u as LengthUnit)}
                error={errors.stroke}
                hint="Strok uzunluğu, iki terslenme noktası arasındaki mesafedir. Bir tam çevrimde toplam 2L yol alınır."
              />
              <NumberField
                id="sd-frequency"
                label="Çevrim frekansı, f"
                value={form.frequency}
                unit={form.frequencyUnit}
                units={frequencyUnits}
                onValue={(v) => set("frequency", v)}
                onUnit={(u) => set("frequencyUnit", u as FrequencyUnit)}
                error={errors.frequency}
                hint="Bu araçta frekans, saniyedeki tam ileri-gidiş ve geri-dönüş çevrimi sayısını ifade eder."
              />
            </>
          )}

          <NumberField
            id="sd-duration"
            label="Deney süresi, t"
            value={form.duration}
            unit={form.durationUnit}
            units={timeUnits}
            onValue={(v) => set("duration", v)}
            onUnit={(u) => set("durationUnit", u as TimeUnit)}
            error={errors.duration}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className={buttonStyles.secondary}
            onClick={() => setForm(defaultsForMotionMode(form.mode))}
          >
            Varsayılanlara Dön
          </button>
          <button type="button" className={buttonStyles.primary} onClick={copy} disabled={!results}>
            {copied ? "Kopyalandı" : "Sonuçları Kopyala"}
          </button>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Hesaplamalar tarayıcınızda gerçekleştirilir. Girdiğiniz deney parametreleri bu araç
          tarafından kaydedilmez.
        </p>
      </section>

      <section aria-label="Sonuçlar" className="grid content-start gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Sonuçlar</h2>

        {results && dist && per && speed ? (
          <>
            <ResultRow
              label={isRotary ? "Toplam devir sayısı" : "Toplam çevrim sayısı"}
              symbol={isRotary ? "N = n · t / 60" : "N = f · t"}
              value={formatCount(results.N)}
              unit={isRotary ? "devir" : "çevrim"}
              description={
                isRotary
                  ? "Deney süresince gerçekleşen toplam disk dönüşü sayısıdır."
                  : "Deney sırasında tamamlanan ileri-gidiş ve geri-dönüş hareketlerinin toplam sayısıdır."
              }
            />
            <ResultRow
              label={isRotary ? "Tur başına kayma mesafesi" : "Çevrim başına kayma mesafesi"}
              symbol={isRotary ? "C = 2πr" : "s_cycle = 2L"}
              value={per.value}
              unit={per.unit}
              description={
                isRotary
                  ? "Temas noktasının bir tam dönüşte kat ettiği dairesel yol uzunluğudur."
                  : "Bir tam ileri-gidiş ve geri-dönüş çevriminde kat edilen toplam 2L mesafesidir."
              }
            />
            <ResultRow
              label="Toplam kayma mesafesi"
              symbol={isRotary ? "s = 2πrN" : "s = 2Lft"}
              value={dist.value}
              unit={dist.unit}
              emphasis
              description={
                isRotary
                  ? "Temas çiftinin deney boyunca birbirine göre kat ettiği toplam yol uzunluğudur."
                  : "Tüm deney boyunca temas çiftinin birbirine göre kat ettiği toplam yol uzunluğudur."
              }
            />
            <ResultRow
              label={isRotary ? "Doğrusal kayma hızı" : "Ortalama kayma hızı"}
              symbol={isRotary ? "v = 2πrn / 60" : "v_avg = 2Lf"}
              value={speed.value}
              unit={speed.unit}
              description={
                isRotary
                  ? "Belirtilen iz yarıçapı ve dönme hızında temas noktasının çevresel hızıdır."
                  : "Toplam kayma mesafesinin toplam deney süresine bölünmesiyle elde edilen yol-ortalama hızdır."
              }
            />

            <div className="border border-border bg-card p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hesaplanan toplam kayma mesafesini özgül aşınma oranı hesabında kullanabilirsiniz.
              </p>
              <Link
                to="/lab/wear-rate-calculator"
                search={{
                  distance: Number(results.s.toPrecision(10)),
                  distanceUnit: "m",
                  source: "sliding-distance",
                }}
                className={`${buttonStyles.secondary} mt-4`}
              >
                Wear Rate Calculator'da Kullan
              </Link>
            </div>
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
