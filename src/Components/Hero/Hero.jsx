import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

/* ════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════ */
const STATS = [
  { id:"projects", label:"Projects Done",       value:"500+",  icon:"◈", color:"#818cf8" },
  { id:"clients",  label:"Client Satisfaction", value:"99.8%", icon:"◉", color:"#c084fc" },
  { id:"team",     label:"Skilled Team",         value:"45+",   icon:"◎", color:"#67e8f9" },
  { id:"support",  label:"Support",              value:"24/7",  icon:"◐", color:"#f472b6" },
];
const TYPEWRITER_WORDS = ["Innovate.", "Transform.", "Grow.", "Succeed.", "Dominate."];
const TECH_TAGS        = ["React", "Node.js", "AI / ML", "Cloud", "Web3", "Mobile"];
const SKILL_BARS       = [
  { l:"UI/UX Design",   p:96, c:"#818cf8" },
  { l:"Full-Stack Dev", p:92, c:"#c084fc" },
  { l:"Cloud & DevOps", p:88, c:"#67e8f9" },
];
const AVATAR_COLORS = [
  ["#6366f1","#312e81"],["#8b5cf6","#4c1d95"],
  ["#a855f7","#581c87"],["#c084fc","#6b21a8"],["#818cf8","#3730a3"],
];

/* ════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════ */
const useTypewriter = (words, speed = 85, pause = 2000) => {
  const [state, setState] = useState({ displayed:"", wordIdx:0, charIdx:0, deleting:false });
  useEffect(() => {
    const { wordIdx, charIdx, deleting } = state;
    const current = words[wordIdx];
    let ms = deleting ? speed / 2 : speed;
    let next;
    if (!deleting && charIdx < current.length)
      next = { ...state, charIdx: charIdx + 1, displayed: current.slice(0, charIdx + 1) };
    else if (!deleting && charIdx === current.length) {
      ms = pause;
      next = { ...state, deleting: true };
    } else if (deleting && charIdx > 0)
      next = { ...state, charIdx: charIdx - 1, displayed: current.slice(0, charIdx - 1) };
    else
      next = { displayed:"", wordIdx:(wordIdx+1)%words.length, charIdx:0, deleting:false };
    const t = setTimeout(() => setState(next), ms);
    return () => clearTimeout(t);
  }, [state, words, speed, pause]);
  return state.displayed;
};

const useCounter = (target, duration = 2000) => {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const num  = parseFloat(target.replace(/[^0-9.]/g, ""));
    const step = num / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);
  const suffix  = target.replace(/[0-9.]/g, "");
  const isFloat = target.includes(".");
  return {
    ref,
    display: (count >= 1 ? (isFloat ? count.toFixed(1) : Math.floor(count).toString()) : "0") + suffix,
  };
};

const useScrolled = (threshold = 60) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
};

/* ════════════════════════════════════════════
   ORBITAL RINGS SVG
════════════════════════════════════════════ */
const OrbitalRings = () => (
  <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"
    style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:0.13 }}>
    <defs>
      {[["r1","#818cf8"],["r2","#c084fc"],["r3","#67e8f9"]].map(([id,col]) => (
        <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={col} stopOpacity="0"/>
          <stop offset="50%"  stopColor={col} stopOpacity="1"/>
          <stop offset="100%" stopColor={col} stopOpacity="0"/>
        </linearGradient>
      ))}
    </defs>
    <ellipse cx="300" cy="300" rx="240" ry="90" fill="none" stroke="url(#r1)" strokeWidth="1.5">
      <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="12s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="300" cy="300" rx="190" ry="70" fill="none" stroke="url(#r2)" strokeWidth="1" transform="rotate(60 300 300)">
      <animateTransform attributeName="transform" type="rotate" from="60 300 300" to="420 300 300" dur="9s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="300" cy="300" rx="280" ry="110" fill="none" stroke="url(#r3)" strokeWidth="0.8" transform="rotate(-30 300 300)">
      <animateTransform attributeName="transform" type="rotate" from="-30 300 300" to="330 300 300" dur="16s" repeatCount="indefinite"/>
    </ellipse>
  </svg>
);

/* ════════════════════════════════════════════
   FLOATING SHAPES — hidden on mobile via CSS
════════════════════════════════════════════ */
const FloatingShapes = () => (
  <div className="hr-shapes" aria-hidden="true" style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2 }}>
    <svg width="90" height="90" viewBox="0 0 120 120" style={{ position:"absolute",top:"8%",left:"3%",animation:"hr_float1 7s ease-in-out infinite",filter:"drop-shadow(0 0 18px #818cf880)" }}>
      <defs>
        <linearGradient id="hrc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
        <linearGradient id="hrc2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
      </defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#hrc1)" opacity="0.85"/>
      <polygon points="60,5 110,40 60,60" fill="url(#hrc2)" opacity="0.6"/>
      <polygon points="60,115 10,80 60,60" fill="#4338ca" opacity="0.35"/>
    </svg>
    <svg width="70" height="70" viewBox="0 0 90 90" style={{ position:"absolute",top:"10%",right:"5%",animation:"hr_float2 9s ease-in-out infinite",filter:"drop-shadow(0 0 16px #c084fc80)" }}>
      <defs><radialGradient id="hrsp" cx="35%" cy="30%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="50%" stopColor="#a855f7"/><stop offset="100%" stopColor="#3b0764"/></radialGradient></defs>
      <circle cx="45" cy="45" r="40" fill="url(#hrsp)" opacity="0.9"/>
      <ellipse cx="37" cy="33" rx="10" ry="6" fill="white" opacity="0.1" transform="rotate(-25 37 33)"/>
    </svg>
    <svg width="75" height="75" viewBox="0 0 100 100" style={{ position:"absolute",top:"44%",left:"1%",animation:"hr_spin 14s linear infinite",filter:"drop-shadow(0 0 12px #67e8f980)" }}>
      <defs><linearGradient id="hrtor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#hrtor)" strokeWidth="9" opacity="0.85"/>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#cffafe" strokeWidth="1.5" opacity="0.25"/>
    </svg>
    <svg width="72" height="72" viewBox="0 0 100 100" style={{ position:"absolute",bottom:"9%",right:"4%",animation:"hr_float1 11s ease-in-out infinite reverse",filter:"drop-shadow(0 0 14px #f472b680)" }}>
      <defs><linearGradient id="hrdi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#hrdi)" opacity="0.85"/>
      <polygon points="50,5 95,50 50,50" fill="#fce7f3" opacity="0.18"/>
    </svg>
    <svg width="56" height="56" viewBox="0 0 80 80" style={{ position:"absolute",bottom:"24%",left:"2%",animation:"hr_float2 10s ease-in-out infinite",filter:"drop-shadow(0 0 10px #fbbf2460)" }}>
      <defs><linearGradient id="hrcub" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="15,25 55,25 55,65 15,65" fill="url(#hrcub)" opacity="0.55" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.6" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
    </svg>
  </div>
);

