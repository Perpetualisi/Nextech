import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const C = {
  bg0:"#080A0F",bg1:"#0D1017",bg2:"#131820",bg3:"#1C2333",
  o1:"#4F8EF7",o2:"#6BA3FF",o3:"#93BBFF",o4:"#2563EB",
  accent:"#38BDF8",accentAlt:"#818CF8",
  tw:"#F8FAFF",ts:"#C8D5F0",tm:"#7A90B8",tf:"#3A4F72",
};

const POSTS = [
  { id:"p1", title:"Top Web Development Trends for 2026", excerpt:"AI-driven automation, no-code tools, and WebAssembly are reshaping how developers build the web.", fullText:"As we enter 2026, web development continues to evolve rapidly. From AI-assisted coding to performance-focused frameworks like Remix and Astro, the next year demands smarter, faster digital experiences.", date:"Jan 2026", readTime:"5 min", views:"12.4k", category:"Development", color:"#4F8EF7", gradFrom:"#4F8EF7", gradTo:"#38BDF8", shape:"icosahedron", tags:["AI","WebAssembly","Frameworks"] },
  { id:"p2", title:"Building Human-Centered Digital Products", excerpt:"Good design starts with empathy — discover how emotion and usability shape modern interfaces.", fullText:"Beyond aesthetics, modern design emphasizes clarity, accessibility, and user emotion. We craft every interface to connect with real users — blending beauty with purpose for impactful experiences.", date:"Feb 2026", readTime:"4 min", views:"9.1k", category:"Design", color:"#38BDF8", gradFrom:"#38BDF8", gradTo:"#818CF8", shape:"octahedron", tags:["UX","Accessibility","Emotion"] },
  { id:"p3", title:"The Rise of Micro-SaaS Startups", excerpt:"Learn why small, focused SaaS products are outperforming big tech in innovation and speed.", fullText:"Micro-SaaS empowers small teams to solve niche problems profitably. With tools like Supabase, Next.js, and Stripe, launching a lightweight but scalable product has never been easier.", date:"Mar 2026", readTime:"6 min", views:"15.2k", category:"Business", color:"#818CF8", gradFrom:"#818CF8", gradTo:"#4F8EF7", shape:"torus", tags:["SaaS","Startups","Growth"] },
];

const MARQUEE = "Latest Insights  ·  Web Development  ·  Design  ·  SaaS  ·  AI Trends 2026  ·  ";
const toRgb = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(",");

const ICONS = {
  rocket: c => (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>),
  palette: c => (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill={c}/><circle cx="17.5" cy="10.5" r=".5" fill={c}/><circle cx="8.5" cy="7.5" r=".5" fill={c}/><circle cx="6.5" cy="12.5" r=".5" fill={c}/><path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>),
  bulb: c => (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>),
};
const ICON_KEYS = ["rocket","palette","bulb"];

const HexPattern = () => (
  <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.04}}>
    <defs>
      <pattern id="bl_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse"><polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8"/></pattern>
      <pattern id="bl_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse"><polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5"/></pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bl_hex1)"/>
    <rect width="100%" height="100%" fill="url(#bl_hex2)"/>
  </svg>
);

const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"2px 0"}}>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)`}}/>
    <div style={{width:5,height:5,background:C.o1,transform:"rotate(45deg)",flexShrink:0,boxShadow:`0 0 7px ${C.o1}`}}/>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)`}}/>
  </div>
);

