import { Link } from '@tanstack/react-router';
import { useLanguage } from '@/lib/i18n';
import { Section } from './Section';

export function RelatedKnowledge() {
  const tr = useLanguage() === 'tr';
  return <Section>
    <h2 className="font-display text-xl font-semibold text-foreground">{tr ? 'İlgili araçlar ve kaynaklar' : 'Related tools and resources'}</h2>
    <ul className="mt-5 flex max-w-4xl flex-wrap gap-x-6 gap-y-3 text-sm text-foreground">
      <li><Link to="/lab" className="underline underline-offset-4">{tr ? 'Mühendislik hesaplayıcıları ve AI araçları' : 'Engineering calculators and AI tools'}</Link></li>
      <li><Link to="/research" className="underline underline-offset-4">{tr ? 'Triboloji araştırmaları' : 'Tribology research'}</Link></li>
      <li><Link to="/articles" className="underline underline-offset-4">{tr ? 'Mühendislik ve yapay zekâ yazıları' : 'Engineering and AI articles'}</Link></li>
      <li><Link to="/egitim" className="underline underline-offset-4">{tr ? 'Mühendisler için AI eğitimi ve danışmanlık' : 'AI training for engineers and consulting'}</Link></li>
      <li><Link to="/kitaplar" className="underline underline-offset-4">{tr ? 'Mühendislik ve araştırma kitapları' : 'Engineering and research books'}</Link></li>
    </ul>
  </Section>;
}