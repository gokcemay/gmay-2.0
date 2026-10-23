import { createFileRoute } from '@tanstack/react-router';
import CadQueryPrompt from '@/components/lab/CadQueryPrompt';

const title = 'CadQuery Prompt Üreteci · gmay.me';
const description = 'Parça fikrinizi CadQuery ile parametrik CAD modelleme için yapılandırılmış bir Claude promptuna dönüştürün. Ücretsiz, tamamen tarayıcıda çalışan Türkçe araç.';
export const Route = createFileRoute('/lab_/cadquery-prompt')({
  head: () => ({
    meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }],
    links: [{ rel: 'canonical', href: 'https://gmay.me/lab/cadquery-prompt' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }],
  }),
  component: CadQueryPrompt,
});