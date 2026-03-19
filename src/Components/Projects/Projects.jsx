import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─── Design Tokens — identical to Hero / About / Services ──────────── */
const C = {
  bg0:"#080A0F", bg1:"#0D1017", bg2:"#131820", bg3:"#1C2333",
  o1:"#4F8EF7",  o2:"#6BA3FF",  o3:"#93BBFF",  o4:"#2563EB",
  accent:"#38BDF8", accentAlt:"#818CF8",
  tw:"#F8FAFF", ts:"#C8D5F0", tm:"#7A90B8", tf:"#3A4F72",
};

/* ─── Project Data ───────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id:"conotex",
    title:"Conotex Integrated Services",
    subtitle:"IT & Low-Voltage Solutions",
    desc:"Nationwide low-voltage and managed IT solutions. Since 2011, CIS has partnered with top brands to design, deploy, and manage secure, reliable digital infrastructure.",
    images:["/conotex2.webp","/conotex3.jpg","/conotex1.png"],
    link:"https://www.conotextech.com/",
    color:"#4F8EF7", gradFrom:"#4F8EF7", gradTo:"#2563EB",
    tag:"IT Infrastructure", year:"2024", category:"Enterprise",
    tech:["Next.js","Node.js","AWS","PostgreSQL"],
    metrics:[{val:"99.9%",label:"Uptime SLA"},{val:"40%",label:"Cost Reduced"},{val:"3×",label:"Faster Deploy"}],
    shape:"icosahedron",
  },
  {
    id:"vendo",
    title:"Vendo",
    subtitle:"Modern eCommerce Platform",
    desc:"A responsive eCommerce frontend engineered for seamless shopping. Dynamic product grids, category browsing, intelligent search, and fully optimised responsive design.",
    images:["/vendo1.jpg","/vendo2.jpg","/vendo3.jpg"],
    link:"https://my-ecommerce-nine-iota.vercel.app/",
    color:"#38BDF8", gradFrom:"#38BDF8", gradTo:"#0891B2",
    tag:"eCommerce", year:"2024", category:"Product",
    tech:["React","Tailwind CSS","Stripe","Vercel"],
    metrics:[{val:"3×",label:"Conversion"},{val:"0.8s",label:"Load Time"},{val:"98",label:"Lighthouse"}],
    shape:"torus",
  },
  {
    id:"weareiko",
    title:"WearEiko",
    subtitle:"African-Inspired Fashion Brand",
    desc:"WearEiko blends African heritage with modern fashion, empowering self-expression through timeless, culturally-rooted designs. Every garment tells a story of identity and creativity.",
    images:["/wear2.jpg","/wear1.jpg","/wear3.jpg"],
    link:"https://weareiko.com",
    color:"#818CF8", gradFrom:"#818CF8", gradTo:"#4F46E5",
    tag:"Fashion & Lifestyle", year:"2023", category:"Brand",
    tech:["Shopify","Custom Theme","Klaviyo","SEO"],
    metrics:[{val:"5×",label:"ROI"},{val:"200%",label:"Traffic Up"},{val:"4.9★",label:"Rating"}],
    shape:"octahedron",
  },
];

const toRgb = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(",");

/* ─── Hex Pattern ────────────────────────────────────────────────────── */
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

