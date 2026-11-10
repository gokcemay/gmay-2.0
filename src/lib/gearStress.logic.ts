// Preliminary screening for external involute spur gears (not ISO 6336 / AGMA).
// Internal units: N, mm, MPa (N/mm²), N·mm. E* convention: 1/E* = (1−ν1²)/E1 + (1−ν2²)/E2.

export type LoadMode = 'torque' | 'force';
export type TorqueUnit = 'N·m' | 'N·mm';
export type ForceUnit = 'N' | 'kN';
export type ModulusUnit = 'GPa' | 'MPa';

export type GearForm = {
  z1: string; z2: string; module: string; alpha: string; face: string;
  loadMode: LoadMode; torque: string; torqueUnit: TorqueUnit; force: string; forceUnit: ForceUnit;
  e1: string; nu1: string; e2: string; nu2: string; modulusUnit: ModulusUnit;
  label1: string; label2: string;
  y1: string; y2: string; // optional manual Lewis form factors (blank = table)
  allowH: string; allowF: string; // optional allowable stresses, MPa
};

export type GearErrorCode = 'invalid' | 'positive' | 'nonNegative' | 'teeth' | 'integer' | 'poisson' | 'alpha' | 'yRange' | 'yRequired';
export type GearErrors = Partial<Record<keyof GearForm, GearErrorCode>>;
export type GearWarning = 'lowTeeth' | 'undercut1' | 'undercut2' | 'alpha' | 'faceSmall' | 'faceLarge' | 'ratio' | 'poisson';

export const defaultGearForm: GearForm = {
  z1: '20', z2: '40', module: '2', alpha: '20', face: '20',
  loadMode: 'torque', torque: '50', torqueUnit: 'N·m', force: '2500', forceUnit: 'N',
  e1: '210', nu1: '0.3', e2: '210', nu2: '0.3', modulusUnit: 'GPa',
  label1: '', label2: '', y1: '', y2: '', allowH: '', allowF: '',
};

export const torqueToNmm = (v: number, u: TorqueUnit) => v * (u === 'N·m' ? 1000 : 1);
export const forceToN = (v: number, u: ForceUnit) => v * (u === 'kN' ? 1000 : 1);
export const modulusToMPa = (v: number, u: ModulusUnit) => v * (u === 'GPa' ? 1000 : 1);
export const degToRad = (deg: number) => (deg * Math.PI) / 180;

export function parseNumber(raw: string): number {
  const s = raw.trim().replace(',', '.');
  if (s === '' || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

/**
 * Lewis form factor Y for 20° full-depth involute spur teeth (load at tip), as tabulated in
 * Shigley's Mechanical Engineering Design, Table 14-2. Used as σ = Ft / (b·m·Y).
 * Linear interpolation between tabulated tooth counts; outside 12–400 teeth no value is returned.
 */
export const LEWIS_Y_20DEG: readonly [number, number][] = [
  [12, 0.245], [13, 0.261], [14, 0.277], [15, 0.290], [16, 0.296], [17, 0.303], [18, 0.309],
  [19, 0.314], [20, 0.322], [21, 0.328], [22, 0.331], [24, 0.337], [26, 0.346], [28, 0.353],
  [30, 0.359], [34, 0.371], [38, 0.384], [43, 0.397], [50, 0.409], [60, 0.422], [75, 0.435],
  [100, 0.447], [150, 0.460], [300, 0.472], [400, 0.480],
];

export function lewisY(z: number): number | undefined {
  const t = LEWIS_Y_20DEG;
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i], c = t[i + 1];
    if (!a || !c) break;
    const [za, ya] = a, [zb, yb] = c;
    if (z >= za && z <= zb) return ya + ((z - za) / (zb - za)) * (yb - ya);
  }
  return undefined;
}

export const effectiveModulus = (E1: number, nu1: number, E2: number, nu2: number) =>
  1 / ((1 - nu1 ** 2) / E1 + (1 - nu2 ** 2) / E2);

/** Involute flank radii of curvature at the pitch point: ρ = (d/2)·sin α. */
export function pitchPointRadii(d1: number, d2: number, alphaRad: number) {
  const rho1 = (d1 / 2) * Math.sin(alphaRad);
  const rho2 = (d2 / 2) * Math.sin(alphaRad);
  return { rho1, rho2, R: (rho1 * rho2) / (rho1 + rho2) };
}

// Hertz line-contact peak pressure: p0 = sqrt(w · E_star / (π · R_eq)), with w = Fn / b.
export const hertzLineP0 = (Fn: number, b: number, Estar: number, R: number) => Math.sqrt(((Fn / b) * Estar) / (Math.PI * R));

/** Theoretical minimum pinion teeth without undercut: standard rack, addendum 1·m, zero profile shift. */
export const undercutLimit = (alphaRad: number) => 2 / Math.sin(alphaRad) ** 2;

export type GearResults = {
  d1: number; d2: number; u: number; a: number; db1: number; db2: number;
  Ft: number; Fr: number; Fn: number;
  Estar: number; rho1: number; rho2: number; R: number; contactHalfWidth: number; sigmaH: number;
  Y1: number; Y2: number; Y1Source: 'table' | 'manual'; Y2Source: 'table' | 'manual'; sigmaF1: number; sigmaF2: number;
  SH?: number; SF1?: number; SF2?: number;
};

