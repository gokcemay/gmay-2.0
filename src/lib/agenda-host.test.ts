import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAgendaHome } from './agenda-host';

test('ajanda.gmay.me serves the agenda at its root, including query views and HEAD', () => {
  assert.equal(isAgendaHome(new Request('https://ajanda.gmay.me/')), true);
  assert.equal(isAgendaHome(new Request('https://ajanda.gmay.me/?year=2027')), true);
  assert.equal(isAgendaHome(new Request('https://ajanda.gmay.me/', { method: 'HEAD' })), true);
});

test('existing homepages on every other host remain unchanged', () => {
  for (const host of ['gmay.me', 'www.gmay.me', 'gmay2-0.lovable.app', 'localhost:8080', 'other.gmay.me']) {
    assert.equal(isAgendaHome(new Request(`https://${host}/`)), false);
  }
});

test('existing routes and non-document requests remain unchanged', () => {
  for (const host of ['gmay.me', 'ajanda.gmay.me']) {
    for (const path of ['/lab', '/about', '/api/public/contact', '/ajanda/index.html']) {
      assert.equal(isAgendaHome(new Request(`https://${host}${path}`)), false);
    }
  }
  assert.equal(isAgendaHome(new Request('https://ajanda.gmay.me/', { method: 'POST' })), false);
});