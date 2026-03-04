import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BLOG_POSTS = [
  {
    id: "post-1",
    title: "Top Web Development Trends for 2026",
    excerpt: "AI-driven automation, no-code tools, and WebAssembly are reshaping how developers build the web.",
    fullText: "As we enter 2026, web development continues to evolve rapidly. From AI-assisted coding and automation tools to performance-focused frameworks like Remix and Astro, the next year will demand smarter, faster, and more accessible digital experiences.",
    icon: "rocket",
    date: "January 2026",
    readTime: "5 min read",
    views: "12.4k",
    category: "Development",
    accent: "#818cf8",
    gradFrom: "#6366f1", gradTo: "#06b6d4",
    shape: "icosahedron",
    tags: ["AI", "WebAssembly", "Frameworks"],
  },
  {
    id: "post-2",
    title: "Building Human-Centered Digital Products",
    excerpt: "Good design starts with empathy — discover how emotion and usability shape modern interfaces.",
    fullText: "Beyond aesthetics, modern design emphasizes clarity, accessibility, and user emotion. We craft every interface to connect with real users — blending beauty with purpose for impactful experiences.",
    icon: "palette",
    date: "February 2026",
    readTime: "4 min read",
    views: "9.1k",
    category: "Design",
    accent: "#c084fc",
    gradFrom: "#a855f7", gradTo: "#f472b6",
    shape: "octahedron",
    tags: ["UX", "Accessibility", "Emotion"],
  },
  {
    id: "post-3",
    title: "The Rise of Micro-SaaS Startups",
    excerpt: "Learn why small, focused SaaS products are outperforming big tech in innovation and speed.",
    fullText: "Micro-SaaS empowers small teams to solve niche problems profitably. With tools like Supabase, Next.js, and Stripe, launching a lightweight but scalable product has never been easier.",
    icon: "bulb",
    date: "March 2026",
    readTime: "6 min read",
    views: "15.2k",
    category: "Business",
    accent: "#fb923c",
    gradFrom: "#f97316", gradTo: "#f43f5e",
    shape: "torus",
    tags: ["SaaS", "Startups", "Growth"],
  },
];

const MARQUEE_TEXT = "Latest Insights  Web Development  Design  SaaS  AI Trends 2026  ";

function hexRgb(hex) {
  return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)].join(",");
}

const ICONS = {
  rocket: (col) => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  palette: (col) => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill={col}/><circle cx="17.5" cy="10.5" r=".5" fill={col}/>
      <circle cx="8.5" cy="7.5" r=".5" fill={col}/><circle cx="6.5" cy="12.5" r=".5" fill={col}/>
      <path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  bulb: (col) => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
  ),
};