/* ════════════════════════════════════════════
   THREE.JS CANVAS
════════════════════════════════════════════ */
const ThreeCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer = null, animId = null, cleanup = null;

    const init = () => {
      if (renderer) return;
      const W = canvas.clientWidth || 400;
      const H = canvas.clientHeight || 400;

      renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
      cam.position.z = 5;

      /* Lights */
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const pl1 = new THREE.PointLight(0x818cf8, 3.5, 22); pl1.position.set(3,3,3);   scene.add(pl1);
      const pl2 = new THREE.PointLight(0xc084fc, 2.5, 22); pl2.position.set(-3,-2,2); scene.add(pl2);
      const pl3 = new THREE.PointLight(0x67e8f9, 2,   20); pl3.position.set(0,-3,1);  scene.add(pl3);
      const pl4 = new THREE.PointLight(0xf472b6, 1.5, 18); pl4.position.set(-2,3,-2); scene.add(pl4);

      /* Core icosahedron + wireframe */
      const geo     = new THREE.IcosahedronGeometry(1.1, 1);
      const origPos = new Float32Array(geo.attributes.position.array);
      const tmpPos  = new Float32Array(origPos.length);

      const coreMat = new THREE.MeshPhongMaterial({ color:0x4f46e5, emissive:0x1e1b4b, specular:0xc7d2fe, shininess:130, transparent:true, opacity:0.92 });
      const ico     = new THREE.Mesh(geo, coreMat); scene.add(ico);
      const wire    = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:0x818cf8, wireframe:true, transparent:true, opacity:0.28 }));
      wire.scale.setScalar(1.015); scene.add(wire);

      /* Inner glow sphere */
      const innerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 32, 32),
        new THREE.MeshPhongMaterial({ color:0x6366f1, emissive:0x6366f1, emissiveIntensity:0.85, transparent:true, opacity:0.38 })
      );
      scene.add(innerGlow);

      /* Orbital rings */
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.042, 16, 120),
        new THREE.MeshPhongMaterial({ color:0x818cf8, emissive:0x312e81, shininess:220, transparent:true, opacity:0.82 })
      );
      ring1.rotation.x = Math.PI/2.5; scene.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.3, 0.026, 12, 100),
        new THREE.MeshPhongMaterial({ color:0xc084fc, emissive:0x581c87, shininess:170, transparent:true, opacity:0.58 })
      );
      ring2.rotation.x = Math.PI/4; ring2.rotation.z = Math.PI/6; scene.add(ring2);

      const ring3 = new THREE.Mesh(
        new THREE.TorusGeometry(2.7, 0.018, 10, 90),
        new THREE.MeshPhongMaterial({ color:0x67e8f9, emissive:0x0e7490, shininess:150, transparent:true, opacity:0.38 })
      );
      ring3.rotation.x = Math.PI/5; ring3.rotation.z = -Math.PI/4; scene.add(ring3);

      /* Particles — vertex colored */
      const pCount  = 200;
      const pPos    = new Float32Array(pCount * 3);
      const pColors = new Float32Array(pCount * 3);
      const pal     = [[0.49,0.49,0.97],[0.75,0.51,0.99],[0.40,0.91,0.98],[0.96,0.45,0.71],[0.20,0.83,0.60]];
      for (let i = 0; i < pCount; i++) {
        const r = 2.5 + Math.random()*1.6;
        const t = Math.random()*Math.PI*2;
        const p = Math.acos(2*Math.random()-1);
        pPos[i*3]   = r*Math.sin(p)*Math.cos(t);
        pPos[i*3+1] = r*Math.sin(p)*Math.sin(t);
        pPos[i*3+2] = r*Math.cos(p);
        const c = pal[i % pal.length];
        pColors[i*3] = c[0]; pColors[i*3+1] = c[1]; pColors[i*3+2] = c[2];
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos,   3));
      pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
      const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:0.048, transparent:true, opacity:0.88, vertexColors:true }));
      scene.add(pts);

      /* Orbiting satellites */
      const satData = [
        { col:0x818cf8, r:1.75, speed: 0.42, yOff: 0.45, phase:0    },
        { col:0xc084fc, r:2.1,  speed:-0.35, yOff:-0.55, phase:1.57 },
        { col:0x67e8f9, r:1.55, speed: 0.62, yOff: 0.8,  phase:3.14 },
        { col:0xf472b6, r:2.4,  speed:-0.25, yOff:-0.3,  phase:4.71 },
      ];
      const sats = satData.map(d => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 14, 14),
          new THREE.MeshPhongMaterial({ color:d.col, emissive:d.col, emissiveIntensity:0.55, shininess:220 })
        );
        m.userData = { ...d, angle:d.phase };
        /* Glow trail */
        m.add(new THREE.Mesh(
          new THREE.TorusGeometry(0.2, 0.01, 6, 32),
          new THREE.MeshBasicMaterial({ color:d.col, transparent:true, opacity:0.38 })
        ));
        scene.add(m);
        return m;
      });

      /* Energy field lines */
      const fieldLines = [];
      const lineColors = [0x818cf8, 0xc084fc, 0x67e8f9, 0xf472b6, 0x34d399];
      for (let i = 0; i < 5; i++) {
        const pts2 = [];
        const angle = (i/5)*Math.PI*2;
        for (let j = 0; j <= 24; j++) {
          const frac = j/24;
          pts2.push(new THREE.Vector3(
            Math.cos(angle + frac*Math.PI) * (1.6 + frac*0.9),
            (frac - 0.5)*4,
            Math.sin(angle + frac*Math.PI) * (1.6 + frac*0.9)
          ));
        }
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts2),
          new THREE.LineBasicMaterial({ color:lineColors[i], transparent:true, opacity:0.14 })
        );
        scene.add(line);
        fieldLines.push(line);
      }

      /* Mouse / touch */
      let mx = 0, my = 0, targetMx = 0, targetMy = 0;
      const onMouse = e => {
        targetMx = (e.clientX/window.innerWidth  - 0.5)*2;
        targetMy = -(e.clientY/window.innerHeight - 0.5)*2;
      };
      const onTouch = e => {
        if (!e.touches[0]) return;
        targetMx = (e.touches[0].clientX/window.innerWidth  - 0.5)*2;
        targetMy = -(e.touches[0].clientY/window.innerHeight - 0.5)*2;
      };
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("touchmove", onTouch, { passive:true });

      const onResize = () => {
        if (!canvas || !renderer) return;
        const nw = canvas.clientWidth, nh = canvas.clientHeight;
        renderer.setSize(nw, nh);
        cam.aspect = nw/nh;
        cam.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      /* Animate */
      const t0 = performance.now();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now()-t0)*0.001;

        mx += (targetMx-mx)*0.055;
        my += (targetMy-my)*0.055;

        /* Morph from cached baseline */
        for (let i = 0; i < origPos.length; i += 3) {
          const ox=origPos[i], oy=origPos[i+1], oz=origPos[i+2];
          const len   = Math.sqrt(ox*ox + oy*oy + oz*oz);
          const wave  = Math.sin(t*1.5 + ox*2.2 + oy*1.8)*0.065;
          const scale = (1.1 + wave)/len;
          tmpPos[i]=ox*scale; tmpPos[i+1]=oy*scale; tmpPos[i+2]=oz*scale;
        }
        geo.attributes.position.array.set(tmpPos);
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();

        ico.rotation.x  = t*0.18 + my*0.3;
        ico.rotation.y  = t*0.25 + mx*0.3;
        wire.rotation.x = ico.rotation.x;
        wire.rotation.y = ico.rotation.y;

        ring1.rotation.z  = t*0.2;
        ring2.rotation.x  = Math.PI/4 + t*0.15;
        ring2.rotation.z  = Math.PI/6 + t*0.1;
        ring3.rotation.y  = t*0.12;
        ring3.rotation.z  = -Math.PI/4 + t*0.08;

        pts.rotation.y = t*0.042;
        pts.rotation.x = t*0.018;

        innerGlow.scale.setScalar(1 + Math.sin(t*1.9)*0.14);

        sats.forEach(s => {
          s.userData.angle += s.userData.speed * 0.013;
          s.position.x = Math.cos(s.userData.angle)*s.userData.r;
          s.position.z = Math.sin(s.userData.angle)*s.userData.r;
          s.position.y = s.userData.yOff + Math.sin(t*1.2 + s.userData.angle)*0.3;
          s.rotation.y = t*2;
        });

        fieldLines.forEach((l,i) => { l.rotation.y = t*(0.05 + i*0.01); });

        pl1.position.set(Math.sin(t*0.5)*4,  Math.cos(t*0.4)*3,  3);
        pl4.position.set(Math.cos(t*0.38)*-3, Math.sin(t*0.28)*4, -2);

        renderer.render(scene, cam);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("touchmove", onTouch);
        window.removeEventListener("resize", onResize);
        renderer?.dispose();
        renderer = null;
      };
    };

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) init(); else if (cleanup) { cleanup(); cleanup = null; } },
      { threshold:0.01 }
    );
    obs.observe(canvas);
    return () => { obs.disconnect(); cleanup?.(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }}/>;
};