const CardScene = ({ color, shape, active }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  useEffect(()=>{ activeRef.current = active; },[active]);
  useEffect(()=>{
    const mount=mountRef.current, canvas=canvasRef.current;
    if(!mount||!canvas) return;
    let renderer=null, animId=null;
    const init=()=>{
      if(renderer) return;
      const W=mount.clientWidth||240, H=mount.clientHeight||170;
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(W,H); renderer.setClearColor(0x000000,0);
      const scene=new THREE.Scene();
      const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100); cam.position.z=3.8;
      const hexCol=parseInt(color.replace("#",""),16);
      const col3=new THREE.Color(color);
      scene.add(new THREE.AmbientLight(0xd0e8ff,0.30));
      const pl1=new THREE.PointLight(col3,8,20); pl1.position.set(3,3,3); scene.add(pl1);
      const pl2=new THREE.PointLight(0xffffff,2,16); pl2.position.set(-2,-1,2); scene.add(pl2);
      const plRim=new THREE.PointLight(col3,3,14); plRim.position.set(0,-2.5,-2); scene.add(plRim);
      const GEO={torus:()=>new THREE.TorusGeometry(0.70,0.28,20,80),octahedron:()=>new THREE.OctahedronGeometry(0.92,0),icosahedron:()=>new THREE.IcosahedronGeometry(0.88,1)};
      const geo=(GEO[shape]||GEO.icosahedron)();
      const mesh=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.25,specular:0xffffff,shininess:200,transparent:true,opacity:0.92})); scene.add(mesh);
      const wire=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:hexCol,wireframe:true,transparent:true,opacity:0.18})); wire.scale.setScalar(1.05); scene.add(wire);
      const inner=new THREE.Mesh(new THREE.SphereGeometry(0.38,20,20),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:1.0,transparent:true,opacity:0.26})); scene.add(inner);
      const rA=new THREE.Mesh(new THREE.TorusGeometry(1.42,0.022,12,90),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.5,transparent:true,opacity:0.58})); rA.rotation.x=Math.PI/2.6; scene.add(rA);
      const rB=new THREE.Mesh(new THREE.TorusGeometry(1.75,0.014,10,70),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.32,transparent:true,opacity:0.36})); rB.rotation.x=Math.PI/5; rB.rotation.z=Math.PI/5; scene.add(rB);
      const sats=[{r:1.48,spd:0.52,y:0.28,p:0},{r:1.62,spd:-0.35,y:-0.38,p:2.0}].map(d=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.065,12,12),new THREE.MeshPhongMaterial({color:hexCol,emissive:hexCol,emissiveIntensity:0.9}));s.userData={...d,angle:d.p};scene.add(s);return s;});
      const pCount=36,pPos=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=1.9+Math.random()*0.55;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*1.2;pPos[i*3+2]=Math.sin(a)*r;}
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));
      const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({color:hexCol,size:0.052,transparent:true,opacity:0.65})); scene.add(pts);
      const onResize=()=>{if(!renderer)return;renderer.setSize(mount.clientWidth,mount.clientHeight);cam.aspect=mount.clientWidth/mount.clientHeight;cam.updateProjectionMatrix();};
      window.addEventListener("resize",onResize);
      const tv=new THREE.Vector3(), t0=performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate);
        const t=(performance.now()-t0)*0.001, a=activeRef.current, spd=a?1.9:0.62;
        mesh.rotation.y=t*spd*0.50; mesh.rotation.x=Math.sin(t*0.30)*0.28;
        wire.rotation.y=mesh.rotation.y; wire.rotation.x=mesh.rotation.x;
        const ts=a?1.15:1.0; mesh.scale.lerp(tv.set(ts,ts,ts),0.065); wire.scale.setScalar(mesh.scale.x*1.05);
        inner.scale.setScalar(1+Math.sin(t*1.8)*0.13);
        rA.rotation.z=t*0.36; rA.rotation.y=t*0.12;
        rB.rotation.x=Math.PI/5+t*0.22; rB.rotation.z=Math.PI/5+t*0.09;
        sats.forEach(s=>{s.userData.angle+=s.userData.spd*0.013;s.position.x=Math.cos(s.userData.angle)*s.userData.r;s.position.z=Math.sin(s.userData.angle)*s.userData.r;s.position.y=s.userData.y+Math.sin(t*1.0+s.userData.angle)*0.22;});
        pts.rotation.y=t*0.17;
        pl1.position.set(Math.sin(t*0.5)*2.8,Math.cos(t*0.36)*2.2,3);
        plRim.position.set(Math.cos(t*0.42)*-2.2,-2.2,Math.sin(t*0.58)*-2);
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
      const helixGroup=new THREE.Group();
      for(let i=0;i<36;i++){
        const frac=i/36, angle=frac*Math.PI*6;
        [[0x4F8EF7,0],[0x38BDF8,Math.PI*0.5]].forEach(([col,off])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.6}));s.position.set(Math.cos(angle+off)*1.4,(frac-0.5)*5.0,Math.sin(angle+off)*1.4);helixGroup.add(s);});
        if(i%3===0){const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.8,8),new THREE.MeshPhongMaterial({color:0x818CF8,emissive:0x818CF8,emissiveIntensity:0.4,transparent:true,opacity:0.48}));bar.position.set(0,(frac-0.5)*5.0,0);bar.rotation.z=Math.PI/2;bar.rotation.y=angle+Math.PI*0.25;helixGroup.add(bar);}
      }
      helixGroup.position.x=-2.5; scene.add(helixGroup);
      const coreGeo=new THREE.IcosahedronGeometry(1.0,2);
      const origPos=new Float32Array(coreGeo.attributes.position.array);
      const tmpPos=new Float32Array(origPos.length);
      const ico=new THREE.Mesh(coreGeo,new THREE.MeshPhongMaterial({color:0x030d1a,emissive:0x060e1e,specular:new THREE.Color(C.o1),shininess:280,transparent:true,opacity:0.97})); scene.add(ico);
      const wire=new THREE.Mesh(coreGeo,new THREE.MeshBasicMaterial({color:0x4F8EF7,wireframe:true,transparent:true,opacity:0.18})); wire.scale.setScalar(1.016); scene.add(wire);
      const ig=new THREE.Mesh(new THREE.SphereGeometry(0.55,24,24),new THREE.MeshPhongMaterial({color:0x4F8EF7,emissive:0x4F8EF7,emissiveIntensity:0.9,transparent:true,opacity:0.22})); scene.add(ig);
      const mkRing=(r,tube,col,op,rx,rz)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,16,140),new THREE.MeshPhongMaterial({color:col,emissive:new THREE.Color(col).multiplyScalar(0.25),shininess:280,transparent:true,opacity:op}));m.rotation.x=rx;m.rotation.z=rz;scene.add(m);return m;};
      const r1=mkRing(2.2,0.028,0x4F8EF7,0.72,Math.PI/2.3,0.3);
      const r2=mkRing(2.8,0.018,0x38BDF8,0.52,Math.PI/4,Math.PI/5);
      const r3=mkRing(3.4,0.013,0x818CF8,0.36,Math.PI/6.5,-Math.PI/4);
      const orbs=[{G:new THREE.IcosahedronGeometry(0.20,1),c:0x4F8EF7},{G:new THREE.OctahedronGeometry(0.22,0),c:0x38BDF8},{G:new THREE.TorusGeometry(0.18,0.07,10,28),c:0x818CF8},{G:new THREE.TetrahedronGeometry(0.24,0),c:0x6BA3FF},{G:new THREE.DodecahedronGeometry(0.18,0),c:0x93BBFF},{G:new THREE.SphereGeometry(0.18,14,14),c:0x4F8EF7}].map((d,i)=>{const m=new THREE.Mesh(d.G,new THREE.MeshPhongMaterial({color:d.c,emissive:d.c,emissiveIntensity:0.42,shininess:200}));m.userData={angle:(i/6)*Math.PI*2,radius:1.8+(i%3)*0.4,speed:(0.28+i*0.10)*(i%2?1:-1),yOff:Math.sin(i*1.2)*0.65};scene.add(m);return m;});
      const pCount=220,pPos=new Float32Array(pCount*3),pCol=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const r=4.0+Math.random()*2.2,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pPos[i*3]=r*Math.sin(p)*Math.cos(t);pPos[i*3+1]=r*Math.sin(p)*Math.sin(t);pPos[i*3+2]=r*Math.cos(p);pCol[i*3]=0.3+Math.random()*0.4;pCol[i*3+1]=0.5+Math.random()*0.3;pCol[i*3+2]=1.0;}
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3)); pGeo.setAttribute("color",new THREE.BufferAttribute(pCol,3));
      const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.040,transparent:true,opacity:0.76,vertexColors:true})); scene.add(particles);
      let tmx=0,tmy=0,mx=0,my=0;
      const onMove=e=>{const t=e.touches?e.touches[0]:e;tmx=(t.clientX/window.innerWidth-.5)*2;tmy=-(t.clientY/window.innerHeight-.5)*2;};
      const onResize=()=>{if(!renderer)return;renderer.setSize(canvas.clientWidth,canvas.clientHeight);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.updateProjectionMatrix();};
      window.addEventListener("mousemove",onMove); window.addEventListener("touchmove",onMove,{passive:true}); window.addEventListener("resize",onResize);
      const t0=performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate); const t=(performance.now()-t0)*0.001;
        mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
        for(let i=0;i<origPos.length;i+=3){const ox=origPos[i],oy=origPos[i+1],oz=origPos[i+2];const len=Math.sqrt(ox*ox+oy*oy+oz*oz);const wave=Math.sin(t*1.4+ox*2.1+oy*1.7)*0.05;const sc=(1.0+wave)/len;tmpPos[i]=ox*sc;tmpPos[i+1]=oy*sc;tmpPos[i+2]=oz*sc;}
        coreGeo.attributes.position.array.set(tmpPos); coreGeo.attributes.position.needsUpdate=true; coreGeo.computeVertexNormals();
        ico.rotation.x=t*0.15+my*0.18; ico.rotation.y=t*0.20+mx*0.18;
        wire.rotation.x=ico.rotation.x; wire.rotation.y=ico.rotation.y;
        ig.scale.setScalar(1+Math.sin(t*1.5)*0.12);
        helixGroup.rotation.y=t*0.18; helixGroup.position.y=Math.sin(t*0.35)*0.28;
        r1.rotation.z=t*0.20; r2.rotation.x=Math.PI/4+t*0.14; r2.rotation.z=Math.PI/5+t*0.10; r3.rotation.y=t*0.11; r3.rotation.z=-Math.PI/4+t*0.08;
        orbs.forEach(m=>{m.userData.angle+=m.userData.speed*0.012;m.position.x=Math.cos(m.userData.angle)*m.userData.radius;m.position.z=Math.sin(m.userData.angle)*m.userData.radius;m.position.y=m.userData.yOff+Math.sin(t*0.9+m.userData.angle)*0.3;m.rotation.y=t*1.8;m.rotation.x=t*0.85;});
        particles.rotation.y=t*0.025; particles.rotation.x=t*0.012;
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