/* ── Per-card 3D Scene ── */
const CardScene = ({ accent, shape, active }) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const mount = mountRef.current, canvas = canvasRef.current;
    if (!mount || !canvas) return;
    let renderer = null, animId = null, doCleanup = null;

    const init = () => {
      if (renderer) return;
      const W = mount.clientWidth || 240, H = mount.clientHeight || 170;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
      cam.position.z = 3.8;
      const col = parseInt(accent.replace("#","0x"));
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const pl1 = new THREE.PointLight(col, 8, 20); pl1.position.set(3,3,3); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xffffff, 2, 16); pl2.position.set(-2,-1,2); scene.add(pl2);
      const plRim = new THREE.PointLight(col, 3, 14); plRim.position.set(0,-2.5,-2); scene.add(plRim);
      let geo;
      switch(shape) {
        case "torus": geo = new THREE.TorusGeometry(0.70,0.28,20,80); break;
        case "octahedron": geo = new THREE.OctahedronGeometry(0.92,0); break;
        default: geo = new THREE.IcosahedronGeometry(0.88,1); break;
      }
      const mat = new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.25,specular:0xffffff,shininess:200,transparent:true,opacity:0.92});
      const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:0.18}));
      wire.scale.setScalar(1.05); scene.add(wire);
      const inner = new THREE.Mesh(new THREE.SphereGeometry(0.38,20,20), new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:1.0,transparent:true,opacity:0.28}));
      scene.add(inner);
      const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.42,0.022,12,90), new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.55,transparent:true,opacity:0.60}));
      ringA.rotation.x = Math.PI/2.6; scene.add(ringA);
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.75,0.014,10,70), new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.35,transparent:true,opacity:0.38}));
      ringB.rotation.x = Math.PI/5; ringB.rotation.z = Math.PI/5; scene.add(ringB);
      const sats = [{r:1.48,speed:0.52,yOff:0.28,phase:0},{r:1.62,speed:-0.35,yOff:-0.38,phase:2.0}].map(d => {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.065,12,12), new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.9}));
        s.userData = {...d,angle:d.phase}; scene.add(s); return s;
      });
      const pCount = 36, pPos = new Float32Array(pCount*3);
      for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=1.9+Math.random()*0.55;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*1.2;pPos[i*3+2]=Math.sin(a)*r;}
      const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));
      const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({color:col,size:0.052,transparent:true,opacity:0.68})); scene.add(pts);
      const onResize=()=>{const nw=mount.clientWidth,nh=mount.clientHeight;renderer.setSize(nw,nh);cam.aspect=nw/nh;cam.updateProjectionMatrix();};
      window.addEventListener("resize",onResize);
      const _t0_clock = performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate); const t=(performance.now() - _t0_clock) * 0.001; const a=activeRef.current; const spd=a?1.9:0.62;
        mesh.rotation.y=t*spd*0.50; mesh.rotation.x=Math.sin(t*0.30)*0.28;
        wire.rotation.y=mesh.rotation.y; wire.rotation.x=mesh.rotation.x;
        const ts=a?1.15:1.0; mesh.scale.lerp(new THREE.Vector3(ts,ts,ts),0.065); wire.scale.setScalar(mesh.scale.x*1.05);
        inner.scale.setScalar(1+Math.sin(t*1.8)*0.14);
        ringA.rotation.z=t*0.36; ringA.rotation.y=t*0.12;
        ringB.rotation.x=Math.PI/5+t*0.22; ringB.rotation.z=Math.PI/5+t*0.09;
        sats.forEach(s=>{s.userData.angle+=s.userData.speed*0.013;s.position.x=Math.cos(s.userData.angle)*s.userData.r;s.position.z=Math.sin(s.userData.angle)*s.userData.r;s.position.y=s.userData.yOff+Math.sin(t*1.0+s.userData.angle)*0.22;});
        pts.rotation.y=t*0.17;
        pl1.position.set(Math.sin(t*0.5)*2.8,Math.cos(t*0.36)*2.2,3);
        plRim.position.set(Math.cos(t*0.42)*-2.2,-2.2,Math.sin(t*0.58)*-2);
        renderer.render(scene,cam);
      };
      animate();
      doCleanup=()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",onResize);if(renderer){renderer.dispose();renderer=null;}};
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if(doCleanup){doCleanup();doCleanup=null;} }
    }, { threshold: 0.01, rootMargin: '150px' });
    obs.observe(canvas);
    return () => { obs.disconnect(); if(doCleanup) doCleanup(); };
  }, [accent, shape]);

  return <div ref={mountRef} style={{width:"100%",height:"100%",position:"relative"}}><canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/></div>;
};

