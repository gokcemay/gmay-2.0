export const GALLERY_BASE = '/araclar/teknik-resim-cad/';
export const VOTE_RULES = { minimumVotes: 5, correctRatio: 0.8, maxNote: 280, perMinute: 30 } as const;
export type Vote = -1 | 0 | 1;
export type Counts = { correct: number; incorrect: number };
export type Figure = {
  id: string; page: number; pdf_page: number; type: string; problem_no: string | null;
  chapter: number; note: string | null; complexity: number | null; has_dimensions: boolean;
  dims_visible: string[]; variants: string[]; steps: number; status: string;
  bbox_mm: number[] | null; solids: number | null; failure_types: string[];
  comparison: string | null; main_review: string | null; review_note: string | null; prompt: string;
  files: { crop: string; preview?: string; preview_svg?: string; step?: string; stl?: string; code?: string };
};
export type Catalog = { book: { title: string; author: string; license: string; license_url: string; source_url: string }; items: Figure[]; count: number };
export const assetUrl = (path: string) => `${GALLERY_BASE}${path}`;
export const isVerified = (counts: Counts) => counts.correct + counts.incorrect >= VOTE_RULES.minimumVotes && counts.correct / (counts.correct + counts.incorrect) >= VOTE_RULES.correctRatio;
export const canVote = (figure: Pick<Figure, 'status' | 'files'>) => figure.status !== 'failed' && Boolean(figure.files.stl);
export function adjustCounts(counts: Counts, before: Vote, after: Vote): Counts {
  return { correct: Math.max(0, counts.correct - Number(before === 1) + Number(after === 1)), incorrect: Math.max(0, counts.incorrect - Number(before === -1) + Number(after === -1)) };
}
export function normalizeSearch(value: string): string { return value.toLocaleLowerCase('tr').replaceAll('ı','i').normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
export function legacyDestination(hash: string): string {
  const raw = hash.replace(/^#\/?/, '');
  const [id, query] = raw.split('?');
  const path = /^p\d{4}-\d{2}$/.test(id ?? '') ? `${GALLERY_BASE}${id}` : GALLERY_BASE.slice(0,-1);
  return `${path}${query ? `?${query}` : ''}`;
}
export function galleryHead(language: string, id?: string) {
  const title = language === 'tr' ? `Teknik Resimden CAD'e${id ? ` — ${id}` : ''} | gmay.me` : `From Technical Drawing to CAD${id ? ` — ${id}` : ''} | gmay.me`;
  const description = language === 'tr' ? 'Nejat Kıraç’ın teknik resim çizimleri, 3B modeller, CadQuery kodu ve okur değerlendirmeleri.' : 'Technical drawings by Nejat Kıraç, 3D models, CadQuery code and reader assessments.';
  return { meta: [{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}], links:[{rel:'canonical',href:`https://gmay.me${GALLERY_BASE.slice(0,-1)}${id ? `/${id}` : ''}${language === 'tr' ? '?lang=tr' : ''}`}] };
}