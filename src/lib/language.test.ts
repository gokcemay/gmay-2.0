import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultLanguage, resolveLanguage } from './language';

test('the default opening language is English', () => {
  assert.equal(defaultLanguage, 'en');
  assert.equal(resolveLanguage(undefined), 'en');
  assert.equal(resolveLanguage('unsupported'), 'en');
});
test('Turkish remains an explicit alternative', () => {
  assert.equal(resolveLanguage('tr'), 'tr');
  assert.equal(resolveLanguage('en'), 'en');
});
