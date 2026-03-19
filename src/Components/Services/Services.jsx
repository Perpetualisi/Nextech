import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─── Design Tokens — identical to Hero & About ──────────────────────── */
const C = {
  bg0: "#080A0F", bg1: "#0D1017", bg2: "#131820", bg3: "#1C2333",
  o1: "#4F8EF7", o2: "#6BA3FF", o3: "#93BBFF", o4: "#2563EB",
  accent: "#38BDF8", accentAlt: "#818CF8",
  tw: "#F8FAFF", ts: "#C8D5F0", tm: "#7A90B8", tf: "#3A4F72",
};

/* ─── Service Data ───────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "webdev", label: "Web Development", tag: "Full-Stack", color: "#4F8EF7", shape: "box",
    desc: "Blazing-fast web apps built with React, Next.js and Node.js — shipped to production with zero compromise on performance or reliability.",
    pills: ["React", "Next.js", "Node.js", "GraphQL"],
    features: ["Server-Side Rendering", "API Integration", "CI/CD Pipelines", "Sub-100ms Load"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="28" rx="4" stroke={c} strokeWidth="2.2" fill="none"/>
        <line x1="4" y1="16" x2="44" y2="16" stroke={c} strokeWidth="1.8"/>
        <circle cx="10" cy="12" r="1.8" fill={c}/>
        <circle cx="16.5" cy="12" r="1.8" fill={c} opacity="0.55"/>
        <polyline points="14,22 10,27 14,32" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="20,22 24,27 20,32" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="28" y1="23" x2="40" y2="23" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
        <line x1="28" y1="28" x2="36" y2="28" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.45"/>
        <line x1="4" y1="36" x2="44" y2="36" stroke={c} strokeWidth="1.2" opacity="0.3"/>
        <line x1="18" y1="36" x2="18" y2="42" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="30" y1="36" x2="30" y2="42" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="12" y1="42" x2="36" y2="42" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "uiux", label: "UI / UX Design", tag: "Product Design", color: "#38BDF8", shape: "torus",
    desc: "Human-centered design systems and pixel-perfect interfaces that convert visitors into loyal customers through intuition and delight.",
    pills: ["Figma", "Design Systems", "Prototyping", "A/B Testing"],
    features: ["User Research", "Wireframing", "Component Libraries", "Usability Testing"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <rect x="3" y="6" width="28" height="36" rx="3.5" stroke={c} strokeWidth="2.2" fill="none"/>
        <rect x="7" y="11" width="20" height="4" rx="1.5" fill={c} opacity="0.22"/>
        <rect x="7" y="18" width="9" height="9" rx="1.5" stroke={c} strokeWidth="1.8" fill="none" opacity="0.75"/>
        <line x1="19" y1="20.5" x2="27" y2="20.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.6"/>
        <line x1="19" y1="24.5" x2="25" y2="24.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.4"/>
        <circle cx="38" cy="17" r="7.5" stroke={c} strokeWidth="2.2" fill="none"/>
        <path d="M38 9.5 A7.5 7.5 0 0 1 45.5 17" stroke={c} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="38" cy="17" r="2.5" fill={c}/>
        <line x1="7" y1="32" x2="27" y2="32" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <line x1="7" y1="36" x2="21" y2="36" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: "aiml", label: "AI & Machine Learning", tag: "Intelligence", color: "#818CF8", shape: "icosahedron",
    desc: "Custom AI models, LLM integrations and intelligent automation that give your business an unfair competitive advantage at scale.",
    pills: ["LLMs", "PyTorch", "MLOps", "RAG"],
    features: ["Custom Model Training", "LLM Fine-tuning", "AI Automation", "Predictive Analytics"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="5" stroke={c} strokeWidth="2.2" fill="none"/>
        <circle cx="24" cy="24" r="2.2" fill={c}/>
        <circle cx="8" cy="10" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="40" cy="10" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="8" cy="38" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="40" cy="38" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="24" cy="5" r="3" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="24" cy="43" r="3" stroke={c} strokeWidth="1.8" fill="none"/>
        <line x1="11" y1="12.8" x2="19.5" y2="19.5" stroke={c} strokeWidth="1.6" opacity="0.8"/>
        <line x1="37" y1="12.8" x2="28.5" y2="19.5" stroke={c} strokeWidth="1.6" opacity="0.8"/>
        <line x1="11" y1="35.2" x2="19.5" y2="28.5" stroke={c} strokeWidth="1.6" opacity="0.65"/>
        <line x1="37" y1="35.2" x2="28.5" y2="28.5" stroke={c} strokeWidth="1.6" opacity="0.65"/>
        <line x1="24" y1="8" x2="24" y2="19" stroke={c} strokeWidth="1.6" opacity="0.55"/>
        <line x1="24" y1="29" x2="24" y2="40" stroke={c} strokeWidth="1.6" opacity="0.55"/>
      </svg>
    ),
  },
  {
    id: "cloud", label: "Cloud & DevOps", tag: "Infrastructure", color: "#4F8EF7", shape: "sphere",
    desc: "Kubernetes, CI/CD pipelines and multi-cloud architecture engineered for 99.99% uptime and infinite horizontal scale.",
    pills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    features: ["Auto-scaling", "Multi-cloud", "Zero-downtime Deploy", "Cost Optimization"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <path d="M36 22C36 17.6 32.4 14 28 14C26.4 14 24.9 14.5 23.7 15.3C22 11.7 18.3 9.2 14 9.2C7.9 9.2 3 14 3 20.1V21.4C3 24.9 5.9 27.8 9.4 27.8H36C39.5 27.8 42 24.9 42 21.4C42 18.4 40 15.9 37.3 15.1" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <line x1="20" y1="34" x2="20" y2="44" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
        <polyline points="15,39 20,34 25,39" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="29" y="32" width="15" height="12" rx="2" stroke={c} strokeWidth="1.8" fill="none" opacity="0.65"/>
        <line x1="31" y1="36" x2="42" y2="36" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
        <line x1="31" y1="39" x2="42" y2="39" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
        <circle cx="42" cy="36" r="1" fill={c} opacity="0.9"/>
      </svg>
    ),
  },
  {
    id: "mobile", label: "Mobile Development", tag: "iOS & Android", color: "#38BDF8", shape: "cylinder",
    desc: "Native-quality iOS and Android apps built with React Native — one codebase, two platforms, zero performance compromise.",
    pills: ["React Native", "Swift", "Expo", "Firebase"],
    features: ["Cross-platform", "Offline-first", "Push Notifications", "App Store Ready"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <rect x="12" y="3" width="24" height="42" rx="5" stroke={c} strokeWidth="2.2" fill="none"/>
        <line x1="12" y1="10" x2="36" y2="10" stroke={c} strokeWidth="1.8"/>
        <line x1="12" y1="38" x2="36" y2="38" stroke={c} strokeWidth="1.8"/>
        <line x1="21" y1="42.5" x2="27" y2="42.5" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
        <rect x="15" y="14" width="8" height="8" rx="2" stroke={c} strokeWidth="1.8" fill="none"/>
        <rect x="25" y="14" width="8" height="8" rx="2" stroke={c} strokeWidth="1.8" fill="none" opacity="0.7"/>
        <rect x="15" y="25" width="8" height="7" rx="2" stroke={c} strokeWidth="1.8" fill="none" opacity="0.55"/>
        <rect x="25" y="25" width="8" height="7" rx="2" stroke={c} strokeWidth="1.8" fill="none" opacity="0.38"/>
      </svg>
    ),
  },
  {
    id: "security", label: "Cybersecurity", tag: "Enterprise Security", color: "#818CF8", shape: "octahedron",
    desc: "Zero-trust architecture, penetration testing and compliance frameworks that protect your most critical digital assets.",
    pills: ["Zero-Trust", "SOC 2", "Pen Testing", "SIEM"],
    features: ["Threat Detection", "Compliance Audits", "Security Training", "Incident Response"],
    svg: (c, sz = 52) => (
      <svg width={sz} height={sz} viewBox="0 0 48 48" fill="none">
        <path d="M24 3 L6 10 V22 C6 32.5 14.2 41.8 24 44.5 C33.8 41.8 42 32.5 42 22 V10 Z" stroke={c} strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <path d="M24 3 L6 10 V22 C6 32.5 14.2 41.8 24 44.5 C33.8 41.8 42 32.5 42 22 V10 Z" fill={c} fillOpacity="0.06"/>
        <rect x="17" y="24" width="14" height="10" rx="2.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <path d="M20 24 V20 C20 16.7 28 16.7 28 20 V24" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <circle cx="24" cy="28.5" r="1.8" fill={c} opacity="0.9"/>
        <line x1="24" y1="30.5" x2="24" y2="32.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
      </svg>
    ),
  },
];

/* ─── Hex Pattern (same as Hero / About) ─────────────────────────────── */
const HexPattern = () => (
  <svg aria-hidden="true" style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.04 }}>
    <defs>
      <pattern id="sv_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8"/>
      </pattern>
      <pattern id="sv_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#sv_hex1)"/>
    <rect width="100%" height="100%" fill="url(#sv_hex2)"/>
  </svg>
);

