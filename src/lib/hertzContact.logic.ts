import type {
  HertzErrors,
  HertzFormState,
  HertzResults,
  HertzSIInputs,
} from "./hertzContact.types";
import { toMeter, toNewton, toPascal } from "./hertzContact.units";

export const defaultHertzForm: HertzFormState = {
  force: "100",
  forceUnit: "N",
  diameter: "10",
  diameterUnit: "mm",
  e1: "210",
  e1Unit: "GPa",
  nu1: "0.30",
  e2: "210",
  e2Unit: "GPa",
  nu2: "0.30",
};

const parse = (raw: string): number => {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return Number.NaN;
  return Number(normalized);
};

export function validateHertzForm(form: HertzFormState): {
  errors: HertzErrors;
  si?: HertzSIInputs;
} {
  const errors: HertzErrors = {};

  const F = parse(form.force);
  const D = parse(form.diameter);
  const E1 = parse(form.e1);
  const E2 = parse(form.e2);
  const nu1 = parse(form.nu1);
  const nu2 = parse(form.nu2);

  if (!Number.isFinite(F) || F <= 0) errors.force = "Normal yük sıfırdan büyük olmalıdır.";
  if (!Number.isFinite(D) || D <= 0) errors.diameter = "Küre çapı sıfırdan büyük olmalıdır.";
  if (!Number.isFinite(E1) || E1 <= 0) errors.e1 = "Elastisite modülü sıfırdan büyük olmalıdır.";
  if (!Number.isFinite(E2) || E2 <= 0) errors.e2 = "Elastisite modülü sıfırdan büyük olmalıdır.";
  if (!Number.isFinite(nu1) || nu1 < 0 || nu1 >= 0.5)
    errors.nu1 = "Poisson oranı 0 ile 0.5 arasında olmalıdır (0 ≤ ν < 0.5).";
  if (!Number.isFinite(nu2) || nu2 < 0 || nu2 >= 0.5)
    errors.nu2 = "Poisson oranı 0 ile 0.5 arasında olmalıdır (0 ≤ ν < 0.5).";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    si: {
      F: toNewton(F, form.forceUnit),
      R: toMeter(D, form.diameterUnit) / 2,
      E1: toPascal(E1, form.e1Unit),
      nu1,
      E2: toPascal(E2, form.e2Unit),
      nu2,
    },
  };
}

/** Classical Hertz elastic sphere-on-flat contact. All inputs and outputs in SI base units. */
export function calculateSphereFlatHertz(input: HertzSIInputs): HertzResults | null {
  const { F, R, E1, nu1, E2, nu2 } = input;
  if (!(F > 0) || !(R > 0) || !(E1 > 0) || !(E2 > 0)) return null;

  const compliance = (1 - nu1 * nu1) / E1 + (1 - nu2 * nu2) / E2;
  if (!(compliance > 0)) return null;
  const EStar = 1 / compliance;

  const a = Math.cbrt((3 * F * R) / (4 * EStar));
  const area = Math.PI * a * a;
  const p0 = (3 * F) / (2 * area);
  const pMean = F / area;
  const delta = (a * a) / R;

  const results: HertzResults = {
    EStar,
    a,
    contactDiameter: 2 * a,
    area,
    p0,
    pMean,
    delta,
  };

  return Object.values(results).every((v) => Number.isFinite(v)) ? results : null;
}

/** Hertz pressure distribution p(r) for |r| <= a. */
export function pressureAt(r: number, a: number, p0: number): number {
  const ratio = r / a;
  if (Math.abs(ratio) >= 1) return 0;
  return p0 * Math.sqrt(1 - ratio * ratio);
}
