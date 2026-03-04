import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const PROJECTS = [
  {
    id: "conotex",
    title: "Conotex Integrated Services",
    subtitle: "IT & Low-Voltage Solutions",
    description: "Conotex Integrated Services (CIS), a division of Conotex Systems & Energy Services LLC, delivers nationwide low-voltage and managed IT solutions. Since 2011, CIS has partnered with top brands to design, deploy, and manage secure, reliable, and scalable digital infrastructure.",
    images: ["/conotex2.webp", "/conotex3.jpg", "/conotex1.png"],
    link: "https://www.conotextech.com/",
    accent: "#818cf8", gradFrom: "#6366f1", gradTo: "#4f46e5",
    tag: "IT Infrastructure", year: "2024", category: "Enterprise",
    tech: ["Next.js", "Node.js", "AWS", "PostgreSQL"],
    metrics: [{ val: "99.9%", label: "Uptime SLA" }, { val: "40%", label: "Cost Reduced" }, { val: "3×", label: "Faster Deploy" }],
    shape: "icosahedron",
  },
  {
    id: "vendo",
    title: "Vendo",
    subtitle: "Modern eCommerce Platform",
    description: "A modern, responsive eCommerce frontend engineered for a seamless shopping experience. Features dynamic product grids, category browsing, promotional banners, interactive product pages, intelligent search, smooth animations, and fully optimized responsive design.",
    images: ["/vendo1.jpg", "/vendo2.jpg", "/vendo3.jpg"],
    link: "https://my-ecommerce-nine-iota.vercel.app/",
    accent: "#34d399", gradFrom: "#10b981", gradTo: "#059669",
    tag: "eCommerce", year: "2024", category: "Product",
    tech: ["React", "Tailwind CSS", "Stripe", "Vercel"],
    metrics: [{ val: "3×", label: "Conversion" }, { val: "0.8s", label: "Load Time" }, { val: "98", label: "Lighthouse" }],
    shape: "torus",
  },
  {
    id: "weareiko",
    title: "WearEiko",
    subtitle: "African-Inspired Fashion Brand",
    description: "WearEiko blends African heritage with modern fashion, empowering self-expression through timeless, culturally-rooted designs. From bold Ankara prints to chic contemporary pieces, every garment tells a story of identity, creativity, and sustainability.",
    images: ["/wear2.jpg", "/wear1.jpg", "/wear3.jpg"],
    link: "https://weareiko.com",
    accent: "#f472b6", gradFrom: "#ec4899", gradTo: "#db2777",
    tag: "Fashion & Lifestyle", year: "2023", category: "Brand",
    tech: ["Shopify", "Custom Theme", "Klaviyo", "SEO"],
    metrics: [{ val: "5×", label: "ROI" }, { val: "200%", label: "Traffic Up" }, { val: "4.9★", label: "Rating" }],
    shape: "octahedron",
  },
];