const Marquee = () => (
  <div style={{position:"relative",overflow:"hidden",borderTop:`1px solid ${C.o1}20`,borderBottom:`1px solid ${C.o1}20`,background:`linear-gradient(90deg,rgba(79,142,247,0.06),rgba(56,189,248,0.04),rgba(79,142,247,0.06))`,padding:"12px 0",userSelect:"none",zIndex:5}}>
    <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${C.bg0},transparent)`,zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left,${C.bg0},transparent)`,zIndex:2,pointerEvents:"none"}}/>
    <div style={{display:"flex",width:"max-content",animation:"bl_marquee 30s linear infinite"}} onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"} onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
      {[...Array(6)].map((_,i)=>(
        <span key={i} style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(10px,1.3vw,13px)",letterSpacing:"0.14em",textTransform:"uppercase",padding:"0 28px",background:`linear-gradient(135deg,${C.o2},${C.accent},${C.accentAlt},${C.o1})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",whiteSpace:"nowrap"}}>{MARQUEE}</span>
      ))}
    </div>
  </div>
);

const BlogCard = ({ post, index, visible }) => {
  const [expanded,setExpanded]=useState(false);
  const [hov,setHov]=useState(false);
  const { title, excerpt, fullText, date, readTime, views, category, color, gradFrom, gradTo, shape, tags } = post;
  const iconKey=ICON_KEYS[index%ICON_KEYS.length];
  return (
    <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{position:"relative",borderRadius:18,overflow:"hidden",display:"flex",flexDirection:"column",background:hov?C.bg3:C.bg2,border:hov?`1px solid ${color}55`:"1px solid rgba(255,255,255,0.06)",transform:hov?"translateY(-10px) scale(1.015)":"none",transition:"all 0.42s cubic-bezier(0.23,1,0.32,1)",boxShadow:hov?`0 16px 60px rgba(0,0,0,0.65),0 0 0 1px ${color}18,inset 0 1px 0 rgba(255,255,255,0.07)`:"0 4px 24px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.03)",opacity:visible?1:0,animation:visible?`bl_fadeUp 0.7s ease both ${index*130}ms`:"none",cursor:"default"}}>
      <div style={{height:2.5,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,flexShrink:0}}/>
      {hov&&<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${color}0e,transparent 60%)`,pointerEvents:"none",zIndex:0}}/>}
      <div style={{width:"100%",height:"clamp(140px,16vw,175px)",position:"relative",overflow:"hidden",background:`radial-gradient(ellipse at 50% 60%,${color}14 0%,${C.bg1} 70%)`,flexShrink:0}}>
        <CardScene color={color} shape={shape} active={hov}/>
        <div style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}><div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}55,transparent)`,animation:"bl_scanDown 5s linear infinite",opacity:0.4}}/></div>
        <div style={{position:"absolute",top:10,left:12,zIndex:4}}><span style={{padding:"3px 10px",borderRadius:6,background:"rgba(8,10,15,0.82)",backdropFilter:"blur(10px)",border:`1px solid ${color}45`,color,fontSize:8.5,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{category}</span></div>
        <div style={{position:"absolute",top:10,right:12,zIndex:4,padding:"3px 9px",borderRadius:6,background:"rgba(8,10,15,0.75)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.1)",color:C.tf,fontSize:8.5,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{date}</div>
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:6,background:"rgba(8,10,15,0.80)",backdropFilter:"blur(10px)",border:`1px solid rgba(79,142,247,0.28)`,whiteSpace:"nowrap"}}>
          <span style={{width:4,height:4,borderRadius:"50%",background:C.o1,boxShadow:`0 0 6px ${C.o1}`,animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
          <span style={{color:C.o1,fontSize:8,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Interactive 3D</span>
        </div>
      </div>
      <div style={{padding:"clamp(16px,2.5vw,20px)",display:"flex",flexDirection:"column",gap:11,flex:1,position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{transform:hov?"scale(1.1) rotate(4deg)":"scale(1)",transition:"all 0.35s cubic-bezier(0.23,1,0.32,1)",filter:hov?`drop-shadow(0 0 10px ${color}70)`:"none"}}>{ICONS[iconKey](color)}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:C.tf,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{views} views</span>
            <span style={{color:C.tf,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{readTime} read</span>
          </div>
        </div>
        <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(13px,1.6vw,16px)",letterSpacing:"-0.015em",lineHeight:1.3,color:hov?C.tw:C.ts,margin:0,transition:"color 0.22s ease"}}>{title}</h3>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${color}30,transparent)`}}/>
        <p style={{color:C.tm,fontSize:"clamp(11.5px,1.2vw,13px)",lineHeight:1.78,margin:0,fontFamily:"'DM Sans',sans-serif",flex:1}}>{excerpt}</p>
        <div style={{display:"grid",gridTemplateRows:expanded?"1fr":"0fr",transition:"grid-template-rows 0.42s cubic-bezier(0.23,1,0.32,1)"}}>
          <div style={{overflow:"hidden"}}><p style={{margin:0,padding:expanded?"10px 0 0 12px":"0 0 0 12px",color:C.tm,fontSize:"clamp(11px,1.1vw,12.5px)",lineHeight:1.8,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",borderLeft:`2px solid ${color}40`,opacity:expanded?1:0,transition:"opacity 0.32s ease 0.1s"}}>{fullText}</p></div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {tags.map(t=><span key={t} style={{padding:"2px 9px",borderRadius:5,background:`${color}12`,border:`1px solid ${color}30`,color,fontSize:9,fontWeight:700,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.tf,fontSize:8.5,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Relevance Score</span><span style={{color,fontSize:8.5,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>97%</span></div>
          <div style={{height:2.5,borderRadius:2,background:"rgba(255,255,255,0.055)",overflow:"hidden"}}><div style={{height:"100%",width:visible?"97%":"0%",borderRadius:2,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,transition:"width 1.8s cubic-bezier(0.23,1,0.32,1) 0.5s",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)",animation:"bl_shimmer 2.2s ease-in-out infinite"}}/></div></div>
        </div>
        <button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded} style={{width:"100%",padding:"10px 18px",borderRadius:10,border:`1px solid ${color}25`,background:`${color}0a`,backdropFilter:"blur(8px)",color:C.tm,fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(11px,1.1vw,12.5px)",fontWeight:700,letterSpacing:"0.06em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.26s ease",outline:"none",marginTop:"auto"}} onMouseEnter={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.borderColor=`${color}55`;e.currentTarget.style.color=color;}} onMouseLeave={e=>{e.currentTarget.style.background=`${color}0a`;e.currentTarget.style.borderColor=`${color}25`;e.currentTarget.style.color=C.tm;}}>
          {expanded?"Show Less ↑":"Read More →"}
        </button>
      </div>
    </article>
  );
};

const STATS=[{val:"36k+",label:"Monthly Readers",color:C.o1},{val:"3",label:"Fresh Articles",color:C.accent},{val:"100%",label:"Free Content",color:C.accentAlt},{val:"2026",label:"Latest Edition",color:C.o2}];

const Blog = () => {
  const [visible,setVisible]=useState(false);
  const sectionRef=useRef(null);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);},{threshold:0.06});if(sectionRef.current)obs.observe(sectionRef.current);return()=>obs.disconnect();},[]);
  const handleNav=useCallback(id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});},[]);

  return(<>
    <style>{`
      @keyframes bl_fadeUp    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
      @keyframes bl_fadeDown  {from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
      @keyframes bl_pulse     {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.18);opacity:1}}
      @keyframes bl_glowPulse {0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
      @keyframes bl_borderRot {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes bl_scanDown  {0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
      @keyframes bl_shimmer   {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
      @keyframes bl_hexDrift  {from{transform:translateY(0)}to{transform:translateY(80px)}}
      @keyframes bl_gradText  {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes bl_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}
      @keyframes bl_float1    {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-13px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
      @keyframes bl_marquee   {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
      .bl-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;padding:clamp(56px,9vw,110px) 0 clamp(64px,10vw,120px);}
      .bl-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}
      .bl-inner{position:relative;z-index:10;max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,80px);display:flex;flex-direction:column;gap:clamp(32px,5vw,52px);}
      .bl-banner-wrap{position:relative;width:100%;height:clamp(160px,40vw,300px);}
      .bl-banner-card{width:100%;height:100%;border-radius:18px;overflow:hidden;border:1px solid rgba(79,142,247,0.28);position:relative;animation:bl_glowPulse 4s ease-in-out infinite;}
      .bl-grid{display:grid;grid-template-columns:1fr;gap:clamp(14px,2vw,22px);}
      @media(min-width:600px){.bl-grid{grid-template-columns:repeat(2,1fr);}}
      @media(min-width:1024px){.bl-grid{grid-template-columns:repeat(3,1fr);}}
      .bl-hl{font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:#F8FAFF;margin:0;font-size:clamp(1.75rem,7.8vw,2.35rem);}
      .bl-hl .bl-accent{display:block;background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:bl_gradText 5s ease infinite;filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));}
      .bl-shapes{display:none !important;}
      @media(min-width:600px){.bl-shapes{display:block !important;}}
      @media(max-width:380px){.bl-inner{padding:0 10px;}.bl-hl{font-size:1.55rem;}}
      @media(min-width:768px){.bl-hl{font-size:clamp(2rem,3vw,3.1rem);}}
      @media(min-width:1024px){.bl-hl{font-size:clamp(2.25rem,3.1vw,3.4rem);}}
    `}</style>

    <section id="blog" ref={sectionRef} className="bl-section" aria-label="Blog">
      <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"bl_hexDrift 16s linear infinite"}}><HexPattern/></div>
      <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none"}}><filter id="bl_n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#bl_n)"/></svg>
      <div className="bl-scanline" aria-hidden="true"/>
      <div aria-hidden="true" style={{position:"absolute",top:"8%",left:"12%",width:"min(600px,50vw)",height:"min(600px,50vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
      <div aria-hidden="true" style={{position:"absolute",bottom:"5%",right:"8%",width:"min(480px,38vw)",height:"min(480px,38vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
      <div className="bl-shapes" aria-hidden="true" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2}}>
        <svg width="80" height="80" viewBox="0 0 120 120" style={{position:"absolute",top:"5%",right:"2%",animation:"bl_float1 8s ease-in-out infinite",filter:`drop-shadow(0 0 14px ${C.o1}55)`}}><defs><linearGradient id="bl_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs><polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#bl_sh1)" strokeWidth="1.4" opacity="0.7"/></svg>
        <svg width="56" height="56" viewBox="0 0 90 90" style={{position:"absolute",bottom:"6%",left:"1.5%",animation:"bl_float1 11s ease-in-out infinite reverse",filter:`drop-shadow(0 0 10px ${C.accent}50)`}}><polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65"/></svg>
      </div>

      <div style={{position:"relative",zIndex:10}}><Marquee/></div>

      <div className="bl-inner">
        <header style={{textAlign:"center",opacity:visible?1:0,animation:visible?"bl_fadeDown 0.8s ease both 0.05s":"none"}}>
          <div style={{marginBottom:12}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:7,background:"rgba(79,142,247,0.10)",border:`1px solid rgba(79,142,247,0.32)`,color:C.o2,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"bl_badgePulse 3.2s ease-in-out infinite",boxShadow:"0 0 18px rgba(79,142,247,0.12)"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block"}}/>Fresh Perspectives
            </span>
          </div>
          <h2 className="bl-hl">
            <span style={{display:"block",color:C.tm,fontSize:"0.58em",fontWeight:400,marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"}}>Insights from the team</span>
            <span style={{display:"block",color:C.tw}}>Latest</span>
            <span className="bl-accent">Insights</span>
          </h2>
          <div style={{maxWidth:520,margin:"14px auto 0"}}>
            <p style={{color:C.tm,fontSize:"clamp(13px,1.5vw,15.5px)",lineHeight:1.8,margin:"0 0 18px"}}>Fresh perspectives on the intersection of code, design, and business strategy.</p>
            <Divider/>
          </div>
        </header>

        <div style={{opacity:visible?1:0,animation:visible?"bl_fadeUp 0.9s ease both 0.2s":"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
            <span style={{color:C.tm,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Knowledge engine — drag to interact</span>
          </div>
          <div className="bl-banner-wrap">
            <div aria-hidden="true" style={{position:"absolute",inset:-2,borderRadius:20,zIndex:0,overflow:"hidden",pointerEvents:"none"}}><div style={{position:"absolute",inset:-2,borderRadius:22,background:`conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`,animation:"bl_borderRot 11s linear infinite"}}/></div>
            <div className="bl-banner-card" style={{zIndex:1}}>
              <div style={{position:"absolute",inset:"10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.18) 0%,rgba(56,189,248,0.05) 40%,transparent 70%)",filter:"blur(28px)",zIndex:0}}/>
              <div style={{position:"absolute",inset:0,zIndex:6,overflow:"hidden",pointerEvents:"none",borderRadius:18}}><div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`,animation:"bl_scanDown 5.5s linear infinite",opacity:0.5}}/></div>
              {[{top:12,left:12,borderTop:`2px solid ${C.o1}90`,borderLeft:`2px solid ${C.o1}90`},{top:12,right:12,borderTop:`2px solid ${C.accent}90`,borderRight:`2px solid ${C.accent}90`},{bottom:12,left:12,borderBottom:`2px solid ${C.accentAlt}90`,borderLeft:`2px solid ${C.accentAlt}90`},{bottom:12,right:12,borderBottom:`2px solid ${C.o1}90`,borderRight:`2px solid ${C.o1}90`}].map((s,i)=><div key={i} aria-hidden="true" style={{position:"absolute",width:22,height:22,zIndex:7,...s}}/>)}
              <div style={{position:"absolute",top:14,left:14,zIndex:8,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,background:"rgba(8,10,15,0.92)",backdropFilter:"blur(14px)",border:`1px solid rgba(79,142,247,0.35)`}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
                <span style={{color:C.o1,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>Knowledge Engine</span>
              </div>
              <div style={{position:"absolute",bottom:14,right:14,zIndex:8,display:"flex",gap:7}}>
                {["Dev","Design","Business"].map((t,i)=><span key={t} style={{padding:"3px 9px",borderRadius:6,background:"rgba(8,10,15,0.78)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:[C.o1,C.accent,C.accentAlt][i],fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}
              </div>
              <HeroBanner/>
            </div>
          </div>
        </div>

        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,opacity:visible?1:0,animation:visible?"bl_fadeUp 0.7s ease both 0.4s":"none"}}>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)`}}/>
            <div style={{width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0}}/>
            <span style={{color:C.tm,fontSize:9,fontWeight:700,letterSpacing:"0.28em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Articles</span>
            <div style={{width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0}}/>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)`}}/>
          </div>
          <div className="bl-grid">{POSTS.map((p,i)=><BlogCard key={p.id} post={p} index={i} visible={visible}/>)}</div>
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(10px,2vw,16px)",justifyContent:"center",opacity:visible?1:0,animation:visible?"bl_fadeUp 0.7s ease both 0.65s":"none"}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{flex:"1 1 140px",minWidth:120,padding:"clamp(12px,2vw,18px)",borderRadius:14,background:C.bg2,border:"1px solid rgba(255,255,255,0.06)",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.color},transparent)`}}/>
              <div style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(1.3rem,3vw,2rem)",background:`linear-gradient(135deg,${C.tw},${s.color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{s.val}</div>
              <div style={{color:C.tm,fontSize:"clamp(8px,1vw,10px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:5,fontFamily:"'DM Sans',sans-serif"}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14,opacity:visible?1:0,animation:visible?"bl_fadeUp 0.7s ease both 0.8s":"none"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
            <button onClick={()=>handleNav("contact")} style={{padding:"13px clamp(24px,3vw,36px)",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(12px,1.3vw,13.5px)",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",background:`linear-gradient(135deg,${C.o1},${C.o4})`,color:"#fff",boxShadow:`0 6px 22px rgba(79,142,247,0.35)`,transition:"all 0.22s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px) scale(1.03)";e.currentTarget.style.boxShadow="0 14px 42px rgba(79,142,247,0.55)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 6px 22px rgba(79,142,247,0.35)`;}}> → Explore All Articles</button>
            <button onClick={()=>handleNav("contact")} style={{padding:"13px clamp(24px,3vw,36px)",borderRadius:9,border:`1.5px solid rgba(79,142,247,0.38)`,background:"transparent",color:C.o1,fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(12px,1.3vw,13.5px)",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.22s ease"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(79,142,247,0.10)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform="";}}>Subscribe</button>
          </div>
          <p style={{color:C.tf,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",margin:0}}>Updated monthly · No paywall · Free forever</p>
        </div>
      </div>

      <div aria-hidden="true" style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,rgba(8,10,15,0.85))`,zIndex:5,pointerEvents:"none"}}/>
      <div aria-hidden="true" style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}28,transparent)`,zIndex:6}}/>
    </section>
  </>);
};

export default Blog;