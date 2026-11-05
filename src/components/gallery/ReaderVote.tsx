import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { adjustCounts, VOTE_RULES, type Counts, type Vote } from '@/lib/cadGallery';
import { galleryQuery } from '@/lib/cadGallery.functions';

export function ReaderVote({id,counts,english}:{id:string;counts:Counts;english:boolean}) {
  const [voter,setVoter]=useState<string>();const [selected,setSelected]=useState<Vote>(0);const [note,setNote]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const queryClient=useQueryClient();
  useEffect(()=>{
    try {let value=localStorage.getItem('gmay-cad-voter');if(!value||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(value)){value=crypto.randomUUID();localStorage.setItem('gmay-cad-voter',value);}setVoter(value);const saved=Number(localStorage.getItem(`gmay-cad-vote:${id}`));setSelected(saved===1||saved===-1?saved:0);}catch{setError(english?'Browser storage is unavailable; voting is disabled.':'Tarayıcı depolaması kullanılamıyor; oylama kapalı.');}
    setNote('');
  },[id,english]);
  const send=async(next:Vote,noteOnly=false)=>{
    if(!voter||busy)return;
    const before=selected;const snapshot=queryClient.getQueryData(galleryQuery.queryKey);setBusy(true);setError('');setSelected(next);
    if(!noteOnly)queryClient.setQueryData(galleryQuery.queryKey,(data:typeof snapshot)=>data?{...data,counts:{...data.counts,[id]:adjustCounts(data.counts[id]??{correct:0,incorrect:0},before,next)}}:data);
    try{
      const {error:failure}=await supabase.rpc('cast_vote',{figure_id:id,voter_id:voter,vote:next,note:next===-1?note:null});
      if(failure)throw failure;
      try{localStorage.setItem(`gmay-cad-vote:${id}`,String(next));}catch{}
      await queryClient.invalidateQueries({queryKey:galleryQuery.queryKey});
    }catch{setSelected(before);if(snapshot)queryClient.setQueryData(galleryQuery.queryKey,snapshot);setError(english?'Vote could not be saved. Try again shortly.':'Oy kaydedilemedi. Biraz sonra tekrar deneyin.');}
    finally{setBusy(false);}
  };
  return <section className="border-t border-border py-5" aria-label={english?'Reader assessment':'Okur değerlendirmesi'}>
    <h3 className="font-display font-semibold">{english?'Does this model match the drawing in the book?':'Bu model kitaptaki çizimle uyuşuyor mu?'}</h3>
    <div className="my-3 flex gap-3"><Button disabled={!voter||busy} aria-pressed={selected===1} variant={selected===1?'default':'outline'} onClick={()=>void send(selected===1?0:1)}><Check/>{english?'Correct':'Doğru'}</Button><Button disabled={!voter||busy} aria-pressed={selected===-1} variant={selected===-1?'destructive':'outline'} onClick={()=>void send(selected===-1?0:-1)}><X/>{english?'Incorrect':'Yanlış'}</Button></div>
    <p className="text-sm text-muted-foreground" aria-live="polite">{english?`${counts.correct} voted correct, ${counts.incorrect} voted incorrect`:`${counts.correct} kişi doğru, ${counts.incorrect} kişi yanlış dedi`}</p>
    {selected===-1&&<div className="mt-4"><label className="block text-sm" htmlFor="vote-note">{english?'What is wrong? (optional, up to 280 characters)':'Ne yanlış? (isteğe bağlı, en çok 280 karakter)'}</label><textarea id="vote-note" maxLength={VOTE_RULES.maxNote} value={note} onChange={e=>setNote(e.target.value)} className="mt-2 w-full rounded border border-input bg-background p-3"/><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{english?'Only the site owner can read this note.':'Bu notu yalnızca site sahibi okuyabilir.'}</p><Button size="sm" variant="outline" disabled={busy} onClick={()=>void send(-1,true)}>{english?'Save note':'Notu kaydet'}</Button></div></div>}
    {error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}