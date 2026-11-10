import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { initialStudio, solve, fieldPoint, fieldLine, type StudioState, type Quantity } from '@/lib/contactStudio.logic';
import { studioMaterials, studioPresets, studioText } from '@/lib/contactStudio.data';
import { drawStudio, QMAX } from './contactStudio.draw';

type NumericKey = 'R1'|'R2'|'L'|'F'|'E1'|'n1'|'Y1'|'E2'|'n2'|'Y2'|'tc';
function Field({id,label,value,onChange}: {id: NumericKey;label:string;value:number|null;onChange:(key:NumericKey,value:number|null)=>void}) {
  return <label className="block min-w-0 text-xs text-muted-foreground" htmlFor={`studio-${id}`}>{label}<input id={`studio-${id}`} type="number" step="any" min="0" max={id==='n1'||id==='n2'?.5:undefined} value={value===null||!Number.isFinite(value)?'':value} onChange={e=>onChange(id,e.target.value===''?(id==='Y1'||id==='Y2'?null:id==='tc'?0:NaN):Number(e.target.value))} className="mt-1 w-full min-w-0 rounded border border-input bg-background px-2 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring" /></label>;
}
export function ContactStudio() {
  const language=useLanguage(), tr=language==='tr';
  const text=studioText[language];
  const t=(key: string, vars?:Record<string,string|number>)=>{let out=String(text[key as keyof typeof text]??key); for(const [k,v] of Object.entries(vars??{})) out=out.replace(`{${k}}`,String(v));return out;};
  const [state,setState]=useState<StudioState>(initialStudio);
  const [mats,setMats]=useState(['100cr6','42crmo4']);
  const [probe,setProbe]=useState<{x:number;z:number;value:number}|null>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const geometry=useRef<ReturnType<typeof drawStudio>>(undefined);
  const sol=useMemo(()=>solve(state),[state]);
  const num=(v:number)=>v.toLocaleString(tr?'tr-TR':'en-US',{maximumSignificantDigits:3,minimumSignificantDigits:3});
  const length=(v:number)=>v<1?`${num(v*1000)} µm`:`${num(v)} mm`;
  const stress=(v:number)=>Math.abs(v)>=1000?`${num(v/1000)} GPa`:`${num(v)} MPa`;
  const force=(v:number)=>v>=1000?`${num(v/1000)} kN`:`${num(v)} N`;
  useEffect(()=>{
    const cv=canvas.current; if(!cv) return;
    const paint=()=>{geometry.current=drawStudio(cv,sol,state,k=>String(studioText[language][k as keyof typeof text]),stress,length);};
    paint(); const observer=new ResizeObserver(paint); observer.observe(cv); return ()=>observer.disconnect();
  },[sol,state,language]);
  const change=(key:NumericKey,value:number|null)=>{
    setState(s=>({...s,[key]:value})); setProbe(null);
    if(/^[EnY][12]$/.test(key))setMats(old=>old.map((m,i)=>key.endsWith(String(i+1))?'custom':m));
  };
  const material=(i:0|1,id:string)=>{
    setMats(old=>old.map((m,j)=>i===j?id:m)); const mat=studioMaterials.find(m=>m.id===id);if(!mat)return;
    setState(s=>({...s,...(i===0?{E1:mat.E,n1:mat.nu,Y1:mat.Y}:{E2:mat.E,n2:mat.nu,Y2:mat.Y})}));setProbe(null);
  };
  const preset=(i:number)=>{const p=studioPresets[i];if(!p)return;const a=studioMaterials.find(m=>m.id===p.m1),b=studioMaterials.find(m=>m.id===p.m2);if(!a||!b)return;
    setState(s=>({...s,type:p.type,counter:p.counter,R1:p.R1,R2:p.R2,L:p.L,F:p.F,tc:p.tc,E1:a.E,n1:a.nu,Y1:a.Y,E2:b.E,n2:b.nu,Y2:b.Y}));setMats([p.m1,p.m2]);setProbe(null);
  };
  const selected=sol?.bodies[state.body-1];
  const rows: [string,string][]=[];
  if(sol&&selected){
    rows.push([t(state.type==='point'?'rA':'rB'),length(sol.hw)],[t('rP0'),stress(sol.p0)],[t('rPm'),stress(sol.pm)]);
    if(sol.delta!==null)rows.push([t('rD'),length(sol.delta)]);
    rows.push([t('rEs'),stress(sol.Es)],[`${t('rTau')} (${t('body')} ${state.body})`,stress(selected.m.tau*sol.p0)],[t('rZt'),length(selected.m.zt*sol.hw)],[`${t('rVm')} (${t('body')} ${state.body})`,stress(selected.m.vm*sol.p0)]);
    sol.bodies.forEach((b,i)=>rows.push([`${t('rSF')}, ${t('body')} ${i+1}`,b.sf===null?'—':num(b.sf)]));
    rows.push([t('rFy'),sol.Fy===null?'—':force(sol.Fy)]);
  }
  const yielding=sol?.bodies.map((b,i)=>({body:i+1,sf:b.sf})).filter(b=>b.sf!==null&&b.sf<1)??[];
  let coatingText='', coatingBad=false;
  if(sol&&state.tc>0){const b=sol.bodies[1];if(b){const z=state.tc/1000/sol.hw,si=(state.type==='point'?fieldPoint:fieldLine)(state.type==='point'?1e-4:0,z,b.nu).vm*sol.p0,zt=b.m.zt*sol.hw;
    coatingText=zt>state.tc/1000?t('cBelow',{zt:length(zt),tc:length(state.tc/1000)}):t('cInside',{zt:length(zt),si:stress(si)});
    if(b.Y)coatingText+=' '+t('cSub',{si:stress(si),r:num(si/b.Y)});coatingBad=b.Y!==null&&si>b.Y;
  }}
  const field=(key:NumericKey,label:string)=><Field key={key} id={key} label={label} value={state[key]} onChange={change}/>;
  const heading='mb-3 font-display text-base font-semibold text-foreground';
  const notice='mt-3 border-l-2 border-accent bg-muted/50 p-3 text-sm leading-relaxed';
  return <div className="studio-tool">
    <div className="mb-6 flex flex-wrap gap-2">{text.presets.map((name,i)=><Button key={name} variant="outline" className="h-auto whitespace-normal text-left text-xs" onClick={()=>preset(i)}>{name}</Button>)}</div>
    <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_260px]">
      <section aria-label={tr?'Girdiler':'Inputs'} className="min-w-0 space-y-5 rounded-lg border border-border bg-card p-4">
        <div><h2 className={heading}>{t('hGeom')}</h2><div className="grid grid-cols-2 gap-1">{(['point','line'] as const).map(v=><Button key={v} variant={state.type===v?'default':'outline'} className="h-auto whitespace-normal px-2 text-xs" aria-pressed={state.type===v} onClick={()=>{setState(s=>({...s,type:v}));setProbe(null);}}>{t(v==='point'?'tPoint':'tLine')}</Button>)}</div>
          <label className="mt-3 block text-xs text-muted-foreground" htmlFor="studio-counter">{t('lCounter')}<select id="studio-counter" value={state.counter} onChange={e=>setState(s=>({...s,counter:e.target.value==='convex'?'convex':'flat'}))} className="mt-1 w-full rounded border border-input bg-background p-2 text-sm text-foreground"><option value="flat">{t('oFlat')}</option><option value="convex">{t('oConvex')}</option></select></label>
          <div className="mt-3 grid gap-3">{field('R1',t('lR1'))}{state.counter==='convex'&&field('R2',t('lR2'))}{state.type==='line'&&field('L',t('lL'))}</div>
        </div>
        <div className="border-t border-border pt-4"><h2 className={heading}>{t('hLoad')}</h2>{field('F',t('lF'))}<input type="range" min="-1" max="5" step="0.01" aria-label={tr?'Yük':'Load'} value={Number.isFinite(state.F)?Math.log10(Math.max(state.F,.1)):1} onChange={e=>change('F',Number(Math.pow(10,Number(e.target.value)).toPrecision(3)))} className="mt-3 w-full accent-accent" /></div>
        {([0,1] as const).map(i=><div key={i} className="border-t border-border pt-4"><h2 className={heading}>{t(i===0?'hB1':'hB2')}</h2><select aria-label={tr?`Gövde ${i+1} malzeme`:`Body ${i+1} material`} className="w-full rounded border border-input bg-background p-2 text-sm text-foreground" value={mats[i]} onChange={e=>material(i,e.target.value)}>{studioMaterials.map(m=><option key={m.id} value={m.id}>{m.id==='100cr6'?`100Cr6 (${tr?'sertleştirilmiş':'hardened'})`:m.id==='42crmo4'?`42CrMo4 (${tr?'ıslah':'Q&T'})`:m.name}</option>)}<option value="custom">{t('custom')}</option></select><div className="mt-3 grid grid-cols-3 gap-2">{field(i===0?'E1':'E2','E (GPa)')}{field(i===0?'n1':'n2','ν')}{field(i===0?'Y1':'Y2',t('lY'))}</div></div>)}
        <p className="text-xs leading-relaxed text-muted-foreground">{t('matNote')}</p>
        <div className="border-t border-border pt-4"><h2 className={heading}>{t('hCoat')}</h2>{field('tc',t('lTc'))}</div>
      </section>
      <section className="min-w-0" aria-label={tr?'Gerilme alanı':'Stress field'}><div className="mb-3 flex flex-wrap gap-2"><div className="flex flex-wrap gap-1">{(['vm','tau','sz'] as Quantity[]).map(q=><Button key={q} size="sm" variant={state.q===q?'default':'outline'} aria-pressed={state.q===q} onClick={()=>{setState(s=>({...s,q}));setProbe(null);}}>{t(q==='vm'?'qVm':q==='tau'?'qTau':'qSz')}</Button>)}</div><div className="flex gap-1">{([1,2] as const).map(body=><Button key={body} size="sm" variant={state.body===body?'default':'outline'} aria-pressed={state.body===body} onClick={()=>{setState(s=>({...s,body}));setProbe(null);}}>{t(body===1?'b1':'b2')}</Button>)}</div></div>
        <div className="studio-screen rounded-lg border border-border p-3"><canvas ref={canvas} width="900" height="700" className="block aspect-[9/7] w-full touch-pan-y rounded" aria-label={tr?'Yüzey altı gerilme alanı':'Subsurface stress field'} onPointerMove={e=>{const cv=canvas.current,g=geometry.current;if(!cv||!sol||!selected||!g)return;const r=cv.getBoundingClientRect(),x=((e.clientX-r.left)/r.width*g.W-g.W/2)/g.sc,z=((e.clientY-r.top)/r.height*g.H-g.top)/g.sc;if(z<=0){setProbe(null);return;}const val=(state.type==='point'?fieldPoint:fieldLine)(x,z,selected.nu);setProbe({x:Math.abs(x)*sol.hw,z:z*sol.hw,value:val[state.q]*sol.p0});}} onPointerLeave={()=>setProbe(null)}/><div className="mt-3 flex items-center gap-3 text-xs"><span>0</span><div className="studio-legend h-2.5 flex-1 rounded-sm"/><span>{sol?stress(QMAX[state.q]*sol.p0):'—'}</span></div><p className="mt-3 min-h-10 text-xs leading-relaxed" aria-live="off">{probe?t('probe',{x:length(probe.x),z:length(probe.z),q:{vm:'σvM',tau:'τmax',sz:'|σz|'}[state.q],v:stress(probe.value)}):t('probeHint')}</p></div>
      </section>
      <section aria-live="polite" className="min-w-0 rounded-lg border border-border bg-card p-4 lg:col-span-2 xl:col-span-1"><h2 className={heading}>{t('hRes')}</h2>{!sol?<p role="alert" className="text-sm text-destructive">{t('err')} {tr?'Kaplama ve akma değerleri negatif olamaz.':'Coating and yield values cannot be negative.'}</p>:<><dl>{rows.map(([label,value])=><div key={label} className="flex items-baseline justify-between gap-3 border-b border-border py-2 text-xs"><dt className="text-muted-foreground">{label}</dt><dd className="shrink-0 font-mono font-semibold" data-result={label}>{value}</dd></div>)}</dl>{yielding.map(b=><p key={b.body} className={`${notice} border-destructive`}>{t('vBad',{b:b.body,sf:num(b.sf??0)})}</p>)}{yielding.length===0&&sol.bodies.some(b=>b.sf!==null)&&<p className={notice}>{sol.bodies.every(b=>b.sf!==null)?t('vOk'):(tr?'Akma dayanımı verilen gövde elastik bölgede kalıyor; diğer gövde kontrol edilmedi.':'The body with a supplied yield strength stays elastic; the other body was not checked.')}</p>}{coatingText&&<><p className={`${notice} ${coatingBad?'border-destructive':''}`}>{coatingText}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t('cNote')}</p></>}<p className="mt-3 text-xs leading-relaxed text-muted-foreground">{tr?'Taralı bölge elastik çözümde akma eşiğinin aşıldığı yerdir; plastik gerilme dağılımı hesaplanmaz.':'Hatching marks exceedance of yield in the elastic solution; plastic stress redistribution is not calculated.'}</p></>}
        <div className="mt-5 border-t border-border pt-4"><h2 className={heading}>{t('hPro')}</h2><ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground">{text.pro.map(p=><li key={p}>{p}</li>)}</ul><Button asChild className="mt-4 h-auto whitespace-normal"><a href={`https://gmay.me/iletisim${tr?'?lang=tr':''}`} target="_blank" rel="noopener noreferrer">{t('proBtn')}</a></Button></div>
      </section>
    </div>
    <p className="mt-6 max-w-4xl text-sm leading-relaxed text-muted-foreground">{t('foot')}</p>
  </div>;
}
