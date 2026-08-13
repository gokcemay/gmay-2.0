import type {
  WearErrors,
  WearFormState,
  WearMode,
  WearResults,
  WearSIInputs,
} from "./wearRate.types";
import {
  toCubicMeter,
  toKgPerCubicMeter,
  toKilogram,
  toMeterW,
  toNewtonW,
} from "./wearRate.units";

export const defaultVolumeForm: WearFormState = {
  mode: "volume",
  volume: "1",
  volumeUnit: "mm³",
  mass: "10",
  massUnit: "mg",
  density: "7.85",
  densityUnit: "g/cm³",
  force: "10",
  forceUnit: "N",
  distance: "1000",
  distanceUnit: "m",
};

export const defaultMassForm: WearFormState = {
  ...defaultVolumeForm,
  mode: "mass",
};

export function defaultsForMode(mode: WearMode): WearFormState {
  return mode === "volume" ? defaultVolumeForm : defaultMassForm;
}

function parsePositive(raw: string): number | null {
  const value = Number(String(raw).trim().replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function validateWearForm(form: WearFormState): WearErrors {
  const errors: WearErrors = {};
  if (form.mode === "volume") {
    if (parsePositive(form.volume) === null)
      errors.volume = "Aşınma hacmi sıfırdan büyük olmalıdır.";
  } else {
    if (parsePositive(form.mass) === null)
      errors.mass = "Kütle kaybı sıfırdan büyük olmalıdır.";
    if (parsePositive(form.density) === null)
      errors.density = "Yoğunluk sıfırdan büyük olmalıdır.";
  }
  if (parsePositive(form.force) === null) errors.force = "Normal yük sıfırdan büyük olmalıdır.";
  if (parsePositive(form.distance) === null)
    errors.distance = "Kayma mesafesi sıfırdan büyük olmalıdır.";
  return errors;
}

/** Convert a validated form to SI inputs (m³, N, m, kg, kg/m³). Returns null if invalid. */
export function toSIInputs(form: WearFormState): WearSIInputs | null {
  if (Object.keys(validateWearForm(form)).length > 0) return null;
  const F = toNewtonW(parsePositive(form.force)!, form.forceUnit);
  const s = toMeterW(parsePositive(form.distance)!, form.distanceUnit);

  if (form.mode === "volume") {
    const V = toCubicMeter(parsePositive(form.volume)!, form.volumeUnit);
    return { V, F, s };
  }
  const dm = toKilogram(parsePositive(form.mass)!, form.massUnit);
  const rho = toKgPerCubicMeter(parsePositive(form.density)!, form.densityUnit);
  return { V: dm / rho, F, s, dm, rho };
}

/** Pure wear-rate calculation. All inputs and outputs in SI base units. */
export function calculateWearRate(inputs: WearSIInputs): WearResults | null {
  const { V, F, s, dm } = inputs;
  if (![V, F, s].every((v) => Number.isFinite(v) && v > 0)) return null;

  const qv = V / s;
  const ks = V / (F * s);
  const results: WearResults = { V, qv, ks };
  if (typeof dm === "number" && Number.isFinite(dm) && dm > 0) results.qm = dm / s;

  return Object.values(results).every((v) => Number.isFinite(v)) ? results : null;
}
