import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function StlViewer({url, fallback, english}:{url:string;fallback?:string|undefined;english:boolean}) {
  const host=useRef<HTMLDivElement>(null);
  const reset=useRef<()=>void>(()=>{});
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const container=host.current; if(!container)return;
    let disposed=false; let cleanup=()=>{};
    setFailed(false);
    const load=async()=>{
      const response=await fetch(url);if(!response.ok)throw new Error('STL unavailable');
      const geometry=new STLLoader().parse(await response.arrayBuffer());
      if(disposed){geometry.dispose();return;}
      geometry.computeVertexNormals();geometry.computeBoundingBox();
      const bounds=geometry.boundingBox;if(!bounds){geometry.dispose();throw new Error('Empty model');}
      const center=bounds.getCenter(new THREE.Vector3());const size=bounds.getSize(new THREE.Vector3());
      geometry.translate(-center.x,-center.y,-center.z);
      const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.domElement.setAttribute('aria-label',english?'Interactive 3D model':'Etkileşimli 3B model');renderer.domElement.setAttribute('role','img');
      container.replaceChildren(renderer.domElement);
      const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,0.01,10000);camera.up.set(0,0,1);
      const span=Math.max(size.x,size.y,size.z,1);const distance=span*2.7;camera.far=distance*20;
      const probe=document.createElement('span');container.appendChild(probe);probe.style.color='var(--primary)';
      const material=new THREE.MeshStandardMaterial({color:new THREE.Color(getComputedStyle(probe).color),roughness:.65,metalness:.05,side:THREE.DoubleSide});
      probe.style.color='var(--foreground)';
      const edgeGeometry=new THREE.EdgesGeometry(geometry,25);const edgeMaterial=new THREE.LineBasicMaterial({color:new THREE.Color(getComputedStyle(probe).color)});probe.remove();
      scene.add(new THREE.Mesh(geometry,material),new THREE.LineSegments(edgeGeometry,edgeMaterial));
      scene.add(new THREE.HemisphereLight(0xffffff,0x777777,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-1,-2,3);scene.add(light);
      const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;
      const render=()=>{renderer.render(scene,camera);container.dataset['sceneReady']='true';};
      reset.current=()=>{camera.position.set(-1,-1.2,.9).normalize().multiplyScalar(distance);controls.target.set(0,0,0);controls.update();render();};
      controls.addEventListener('change',render);
      const resize=()=>{const width=container.clientWidth;const height=container.clientHeight;renderer.setSize(width,height,false);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';camera.aspect=width/height;camera.updateProjectionMatrix();render();};
      const observer=new ResizeObserver(resize);observer.observe(container);reset.current();resize();
      cleanup=()=>{observer.disconnect();controls.dispose();geometry.dispose();edgeGeometry.dispose();material.dispose();edgeMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
    };
    void load().catch(()=>{if(!disposed)setFailed(true);});
    return ()=>{disposed=true;cleanup();};
  },[url,english]);
  return <div className="relative bg-muted">
    <div ref={host} className="h-[380px] w-full touch-none" />
    {failed && <div className="absolute inset-0 flex items-center justify-center bg-muted">{fallback?<img src={fallback} alt={english?'Model preview':'Model önizlemesi'} className="max-h-full max-w-full object-contain"/>:<p>{english?'3D viewer unavailable':'3B görüntüleyici açılamadı'}</p>}</div>}
    {!failed&&<Button variant="outline" size="icon" className="absolute right-3 top-3" title={english?'Reset view':'Görünümü sıfırla'} onClick={()=>reset.current()}><RotateCcw/></Button>}
  </div>;
}