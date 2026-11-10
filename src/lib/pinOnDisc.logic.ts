// Pure pin-on-disc wear-test calculations. All internal values use SI base units.

export type PodMode = 'mass' | 'volume';
export type MassEntry = 'difference' | 'direct';
export type DistanceEntry = 'direct' | 'rotary';
export type MassUnit = 'mg' | 'g';
export type DensityUnit = 'g/cm³' | 'kg/m³';
export type VolumeUnit = 'mm³' | 'cm³';
export type DistanceUnit = 'm' | 'km';
export type RadiusUnit = 'mm' | 'cm';
export type DurationUnit = 's' | 'min' | 'h';

export type PodForm = {
  mode: PodMode;
  massEntry: MassEntry;
  massInitial: string;
  massFinal: string;
  massLoss: string;
  massUnit: MassUnit;
  density: string;
  densityUnit: DensityUnit;
  volume: string;
  volumeUnit: VolumeUnit;
  load: string;
  distanceEntry: DistanceEntry;
  distance: string;
  distanceUnit: DistanceUnit;
  radius: string;
  radiusUnit: RadiusUnit;
  rpm: string;
  duration: string;
  durationUnit: DurationUnit;
  frictionForce: string;
};

export type PodErrorCode = 'invalid' | 'positive' | 'finalExceedsInitial' | 'nonNegative';
export type PodErrors = Partial<Record<keyof PodForm, PodErrorCode>>;

export type PodResults = {
  dm?: number; // kg
  V: number; // m³
  s: number; // m
  revolutions?: number;
  qv: number; // m³/m = m²
  ks: number; // m³/(N·m)
  mu?: number;
};

export const defaultPodForm: PodForm = {
  mode: 'mass',
  massEntry: 'difference',
  massInitial: '12.3456',
  massFinal: '12.3376',
  massLoss: '8',
  massUnit: 'g',
  density: '7.85',
  densityUnit: 'g/cm³',
  volume: '1',
  volumeUnit: 'mm³',
  load: '10',
  distanceEntry: 'rotary',
  distance: '1000',
  distanceUnit: 'm',
  radius: '10',
  radiusUnit: 'mm',
  rpm: '120',
  duration: '30',
  durationUnit: 'min',
  frictionForce: '',
};

export const massToKg = (v: number, u: MassUnit) => (u === 'mg' ? v * 1e-6 : v * 1e-3);
export const densityToSI = (v: number, u: DensityUnit) => (u === 'g/cm³' ? v * 1000 : v);
export const volumeToM3 = (v: number, u: VolumeUnit) => (u === 'mm³' ? v * 1e-9 : v * 1e-6);
export const distanceToM = (v: number, u: DistanceUnit) => (u === 'km' ? v * 1000 : v);
export const radiusToM = (v: number, u: RadiusUnit) => (u === 'mm' ? v * 1e-3 : v * 1e-2);
export const durationToMin = (v: number, u: DurationUnit) => (u === 's' ? v / 60 : u === 'h' ? v * 60 : v);

/** Parse a decimal string (comma or dot). Returns null for blank/invalid input. */
export function parseNumber(raw: string): number | null {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (text === '' || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

/** s = 2πrN with N = rpm × t(min). */
export function rotarySlidingDistance(radiusM: number, rpm: number, minutes: number) {
  const revolutions = rpm * minutes;
  return { revolutions, distance: 2 * Math.PI * radiusM * revolutions };
}

export function validatePodForm(form: PodForm): PodErrors {
  const errors: PodErrors = {};
  const positive = (key: keyof PodForm) => {
    const v = parseNumber(form[key] as string);
    if (v === null) errors[key] = 'invalid';
    else if (v <= 0) errors[key] = 'positive';
    return v;
  };
  if (form.mode === 'mass') {
    if (form.massEntry === 'difference') {
      const mi = positive('massInitial');
      const mf = parseNumber(form.massFinal);
      if (mf === null) errors.massFinal = 'invalid';
      else if (mf < 0) errors.massFinal = 'nonNegative';
      else if (mi !== null && mi > 0 && mf >= mi) errors.massFinal = 'finalExceedsInitial';
    } else positive('massLoss');
    positive('density');
  } else positive('volume');
  positive('load');
  if (form.distanceEntry === 'direct') positive('distance');
  else {
    positive('radius');
    positive('rpm');
    positive('duration');
  }
  if (form.frictionForce.trim() !== '') {
    const ft = parseNumber(form.frictionForce);
    if (ft === null) errors.frictionForce = 'invalid';
    else if (ft < 0) errors.frictionForce = 'nonNegative';
  }
  return errors;
}

export function calculatePinOnDisc(form: PodForm): PodResults | null {
  if (Object.keys(validatePodForm(form)).length > 0) return null;
  const n = (key: keyof PodForm) => parseNumber(form[key] as string)!;
  const F = n('load');

  let dm: number | undefined;
  let V: number;
  if (form.mode === 'mass') {
    dm = form.massEntry === 'difference'
      ? massToKg(n('massInitial') - n('massFinal'), form.massUnit)
      : massToKg(n('massLoss'), form.massUnit);
    V = dm / densityToSI(n('density'), form.densityUnit);
  } else V = volumeToM3(n('volume'), form.volumeUnit);

  let s: number;
  let revolutions: number | undefined;
  if (form.distanceEntry === 'direct') s = distanceToM(n('distance'), form.distanceUnit);
  else {
    const r = rotarySlidingDistance(radiusToM(n('radius'), form.radiusUnit), n('rpm'), durationToMin(n('duration'), form.durationUnit));
    s = r.distance;
    revolutions = r.revolutions;
  }

  const results: PodResults = { V, s, qv: V / s, ks: V / (F * s) };
  if (dm !== undefined) results.dm = dm;
  if (revolutions !== undefined) results.revolutions = revolutions;
  if (form.frictionForce.trim() !== '') results.mu = n('frictionForce') / F;
  const ok = Object.values(results).every((v) => typeof v === 'number' && Number.isFinite(v));
  return ok ? results : null;
}

const superscript: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/** 3 significant digits; scientific "a.bc × 10⁻ⁿ" for very small/large magnitudes. */
export function formatSci(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e-3 && abs < 1e6) return String(Number(value.toPrecision(digits)));
  const [mantissa, exp] = value.toExponential(digits - 1).split('e');
  const e = String(Number(exp)).split('').map((c) => superscript[c] ?? c).join('');
  return `${mantissa} × 10${e}`;
}
