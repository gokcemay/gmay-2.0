import { describe, expect, test } from 'bun:test';
import { buildCadPrompt, emptyForm, exampleForm, restoreForm, slug, validForm } from './cadquery';

describe('CadQuery specification rules', () => {
  test('required part name prevents export when missing', () => {
    expect(validForm({ ...exampleForm(), name: '' })).toBe(false);
  });
  test('required purpose prevents export when missing', () => {
    expect(validForm({ ...exampleForm(), purpose: '  ' })).toBe(false);
  });
  test('the L bracket example has all four concrete dimensions', () => {
    expect(exampleForm().dimensions.map(d => [d.name, d.value, d.unit])).toEqual([['Yatay kol', '60', 'mm'], ['Dikey kol', '50', 'mm'], ['Genişlik', '40', 'mm'], ['Kalınlık', '5', 'mm']]);
  });
  test('the example has four M6 clearance holes and STEP/STL exports', () => {
    const f = exampleForm();
    expect(f.holes[0]).toEqual({ type: 'Geçme deliği', size: 'M6 (Ø6,6)', count: '4', position: 'her kolda 2 adet, aralık 25 mm, delik ekseni kol ucundan 15 mm içeride' });
    expect(f.formats).toEqual(['STEP', 'STL']);
  });
  test('unknown dimensions must ask for a marked assumption, not use old values', () => {
    const f = exampleForm(); f.dimensions[0].unknown = true;
    const prompt = buildCadPrompt(f);
    expect(prompt).toContain('Yatay kol: BİLİNMİYOR — makul bir değer öner, parametre olarak tanımla ve yorumda "VARSAYIM" diye işaretle');
    expect(prompt).not.toContain('Yatay kol: 60 mm');
  });
  test('viewer selection controls OCP integration', () => {
    expect(buildCadPrompt(exampleForm())).toContain('`show(...)`');
    expect(buildCadPrompt({ ...exampleForm(), viewer: 'Yok' })).not.toContain('`show(...)`');
  });
  test('Claude Code requests execution instead of chat-only output', () => {
    const prompt = buildCadPrompt({ ...exampleForm(), environment: 'Claude Code' });
    expect(prompt).toContain('Kodu kendin çalıştır; hata alırsan düzelt');
    expect(prompt).not.toContain('Kodu tek bir Python dosyası olarak ver');
  });
  test('Turkish names become ASCII snake case', () => {
    expect(slug('İç Ölçü Şaşırtıcı Çığ')).toBe('ic_olcu_sasirtici_cig');
    expect(slug('L braket')).toBe('l_braket');
  });
  test('stored data round trips and corrupted data is ignored', () => {
    expect(restoreForm(JSON.stringify(exampleForm()))).toEqual(exampleForm());
    expect(restoreForm('{broken')).toBe(null);
    expect(restoreForm(JSON.stringify({ ...exampleForm(), dimensions: [null] }))).toBe(null);
  });
  test('clear defaults reset all user content', () => {
    const f = emptyForm();
    expect(f.name).toBe(''); expect(f.purpose).toBe(''); expect(f.dimensions).toEqual([]); expect(f.holes).toEqual([]); expect(f.notes).toBe('');
    expect(f.formats).toEqual(['STEP', 'STL']); expect(f.rules).toHaveLength(6);
  });
});