import { createFileRoute, notFound } from '@tanstack/react-router';
import { CadGallery } from '@/components/gallery/CadGallery';
import { galleryQuery } from '@/lib/cadGallery.functions';
import { galleryHead } from '@/lib/cadGallery';
export const Route=createFileRoute('/araclar/teknik-resim-cad_/$id')({
  head:({match,params,loaderData})=>{
    const head=galleryHead(match.context.language??'en',params.id);
    if(!loaderData) head.meta.push({name:'robots',content:'noindex'});
    return head;
  },
  loader:async({context,params})=>{
    const data=await context.queryClient.ensureQueryData(galleryQuery);
    if(!data.catalog.items.some(item=>item.id===params.id)) throw notFound();
    return data;
  },
  component:Detail,
});
function Detail(){const {id}=Route.useParams();return <CadGallery id={id}/>;}
