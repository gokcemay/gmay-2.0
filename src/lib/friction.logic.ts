export type ForceUnit = 'N' | 'kN' | 'lbf';
export type FrictionMode = 'coefficient' | 'force' | 'normal' | 'angle' | 'incline';
export type FrictionForm = { mode: FrictionMode; ft: string; fn: string; mu: string; angle: string; ftUnit: ForceUnit; fnUnit: ForceUnit; angleInput: 'mu' | 'degrees' };
export const defaultFrictionForm: FrictionForm = { mode: 'coefficient', ft: '30', fn: '100', mu: '0.5', angle: '30', ftUnit: 'N', fnUnit: 'N', angleInput: 'mu' };
const forceFactors: Record<ForceUnit, number> = { N: 1, kN: 1000, lbf: 4.4482216152605 };
export const convertForce = (value: number, from: ForceUnit, to: ForceUnit) => value * forceFactors[from] / forceFactors[to];
export function parseMagnitude(input: string): number {
  const text = input.trim().replace(',', '.');
  if (!/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?$/i.test(text)) return NaN;
  const value = Number(text);
  return Number.isFinite(value) && value >= 0 ? value : NaN;
}
export type FrictionResult = { mu: number; angle: number; ft?: number; fn?: number; equation: string };
export type FrictionError = 'invalid' | 'normalZero' | 'muZero' | 'angleRange' | 'overflow';
export function calculateFriction(form: FrictionForm): { result?: FrictionResult; error?: FrictionError } {
  const { mode } = form;
  const ft = convertForce(parseMagnitude(form.ft), form.ftUnit, 'N');
  const fn = convertForce(parseMagnitude(form.fn), form.fnUnit, 'N');
  let mu = parseMagnitude(form.mu);
  const angle = parseMagnitude(form.angle);
  let result: FrictionResult;
  if (mode === 'coefficient') {
    if (!Number.isFinite(ft) || !Number.isFinite(fn)) return { error: 'invalid' };
    if (fn === 0) return { error: 'normalZero' };
    mu = ft / fn;
    result = { mu, ft, fn, angle: Math.atan(mu) * 180 / Math.PI, equation: 'μ = Ft / Fn' };
  } else if (mode === 'force') {
    if (!Number.isFinite(mu) || !Number.isFinite(fn)) return { error: 'invalid' };
    result = { mu, ft: mu * fn, fn, angle: Math.atan(mu) * 180 / Math.PI, equation: 'Ft = μ · Fn' };
  } else if (mode === 'normal') {
    if (!Number.isFinite(mu) || !Number.isFinite(ft)) return { error: 'invalid' };
    if (mu === 0) return { error: 'muZero' };
    result = { mu, ft, fn: ft / mu, angle: Math.atan(mu) * 180 / Math.PI, equation: 'Fn = Ft / μ' };
  } else if (mode === 'incline' || form.angleInput === 'degrees') {
    if (!Number.isFinite(angle)) return { error: 'invalid' };
    if (angle >= 90) return { error: 'angleRange' };
    result = { mu: Math.tan(angle * Math.PI / 180), angle, equation: mode === 'incline' ? 'μ_s = tan θ' : 'μ = tan φ' };
  } else {
    if (!Number.isFinite(mu)) return { error: 'invalid' };
    result = { mu, angle: Math.atan(mu) * 180 / Math.PI, equation: 'φ = arctan μ' };
  }
  if ([result.mu, result.angle, result.ft ?? 0, result.fn ?? 0].some(n => !Number.isFinite(n))) return { error: 'overflow' };
  return { result };
}