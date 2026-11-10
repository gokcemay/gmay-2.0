import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solve, initialStudio, fieldPoint, fieldLine, stress3 } from './contactStudio.logic';
// Literal expected results generated independently from the unchanged uploaded HTML.
const expected = [{"Es":115384.61538461539,"R":3,"hw":0.057988899976489976,"p0":1419.8800116492114,"pm":946.5866744328075,"delta":0.001120904173494453,"bodies":[{"nu":0.3,"Y":2000,"m":{"vm":0.6200401762030572,"zv":0.48000000000000037,"tau":0.31002008911629353,"zt":0.48000000000000037},"sf":2.271739446558108},{"nu":0.3,"Y":750,"m":{"vm":0.6200401762030572,"zv":0.48000000000000037,"tau":0.31002008911629353,"zt":0.48000000000000037},"sf":0.8519022924592905}],"Fy":6.182574535167012},{"Es":115384.61538461539,"R":4.444444444444445,"hw":0.41644432582046365,"p0":6882.8371937548545,"pm":4588.558129169903,"delta":0.039020822214313605,"bodies":[{"nu":0.3,"Y":2000,"m":{"vm":0.6200401762030572,"zv":0.48000000000000037,"tau":0.31002008911629353,"zt":0.48000000000000037},"sf":0.46864357546763513},{"nu":0.3,"Y":2000,"m":{"vm":0.6200401762030572,"zv":0.48000000000000037,"tau":0.31002008911629353,"zt":0.48000000000000037},"sf":0.46864357546763513}],"Fy":257.3167230203129},{"Es":59845.39938492229,"R":10,"hw":0.10313941805845439,"p0":308.6209833018334,"pm":242.3903534711745,"delta":null,"bodies":[{"nu":0.3,"Y":2000,"m":{"vm":0.5575160305914406,"zv":0.704999999999996,"tau":0.3002828305598139,"zt":0.7849999999999943},"sf":11.623774754036333},{"nu":0.33,"Y":500,"m":{"vm":0.5468982019351639,"zv":0.7274999999999955,"tau":0.3002828305598139,"zt":0.7849999999999943},"sf":2.9623615228705793}],"Fy":3510.234316873639},{"Es":93035.89226791178,"R":3,"hw":0.04945011794408887,"p0":976.2852482746907,"pm":650.8568321831272,"delta":0.0008151047215614334,"bodies":[{"nu":0.27,"Y":null,"m":{"vm":0.6339556628765656,"zv":0.47000000000000036,"tau":0.316977833186694,"zt":0.47000000000000036},"sf":null},{"nu":0.34,"Y":880,"m":{"vm":0.6018253299641255,"zv":0.4950000000000004,"tau":0.3009126673977732,"zt":0.4950000000000004},"sf":1.4977367367893466}],"Fy":16.798730061782315},[{"vm":0.5094840504984827,"tau":0.2566871312395338,"sz":0.5350174428803883},{"vm":0.5384042939913678,"tau":0.29349174724506133,"sz":0.6988535738739232}]];
const cases=[initialStudio,{...initialStudio,counter:'convex' as const,R1:5,R2:40,F:2500,Y2:2000},{...initialStudio,type:'line' as const,R1:10,L:8,F:400,E2:72,n2:.33,Y2:500},{...initialStudio,E1:310,n1:.27,Y1:null,E2:114,n2:.34,Y2:880,F:5,tc:3}];
function close(actual: unknown, reference: unknown) {
  if(typeof actual==='number'&&typeof reference==='number') { assert.ok(Math.abs(actual-reference)<=1e-12*Math.max(1,Math.abs(reference)));return; }
  if(actual&&reference&&typeof actual==='object'&&typeof reference==='object') {
    assert.deepEqual(Object.keys(actual),Object.keys(reference));
    for(const key of Object.keys(reference))close(Reflect.get(actual,key),Reflect.get(reference,key));
    return;
  }
  assert.equal(actual,reference);
}
for(const [i,state] of cases.entries()) test(`uploaded preset ${i+1} retains numerical results within floating-point tolerance`,()=>close(solve(state),expected[i]));
test('point and line subsurface stress components retain uploaded values',()=>close([fieldPoint(.4,.8,.3),fieldLine(.4,.8,.3)],expected[4]));
test('zero load is rejected',()=>assert.equal(solve({...initialStudio,F:0}),null));
test('line contact requires positive length',()=>assert.equal(solve({...initialStudio,type:'line',L:0}),null));
test('convex counterface requires positive radius',()=>assert.equal(solve({...initialStudio,counter:'convex',R2:0}),null));
test('Poisson ratio above 0.5 is rejected',()=>assert.equal(solve({...initialStudio,n2:.51}),null));
test('nonfinite inputs are rejected',()=>assert.equal(solve({...initialStudio,R2:Infinity}),null));
test('negative coating thickness is rejected',()=>assert.equal(solve({...initialStudio,tc:-1}),null));
test('missing yield strengths skip both checks and first yield load',()=>{const result=solve({...initialStudio,Y1:null,Y2:null});assert.deepEqual(result?.bodies.map(b=>b.sf),[null,null]);assert.equal(result?.Fy,null);});
test('point contact pressure scales with the cube root of load',()=>{const a=solve(initialStudio), b=solve({...initialStudio,F:80});assert.ok(a&&b);assert.ok(Math.abs(b.p0/a.p0-2)<1e-12);});
test('line contact pressure scales with square root of load',()=>{const a=solve({...initialStudio,type:'line'}), b=solve({...initialStudio,type:'line',F:40});assert.ok(a&&b);assert.ok(Math.abs(b.p0/a.p0-2)<1e-12);});
test('hydrostatic compression produces no von Mises or maximum shear stress',()=>assert.deepEqual(stress3(-100,-100,0,-100),{vm:0,tau:0,sz:100}));
