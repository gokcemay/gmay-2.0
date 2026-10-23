export type Language = 'en' | 'tr';
export const defaultLanguage: Language = 'en';
export function resolveLanguage(value: unknown): Language {
  return value === 'tr' ? 'tr' : defaultLanguage;
}