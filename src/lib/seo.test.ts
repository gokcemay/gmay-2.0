import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageUrl } from './seo';
import { localizeHead } from './i18n';
import { galleryHead } from './cadGallery';

test('English and Turkish independently indexable pages keep their own canonicals', () => {
  const input = { meta: [{ title: 'Tool' }, { property: 'og:url', content: '/' }], links: [{ rel: 'canonical', href: '/' }] };
  for (const language of ['en', 'tr'] as const) {
    const head = localizeHead(input, language, '/lab/hertz-contact-calculator');
    assert.deepEqual(head.links.filter(link => link.rel === 'canonical').map(link => link.href), [pageUrl('/lab/hertz-contact-calculator', language)]);
    assert.equal(head.meta.find(meta => meta.property === 'og:url')?.content, pageUrl('/lab/hertz-contact-calculator', language));
    assert.equal(head.links.filter(link => link.rel === 'alternate').length, 3);
  }
});
test('calculator transfer parameters never enter canonical URLs', () => {
  assert.equal(pageUrl('/lab/wear-rate-calculator', 'tr'), 'https://gmay.me/lab/wear-rate-calculator?lang=tr');
});
test('gallery breadcrumbs identify the list and detail without duplicating the figure ID', () => {
  const schema = JSON.parse(galleryHead('tr', 'p0024-01').scripts[0]?.children ?? '{}');
  assert.equal(schema.itemListElement[1].item, 'https://gmay.me/araclar/teknik-resim-cad?lang=tr');
  assert.equal(schema.itemListElement[2].item, 'https://gmay.me/araclar/teknik-resim-cad/p0024-01?lang=tr');
});