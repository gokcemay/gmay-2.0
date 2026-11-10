// Equations and axis sampling preserved from the owner-uploaded Contact Stress Studio.
// Length: mm; force: N; input moduli: GPa; calculated stresses: MPa.
export type ContactType = 'point' | 'line';
export type Quantity = 'vm' | 'tau' | 'sz';
export type StudioState = { type: ContactType; counter: 'flat' | 'convex'; R1: number; R2: number; L: number; F: number; E1: number; n1: number; Y1: number | null; E2: number; n2: number; Y2: number | null; tc: number; q: Quantity; body: 1 | 2 };
export const initialStudio: StudioState = {type:'point',counter:'flat',R1:3,R2:10,L:10,F:10,E1:210,n1:0.3,Y1:2000,E2:210,n2:0.3,Y2:750,tc:2,q:'vm',body:2};
export function fieldPoint(r: number,z: number,nu: number){
  r=Math.max(Math.abs(r),1e-4); z=Math.max(z,1e-6);
  const A=r*r+z*z-1, u=0.5*(A+Math.sqrt(A*A+4*z*z)), su=Math.sqrt(u), q=z/su, q3=q*q*q;
  const at=(su)*Math.atan(1/su), k=(1-2*nu)/3/(r*r)*(1-q3);
  const sr= k + q3*u/(u*u+z*z) + q*(u*(1-nu)/(1+u)+(1+nu)*at-2);
  const st=-k - q*(2*nu+u*(1-nu)/(1+u)-(1+nu)*at);
  const sz=-q3*u/(u*u+z*z);
  const trz=-(r*z*z/(u*u+z*z))*su/(1+u);
  return stress3(sr,sz,trz,st);
}
export function fieldLine(x: number,z: number,nu: number){
  z=Math.max(z,1e-6);
  const A=1-x*x+z*z, Sq=Math.sqrt(A*A+4*x*x*z*z);
  const m=Math.sqrt(0.5*(Sq+A)), n=(x<0?-1:1)*Math.sqrt(Math.max(0.5*(Sq-A),0));
  const f=(z*z+n*n)/(m*m+n*n);
  const sx=-(m*(1+f)-2*z), sz=-m*(1-f), txz=-n*(m*m-z*z)/(m*m+n*n);
  return stress3(sx,sz,txz,nu*(sx+sz));
}
export function stress3(s1: number,s2: number,t12: number,s3: number){ // in-plane s1,s2 with shear t12; out-of-plane principal s3
  const c=(s1+s2)/2, rad=Math.sqrt((s1-s2)*(s1-s2)/4+t12*t12), pa=c+rad, pb=c-rad;
  const mx=Math.max(pa,s3), mn=Math.min(pb,s3);
  const vm=Math.sqrt(0.5*((s1-s2)*(s1-s2)+(s2-s3)*(s2-s3)+(s3-s1)*(s3-s1))+3*t12*t12);
  return {vm:vm,tau:(mx-mn)/2,sz:-s2};
}
export function axisMax(type: ContactType,nu: number){ // maxima lie on the load axis for both contact types
  const f=type==="point"?fieldPoint:fieldLine; let vm=0,zv=0,tau=0,zt=0;
  for(let z=0.005;z<=3;z+=0.0025){const s=f(type==="point"?1e-4:0,z,nu); if(s.vm>vm){vm=s.vm;zv=z;} if(s.tau>tau){tau=s.tau;zt=z;}}
  return {vm:vm,zv:zv,tau:tau,zt:zt};
}
export function solve(s: StudioState){
  const ok=[s.R1,s.F,s.E1,s.E2].every(v=>v>0&&isFinite(v)) && s.n1>=0&&s.n1<=0.5&&s.n2>=0&&s.n2<=0.5
    && (s.counter==="flat"||s.R2>0) && (s.type==="point"||s.L>0);
  if(!ok || ![s.R1,s.R2,s.L,s.F,s.E1,s.E2,s.n1,s.n2,s.tc].every(Number.isFinite) || s.tc < 0 || [s.Y1,s.Y2].some(y => y !== null && (!Number.isFinite(y) || y < 0))) return null;
  const Es=1/((1-s.n1*s.n1)/(s.E1*1000)+(1-s.n2*s.n2)/(s.E2*1000)); // MPa
  const R=s.counter==="flat"?s.R1:s.R1*s.R2/(s.R1+s.R2); // mm
  let hw,p0,pm,delta=null;
  if(s.type==="point"){hw=Math.cbrt(3*s.F*R/(4*Es)); p0=3*s.F/(2*Math.PI*hw*hw); pm=s.F/(Math.PI*hw*hw); delta=hw*hw/R;}
  else{hw=Math.sqrt(4*s.F*R/(Math.PI*Es*s.L)); p0=2*s.F/(Math.PI*hw*s.L); pm=s.F/(2*hw*s.L);}
  const bodies=[1,2].map(i=>{
    const nu=i===1?s.n1:s.n2, Y=i===1?s.Y1:s.Y2, m=axisMax(s.type,nu);
    const sf=(Y !== null && Y>0)?Y/(m.vm*p0):null;
    return {nu:nu,Y:(Y !== null && Y>0?Y:null),m:m,sf:sf};
  });
  const exp=s.type==="point"?3:2; let Fy: number | null=null;
  bodies.forEach(b=>{if(b.sf!==null){const f=s.F*Math.pow(b.sf,exp); if(Fy===null||f<Fy)Fy=f;}});
  return {Es:Es,R:R,hw:hw,p0:p0,pm:pm,delta:delta,bodies:bodies,Fy:Fy};
}

export type StudioSolution = NonNullable<ReturnType<typeof solve>>;
