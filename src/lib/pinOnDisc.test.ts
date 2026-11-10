import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePinOnDisc, defaultPodForm, densityToSI, distanceToM, durationToMin, formatSci,
  massToKg, radiusToM, rotarySlidingDistance, validatePodForm, volumeToM3, type PodForm,
} from './pinOnDisc.logic';

const close = (a: number, b: number, rel = 1e-9) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), `${a} ≠ ${b}`);
const form = (patch: Partial<PodForm>): PodForm => ({ ...defaultPodForm, ...patch });

test('unit conversions', () => {
  close(massToKg(8, 'mg'), 8e-6);
  close(massToKg(8, 'g'), 8e-3);
  close(densityToSI(7.85, 'g/cm³'), 7850);
  close(densityToSI(7850, 'kg/m³'), 7850);
  close(volumeToM3(1, 'mm³'), 1e-9);
  close(volumeToM3(1, 'cm³'), 1e-6);
  close(distanceToM(1.5, 'km'), 1500);
  close(radiusToM(10, 'mm'), 0.01);
  close(radiusToM(1, 'cm'), 0.01);
  close(durationToMin(90, 's'), 1.5);
  close(durationToMin(2, 'h'), 120);
});

test('rotary sliding distance s = 2πrN', () => {
  const r = rotarySlidingDistance(0.01, 120, 30);
  assert.equal(r.revolutions, 3600);
  close(r.distance, 226.19467105846511);
});

// Hand calculation: Δm = 12.3456 − 12.3376 g = 8 mg; V = 8 mg / 7.85 g/cm³ = 1.019108 mm³;
// s = 2π·0.010 m·(120·30) = 226.195 m; k_s = 1.019108 / (10·226.195) = 4.5054e-4 mm³/(N·m).
test('reference example: mass loss, rotary distance, specific wear rate, friction', () => {
  const r = calculatePinOnDisc(form({ frictionForce: '5.5' }))!;
  close(r.dm!, 8e-6, 1e-6);
  close(r.V * 1e9, 1.0191082802547771, 1e-6);
  close(r.s, 226.19467105846511);
  close(r.qv * 1e9, 1.0191082802547771 / 226.19467105846511, 1e-6);
  close(r.ks * 1e9, 4.5054e-4, 1e-4);
  close(r.mu!, 0.55);
});

test('known volume mode matches wear rate calculator: 1 mm³, 10 N, 1000 m', () => {
  const r = calculatePinOnDisc(form({ mode: 'volume', volume: '1', distanceEntry: 'direct', distance: '1', distanceUnit: 'km' }))!;
  close(r.qv * 1e9, 1e-3);
  close(r.ks * 1e9, 1e-4);
  assert.equal(r.mu, undefined);
});

test('direct mass loss with kg/m³ density', () => {
  const r = calculatePinOnDisc(form({ massEntry: 'direct', massLoss: '2.7', massUnit: 'mg', density: '2700', densityUnit: 'kg/m³', distanceEntry: 'direct', distance: '500', load: '20' }))!;
  close(r.V * 1e9, 1);
  close(r.ks * 1e9, 1e-4);
});

test('validation rejects zero/negative/invalid inputs and never returns NaN', () => {
  assert.equal(validatePodForm(form({ load: '0' })).load, 'positive');
  assert.equal(validatePodForm(form({ load: '-5' })).load, 'positive');
  assert.equal(validatePodForm(form({ density: '0' })).density, 'positive');
  assert.equal(validatePodForm(form({ massFinal: '13' })).massFinal, 'finalExceedsInitial');
  assert.equal(validatePodForm(form({ distanceEntry: 'direct', distance: '0' })).distance, 'positive');
  assert.equal(validatePodForm(form({ rpm: 'abc' })).rpm, 'invalid');
  assert.equal(validatePodForm(form({ frictionForce: '-1' })).frictionForce, 'nonNegative');
  assert.equal(calculatePinOnDisc(form({ load: '0' })), null);
  assert.deepEqual(validatePodForm(defaultPodForm), {});
});

test('scientific formatting', () => {
  assert.equal(formatSci(2.4e-5), '2.40 × 10⁻⁵');
  assert.equal(formatSci(226.1946), '226');
  assert.equal(formatSci(0.55), '0.55');
});
