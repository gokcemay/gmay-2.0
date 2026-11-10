import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageUrl } from './seo';
import { localizeHead } from './i18n';
import { galleryHead } from './cadGallery';

test('English and Turkish views consolidate to the same clean route canonical', () => {
  const input = { meta: [{ title: 'Tool' }, { property: 'og:url', content: '/' }], links: [{ rel: 'canonical', href: '/' }] };
  for (const language of ['en', 'tr'] as const) {
    const head = localizeHead(input, language, '/lab/hertz-contact-calculator');
    assert.deepEqual(head.links.filter(link => link.rel === 'canonical').map(link => link.href), ['https://gmay.me/lab/hertz-contact-calculator']);
    assert.equal(head.meta.find(meta => meta.property === 'og:url')?.content, 'https://gmay.me/lab/hertz-contact-calculator');
    assert.equal(head.links.filter(link => link.rel === 'alternate').length, 0);
  }
});
test('calculator transfer parameters never enter canonical URLs', () => {
  assert.equal(pageUrl('/lab/wear-rate-calculator?lang=tr&distance=100&utm_source=test', 'tr'), 'https://gmay.me/lab/wear-rate-calculator');
});
test('gallery breadcrumbs identify the list and detail without duplicating the figure ID', () => {
  const schema = JSON.parse(galleryHead('tr', 'p0024-01').scripts[0]?.children ?? '{}');
  assert.equal(schema.itemListElement[1].item, 'https://gmay.me/araclar/teknik-resim-cad');
  assert.equal(schema.itemListElement[2].item, 'https://gmay.me/araclar/teknik-resim-cad/p0024-01');
});
test('the sitemap contains only clean canonical routes', async () => {
  const { readFile } = await import('node:fs/promises');
  const xml = await readFile(new URL('../../public/sitemap.xml', import.meta.url), 'utf8');
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), match => match[1]);
  assert.equal(urls.length, 287);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every(url => url && !url.includes('?') && !url.includes('/r/')));
  for (const path of ['/', '/egitim', '/lab', '/kitaplar', '/lab/hertz-contact-calculator', '/lab/wear-rate-calculator']) assert.ok(urls.includes(`https://gmay.me${path}`));
});