const rgb = (h) => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(",");

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
      const W = mount.clientWidth || 260, H = mount.clientHeight || 200;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
      cam.position.z = 4.2;
      const col = parseInt(accent.replace("#","0x"));
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const pl1 = new THREE.PointLight(col, 8, 22); pl1.position.set(3,3,3); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xffffff, 2, 18); pl2.position.set(-2,-1.5,2); scene.add(pl2);
      const plRim = new THREE.PointLight(col, 3, 16); plRim.position.set(0,-2.5,-2); scene.add(plRim);
      const plBack = new THREE.PointLight(0xc084fc, 1.5, 14); plBack.position.set(-3,2,-1); scene.add(plBack);
    let geo;
    switch(shape) {
      case "torus":       geo = new THREE.TorusGeometry(0.78,0.30,22,90); break;
      case "octahedron":  geo = new THREE.OctahedronGeometry(1.0,0); break;
      case "tetrahedron": geo = new THREE.TetrahedronGeometry(1.05,0); break;
      default:            geo = new THREE.IcosahedronGeometry(0.95,1); break;
    }
    const mat = new THREE.MeshPhongMaterial({ color:col, emissive:col, emissiveIntensity:0.28, specular:0xffffff, shininess:200, transparent:true, opacity:0.92 });
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:col, wireframe:true, transparent:true, opacity:0.20 }));
    wire.scale.setScalar(1.05); scene.add(wire);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.45,24,24), new THREE.MeshPhongMaterial({ color:col, emissive:col, emissiveIntensity:1.0, transparent:true, opacity:0.30 }));
    scene.add(inner);
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.55,0.026,14,100), new THREE.MeshPhongMaterial({ color:col, emissive:col, emissiveIntensity:0.55, transparent:true, opacity:0.65 }));
    ringA.rotation.x = Math.PI/2.8; scene.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.9,0.016,12,80), new THREE.MeshPhongMaterial({ color:col, emissive:col, emissiveIntensity:0.35, transparent:true, opacity:0.42 }));
    ringB.rotation.x = Math.PI/5; ringB.rotation.z = Math.PI/6; scene.add(ringB);
    const sats = [{r:1.65,speed:0.55,yOff:0.3,phase:0},{r:1.80,speed:-0.38,yOff:-0.4,phase:2.1},{r:1.55,speed:0.72,yOff:0.6,phase:4.2}].map(d => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.07,14,14), new THREE.MeshPhongMaterial({ color:col, emissive:col, emissiveIntensity:0.9 }));
      s.userData = {...d, angle:d.phase}; scene.add(s); return s;
    });
    const pCount = 48, pPos = new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){const a=(i/pCount)*Math.PI*2,r=2.1+Math.random()*0.7;pPos[i*3]=Math.cos(a)*r;pPos[i*3+1]=(Math.random()-0.5)*1.4;pPos[i*3+2]=Math.sin(a)*r;}
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({color:col,size:0.055,transparent:true,opacity:0.72})); scene.add(pts);
    for(let i=0;i<4;i++){const ang=(i/4)*Math.PI*2,linePts=[];for(let j=0;j<=20;j++){const f=j/20;linePts.push(new THREE.Vector3(Math.cos(ang+f*Math.PI*0.8)*(1.2+f*0.6),(f-0.5)*2.8,Math.sin(ang+f*Math.PI*0.8)*(1.2+f*0.6)));}scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.13})));}
      const onResize=()=>{const nw=mount.clientWidth,nh=mount.clientHeight;renderer.setSize(nw,nh);cam.aspect=nw/nh;cam.updateProjectionMatrix();};
      window.addEventListener("resize",onResize);
      const _t0_clock = performance.now();
      const animate=()=>{
        animId=requestAnimationFrame(animate); const t=(performance.now() - _t0_clock) * 0.001; const a=activeRef.current; const spd=a?1.8:0.6;
        mesh.rotation.y=t*spd*0.52; mesh.rotation.x=Math.sin(t*0.32)*0.30;
        wire.rotation.y=mesh.rotation.y; wire.rotation.x=mesh.rotation.x;
        const ts=a?1.15:1.0; mesh.scale.lerp(new THREE.Vector3(ts,ts,ts),0.06); wire.scale.setScalar(mesh.scale.x*1.05);
        inner.scale.setScalar(1+Math.sin(t*1.9)*0.14);
        ringA.rotation.z=t*0.38; ringA.rotation.y=t*0.12;
        ringB.rotation.x=Math.PI/5+t*0.25; ringB.rotation.z=Math.PI/6+t*0.10;
        sats.forEach(s=>{s.userData.angle+=s.userData.speed*0.014;s.position.x=Math.cos(s.userData.angle)*s.userData.r;s.position.z=Math.sin(s.userData.angle)*s.userData.r;s.position.y=s.userData.yOff+Math.sin(t*1.1+s.userData.angle)*0.28;});
        pts.rotation.y=t*0.18;
        pl1.position.set(Math.sin(t*0.55)*3,Math.cos(t*0.38)*2.5,3);
        plRim.position.set(Math.cos(t*0.45)*-2.5,-2.5,Math.sin(t*0.62)*-2);
        renderer.render(scene,cam);
      };
      animate();
      doCleanup=()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",onResize);if(renderer){renderer.dispose();renderer=null;}};
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if(doCleanup){doCleanup();doCleanup=null;} }
    }, { threshold: 0.01, rootMargin: "150px" });
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.setSize(canvas.clientWidth,canvas.clientHeight); renderer.setClearColor(0,0);
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(55,canvas.clientWidth/canvas.clientHeight,0.1,200); cam.position.z=7;
    scene.add(new THREE.AmbientLight(0xffffff,0.18));
    const lights=[[0x818cf8,5,[5,4,5]],[0xc084fc,3.5,[-4,-3,3]],[0x67e8f9,2.5,[0,-4,2]],[0xf472b6,2,[4,-2,-3]],[0x34d399,1.5,[-3,3,-2]]].map(([c,i,p])=>{const l=new THREE.PointLight(c,i,32);l.position.set(...p);scene.add(l);return l;});
    const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.3,0.40,180,20,2,3),new THREE.MeshPhongMaterial({color:0x4f46e5,emissive:0x1e1b4b,specular:0xc7d2fe,shininess:180,transparent:true,opacity:0.80})); scene.add(knot);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(0.65,32,32),new THREE.MeshPhongMaterial({color:0x6366f1,emissive:0x6366f1,emissiveIntensity:1.0,transparent:true,opacity:0.32})); scene.add(glow);
    const rings=[{r:2.5,tube:0.034,col:0x818cf8,rx:Math.PI/2.3,rz:0.3,op:0.72},{r:3.1,tube:0.022,col:0xc084fc,rx:Math.PI/4,rz:Math.PI/5,op:0.55},{r:3.7,tube:0.016,col:0x67e8f9,rx:Math.PI/6.5,rz:-Math.PI/4,op:0.40}].map(d=>{const m=new THREE.Mesh(new THREE.TorusGeometry(d.r,d.tube,16,150),new THREE.MeshPhongMaterial({color:d.col,emissive:d.col,shininess:240,transparent:true,opacity:d.op}));m.rotation.x=d.rx;m.rotation.z=d.rz;scene.add(m);return m;});
    const shapes=[new THREE.IcosahedronGeometry(0.22,1),new THREE.OctahedronGeometry(0.25,0),new THREE.TorusGeometry(0.21,0.09,10,32),new THREE.TetrahedronGeometry(0.26,0),new THREE.DodecahedronGeometry(0.21,0),new THREE.SphereGeometry(0.20,16,16),new THREE.IcosahedronGeometry(0.19,0),new THREE.OctahedronGeometry(0.24,0),new THREE.TorusGeometry(0.19,0.08,8,26)].map((geo,i)=>{const cols=[0x818cf8,0xc084fc,0xf472b6,0x34d399,0xfb923c,0xa78bfa,0x67e8f9,0x7dd3fc,0xf59e0b];const m=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:cols[i],emissive:cols[i],emissiveIntensity:0.45,shininess:220}));m.userData={angle:(i/9)*Math.PI*2,radius:1.9+(i%3)*0.42,speed:(0.25+i*0.09)*(i%2?1:-1),yOff:Math.sin(i*1.1)*0.65};scene.add(m);return m;});
    const connLines=[[0,4],[1,6],[2,7]].map(([a,b])=>{const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x818cf8,transparent:true,opacity:0.09}));scene.add(line);return{line,a,b};});
    const pCount=280,pPos=new Float32Array(pCount*3),pCol=new Float32Array(pCount*3);const pal=[[0.49,0.49,0.97],[0.75,0.51,0.99],[0.40,0.91,0.98],[0.96,0.45,0.71],[0.20,0.83,0.60]];for(let i=0;i<pCount;i++){const r=4.2+Math.random()*2.4,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pPos[i*3]=r*Math.sin(p)*Math.cos(t);pPos[i*3+1]=r*Math.sin(p)*Math.sin(t);pPos[i*3+2]=r*Math.cos(p);const c=pal[i%5];pCol[i*3]=c[0];pCol[i*3+1]=c[1];pCol[i*3+2]=c[2];}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute("position",new THREE.BufferAttribute(pPos,3));pGeo.setAttribute("color",new THREE.BufferAttribute(pCol,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.042,transparent:true,opacity:0.78,vertexColors:true}));scene.add(particles);
    let mx=0,my=0;
    const onMove=e=>{const t=e.touches?e.touches[0]:e;mx=(t.clientX/window.innerWidth-.5)*2;my=-(t.clientY/window.innerHeight-.5)*2;};
    window.addEventListener("mousemove",onMove); window.addEventListener("touchmove",onMove,{passive:true});
    const onResize=()=>{renderer.setSize(canvas.clientWidth,canvas.clientHeight);cam.aspect=canvas.clientWidth/canvas.clientHeight;cam.updateProjectionMatrix();};
    window.addEventListener("resize",onResize);
    const _t0_clock = performance.now();
    const animate=()=>{
      animId=requestAnimationFrame(animate); const t=(performance.now() - _t0_clock) * 0.001;
      knot.rotation.x=t*0.17+my*0.22; knot.rotation.y=t*0.23+mx*0.22;
      glow.scale.setScalar(1+Math.sin(t*1.5)*0.12);
      rings[0].rotation.z=t*0.20; rings[1].rotation.x=Math.PI/4+t*0.15; rings[1].rotation.z=Math.PI/5+t*0.11; rings[2].rotation.y=t*0.12; rings[2].rotation.z=-Math.PI/4+t*0.08;
      shapes.forEach(m=>{m.userData.angle+=m.userData.speed*0.012;m.position.x=Math.cos(m.userData.angle)*m.userData.radius;m.position.z=Math.sin(m.userData.angle)*m.userData.radius;m.position.y=m.userData.yOff+Math.sin(t*0.9+m.userData.angle)*0.3;m.rotation.y=t*1.9;m.rotation.x=t*0.95;});
      connLines.forEach(({line,a,b})=>{const pa=shapes[a].position,pb=shapes[b].position;const arr=line.geometry.attributes.position.array;arr[0]=pa.x;arr[1]=pa.y;arr[2]=pa.z;arr[3]=pb.x;arr[4]=pb.y;arr[5]=pb.z;line.geometry.attributes.position.needsUpdate=true;});
      particles.rotation.y=t*0.026; particles.rotation.x=t*0.013;
      lights[0].position.set(Math.sin(t*0.4)*6,Math.cos(t*0.3)*5,5); lights[1].position.set(Math.cos(t*0.3)*-6,Math.sin(t*0.45)*-4,4);
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

/* ── SVG Background ── */
const BgAccents = () => (
  <div className="pj-float-deco" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
    <svg width="84" height="84" viewBox="0 0 120 120" style={{position:"absolute",top:"3%",left:"1.5%",animation:"pj_float1 9s ease-in-out infinite",filter:"drop-shadow(0 0 14px #818cf860)"}}>
      <defs><linearGradient id="pj_g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient><linearGradient id="pj_g2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient></defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#pj_g1)" opacity="0.52"/><polygon points="60,5 110,40 60,60" fill="url(#pj_g2)" opacity="0.38"/>
    </svg>
    <svg width="62" height="62" viewBox="0 0 100 100" style={{position:"absolute",top:"5%",right:"2.5%",animation:"pj_float2 11s ease-in-out infinite",filter:"drop-shadow(0 0 11px #f472b660)"}}>
      <defs><linearGradient id="pj_g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#pj_g3)" opacity="0.56"/>
    </svg>
    <svg width="68" height="68" viewBox="0 0 100 100" style={{position:"absolute",top:"46%",left:"0.5%",animation:"pj_spin 22s linear infinite",filter:"drop-shadow(0 0 10px #67e8f960)"}}>
      <defs><linearGradient id="pj_g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#pj_g4)" strokeWidth="7" opacity="0.58"/>
    </svg>
    <svg width="50" height="50" viewBox="0 0 80 80" style={{position:"absolute",bottom:"5%",right:"2%",animation:"pj_float1 8s ease-in-out infinite reverse",filter:"drop-shadow(0 0 9px #fbbf2460)"}}>
      <defs><linearGradient id="pj_g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="15,25 55,25 55,65 15,65" fill="url(#pj_g5)" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.52" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.48" stroke="#fbbf24" strokeWidth="1"/>
    </svg>
  </div>
);

/* ── Image Carousel ── */
const Carousel = ({ images, accent, title }) => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const aRgb = rgb(accent);
  const prev = useCallback(()=>{setLoaded(false);setIdx(i=>(i-1+images.length)%images.length);},[images.length]);
  const next = useCallback(()=>{setLoaded(false);setIdx(i=>(i+1)%images.length);},[images.length]);
  return (
    <div style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"rgba(5,7,20,0.7)"}}>
      <img src={images[idx]} alt={`${title} ${idx+1}`} loading="lazy" onLoad={()=>setLoaded(true)}
        style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.5s ease",display:"block"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(5,7,20,0.05) 0%,transparent 35%,rgba(5,7,20,0.55) 100%)",pointerEvents:"none"}}/>
      {images.length>1&&<>
        {[{side:"left",label:"‹",fn:prev},{side:"right",label:"›",fn:next}].map(({side,label,fn})=>(
          <button key={side} onClick={fn} aria-label={side} style={{position:"absolute",top:"50%",[side]:12,transform:"translateY(-50%)",zIndex:4,width:34,height:34,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",transition:"background 0.2s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${aRgb},0.7)`;}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,0.6)";}}
          >{label}</button>
        ))}
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",gap:6,alignItems:"center"}}>
          {images.map((_,i)=>(
            <button key={i} onClick={()=>{setLoaded(false);setIdx(i);}} aria-label={`img ${i+1}`}
              style={{height:5,borderRadius:3,width:i===idx?18:5,background:i===idx?accent:"rgba(255,255,255,0.35)",border:"none",cursor:"pointer",padding:0,outline:"none",boxShadow:i===idx?`0 0 8px ${accent}`:"none",transition:"all 0.3s ease"}}
            />
          ))}
        </div>
      </>}
    </div>
  );
};

/* ── Project Card ── */
const ProjectCard = ({ project, index, visible }) => {
  const [hov, setHov] = useState(false);
  const [tab, setTab] = useState("overview");
  const { title, subtitle, description, images, link, accent, gradFrom, gradTo, tag, year, tech, metrics, shape, category } = project;
  const aRgb = rgb(accent);
  return (
    <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} className="pj-card"
      style={{
        position:"relative",borderRadius:24,overflow:"hidden",display:"flex",flexDirection:"column",
        background:hov?`linear-gradient(150deg,rgba(${aRgb},0.12) 0%,rgba(${aRgb},0.05) 50%,rgba(255,255,255,0.025) 100%)`:"linear-gradient(150deg,rgba(255,255,255,0.055) 0%,rgba(255,255,255,0.018) 100%)",
        border:hov?`1px solid rgba(${aRgb},0.5)`:"1px solid rgba(255,255,255,0.08)",
        backdropFilter:"blur(22px)",
        boxShadow:hov?`0 16px 70px rgba(${aRgb},0.26),0 0 0 1px rgba(${aRgb},0.14),inset 0 1px 0 rgba(255,255,255,0.12)`:"0 4px 30px rgba(0,0,0,0.40),inset 0 1px 0 rgba(255,255,255,0.06)",
        transform:hov?"translateY(-10px) scale(1.012)":"translateY(0) scale(1)",
        transition:"all 0.45s cubic-bezier(0.23,1,0.32,1)",
        opacity:visible?1:0, animation:visible?`pj_fadeUp 0.7s ease both ${index*150}ms`:"none",
      }}
    >
      <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,zIndex:5,background:hov?`linear-gradient(90deg,transparent,${accent},rgba(${aRgb},0.7),transparent)`:`linear-gradient(90deg,transparent,rgba(${aRgb},0.3),transparent)`,transition:"all 0.4s ease"}}/>

      {/* Image + 3D split */}
      <div className="pj-card-top">
        <div className="pj-card-img" style={{position:"relative",overflow:"hidden"}}>
          <Carousel images={images} accent={accent} title={title}/>
          <div style={{position:"absolute",top:12,left:14,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:100,background:"rgba(5,7,20,0.78)",backdropFilter:"blur(12px)",border:`1px solid rgba(${aRgb},0.42)`}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:accent,boxShadow:`0 0 6px ${accent}`}}/>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#c7d2fe"}}>{tag}</span>
          </div>
          <div style={{position:"absolute",top:12,right:14,zIndex:6,padding:"4px 10px",borderRadius:100,background:"rgba(5,7,20,0.72)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(199,210,254,0.6)",fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em"}}>{year}</div>
          <div style={{position:"absolute",bottom:14,left:14,zIndex:6,padding:"4px 10px",borderRadius:100,background:`rgba(${aRgb},0.18)`,border:`1px solid rgba(${aRgb},0.35)`,color:accent,fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase"}}>{category}</div>
        </div>
        <div className="pj-card-3d" style={{position:"relative",background:`radial-gradient(ellipse at 50% 50%,rgba(${aRgb},0.14) 0%,rgba(5,7,20,0.6) 70%)`}}>
          <CardScene accent={accent} shape={shape} active={hov}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.025) 50%)",backgroundSize:"100% 4px",pointerEvents:"none",zIndex:2}}/>
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(10px)",border:`1px solid rgba(${aRgb},0.28)`,whiteSpace:"nowrap"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 7px #34d399",animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
            <span style={{color:"#a5b4fc",fontSize:8,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>Interactive 3D</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{padding:"clamp(16px,2.5vw,24px)",display:"flex",flexDirection:"column",gap:13}}>
        <div>
          <div style={{color:`rgba(${aRgb},0.8)`,fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>{subtitle}</div>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(15px,1.8vw,20px)",letterSpacing:"-0.015em",lineHeight:1.25,color:hov?"#e0e7ff":"#c7d2fe",margin:0,transition:"color 0.25s ease"}}>{title}</h3>
        </div>
        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,border:"1px solid rgba(255,255,255,0.07)"}}>
          {["overview","metrics","tech"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"6px 0",borderRadius:7,border:tab===t?`1px solid rgba(${aRgb},0.4)`:"1px solid transparent",background:tab===t?`rgba(${aRgb},0.15)`:"transparent",color:tab===t?accent:"rgba(165,180,252,0.5)",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"capitalize",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s ease",outline:"none"}}>{t}</button>
          ))}
        </div>
        <div style={{minHeight:68}}>
          {tab==="overview"&&<p style={{color:"rgba(199,210,254,0.58)",fontSize:"clamp(11.5px,1.3vw,13.5px)",lineHeight:1.78,margin:0,fontFamily:"'DM Sans',sans-serif",fontWeight:400}}>{description}</p>}
          {tab==="metrics"&&<div style={{display:"flex",gap:8}}>{metrics.map((m,i)=><div key={i} style={{flex:"1 1 0",padding:"10px 6px",borderRadius:12,background:`rgba(${aRgb},0.1)`,border:`1px solid rgba(${aRgb},0.22)`,textAlign:"center"}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(0.95rem,2vw,1.3rem)",background:`linear-gradient(135deg,#e0e7ff,${accent})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{m.val}</div><div style={{color:"rgba(199,210,254,0.5)",fontSize:8,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:3,fontFamily:"'DM Sans',sans-serif"}}>{m.label}</div></div>)}</div>}
          {tab==="tech"&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{tech.map(t=><span key={t} style={{padding:"5px 11px",borderRadius:100,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.11)",color:"rgba(199,210,254,0.7)",fontSize:10,fontWeight:600,letterSpacing:"0.05em",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}</div>}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Quality Score</span>
            <span style={{color:accent,fontSize:9,fontWeight:800,fontFamily:"'DM Sans',sans-serif"}}>98%</span>
          </div>
          <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",width:visible?"98%":"0%",borderRadius:2,background:`linear-gradient(90deg,${gradFrom},${gradTo})`,transition:"width 1.8s cubic-bezier(0.23,1,0.32,1) 0.5s",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)",animation:"pj_shimmer 2s ease-in-out infinite"}}/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid rgba(${aRgb},0.12)`,gap:10,flexWrap:"wrap"}}>
          <a href={link} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 20px",borderRadius:100,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.05em",color:"#fff",background:`linear-gradient(135deg,${gradFrom},${gradTo})`,boxShadow:`0 4px 18px rgba(${aRgb},0.38)`,transition:"all 0.3s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px) scale(1.04)";e.currentTarget.style.boxShadow=`0 8px 28px rgba(${aRgb},0.55)`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 18px rgba(${aRgb},0.38)`;}}
          >View Live ↗</a>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
            <span style={{color:"rgba(165,180,252,0.5)",fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Live</span>
          </div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:-30,right:-30,width:150,height:150,borderRadius:"50%",background:`radial-gradient(ellipse,rgba(${aRgb},0.22) 0%,transparent 70%)`,opacity:hov?1:0,transition:"opacity 0.4s ease",pointerEvents:"none",zIndex:0}}/>
    </article>
  );
};

/* ── Main Section ── */
const Projects = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);},{threshold:0.06,rootMargin:"40px"});
    if(sectionRef.current)obs.observe(sectionRef.current);
    return()=>obs.disconnect();
  },[]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes pj_fadeUp      {from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pj_fadeDown    {from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pj_float1      {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-14px) rotate(4deg)}66%{transform:translateY(-6px) rotate(-3deg)}}
        @keyframes pj_float2      {0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes pj_spin        {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pj_pulse       {0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
        @keyframes pj_gridMove    {from{transform:translateY(0)}to{transform:translateY(50px)}}
        @keyframes pj_badgePulse  {0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,.4)}50%{box-shadow:0 0 0 8px rgba(129,140,248,0)}}
        @keyframes pj_shimmer     {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}

        .pj-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(160deg,#050714 0%,#0a0a1f 35%,#080d1e 65%,#0d0620 100%);font-family:'DM Sans',sans-serif;padding:clamp(48px,9vw,110px) 0 clamp(56px,10vw,120px);}
        .pj-gridbg{position:absolute;inset:0;z-index:0;overflow:hidden;background-image:linear-gradient(rgba(129,140,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.04) 1px,transparent 1px);background-size:55px 55px;animation:pj_gridMove 10s linear infinite;}
        .pj-inner{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:0 clamp(12px,4vw,64px);}

        .pj-hero-banner{width:100%;height:clamp(140px,40vw,320px);border-radius:20px;overflow:hidden;position:relative;z-index:2;margin-bottom:clamp(24px,5vw,56px);border:1px solid rgba(129,140,248,0.15);box-shadow:0 0 80px rgba(99,102,241,0.12),inset 0 1px 0 rgba(255,255,255,0.06);}

        .pj-grid{display:grid;grid-template-columns:1fr;gap:clamp(12px,2vw,24px);}
        @media(min-width:700px){.pj-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:1100px){.pj-grid{grid-template-columns:repeat(3,1fr);}}

        .pj-card-top{display:flex;flex-direction:column;}
        .pj-card-img{width:100%;height:clamp(160px,44vw,240px);flex-shrink:0;}
        .pj-card-3d{width:100%;height:clamp(120px,32vw,200px);}

        @media(min-width:1100px){
          .pj-card-top{flex-direction:row;height:clamp(200px,22vw,240px);}
          .pj-card-img{width:58%;height:100%;}
          .pj-card-3d{width:42%;height:100%;}
        }

        /* Hide floating BgAccents on mobile */
        .pj-float-deco{display:none!important;}
        @media(min-width:640px){.pj-float-deco{display:block!important;}}
      `}</style>

      <section id="projects" ref={sectionRef} className="pj-section" aria-label="Featured Projects">
        <div className="pj-gridbg"/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.022,pointerEvents:"none"}}>
          <filter id="pj_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#pj_noise)"/>
        </svg>
        {[{top:"7%",left:"14%",w:"clamp(180px,44vw,580px)",h:"clamp(180px,44vw,580px)",c:"rgba(99,102,241,0.13)"},{bottom:"4%",right:"10%",w:"clamp(150px,35vw,460px)",h:"clamp(150px,35vw,460px)",c:"rgba(168,85,247,0.10)"},{top:"50%",right:"30%",w:"clamp(120px,26vw,340px)",h:"clamp(120px,26vw,340px)",c:"rgba(52,211,153,0.07)"}].map((g,i)=>(
          <div key={i} style={{position:"absolute",...(g.top?{top:g.top}:{bottom:g.bottom}),...(g.left?{left:g.left}:{right:g.right}),width:g.w,height:g.h,borderRadius:"50%",background:`radial-gradient(ellipse,${g.c} 0%,transparent 70%)`,pointerEvents:"none",zIndex:1}}/>
        ))}
        <BgAccents/>

        <div className="pj-inner">
          <header style={{textAlign:"center",marginBottom:"clamp(30px,5vw,50px)",opacity:visible?1:0,animation:visible?"pj_fadeDown 0.8s ease both 0.05s":"none"}}>
            <div style={{marginBottom:14}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"7px 16px",borderRadius:100,background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(168,85,247,0.12))",border:"1px solid rgba(129,140,248,0.3)",color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"pj_badgePulse 3s ease-in-out infinite"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 7px #818cf8"}}/>Our Work
              </span>
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.8rem,5vw,3.6rem)",letterSpacing:"-0.03em",lineHeight:1.08,color:"#fff",marginBottom:6}}>
              <span style={{display:"block"}}>Featured</span>
              <span style={{display:"block",background:"linear-gradient(135deg,#818cf8 0%,#a78bfa 35%,#c084fc 65%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 0 24px rgba(129,140,248,0.5))"}}>Projects</span>
            </h2>
            <p style={{color:"rgba(199,210,254,0.62)",fontSize:"clamp(13px,1.7vw,17px)",lineHeight:1.75,maxWidth:540,margin:"12px auto 0",fontWeight:400}}>Explore innovative digital experiences engineered for visionary clients worldwide.</p>
            <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.4),transparent)",maxWidth:340,margin:"20px auto 0"}}/>
          </header>

          <div className="pj-hero-banner" style={{opacity:visible?1:0,animation:visible?"pj_fadeUp 0.9s ease both 0.2s":"none"}}>
            {[{top:10,left:10,bt:"2px solid rgba(129,140,248,0.5)",bl:"2px solid rgba(129,140,248,0.5)"},{top:10,right:10,bt:"2px solid rgba(192,132,252,0.5)",br:"2px solid rgba(192,132,252,0.5)"},{bottom:10,left:10,bb:"2px solid rgba(103,232,249,0.5)",bl:"2px solid rgba(103,232,249,0.5)"},{bottom:10,right:10,bb:"2px solid rgba(244,114,182,0.5)",br:"2px solid rgba(244,114,182,0.5)"}].map((c,i)=>(
              <div key={i} style={{position:"absolute",zIndex:5,width:20,height:20,...(c.top!==undefined?{top:c.top}:{bottom:c.bottom}),...(c.left!==undefined?{left:c.left}:{right:c.right}),borderTop:c.bt,borderBottom:c.bb,borderLeft:c.bl,borderRight:c.br}}/>
            ))}
            <div style={{position:"absolute",top:14,left:16,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(129,140,248,0.25)"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"pj_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
              <span style={{color:"#a5b4fc",fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>Projects Universe</span>
            </div>
            <div style={{position:"absolute",bottom:14,right:16,zIndex:6,display:"flex",gap:8}}>
              {["IT","Commerce","Fashion"].map((t,i)=>(
                <span key={t} style={{padding:"3px 9px",borderRadius:100,background:"rgba(5,7,20,0.72)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:["#818cf8","#34d399","#f472b6"][i],fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t}</span>
              ))}
            </div>
            <HeroBanner/>
          </div>

          <div className="pj-grid">
            {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i} visible={visible}/>)}
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(10px,2vw,18px)",justifyContent:"center",margin:"clamp(36px,5vw,52px) auto 0",maxWidth:900,opacity:visible?1:0,animation:visible?"pj_fadeUp 0.7s ease both 0.65s":"none"}}>
            {[{val:"500+",label:"Projects Delivered",col:"#818cf8"},{val:"30+",label:"Countries Served",col:"#c084fc"},{val:"98%",label:"Client Satisfaction",col:"#34d399"},{val:"8+",label:"Years of Excellence",col:"#f472b6"}].map((s,i)=>(
              <div key={i} style={{flex:"1 1 140px",minWidth:120,padding:"clamp(12px,2vw,18px)",borderRadius:18,background:"linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))",border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(16px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.col},transparent)`}}/>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(1.3rem,3vw,2rem)",background:`linear-gradient(135deg,#e0e7ff,${s.col})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1}}>{s.val}</div>
                <div style={{color:"rgba(199,210,254,0.55)",fontSize:"clamp(8px,1vw,10px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:5}}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{textAlign:"center",marginTop:"clamp(32px,5vw,48px)",opacity:visible?1:0,animation:visible?"pj_fadeUp 0.7s ease both 0.8s":"none"}}>
            <button style={{padding:"13px clamp(28px,4vw,44px)",borderRadius:100,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.5vw,15px)",fontWeight:800,letterSpacing:"0.05em",color:"#fff",background:"linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",boxShadow:"0 8px 32px rgba(99,102,241,0.45)",transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",display:"inline-flex",alignItems:"center",gap:9}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 20px 56px rgba(99,102,241,0.6)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.45)";}}
              onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            >→ Start Your Project</button>
            <p style={{color:"rgba(165,180,252,0.4)",fontSize:11,marginTop:10,fontWeight:500}}>500+ projects delivered · Free consultation</p>
          </div>
        </div>

        <div style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.25),transparent)",zIndex:5}}/>
      </section>
    </>
  );
};

export default Projects;