/* ════════════════════════════════════════════
   FLOATING NOTIFICATION — desktop only
════════════════════════════════════════════ */
const FloatingNotif = ({ text, sub, color, delay = 0 }) => (
  <div className="hr-notif" style={{
    backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
    background:"linear-gradient(135deg,rgba(8,8,30,0.94),rgba(18,8,44,0.9))",
    border:`1px solid ${color}45`, borderRadius:14, padding:"10px 14px",
    display:"flex", alignItems:"center", gap:10,
    boxShadow:`0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)`,
    animation:`hr_floatNotif 6s ease-in-out infinite ${delay}ms`,
    pointerEvents:"none",
  }}>
    <div style={{ width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 10px ${color}`,flexShrink:0,animation:"hr_pulse 2s ease-in-out infinite" }}/>
    <div>
      <div style={{ color:"#e0e7ff",fontSize:11,fontWeight:700,lineHeight:1.25,whiteSpace:"nowrap" }}>{text}</div>
      <div style={{ color:"rgba(165,180,252,0.55)",fontSize:9.5,marginTop:2 }}>{sub}</div>
    </div>
  </div>
);

/* ════════════════════════════════════════════
   LIVE METRICS
════════════════════════════════════════════ */
const LiveMetrics = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x+1), 2200);
    return () => clearInterval(t);
  }, []);
  const metrics = useMemo(() => [
    { l:"Uptime", v:"99.99%",                                    c:"#34d399" },
    { l:"Load",   v:`${(1.2+Math.sin(tick)*0.4).toFixed(1)}s`,   c:"#818cf8" },
    { l:"Online", v:`${(1240+(tick*17)%300).toLocaleString()}`,   c:"#f472b6" },
  ], [tick]);
  return (
    <div style={{ display:"flex", gap:"clamp(8px,1.8vw,22px)", flexWrap:"wrap" }}>
      {metrics.map(m => (
        <div key={m.l} style={{ display:"flex",alignItems:"center",gap:5 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:m.c,boxShadow:`0 0 7px ${m.c}`,flexShrink:0 }}/>
          <span style={{ color:"rgba(165,180,252,0.45)",fontSize:10,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase" }}>{m.l}</span>
          <span style={{ color:m.c,fontSize:11,fontWeight:800,fontVariantNumeric:"tabular-nums" }}>{m.v}</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════
   STAT CARD
════════════════════════════════════════════ */
const StatCard = ({ stat, index }) => {
  const [hov, setHov] = useState(false);
  const { ref, display } = useCounter(stat.value);
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animation:`hr_fadeUp 0.65s ease both ${0.5+index*0.1}s`,
        background: hov
          ? `linear-gradient(135deg,${stat.color}25,${stat.color}0c)`
          : "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))",
        border: hov ? `1px solid ${stat.color}72` : "1px solid rgba(255,255,255,0.1)",
        transform: hov ? "translateY(-6px) scale(1.04)" : "none",
        transition:"all 0.35s cubic-bezier(0.23,1,0.32,1)",
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderRadius:16, padding:"clamp(10px,2.2vw,22px) clamp(8px,1.5vw,14px)",
        textAlign:"center", position:"relative", overflow:"hidden", cursor:"default",
      }}>
      {/* Top shimmer */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${stat.color}70,transparent)` }}/>
      {/* Corner glow */}
      <div style={{ position:"absolute",top:0,right:0,width:38,height:38,background:`radial-gradient(circle at top right,${stat.color}40,transparent 70%)`,borderRadius:"0 16px 0 0" }}/>
      {hov && <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${stat.color}12,transparent 70%)` }}/>}
      <div style={{ fontSize:"clamp(15px,2.2vw,22px)",color:stat.color,marginBottom:5,position:"relative" }}>{stat.icon}</div>
      <div style={{ fontSize:"clamp(1.05rem,2.8vw,2rem)",fontFamily:"'Syne',sans-serif",fontWeight:900,lineHeight:1,marginBottom:5,background:`linear-gradient(135deg,#e0e7ff,${stat.color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",position:"relative" }}>
        {display}
      </div>
      <div style={{ color:"rgba(199,210,254,0.65)",fontSize:"clamp(8px,1vw,11px)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",lineHeight:1.35,position:"relative" }}>
        {stat.label}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   CTA BUTTON
════════════════════════════════════════════ */
const CTAButton = ({ label, href, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", overflow:"hidden",
        padding:"11px clamp(18px,3vw,32px)",
        borderRadius:100, fontWeight:800,
        fontSize:"clamp(12px,1.4vw,15px)", letterSpacing:"0.05em",
        cursor:"pointer",
        transform: hov ? "translateY(-3px) scale(1.04)" : "none",
        transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)", outline:"none",
        fontFamily:"'DM Sans',sans-serif",
        ...(primary ? {
          background: hov
            ? "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)"
            : "linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",
          border:"none", color:"#fff",
          boxShadow: hov
            ? "0 20px 60px rgba(99,102,241,0.65)"
            : "0 8px 30px rgba(99,102,241,0.42)",
        } : {
          background: hov ? "rgba(129,140,248,0.12)" : "transparent",
          border:"1.5px solid rgba(129,140,248,0.5)", color:"#c7d2fe",
          boxShadow: hov ? "0 8px 30px rgba(99,102,241,0.25)" : "none",
        }),
      }}
    >
      {hov && primary && (
        <span style={{ position:"absolute",top:0,left:0,bottom:0,width:"40%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",animation:"hr_shimmerBtn 0.7s ease forwards",pointerEvents:"none" }}/>
      )}
      {primary && <span style={{ marginRight:7,animation:"hr_arrowPulse 2s ease-in-out infinite",display:"inline-block" }}>→</span>}
      {label}
    </button>
  );
};

