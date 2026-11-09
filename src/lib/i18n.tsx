import { useSearch } from '@tanstack/react-router';
import { resolveLanguage, type Language } from './language';
import { breadcrumbSchema, pageUrl, searchCopy } from './seo';

export { translate } from './translate';
import { translate } from './translate';

export function useLanguage(): Language {
  const search = useSearch({ strict: false });
  return resolveLanguage(search['lang']);
}

export function useT() {
  const language = useLanguage();
  return <T,>(value: T): T => translate(value, language);
}

type HeadData = {
  meta?: Array<Record<string, unknown>>;
  links?: Array<Record<string, unknown>>;
  scripts?: Array<Record<string, unknown>>;
};

export function localizeHead<T extends HeadData>(head: T, language: Language, path: string): T {
  const url = `https://gmay.me${path === '/' ? '/' : path}`;
  const localizedUrl = pageUrl(path, language);
  const copy = searchCopy[path]?.[language];
  const translateStructured = (value: unknown): unknown => {
    if (typeof value === 'string') return translate(value, language);
    if (Array.isArray(value)) return value.map(translateStructured);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key,
        key === 'inLanguage' && entry === 'tr-TR' ? (language === 'en' ? 'en' : 'tr-TR') : key === 'url' && entry === url ? localizedUrl : translateStructured(entry),
      ]));
    }
    return value;
  };
  const title = copy?.title ?? translate(String(head.meta?.find(meta => typeof meta['title'] === 'string')?.['title'] ?? ''), language);
  const scripts = head.scripts?.map(script => {
    if (script['type'] !== 'application/ld+json' || typeof script['children'] !== 'string') return script;
    try { return { ...script, children: JSON.stringify(translateStructured(JSON.parse(script['children']))) }; }
    catch { return script; }
  }) ?? [];
  if (path !== '/' && head.links?.some(link => link['rel'] === 'canonical') && !scripts.some(script => String(script['children']).includes('BreadcrumbList'))) {
    scripts.push({ type: 'application/ld+json', children: JSON.stringify(breadcrumbSchema(path, language, title)) });
  }
  return {
    ...head,
    meta: head.meta?.filter(meta => meta['property'] !== 'og:image' && meta['name'] !== 'twitter:image').map<Record<string, unknown>>(meta => ({
      ...meta,
      ...(typeof meta['title'] === 'string' ? { title } : {}),
      ...(typeof meta['content'] === 'string' && ['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description'].includes(String(meta['name'] ?? meta['property'])) ? { content: copy ? (String(meta['name'] ?? meta['property']).endsWith('title') ? copy.title : copy.description) : translate(meta['content'], language) } : {}),
      ...(meta['property'] === 'og:url' ? { content: localizedUrl } : {}),
    })).concat(head.links?.some(link => link['rel'] === 'canonical') && !head.meta?.some(meta => meta['property'] === 'og:url') ? [{ property: 'og:url', content: localizedUrl }] : []),
    links: [
      ...(head.links?.filter(link => link['rel'] !== 'canonical' && !(link['rel'] === 'alternate' && link['hrefLang'])) ?? []),
      ...(head.links?.some(link => link['rel'] === 'canonical') ? [
        { rel: 'canonical', href: localizedUrl },
        { rel: 'alternate', hrefLang: 'en', href: url },
        { rel: 'alternate', hrefLang: 'tr', href: `${url}?lang=tr` },
        { rel: 'alternate', hrefLang: 'x-default', href: url },
      ] : []),
    ],
    scripts,
  };
}