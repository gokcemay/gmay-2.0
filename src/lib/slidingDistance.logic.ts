import type {
  MotionMode,
  ReciprocatingSIInputs,
  RotarySIInputs,
  SlidingErrors,
  SlidingFormState,
  SlidingResults,
} from "./slidingDistance.types";
import { toHertz, toMeter, toSecond } from "./slidingDistance.units";

export const defaultRotaryForm: SlidingFormState = {
  mode: "rotary",
  radius: "10",
  radiusUnit: "mm",
  rpm: "60",
  stroke: "20",
  strokeUnit: "mm",
  frequency: "5",
  frequencyUnit: "Hz",
  duration: "10",
  durationUnit: "min",
};

export const defaultReciprocatingForm: SlidingFormState = {
  ...defaultRotaryForm,
  mode: "reciprocating",
};

export function defaultsForMotionMode(mode: MotionMode): SlidingFormState {
  return mode === "rotary" ? defaultRotaryForm : defaultReciprocatingForm;
}

function parsePositive(raw: string): number | null {
  const value = Number(String(raw).trim().replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function validateSlidingForm(form: SlidingFormState): SlidingErrors {
  const errors: SlidingErrors = {};
  if (form.mode === "rotary") {
    if (parsePositive(form.radius) === null)
      errors.radius = "İz yarıçapı sıfırdan büyük olmalıdır.";
    if (parsePositive(form.rpm) === null) errors.rpm = "Dönme hızı sıfırdan büyük olmalıdır.";
  } else {
    if (parsePositive(form.stroke) === null)
      errors.stroke = "Strok uzunluğu sıfırdan büyük olmalıdır.";
    if (parsePositive(form.frequency) === null)
      errors.frequency = "Çevrim frekansı sıfırdan büyük olmalıdır.";
  }
  if (parsePositive(form.duration) === null)
    errors.duration = "Deney süresi sıfırdan büyük olmalıdır.";
  return errors;
}

/** Rotary: N = n t / 60, C = 2πr, s = 2πrN, v = 2πrn / 60. */
export function calculateRotarySlidingDistance(
  inputs: RotarySIInputs,
): SlidingResults | null {
  const { r, n, t } = inputs;
  if (![r, n, t].every((v) => Number.isFinite(v) && v > 0)) return null;
  const N = (n * t) / 60;
  const perUnit = 2 * Math.PI * r;
  const s = perUnit * N;
  const v = (2 * Math.PI * r * n) / 60;
  return [N, perUnit, s, v].every(Number.isFinite) ? { N, perUnit, s, v } : null;
}

/** Reciprocating: N = f t, s_cycle = 2L, s = 2Lft, v_avg = 2Lf. */
export function calculateReciprocatingSlidingDistance(
  inputs: ReciprocatingSIInputs,
): SlidingResults | null {
  const { L, f, t } = inputs;
  if (![L, f, t].every((v) => Number.isFinite(v) && v > 0)) return null;
  const N = f * t;
  const perUnit = 2 * L;
  const s = perUnit * N;
  const v = 2 * L * f;
  return [N, perUnit, s, v].every(Number.isFinite) ? { N, perUnit, s, v } : null;
}

export type SlidingSIInputs =
  | ({ mode: "rotary" } & RotarySIInputs)
  | ({ mode: "reciprocating" } & ReciprocatingSIInputs);

/** Convert a validated form to SI inputs (m, rpm or cycles/s, s). Returns null if invalid. */
export function toSlidingSIInputs(form: SlidingFormState): SlidingSIInputs | null {
  if (Object.keys(validateSlidingForm(form)).length > 0) return null;
  const t = toSecond(parsePositive(form.duration)!, form.durationUnit);
  if (form.mode === "rotary") {
    return {
      mode: "rotary",
      r: toMeter(parsePositive(form.radius)!, form.radiusUnit),
      n: parsePositive(form.rpm)!,
      t,
    };
  }
  return {
    mode: "reciprocating",
    L: toMeter(parsePositive(form.stroke)!, form.strokeUnit),
    f: toHertz(parsePositive(form.frequency)!, form.frequencyUnit),
    t,
  };
}

export function calculateSliding(inputs: SlidingSIInputs): SlidingResults | null {
  return inputs.mode === "rotary"
    ? calculateRotarySlidingDistance(inputs)
    : calculateReciprocatingSlidingDistance(inputs);
}
