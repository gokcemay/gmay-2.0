import { useRouter, useLocation } from '@tanstack/react-router';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/language';

export function LanguageSelector() {
  const language = useLanguage();
  const router = useRouter();
  const location = useLocation();
  const select = (next: Language) => {
    void router.navigate({
      to: location.pathname,
      search: prev => ({ ...prev, lang: next === 'tr' ? 'tr' : 'en' }),
      hash: location.hash,
      replace: true,
      resetScroll: false,
    });
  };
  return (
    <div role="group" aria-label={language === 'en' ? 'Language' : 'Dil'} className="flex shrink-0 items-center gap-0.5">
      <Globe size={15} className="mr-1 text-muted-foreground" aria-hidden="true" />
      <Button size="sm" variant={language === 'en' ? 'secondary' : 'ghost'} aria-label="English" aria-pressed={language === 'en'} onClick={() => select('en')} className="h-8 px-2 font-mono text-xs">EN</Button>
      <Button size="sm" variant={language === 'tr' ? 'secondary' : 'ghost'} aria-label="Türkçe" aria-pressed={language === 'tr'} onClick={() => select('tr')} className="h-8 px-2 font-mono text-xs">TR</Button>
    </div>
  );
}