/* ════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════ */
const Hero = () => {
  const handleNav = useCallback(href => {
    document.getElementById(href.replace("#",""))?.scrollIntoView({ behavior:"smooth" });
  }, []);

  const typedWord = useTypewriter(TYPEWRITER_WORDS, 82, 2000);
  const scrolled  = useScrolled(80);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.4 }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes hr_float1      { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-15px) rotate(3deg)} 66%{transform:translateY(-7px) rotate(-2deg)} }
        @keyframes hr_float2      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-19px) rotate(-4deg)} }
        @keyframes hr_floatNotif  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes hr_spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hr_pulse       { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.15);opacity:1} }
        @keyframes hr_fadeUp      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hr_fadeDown    { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hr_badgePulse  { 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,0.4)} 50%{box-shadow:0 0 0 8px rgba(129,140,248,0)} }
        @keyframes hr_arrowPulse  { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes hr_gridMove    { from{transform:translateY(0)} to{transform:translateY(60px)} }
        @keyframes hr_scrollDot   { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(12px);opacity:0.3} }
        @keyframes hr_gradient    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes hr_cursor      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hr_shimmerBar  { 0%{transform:translateX(-100%)} 100%{transform:translateX(220%)} }
        @keyframes hr_shimmerBtn  { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(300%) skewX(-12deg)} }
        @keyframes hr_borderRot   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hr_glow        { 0%,100%{box-shadow:0 0 22px rgba(99,102,241,0.18)} 50%{box-shadow:0 0 44px rgba(168,85,247,0.42)} }
        @keyframes hr_scanDown    { 0%{transform:translateY(-100%)} 100%{transform:translateY(800px)} }
        @keyframes hr_countUp     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hr_tagIn       { from{opacity:0;transform:translateY(10px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* ── Section ── */
        .hr-section {
          position:relative; width:100%; min-height:100svh; overflow:hidden;
          background:linear-gradient(135deg,#050714 0%,#0a0a1f 30%,#0d0620 60%,#080d1e 100%);
          font-family:'DM Sans',sans-serif;
        }

        /* ── Scanline overlay ── */
        .hr-scanline {
          position:absolute; inset:0; pointer-events:none; z-index:3;
          background:linear-gradient(transparent 50%,rgba(0,0,0,0.017) 50%);
          background-size:100% 3px;
        }

        /* ── Main grid: mobile-first, canvas on top ── */
        .hr-grid {
          position:relative; z-index:10;
          display:grid;
          grid-template-columns:1fr;
          gap:14px;
          width:100%; max-width:1440px; margin:0 auto;
          padding:clamp(68px,14vw,88px) clamp(14px,4vw,28px) clamp(44px,8vw,60px);
          align-items:start;
        }

        .hr-canvas-wrap {
          grid-row:1; position:relative;
          width:100%;
          height:clamp(196px,57vw,310px);
        }
        .hr-canvas-card {
          width:100%; height:100%;
          border-radius:22px; overflow:hidden;
          border:1px solid rgba(129,140,248,0.18);
          position:relative;
          animation:hr_glow 4s ease-in-out infinite;
        }

        .hr-text  { grid-row:2; display:flex; flex-direction:column; gap:13px; min-width:0; }
        .hr-stats { grid-row:3; display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }

        /* ── Headline ── */
        .hr-hl {
          font-family:'Syne',sans-serif; font-weight:900;
          line-height:1.07; letter-spacing:-0.025em; color:#fff; margin:0;
          font-size:clamp(1.6rem,7.2vw,2.15rem);
        }
        .hr-hl .l2 {
          display:block;
          background:linear-gradient(135deg,#818cf8 0%,#a78bfa 35%,#c084fc 65%,#f472b6 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:hr_gradient 4s ease infinite;
          filter:drop-shadow(0 0 22px rgba(129,140,248,0.52));
        }

        /* ── Tech tag ── */
        .hr-tag {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 11px; border-radius:100px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(129,140,248,0.22);
          color:rgba(199,210,254,0.68); font-size:11px; font-weight:600;
          transition:all 0.28s cubic-bezier(0.23,1,0.32,1); cursor:default; white-space:nowrap;
        }
        .hr-tag::before { content:''; width:5px; height:5px; border-radius:50%; background:#818cf8; opacity:0.7; flex-shrink:0; }
        .hr-tag:hover { background:rgba(99,102,241,0.18); border-color:rgba(129,140,248,0.55); color:#c7d2fe; transform:translateY(-2px) scale(1.04); }

        /* ── Skill bar shimmer ── */
        .hr-skillbar-inner { position:relative; overflow:hidden; }
        .hr-skillbar-inner::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent);
          animation:hr_shimmerBar 2.2s ease-in-out infinite;
        }

        /* ── Decorative: hidden <768px ── */
        .hr-shapes  { display:none !important; }
        .hr-notif   { display:none !important; }
        .hr-skills  { display:none !important; }
        .hr-float-notifs { display:none !important; }

        /* ── 380px ── */
        @media (max-width:380px) {
          .hr-grid { padding:62px 12px 36px; gap:10px; }
          .hr-canvas-wrap { height:clamp(168px,56vw,210px); }
          .hr-hl { font-size:1.48rem; }
          .hr-stats { gap:6px; }
        }

        /* ── 480px ── */
        @media (min-width:480px) {
          .hr-canvas-wrap { height:clamp(230px,52vw,290px); }
          .hr-hl { font-size:clamp(1.75rem,6.5vw,2.1rem); }
        }

        /* ── 600px ── */
        @media (min-width:600px) {
          .hr-grid { padding:80px clamp(20px,4vw,40px) 52px; gap:18px; }
          .hr-canvas-wrap { height:clamp(270px,48vw,330px); }
          .hr-hl { font-size:clamp(1.85rem,5.8vw,2.3rem); }
        }

        /* ── 768px: 2-col, canvas right ── */
        @media (min-width:768px) {
          .hr-grid {
            grid-template-columns:1fr 1fr;
            grid-template-rows:auto auto;
            gap:22px clamp(22px,3.5vw,44px);
            padding:96px clamp(24px,5vw,60px) 64px;
            align-items:center;
          }
          .hr-canvas-wrap { grid-column:2; grid-row:1; height:clamp(290px,38vw,460px); animation:hr_fadeUp 0.9s ease both 0.25s; }
          .hr-text  { grid-column:1; grid-row:1; gap:clamp(13px,1.8vw,20px); }
          .hr-stats { grid-column:1/-1; grid-row:2; grid-template-columns:repeat(4,1fr); gap:clamp(8px,1.2vw,16px); }
          .hr-hl { font-size:clamp(1.75rem,2.7vw,2.8rem); }
          .hr-shapes       { display:block !important; }
          .hr-notif        { display:flex !important; }
          .hr-skills       { display:block !important; }
          .hr-float-notifs { display:contents !important; }
        }

        /* ── 1024px ── */
        @media (min-width:1024px) {
          .hr-grid { gap:30px 54px; padding:108px clamp(32px,5.5vw,84px) 68px; }
          .hr-canvas-wrap { height:clamp(350px,40vw,540px); }
          .hr-hl { font-size:clamp(2.1rem,2.9vw,3.15rem); white-space:nowrap; }
          .hr-stats { gap:clamp(10px,1.5vw,20px); }
        }

        /* ── 1280px ── */
        @media (min-width:1280px) {
          .hr-hl { font-size:3.15rem; }
          .hr-canvas-wrap { height:clamp(420px,43vw,580px); }
        }
      `}</style>

      <section className="hr-section" id="home" aria-label="IsiTech Innovations Hero">

        {/* Animated grid */}
        <div aria-hidden="true" style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",backgroundImage:`linear-gradient(rgba(129,140,248,0.048) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.048) 1px,transparent 1px)`,backgroundSize:"60px 60px",animation:"hr_gridMove 8s linear infinite" }}/>

        {/* Scanline */}
        <div className="hr-scanline" aria-hidden="true"/>

        {/* Noise texture */}
        <svg aria-hidden="true" style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.024,pointerEvents:"none" }}>
          <filter id="hr_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#hr_noise)"/>
        </svg>

        {/* Radial glows */}
        <div aria-hidden="true" style={{ position:"absolute",top:"18%",left:"28%",width:"min(700px,55vw)",height:"min(700px,55vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.16) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",bottom:"8%",right:"18%",width:"min(500px,40vw)",height:"min(500px,40vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.13) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",top:"55%",left:"5%",width:"min(420px,32vw)",height:"min(420px,32vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(103,232,249,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>

        {/* Orbital rings */}
        <div aria-hidden="true" style={{ position:"absolute",inset:0,zIndex:2 }}><OrbitalRings/></div>

        {/* Floating shapes */}
        <FloatingShapes/>

        {/* ════ MAIN GRID ════ */}
        <div className="hr-grid">

          {/* ── 3D Canvas column ── */}
          <div className="hr-canvas-wrap">
            {/* Rotating conic border */}
            <div aria-hidden="true" style={{ position:"absolute",inset:-2,borderRadius:24,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
              <div style={{ position:"absolute",inset:-2,borderRadius:26,background:"conic-gradient(from 0deg,transparent 0%,#818cf830 20%,#c084fc55 40%,#67e8f930 60%,transparent 80%)",animation:"hr_borderRot 9s linear infinite" }}/>
            </div>

            <div className="hr-canvas-card" style={{ zIndex:1 }}>
              {/* Inner ambient glow */}
              <div aria-hidden="true" style={{ position:"absolute",inset:"10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.3) 0%,rgba(168,85,247,0.12) 40%,transparent 70%)",filter:"blur(28px)",zIndex:0 }}/>

              {/* Scan line effect */}
              <div aria-hidden="true" style={{ position:"absolute",inset:0,zIndex:4,overflow:"hidden",pointerEvents:"none",borderRadius:22 }}>
                <div style={{ position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.5),transparent)",animation:"hr_scanDown 4s linear infinite",opacity:0.5 }}/>
              </div>

              {/* Corner brackets */}
              {[
                { top:11,left:11,   borderTop:"2px solid rgba(129,140,248,0.55)",borderLeft:"2px solid rgba(129,140,248,0.55)" },
                { top:11,right:11,  borderTop:"2px solid rgba(192,132,252,0.55)",borderRight:"2px solid rgba(192,132,252,0.55)" },
                { bottom:11,left:11,  borderBottom:"2px solid rgba(103,232,249,0.55)",borderLeft:"2px solid rgba(103,232,249,0.55)" },
                { bottom:11,right:11, borderBottom:"2px solid rgba(244,114,182,0.55)",borderRight:"2px solid rgba(244,114,182,0.55)" },
              ].map((s,i) => <div key={i} aria-hidden="true" style={{ position:"absolute",width:20,height:20,zIndex:5,...s }}/>)}

              {/* Live badge */}
              <div style={{ position:"absolute",top:13,left:13,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:100,background:"rgba(4,5,18,0.8)",backdropFilter:"blur(14px)",border:"1px solid rgba(129,140,248,0.3)" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"hr_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                <span style={{ color:"#a5b4fc",fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase" }}>Live 3D</span>
              </div>

              {/* Interaction hint */}
              <div style={{ position:"absolute",bottom:13,right:13,zIndex:6,padding:"4px 10px",borderRadius:8,background:"rgba(4,5,18,0.7)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color:"rgba(165,180,252,0.5)",fontSize:9,fontWeight:600,letterSpacing:"0.1em" }}>DRAG TO INTERACT</span>
              </div>

              <ThreeCanvas/>
            </div>

            {/* Floating notifications — desktop only */}
            <div className="hr-float-notifs" style={{ position:"absolute",inset:0,zIndex:20,pointerEvents:"none" }}>
              <div style={{ position:"absolute",top:"6%",left:"-9%" }}>
                <FloatingNotif text="New project launched 🚀" sub="2 min ago" color="#818cf8" delay={0}/>
              </div>
              <div style={{ position:"absolute",bottom:"10%",right:"-9%" }}>
                <FloatingNotif text="Client approved ✓" sub="Just now" color="#34d399" delay={2000}/>
              </div>
            </div>
          </div>

          {/* ── Text column ── */}
          <div className="hr-text">

            {/* Badge */}
            <div style={{ animation:"hr_fadeDown 0.6s ease both 0.08s" }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:100,background:"linear-gradient(135deg,rgba(99,102,241,0.22),rgba(168,85,247,0.14))",border:"1px solid rgba(129,140,248,0.34)",color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",animation:"hr_badgePulse 3s ease-in-out infinite" }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 8px #818cf8",animation:"hr_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                Innovating the Future
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.22s" }}>
              <h1 className="hr-hl">
                <span style={{ display:"block" }}>Welcome to</span>
                <span className="l2">IsiTech Innovations</span>
              </h1>
            </div>

            {/* Typewriter + description */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.36s" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:9,flexWrap:"wrap" }}>
                <span style={{ color:"rgba(165,180,252,0.5)",fontSize:"clamp(12px,1.3vw,15px)",fontStyle:"italic",fontWeight:300 }}>We help you</span>
                <span style={{ color:"#818cf8",fontSize:"clamp(13px,1.4vw,16px)",fontWeight:700,minWidth:96 }}>
                  {typedWord}
                  <span style={{ borderRight:"2.5px solid #818cf8",marginLeft:1,animation:"hr_cursor 1s step-end infinite" }}>&nbsp;</span>
                </span>
              </div>
              <p style={{ color:"rgba(199,210,254,0.62)",fontSize:"clamp(13px,1.45vw,16px)",lineHeight:1.82,fontWeight:400,maxWidth:460,margin:0 }}>
                We build simple, modern digital solutions to help your business grow online — powered by cutting-edge technology and human-centered design principles.
              </p>
            </div>

            {/* Tech tags */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:7,animation:"hr_fadeUp 0.7s ease both 0.44s" }}>
              {TECH_TAGS.map((tag, i) => (
                <span key={tag} className="hr-tag" style={{ animationName:"hr_tagIn", animationDuration:"0.5s", animationFillMode:"both", animationTimingFunction:"cubic-bezier(0.23,1,0.32,1)", animationDelay:`${0.5+i*0.06}s` }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Skill bars — desktop only */}
            <div ref={skillsRef} className="hr-skills" style={{ background:"rgba(255,255,255,0.032)",border:"1px solid rgba(129,140,248,0.15)",borderRadius:14,padding:"15px 17px",animation:"hr_fadeUp 0.7s ease both 0.5s" }}>
              <div style={{ color:"rgba(165,180,252,0.4)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:13 }}>Expertise</div>
              {SKILL_BARS.map((s, i) => (
                <div key={s.l} style={{ marginBottom: i < SKILL_BARS.length-1 ? 13 : 0 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                    <span style={{ color:"rgba(199,210,254,0.65)",fontSize:11,fontWeight:600 }}>{s.l}</span>
                    <span style={{ color:s.c,fontSize:11,fontWeight:700 }}>{s.p}%</span>
                  </div>
                  <div style={{ height:4,borderRadius:2,background:"rgba(255,255,255,0.065)",overflow:"hidden" }}>
                    <div className="hr-skillbar-inner" style={{ height:"100%",borderRadius:2,background:`linear-gradient(90deg,${s.c}80,${s.c})`,width:skillsVisible?`${s.p}%`:"0%",transition:`width 1.5s cubic-bezier(0.23,1,0.32,1) ${i*0.15}s` }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:10,animation:"hr_fadeUp 0.7s ease both 0.54s" }}>
              <CTAButton label="Get Started"  href="#contact"  primary onClick={handleNav}/>
              <CTAButton label="See Our Work" href="#projects" primary={false} onClick={handleNav}/>
            </div>

            {/* Live metrics */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.86s" }}>
              <LiveMetrics/>
            </div>

            {/* Social proof */}
            <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",animation:"hr_fadeUp 0.7s ease both 0.92s" }}>
              {/* Avatar stack */}
              <div style={{ display:"flex" }} aria-label="Happy clients">
                {AVATAR_COLORS.map(([from,to], i) => (
                  <div key={i} style={{ width:26,height:26,borderRadius:"50%",marginLeft:i===0?0:"-9px",border:"2px solid #050714",background:`linear-gradient(135deg,${from},${to})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"rgba(255,255,255,0.88)",fontWeight:700,flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:1.5,marginBottom:2 }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color:"#fbbf24",fontSize:11 }}>★</span>)}
                </div>
                <span style={{ color:"rgba(165,180,252,0.65)",fontSize:12,fontWeight:500 }}>
                  Trusted by <strong style={{ color:"#a5b4fc" }}>500+</strong> businesses
                </span>
              </div>
              {/* Availability badge */}
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(52,211,153,0.09)",border:"1px solid rgba(52,211,153,0.25)" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"hr_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                <span style={{ color:"#34d399",fontSize:10,fontWeight:700,letterSpacing:"0.1em" }}>AVAILABLE NOW</span>
              </div>
            </div>

          </div>{/* end .hr-text */}

          {/* ── Stats row ── */}
          <div className="hr-stats" role="list" aria-label="Company statistics">
            {STATS.map((s,i) => <StatCard key={s.id} stat={s} index={i}/>)}
          </div>

        </div>{/* end .hr-grid */}

        {/* Scroll indicator — hidden when scrolled */}
        <div style={{ position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:7,animation:"hr_fadeUp 1s ease both 1.3s",opacity:scrolled?0:1,transition:"opacity 0.4s ease",pointerEvents:"none" }}>
          <span style={{ color:"rgba(165,180,252,0.35)",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600 }}>Scroll</span>
          <div style={{ width:20,height:33,borderRadius:10,border:"1.5px solid rgba(129,140,248,0.25)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:4 }}>
            <div style={{ width:3,height:7,borderRadius:2,background:"#818cf8",animation:"hr_scrollDot 2s ease-in-out infinite" }}/>
          </div>
        </div>

        {/* Bottom vignette */}
        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(transparent,rgba(5,7,20,0.88))",zIndex:5,pointerEvents:"none" }}/>
        {/* Top vignette */}
        <div aria-hidden="true" style={{ position:"absolute",top:0,left:0,right:0,height:72,background:"linear-gradient(rgba(5,7,20,0.5),transparent)",zIndex:5,pointerEvents:"none" }}/>

      </section>
    </>
  );
};

export default Hero;