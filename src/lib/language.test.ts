import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultLanguage, resolveLanguage } from './language';
import { buildCadPrompt, exampleForm } from './cadquery';

test('the default opening language is English', () => {
  assert.equal(defaultLanguage, 'en');
  assert.equal(resolveLanguage(undefined), 'en');
  assert.equal(resolveLanguage('unsupported'), 'en');
});
test('Turkish remains an explicit alternative', () => {
  assert.equal(resolveLanguage('tr'), 'tr');
  assert.equal(resolveLanguage('en'), 'en');
});

test('CadQuery generates English specifications without changing dimensions or hole counts', () => {
  const form = exampleForm('en');
  const prompt = buildCadPrompt(form, 'en');
  assert.ok(prompt.includes('Dimensions (mm):'));
  assert.ok(prompt.includes('Horizontal arm: 60 mm'));
  assert.ok(prompt.includes('4 × Clearance hole'));
  assert.equal(form.dimensions[0]?.unit, 'mm');
  assert.equal(form.type, exampleForm('tr').type);
});
