import { createFileRoute } from '@tanstack/react-router';
import AiStepLanding from '@/components/site/AiStepLanding';

export const Route = createFileRoute('/ai-step')({
  head: ({ match }) => {
    const tr = match.context.language === 'tr';
    const title = tr ? 'AI STEP Editor | Doğal Dille CAD Revizyonu Konsepti' : 'AI STEP Editor | Natural-Language CAD Revision Concept';
    const description = tr ? 'STEP dosyalarında doğal dille kontrollü revizyonu hedefleyen ürün öncesi konsept. İmalat ekipleri için planlanan iş akışını keşfedin ve pilot görüşmesine katılın.' : 'Explore a pre-product concept for controlled, natural-language revisions to STEP files. Discover the planned manufacturing workflow and discuss an early-stage pilot.';
    return {
      meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { property: 'og:url', content: 'https://gmay.me/ai-step' }, { name: 'twitter:card', content: 'summary_large_image' }],
      links: [{ rel: 'canonical', href: 'https://gmay.me/ai-step' }],
    };
  },
  component: AiStepLanding,
});