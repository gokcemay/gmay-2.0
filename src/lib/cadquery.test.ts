import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCadPrompt, emptyForm, exampleForm, restoreForm, slug, validForm } from './cadquery';

describe('CadQuery specification rules', () => {
  test('required part name prevents export when missing', () => {
    assert.equal(validForm({ ...exampleForm(), name: '' }), false);
  });
  test('required purpose prevents export when missing', () => {
    assert.equal(validForm({ ...exampleForm(), purpose: '  ' }), false);
  });
  test('the L bracket example has all four concrete dimensions', () => {
    assert.deepEqual(exampleForm().dimensions.map(d => [d.name, d.value, d.unit]), [['Yatay kol', '60', 'mm'], ['Dikey kol', '50', 'mm'], ['Genişlik', '40', 'mm'], ['Kalınlık', '5', 'mm']]);
  });
  test('the example has four M6 clearance holes and STEP/STL exports', () => {
    const f = exampleForm();
    assert.deepEqual(f.holes[0], { type: 'Geçme deliği', size: 'M6 (Ø6,6)', count: '4', position: 'her kolda 2 adet, aralık 25 mm, delik ekseni kol ucundan 15 mm içeride' });
    assert.deepEqual(f.formats, ['STEP', 'STL']);
  });
  test('unknown dimensions must ask for a marked assumption, not use old values', () => {
    const f = exampleForm(); const first = f.dimensions[0]; assert.ok(first); first.unknown = true;
    const prompt = buildCadPrompt(f);
    assert.ok(prompt.includes('Yatay kol: BİLİNMİYOR — makul bir değer öner, parametre olarak tanımla ve yorumda "VARSAYIM" diye işaretle'));
    assert.ok(!prompt.includes('Yatay kol: 60 mm'));
  });
  test('viewer selection controls OCP integration', () => {
    assert.ok(buildCadPrompt(exampleForm()).includes('`show(...)`'));
    assert.ok(!buildCadPrompt({ ...exampleForm(), viewer: 'Yok' }).includes('`show(...)`'));
  });
  test('Claude Code requests execution instead of chat-only output', () => {
    const prompt = buildCadPrompt({ ...exampleForm(), environment: 'Claude Code' });
    assert.ok(prompt.includes('Kodu kendin çalıştır; hata alırsan düzelt'));
    assert.ok(!prompt.includes('Kodu tek bir Python dosyası olarak ver'));
  });
  test('Turkish names become ASCII snake case', () => {
    assert.equal(slug('İç Ölçü Şaşırtıcı Çığ'), 'ic_olcu_sasirtici_cig');
    assert.equal(slug('L braket'), 'l_braket');
  });
  test('stored data round trips and corrupted data is ignored', () => {
    assert.deepEqual(restoreForm(JSON.stringify(exampleForm())), exampleForm());
    assert.equal(restoreForm('{broken'), null);
    assert.equal(restoreForm(JSON.stringify({ ...exampleForm(), dimensions: [null] })), null);
  });
  test('clear defaults reset all user content', () => {
    const f = emptyForm();
    assert.equal(f.name, ''); assert.equal(f.purpose, ''); assert.deepEqual(f.dimensions, []); assert.deepEqual(f.holes, []); assert.equal(f.notes, '');
    assert.deepEqual(f.formats, ['STEP', 'STL']); assert.equal(f.rules.length, 6);
  });
});