// Publicly documented equations: https://turn2engineering.com/calculators/hardness-conversion-calculator
// Conservative domains: HV 238–940 (C), HV 100–240 (B), HBW 226–634 (C).
// No standard tables are reproduced. Values are empirical equivalents only.
export const hardnessScales = ['HV', 'HBW', 'HRC', 'HRB'] as const;
export type HardnessScale = typeof hardnessScales[number];
export const hrcFromHv = (hv: number) => 31.49 + 0.0796683 * hv - 3.55432e-5 * hv * hv - 6728.16 / hv;
export const hrbFromHv = (hv: number) => 114.665 + 0.0882795 * hv - 1.41855e-4 * hv * hv - 6695.28 / hv;
export const hrcFromHbw = (hbw: number) => 18.1673 + 0.120388 * hbw - 6.94388e-5 * hbw * hbw - 4883.27 / hbw;
export const hardnessRanges: Record<HardnessScale, readonly [number, number]> = {
  HV: [100, 940], HBW: [226, 634],
  HRC: [hrcFromHv(238), hrcFromHv(940)],
  HRB: [hrbFromHv(100), hrbFromHv(240)],
};
const within = (v: number, [lo, hi]: readonly [number, number]) => Number.isFinite(v) && v >= lo - 1e-10 && v <= hi + 1e-10;
export function invertHardness(fn: (x: number) => number, target: number, lo: number, hi: number): number | null {
  if (!within(target, [fn(lo), fn(hi)])) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
export type HardnessResult = { error: 'invalid' | 'range'; values?: never } | { error?: never; hv: number; values: Record<HardnessScale, number | null> };
export function convertHardness(scale: HardnessScale, input: string | number): HardnessResult {
  const raw = typeof input === 'string' ? input.trim().replace(',', '.') : input;
  const value = raw === '' ? NaN : Number(raw);
  if (!Number.isFinite(value) || value <= 0) return { error: 'invalid' };
  if (!within(value, hardnessRanges[scale])) return { error: 'range' };
  const hv = scale === 'HV' ? value : scale === 'HRC' ? invertHardness(hrcFromHv, value, 238, 940)
    : scale === 'HRB' ? invertHardness(hrbFromHv, value, 100, 240)
    : invertHardness(hrcFromHv, hrcFromHbw(value), 238, 940);
  if (hv === null) return { error: 'range' };
  const hrc = within(hv, [238, 940]) ? hrcFromHv(hv) : null;
  const values: Record<HardnessScale, number | null> = {
    HV: hv, HRC: hrc,
    HRB: within(hv, [100, 240]) ? hrbFromHv(hv) : null,
    HBW: hrc === null ? null : invertHardness(hrcFromHbw, hrc, 226, 634),
  };
  values[scale] = value;
  return { hv, values };
}
export function hardnessCurve(scale: Exclude<HardnessScale, 'HV'>) {
  return Array.from({ length: 421 }, (_, i) => {
    const hv = 100 + i * 2;
    const result = convertHardness('HV', hv);
    return { hv, value: result.values?.[scale] ?? null };
  });
}