/* ─── Divider ─────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display:"flex",alignItems:"center",gap:10,margin:"2px 0" }}>
    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)` }}/>
    <div style={{ width:5,height:5,background:C.o1,transform:"rotate(45deg)",flexShrink:0,boxShadow:`0 0 7px ${C.o1}` }}/>
    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)` }}/>
  </div>
);

/* ─── Cinematic Service Showcase (same engine as Hero) ───────────────── */
const SLIDE_MS = 4200;
const TRANS_MS = 600;

const ServiceShowcase = () => {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase]         = useState("in");
  const [paused, setPaused]       = useState(false);
  const svc = SERVICES[activeIdx];

  /* Slide sequencer */
  useEffect(() => {
    if (paused) return;
    setPhase("in");
    const t1 = setTimeout(() => setPhase("hold"), TRANS_MS);
    const t2 = setTimeout(() => setPhase("out"),  SLIDE_MS - TRANS_MS);
    const t3 = setTimeout(() => setActiveIdx(i => (i + 1) % SERVICES.length), SLIDE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [activeIdx, paused]);

  /* Three.js engine */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    let renderer = null, animId = null;

    const getSize = () => ({ W: canvas.clientWidth||wrap.clientWidth||500, H: canvas.clientHeight||wrap.clientHeight||400 });

    const init = () => {
      if (renderer) return;
      const { W, H } = getSize();
      renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
      cam.position.z = 5;

      scene.add(new THREE.AmbientLight(0xd0e8ff, 0.3));
      const pl1=new THREE.PointLight(0xffffff,6,22); pl1.position.set(3,3,3); scene.add(pl1);
      const pl2=new THREE.PointLight(0xffffff,3.5,22); pl2.position.set(-3,-2,2); scene.add(pl2);
      const pl3=new THREE.PointLight(0xffffff,2.5,20); pl3.position.set(0,-3,1); scene.add(pl3);
      const pl4=new THREE.PointLight(0xffffff,2,18); pl4.position.set(-2,3,-2); scene.add(pl4);

      const geo=new THREE.IcosahedronGeometry(1.1,2);
      const origPos=new Float32Array(geo.attributes.position.array);
      const tmpPos=new Float32Array(origPos.length);
      const icoMat=new THREE.MeshPhongMaterial({color:0x030d1a,emissive:0x060e1e,specular:new THREE.Color(C.o1),shininess:260,transparent:true,opacity:0.97});
      const ico=new THREE.Mesh(geo,icoMat); scene.add(ico);
      const wireMat=new THREE.MeshBasicMaterial({color:new THREE.Color(C.o1),wireframe:true,transparent:true,opacity:0.20});
      const wire=new THREE.Mesh(geo,wireMat); wire.scale.setScalar(1.016); scene.add(wire);
      const igMat=new THREE.MeshPhongMaterial({color:new THREE.Color(C.o1),emissive:new THREE.Color(C.o1),emissiveIntensity:0.9,transparent:true,opacity:0.24});
      const ig=new THREE.Mesh(new THREE.SphereGeometry(0.50,32,32),igMat); scene.add(ig);

      const mkRing=(r,tube,col,op,rx,ry,rz)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,16,120),new THREE.MeshPhongMaterial({color:col,emissive:new THREE.Color(col).multiplyScalar(0.28),shininess:280,transparent:true,opacity:op}));m.rotation.set(rx,ry,rz);scene.add(m);return m;};
      const r1=mkRing(1.85,0.028,0x4F8EF7,0.80,Math.PI/2.4,0,0);
      const r2=mkRing(2.25,0.018,0x38BDF8,0.46,Math.PI/4,0,Math.PI/6);
      const r3=mkRing(2.60,0.012,0x818CF8,0.28,Math.PI/5,0,-Math.PI/4);

      const pCount=220,pPos=new Float32Array(pCount*3),pColors=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const r=2.8+Math.random()*1.4,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);pPos[i*3]=r*Math.sin(ph)*Math.cos(th);pPos[i*3+1]=r*Math.sin(ph)*Math.sin(th);pPos[i*3+2]=r*Math.cos(ph);pColors[i*3]=0.6+Math.random()*0.4;pColors[i*3+1]=0.7+Math.random()*0.3;pColors[i*3+2]=1.0;}
      const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));pGeo.setAttribute("color",new THREE.BufferAttribute(pColors,3));
      scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.042,transparent:true,opacity:0.80,vertexColors:true})));

      let tmx=0,tmy=0,mx=0,my=0;
      const onMove=e=>{const t=e.touches?e.touches[0]:e;tmx=(t.clientX/window.innerWidth-0.5)*2;tmy=-(t.clientY/window.innerHeight-0.5)*2;};
      const onResize=()=>{const{W,H}=getSize();renderer.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();};
      window.addEventListener("mousemove",onMove);
      window.addEventListener("touchmove",onMove,{passive:true});
      window.addEventListener("resize",onResize);

      const targetCol=new THREE.Color(C.o1),currentCol=new THREE.Color(C.o1);
      const t0=performance.now();

      const animate=()=>{
        animId=requestAnimationFrame(animate);
        const t=(performance.now()-t0)*0.001;
        mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
        targetCol.set(canvas.dataset.serviceColor||C.o1);
        currentCol.lerp(targetCol,0.04);
        wireMat.color.copy(currentCol); igMat.color.copy(currentCol); igMat.emissive.copy(currentCol);
        icoMat.specular.copy(currentCol); pl1.color.copy(currentCol); pl2.color.copy(currentCol); pl3.color.copy(currentCol);
        for(let i=0;i<origPos.length;i+=3){const ox=origPos[i],oy=origPos[i+1],oz=origPos[i+2];const len=Math.sqrt(ox*ox+oy*oy+oz*oz);const wave=Math.sin(t*1.4+ox*2.1+oy*1.7)*0.055;const sc=(1.1+wave)/len;tmpPos[i]=ox*sc;tmpPos[i+1]=oy*sc;tmpPos[i+2]=oz*sc;}
        geo.attributes.position.array.set(tmpPos); geo.attributes.position.needsUpdate=true; geo.computeVertexNormals();
        ico.rotation.x=t*0.14+my*0.26; ico.rotation.y=t*0.20+mx*0.26;
        wire.rotation.x=ico.rotation.x; wire.rotation.y=ico.rotation.y;
        r1.rotation.z=t*0.17; r2.rotation.x=Math.PI/4+t*0.12; r2.rotation.z=Math.PI/6+t*0.08;
        r3.rotation.y=t*0.10; r3.rotation.z=-Math.PI/4+t*0.07;
        ig.scale.setScalar(1+Math.sin(t*1.8)*0.13);
        pl1.position.set(Math.sin(t*0.48)*4,Math.cos(t*0.38)*3,3);
        pl4.position.set(Math.cos(t*0.35)*-3,Math.sin(t*0.26)*4,-2);
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

  useEffect(()=>{ if(canvasRef.current) canvasRef.current.dataset.serviceColor=SERVICES[activeIdx].color; },[activeIdx]);

  const isIn=phase==="in", isOut=phase==="out";
  const slideStyle={ transform:isIn?"translateX(0) scale(1)":isOut?"translateX(-40px) scale(0.97)":"translateX(0) scale(1)", opacity:isIn?1:isOut?0:1, transition:`transform ${TRANS_MS}ms cubic-bezier(0.22,1,0.36,1),opacity ${TRANS_MS}ms ease` };

  return (
    <div ref={wrapRef} style={{ position:"relative",width:"100%",height:"100%" }} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <canvas ref={canvasRef} style={{ width:"100%",height:"100%",display:"block" }}/>

      <div style={{ position:"absolute",inset:0,pointerEvents:"none",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"clamp(14px,3vw,28px)" }}>
        <div style={{ position:"absolute",left:0,right:0,bottom:0,height:"68%",background:"linear-gradient(to top,rgba(8,10,15,0.97) 0%,rgba(8,10,15,0.72) 55%,transparent 100%)",borderRadius:"0 0 16px 16px" }}/>

        <div style={{ position:"relative",zIndex:2,...slideStyle }}>
          {/* Tag */}
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:6,marginBottom:10,background:`${svc.color}18`,border:`1px solid ${svc.color}55` }}>
            <span style={{ width:5,height:5,borderRadius:"50%",background:svc.color,display:"inline-block",flexShrink:0,boxShadow:`0 0 6px ${svc.color}` }}/>
            <span style={{ color:svc.color,fontSize:9.5,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>{svc.tag}</span>
          </div>

          {/* Icon + Title */}
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:10 }}>
            <div style={{ background:`${svc.color}18`,border:`1.5px solid ${svc.color}55`,borderRadius:12,padding:10,backdropFilter:"blur(10px)",flexShrink:0,boxShadow:`0 0 18px ${svc.color}35` }}>
              {svc.svg(svc.color, 36)}
            </div>
            <h3 style={{ margin:0,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(1.05rem,2.8vw,1.5rem)",color:"#F8FAFF",lineHeight:1.1,letterSpacing:"-0.02em",textShadow:`0 0 30px ${svc.color}60` }}>
              {svc.label}
            </h3>
          </div>

          {/* Description */}
          <p style={{ margin:"0 0 12px",color:"#C8D5F0",fontSize:"clamp(11px,1.4vw,13.5px)",lineHeight:1.75,fontFamily:"'DM Sans',sans-serif",maxWidth:420,fontWeight:400 }}>
            {svc.desc}
          </p>

          {/* Feature chips */}
          <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
            {svc.features.map(f=>(
              <span key={f} style={{ padding:"3px 8px",borderRadius:5,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",color:"#7A90B8",fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.03em" }}>{f}</span>
            ))}
          </div>

          {/* Tech pills */}
          <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
            {svc.pills.map(p=>(
              <span key={p} style={{ padding:"2px 8px",borderRadius:4,background:`${svc.color}15`,border:`1px solid ${svc.color}40`,color:svc.color,fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em" }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Dot nav + counter */}
        <div style={{ position:"absolute",bottom:"clamp(14px,2.5vw,22px)",right:"clamp(14px,2.5vw,22px)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,pointerEvents:"auto" }}>
          <span style={{ color:C.tm,fontSize:9,fontWeight:700,letterSpacing:"0.15em",fontFamily:"'DM Sans',sans-serif" }}>
            {String(activeIdx+1).padStart(2,"0")} / {String(SERVICES.length).padStart(2,"0")}
          </span>
          <div style={{ display:"flex",gap:6 }}>
            {SERVICES.map((s,i)=>(
              <button key={s.id} onClick={()=>{setActiveIdx(i);setPhase("in");}} style={{ width:i===activeIdx?22:7,height:7,borderRadius:4,background:i===activeIdx?svc.color:"rgba(255,255,255,0.18)",border:"none",cursor:"pointer",padding:0,transition:"all 0.35s cubic-bezier(0.23,1,0.32,1)",boxShadow:i===activeIdx?`0 0 8px ${svc.color}90`:"none" }} aria-label={`Show ${s.label}`}/>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        {!paused&&(
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:"rgba(255,255,255,0.06)",borderRadius:"0 0 16px 16px",overflow:"hidden" }}>
            <div key={activeIdx} style={{ height:"100%",background:`linear-gradient(90deg,${svc.color}80,${svc.color})`,animation:`sv_progressBar ${SLIDE_MS}ms linear forwards`,borderRadius:2 }}/>
          </div>
        )}

        {paused&&(
          <div style={{ position:"absolute",top:14,left:14,zIndex:10,padding:"4px 10px",borderRadius:6,background:"rgba(8,10,15,0.85)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:C.tm,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.12em" }}>⏸ PAUSED</div>
        )}
      </div>
    </div>
  );
};

/* ─── Mini 3D Scene — unique geometry per card ─────────────────────── */
const MiniScene = ({ color, shape, hovered }) => {
  const canvasRef = useRef(null);
  const hovRef = useRef(hovered);
  useEffect(() => { hovRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer = null, animId = null;

    const init = () => {
      if (renderer) return;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(90, 90);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      cam.position.z = 3.2;
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const col = new THREE.Color(color);
      const pl = new THREE.PointLight(col, 5, 20); pl.position.set(2,2,2); scene.add(pl);
      const pl2b = new THREE.PointLight(0xffffff, 1.5, 20); pl2b.position.set(-2,-1,1); scene.add(pl2b);
      const hexCol = parseInt(color.replace('#',''), 16);
      const GEO = {
        box:         () => new THREE.BoxGeometry(1.15,1.15,1.15),
        torus:       () => new THREE.TorusGeometry(0.72,0.28,18,60),
        icosahedron: () => new THREE.IcosahedronGeometry(0.9,1),
        sphere:      () => new THREE.SphereGeometry(0.85,32,32),
        cylinder:    () => new THREE.CylinderGeometry(0.55,0.55,1.3,32),
        octahedron:  () => new THREE.OctahedronGeometry(0.95,0),
      };
      const geo = (GEO[shape] || GEO.icosahedron)();
      const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color:hexCol, emissive:hexCol, emissiveIntensity:0.22, specular:0xffffff, shininess:180, transparent:true, opacity:0.92 }));
      scene.add(mesh);
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:hexCol, wireframe:true, transparent:true, opacity:0.18 }));
      wire.scale.setScalar(1.05); scene.add(wire);
      const pCount=22, pPos=new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=1.25+Math.random()*0.35;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*0.7;pPos[i*3+2]=Math.sin(a)*r;}
      const pGeo=new THREE.BufferGeometry(); pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({color:hexCol,size:0.06,transparent:true,opacity:0.65})));
      const t0=performance.now();
      const tv=new THREE.Vector3();
      const animate=()=>{
        animId=requestAnimationFrame(animate);
        const t=(performance.now()-t0)*0.001, h=hovRef.current;
        mesh.rotation.y=t*(h?1.8:0.62)*0.55; mesh.rotation.x=Math.sin(t*0.38)*0.28;
        wire.rotation.y=mesh.rotation.y; wire.rotation.x=mesh.rotation.x;
        const ts=h?1.12:1.0; mesh.scale.lerp(tv.set(ts,ts,ts),0.1); wire.scale.setScalar(mesh.scale.x*1.05);
        pl.intensity=h?8:5; renderer.render(scene,cam);
      };
      animate();
      return ()=>{ cancelAnimationFrame(animId); renderer.dispose(); renderer=null; };
    };

    let cleanup=null;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!cleanup)cleanup=init();else if(!e.isIntersecting&&cleanup){cleanup();cleanup=null;}},{threshold:0.01,rootMargin:'200px'});
    obs.observe(canvas);
    return ()=>{ obs.disconnect(); cleanup?.(); };
  }, [color, shape]);

  return <canvas ref={canvasRef} style={{ width:90,height:90,display:'block' }}/>;
};

