import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const C = {
  bg0:"#080A0F", bg1:"#0D1017", bg2:"#131820", bg3:"#1C2333",
  o1:"#4F8EF7",  o2:"#6BA3FF",  o3:"#93BBFF",  o4:"#2563EB",
  accent:"#38BDF8", accentAlt:"#818CF8",
  tw:"#F8FAFF", ts:"#C8D5F0", tm:"#7A90B8", tf:"#3A4F72",
};

/* ─── Project Data — no images, each has a unique 3D shape + scene ──── */
const PROJECTS = [
  {
    id:"conotex",
    title:"Conotex Integrated Services",
    subtitle:"IT & Low-Voltage Solutions",
    desc:"Nationwide low-voltage and managed IT solutions. Since 2011, CIS has partnered with top brands to design, deploy, and manage secure, reliable digital infrastructure.",
    link:"https://www.conotextech.com/",
    color:"#4F8EF7", gradFrom:"#4F8EF7", gradTo:"#2563EB",
    tag:"IT Infrastructure", year:"2024", category:"Enterprise",
    tech:["Next.js","Node.js","AWS","PostgreSQL"],
    metrics:[{val:"99.9%",label:"Uptime SLA"},{val:"40%",label:"Cost Reduced"},{val:"3×",label:"Faster Deploy"}],
    shape:"icosahedron",
    sceneAccent:"#4F8EF7",
  },
  {
    id:"vendo",
    title:"Vendo",
    subtitle:"Modern eCommerce Platform",
    desc:"A responsive eCommerce frontend engineered for seamless shopping. Dynamic product grids, category browsing, intelligent search, and fully optimised responsive design.",
    link:"https://my-ecommerce-nine-iota.vercel.app/",
    color:"#38BDF8", gradFrom:"#38BDF8", gradTo:"#0891B2",
    tag:"eCommerce", year:"2024", category:"Product",
    tech:["React","Tailwind CSS","Stripe","Vercel"],
    metrics:[{val:"3×",label:"Conversion"},{val:"0.8s",label:"Load Time"},{val:"98",label:"Lighthouse"}],
    shape:"torus",
    sceneAccent:"#38BDF8",
  },
  {
    id:"weareiko",
    title:"WearEiko",
    subtitle:"African-Inspired Fashion Brand",
    desc:"WearEiko blends African heritage with modern fashion, empowering self-expression through timeless, culturally-rooted designs. Every garment tells a story of identity and creativity.",
    link:"https://weareiko.com",
    color:"#818CF8", gradFrom:"#818CF8", gradTo:"#4F46E5",
    tag:"Fashion & Lifestyle", year:"2023", category:"Brand",
    tech:["Shopify","Custom Theme","Klaviyo","SEO"],
    metrics:[{val:"5×",label:"ROI"},{val:"200%",label:"Traffic Up"},{val:"4.9★",label:"Rating"}],
    shape:"octahedron",
    sceneAccent:"#818CF8",
  },
];

const STATS = [
  {val:"500+", label:"Projects Delivered", color:C.o1},
  {val:"30+",  label:"Countries Served",   color:C.accent},
  {val:"99%",  label:"Client Satisfaction",color:C.accentAlt},
  {val:"8+",   label:"Years of Excellence",color:C.o2},
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const HexPattern = () => (
  <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.04}}>
    <defs>
      <pattern id="pj_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8"/>
      </pattern>
      <pattern id="pj_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pj_hex1)"/>
    <rect width="100%" height="100%" fill="url(#pj_hex2)"/>
  </svg>
);

const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"2px 0"}}>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)`}}/>
    <div style={{width:5,height:5,background:C.o1,transform:"rotate(45deg)",flexShrink:0,boxShadow:`0 0 7px ${C.o1}`}}/>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)`}}/>
  </div>
);

/* ─── Shared canvas scaffold ─────────────────────────────────────────── */
const useThreeCanvas = (buildScene) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(()=>{
    const mount=mountRef.current, canvas=canvasRef.current;
    if(!mount||!canvas) return;
    let renderer=null, animId=null;
    const init=()=>{
      if(renderer) return;
      const W=mount.clientWidth||400, H=mount.clientHeight||260;
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(W,H); renderer.setClearColor(0x000000,0);
      const onResize=()=>{if(!renderer)return;renderer.setSize(mount.clientWidth,mount.clientHeight);};
      window.addEventListener("resize",onResize);
      const stop=buildScene(renderer,W,H,(id)=>{animId=id;});
      return()=>{if(stop)stop();cancelAnimationFrame(animId);window.removeEventListener("resize",onResize);renderer.dispose();renderer=null;};
    };
    let cleanup=null;
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!cleanup)cleanup=init();
      else if(!e.isIntersecting&&cleanup){cleanup();cleanup=null;}
    },{threshold:0.01,rootMargin:"150px"});
    obs.observe(canvas);
    return()=>{obs.disconnect();cleanup?.();};
  },[]);
  return {mountRef,canvasRef};
};

