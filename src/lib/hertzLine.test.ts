import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLineContact, defaultLineForm, effectiveModulus, effectiveRadius, lengthToM, loadToN,
  modulusToPa, pressureRatio, validateLineForm, type LineForm,
} from './hertzLine.logic';

const close = (a: number, b: number, rel = 1e-3) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), `${a} ≠ ${b}`);
const form = (patch: Partial<LineForm>): LineForm => ({ ...defaultLineForm, ...patch });

// Expected values below were computed by hand (calculator arithmetic), not with these functions.

test('unit conversions', () => {
  close(lengthToM(1.27, 'mm'), 1.27e-3, 1e-12);
  close(lengthToM(2, 'cm'), 0.02, 1e-12);
  close(lengthToM(0.5, 'm'), 0.5, 1e-12);
  close(loadToN(2, 'kN'), 2000, 1e-12);
  close(loadToN(75, 'N'), 75, 1e-12);
  close(modulusToPa(200, 'GPa'), 2e11, 1e-12);
  close(modulusToPa(70000, 'MPa'), 7e10, 1e-12);
});

test('effective modulus: steel/steel, 1/E* = 2·0.91/200 GPa → 109.89 GPa', () => {
  close(effectiveModulus(200e9, 0.3, 200e9, 0.3), 109.89e9, 1e-4);
  // steel 210/0.3 + aluminium 70/0.33: 1/E* = 0.91/210 + 0.8911/70 = 0.0043333 + 0.0127300 → 58.61 GPa
  close(effectiveModulus(210e9, 0.3, 70e9, 0.33), 58.61e9, 1e-3);
});

test('effective radius: equal, unequal and flat', () => {
  close(effectiveRadius(1.27e-3, 1.27e-3), 0.635e-3, 1e-9);
  close(effectiveRadius(10e-3, 15e-3), 6e-3, 1e-9);
  assert.equal(effectiveRadius(5e-3), 5e-3);
});

test('worked example: equal cylinders R=1.27 mm, L=1 mm, F=75 N, steel', () => {
  const r = calculateLineContact(defaultLineForm)!;
  close(r.R, 0.635e-3);
  close(r.Estar, 109.89e9);
  close(r.w, 75e3); // 75 N/mm
  close(r.b, 0.02349e-3);
  close(r.width, 0.04698e-3);
  close(r.p0, 2.033e9);
  close(r.pMean, 1.597e9); // 75 / (2·0.02349·1) N/mm²
  close(r.p0 / r.pMean, 4 / Math.PI, 1e-9);
});

// Cylinder-flat: R=5 mm, L=10 mm, F=1 kN, steel/steel.
// w = 100 N/mm; b² = 4·100·5/(π·109890) = 2000/345230 = 5.7932e-3 mm² → b = 0.07611 mm
// p0 = 2·100/(π·0.07611) = 836.4 MPa; p_mean = 1000/(2·0.07611·10) = 656.9 MPa
test('cylinder-flat calculation', () => {
  const r = calculateLineContact(form({ geometry: 'cylinder-flat', r1: '5', r2: '', length: '10', load: '1', loadUnit: 'kN' }))!;
  close(r.R, 5e-3, 1e-9);
  close(r.b, 0.07611e-3);
  close(r.p0, 836.4e6);
  close(r.pMean, 656.9e6);
});

// Unequal cylinders: R1=10 mm, R2=15 mm → R'=6 mm, L=20 mm, F=5 kN, steel 210/0.3 on Al 70/0.33 (E*=58.61 GPa)
// w = 250 N/mm; b² = 4·250·6/(π·58610) = 6000/184128 = 0.032586 mm² → b = 0.18052 mm
// p0 = 500/(π·0.18052) = 881.6 MPa
test('unequal cylinder-cylinder calculation', () => {
  const r = calculateLineContact(form({ r1: '10', r2: '15', length: '20', load: '5', loadUnit: 'kN', e1: '210', nu1: '0.3', e2: '70', nu2: '0.33' }))!;
  close(r.R, 6e-3, 1e-9);
  close(r.b, 0.18052e-3);
  close(r.p0, 881.6e6);
  close(r.tauMax, 0.3 * 881.6e6);
  close(r.zTau, 0.786 * 0.18052e-3);
});

test('pressure distribution is semi-elliptical', () => {
  assert.equal(pressureRatio(0), 1);
  close(pressureRatio(0.5), Math.sqrt(0.75), 1e-12);
  assert.equal(pressureRatio(1), 0);
  assert.equal(pressureRatio(1.2), 0);
});

test('invalid radius', () => {
  assert.equal(validateLineForm(form({ r1: '0' })).r1, 'positive');
  assert.equal(validateLineForm(form({ r2: '-3' })).r2, 'positive');
  assert.equal(validateLineForm(form({ r1: 'abc' })).r1, 'invalid');
  assert.equal(validateLineForm(form({ r1: 'Infinity' })).r1, 'invalid');
  assert.equal(validateLineForm(form({ geometry: 'cylinder-flat', r2: '' })).r2, undefined);
});

test('zero load and length are rejected', () => {
  assert.equal(validateLineForm(form({ load: '0' })).load, 'positive');
  assert.equal(validateLineForm(form({ length: '0' })).length, 'positive');
  assert.equal(validateLineForm(form({ e1: '0' })).e1, 'positive');
  assert.equal(calculateLineContact(form({ load: '0' })), null);
});

test('invalid Poisson ratio', () => {
  assert.equal(validateLineForm(form({ nu1: '0.5' })).nu1, 'poisson');
  assert.equal(validateLineForm(form({ nu2: '-1' })).nu2, 'poisson');
  assert.equal(validateLineForm(form({ nu1: 'NaN' })).nu1, 'invalid');
  assert.deepEqual(validateLineForm(defaultLineForm), {});
});
