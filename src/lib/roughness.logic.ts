export const roughnessParameters = ['Ra', 'Rq', 'Rz', 'Rt'] as const;
export type RoughnessParameter = typeof roughnessParameters[number];
export type RoughnessUnit = 'um' | 'uin';
export type RoughnessRange = readonly [number, number];
// Model landmarks, NOT universal bounds on real surfaces.
export const rqRaBand = [Math.PI / (2 * Math.sqrt(2)), Math.sqrt(Math.PI / 2)] as const;
export const roughnessSources = {
  definitions: 'https://parameter.mahr.com/html/english/MarSurf/roughnessdepth.html',
  guide: 'https://mitutoyo.com/webfoo/wp-content/uploads/1984_Surf_Roughness_PG.pdf',
  context: 'https://doi.org/10.1007/s11249-023-01700-z',
};
export function convertRoughnessUnit(value: number, from: RoughnessUnit, to: RoughnessUnit): number {
  return from === to ? value : from === 'um' ? value / 0.0254 : value * 0.0254;
}
export function compareRoughness(parameter: RoughnessParameter, raw: string | number, unit: RoughnessUnit) {
  const value = typeof raw === 'number' ? raw : raw.trim() === '' ? NaN : Number(raw.trim().replace(',', '.'));
  if (!Number.isFinite(value) || value < 0) return { error: 'invalid' as const, values: null };
  const um = convertRoughnessUnit(value, unit, 'um');
  if (!Number.isFinite(um) || !Number.isFinite(convertRoughnessUnit(um, 'um', 'uin'))) return { error: 'overflow' as const, values: null };
  const values: Record<RoughnessParameter, RoughnessRange | null> = { Ra: null, Rq: null, Rz: null, Rt: null };
  values[parameter] = [um, um];
  if (parameter === 'Ra') values.Rq = [um * rqRaBand[0], um * rqRaBand[1]];
  if (parameter === 'Rq') values.Ra = [um / rqRaBand[1], um / rqRaBand[0]];
  // Rz and Rt depend on sampling, extrema and profile shape. No guessed factors.
  if (Object.values(values).some(range => range?.some(v => !Number.isFinite(convertRoughnessUnit(v, 'um', 'uin'))))) return { error: 'overflow' as const, values: null };
  return { error: null, values, zero: value === 0, um };
}