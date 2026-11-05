import { createFileRoute } from '@tanstack/react-router';
import { CadGallery } from '@/components/gallery/CadGallery';
import { galleryQuery } from '@/lib/cadGallery.functions';
import { galleryHead } from '@/lib/cadGallery';
export const Route=createFileRoute('/araclar/teknik-resim-cad_/$id')({
  head:({match,params})=>galleryHead(match.context.language??'en',params.id),
  loader:({context})=>context.queryClient.ensureQueryData(galleryQuery),
  component:Detail,
});
function Detail(){const {id}=Route.useParams();return <CadGallery id={id}/>;}