/* ── Hero Banner 3D ── */
const HeroBanner = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    let renderer = null, animId = null, doCleanup = null;

    const init = () => {
      if (renderer) return;
      renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(canvas.clientWidth,canvas.clientHeight);
      renderer.setClearColor(0,0);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55,canvas.clientWidth/canvas.clientHeight,0.1,200);
    cam.position.z=7;
    scene.add(new THREE.AmbientLight(0xffffff,0.18));
    const lights=[[0x818cf8,5,[5,4,5]],[0xc084fc,3.5,[-4,-3,3]],[0x67e8f9,2.5,[0,-4,2]],[0xf472b6,2,[4,-2,-3]],[0xfb923c,1.5,[-3,3,-2]]].map(([c,i,p])=>{const l=new THREE.PointLight(c,i,32);l.position.set(...p);scene.add(l);return l;});
    const helixGroup = new THREE.Group();
    for(let i=0;i<36;i++){
      const t=i/36, angle=t*Math.PI*6;
      [1,-1].forEach(side=>{
        const sphere=new THREE.Mesh(new THREE.SphereGeometry(0.09,10,10),new THREE.MeshPhongMaterial({color:side>0?0x818cf8:0xc084fc,emissive:side>0?0x818cf8:0xc084fc,emissiveIntensity:0.6}));
        sphere.position.set(Math.cos(angle+side*Math.PI*0.5)*1.4,(t-0.5)*5.0,Math.sin(angle+side*Math.PI*0.5)*1.4);
        helixGroup.add(sphere);
      });
      if(i%3===0){
        const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.8,8),new THREE.MeshPhongMaterial({color:0xa78bfa,emissive:0xa78bfa,emissiveIntensity:0.4,transparent:true,opacity:0.50}));
        bar.position.set(0,(t-0.5)*5.0,0); bar.rotation.z=Math.PI/2; bar.rotation.y=angle+Math.PI*0.25;
        helixGroup.add(bar);
      }
    }
    helixGroup.position.x=-2.5; scene.add(helixGroup);
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.0,1),new THREE.MeshPhongMaterial({color:0x4f46e5,emissive:0x1e1b4b,specular:0xc7d2fe,shininess:180,transparent:true,opacity:0.82})); scene.add(core);
    const coreWire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.0,1),new THREE.MeshBasicMaterial({color:0x818cf8,wireframe:true,transparent:true,opacity:0.15})); coreWire.scale.setScalar(1.03); scene.add(coreWire);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(0.6,24,24),new THREE.MeshPhongMaterial({color:0x6366f1,emissive:0x6366f1,emissiveIntensity:1.0,transparent:true,opacity:0.30})); scene.add(glow);
    const rings=[{r:2.2,tube:0.030,col:0x818cf8,rx:Math.PI/2.3,rz:0.3,op:0.72},{r:2.8,tube:0.020,col:0xc084fc,rx:Math.PI/4,rz:Math.PI/5,op:0.55},{r:3.4,tube:0.014,col:0xfb923c,rx:Math.PI/6.5,rz:-Math.PI/4,op:0.40}].map(d=>{const m=new THREE.Mesh(new THREE.TorusGeometry(d.r,d.tube,16,140),new THREE.MeshPhongMaterial({color:d.col,emissive:d.col,shininess:240,transparent:true,opacity:d.op}));m.rotation.x=d.rx;m.rotation.z=d.rz;scene.add(m);return m;});
    const shapes=[new THREE.IcosahedronGeometry(0.20,1),new THREE.OctahedronGeometry(0.22,0),new THREE.TorusGeometry(0.18,0.07,10,28),new THREE.TetrahedronGeometry(0.24,0),new THREE.DodecahedronGeometry(0.18,0),new THREE.SphereGeometry(0.18,14,14)].map((geo,i)=>{const cols=[0x818cf8,0xc084fc,0xf472b6,0xfb923c,0xa78bfa,0x67e8f9];const m=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:cols[i],emissive:cols[i],emissiveIntensity:0.45,shininess:200}));m.userData={angle:(i/6)*Math.PI*2,radius:1.8+(i%3)*0.4,speed:(0.28+i*0.10)*(i%2?1:-1),yOff:Math.sin(i*1.2)*0.65};scene.add(m);return m;});
    const pCount=220,pPos=new Float32Array(pCount*3),pCol=new Float32Array(pCount*3);
    const pal=[[0.49,0.49,0.97],[0.75,0.51,0.99],[0.98,0.45,0.71],[0.98,0.57,0.24],[0.40,0.91,0.98]];
    for(let i=0;i<pCount;i++){const r=4.0+Math.random()*2.2,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pPos[i*3]=r*Math.sin(p)*Math.cos(t);pPos[i*3+1]=r*Math.sin(p)*Math.sin(t);pPos[i*3+2]=r*Math.cos(p);const c=pal[i%5];pCol[i*3]=c[0];pCol[i*3+1]=c[1];pCol[i*3+2]=c[2];}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));pGeo.setAttribute("color",new THREE.BufferAttribute(pCol,3));
    const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.040,transparent:true,opacity:0.76,vertexColors:true}));scene.add(particles);
    let mx=0,my=0;
    const onMove=e=>{const t=e.touches?e.touches[0]:e;mx=(t.clientX/window.innerWidth-.5)*2;my=-(t.clientY/window.innerHeight-.5)*2;};
    window.addEventListener("mousemove",onMove); window.addEventListener("touchmove",onMove,{passive:true});
    const onResize=()=>{renderer.setSize(canvas.clientWidth,canvas.clientHeight);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.updateProjectionMatrix();};
    window.addEventListener("resize",onResize);
    const _t0_clock = performance.now();
    const animate=()=>{
      animId=requestAnimationFrame(animate); const t=(performance.now() - _t0_clock) * 0.001;
      core.rotation.x=t*0.15+my*0.18; core.rotation.y=t*0.20+mx*0.18;
      coreWire.rotation.x=core.rotation.x; coreWire.rotation.y=core.rotation.y;
      glow.scale.setScalar(1+Math.sin(t*1.5)*0.14);
      helixGroup.rotation.y=t*0.18; helixGroup.position.y=Math.sin(t*0.35)*0.3;
      rings[0].rotation.z=t*0.20; rings[1].rotation.x=Math.PI/4+t*0.14; rings[1].rotation.z=Math.PI/5+t*0.10;
      rings[2].rotation.y=t*0.11; rings[2].rotation.z=-Math.PI/4+t*0.08;
      shapes.forEach(m=>{m.userData.angle+=m.userData.speed*0.012;m.position.x=Math.cos(m.userData.angle)*m.userData.radius;m.position.z=Math.sin(m.userData.angle)*m.userData.radius;m.position.y=m.userData.yOff+Math.sin(t*0.9+m.userData.angle)*0.3;m.rotation.y=t*1.8;m.rotation.x=t*0.85;});
      particles.rotation.y=t*0.025; particles.rotation.x=t*0.012;
      lights[0].position.set(Math.sin(t*0.4)*6,Math.cos(t*0.3)*5,5);
      lights[1].position.set(Math.cos(t*0.3)*-6,Math.sin(t*0.45)*-4,4);
      renderer.render(scene,cam);
    };
    animate();
    doCleanup=()=>{cancelAnimationFrame(animId);window.removeEventListener("mousemove",onMove);window.removeEventListener("touchmove",onMove);window.removeEventListener("resize",onResize);if(renderer){renderer.dispose();renderer=null;}};
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if(doCleanup){doCleanup();doCleanup=null;} }
    }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); if(doCleanup) doCleanup(); };
  },[]);
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ── Marquee ── */
const Marquee = () => (
  <div style={{position:"relative",overflow:"hidden",borderTop:"1px solid rgba(129,140,248,0.2)",borderBottom:"1px solid rgba(129,140,248,0.2)",background:"linear-gradient(90deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06),rgba(99,102,241,0.08))",padding:"13px 0",userSelect:"none",zIndex:5}}>
    <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:"linear-gradient(to right,#080d1e,transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"linear-gradient(to left,#080d1e,transparent)",zIndex:2,pointerEvents:"none"}}/>
    <div style={{display:"flex",width:"max-content",animation:"bl_marquee 28s linear infinite"}} onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"} onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
      {[...Array(6)].map((_,i)=>(
        <span key={i} style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(11px,1.4vw,14px)",letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 32px",background:"linear-gradient(135deg,#818cf8,#c084fc,#f472b6,#fb923c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",whiteSpace:"nowrap"}}>
          {MARQUEE_TEXT}
        </span>
      ))}
    </div>
  </div>
);

