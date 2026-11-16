import { createFileRoute } from '@tanstack/react-router';
import AiStepLanding from '@/components/site/AiStepLanding';

export const Route = createFileRoute('/yz-step')({
  head: ({ match }) => {
    const tr = match.context.language === 'tr';
    const title = tr ? 'AI STEP Editor | Yapay Zekâ ile STEP Revizyonu Konsepti' : 'AI STEP Editor | AI-Assisted STEP Revision Concept';
    const description = tr ? 'STEP dosyalarında doğal dille kontrollü CAD revizyonu için ürün öncesi konsept. Planlanan iş akışını, temsili revizyonları ve mühendislik kontrollerini keşfedin.' : 'Discover a pre-product concept for controlled CAD revisions to STEP files using natural language, with illustrative revisions and engineering checks.';
    return {
      meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: 'https://gmay.me/yz-step' }, { name: 'twitter:card', content: 'summary_large_image' }],
      links: [{ rel: 'canonical', href: 'https://gmay.me/yz-step' }],
    };
  },
  component: AiStepLanding,
});