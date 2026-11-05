import { createFileRoute } from '@tanstack/react-router';
import { CadGallery } from '@/components/gallery/CadGallery';
import { galleryQuery } from '@/lib/cadGallery.functions';
import { galleryHead } from '@/lib/cadGallery';

export const Route = createFileRoute('/araclar/teknik-resim-cad')({
  validateSearch: (search: Record<string, unknown>) => {
    const keys=['q','ch','t','cx','dim','var','mdl','s','assessment'];
    return Object.fromEntries(keys.filter(key=>typeof search[key]==='string').map(key=>[key,search[key]]));
  },
  head: ({match})=>galleryHead(match.context.language??'en'),
  loader: ({context})=>context.queryClient.ensureQueryData(galleryQuery),
  component: ()=> <CadGallery/>,
});
