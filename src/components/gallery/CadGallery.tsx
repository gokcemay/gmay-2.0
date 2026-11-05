import { lazy, Suspense, useEffect, useState } from 'react';
import { ClientOnly, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Check, Copy, Download, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n';
import { assetUrl, canVote, isVerified, normalizeSearch, type Figure, type Counts } from '@/lib/cadGallery';
import { galleryQuery } from '@/lib/cadGallery.functions';
import { ReaderVote } from './ReaderVote';

const StlViewer=lazy(()=>import('./StlViewer'));
const zero:Counts={correct:0,incorrect:0};
export function CadGallery({id}:{id?:string}) {
  const {data}=useSuspenseQuery(galleryQuery);const english=useLanguage()==='en';
  const t=(tr:string,en:string)=>english?en:tr;
  const search=useSearch({strict:false}) as Record<string,unknown>;
  const navigate=useNavigate();
  const [preview,setPreview]=useState<{url:string;title:string}>();const [copied,setCopied]=useState('');const [dark,setDark]=useState(false);const [code,setCode]=useState('');
  useEffect(()=>{try{setDark(localStorage.getItem('tema')==='dark');}catch{}},[]);
  const figure=data.catalog.items.find(item=>item.id===id);
  useEffect(()=>{setCode('');if(!figure?.files.code)return;const controller=new AbortController();void fetch(assetUrl(figure.files.code),{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error();return response.text();}).then(setCode).catch(()=>{if(!controller.signal.aborted)setCode(english?'Code unavailable':'Kod yüklenemedi');});return()=>controller.abort();},[figure,english]);
  const copy=async(value:string,key:string)=>{try{await navigator.clipboard.writeText(value);setCopied(key);setTimeout(()=>setCopied(''),2000);}catch{setCopied('error');}};
  const setFilter=(key:string,value:string|boolean)=>{
    void navigate({to:'/araclar/teknik-resim-cad',search:(previous)=>({...previous,[key]:value||undefined}),replace:true});
  };
  const countFor=(item:Figure)=>data.counts[item.id]??zero;
  const filtered=data.catalog.items.filter(item=>{
    const text=normalizeSearch([item.problem_no,item.type,item.note,item.page,...item.dims_visible].join(' '));
    if(!normalizeSearch(String(search['q']??'')).split(/\s+/).every(term=>text.includes(term)))return false;
    if(search['ch']&&String(item.chapter)!==String(search['ch']))return false;
    if(search['t']&&item.type!==search['t'])return false;
    if(search['cx']&&String(item.complexity)!==String(search['cx']))return false;
    if(search['dim']&&!item.has_dimensions||search['var']&&!item.variants.length||search['mdl']&&!item.files.stl)return false;
    const votes=countFor(item);const total=votes.correct+votes.incorrect;
    if(search['assessment']==='correct'&&!(votes.correct>votes.incorrect))return false;
    if(search['assessment']==='incorrect'&&!(votes.incorrect>votes.correct))return false;
    if(search['assessment']==='none'&&total!==0)return false;
    return true;
  }).sort((a,b)=>search['s']==='votes'?(countFor(b).correct+countFor(b).incorrect)-(countFor(a).correct+countFor(a).incorrect)||a.pdf_page-b.pdf_page:search['s']==='karmasiklik'?(a.complexity??6)-(b.complexity??6)||a.pdf_page-b.pdf_page:a.pdf_page-b.pdf_page);
  const image=(url:string,title:string,className='h-56')=><Button variant="ghost" className={`h-auto w-full p-0 ${className}`} aria-label={t('Önizlemeyi büyüt','Enlarge preview')} onClick={()=>setPreview({url,title})}><img src={url} alt={title} loading="lazy" className="h-full w-full object-contain"/></Button>;
  const attribution=<p className="mt-3 text-xs leading-relaxed text-muted-foreground">{data.catalog.book.author} · <a className="underline" href={data.catalog.book.source_url} target="_blank" rel="noreferrer">{data.catalog.book.title}</a> · <a className="underline" href={data.catalog.book.license_url} target="_blank" rel="noreferrer">{data.catalog.book.license}</a></p>;
  const badge=(item:Figure)=><>{item.status==='failed'?<span className="text-xs text-destructive">{t('Model üretilemedi','Model could not be generated')}</span>:isVerified(countFor(item))?<span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-3"/>{t('Okurlarca doğrulandı','Verified by readers')}</span>:null}</>;
  const fieldClass='mt-1 h-10 w-full min-w-0 rounded border border-input bg-background px-3 text-sm';
  const select=(key:string,label:string,options:Array<[string,string]>)=><label className="min-w-0 text-xs font-medium">{label}<select className={fieldClass} value={String(search[key]??'')} onChange={e=>setFilter(key,e.target.value)}>{options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>;
  const index=figure?data.catalog.items.indexOf(figure):-1;
  return <div className={dark?'dark bg-background text-foreground':'bg-background text-foreground'}><div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
    <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs uppercase text-muted-foreground">Engineering Lab / CAD</p><h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{t("Teknik Resimden CAD'e",'From Technical Drawing to CAD')}</h1></div><Button size="icon" variant="outline" title={t('Temayı değiştir','Toggle theme')} onClick={()=>{setDark(!dark);try{localStorage.setItem('tema',!dark?'dark':'light');}catch{}}}>{dark?<Sun/>:<Moon/>}</Button></div>
    <p className="my-6 border-l-2 border-primary bg-muted px-4 py-4 text-sm leading-relaxed">{t('Modeller yapay zekâyla üretildi ve yazar tarafından tek tek doğrulanmadı. Bir modeli çizimle karşılaştırdıysanız değerlendirmenizi bırakın.','Models were generated with AI and have not been individually verified by the author. If you have compared a model with its drawing, leave your assessment.')}</p>
    {data.votesUnavailable&&<p role="alert" className="mb-4 text-sm text-destructive">{t('Oy sayıları şu anda yüklenemiyor.','Vote counts are currently unavailable.')}</p>}
    {!id?<>
      <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium">{t('Ara','Search')}<input className={fieldClass} value={String(search['q']??'')} onChange={e=>setFilter('q',e.target.value)} placeholder={t('Problem, sayfa, ölçü…','Problem, page, dimension…')}/></label>
        {select('ch',t('Bölüm','Chapter'),[['',t('Tümü','All')],...[...new Set(data.catalog.items.map(item=>item.chapter))].sort().map(ch=>[String(ch),String(ch)] as [string,string])])}
        {select('t',t('Çizim türü','Drawing type'),[['',t('Tümü','All')],['izometrik',t('İzometrik','Isometric')],['kabinet',t('Kabinet','Cabinet')],['kavaliyer',t('Kavaliyer','Cavalier')],['perspektif',t('Perspektif','Perspective')]])}
        {select('cx',t('Karmaşıklık','Complexity'),[['',t('Tümü','All')],...Array.from({length:5},(_,i)=>[String(i+1),String(i+1)] as [string,string])])}
        {select('assessment',t('Okur değerlendirmesi','Reader assessment'),[['',t('Tümü','All')],['correct',t('Doğru bulunanlar','Rated correct')],['incorrect',t('Yanlış bulunanlar','Rated incorrect')],['none',t('Henüz oy almamış','Not yet rated')]])}
        {select('s',t('Sıralama','Sort'),[['',t('Sayfa sırası','Page order')],['votes',t('En çok oy alan','Most votes')],['karmasiklik',t('Basitten karmaşığa','Simple to complex')]])}
        <div className="col-span-full flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">{[['dim',t('Ölçülü çizimler','Dimensioned drawings')],['var',t('Varyantı olanlar','With variants')],['mdl',t('3B modeli olanlar','With 3D models')]].map(([key,label])=><label className="flex items-center gap-2" key={key}><input type="checkbox" checked={Boolean(search[key])} onChange={e=>setFilter(key,e.target.checked?'1':'')}/>{label}</label>)}<Button variant="ghost" size="sm" onClick={()=>void navigate({to:'/araclar/teknik-resim-cad',search:{lang:search['lang'] as string|undefined},replace:true})}>{t('Filtreleri temizle','Clear filters')}</Button></div>
      </div>
      <p className="my-5 font-mono text-xs text-muted-foreground" aria-live="polite">{filtered.length} / {data.catalog.count} {t('çizim','drawings')}</p>
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(item=><article key={item.id} className="overflow-hidden rounded border border-border bg-card">
        <Link to="/araclar/teknik-resim-cad/$id" params={{id:item.id}} className="block bg-card"><img src={assetUrl(item.files.crop)} alt={`${item.problem_no??item.id}`} loading="lazy" className="h-52 w-full object-contain p-3"/></Link>
        <div className="border-t border-border p-4"><div className="flex items-center justify-between gap-2"><h2 className="font-display font-semibold"><Link to="/araclar/teknik-resim-cad/$id" params={{id:item.id}}>{item.problem_no??item.id}</Link></h2><span className="text-xs text-muted-foreground">{t('Sayfa','Page')} {item.page}</span></div><p className="my-2 text-xs text-muted-foreground">{item.type} · {t('Karmaşıklık','Complexity')} {item.complexity??'—'}</p>{badge(item)}{countFor(item).correct+countFor(item).incorrect>0&&<p className="mt-2 font-mono text-xs">✓ {countFor(item).correct} · ✗ {countFor(item).incorrect}</p>}<p className="mt-3 text-[10px] text-muted-foreground">Nejat Kıraç · CC BY-NC-SA 4.0</p></div>
      </article>)}</div>
      {!filtered.length&&<p className="py-16 text-center text-muted-foreground">{t('Bu filtrelerle eşleşen çizim bulunamadı.','No drawings match these filters.')}</p>}
    </>:!figure?<div className="py-12"><h2>{t('Çizim bulunamadı','Drawing not found')}</h2><Link to="/araclar/teknik-resim-cad" className="underline">{t('Galeriye dön','Back to gallery')}</Link></div>:<>
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm"><Link to="/araclar/teknik-resim-cad" className="underline">← {t('Galeriye dön','Back to gallery')}</Link><div className="flex gap-5">{index>0&&<Link to="/araclar/teknik-resim-cad/$id" params={{id:data.catalog.items[index-1]?.id??figure.id}}>← {t('Önceki','Previous')}</Link>}{index<data.catalog.items.length-1&&<Link to="/araclar/teknik-resim-cad/$id" params={{id:data.catalog.items[index+1]?.id??figure.id}}>{t('Sonraki','Next')} →</Link>}</div></nav>
      <h2 className="mb-5 font-display text-2xl font-semibold">{figure.problem_no??figure.id} <span className="text-base font-normal text-muted-foreground">· {t('Sayfa','Page')} {figure.page}</span></h2>
      <div className="grid items-start gap-8 lg:grid-cols-2"><section><h3 className="mb-3 font-semibold">{t('Kitaptaki çizim','Drawing in the book')}</h3>{image(assetUrl(figure.files.crop),figure.problem_no??figure.id,'h-[380px]')}{attribution}<dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><dt>{t('Tür','Type')}</dt><dd>{figure.type}</dd><dt>{t('Karmaşıklık','Complexity')}</dt><dd>{figure.complexity??'—'}</dd><dt>{t('Görünen ölçüler','Visible dimensions')}</dt><dd>{figure.dims_visible.join(', ')||'—'}</dd></dl>{figure.note&&<p lang="tr" className="mt-4 text-sm leading-relaxed text-muted-foreground">{figure.note}</p>}{figure.steps>0&&<p className="mt-3 text-sm">{figure.steps} {t('yapım adımı çizimi','construction-step drawings')}</p>}</section>
      <section><div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold">{t('3B model','3D model')}</h3>{badge(figure)}</div>
        {figure.files.stl?<ClientOnly fallback={<div className="h-[380px] bg-muted"/>}><Suspense fallback={<div className="flex h-[380px] items-center justify-center bg-muted">{t('Model yükleniyor…','Loading model…')}</div>}><StlViewer url={assetUrl(figure.files.stl)} fallback={figure.files.preview?assetUrl(figure.files.preview):undefined} english={english}/></Suspense></ClientOnly>:<div className="flex h-52 items-center justify-center bg-muted text-muted-foreground">{t('Model üretilemedi','Model could not be generated')}</div>}
        {canVote(figure)&&<ReaderVote key={figure.id} id={figure.id} counts={countFor(figure)} english={english}/>}
        {figure.bbox_mm&&<p className="mt-3 font-mono text-xs">{figure.bbox_mm.join(' × ')} mm · {figure.solids} {t('katı','solids')}</p>}
        <div className="my-4 flex flex-wrap gap-2">{(['step','stl','code'] as const).map(key=>figure.files[key]?<Button asChild variant="outline" size="sm" key={key}><a href={assetUrl(figure.files[key])} download><Download/>{key==='code'?t('Kod indir','Download code'):key.toUpperCase()}</a></Button>:null)}</div>
        <p className="text-xs leading-relaxed text-muted-foreground">{t('Eksik ölçüler tahmini olabilir. Okur değerlendirmesi mühendislik onayı değildir.','Missing dimensions may be estimates. Reader assessments are not engineering approval.')}</p>
      </section></div>
      <section className="mt-10 border-t border-border pt-6"><h3 className="mb-4 font-display text-xl font-semibold">{t('Model–çizim karşılaştırması','Model–drawing comparison')}</h3><div className="grid gap-6 md:grid-cols-2">{image(assetUrl(figure.files.crop),t('Çizim','Drawing'))}{figure.files.preview_svg?image(assetUrl(figure.files.preview_svg),t('Çizgisel önizleme','Line preview')):null}{figure.files.preview?image(assetUrl(figure.files.preview),t('Model önizlemesi','Model preview')):null}</div><div className="mt-4 space-y-3 text-sm leading-relaxed" lang="tr">{figure.failure_types.length>0&&<p>{figure.failure_types.join(' · ')}</p>}{figure.comparison&&<p>{figure.comparison}</p>}{figure.main_review&&<p>{figure.main_review}</p>}{figure.review_note&&<p>{figure.review_note}</p>}</div></section>
      {figure.files.code&&<section className="mt-8 border-t border-border pt-6"><div className="mb-3 flex items-center justify-between"><h3 className="font-display text-xl font-semibold">CadQuery</h3><Button variant="outline" size="sm" disabled={!code} onClick={()=>void copy(code,'code')}><Copy/>{copied==='code'?t('Kopyalandı','Copied'):t('Kodu kopyala','Copy code')}</Button></div><pre className="max-h-[500px] overflow-auto rounded bg-muted p-5 font-mono text-xs leading-relaxed">{code||t('Kod yükleniyor…','Loading code…')}</pre></section>}
      {figure.variants.length>0&&<section className="mt-8"><h3 className="font-semibold">{t('Varyantlar','Variants')}</h3><div className="mt-2 flex gap-4">{figure.variants.map(variant=><Link className="underline" key={variant} to="/araclar/teknik-resim-cad/$id" params={{id:variant}}>{variant}</Link>)}</div></section>}
      <section className="mt-8 border-t border-border pt-6"><h3 className="font-display text-xl font-semibold">{t('CAD promptu','CAD prompt')}</h3><div className="my-4 flex flex-wrap gap-3"><Button onClick={()=>void copy(figure.prompt,'prompt')}><Copy/>{copied==='prompt'?t('Kopyalandı','Copied'):t('Promptu kopyala','Copy prompt')}</Button><Button asChild variant="outline"><a download href={assetUrl(figure.files.crop)}><Download/>{t('Çizimi indir','Download drawing')}</a></Button><Button asChild variant="outline"><a href={`https://claude.ai/new?q=${encodeURIComponent(figure.prompt)}`} target="_blank" rel="noreferrer">{t("Claude'da aç",'Open in Claude')}</a></Button></div><p className="mb-3 text-xs text-muted-foreground">{t('Claude’a yalnızca prompt metni aktarılır; çizim görselini ayrıca ekleyin.','Only the prompt text is sent to Claude; attach the drawing image separately.')}</p><textarea readOnly value={figure.prompt} aria-label="CAD prompt" className="h-80 w-full resize-y rounded border border-input bg-muted p-4 font-mono text-xs leading-relaxed"/></section>
    </>}
    {copied==='error'&&<p role="alert">{t('Kopyalanamadı. Metni seçip kopyalayın.','Copy failed. Select and copy the text.')}</p>}
    <footer className="mt-12 border-t border-border pt-5">{attribution}<p className="mt-3 text-xs text-muted-foreground">{t('Atıf, ticari olmayan kullanım ve aynı lisansla paylaşım koşulları geçerlidir. Site kodu: MIT.','Attribution, noncommercial use and share-alike conditions apply. Site code: MIT.')}</p></footer>
    <Dialog open={Boolean(preview)} onOpenChange={open=>{if(!open)setPreview(undefined);}}><DialogContent className="max-w-4xl"><DialogTitle>{preview?.title}</DialogTitle>{preview&&<img src={preview.url} alt={preview.title} className="max-h-[75vh] w-full object-contain"/>}</DialogContent></Dialog>
  </div></div>;
}