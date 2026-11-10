// Pure Hertzian line-contact calculations (cylinder–flat, parallel cylinder–cylinder, external contact).
// Convention: 1/E* = (1−ν1²)/E1 + (1−ν2²)/E2 (not E' = 2E*). All internal values in SI units.

export type LineGeometry = 'cylinder-flat' | 'cylinder-cylinder';
export type LengthUnit = 'mm' | 'cm' | 'm';
export type LoadUnit = 'N' | 'kN';
export type ModulusUnit = 'GPa' | 'MPa';

export type LineForm = {
  geometry: LineGeometry;
  r1: string;
  r2: string;
  radiusUnit: LengthUnit;
  length: string;
  lengthUnit: LengthUnit;
  load: string;
  loadUnit: LoadUnit;
  e1: string;
  nu1: string;
  e2: string;
  nu2: string;
  modulusUnit: ModulusUnit;
};

export type LineErrorCode = 'invalid' | 'positive' | 'poisson';
export type LineErrors = Partial<Record<keyof LineForm, LineErrorCode>>;

export type LineResults = {
  R: number; // effective radius, m
  L: number; // m
  F: number; // N
  w: number; // N/m
  Estar: number; // Pa
  b: number; // half-width, m
  width: number; // 2b, m
  p0: number; // Pa
  pMean: number; // Pa
  tauMax: number; // Pa, max subsurface (Tresca) shear on centerline
  zTau: number; // m, depth of tauMax
};

// Worked example from the task: two identical steel cylinders.
export const defaultLineForm: LineForm = {
  geometry: 'cylinder-cylinder',
  r1: '1.27', r2: '1.27', radiusUnit: 'mm',
  length: '1', lengthUnit: 'mm',
  load: '75', loadUnit: 'N',
  e1: '200', nu1: '0.3', e2: '200', nu2: '0.3', modulusUnit: 'GPa',
};

export const lengthToM = (v: number, u: LengthUnit) => v * (u === 'mm' ? 1e-3 : u === 'cm' ? 1e-2 : 1);
export const loadToN = (v: number, u: LoadUnit) => v * (u === 'kN' ? 1e3 : 1);
export const modulusToPa = (v: number, u: ModulusUnit) => v * (u === 'GPa' ? 1e9 : 1e6);

export function parseNumber(raw: string): number {
  const s = raw.trim().replace(',', '.');
  if (s === '' || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

export function effectiveModulus(E1: number, nu1: number, E2: number, nu2: number) {
  return 1 / ((1 - nu1 ** 2) / E1 + (1 - nu2 ** 2) / E2);
}

/** R2 omitted = flat (R2 → ∞), so R' = R1. */
export function effectiveRadius(R1: number, R2?: number) {
  return R2 === undefined ? R1 : (R1 * R2) / (R1 + R2);
}

export function lineContact(F: number, L: number, R: number, Estar: number) {
  const w = F / L;
  const b = Math.sqrt((4 * w * R) / (Math.PI * Estar));
  const p0 = (2 * w) / (Math.PI * b);
  const pMean = F / (2 * b * L);
  return { w, b, width: 2 * b, p0, pMean, tauMax: 0.300 * p0, zTau: 0.786 * b };
}

export function validateLineForm(form: LineForm): LineErrors {
  const errors: LineErrors = {};
  const positive = (k: keyof LineForm) => {
    const v = parseNumber(form[k]);
    if (!Number.isFinite(v)) errors[k] = 'invalid';
    else if (v <= 0) errors[k] = 'positive';
  };
  positive('r1');
  if (form.geometry === 'cylinder-cylinder') positive('r2');
  positive('length'); positive('load'); positive('e1'); positive('e2');
  for (const k of ['nu1', 'nu2'] as const) {
    const v = parseNumber(form[k]);
    if (!Number.isFinite(v)) errors[k] = 'invalid';
    else if (!(v > -1 && v < 0.5)) errors[k] = 'poisson';
  }
  return errors;
}

/** Valid but unusual Poisson ratios for ordinary engineering materials (warning only). */
export function unusualPoisson(form: LineForm): ('nu1' | 'nu2')[] {
  return (['nu1', 'nu2'] as const).filter((k) => {
    const v = parseNumber(form[k]);
    return Number.isFinite(v) && v > -1 && v < 0.5 && (v < 0.1 || v > 0.45);
  });
}

export function calculateLineContact(form: LineForm): LineResults | null {
  if (Object.keys(validateLineForm(form)).length) return null;
  const n = (k: keyof LineForm) => parseNumber(form[k]);
  const R1 = lengthToM(n('r1'), form.radiusUnit);
  const R2 = form.geometry === 'cylinder-cylinder' ? lengthToM(n('r2'), form.radiusUnit) : undefined;
  const R = effectiveRadius(R1, R2);
  const L = lengthToM(n('length'), form.lengthUnit);
  const F = loadToN(n('load'), form.loadUnit);
  const Estar = effectiveModulus(modulusToPa(n('e1'), form.modulusUnit), n('nu1'), modulusToPa(n('e2'), form.modulusUnit), n('nu2'));
  return { R, L, F, Estar, ...lineContact(F, L, R, Estar) };
}

/** p/p0 = sqrt(1 − (x/b)²) for −1 ≤ x/b ≤ 1. */
export function pressureRatio(xOverB: number) {
  return Math.abs(xOverB) > 1 ? 0 : Math.sqrt(1 - xOverB ** 2);
}