/* ─── Per-Card 3D Scene ──────────────────────────────────────────────── */
const CardScene = ({ color, shape, active }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  useEffect(()=>{ activeRef.current = active; },[active]);

  useEffect(()=>{
    const mount = mountRef.current, canvas = canvasRef.current;
    if(!mount||!canvas) return;
    let renderer=null, animId=null;

    const init=()=>{
      if(renderer) return;
      const W=mount.clientWidth||260, H=mount.clientHeight||200;
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(W,H); renderer.setClearColor(0x000000,0);
      const scene=new THREE.Scene();
      const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100); cam.position.z=4.2;
      const hexCol=parseInt(color.replace("#",""),16);
      const col3=new THREE.Color(color);
      scene.add(new THREE.AmbientLight(0xd0e8ff,0.30));
      const pl1=new THREE.PointLight(col3,8,22); pl1.position.set(3,3,3); scene.add(pl1);
      const pl2=new THREE.PointLight(0xffffff,2,18); pl2.position.set(-2,-1.5,2); scene.add(pl2);
      const plRim=new THREE.PointLight(col3,3,16); plRim.position.set(0,-2.5,-2); scene.add(plRim);
      const GEO={torus:()=>new THREE.TorusGeometry(0.78,0.30,22,90),octahedron:()=>new THREE.OctahedronGeometry(1.0,0),sphere:()=>new THREE.SphereGeometry(0.9,32,32),icosahedron:()=>new THREE.IcosahedronGeometry(0.95,1)};
      const geo=(GEO[shape]||GEO.icosahedron)();
      const mesh=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.26,specular:0xffffff,shininess:220,transparent:true,opacity:0.92})); scene.add(mesh);
      const wire=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:hexCol,wireframe:true,transparent:true,opacity:0.18})); wire.scale.setScalar(1.05); scene.add(wire);
      const inner=new THREE.Mesh(new THREE.SphereGeometry(0.44,24,24),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:1.0,transparent:true,opacity:0.28})); scene.add(inner);
      const rA=new THREE.Mesh(new THREE.TorusGeometry(1.55,0.024,14,100),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.5,transparent:true,opacity:0.62})); rA.rotation.x=Math.PI/2.8; scene.add(rA);
      const rB=new THREE.Mesh(new THREE.TorusGeometry(1.9,0.014,12,80),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.32,transparent:true,opacity:0.40})); rB.rotation.x=Math.PI/5; rB.rotation.z=Math.PI/6; scene.add(rB);
      const sats=[{r:1.65,spd:0.55,y:0.3,p:0},{r:1.80,spd:-0.38,y:-0.4,p:2.1},{r:1.55,spd:0.72,y:0.6,p:4.2}].map(d=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,14),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.9}));s.userData={...d,angle:d.p};scene.add(s);return s;});
      const pCount=48,pPos=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=2.1+Math.random()*0.7;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*1.4;pPos[i*3+2]=Math.sin(a)*r;}
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));
      const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({color:hexCol,size:0.055,transparent:true,opacity:0.70})); scene.add(pts);
      const onResize=()=>{if(!renderer)return;renderer.setSize(mount.clientWidth,mount.clientHeight);cam.aspect=mount.clientWidth/mount.clientHeight;cam.updateProjectionMatrix();};
      window.addEventListener("resize",onResize);
      const tv=new THREE.Vector3(), t0=performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate);
        const t=(performance.now()-t0)*0.001, a=activeRef.current, spd=a?1.8:0.6;
        mesh.rotation.y=t*spd*0.52; mesh.rotation.x=Math.sin(t*0.32)*0.30;
        wire.rotation.y=mesh.rotation.y; wire.rotation.x=mesh.rotation.x;
        const ts=a?1.15:1.0; mesh.scale.lerp(tv.set(ts,ts,ts),0.06); wire.scale.setScalar(mesh.scale.x*1.05);
        inner.scale.setScalar(1+Math.sin(t*1.9)*0.13);
        rA.rotation.z=t*0.38; rA.rotation.y=t*0.12;
        rB.rotation.x=Math.PI/5+t*0.25; rB.rotation.z=Math.PI/6+t*0.10;
        sats.forEach(s=>{s.userData.angle+=s.userData.spd*0.014;s.position.x=Math.cos(s.userData.angle)*s.userData.r;s.position.z=Math.sin(s.userData.angle)*s.userData.r;s.position.y=s.userData.y+Math.sin(t*1.1+s.userData.angle)*0.28;});
        pts.rotation.y=t*0.18;
        pl1.position.set(Math.sin(t*0.55)*3,Math.cos(t*0.38)*2.5,3);
        plRim.position.set(Math.cos(t*0.45)*-2.5,-2.5,Math.sin(t*0.62)*-2);
        renderer.render(scene,cam);
      };
      animate();
      return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",onResize);renderer.dispose();renderer=null;};
    };

    let cleanup=null;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!cleanup)cleanup=init();else if(!e.isIntersecting&&cleanup){cleanup();cleanup=null;}},{threshold:0.01,rootMargin:"150px"});
    obs.observe(canvas);
    return()=>{obs.disconnect();cleanup?.();};
  },[color,shape]);

  return <div ref={mountRef} style={{width:"100%",height:"100%"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/></div>;
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

/* ─── Image Carousel ─────────────────────────────────────────────────── */
const Carousel = ({ images, color, title }) => {
  const [idx,setIdx]=useState(0);
  const [loaded,setLoaded]=useState(false);
  const prev=useCallback(()=>{setLoaded(false);setIdx(i=>(i-1+images.length)%images.length);},[images.length]);
  const next=useCallback(()=>{setLoaded(false);setIdx(i=>(i+1)%images.length);},[images.length]);
  const aRgb=toRgb(color);
  return(
    <div style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:C.bg1}}>
      <img src={images[idx]} alt={`${title} screenshot ${idx+1}`} loading="lazy" onLoad={()=>setLoaded(true)}
        style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.45s ease",display:"block"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(8,10,15,0.04) 0%,transparent 35%,rgba(8,10,15,0.55) 100%)",pointerEvents:"none"}}/>
      {images.length>1&&<>
        {[{side:"left",label:"‹",fn:prev},{side:"right",label:"›",fn:next}].map(({side,label,fn})=>(
          <button key={side} onClick={fn} aria-label={`${side} image`} style={{position:"absolute",top:"50%",[side]:12,transform:"translateY(-50%)",zIndex:4,width:32,height:32,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.18)",background:"rgba(8,10,15,0.65)",backdropFilter:"blur(8px)",color:"#fff",fontSize:19,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",transition:"background 0.2s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${aRgb},0.65)`;}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(8,10,15,0.65)";}}>{label}</button>
        ))}
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",gap:5}}>
          {images.map((_,i)=>(
            <button key={i} onClick={()=>{setLoaded(false);setIdx(i);}} aria-label={`Image ${i+1}`} style={{height:5,borderRadius:3,width:i===idx?18:5,background:i===idx?color:"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",padding:0,outline:"none",boxShadow:i===idx?`0 0 8px ${color}`:"none",transition:"all 0.3s ease"}}/>
          ))}
        </div>
      </>}
    </div>
  );
};

