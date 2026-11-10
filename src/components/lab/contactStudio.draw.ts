import { fieldPoint, fieldLine, type StudioSolution, type StudioState } from '@/lib/contactStudio.logic';
export const QMAX={vm:0.66,tau:0.33,sz:1};
const XR=2.4, TOPF=0.2;
export function drawStudio(cv: HTMLCanvasElement, sol: StudioSolution | null, S: StudioState, t: (key: string) => string, fStr: (v: number) => string, fLen: (v: number) => string) {
 const ctx=cv.getContext('2d'); if(!ctx) return;
 const off=document.createElement('canvas'); let geom;
 const colors=getComputedStyle(cv);
 const color=(key: string)=>colors.getPropertyValue(key).trim();
 const sample=document.createElement('canvas').getContext('2d'); if(!sample) return;
 const stops=[0,.2,.45,.7,.88,1].map((at,i)=>{sample.fillStyle=color('--studio-band-'+i); sample.fillRect(0,0,1,1); return {at,rgb:sample.getImageData(0,0,1,1).data};});
 function ramp(v: number): number[] {
 v=Math.min(1,Math.max(0,v)); v=Math.floor(v*14)/14+(v*14-Math.floor(v*14)>0.94?.03:0); v=Math.min(1,v);
 for(let i=1;i<stops.length;i++){const a=stops[i-1], b=stops[i]; if(a&&b&&v<=b.at){const f=(v-a.at)/(b.at-a.at);return [0,1,2].map(k=>(a.rgb[k]??0)+((b.rgb[k]??0)-(a.rgb[k]??0))*f);}} return [250,244,214];
 }
 sample.fillStyle=color('--studio-yield'); sample.fillRect(0,0,1,1); const yieldColor=Array.from(sample.getImageData(0,0,1,1).data).slice(0,3);
  const cssW=cv.clientWidth||900, dpr=Math.min(window.devicePixelRatio||1,2);
  const W=Math.round(cssW*dpr), H=Math.round(W*7/9);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const top=Math.round(H*TOPF), sc=W/(2*XR), ZR=(H-top)/sc;
  geom={W:W,H:H,top:top,sc:sc,dpr:dpr};
  ctx.fillStyle=color('--studio-screen'); ctx.fillRect(0,0,W,H);
  if(!sol) return;
  const b=sol.bodies[S.body-1]; if(!b) return; const f=S.type==="point"?fieldPoint:fieldLine;
  const GX=300, GZ=Math.round(GX*(H-top)/W); off.width=GX; off.height=GZ;
  const octx=off.getContext("2d"); if(!octx) return; const img=octx.createImageData(GX,GZ), d=img.data, qmax=QMAX[S.q];
  const yN=b.Y?b.Y/sol.p0:null;
  for(let j=0;j<GZ;j++){ const z=(j+0.5)/GZ*ZR;
    for(let i=0;i<GX;i++){ const x=((i+0.5)/GX*2-1)*XR, s=f(x,z,b.nu);
      let c=ramp(s[S.q]/qmax);
      if(yN!==null&&s.vm>=yN){ c=((i+j)%5<2)?yieldColor:[(c[0]??0)*0.55+90,(c[1]??0)*0.5+30,(c[2]??0)*0.4]; }
      const k=(j*GX+i)*4; d[k]=c[0]??0;d[k+1]=c[1]??0;d[k+2]=c[2]??0;d[k+3]=255;
    }}
  octx.putImageData(img,0,0);
  ctx.imageSmoothingEnabled=true; ctx.drawImage(off,0,top,W,H-top);
  const px=(v: number)=>v*dpr, cx=W/2;
  ctx.font=`500 ${px(13)}px Barlow, sans-serif`; ctx.textBaseline="middle";
  // pressure ellipse above the surface
  const hp=top*0.62;
  ctx.beginPath(); ctx.moveTo(cx-sc,top);
  for(let k=0;k<=60;k++){const x=-1+k/30; ctx.lineTo(cx+x*sc,top-hp*Math.sqrt(Math.max(0,1-x*x)));}
  ctx.closePath(); ctx.fillStyle=color('--studio-pressure-fill'); ctx.fill(); ctx.strokeStyle=color('--studio-pressure'); ctx.lineWidth=px(1.5); ctx.stroke();
  ctx.fillStyle=color('--studio-ink'); ctx.textAlign="center";
  ctx.fillText(t("cvP0")+" = "+fStr(sol.p0),cx,top-hp-px(12));
  // surface
  ctx.strokeStyle=color('--studio-ink'); ctx.lineWidth=px(1.5); ctx.beginPath(); ctx.moveTo(0,top); ctx.lineTo(W,top); ctx.stroke();
  ctx.textAlign="left"; ctx.fillStyle=color('--studio-muted'); ctx.fillText(t("cvSurf"),px(8),top-px(10));
  // contact width
  ctx.strokeStyle=color('--studio-ink'); ctx.lineWidth=px(1);
  [-1,1].forEach(e=>{ctx.beginPath();ctx.moveTo(cx+e*sc,top-px(5));ctx.lineTo(cx+e*sc,top+px(5));ctx.stroke();});
  ctx.textAlign="right"; ctx.fillStyle=color('--studio-ink');
  ctx.fillText((S.type==="point"?"2a = ":"2b = ")+fLen(2*sol.hw),W-px(8),top-px(10));
  // depth ticks
  ctx.textAlign="left"; ctx.fillStyle=color('--studio-ink'); ctx.strokeStyle=color('--studio-muted');
  for(let k=1;k<ZR;k++){const y=top+k*sc; ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(px(8),y);ctx.stroke();
    ctx.fillText(k+(S.type==="point"?"a":"b")+" = "+fLen(k*sol.hw),px(12),y);}
  // coating interface
  if(S.tc>0){const zc=S.tc/1000/sol.hw; if(zc<ZR&&S.body===2){const y=top+zc*sc;
    ctx.setLineDash([px(6),px(4)]); ctx.strokeStyle=color('--studio-ink'); ctx.lineWidth=px(1.2);
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign="right"; ctx.fillStyle=color('--studio-ink'); ctx.fillText(t("cvIface"),W-px(8),y+(y-top<px(16)?px(10):-px(9)));}}
  // max marker
  const zm=S.q==="tau"?b.m.zt:(S.q==="vm"?b.m.zv:null);
  if(zm!==null){const y=top+zm*sc; ctx.strokeStyle=color('--studio-ink'); ctx.lineWidth=px(1.5);
    ctx.beginPath();ctx.arc(cx,y,px(5),0,Math.PI*2);ctx.stroke();
    ctx.textAlign="left"; ctx.fillStyle=color('--studio-ink');
    ctx.fillText(t("cvMax")+" "+fStr((S.q==="tau"?b.m.tau:b.m.vm)*sol.p0),cx+px(10),y);}
  // legend
  
  return geom;
}

