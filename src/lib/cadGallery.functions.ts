import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { queryOptions } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { GALLERY_BASE, type Catalog, type Counts } from './cadGallery';

export const getGallery = createServerFn({ method: 'GET' }).handler(async (): Promise<{catalog: Catalog; counts: Record<string,Counts>; votesUnavailable: boolean}> => {
  const request = getRequest();
  const response = await fetch(new URL(`${GALLERY_BASE}catalog.json`, request.url));
  if (!response.ok) throw new Error('Catalog unavailable');
  const catalog: Catalog = await response.json();
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return {catalog, counts:{}, votesUnavailable:true};
  const client = createClient<Database>(url, key, {auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{
    const headers=new Headers(init?.headers); if(key.startsWith('sb_')&&headers.get('Authorization')===`Bearer ${key}`)headers.delete('Authorization');headers.set('apikey',key);return fetch(input,{...init,headers});
  }}});
  const {data,error} = await client.rpc('vote_counts');
  const counts: Record<string,Counts> = {};
  for (const row of data ?? []) counts[row.figure_id] = {correct:Number(row.correct),incorrect:Number(row.incorrect)};
  return { catalog, counts, votesUnavailable:Boolean(error) };
});
export const galleryQuery = queryOptions({queryKey:['cad-gallery'],queryFn:()=>getGallery(), staleTime:30_000});