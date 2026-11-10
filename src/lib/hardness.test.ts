import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertHardness, hardnessRanges, hardnessScales, hrcFromHv, hrbFromHv, invertHardness } from './hardness.logic';
const near = (v: number | null | undefined, expected: number, tolerance = 0.001) => { assert.equal(typeof v, 'number'); assert.ok(Math.abs(Number(v) - expected) < tolerance, `${v} ≠ ${expected}`); };
test('40 HRC → HV, independently solved with scipy Brent root finder', () => near(convertHardness('HRC', 40).values?.HV, 391.0119418144));
test('HV → HRC at independently calculated value', () => near(convertHardness('HV', 391.0119418144).values?.HRC, 40));
test('40 HRC → HBW independent inverse equation value', () => near(convertHardness('HRC', 40).values?.HBW, 369.9363681062));
test('HRB → HV independent forward equation at 150 HV', () => near(convertHardness('HRB', 80.0799875).values?.HV, 150));
test('midpoint uses the nonlinear equation, not a universal linear conversion', () => near(convertHardness('HV', 350).values?.HRC, 35.796548714285706));
for (const scale of hardnessScales) {
  test(`${scale} lower supported boundary is accepted; lower exterior is rejected`, () => { const [lo] = hardnessRanges[scale]; assert.ok(convertHardness(scale, lo).values); assert.equal(convertHardness(scale, lo - 0.01).error, 'range'); });
  test(`${scale} upper supported boundary is accepted; upper exterior is rejected`, () => { const [,hi] = hardnessRanges[scale]; assert.ok(convertHardness(scale, hi).values); assert.equal(convertHardness(scale, hi + 0.01).error, 'range'); });
}
test('60 HRC has no valid HBW or HRB output', () => { const r = convertHardness('HRC', 60); near(r.values?.HV, 694.7645417238633); assert.equal(r.values?.HBW, null); assert.equal(r.values?.HRB, null); });
test('negative and zero hardness are rejected', () => { for (const v of [-5, 0]) assert.equal(convertHardness('HV', v).error, 'invalid'); });
test('NaN, infinity, empty and malformed input are rejected', () => { for (const v of [NaN, Infinity, -Infinity, '', 'abc', '1.2.3']) assert.equal(convertHardness('HV', v).error, 'invalid'); });
test('all published correlations remain monotonic in their implemented domains', () => {
  for (const scale of hardnessScales) {
    const [lo, hi] = hardnessRanges[scale]; let last = -Infinity;
    for (let i=0;i<=100;i++) { const hv = convertHardness(scale,lo+(hi-lo)*i/100).values?.HV; assert.ok(typeof hv === 'number' && hv > last); last = Number(hv); }
  }
});
test('round trip with realistic displayed HV rounding', () => { const hv = convertHardness('HRC', 45).values?.HV; assert.ok(typeof hv === 'number'); near(convertHardness('HV', Math.round(Number(hv))).values?.HRC,45,0.05); });
test('soft range is separate; no equation inversion extrapolates', () => { assert.equal(convertHardness('HV', 150).values?.HRC,null); assert.equal(convertHardness('HV', 150).values?.HBW,null); assert.equal(invertHardness(hrcFromHv,20,238,940),null); near(hrbFromHv(100),55.1216); });
test('comma decimals accepted', () => near(convertHardness('HRC','40,0').values?.HV,391.0119418144));