/* ─── Service Card — clean: 3D scene + name + pills only ────────────────── */
const ServiceCard = ({ svc, index, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <article
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ position:"relative",borderRadius:16,overflow:"hidden",cursor:"default",background:hov?C.bg3:C.bg2,border:hov?`1px solid ${svc.color}55`:"1px solid rgba(255,255,255,0.06)",transform:hov?"translateY(-8px) scale(1.03)":"none",transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",boxShadow:hov?`0 20px 52px rgba(0,0,0,0.7),0 0 0 1px ${svc.color}20`:"0 2px 12px rgba(0,0,0,0.45)",display:"flex",flexDirection:"column",alignItems:"center",padding:"clamp(18px,2.5vw,26px) clamp(12px,1.8vw,18px)",gap:12,textAlign:"center",opacity:visible?1:0,animation:visible?`sv_fadeUp 0.6s ease both ${index*65}ms`:"none" }}
    >
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${svc.color},transparent)` }}/>
      {hov&&<div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 10%,${svc.color}12,transparent 65%)`,pointerEvents:"none" }}/>}
      <span style={{ position:"absolute",top:12,right:12,padding:"2px 8px",borderRadius:5,background:`${svc.color}15`,border:`1px solid ${svc.color}35`,color:svc.color,fontSize:8.5,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>{svc.tag}</span>

      <div style={{ width:90,height:90,flexShrink:0,filter:hov?`drop-shadow(0 0 14px ${svc.color}70)`:`drop-shadow(0 0 5px ${svc.color}28)`,transition:"filter 0.3s ease" }}>
        <MiniScene color={svc.color} shape={svc.shape} hovered={hov}/>
      </div>

      <h3 style={{ margin:0,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(12px,1.3vw,14px)",color:hov?C.tw:C.ts,letterSpacing:"-0.01em",lineHeight:1.2,transition:"color 0.22s ease",position:"relative" }}>{svc.label}</h3>

      <div style={{ display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",position:"relative" }}>
        {svc.pills.map(p=>(
          <span key={p} style={{ padding:"2px 7px",borderRadius:4,background:`${svc.color}12`,border:`1px solid ${svc.color}30`,color:svc.color,fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em" }}>{p}</span>
        ))}
      </div>
    </article>
  );
};

/* ─── CTA Button ─────────────────────────────────────────────────────── */
const CTAButton = ({ label, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ position:"relative",overflow:"hidden",padding:"13px clamp(20px,3vw,34px)",borderRadius:9,fontWeight:700,fontSize:"clamp(12px,1.35vw,13.5px)",letterSpacing:"0.07em",cursor:"pointer",transform:hov?"translateY(-2px) scale(1.03)":"none",transition:"all 0.22s cubic-bezier(0.23,1,0.32,1)",outline:"none",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",...(primary?{background:hov?`linear-gradient(135deg,${C.o2},${C.o1})`:`linear-gradient(135deg,${C.o1},${C.o4})`,border:"none",color:"#fff",boxShadow:hov?`0 14px 42px rgba(79,142,247,0.55)`:`0 6px 22px rgba(79,142,247,0.32)`}:{background:hov?"rgba(79,142,247,0.10)":"transparent",border:`1.5px solid rgba(79,142,247,0.38)`,color:C.o1,boxShadow:hov?"0 6px 20px rgba(79,142,247,0.18)":"none"}) }}>
      {hov&&primary&&<span style={{ position:"absolute",top:0,left:0,bottom:0,width:"38%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",animation:"sv_shimmerBtn 0.65s ease forwards",pointerEvents:"none" }}/>}
      {primary&&<span style={{ marginRight:8,display:"inline-block",animation:"sv_arrowPulse 2s ease-in-out infinite" }}>→</span>}
      {label}
    </button>
  );
};

/* ─── Services Section ───────────────────────────────────────────────── */
const Services = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{ threshold:0.05,rootMargin:"40px" });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleNav = useCallback(id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');

        @keyframes sv_fadeUp    {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sv_fadeDown  {from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sv_pulse     {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.2);opacity:1}}
        @keyframes sv_borderRot {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sv_glowPulse {0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
        @keyframes sv_scanDown  {0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
        @keyframes sv_arrowPulse{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
        @keyframes sv_shimmerBtn{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(280%) skewX(-12deg)}}
        @keyframes sv_hexDrift  {from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes sv_gradText  {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes sv_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}
        @keyframes sv_float1    {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-13px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
        @keyframes sv_progressBar{from{width:0%}to{width:100%}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        .sv-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;padding:clamp(56px,9vw,110px) 0 clamp(64px,10vw,120px);}
        .sv-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}
        .sv-inner{position:relative;z-index:10;max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,80px);display:flex;flex-direction:column;gap:clamp(32px,5vw,52px);}
        .sv-showcase-wrap{position:relative;width:100%;height:clamp(300px,70vw,540px);}
        .sv-showcase-card{width:100%;height:100%;border-radius:18px;overflow:hidden;border:1px solid rgba(79,142,247,0.28);position:relative;animation:sv_glowPulse 4s ease-in-out infinite;}
        .sv-grid{display:grid;grid-template-columns:1fr;gap:12px;}
        @media(min-width:480px){.sv-grid{grid-template-columns:repeat(2,1fr);gap:14px;}}
        @media(min-width:900px){.sv-grid{grid-template-columns:repeat(3,1fr);gap:16px;}}
        @media(min-width:1200px){.sv-grid{grid-template-columns:repeat(6,1fr);gap:16px;}}
        .sv-hl{font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:#F8FAFF;margin:0;font-size:clamp(1.75rem,7.8vw,2.35rem);}
        .sv-hl .sv-accent{display:block;background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sv_gradText 5s ease infinite;filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));}
        .sv-shapes{display:none !important;}
        @media(min-width:600px){.sv-shapes{display:block !important;}}
        @media(max-width:380px){.sv-inner{padding:0 10px;}.sv-showcase-wrap{height:clamp(240px,68vw,300px);}.sv-hl{font-size:1.55rem;}}
        @media(min-width:480px){.sv-showcase-wrap{height:clamp(320px,65vw,440px);}.sv-hl{font-size:clamp(1.9rem,6vw,2.25rem);}}
        @media(min-width:768px){.sv-showcase-wrap{height:clamp(400px,52vw,520px);}.sv-hl{font-size:clamp(2.2rem,3.2vw,3.1rem);}}
        @media(min-width:1024px){.sv-showcase-wrap{height:clamp(440px,48vw,560px);}.sv-hl{font-size:clamp(2.4rem,3.4vw,3.4rem);}}
      `}</style>

      <section id="services" ref={sectionRef} className="sv-section" aria-label="Our Services">

        <div aria-hidden="true" style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"sv_hexDrift 16s linear infinite" }}><HexPattern/></div>

        <svg aria-hidden="true" style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none" }}>
          <filter id="sv_noise"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#sv_noise)"/>
        </svg>

        <div className="sv-scanline" aria-hidden="true"/>

        <div aria-hidden="true" style={{ position:"absolute",top:"8%",left:"12%",width:"min(600px,50vw)",height:"min(600px,50vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",bottom:"5%",right:"8%",width:"min(480px,38vw)",height:"min(480px,38vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",top:"50%",left:"5%",width:"min(360px,28vw)",height:"min(360px,28vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(129,140,248,0.05) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>

        <div className="sv-shapes" aria-hidden="true" style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2 }}>
          <svg width="80" height="80" viewBox="0 0 120 120" style={{ position:"absolute",top:"5%",right:"2%",animation:"sv_float1 8s ease-in-out infinite",filter:`drop-shadow(0 0 14px ${C.o1}55)` }}>
            <defs><linearGradient id="sv_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs>
            <polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#sv_sh1)" strokeWidth="1.4" opacity="0.7"/>
          </svg>
          <svg width="56" height="56" viewBox="0 0 90 90" style={{ position:"absolute",bottom:"6%",left:"1.5%",animation:"sv_float1 11s ease-in-out infinite reverse",filter:`drop-shadow(0 0 10px ${C.accent}50)` }}>
            <polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65"/>
          </svg>
        </div>

        <div className="sv-inner">

          {/* Header */}
          <header style={{ textAlign:"center",opacity:visible?1:0,animation:visible?"sv_fadeDown 0.8s ease both 0.05s":"none" }}>
            <div style={{ marginBottom:14 }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:7,background:"rgba(79,142,247,0.10)",border:`1px solid rgba(79,142,247,0.32)`,color:C.o2,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"sv_badgePulse 3.2s ease-in-out infinite",boxShadow:"0 0 18px rgba(79,142,247,0.12)" }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"sv_pulse 2s ease-in-out infinite",display:"inline-block" }}/>
                What We Build
              </span>
            </div>
            <h2 className="sv-hl">
              <span style={{ display:"block",color:C.tm,fontSize:"0.58em",fontWeight:400,marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif" }}>Explore our expertise</span>
              <span style={{ display:"block",color:C.tw }}>Our Premium</span>
              <span className="sv-accent">Services</span>
            </h2>
            <div style={{ margin:"16px auto 0",maxWidth:560 }}>
              <p style={{ color:C.tm,fontSize:"clamp(13px,1.6vw,16px)",lineHeight:1.8,fontWeight:400,margin:"0 0 18px" }}>
                From intelligent web platforms to AI-powered systems and airtight security — IsiTech delivers enterprise-grade digital solutions that scale with your ambition.
              </p>
              <Divider/>
            </div>
          </header>

          {/* Cinematic 3D Showcase */}
          <div style={{ opacity:visible?1:0,animation:visible?"sv_fadeUp 0.9s ease both 0.2s":"none" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"sv_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
              <span style={{ color:C.tm,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>Interactive Service Preview — hover to pause</span>
            </div>

            <div className="sv-showcase-wrap">
              <div aria-hidden="true" style={{ position:"absolute",inset:-2,borderRadius:20,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
                <div style={{ position:"absolute",inset:-2,borderRadius:22,background:`conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`,animation:"sv_borderRot 11s linear infinite" }}/>
              </div>

              <div className="sv-showcase-card" style={{ zIndex:1 }}>
                <div style={{ position:"absolute",inset:"10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.20) 0%,rgba(56,189,248,0.06) 40%,transparent 70%)",filter:"blur(30px)",zIndex:0 }}/>
                <div style={{ position:"absolute",inset:0,zIndex:6,overflow:"hidden",pointerEvents:"none",borderRadius:18 }}>
                  <div style={{ position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`,animation:"sv_scanDown 5.5s linear infinite",opacity:0.5 }}/>
                </div>
                {[{top:12,left:12,borderTop:`2px solid ${C.o1}90`,borderLeft:`2px solid ${C.o1}90`},{top:12,right:12,borderTop:`2px solid ${C.accent}90`,borderRight:`2px solid ${C.accent}90`},{bottom:12,left:12,borderBottom:`2px solid ${C.accentAlt}90`,borderLeft:`2px solid ${C.accentAlt}90`},{bottom:12,right:12,borderBottom:`2px solid ${C.o1}90`,borderRight:`2px solid ${C.o1}90`}].map((s,i)=><div key={i} aria-hidden="true" style={{ position:"absolute",width:22,height:22,zIndex:7,...s }}/>)}
                <div style={{ position:"absolute",top:14,left:14,zIndex:8,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,background:"rgba(8,10,15,0.92)",backdropFilter:"blur(14px)",border:`1px solid rgba(79,142,247,0.35)` }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"sv_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                  <span style={{ color:C.o1,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase" }}>Our Services</span>
                </div>
                <ServiceShowcase/>
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18,opacity:visible?1:0,animation:visible?"sv_fadeUp 0.7s ease both 0.4s":"none" }}>
              <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)` }}/>
              <div style={{ width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0 }}/>
              <span style={{ color:C.tm,fontSize:9,fontWeight:700,letterSpacing:"0.28em",textTransform:"uppercase",whiteSpace:"nowrap" }}>All Services</span>
              <div style={{ width:4,height:4,background:C.o1,transform:"rotate(45deg)",flexShrink:0 }}/>
              <div style={{ flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)` }}/>
            </div>
            <div className="sv-grid">
              {SERVICES.map((s,i)=>(<ServiceCard key={s.id} svc={s} index={i} visible={visible}/>))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign:"center",opacity:visible?1:0,animation:visible?"sv_fadeUp 0.7s ease both 0.8s":"none",display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
            <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center" }}>
              <CTAButton label="Start Your Project" primary onClick={()=>handleNav("contact")}/>
              <CTAButton label="View Our Work" primary={false} onClick={()=>handleNav("projects")}/>
            </div>
            <p style={{ color:C.tf,fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",margin:0 }}>Free consultation · No commitment required</p>
          </div>

        </div>

        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,rgba(8,10,15,0.85))`,zIndex:5,pointerEvents:"none" }}/>
        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}28,transparent)`,zIndex:6 }}/>
      </section>
    </>
  );
};

export default Services;