/* ─── Project Card ───────────────────────────────────────────────────── */
const ProjectCard = ({ project, index, visible }) => {
  const [hov,setHov]=useState(false);
  const [tab,setTab]=useState("overview");
  const { title, subtitle, desc, images, link, color, gradFrom, gradTo, tag, year, tech, metrics, shape } = project;

  return(
    <article
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative", borderRadius:18, overflow:"hidden", display:"flex", flexDirection:"column",
        background:hov?C.bg3:C.bg2,
        border:hov?`1px solid ${color}55`:"1px solid rgba(255,255,255,0.06)",
        transform:hov?"translateY(-10px) scale(1.012)":"none",
        transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)",
        boxShadow:hov?`0 20px 64px rgba(0,0,0,0.65),0 0 0 1px ${color}20,inset 0 1px 0 rgba(255,255,255,0.07)`:"0 4px 24px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.03)",
        opacity:visible?1:0,
        animation:visible?`pj_fadeUp 0.7s ease both ${index*150}ms`:"none",
        cursor:"default",
      }}
    >
      <div style={{height:2.5,background:`linear-gradient(90deg,transparent,${color},transparent)`,flexShrink:0}}/>
      {hov&&<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${color}0e,transparent 60%)`,pointerEvents:"none",zIndex:0}}/>}

      {/* Image + 3D split */}
      <div className="pj-card-top">
        <div className="pj-card-img" style={{position:"relative",overflow:"hidden"}}>
          <Carousel images={images} color={color} title={title}/>
          <div style={{position:"absolute",top:12,left:14,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:7,background:"rgba(8,10,15,0.82)",backdropFilter:"blur(12px)",border:`1px solid ${color}45`}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`,display:"inline-block"}}/>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color}}>{tag}</span>
          </div>
          <div style={{position:"absolute",top:12,right:14,zIndex:6,padding:"4px 10px",borderRadius:6,background:"rgba(8,10,15,0.75)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.1)",color:C.tf,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em"}}>{year}</div>
        </div>
        <div className="pj-card-3d" style={{position:"relative",background:`radial-gradient(ellipse at 50% 50%,${color}12 0%,${C.bg1} 70%)`}}>
          <CardScene color={color} shape={shape} active={hov}/>
          <div style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}55,transparent)`,animation:"pj_scanDown 5s linear infinite",opacity:0.45}}/>
          </div>
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:"rgba(8,10,15,0.80)",backdropFilter:"blur(10px)",border:`1px solid rgba(79,142,247,0.28)`,whiteSpace:"nowrap"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 7px ${C.o1}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
            <span style={{color:C.o1,fontSize:8.5,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>Interactive 3D</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"clamp(16px,2.5vw,24px)",display:"flex",flexDirection:"column",gap:12,position:"relative",zIndex:1}}>
        <div>
          <div style={{color,fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:4,opacity:0.8}}>{subtitle}</div>
          <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(14px,1.7vw,18px)",letterSpacing:"-0.015em",lineHeight:1.2,color:hov?C.tw:C.ts,margin:0,transition:"color 0.25s ease"}}>{title}</h3>
        </div>

        <div style={{display:"flex",gap:3,background:"rgba(255,255,255,0.04)",borderRadius:9,padding:3,border:"1px solid rgba(255,255,255,0.06)"}}>
          {["overview","metrics","tech"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"6px 0",borderRadius:7,border:tab===t?`1px solid ${color}40`:"1px solid transparent",background:tab===t?`${color}15`:"transparent",color:tab===t?color:C.tm,fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"capitalize",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s ease",outline:"none"}}>{t}</button>
          ))}
        </div>

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

        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Quality Score</span>
            <span style={{color,fontSize:9,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>98%</span>
          </div>
          <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:visible?"98%":"0%",borderRadius:2,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,transition:"width 1.8s cubic-bezier(0.23,1,0.32,1) 0.5s",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)",animation:"pj_shimmer 2.2s ease-in-out infinite"}}/>
            </div>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${color}15`,gap:10,flexWrap:"wrap"}}>
          <a href={link} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",borderRadius:9,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.06em",color:"#fff",background:`linear-gradient(135deg,${gradFrom},${gradTo})`,boxShadow:`0 4px 18px ${color}40`,transition:"all 0.28s ease",textTransform:"uppercase"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px) scale(1.04)";e.currentTarget.style.boxShadow=`0 8px 28px ${color}60`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 18px ${color}40`;}}
          >→ View Live</a>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.accent,boxShadow:`0 0 8px ${C.accent}`,animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
            <span style={{color:C.tm,fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Live</span>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─── Stats ──────────────────────────────────────────────────────────── */
const STATS=[{val:"500+",label:"Projects Delivered",color:C.o1},{val:"30+",label:"Countries Served",color:C.accent},{val:"99%",label:"Client Satisfaction",color:C.accentAlt},{val:"8+",label:"Years of Excellence",color:C.o2}];

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
        .pj-grid{display:grid;grid-template-columns:1fr;gap:clamp(14px,2vw,24px);}
        @media(min-width:700px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:1100px){.pj-grid{grid-template-columns:repeat(3,1fr);}}
        .pj-card-top{display:flex;flex-direction:column;}
        .pj-card-img{width:100%;height:clamp(160px,44vw,240px);flex-shrink:0;}
        .pj-card-3d{width:100%;height:clamp(140px,36vw,210px);}
        @media(min-width:1100px){.pj-card-top{flex-direction:row;height:clamp(200px,22vw,240px);}.pj-card-img{width:58%;height:100%;}.pj-card-3d{width:42%;height:100%;}}
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