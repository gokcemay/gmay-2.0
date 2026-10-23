import { english } from './translations';
import type { Language } from './language';

export function translate<T>(value: T, language: Language): T {
  if (typeof value !== 'string' || language === 'tr') return value;
  const key = value.replace(/\s+/g, ' ').trim();
  const result = english[key];
  if (result === undefined) return value;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  return (leading + result + trailing) as T;
}

export function localizeSummary(value: string, language: Language): string {
  if (language === 'tr') return value;
  return value.split('\n').map(line => {
    if (line.startsWith('Toplam kayma mesafesi (SI):')) return line.replace('Toplam kayma mesafesi (SI):', 'Total sliding distance (SI):');
    if (line.startsWith('N = ')) return line.replace(' devir', ' revolutions').replace(' çevrim', ' cycles');
    return translate(line, language);
  }).join('\n');
}
