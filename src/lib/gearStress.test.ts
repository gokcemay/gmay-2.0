import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGear, defaultGearForm, effectiveModulus, forceToN, gearWarnings, lewisY, modulusToMPa,
  torqueToNmm, undercutLimit, degToRad, validateGearForm, type GearForm,
} from './gearStress.logic';

const close = (a: number, b: number, rel = 2e-3) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), `${a} ≠ ${b}`);
const form = (p: Partial<GearForm>): GearForm => ({ ...defaultGearForm, ...p });

// Expected values are hand calculations (cos20° = 0.93969, sin20° = 0.34202, tan20° = 0.36397), not outputs of these functions.

test('unit conversions', () => {
  assert.equal(torqueToNmm(50, 'N·m'), 50000);
  assert.equal(torqueToNmm(500, 'N·mm'), 500);
  assert.equal(forceToN(2.5, 'kN'), 2500);
  assert.equal(modulusToMPa(210, 'GPa'), 210000);
  assert.equal(modulusToMPa(70000, 'MPa'), 70000);
});

test('case 1: 20/40, m=2, b=20, T1=50 N·m, steel/steel', () => {
  const r = calculateGear(defaultGearForm)!;
  assert.equal(r.d1, 40); assert.equal(r.d2, 80);           // pitch diameters
  assert.equal(r.u, 2); assert.equal(r.a, 60);              // ratio, centre distance
  close(r.db1, 37.588); close(r.db2, 75.175);
  close(r.Ft, 2500);                                        // 2·50000/40
  close(r.Fr, 909.93);                                      // 2500·tan20°
  close(r.Fn, 2660.4);                                      // 2500/cos20°
  close(r.Estar, 115385);                                   // 210000/(2·0.91)
  close(r.rho1, 6.8404); close(r.rho2, 13.681); close(r.R, 4.5603);
  close(r.sigmaH, 1035.1);                                  // √(133.02·115385/(π·4.5603))
  close(r.Y1, 0.322); close(r.Y2, 0.3892);                  // Y40 = 0.384 + 2/5·0.013
  close(r.sigmaF1, 194.1);                                  // 2500/(20·2·0.322)
  close(r.sigmaF2, 160.6);                                  // 2500/(20·2·0.3892)
});

test('case 2: 18/90, m=3, b=30, T1=120 N·m (higher ratio)', () => {
  const r = calculateGear(form({ z1: '18', z2: '90', module: '3', face: '30', torque: '120' }))!;
  assert.equal(r.u, 5); assert.equal(r.a, 162);
  close(r.Ft, 4444.4); close(r.Fr, 1617.6); close(r.Fn, 4729.7);
  close(r.R, 7.6955);                                       // ρ1=9.2345, ρ2=46.173
  close(r.sigmaH, 867.4);
  close(r.Y2, 0.4422);                                      // 0.435 + 15/25·0.012
  close(r.sigmaF1, 159.8);                                  // 4444.4/(30·3·0.309)
  close(r.sigmaF2, 111.7);                                  // 4444.4/(30·3·0.4422)
});

test('case 3: steel 210/0.30 on bronze 110/0.34, Ft = 2.5 kN direct', () => {
  close(effectiveModulus(210000, 0.3, 110000, 0.34), 80819); // 1/(0.91/210000 + 0.8844/110000)
  const r = calculateGear(form({ loadMode: 'force', force: '2.5', forceUnit: 'kN', e2: '110', nu2: '0.34' }))!;
  close(r.Ft, 2500);
  close(r.sigmaH, 866.3);
  close(r.sigmaF1, 194.1);
});

test('Lewis Y table interpolation and range', () => {
  assert.equal(lewisY(20), 0.322);
  close(lewisY(23)!, 0.334);                                // (0.331 + 0.337)/2
  assert.equal(lewisY(11), undefined);
  assert.equal(lewisY(500), undefined);
});

test('manual Y overrides table; screening safety ratios', () => {
  const r = calculateGear(form({ y1: '0.3', y2: '0.4', allowH: '1500', allowF: '300' }))!;
  close(r.sigmaF1, 2500 / (20 * 2 * 0.3));
  close(r.SH!, 1500 / 1035.1);
  close(r.SF1!, 300 / 208.33);
});

test('undercut threshold for 20°: 2/sin²α ≈ 17.1', () => {
  close(undercutLimit(degToRad(20)), 17.097);
  assert.ok(gearWarnings(form({ z1: '14' })).includes('undercut1'));
  assert.ok(!gearWarnings(defaultGearForm).includes('undercut1'));
  assert.ok(gearWarnings(form({ z1: '40', z2: '20' })).includes('ratio'));
});

test('invalid module', () => {
  assert.equal(validateGearForm(form({ module: '0' })).module, 'positive');
  assert.equal(validateGearForm(form({ module: 'abc' })).module, 'invalid');
});

test('invalid face width', () => {
  assert.equal(validateGearForm(form({ face: '-1' })).face, 'positive');
  assert.equal(validateGearForm(form({ face: 'Infinity' })).face, 'invalid');
});

test('invalid tooth count', () => {
  assert.equal(validateGearForm(form({ z1: '4' })).z1, 'teeth');
  assert.equal(validateGearForm(form({ z2: '20.5' })).z2, 'integer');
  assert.equal(validateGearForm(form({ z1: '8' })).y1, 'yRequired'); // below Y table, no manual value
  assert.equal(validateGearForm(form({ z1: '8', y1: '0.2' })).y1, undefined);
});

test('invalid Poisson ratio and negative load', () => {
  assert.equal(validateGearForm(form({ nu1: '0.5' })).nu1, 'poisson');
  assert.equal(validateGearForm(form({ nu2: 'NaN' })).nu2, 'invalid');
  assert.equal(validateGearForm(form({ torque: '-1' })).torque, 'nonNegative');
  assert.deepEqual(validateGearForm(defaultGearForm), {});
});
