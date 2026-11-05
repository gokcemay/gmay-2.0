import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { legacyDestination } from '@/lib/cadGallery';
export const Route=createFileRoute('/araclar/teknik-resim-cad_/index.html')({
  head:()=>({meta:[{title:'CAD gallery link | gmay.me'},{name:'description',content:'Open a legacy technical drawing gallery link.'},{property:'og:title',content:'CAD gallery link | gmay.me'},{property:'og:description',content:'Open a legacy technical drawing gallery link.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex'}]}),
  component:Legacy,
});
function Legacy(){useEffect(()=>{const target=new URL(legacyDestination(window.location.hash),window.location.origin);if(!target.search&&window.location.search)target.search=window.location.search;window.location.replace(target.href);},[]);return <p className="p-8">Opening gallery…</p>;}