export function validateGearForm(form: GearForm): GearErrors {
  const e: GearErrors = {};
  const num = (k: keyof GearForm) => parseNumber(form[k]);
  for (const k of ['z1', 'z2'] as const) {
    const v = num(k);
    if (!Number.isFinite(v)) e[k] = 'invalid';
    else if (!Number.isInteger(v)) e[k] = 'integer';
    else if (v < 5) e[k] = 'teeth';
  }
  for (const k of ['module', 'face', 'e1', 'e2'] as const) {
    const v = num(k);
    if (!Number.isFinite(v)) e[k] = 'invalid'; else if (v <= 0) e[k] = 'positive';
  }
  const al = num('alpha');
  if (!Number.isFinite(al)) e.alpha = 'invalid'; else if (!(al > 0 && al < 45)) e.alpha = 'alpha';
  const lk = form.loadMode === 'torque' ? 'torque' : 'force';
  const lv = num(lk);
  if (!Number.isFinite(lv)) e[lk] = 'invalid'; else if (lv < 0) e[lk] = 'nonNegative';
  for (const k of ['nu1', 'nu2'] as const) {
    const v = num(k);
    if (!Number.isFinite(v)) e[k] = 'invalid'; else if (!(v > -1 && v < 0.5)) e[k] = 'poisson';
  }
  for (const [yk, zk] of [['y1', 'z1'], ['y2', 'z2']] as const) {
    if (form[yk].trim() === '') {
      const z = num(zk);
      if (!e[zk] && lewisY(z) === undefined) e[yk] = 'yRequired';
    } else {
      const v = num(yk);
      if (!Number.isFinite(v)) e[yk] = 'invalid'; else if (!(v > 0 && v < 1)) e[yk] = 'yRange';
    }
  }
  for (const k of ['allowH', 'allowF'] as const) {
    if (form[k].trim() === '') continue;
    const v = num(k);
    if (!Number.isFinite(v)) e[k] = 'invalid'; else if (v <= 0) e[k] = 'positive';
  }
  return e;
}

export function gearWarnings(form: GearForm): GearWarning[] {
  const w: GearWarning[] = [];
  const z1 = parseNumber(form.z1), z2 = parseNumber(form.z2), m = parseNumber(form.module), b = parseNumber(form.face), al = parseNumber(form.alpha);
  if (Number.isFinite(z1) && Number.isFinite(z2) && Math.min(z1, z2) < 12) w.push('lowTeeth');
  if (Number.isFinite(al) && al > 0 && al < 45) {
    const lim = undercutLimit(degToRad(al));
    if (z1 < lim) w.push('undercut1');
    if (z2 < lim) w.push('undercut2');
    if (![14.5, 20, 25].includes(al)) w.push('alpha');
  }
  if (m > 0 && b > 0) { if (b / m < 3) w.push('faceSmall'); if (b / m > 25) w.push('faceLarge'); }
  if (z1 > 0 && z2 > 0 && z2 < z1) w.push('ratio');
  for (const k of ['nu1', 'nu2'] as const) { const v = parseNumber(form[k]); if (v > -1 && v < 0.5 && (v < 0.1 || v > 0.45)) { w.push('poisson'); break; } }
  return w;
}

export function calculateGear(form: GearForm): GearResults | null {
  if (Object.keys(validateGearForm(form)).length) return null;
  const n = (k: keyof GearForm) => parseNumber(form[k]);
  const z1 = n('z1'), z2 = n('z2'), m = n('module'), b = n('face'), alpha = degToRad(n('alpha'));
  const d1 = m * z1, d2 = m * z2;
  const Ft = form.loadMode === 'torque' ? (2 * torqueToNmm(n('torque'), form.torqueUnit)) / d1 : forceToN(n('force'), form.forceUnit);
  const Fn = Ft / Math.cos(alpha);
  const Estar = effectiveModulus(modulusToMPa(n('e1'), form.modulusUnit), n('nu1'), modulusToMPa(n('e2'), form.modulusUnit), n('nu2'));
  const { rho1, rho2, R } = pitchPointRadii(d1, d2, alpha);
  const sigmaH = hertzLineP0(Fn, b, Estar, R);
  const contactHalfWidth = Math.sqrt((4 * (Fn / b) * R) / (Math.PI * Estar));
  const Y1Source = form.y1.trim() ? 'manual' : 'table';
  const Y2Source = form.y2.trim() ? 'manual' : 'table';
  const Y1 = Y1Source === 'manual' ? n('y1') : lewisY(z1)!;
  const Y2 = Y2Source === 'manual' ? n('y2') : lewisY(z2)!;
  const sigmaF1 = Ft / (b * m * Y1), sigmaF2 = Ft / (b * m * Y2);
  const res: GearResults = {
    d1, d2, u: z2 / z1, a: (d1 + d2) / 2, db1: d1 * Math.cos(alpha), db2: d2 * Math.cos(alpha),
    Ft, Fr: Ft * Math.tan(alpha), Fn, Estar, rho1, rho2, R, contactHalfWidth, sigmaH,
    Y1, Y2, Y1Source, Y2Source, sigmaF1, sigmaF2,
  };
  if (form.allowH.trim() && sigmaH > 0) res.SH = n('allowH') / sigmaH;
  if (form.allowF.trim() && sigmaF1 > 0) { res.SF1 = n('allowF') / sigmaF1; res.SF2 = n('allowF') / sigmaF2; }
  return res;
}