/* ── SVG BG Accents ── */
const BgAccents = () => (
  <div className="bl-float-deco" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
    <svg width="80" height="80" viewBox="0 0 120 120" style={{position:"absolute",top:"3%",left:"1.5%",animation:"bl_float1 9s ease-in-out infinite",filter:"drop-shadow(0 0 14px #818cf860)"}}>
      <defs><linearGradient id="bl_g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient><linearGradient id="bl_g2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient></defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#bl_g1)" opacity="0.52"/>
      <polygon points="60,5 110,40 60,60" fill="url(#bl_g2)" opacity="0.38"/>
    </svg>
    <svg width="60" height="60" viewBox="0 0 100 100" style={{position:"absolute",top:"5%",right:"2.5%",animation:"bl_float2 11s ease-in-out infinite",filter:"drop-shadow(0 0 10px #f472b660)"}}>
      <defs><linearGradient id="bl_g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#bl_g3)" opacity="0.55"/>
    </svg>
    <svg width="66" height="66" viewBox="0 0 100 100" style={{position:"absolute",top:"46%",left:"0.5%",animation:"bl_spin 22s linear infinite",filter:"drop-shadow(0 0 9px #67e8f960)"}}>
      <defs><linearGradient id="bl_g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#bl_g4)" strokeWidth="7" opacity="0.56"/>
    </svg>
    <svg width="48" height="48" viewBox="0 0 80 80" style={{position:"absolute",bottom:"5%",right:"2%",animation:"bl_float1 8s ease-in-out infinite reverse",filter:"drop-shadow(0 0 9px #fbbf2460)"}}>
      <defs><linearGradient id="bl_g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="15,25 55,25 55,65 15,65" fill="url(#bl_g5)" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.48" stroke="#fbbf24" strokeWidth="1"/>
    </svg>
    <svg width="42" height="42" viewBox="0 0 60 60" style={{position:"absolute",bottom:"9%",left:"3.5%",animation:"bl_pulse 5s ease-in-out infinite",filter:"drop-shadow(0 0 8px #a78bfa60)"}}>
      <defs><radialGradient id="bl_g6" cx="35%" cy="30%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#4c1d95"/></radialGradient></defs>
      <circle cx="30" cy="30" r="26" fill="url(#bl_g6)" opacity="0.62"/>
    </svg>
  </div>
);

/* ── Blog Card ── */
const BlogCard = ({ post, index, visible }) => {
  const [expanded, setExpanded] = useState(false);
  const [hov, setHov] = useState(false);
  const { title, excerpt, fullText, icon, date, readTime, views, category, accent, gradFrom, gradTo, shape, tags } = post;
  const aRgb = hexRgb(accent);

  return (
    <li
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        listStyle:"none", position:"relative", borderRadius:24, overflow:"hidden",
        display:"flex", flexDirection:"column",
        background:hov?`linear-gradient(160deg,rgba(${aRgb},0.12) 0%,rgba(${aRgb},0.05) 50%,rgba(255,255,255,0.025) 100%)`:"linear-gradient(160deg,rgba(255,255,255,0.055) 0%,rgba(255,255,255,0.018) 100%)",
        border:hov?`1px solid rgba(${aRgb},0.5)`:"1px solid rgba(255,255,255,0.08)",
        backdropFilter:"blur(20px)",
        boxShadow:hov?`0 16px 60px rgba(${aRgb},0.24),0 0 0 1px rgba(${aRgb},0.12),inset 0 1px 0 rgba(255,255,255,0.12)`:"0 4px 28px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.06)",
        transform:hov?"translateY(-10px) scale(1.015)":"translateY(0) scale(1)",
        transition:"all 0.45s cubic-bezier(0.23,1,0.32,1)",
        opacity:visible?1:0,
        animation:visible?`bl_fadeUp 0.7s ease both ${index*130}ms`:"none",
        cursor:"default",
      }}
    >
      {/* Top gradient bar */}
      <div style={{height:3,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,boxShadow:`0 0 14px rgba(${aRgb},0.55)`,flexShrink:0}}/>

      {/* 3D Panel */}
      <div style={{width:"100%",height:"clamp(140px,16vw,175px)",position:"relative",overflow:"hidden",background:`radial-gradient(ellipse at 50% 60%,rgba(${aRgb},0.16) 0%,rgba(5,7,20,0.65) 70%)`,flexShrink:0}}>
        <CardScene accent={accent} shape={shape} active={hov}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.022) 50%)",backgroundSize:"100% 3px",pointerEvents:"none",zIndex:2}}/>
        <div style={{position:"absolute",top:10,left:12,zIndex:4}}>
          <span style={{padding:"3px 10px",borderRadius:100,background:"rgba(5,7,20,0.78)",backdropFilter:"blur(10px)",border:`1px solid rgba(${aRgb},0.4)`,color:accent,fontSize:8,fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{category}</span>
        </div>
        <div style={{position:"absolute",top:10,right:12,zIndex:4,padding:"3px 9px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(199,210,254,0.55)",fontSize:8,fontWeight:700,letterSpacing:"0.1em",fontFamily:"'DM Sans',sans-serif"}}>{date}</div>
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(10px)",border:`1px solid rgba(${aRgb},0.28)`,whiteSpace:"nowrap"}}>
          <span style={{width:4,height:4,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 6px #34d399",animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
          <span style={{color:"#a5b4fc",fontSize:7,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Interactive 3D</span>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"clamp(16px,2.5vw,22px)",display:"flex",flexDirection:"column",gap:11,flex:1}}>

        {/* Meta: icon + views + read time */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{transform:hov?"scale(1.12) rotate(4deg)":"scale(1) rotate(0deg)",transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)",filter:hov?`drop-shadow(0 0 10px rgba(${aRgb},0.7))`:"none"}}>
            {ICONS[icon] ? ICONS[icon](accent) : <span style={{fontSize:24}}>💡</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:"rgba(165,180,252,0.5)",fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:3}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(165,180,252,0.5)"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {views}
            </span>
            <span style={{color:"rgba(165,180,252,0.5)",fontSize:9,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(14px,1.7vw,17px)",letterSpacing:"-0.015em",lineHeight:1.3,color:hov?"#e0e7ff":"#c7d2fe",margin:0,transition:"color 0.25s ease"}}>{title}</h3>

        {/* Divider */}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,rgba(${aRgb},0.3),transparent)`}}/>

        {/* Excerpt */}
        <p style={{color:"rgba(199,210,254,0.60)",fontSize:"clamp(11.5px,1.3vw,13px)",lineHeight:1.78,margin:0,fontFamily:"'DM Sans',sans-serif",fontWeight:400,flex:1}}>{excerpt}</p>

        {/* Expanded full text */}
        <div style={{display:"grid",gridTemplateRows:expanded?"1fr":"0fr",transition:"grid-template-rows 0.45s cubic-bezier(0.23,1,0.32,1)"}}>
          <div style={{overflow:"hidden"}}>
            <p style={{margin:0,padding:expanded?"10px 0 0 14px":"0 0 0 14px",color:"rgba(165,180,252,0.55)",fontSize:"clamp(11px,1.2vw,12.5px)",lineHeight:1.82,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",borderLeft:`2px solid rgba(${aRgb},0.38)`,opacity:expanded?1:0,transition:"opacity 0.35s ease 0.1s"}}>{fullText}</p>
          </div>
        </div>

        {/* Tags */}
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {tags.map(tag=>(
            <span key={tag} style={{padding:"3px 9px",borderRadius:100,background:`rgba(${aRgb},0.1)`,border:`1px solid rgba(${aRgb},0.22)`,color:accent,fontSize:9,fontWeight:700,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>{tag}</span>
          ))}
        </div>

        {/* Relevance score bar */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{color:"rgba(165,180,252,0.4)",fontSize:8,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Relevance Score</span>
            <span style={{color:accent,fontSize:8,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>97%</span>
          </div>
          <div style={{height:2.5,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",width:visible?"97%":"0%",borderRadius:2,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,transition:"width 1.8s cubic-bezier(0.23,1,0.32,1) 0.5s",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)",animation:"bl_shimmer 2s ease-in-out infinite"}}/>
            </div>
          </div>
        </div>

        {/* Read More button */}
        <button
          onClick={()=>setExpanded(!expanded)}
          aria-expanded={expanded}
          style={{width:"100%",padding:"10px 18px",borderRadius:12,border:`1px solid rgba(${aRgb},0.22)`,background:`rgba(${aRgb},0.09)`,backdropFilter:"blur(8px)",color:"rgba(199,210,254,0.8)",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(11px,1.2vw,12.5px)",fontWeight:700,letterSpacing:"0.06em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",outline:"none",marginTop:"auto"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${aRgb},0.18)`;e.currentTarget.style.border=`1px solid rgba(${aRgb},0.5)`;e.currentTarget.style.color=accent;}}
          onMouseLeave={e=>{e.currentTarget.style.background=`rgba(${aRgb},0.09)`;e.currentTarget.style.border=`1px solid rgba(${aRgb},0.22)`;e.currentTarget.style.color="rgba(199,210,254,0.8)";}}
        >
          {expanded ? "Show Less" : "Read More"}
          <span style={{display:"inline-block",transform:expanded?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.3s ease"}}>{expanded ? "↑" : "→"}</span>
        </button>
      </div>

      {/* Corner glow */}
      <div style={{position:"absolute",bottom:-22,right:-22,width:120,height:120,borderRadius:"50%",background:`radial-gradient(ellipse,rgba(${aRgb},0.20) 0%,transparent 70%)`,opacity:hov?1:0,transition:"opacity 0.4s ease",pointerEvents:"none",zIndex:0}}/>
    </li>
  );
};

/* ── Blog Section ── */
const Blog = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.unobserve(entry.target);}},{threshold:0.07});
    if(sectionRef.current)observer.observe(sectionRef.current);
    return()=>observer.disconnect();
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes bl_fadeUp     {from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bl_fadeDown   {from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bl_float1     {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-14px) rotate(4deg)}66%{transform:translateY(-6px) rotate(-3deg)}}
        @keyframes bl_float2     {0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes bl_spin       {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bl_pulse      {0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.12);opacity:1}}
        @keyframes bl_gridMove   {from{transform:translateY(0)}to{transform:translateY(50px)}}
        @keyframes bl_marquee    {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes bl_badgePulse {0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,.4)}50%{box-shadow:0 0 0 8px rgba(129,140,248,0)}}
        @keyframes bl_shimmer    {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}

        .bl-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(160deg,#080d1e 0%,#050714 30%,#0a0a1f 65%,#0d0620 100%);font-family:'DM Sans',sans-serif;padding:clamp(48px,9vw,110px) 0 clamp(56px,10vw,120px);}
        .bl-gridbg{position:absolute;inset:0;z-index:0;overflow:hidden;background-image:linear-gradient(rgba(129,140,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.04) 1px,transparent 1px);background-size:55px 55px;animation:bl_gridMove 10s linear infinite;}
        .bl-inner{position:relative;z-index:10;max-width:1300px;margin:0 auto;padding:0 clamp(12px,4vw,64px);}

        .bl-hero-banner{width:100%;height:clamp(130px,38vw,295px);border-radius:20px;overflow:hidden;position:relative;margin-bottom:clamp(22px,5vw,50px);border:1px solid rgba(129,140,248,0.15);box-shadow:0 0 70px rgba(99,102,241,0.11),inset 0 1px 0 rgba(255,255,255,0.06);}

        .bl-grid{display:grid;grid-template-columns:1fr;gap:clamp(12px,2vw,22px);padding:0;list-style:none;}
        @media(min-width:600px){.bl-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:1024px){.bl-grid{grid-template-columns:repeat(3,1fr);}}

        /* Hide floating decorations on mobile */
        .bl-float-deco{display:none!important;}
        @media(min-width:640px){.bl-float-deco{display:block!important;}}
      `}</style>

      <section id="blog" ref={sectionRef} className="bl-section" aria-label="Blog">
        <div className="bl-gridbg"/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.022,pointerEvents:"none"}}>
          <filter id="bl_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#bl_noise)"/>
        </svg>
        {[{top:"8%",left:"16%",w:"clamp(160px,40vw,520px)",h:"clamp(160px,40vw,520px)",c:"rgba(99,102,241,0.13)"},{bottom:"5%",right:"11%",w:"clamp(140px,34vw,440px)",h:"clamp(140px,34vw,440px)",c:"rgba(168,85,247,0.10)"},{top:"50%",right:"36%",w:"clamp(100px,25vw,320px)",h:"clamp(100px,25vw,320px)",c:"rgba(251,146,60,0.07)"}].map((g,i)=>(
          <div key={i} style={{position:"absolute",...(g.top?{top:g.top}:{bottom:g.bottom}),...(g.left?{left:g.left}:{right:g.right}),width:g.w,height:g.h,borderRadius:"50%",background:`radial-gradient(ellipse,${g.c} 0%,transparent 70%)`,pointerEvents:"none",zIndex:1}}/>
        ))}
        <BgAccents/>

        {/* Marquee */}
        <div style={{position:"relative",zIndex:10,marginBottom:"clamp(28px,4.5vw,48px)"}}>
          <Marquee/>
        </div>

        <div className="bl-inner">
          {/* Header */}
          <header style={{textAlign:"center",marginBottom:"clamp(26px,5vw,46px)",opacity:visible?1:0,animation:visible?"bl_fadeDown 0.8s ease both 0.05s":"none"}}>
            <div style={{marginBottom:14}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 16px",borderRadius:100,background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(168,85,247,0.12))",border:"1px solid rgba(129,140,248,0.3)",color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"bl_badgePulse 3s ease-in-out infinite"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 7px #818cf8"}}/>
                Fresh Perspectives
              </span>
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.8rem,5vw,3.6rem)",letterSpacing:"-0.03em",lineHeight:1.08,color:"#fff",marginBottom:6}}>
              <span style={{display:"block"}}>Latest</span>
              <span style={{display:"block",background:"linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#f472b6 80%,#fb923c 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 0 22px rgba(192,132,252,0.5))"}}>Insights</span>
            </h2>
            <p style={{color:"rgba(199,210,254,0.62)",fontSize:"clamp(13px,1.7vw,17px)",lineHeight:1.75,maxWidth:520,margin:"12px auto 0",fontWeight:400}}>Fresh perspectives on the intersection of code, design, and business.</p>
            <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.4),transparent)",maxWidth:340,margin:"20px auto 0"}}/>
          </header>

          {/* Hero 3D banner */}
          <div className="bl-hero-banner" style={{opacity:visible?1:0,animation:visible?"bl_fadeUp 0.9s ease both 0.2s":"none"}}>
            {[{top:10,left:10,bt:"2px solid rgba(129,140,248,0.5)",bl:"2px solid rgba(129,140,248,0.5)"},{top:10,right:10,bt:"2px solid rgba(192,132,252,0.5)",br:"2px solid rgba(192,132,252,0.5)"},{bottom:10,left:10,bb:"2px solid rgba(103,232,249,0.5)",bl:"2px solid rgba(103,232,249,0.5)"},{bottom:10,right:10,bb:"2px solid rgba(251,146,60,0.5)",br:"2px solid rgba(251,146,60,0.5)"}].map((c,i)=>(
              <div key={i} style={{position:"absolute",zIndex:5,width:20,height:20,...(c.top!==undefined?{top:c.top}:{bottom:c.bottom}),...(c.left!==undefined?{left:c.left}:{right:c.right}),borderTop:c.bt,borderBottom:c.bb,borderLeft:c.bl,borderRight:c.br}}/>
            ))}
            <div style={{position:"absolute",top:14,left:16,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(129,140,248,0.25)"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"bl_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
              <span style={{color:"#a5b4fc",fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>Knowledge Engine</span>
            </div>
            <div style={{position:"absolute",bottom:14,right:16,zIndex:6,display:"flex",gap:8}}>
              {["Dev","Design","Business"].map((t,i)=>(
                <span key={t} style={{padding:"3px 9px",borderRadius:100,background:"rgba(5,7,20,0.72)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:["#818cf8","#c084fc","#fb923c"][i],fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t}</span>
              ))}
            </div>
            <HeroBanner/>
          </div>

          {/* Cards */}
          <ul className="bl-grid">
            {BLOG_POSTS.map((post,i)=><BlogCard key={post.id} post={post} index={i} visible={visible}/>)}
          </ul>

          {/* Stats strip */}
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(10px,2vw,18px)",justifyContent:"center",margin:"clamp(36px,5vw,52px) auto 0",maxWidth:800,opacity:visible?1:0,animation:visible?"bl_fadeUp 0.7s ease both 0.65s":"none"}}>
            {[{val:"36k+",label:"Monthly Readers",col:"#818cf8"},{val:"3",label:"Fresh Articles",col:"#c084fc"},{val:"100%",label:"Free Content",col:"#34d399"},{val:"2026",label:"Latest Year",col:"#fb923c"}].map((s,i)=>(
              <div key={i} style={{flex:"1 1 140px",minWidth:120,padding:"clamp(12px,2vw,18px)",borderRadius:18,background:"linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))",border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(16px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.col},transparent)`}}/>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.3rem,3vw,2rem)",background:`linear-gradient(135deg,#e0e7ff,${s.col})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{s.val}</div>
                <div style={{color:"rgba(199,210,254,0.55)",fontSize:"clamp(8px,1vw,10px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:5}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{textAlign:"center",marginTop:"clamp(32px,5vw,48px)",opacity:visible?1:0,animation:visible?"bl_fadeUp 0.7s ease both 0.8s":"none"}}>
            <button
              style={{padding:"13px clamp(28px,4vw,44px)",borderRadius:100,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.5vw,15px)",fontWeight:800,letterSpacing:"0.05em",color:"#fff",background:"linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",boxShadow:"0 8px 32px rgba(99,102,241,0.45)",transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",display:"inline-flex",alignItems:"center",gap:9}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 20px 56px rgba(99,102,241,0.6)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.45)";}}
            >
              Explore All Articles
            </button>
            <p style={{color:"rgba(165,180,252,0.4)",fontSize:11,marginTop:10,fontWeight:500}}>Updated monthly · No paywall</p>
          </div>
        </div>

        <div style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.25),transparent)",zIndex:5}}/>
      </section>
    </>
  );
};

export default Blog;