/* ══════════════════════════════════════════════════════════════════════
   CONOTEX — Big Tech USA
   Scene: morphing server cluster — interconnected nodes + data streams
   + a central AI brain (morphing icosahedron) + satellite micro-chips
════════════════════════════════════════════════════════════════════════ */
const TechScene = ({ active }) => {
  const activeRef=useRef(active);
  useEffect(()=>{activeRef.current=active;},[active]);
  const {mountRef,canvasRef}=useThreeCanvas((renderer,W,H,setId)=>{
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100); cam.position.z=5.5;
    const col=0x4F8EF7, col2=0x38BDF8, col3=0x818CF8;

    scene.add(new THREE.AmbientLight(0xd0e8ff,0.25));
    const pl1=new THREE.PointLight(col,10,26); pl1.position.set(4,4,4); scene.add(pl1);
    const pl2=new THREE.PointLight(col2,5,20); pl2.position.set(-3,2,2); scene.add(pl2);
    const pl3=new THREE.PointLight(col3,4,18); pl3.position.set(0,-3,-2); scene.add(pl3);

    /* Central AI brain — morphing icosahedron */
    const braGeo=new THREE.IcosahedronGeometry(0.95,2);
    const origPos=new Float32Array(braGeo.attributes.position.array);
    const tmpPos=new Float32Array(origPos.length);
    const brain=new THREE.Mesh(braGeo,new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.28,specular:0xffffff,shininess:240,transparent:true,opacity:0.92}));
    scene.add(brain);
    const brainWire=new THREE.Mesh(braGeo,new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:0.20}));
    brainWire.scale.setScalar(1.04); scene.add(brainWire);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(0.46,24,24),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:1.0,transparent:true,opacity:0.26}));
    scene.add(glow);

    /* Server nodes — 6 boxes representing server racks orbiting the brain */
    const serverMat=new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:0.30,specular:0xffffff,shininess:180,transparent:true,opacity:0.85});
    const servers=[
      {r:1.80,spd:0.42,y:0.0, p:0,   w:0.30,h:0.18,d:0.18},
      {r:1.70,spd:-0.35,y:0.5,p:1.05,w:0.22,h:0.30,d:0.14},
      {r:1.90,spd:0.28,y:-0.4,p:2.1, w:0.28,h:0.14,d:0.22},
      {r:1.75,spd:-0.50,y:0.3,p:3.15,w:0.18,h:0.28,d:0.14},
      {r:1.85,spd:0.38,y:-0.2,p:4.2, w:0.26,h:0.16,d:0.20},
      {r:1.65,spd:-0.30,y:0.6,p:5.25,w:0.16,h:0.26,d:0.18},
    ].map(d=>{
      const s=new THREE.Mesh(new THREE.BoxGeometry(d.w,d.h,d.d),serverMat.clone());
      s.userData={...d,angle:d.p}; scene.add(s); return s;
    });

    /* Connection lines between brain and each server */
    const connLines=servers.map(()=>{
      const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);
      const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.18}));
      scene.add(line); return line;
    });

    /* Data stream particles travelling along each connection */
    const streamParticles=servers.map(()=>{
      const m=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8),new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:1.0}));
      m.userData={phase:Math.random()}; scene.add(m); return m;
    });

    /* Orbital ring representing network perimeter */
    const netRing=new THREE.Mesh(new THREE.TorusGeometry(2.3,0.018,12,100),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.4,transparent:true,opacity:0.45}));
    netRing.rotation.x=Math.PI/2.5; scene.add(netRing);
    const netRing2=new THREE.Mesh(new THREE.TorusGeometry(2.7,0.010,10,80),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.3,transparent:true,opacity:0.28}));
    netRing2.rotation.x=Math.PI/5; netRing2.rotation.z=Math.PI/4; scene.add(netRing2);

    /* Micro-chips (flat cylinders) orbiting the outer ring */
    const chips=[0,1,2,3].map(i=>{
      const c=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.10,0.04,8),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.5,shininess:300}));
      c.userData={angle:(i/4)*Math.PI*2,r:2.3,spd:0.20*(i%2?1:-1)};
      scene.add(c); return c;
    });

    /* Background particle cloud */
    const pCount=80,pPos=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=3.0+Math.random()*1.2;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*2.2;pPos[i*3+2]=Math.sin(a)*r;}
    const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(pPos,3)),new THREE.PointsMaterial({color:col,size:0.04,transparent:true,opacity:0.55}));
    scene.add(pts);

    const tv=new THREE.Vector3();
    const t0=performance.now();
    const animate=()=>{
      const id=requestAnimationFrame(animate); setId(id);
      const t=(performance.now()-t0)*0.001, a=activeRef.current, spd=a?1.9:0.60;

      /* Morph brain */
      for(let i=0;i<origPos.length;i+=3){const ox=origPos[i],oy=origPos[i+1],oz=origPos[i+2];const len=Math.sqrt(ox*ox+oy*oy+oz*oz);const wave=Math.sin(t*1.4+ox*2.1+oy*1.8)*0.055;const sc=(0.95+wave)/len;tmpPos[i]=ox*sc;tmpPos[i+1]=oy*sc;tmpPos[i+2]=oz*sc;}
      braGeo.attributes.position.array.set(tmpPos); braGeo.attributes.position.needsUpdate=true; braGeo.computeVertexNormals();
      brain.rotation.y=t*spd*0.40; brain.rotation.x=Math.sin(t*0.28)*0.22;
      brainWire.rotation.y=brain.rotation.y; brainWire.rotation.x=brain.rotation.x;
      const ts=a?1.15:1.0; brain.scale.lerp(tv.set(ts,ts,ts),0.06);
      glow.scale.setScalar(1+Math.sin(t*1.8)*0.13);

      servers.forEach((s,i)=>{
        s.userData.angle+=s.userData.spd*0.012;
        s.position.x=Math.cos(s.userData.angle)*s.userData.r;
        s.position.z=Math.sin(s.userData.angle)*s.userData.r;
        s.position.y=s.userData.y+Math.sin(t*0.9+s.userData.angle)*0.22;
        s.rotation.y=t*1.2; s.rotation.x=t*0.6;
        /* Update connection line */
        const arr=connLines[i].geometry.attributes.position.array;
        arr[0]=0;arr[1]=0;arr[2]=0;arr[3]=s.position.x;arr[4]=s.position.y;arr[5]=s.position.z;
        connLines[i].geometry.attributes.position.needsUpdate=true;
        /* Data stream particle */
        const ph=(streamParticles[i].userData.phase+t*0.4)%1;
        streamParticles[i].position.x=s.position.x*ph;
        streamParticles[i].position.y=s.position.y*ph;
        streamParticles[i].position.z=s.position.z*ph;
      });

      chips.forEach(c=>{c.userData.angle+=c.userData.spd*0.014;c.position.x=Math.cos(c.userData.angle)*c.userData.r;c.position.z=Math.sin(c.userData.angle)*c.userData.r;c.position.y=Math.sin(c.userData.angle*2)*0.3;c.rotation.y=t*2;});
      netRing.rotation.z=t*0.14; netRing2.rotation.y=t*0.10; netRing2.rotation.x=Math.PI/5+t*0.08;
      pts.rotation.y=t*0.12;
      pl1.position.set(Math.sin(t*0.5)*4,Math.cos(t*0.38)*3.5,4);
      renderer.render(scene,cam);
    };
    animate();
  });
  return <div ref={mountRef} style={{width:"100%",height:"100%"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/></div>;
};

/* ══════════════════════════════════════════════════════════════════════
   VENDO — Big eCommerce Store
   Scene: shopping bag + orbiting product cubes + coin/currency rings
   + floating price tags + cart wheel
════════════════════════════════════════════════════════════════════════ */
const EcommerceScene = ({ active }) => {
  const activeRef=useRef(active);
  useEffect(()=>{activeRef.current=active;},[active]);
  const {mountRef,canvasRef}=useThreeCanvas((renderer,W,H,setId)=>{
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100); cam.position.z=5.5;
    const col=0x38BDF8, col2=0x4F8EF7, col3=0x93BBFF;

    scene.add(new THREE.AmbientLight(0xd0f8ff,0.28));
    const pl1=new THREE.PointLight(col,10,26); pl1.position.set(3,4,4); scene.add(pl1);
    const pl2=new THREE.PointLight(col2,5,20); pl2.position.set(-3,2,2); scene.add(pl2);
    const pl3=new THREE.PointLight(0xffffff,3,18); pl3.position.set(0,-3,2); scene.add(pl3);

    /* Central shopping bag body — tapered box */
    const bagGroup=new THREE.Group(); scene.add(bagGroup);
    const bagBody=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.3,0.55),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.22,specular:0xffffff,shininess:260,transparent:true,opacity:0.90}));
    bagGroup.add(bagBody);
    /* Bag handle — torus sitting on top */
    const handle=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.06,10,40),new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:0.30,shininess:200,transparent:true,opacity:0.88}));
    handle.position.y=0.82; handle.rotation.x=Math.PI/2; bagGroup.add(handle);
    /* Bag wireframe */
    const bagWire=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.3,0.55),new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:0.15}));
    bagWire.scale.setScalar(1.04); bagGroup.add(bagWire);

    /* Inner glow */
    const inner=new THREE.Mesh(new THREE.SphereGeometry(0.38,20,20),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:1.0,transparent:true,opacity:0.22}));
    bagGroup.add(inner);

    /* Product cubes — 5 different sized cubes orbiting like catalogue items */
    const prodColors=[col,col2,col3,0x0891B2,col];
    const products=[
      {r:1.85,spd:0.38,y:0.2, p:0,   s:[0.28,0.36,0.22]},
      {r:1.75,spd:-0.30,y:-0.3,p:1.26,s:[0.32,0.24,0.28]},
      {r:1.90,spd:0.25,y:0.5, p:2.51,s:[0.22,0.32,0.24]},
      {r:1.70,spd:-0.42,y:-0.1,p:3.77,s:[0.30,0.28,0.20]},
      {r:1.80,spd:0.34,y:0.3, p:5.03,s:[0.24,0.30,0.26]},
    ].map((d,i)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(...d.s),new THREE.MeshPhongMaterial({color:prodColors[i],emissive:prodColors[i],emissiveIntensity:0.28,specular:0xffffff,shininess:200,transparent:true,opacity:0.86}));
      m.userData={...d,angle:d.p}; scene.add(m); return m;
    });

    /* Coin/currency rings — two flat torus rings representing transactions */
    const coin1=new THREE.Mesh(new THREE.TorusGeometry(2.1,0.022,12,90),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.45,transparent:true,opacity:0.55}));
    coin1.rotation.x=Math.PI/2.2; scene.add(coin1);
    const coin2=new THREE.Mesh(new THREE.TorusGeometry(2.55,0.014,10,80),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.30,transparent:true,opacity:0.35}));
    coin2.rotation.x=Math.PI/3; coin2.rotation.z=Math.PI/6; scene.add(coin2);

    /* Cart wheels — small torus rings orbiting fast representing the cart */
    const wheels=[0,1].map(i=>{
      const w=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.06,10,32),new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:0.45,shininess:220}));
      w.userData={angle:(i/2)*Math.PI*2,r:0.65,spd:2.2*(i%2?1:-1)};
      bagGroup.add(w); return w;
    });

    /* Price tag diamonds — octahedrons floating around */
    const tags=[0,1,2].map(i=>{
      const m=new THREE.Mesh(new THREE.OctahedronGeometry(0.09,0),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.8,shininess:300}));
      m.userData={angle:(i/3)*Math.PI*2,r:2.1,spd:0.18,yOff:(i-1)*0.5};
      scene.add(m); return m;
    });

    /* Particle halo */
    const pCount=70,pPos=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=2.8+Math.random()*1.0;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*2.0;pPos[i*3+2]=Math.sin(a)*r;}
    const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(pPos,3)),new THREE.PointsMaterial({color:col,size:0.04,transparent:true,opacity:0.55}));
    scene.add(pts);

    const tv=new THREE.Vector3();
    const t0=performance.now();
    const animate=()=>{
      const id=requestAnimationFrame(animate); setId(id);
      const t=(performance.now()-t0)*0.001, a=activeRef.current, spd=a?1.8:0.55;
      const ts=a?1.12:1.0;
      bagGroup.rotation.y=t*spd*0.35; bagGroup.rotation.x=Math.sin(t*0.28)*0.16;
      bagGroup.scale.lerp(tv.set(ts,ts,ts),0.06);
      inner.scale.setScalar(1+Math.sin(t*1.6)*0.12);
      wheels.forEach(w=>{w.userData.angle+=w.userData.spd*0.014;w.position.x=Math.cos(w.userData.angle)*w.userData.r;w.position.y=-0.72;w.position.z=Math.sin(w.userData.angle)*w.userData.r;w.rotation.z=t*3;});
      products.forEach(m=>{m.userData.angle+=m.userData.spd*0.012;m.position.x=Math.cos(m.userData.angle)*m.userData.r;m.position.z=Math.sin(m.userData.angle)*m.userData.r;m.position.y=m.userData.y+Math.sin(t*0.8+m.userData.angle)*0.22;m.rotation.y=t*1.5;m.rotation.x=t*0.8;});
      tags.forEach(g=>{g.userData.angle+=g.userData.spd*0.015;g.position.x=Math.cos(g.userData.angle)*g.userData.r;g.position.z=Math.sin(g.userData.angle)*g.userData.r;g.position.y=g.userData.yOff+Math.sin(t*1.2)*0.18;g.rotation.y=t*2.5;});
      coin1.rotation.z=t*0.18; coin2.rotation.y=t*0.14; coin2.rotation.x=Math.PI/3+t*0.10;
      pts.rotation.y=t*0.11;
      pl1.position.set(Math.sin(t*0.5)*3.5,Math.cos(t*0.38)*3,4);
      renderer.render(scene,cam);
    };
    animate();
  });
  return <div ref={mountRef} style={{width:"100%",height:"100%"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/></div>;
};

/* ══════════════════════════════════════════════════════════════════════
   WEAREIKO — Big Fashion House
   Scene: elegant dress form silhouette (capsule + cone) with orbiting
   fabric swatches (flat discs), jewellery rings, gem stones, runway particles
════════════════════════════════════════════════════════════════════════ */
const FashionScene = ({ active }) => {
  const activeRef=useRef(active);
  useEffect(()=>{activeRef.current=active;},[active]);
  const {mountRef,canvasRef}=useThreeCanvas((renderer,W,H,setId)=>{
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(52,W/H,0.1,100); cam.position.z=5.5;
    const col=0x818CF8, col2=0xA78BFA, col3=0xC4B5FD;

    scene.add(new THREE.AmbientLight(0xf0e8ff,0.30));
    const pl1=new THREE.PointLight(col,10,26); pl1.position.set(3,4,4); scene.add(pl1);
    const pl2=new THREE.PointLight(col2,5,20); pl2.position.set(-3,2,2); scene.add(pl2);
    const pl3=new THREE.PointLight(col3,3,18); pl3.position.set(0,-3,2); scene.add(pl3);

    /* Dress form — torso shape built from a tapered cylinder (bodice) + sphere (neckline) */
    const formGroup=new THREE.Group(); scene.add(formGroup);
    const bodice=new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.70,1.40,32),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.24,specular:0xffffff,shininess:280,transparent:true,opacity:0.88}));
    formGroup.add(bodice);
    const neckline=new THREE.Mesh(new THREE.SphereGeometry(0.32,24,24),new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:0.35,specular:0xffffff,shininess:320,transparent:true,opacity:0.90}));
    neckline.position.y=0.88; formGroup.add(neckline);
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(0.70,1.15,0.90,32),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.18,specular:0xffffff,shininess:220,transparent:true,opacity:0.82}));
    skirt.position.y=-1.05; formGroup.add(skirt);
    /* Wireframe overlay */
    const bodyWire=new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.70,1.40,32),new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:0.18}));
    bodyWire.scale.setScalar(1.03); formGroup.add(bodyWire);
    /* Inner glow */
    const inner=new THREE.Mesh(new THREE.SphereGeometry(0.38,20,20),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.9,transparent:true,opacity:0.22}));
    inner.position.y=0.0; formGroup.add(inner);

    /* Fabric swatches — flat discs orbiting like floating fabric panels */
    const swatchCols=[col,col2,col3,0x7C3AED,col];
    const swatches=[
      {r:1.90,spd:0.30,y:0.1, p:0,   rx:Math.PI/2.5,rz:0.2},
      {r:1.80,spd:-0.24,y:0.5,p:1.26,rx:Math.PI/3,  rz:0.5},
      {r:1.95,spd:0.20,y:-0.3,p:2.51,rx:Math.PI/4,  rz:-0.3},
      {r:1.75,spd:-0.32,y:0.3,p:3.77,rx:Math.PI/2,  rz:0.4},
      {r:1.88,spd:0.26,y:-0.1,p:5.03,rx:Math.PI/3.5,rz:-0.5},
    ].map((d,i)=>{
      const m=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.04,32),new THREE.MeshPhongMaterial({color:swatchCols[i],emissive:swatchCols[i],emissiveIntensity:0.28,specular:0xffffff,shininess:180,transparent:true,opacity:0.80}));
      m.userData={...d,angle:d.p}; scene.add(m); return m;
    });

    /* Jewellery rings — large elegant tori representing necklaces/bangles */
    const jwl1=new THREE.Mesh(new THREE.TorusGeometry(2.0,0.026,14,100),new THREE.MeshPhongMaterial({color:col2,emissive:col2,emissiveIntensity:0.48,transparent:true,opacity:0.60}));
    jwl1.rotation.x=Math.PI/2.2; scene.add(jwl1);
    const jwl2=new THREE.Mesh(new THREE.TorusGeometry(2.45,0.016,12,80),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.32,transparent:true,opacity:0.38}));
    jwl2.rotation.x=Math.PI/4; jwl2.rotation.z=Math.PI/5; scene.add(jwl2);
    const jwl3=new THREE.Mesh(new THREE.TorusGeometry(1.58,0.012,10,60),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.36,transparent:true,opacity:0.42}));
    jwl3.rotation.x=Math.PI/6; jwl3.rotation.z=-Math.PI/4; scene.add(jwl3);

    /* Gemstones — octahedrons floating like diamonds/jewels */
    const gems=[0,1,2,3,4].map(i=>{
      const m=new THREE.Mesh(new THREE.OctahedronGeometry(0.09,0),new THREE.MeshPhongMaterial({color:col3,emissive:col3,emissiveIntensity:0.9,specular:0xffffff,shininess:400}));
      m.userData={angle:(i/5)*Math.PI*2,r:1.58+Math.random()*0.5,spd:0.22*(i%2?1:-1),yOff:(i/5-0.4)*1.2};
      scene.add(m); return m;
    });

    /* Runway particles — elongated vertical points suggesting a catwalk */
    const pCount=90,pPos=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){
      const a=(i/pCount)*Math.PI*2,r=2.8+Math.random()*1.1;
      pPos[i*3]=Math.cos(a)*r; pPos[i*3+1]=(Math.random()-0.5)*3.5; pPos[i*3+2]=Math.sin(a)*r;
    }
    const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(pPos,3)),new THREE.PointsMaterial({color:col,size:0.038,transparent:true,opacity:0.52}));
    scene.add(pts);

    const tv=new THREE.Vector3();
    const t0=performance.now();
    const animate=()=>{
      const id=requestAnimationFrame(animate); setId(id);
      const t=(performance.now()-t0)*0.001, a=activeRef.current, spd=a?1.6:0.48;
      const ts=a?1.12:1.0;
      /* Dress form sways gracefully */
      formGroup.rotation.y=t*spd*0.28;
      formGroup.rotation.z=Math.sin(t*0.40)*0.06;
      formGroup.scale.lerp(tv.set(ts,ts,ts),0.05);
      inner.scale.setScalar(1+Math.sin(t*1.5)*0.12);
      /* Fabric swatches drift */
      swatches.forEach(s=>{s.userData.angle+=s.userData.spd*0.012;s.position.x=Math.cos(s.userData.angle)*s.userData.r;s.position.z=Math.sin(s.userData.angle)*s.userData.r;s.position.y=s.userData.y+Math.sin(t*0.7+s.userData.angle)*0.28;s.rotation.y=t*0.9;s.rotation.x=s.userData.rx+Math.sin(t*0.5)*0.15;});
      /* Jewellery rings */
      jwl1.rotation.z=t*0.16; jwl2.rotation.y=t*0.12; jwl2.rotation.x=Math.PI/4+t*0.08; jwl3.rotation.z=t*0.20; jwl3.rotation.y=t*0.10;
      /* Gemstones sparkle */
      gems.forEach(g=>{g.userData.angle+=g.userData.spd*0.014;g.position.x=Math.cos(g.userData.angle)*g.userData.r;g.position.z=Math.sin(g.userData.angle)*g.userData.r;g.position.y=g.userData.yOff+Math.sin(t*1.4+g.userData.angle)*0.20;g.rotation.y=t*3;g.rotation.x=t*1.5;});
      pts.rotation.y=t*0.10;
      pl1.position.set(Math.sin(t*0.45)*3.5,Math.cos(t*0.35)*3,4);
      renderer.render(scene,cam);
    };
    animate();
  });
  return <div ref={mountRef} style={{width:"100%",height:"100%"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/></div>;
};

/* ─── Scene router — picks the right scene per project id ────────────── */
const ProjectScene = ({ id, color, active }) => {
  if (id==="conotex") return <TechScene active={active}/>;
  if (id==="vendo")   return <EcommerceScene active={active}/>;
  if (id==="weareiko")return <FashionScene active={active}/>;
  return <TechScene active={active}/>;
};

/* ─── Hero Banner 3D ─────────────────────────────────────────────────── */
const HeroBanner = () => {
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    let renderer=null, animId=null;
    const init=()=>{
      if(renderer) return;
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(canvas.clientWidth,canvas.clientHeight); renderer.setClearColor(0x000000,0);
      const scene=new THREE.Scene();
      const cam=new THREE.PerspectiveCamera(55,canvas.clientWidth/canvas.clientHeight,0.1,200); cam.position.z=7;
      scene.add(new THREE.AmbientLight(0xd0e8ff,0.22));
      const pls=[[0x4F8EF7,5,[5,4,5]],[0x38BDF8,3.5,[-4,-3,3]],[0x818CF8,2.5,[0,-4,2]],[0x6BA3FF,2,[4,-2,-3]]].map(([c,i,p])=>{const l=new THREE.PointLight(c,i,32);l.position.set(...p);scene.add(l);return l;});
      const coreGeo=new THREE.IcosahedronGeometry(1.2,2);
      const origPos=new Float32Array(coreGeo.attributes.position.array);
      const tmpPos=new Float32Array(origPos.length);
      const ico=new THREE.Mesh(coreGeo,new THREE.MeshPhongMaterial({color:0x030d1a,emissive:0x060e1e,specular:new THREE.Color(C.o1),shininess:280,transparent:true,opacity:0.97})); scene.add(ico);
      const wire=new THREE.Mesh(coreGeo,new THREE.MeshBasicMaterial({color:0x4F8EF7,wireframe:true,transparent:true,opacity:0.18})); wire.scale.setScalar(1.016); scene.add(wire);
      const ig=new THREE.Mesh(new THREE.SphereGeometry(0.55,32,32),new THREE.MeshPhongMaterial({color:0x4F8EF7,emissive:0x4F8EF7,emissiveIntensity:0.9,transparent:true,opacity:0.22})); scene.add(ig);
      const mkRing=(r,tube,col,op,rx,rz)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,16,140),new THREE.MeshPhongMaterial({color:col,emissive:new THREE.Color(col).multiplyScalar(0.25),shininess:280,transparent:true,opacity:op}));m.rotation.x=rx;m.rotation.z=rz;scene.add(m);return m;};
      const r1=mkRing(2.4,0.030,0x4F8EF7,0.75,Math.PI/2.4,0.3);
      const r2=mkRing(3.0,0.020,0x38BDF8,0.52,Math.PI/4,Math.PI/5);
      const r3=mkRing(3.6,0.014,0x818CF8,0.38,Math.PI/6.5,-Math.PI/4);
      const orbitShapes=[{G:new THREE.BoxGeometry(0.28,0.28,0.28),c:0x4F8EF7},{G:new THREE.OctahedronGeometry(0.26,0),c:0x38BDF8},{G:new THREE.TorusGeometry(0.22,0.09,10,32),c:0x818CF8},{G:new THREE.IcosahedronGeometry(0.24,1),c:0x6BA3FF},{G:new THREE.TetrahedronGeometry(0.28,0),c:0x93BBFF},{G:new THREE.SphereGeometry(0.22,16,16),c:0x4F8EF7},{G:new THREE.CylinderGeometry(0.14,0.14,0.32,16),c:0x38BDF8},{G:new THREE.OctahedronGeometry(0.24,0),c:0x818CF8},{G:new THREE.BoxGeometry(0.22,0.22,0.22),c:0x6BA3FF}].map((d,i)=>{const m=new THREE.Mesh(d.G,new THREE.MeshPhongMaterial({color:d.c,emissive:d.c,emissiveIntensity:0.42,shininess:220}));m.userData={angle:(i/9)*Math.PI*2,radius:1.9+(i%3)*0.4,speed:(0.25+i*0.09)*(i%2?1:-1),yOff:Math.sin(i*1.1)*0.6};scene.add(m);return m;});
      const pCount=260,pPos=new Float32Array(pCount*3),pCol=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const r=4.2+Math.random()*2.4,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pPos[i*3]=r*Math.sin(p)*Math.cos(t);pPos[i*3+1]=r*Math.sin(p)*Math.sin(t);pPos[i*3+2]=r*Math.cos(p);pCol[i*3]=0.3+Math.random()*0.4;pCol[i*3+1]=0.5+Math.random()*0.3;pCol[i*3+2]=1.0;}
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3)); pGeo.setAttribute("color",new THREE.BufferAttribute(pCol,3));
      const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.040,transparent:true,opacity:0.78,vertexColors:true})); scene.add(particles);
      let tmx=0,tmy=0,mx=0,my=0;
      const onMove=e=>{const t=e.touches?e.touches[0]:e;tmx=(t.clientX/window.innerWidth-.5)*2;tmy=-(t.clientY/window.innerHeight-.5)*2;};
      const onResize=()=>{if(!renderer)return;renderer.setSize(canvas.clientWidth,canvas.clientHeight);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.updateProjectionMatrix();};
      window.addEventListener("mousemove",onMove); window.addEventListener("touchmove",onMove,{passive:true}); window.addEventListener("resize",onResize);
      const t0=performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate); const t=(performance.now()-t0)*0.001;
        mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
        for(let i=0;i<origPos.length;i+=3){const ox=origPos[i],oy=origPos[i+1],oz=origPos[i+2];const len=Math.sqrt(ox*ox+oy*oy+oz*oz);const wave=Math.sin(t*1.4+ox*2.1+oy*1.7)*0.05;const sc=(1.2+wave)/len;tmpPos[i]=ox*sc;tmpPos[i+1]=oy*sc;tmpPos[i+2]=oz*sc;}
        coreGeo.attributes.position.array.set(tmpPos); coreGeo.attributes.position.needsUpdate=true; coreGeo.computeVertexNormals();
        ico.rotation.x=t*0.16+my*0.22; ico.rotation.y=t*0.22+mx*0.22;
        wire.rotation.x=ico.rotation.x; wire.rotation.y=ico.rotation.y;
        ig.scale.setScalar(1+Math.sin(t*1.8)*0.12);
        r1.rotation.z=t*0.20; r2.rotation.x=Math.PI/4+t*0.15; r2.rotation.z=Math.PI/5+t*0.11; r3.rotation.y=t*0.12; r3.rotation.z=-Math.PI/4+t*0.08;
        orbitShapes.forEach(m=>{m.userData.angle+=m.userData.speed*0.012;m.position.x=Math.cos(m.userData.angle)*m.userData.radius;m.position.z=Math.sin(m.userData.angle)*m.userData.radius;m.position.y=m.userData.yOff+Math.sin(t*0.9+m.userData.angle)*0.3;m.rotation.y=t*1.9;m.rotation.x=t*0.95;});
        particles.rotation.y=t*0.026; particles.rotation.x=t*0.013;
        pls[0].position.set(Math.sin(t*0.4)*6,Math.cos(t*0.3)*5,5); pls[1].position.set(Math.cos(t*0.3)*-6,Math.sin(t*0.45)*-4,4);
        renderer.render(scene,cam);
      };
      animate();
      return()=>{cancelAnimationFrame(animId);window.removeEventListener("mousemove",onMove);window.removeEventListener("touchmove",onMove);window.removeEventListener("resize",onResize);renderer.dispose();renderer=null;};
    };
    let cleanup=null;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!cleanup)cleanup=init();else if(!e.isIntersecting&&cleanup){cleanup();cleanup=null;}},{threshold:0.01});
    obs.observe(canvas);
    return()=>{obs.disconnect();cleanup?.();};
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ─── Project Card — 3D scene fills the top half ────────────────────── */
const ProjectCard = ({ project, index, visible }) => {
  const [hov,setHov]=useState(false);
  const [tab,setTab]=useState("overview");
  const { title, subtitle, desc, link, color, gradFrom, gradTo, tag, year, category, tech, metrics, shape } = project;

  return(
    <article
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative", borderRadius:18, overflow:"hidden",
        display:"flex", flexDirection:"column",
        background:hov?C.bg3:C.bg2,
        border:hov?`1px solid ${color}55`:"1px solid rgba(255,255,255,0.06)",
        transform:hov?"translateY(-10px) scale(1.012)":"none",
        transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)",
        boxShadow:hov
          ?`0 24px 72px rgba(0,0,0,0.70),0 0 0 1px ${color}22,inset 0 1px 0 rgba(255,255,255,0.08)`
          :"0 4px 24px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.03)",
        opacity:visible?1:0,
        animation:visible?`pj_fadeUp 0.7s ease both ${index*150}ms`:"none",
        cursor:"default",
      }}
    >
      {/* Top accent line */}
      <div style={{height:2.5,background:`linear-gradient(90deg,transparent,${color},transparent)`,flexShrink:0}}/>
      {hov&&<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 20%,${color}10,transparent 65%)`,pointerEvents:"none",zIndex:0}}/>}

      {/* ── 3D Scene — full width, tall ── */}
      <div style={{
        width:"100%", height:"clamp(220px,32vw,300px)", flexShrink:0,
        position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse at 50% 55%,${color}14 0%,${C.bg1} 72%)`,
      }}>
        <ProjectScene id={project.id} color={color} active={hov}/>

        {/* Scan line */}
        <div style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}60,transparent)`,animation:"pj_scanDown 5s linear infinite",opacity:0.45}}/>
        </div>

        {/* Top overlays */}
        <div style={{position:"absolute",top:12,left:14,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:7,background:"rgba(8,10,15,0.84)",backdropFilter:"blur(12px)",border:`1px solid ${color}45`}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`,display:"inline-block"}}/>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color}}>{tag}</span>
        </div>
        <div style={{position:"absolute",top:12,right:14,zIndex:6,padding:"4px 10px",borderRadius:6,background:"rgba(8,10,15,0.78)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.10)",color:C.tf,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{year}</div>

        {/* Bottom overlays */}
        <div style={{position:"absolute",bottom:12,left:14,zIndex:6,padding:"3px 9px",borderRadius:6,background:`${color}18`,border:`1px solid ${color}35`,color,fontSize:8.5,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{category}</div>
        <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:6,display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:6,background:"rgba(8,10,15,0.82)",backdropFilter:"blur(10px)",border:`1px solid ${C.o1}28`,whiteSpace:"nowrap"}}>
          <span style={{width:4,height:4,borderRadius:"50%",background:C.o1,boxShadow:`0 0 6px ${C.o1}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
          <span style={{color:C.o1,fontSize:8,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase"}}>Interactive 3D</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{padding:"clamp(16px,2.5vw,22px)",display:"flex",flexDirection:"column",gap:12,position:"relative",zIndex:1}}>

        <div>
          <div style={{color,fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:3,opacity:0.8}}>{subtitle}</div>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(14px,1.7vw,18px)",letterSpacing:"-0.015em",lineHeight:1.2,color:hov?C.tw:C.ts,margin:0,transition:"color 0.25s ease"}}>{title}</h3>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:3,background:"rgba(255,255,255,0.04)",borderRadius:9,padding:3,border:"1px solid rgba(255,255,255,0.06)"}}>
          {["overview","metrics","tech"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"6px 0",borderRadius:7,border:tab===t?`1px solid ${color}40`:"1px solid transparent",background:tab===t?`${color}15`:"transparent",color:tab===t?color:C.tm,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"capitalize",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s ease",outline:"none"}}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{minHeight:68}}>
          {tab==="overview"&&<p style={{color:C.tm,fontSize:"clamp(11.5px,1.3vw,13px)",lineHeight:1.8,margin:0,fontFamily:"'DM Sans',sans-serif"}}>{desc}</p>}
          {tab==="metrics"&&(
            <div style={{display:"flex",gap:8}}>
              {metrics.map((m,i)=>(
                <div key={i} style={{flex:"1 1 0",padding:"10px 6px",borderRadius:10,background:`${color}10`,border:`1px solid ${color}22`,textAlign:"center"}}>
                  <div style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(0.95rem,2vw,1.25rem)",background:`linear-gradient(135deg,${C.tw},${color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{m.val}</div>
                  <div style={{color:C.tf,fontSize:8,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
          {tab==="tech"&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {tech.map(t=><span key={t} style={{padding:"5px 11px",borderRadius:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:C.tm,fontSize:10,fontWeight:600,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}
            </div>
          )}
        </div>

        {/* Quality bar */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Quality Score</span>
            <span style={{color,fontSize:9,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>98%</span>
          </div>
          <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:visible?"98%":"0%",borderRadius:2,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,transition:"width 1.8s cubic-bezier(0.23,1,0.32,1) 0.5s",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)",animation:"pj_shimmer 2.2s ease-in-out infinite"}}/>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${color}15`,gap:10,flexWrap:"wrap"}}>
          <a href={link} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",borderRadius:9,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.06em",color:"#fff",background:`linear-gradient(135deg,${gradFrom},${gradTo})`,boxShadow:`0 4px 18px ${color}40`,transition:"all 0.28s ease",textTransform:"uppercase"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px) scale(1.04)";e.currentTarget.style.boxShadow=`0 8px 28px ${color}60`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 18px ${color}40`;}}>
            → View Live
          </a>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.accent,boxShadow:`0 0 8px ${C.accent}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
            <span style={{color:C.tm,fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Live</span>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─── Main Section ───────────────────────────────────────────────────── */
const Projects = () => {
  const [visible,setVisible]=useState(false);
  const sectionRef=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);},{threshold:0.05,rootMargin:"40px"});
    if(sectionRef.current)obs.observe(sectionRef.current);
    return()=>obs.disconnect();
  },[]);
  const handleNav=useCallback(id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});},[]);

  return(
    <>
      <style>{`
        @keyframes pj_fadeUp    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pj_fadeDown  {from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pj_pulse     {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.18);opacity:1}}
        @keyframes pj_glowPulse {0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
        @keyframes pj_borderRot {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pj_scanDown  {0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
        @keyframes pj_shimmer   {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes pj_hexDrift  {from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes pj_gradText  {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pj_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}
        @keyframes pj_float1    {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-13px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        .pj-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;padding:clamp(56px,9vw,110px) 0 clamp(64px,10vw,120px);}
        .pj-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}
        .pj-inner{position:relative;z-index:10;max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,80px);display:flex;flex-direction:column;gap:clamp(32px,5vw,52px);}
        .pj-banner-wrap{position:relative;width:100%;height:clamp(180px,45vw,340px);}
        .pj-banner-card{width:100%;height:100%;border-radius:18px;overflow:hidden;border:1px solid rgba(79,142,247,0.28);position:relative;animation:pj_glowPulse 4s ease-in-out infinite;}
        .pj-grid{display:grid;grid-template-columns:1fr;gap:clamp(18px,2.5vw,28px);}
        @media(min-width:700px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:1100px){.pj-grid{grid-template-columns:repeat(3,1fr);}}
        .pj-hl{font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:#F8FAFF;margin:0;font-size:clamp(1.75rem,7.8vw,2.35rem);}
        .pj-hl .pj-accent{display:block;background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:pj_gradText 5s ease infinite;filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));}
        .pj-shapes{display:none !important;}
        @media(min-width:600px){.pj-shapes{display:block !important;}}
        @media(max-width:380px){.pj-inner{padding:0 10px;}.pj-hl{font-size:1.55rem;}}
        @media(min-width:768px){.pj-hl{font-size:clamp(2rem,3vw,3.1rem);}}
        @media(min-width:1024px){.pj-hl{font-size:clamp(2.25rem,3.1vw,3.4rem);}}
      `}</style>

      <section id="projects" ref={sectionRef} className="pj-section" aria-label="Featured Projects">
        <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"pj_hexDrift 16s linear infinite"}}><HexPattern/></div>
        <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none"}}><filter id="pj_n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#pj_n)"/></svg>
        <div className="pj-scanline" aria-hidden="true"/>
        <div aria-hidden="true" style={{position:"absolute",top:"8%",left:"12%",width:"min(600px,50vw)",height:"min(600px,50vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div aria-hidden="true" style={{position:"absolute",bottom:"5%",right:"8%",width:"min(480px,38vw)",height:"min(480px,38vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div aria-hidden="true" style={{position:"absolute",top:"50%",left:"5%",width:"min(360px,28vw)",height:"min(360px,28vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(129,140,248,0.05) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div className="pj-shapes" aria-hidden="true" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2}}>
          <svg width="80" height="80" viewBox="0 0 120 120" style={{position:"absolute",top:"5%",right:"2%",animation:"pj_float1 8s ease-in-out infinite",filter:`drop-shadow(0 0 14px ${C.o1}55)`}}><defs><linearGradient id="pj_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs><polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#pj_sh1)" strokeWidth="1.4" opacity="0.7"/></svg>
          <svg width="56" height="56" viewBox="0 0 90 90" style={{position:"absolute",bottom:"6%",left:"1.5%",animation:"pj_float1 11s ease-in-out infinite reverse",filter:`drop-shadow(0 0 10px ${C.accent}50)`}}><polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65"/></svg>
        </div>

        <div className="pj-inner">

          {/* Header */}
          <header style={{textAlign:"center",opacity:visible?1:0,animation:visible?"pj_fadeDown 0.8s ease both 0.05s":"none"}}>
            <div style={{marginBottom:12}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:7,background:"rgba(79,142,247,0.10)",border:`1px solid rgba(79,142,247,0.32)`,color:C.o2,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"pj_badgePulse 3.2s ease-in-out infinite",boxShadow:"0 0 18px rgba(79,142,247,0.12)"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
                Our Work
              </span>
            </div>
            <h2 className="pj-hl">
              <span style={{display:"block",color:C.tm,fontSize:"0.58em",fontWeight:400,marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"}}>Real products. Real impact.</span>
              <span style={{display:"block",color:C.tw}}>Featured</span>
              <span className="pj-accent">Projects</span>
            </h2>
            <div style={{maxWidth:520,margin:"14px auto 0"}}>
              <p style={{color:C.tm,fontSize:"clamp(13px,1.5vw,15.5px)",lineHeight:1.8,margin:"0 0 18px"}}>Digital products built for visionary clients — from enterprise infrastructure to consumer apps and global brands.</p>
              <Divider/>
            </div>
          </header>

          {/* Hero banner */}
          <div style={{opacity:visible?1:0,animation:visible?"pj_fadeUp 0.9s ease both 0.2s":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
              <span style={{color:C.tm,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Projects universe — drag to interact</span>
            </div>
            <div className="pj-banner-wrap">
              <div aria-hidden="true" style={{position:"absolute",inset:-2,borderRadius:20,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
                <div style={{position:"absolute",inset:-2,borderRadius:22,background:`conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`,animation:"pj_borderRot 11s linear infinite"}}/>
              </div>
              <div className="pj-banner-card" style={{zIndex:1}}>
                <div style={{position:"absolute",inset:"10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.18) 0%,rgba(56,189,248,0.05) 40%,transparent 70%)",filter:"blur(28px)",zIndex:0}}/>
                <div style={{position:"absolute",inset:0,zIndex:6,overflow:"hidden",pointerEvents:"none",borderRadius:18}}>
                  <div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`,animation:"pj_scanDown 5.5s linear infinite",opacity:0.5}}/>
                </div>
                {[{top:12,left:12,borderTop:`2px solid ${C.o1}90`,borderLeft:`2px solid ${C.o1}90`},{top:12,right:12,borderTop:`2px solid ${C.accent}90`,borderRight:`2px solid ${C.accent}90`},{bottom:12,left:12,borderBottom:`2px solid ${C.accentAlt}90`,borderLeft:`2px solid ${C.accentAlt}90`},{bottom:12,right:12,borderBottom:`2px solid ${C.o1}90`,borderRight:`2px solid ${C.o1}90`}].map((s,i)=><div key={i} aria-hidden="true" style={{position:"absolute",width:22,height:22,zIndex:7,...s}}/>)}
                <div style={{position:"absolute",top:14,left:14,zIndex:8,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,background:"rgba(8,10,15,0.92)",backdropFilter:"blur(14px)",border:`1px solid rgba(79,142,247,0.35)`}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
                  <span style={{color:C.o1,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>Projects Universe</span>
                </div>
                <div style={{position:"absolute",bottom:14,right:14,zIndex:8,display:"flex",gap:7}}>
                  {["Enterprise","Product","Brand"].map((t,i)=><span key={t} style={{padding:"3px 9px",borderRadius:6,background:"rgba(8,10,15,0.78)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:[C.o1,C.accent,C.accentAlt][i],fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}
                </div>
                <HeroBanner/>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,opacity:visible?1:0,animation:visible?"pj_fadeUp 0.7s ease both 0.4s":"none"}}>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)`}}/>
              <div style={{width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0}}/>
              <span style={{color:C.tm,fontSize:9,fontWeight:700,letterSpacing:"0.28em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Case Studies</span>
              <div style={{width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0}}/>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)`}}/>
            </div>
            <div className="pj-grid">
              {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i} visible={visible}/>)}
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(10px,2vw,16px)",justifyContent:"center",opacity:visible?1:0,animation:visible?"pj_fadeUp 0.7s ease both 0.65s":"none"}}>
            {STATS.map((s,i)=>(
              <div key={i} style={{flex:"1 1 140px",minWidth:120,padding:"clamp(12px,2vw,18px)",borderRadius:14,background:C.bg2,border:"1px solid rgba(255,255,255,0.06)",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.color},transparent)`}}/>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(1.3rem,3vw,2rem)",background:`linear-gradient(135deg,${C.tw},${s.color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{s.val}</div>
                <div style={{color:C.tm,fontSize:"clamp(8px,1vw,10px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:5,fontFamily:"'DM Sans',sans-serif"}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14,opacity:visible?1:0,animation:visible?"pj_fadeUp 0.7s ease both 0.8s":"none"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
              <button onClick={()=>handleNav("contact")} style={{padding:"13px clamp(24px,3vw,36px)",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(12px,1.3vw,13.5px)",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",background:`linear-gradient(135deg,${C.o1},${C.o4})`,color:"#fff",boxShadow:`0 6px 22px rgba(79,142,247,0.35)`,transition:"all 0.22s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px) scale(1.03)";e.currentTarget.style.boxShadow="0 14px 42px rgba(79,142,247,0.55)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 6px 22px rgba(79,142,247,0.35)`;}}>→ Start Your Project</button>
              <button onClick={()=>handleNav("contact")} style={{padding:"13px clamp(24px,3vw,36px)",borderRadius:9,border:`1.5px solid rgba(79,142,247,0.38)`,background:"transparent",color:C.o1,fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(12px,1.3vw,13.5px)",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.22s ease"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(79,142,247,0.10)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform="";}}>Free Consultation</button>
            </div>
            <p style={{color:C.tf,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",margin:0}}>500+ projects delivered · No commitment required</p>
          </div>
        </div>

        <div aria-hidden="true" style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,rgba(8,10,15,0.85))`,zIndex:5,pointerEvents:"none"}}/>
        <div aria-hidden="true" style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}28,transparent)`,zIndex:6}}/>
      </section>
    </>
  );
};

export default Projects;