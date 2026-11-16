export type Language = 'en' | 'tr';
export const defaultLanguage: Language = 'en';
export function resolveLanguage(value: unknown, pathname?: string): Language {
  if (value === 'tr' || value === 'en') return value;
  return pathname?.toLowerCase().replace(/\/$/, '') === '/yz-step' ? 'tr' : defaultLanguage;
}