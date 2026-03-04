import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  FaLaptopCode, FaCog, FaPaintBrush, FaChartLine,
  FaShoppingCart, FaBrain, FaMobileAlt, FaCloud,
} from "react-icons/fa";

/* ════════════════════════════════════════════════════
   SERVICE DATA
════════════════════════════════════════════════════ */
const SERVICES = [
  {
    title: "Web Design",
    description: "Crafting stunning, user-centric interfaces that leave lasting impressions and convert visitors into loyal customers.",
    Icon: FaLaptopCode,
    accent: "#818cf8", glow: "rgba(129,140,248,0.4)",
    gradFrom: "#6366f1", gradTo: "#4f46e5",
    tag: "UI/UX", shape: "icosahedron",
  },
  {
    title: "Custom Development",
    description: "High-performance web apps built with modern technologies, precisely tailored to your business goals.",
    Icon: FaCog,
    accent: "#c084fc", glow: "rgba(192,132,252,0.4)",
    gradFrom: "#a855f7", gradTo: "#7c3aed",
    tag: "Full-Stack", shape: "torus",
  },
  {
    title: "Brand Identity",
    description: "Building unforgettable brand experiences with cohesive visual systems that speak directly to your audience.",
    Icon: FaPaintBrush,
    accent: "#f472b6", glow: "rgba(244,114,182,0.4)",
    gradFrom: "#ec4899", gradTo: "#db2777",
    tag: "Branding", shape: "octahedron",
  },
  {
    title: "SEO & Analytics",
    description: "Rank higher, reach further. Data-driven strategies powered by deep analytics to scale your business.",
    Icon: FaChartLine,
    accent: "#34d399", glow: "rgba(52,211,153,0.4)",
    gradFrom: "#10b981", gradTo: "#059669",
    tag: "Growth", shape: "tetrahedron",
  },
  {
    title: "E-Commerce Solutions",
    description: "Sell smarter with sleek, scalable, secure online stores designed for maximum conversion.",
    Icon: FaShoppingCart,
    accent: "#fb923c", glow: "rgba(251,146,60,0.4)",
    gradFrom: "#f97316", gradTo: "#ea580c",
    tag: "Commerce", shape: "sphere",
  },
  {
    title: "Tech Consultation",
    description: "Expert strategic guidance to transform your ideas into scalable, future-proof digital products.",
    Icon: FaBrain,
    accent: "#a78bfa", glow: "rgba(167,139,250,0.4)",
    gradFrom: "#8b5cf6", gradTo: "#6d28d9",
    tag: "Strategy", shape: "dodecahedron",
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile apps with elegant UX, native performance, and scalable architecture.",
    Icon: FaMobileAlt,
    accent: "#67e8f9", glow: "rgba(103,232,249,0.4)",
    gradFrom: "#06b6d4", gradTo: "#0891b2",
    tag: "Mobile", shape: "torus2",
  },
  {
    title: "Cloud Integration",
    description: "Secure, infinitely scalable cloud architectures to supercharge your team's efficiency and collaboration.",
    Icon: FaCloud,
    accent: "#7dd3fc", glow: "rgba(125,211,252,0.4)",
    gradFrom: "#38bdf8", gradTo: "#0284c7",
    tag: "Cloud", shape: "icosahedron2",
  },
];

/* ════════════════════════════════════════════════════
   UTILITY
════════════════════════════════════════════════════ */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

/* ════════════════════════════════════════════════════
   MINI THREE.JS SCENE — per card 3D icon
════════════════════════════════════════════════════ */
const MiniScene = ({ accent, shape, hovered }) => {
  const canvasRef = useRef(null);
  const sceneRef  = useRef(null);
  const hovRef    = useRef(hovered);

  useEffect(() => { hovRef.current = hovered; }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer = null, animId = null, doCleanup = null;

    const init = () => {
      if (renderer) return;
      const W = canvas.clientWidth  || 80;
      const H = canvas.clientHeight || 80;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 3.2;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const col = parseInt(accent.replace("#", "0x"));
    const pl = new THREE.PointLight(col, 5, 20);
    pl.position.set(2, 2, 2);
    scene.add(pl);
    const pl2 = new THREE.PointLight(0xffffff, 1.5, 20);
    pl2.position.set(-2, -1, 1);
    scene.add(pl2);

    // Build geometry based on shape
    let geo;
    switch (shape) {
      case "torus":       geo = new THREE.TorusGeometry(0.7, 0.28, 18, 60); break;
      case "torus2":      geo = new THREE.TorusGeometry(0.6, 0.22, 16, 50); break;
      case "octahedron":  geo = new THREE.OctahedronGeometry(0.9, 0); break;
      case "tetrahedron": geo = new THREE.TetrahedronGeometry(0.95, 0); break;
      case "sphere":      geo = new THREE.SphereGeometry(0.85, 32, 32); break;
      case "dodecahedron":geo = new THREE.DodecahedronGeometry(0.82, 0); break;
      case "icosahedron2":geo = new THREE.IcosahedronGeometry(0.88, 1); break;
      default:            geo = new THREE.IcosahedronGeometry(0.88, 1); break;
    }

    const accentHex = parseInt(accent.replace("#","0x"));
    const mat = new THREE.MeshPhongMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 0.25,
      specular: 0xffffff,
      shininess: 160,
      transparent: true,
      opacity: 0.92,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: accentHex, wireframe: true, transparent: true, opacity: 0.2,
    });
    const wire = new THREE.Mesh(geo, wireMat);
    wire.scale.setScalar(1.04);
    scene.add(wire);

    // Particles ring
    const pCount = 28;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const a = (i / pCount) * Math.PI * 2;
      const r = 1.3 + Math.random() * 0.4;
      pPos[i*3]   = Math.cos(a) * r;
      pPos[i*3+1] = (Math.random() - 0.5) * 0.8;
      pPos[i*3+2] = Math.sin(a) * r;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: accentHex, size: 0.055, transparent: true, opacity: 0.7,
    }));
    scene.add(pts);

    sceneRef.current = { mesh, wire, pts, pl };

    let animId;
    const _t0_clock = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (performance.now() - _t0_clock) * 0.001;
      const h = hovRef.current;

      const speed = h ? 1.8 : 0.7;
      mesh.rotation.y = t * speed * 0.6;
      mesh.rotation.x = Math.sin(t * 0.4) * 0.3;
      wire.rotation.y = mesh.rotation.y;
      wire.rotation.x = mesh.rotation.x;

      pts.rotation.y = t * 0.25;

      const targetScale = h ? 1.14 : 1.0;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      wire.scale.setScalar(mesh.scale.x * 1.04);

      pl.intensity = h ? 8 : 5;

      renderer.render(scene, camera);
    };
    animate();

    doCleanup = () => { cancelAnimationFrame(animId); if(renderer){renderer.dispose();renderer=null;} };
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if(doCleanup){doCleanup();doCleanup=null;} }
    }, { threshold: 0.01, rootMargin: '200px' });
    obs.observe(canvas);
    return () => { obs.disconnect(); if(doCleanup) doCleanup(); };
  }, [accent, shape]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

/* ════════════════════════════════════════════════════
   LARGE HERO 3D SCENE — background centerpiece
════════════════════════════════════════════════════ */
const HeroScene = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer = null, animId = null, doCleanup = null;

    const init = () => {
      if (renderer) return;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 200);
      camera.position.z = 6;

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pls = [
      [0x818cf8, 4, [4,4,4]],
      [0xc084fc, 3, [-4,-3,3]],
      [0x67e8f9, 2, [0,-4,2]],
      [0xf472b6, 2, [3,-2,-3]],
    ].map(([col, intensity, pos]) => {
      const l = new THREE.PointLight(col, intensity, 30);
      l.position.set(...pos);
      scene.add(l);
      return l;
    });

    // Central large torus knot
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.38, 160, 18, 2, 3),
      new THREE.MeshPhongMaterial({ color: 0x4f46e5, emissive: 0x1e1b4b, specular: 0xc7d2fe, shininess: 160, transparent: true, opacity: 0.82 })
    );
    scene.add(torusKnot);

    const torusKnotWire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.38, 160, 18, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.15 })
    );
    torusKnotWire.scale.setScalar(1.02);
    scene.add(torusKnotWire);

    // Orbital rings
    const rings = [
      { r: 2.6, tube: 0.032, col: 0x818cf8, rotX: Math.PI/2.5, rotZ: 0.3, opacity: 0.7 },
      { r: 3.2, tube: 0.022, col: 0xc084fc, rotX: Math.PI/4,   rotZ: Math.PI/5, opacity: 0.55 },
      { r: 3.8, tube: 0.016, col: 0x67e8f9, rotX: Math.PI/6,   rotZ: -Math.PI/4, opacity: 0.4 },
    ].map(d => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(d.r, d.tube, 16, 140),
        new THREE.MeshPhongMaterial({ color: d.col, emissive: d.col, shininess: 240, transparent: true, opacity: d.opacity })
      );
      m.rotation.x = d.rotX; m.rotation.z = d.rotZ;
      scene.add(m);
      return m;
    });

    // Floating service-icon meshes (8 small objects in orbit)
    const orbitMeshes = [
      new THREE.IcosahedronGeometry(0.18,1),
      new THREE.OctahedronGeometry(0.20,0),
      new THREE.TetrahedronGeometry(0.22,0),
      new THREE.DodecahedronGeometry(0.18,0),
      new THREE.TorusGeometry(0.18,0.07,10,30),
      new THREE.IcosahedronGeometry(0.16,1),
      new THREE.SphereGeometry(0.18,16,16),
      new THREE.OctahedronGeometry(0.19,0),
    ].map((geo, i) => {
      const col = [0x818cf8,0xc084fc,0xf472b6,0x34d399,0xfb923c,0xa78bfa,0x67e8f9,0x7dd3fc][i];
      const m = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
        color: col, emissive: col, emissiveIntensity: 0.4, shininess: 200
      }));
      m.userData = {
        angle: (i/8)*Math.PI*2,
        radius: 2.0 + (i%3)*0.35,
        speed: 0.3 + (i%4)*0.12,
        yOff: Math.sin(i)*0.6,
      };
      scene.add(m);
      return m;
    });

    // Particles
    const pCount = 260;
    const pPos = new Float32Array(pCount*3);
    const pCol = new Float32Array(pCount*3);
    const palette = [[0.49,0.49,0.97],[0.75,0.51,0.99],[0.40,0.91,0.98],[0.96,0.45,0.71],[0.20,0.83,0.60]];
    for (let i=0;i<pCount;i++) {
      const r=3.8+Math.random()*2.0, t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1);
      pPos[i*3]=r*Math.sin(p)*Math.cos(t); pPos[i*3+1]=r*Math.sin(p)*Math.sin(t); pPos[i*3+2]=r*Math.cos(p);
      const c=palette[i%5]; pCol[i*3]=c[0]; pCol[i*3+1]=c[1]; pCol[i*3+2]=c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos,3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol,3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:0.04, transparent:true, opacity:0.75, vertexColors:true }));
    scene.add(particles);

    // Mouse
    let mx=0, my=0;
    const onMove = e => {
      const t = e.touches ? e.touches[0] : e;
      mx = (t.clientX/window.innerWidth-0.5)*2;
      my = -(t.clientY/window.innerHeight-0.5)*2;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, {passive:true});

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth/canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let animId;
    const _t0_clock = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (performance.now() - _t0_clock) * 0.001;

      torusKnot.rotation.x = t*0.18 + my*0.25;
      torusKnot.rotation.y = t*0.24 + mx*0.25;
      torusKnotWire.rotation.x = torusKnot.rotation.x;
      torusKnotWire.rotation.y = torusKnot.rotation.y;

      rings[0].rotation.z = t*0.18;
      rings[1].rotation.x = Math.PI/4 + t*0.14;
      rings[1].rotation.z = Math.PI/5 + t*0.10;
      rings[2].rotation.y = t*0.11;
      rings[2].rotation.z = -Math.PI/4 + t*0.08;

      orbitMeshes.forEach(m => {
        m.userData.angle += m.userData.speed * 0.011;
        m.position.x = Math.cos(m.userData.angle)*m.userData.radius;
        m.position.z = Math.sin(m.userData.angle)*m.userData.radius;
        m.position.y = m.userData.yOff + Math.sin(t*0.9+m.userData.angle)*0.3;
        m.rotation.y = t*1.5;
        m.rotation.x = t*0.8;
      });

      particles.rotation.y = t*0.03;
      particles.rotation.x = t*0.015;

      pls[0].position.set(Math.sin(t*0.4)*6, Math.cos(t*0.3)*5, 5);
      pls[1].position.set(Math.cos(t*0.3)*-6, Math.sin(t*0.45)*-4, 4);

      renderer.render(scene, camera);
    };
    animate();

    doCleanup = () => { cancelAnimationFrame(animId); window.removeEventListener("mousemove",onMove); window.removeEventListener("touchmove",onMove); window.removeEventListener("resize",onResize); if(renderer){renderer.dispose();renderer=null;} };
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if(doCleanup){doCleanup();doCleanup=null;} }
    }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); if(doCleanup) doCleanup(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }}/>;
};

/* ════════════════════════════════════════════════════
   SERVICE CARD
════════════════════════════════════════════════════ */
const ServiceCard = ({ service, index, visible }) => {
  const [hov, setHov] = useState(false);
  const { title, description, Icon, accent, glow, gradFrom, gradTo, tag, shape } = service;
  const rgb = hexToRgb(accent);

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        borderRadius: 22,
        padding: 0,
        cursor: "default",
        overflow: "hidden",
        background: hov
          ? `linear-gradient(145deg, rgba(${rgb},0.14) 0%, rgba(${rgb},0.06) 50%, rgba(255,255,255,0.03) 100%)`
          : "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: hov ? `1px solid rgba(${rgb},0.5)` : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: hov
          ? `0 0 48px rgba(${rgb},0.22), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)`
          : "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        transform: hov ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.45s cubic-bezier(0.23,1,0.32,1)",
        opacity: visible ? 1 : 0,
        animation: visible ? `sv_fadeUp 0.65s ease both ${index * 75}ms` : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top:0, left:0, right:0, height: 2,
        background: hov
          ? `linear-gradient(90deg, transparent, ${accent}, rgba(${rgb},0.7), transparent)`
          : `linear-gradient(90deg, transparent, rgba(${rgb},0.3), transparent)`,
        transition: "all 0.4s ease",
        zIndex: 3,
      }}/>

      {/* Corner glow */}
      <div style={{
        position:"absolute", bottom:-30, right:-30,
        width:130, height:130, borderRadius:"50%",
        background:`radial-gradient(ellipse, rgba(${rgb},0.28) 0%, transparent 70%)`,
        opacity: hov ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents:"none",
        zIndex: 0,
      }}/>

      {/* Tag badge */}
      <div style={{
        position:"absolute", top:14, right:14, zIndex:4,
        padding:"3px 10px", borderRadius:100,
        background: `rgba(${rgb},0.15)`,
        border: `1px solid rgba(${rgb},0.35)`,
        color: accent,
        fontSize:9, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        {tag}
      </div>

      {/* 3D mini scene */}
      <div style={{
        width:"100%", height: 110,
        position:"relative", zIndex: 2, flexShrink: 0,
        background: `radial-gradient(ellipse at 50% 60%, rgba(${rgb},0.12) 0%, transparent 70%)`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{ width:80, height:80 }}>
          <MiniScene accent={accent} shape={shape} hovered={hov} />
        </div>
      </div>

      {/* Text content */}
      <div style={{ padding: "0 clamp(16px,2vw,22px) clamp(18px,2vw,22px)", zIndex:2, display:"flex", flexDirection:"column", gap:10, flex:1 }}>

        {/* Icon + title row */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:10, flexShrink:0,
            background:`linear-gradient(135deg, ${gradFrom}40, ${gradTo}30)`,
            border:`1px solid rgba(${rgb},0.3)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, color:accent,
            boxShadow: hov ? `0 0 14px rgba(${rgb},0.4)` : "none",
            transition:"box-shadow 0.3s ease",
          }}>
            <Icon />
          </div>
          <h3 style={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(13px,1.5vw,16px)",
            letterSpacing:"-0.01em",
            color: hov ? "#e0e7ff" : "#c7d2fe",
            margin:0, lineHeight:1.2,
            transition:"color 0.25s ease",
          }}>
            {title}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          color:"rgba(199,210,254,0.58)",
          fontSize:"clamp(11px,1.2vw,13px)",
          lineHeight:1.72, margin:0,
          fontFamily:"'DM Sans',sans-serif", fontWeight:400,
          flex:1,
        }}>
          {description}
        </p>

        {/* Features mini list */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {["Premium", "Scalable", "Support"].map(f => (
            <span key={f} style={{
              padding:"2px 8px", borderRadius:100,
              background:`rgba(${rgb},0.1)`,
              border:`1px solid rgba(${rgb},0.2)`,
              color:`rgba(${rgb},0.9)`, // use numeric RGB correctly
              fontSize:9, fontWeight:700, letterSpacing:"0.08em",
              fontFamily:"'DM Sans',sans-serif",
            }}>{f}</span>
          ))}
        </div>

        {/* CTA row */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          marginTop:4,
          paddingTop:10,
          borderTop:`1px solid rgba(${rgb},0.12)`,
        }}>
          <span style={{
            display:"flex", alignItems:"center", gap:5,
            color: accent, fontSize:11, fontWeight:700,
            letterSpacing:"0.08em", textTransform:"uppercase",
            fontFamily:"'DM Sans',sans-serif",
            opacity: hov ? 1 : 0.6,
            transition:"opacity 0.3s ease",
          }}>
            <span style={{ animation: hov ? "sv_arrow 1.5s ease-in-out infinite" : "none", display:"inline-block" }}>→</span>
            Learn more
          </span>
          <div style={{
            width:28, height:28, borderRadius:"50%",
            background: hov ? `linear-gradient(135deg, ${gradFrom}, ${gradTo})` : `rgba(${rgb},0.12)`,
            border: `1px solid rgba(${rgb},0.3)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, color: hov ? "#fff" : accent,
            transition:"all 0.3s ease",
            boxShadow: hov ? `0 4px 14px rgba(${rgb},0.4)` : "none",
          }}>
            ↗
          </div>
        </div>
      </div>
    </article>
  );
};

/* ════════════════════════════════════════════════════
   FLOATING BG ACCENTS
════════════════════════════════════════════════════ */
const BgAccents = () => (
  <div className="sv-float-deco" style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1 }}>
    <svg width="88" height="88" viewBox="0 0 120 120" style={{ position:"absolute",top:"3%",left:"1.5%",animation:"sv_float1 8s ease-in-out infinite",filter:"drop-shadow(0 0 14px #818cf860)" }}>
      <defs>
        <linearGradient id="sv_cr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
        <linearGradient id="sv_cr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
      </defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#sv_cr1)" opacity="0.55"/>
      <polygon points="60,5 110,40 60,60" fill="url(#sv_cr2)" opacity="0.4"/>
    </svg>
    <svg width="65" height="65" viewBox="0 0 100 100" style={{ position:"absolute",top:"5%",right:"2.5%",animation:"sv_float2 10s ease-in-out infinite",filter:"drop-shadow(0 0 12px #f472b660)" }}>
      <defs><linearGradient id="sv_dm1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#sv_dm1)" opacity="0.6"/>
    </svg>
    <svg width="70" height="70" viewBox="0 0 100 100" style={{ position:"absolute",top:"42%",left:"0.5%",animation:"sv_spin 20s linear infinite",filter:"drop-shadow(0 0 10px #67e8f960)" }}>
      <defs><linearGradient id="sv_tr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#sv_tr1)" strokeWidth="7" opacity="0.6"/>
    </svg>
    <svg width="52" height="52" viewBox="0 0 80 80" style={{ position:"absolute",bottom:"4%",right:"1.5%",animation:"sv_float1 9s ease-in-out infinite reverse",filter:"drop-shadow(0 0 9px #fbbf2460)" }}>
      <defs><linearGradient id="sv_cb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="15,25 55,25 55,65 15,65" fill="url(#sv_cb1)" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.55" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
    </svg>
    <svg width="46" height="46" viewBox="0 0 60 60" style={{ position:"absolute",bottom:"7%",left:"3.5%",animation:"sv_pulse 5s ease-in-out infinite",filter:"drop-shadow(0 0 8px #34d39960)" }}>
      <defs><radialGradient id="sv_sp1" cx="35%" cy="30%"><stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#065f46"/></radialGradient></defs>
      <circle cx="30" cy="30" r="26" fill="url(#sv_sp1)" opacity="0.65"/>
    </svg>
  </div>
);

/* ════════════════════════════════════════════════════
   STATS STRIP
════════════════════════════════════════════════════ */
const stats = [
  { val:"500+", label:"Projects Shipped", col:"#818cf8" },
  { val:"8+",   label:"Years Building",   col:"#c084fc" },
  { val:"45+",  label:"Expert Engineers", col:"#67e8f9" },
  { val:"30+",  label:"Countries Served", col:"#f472b6" },
];

const StatsStrip = ({ visible }) => (
  <div style={{
    display:"flex", flexWrap:"wrap", gap:"clamp(12px,2vw,20px)",
    justifyContent:"center",
    margin:"clamp(40px,6vw,64px) auto 0",
    maxWidth:1000,
    animation: visible ? "sv_fadeUp 0.7s ease both 0.7s" : "none",
    opacity: visible ? 1 : 0,
  }}>
    {stats.map((s,i) => (
      <div key={i} style={{
        flex:"1 1 160px", minWidth:140,
        padding:"clamp(14px,2vw,20px)",
        borderRadius:18,
        background:"linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
        border:"1px solid rgba(255,255,255,0.08)",
        backdropFilter:"blur(16px)",
        textAlign:"center",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.col},transparent)` }}/>
        <div style={{ fontSize:"clamp(1.4rem,3vw,2.1rem)",fontFamily:"'Syne',sans-serif",fontWeight:900,letterSpacing:"-0.02em",background:`linear-gradient(135deg,#e0e7ff,${s.col})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1 }}>{s.val}</div>
        <div style={{ color:"rgba(199,210,254,0.55)",fontSize:"clamp(9px,1.1vw,11px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:5 }}>{s.label}</div>
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════
   SERVICES SECTION
════════════════════════════════════════════════════ */
const Services = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.06, rootMargin:"40px" }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; }

        @keyframes sv_fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sv_fadeDown  { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sv_float1    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(4deg)} 66%{transform:translateY(-6px) rotate(-3deg)} }
        @keyframes sv_float2    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes sv_spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sv_pulse     { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.12);opacity:1} }
        @keyframes sv_arrow     { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes sv_gridMove  { from{transform:translateY(0)} to{transform:translateY(50px)} }
        @keyframes sv_badgePulse{ 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,.4)} 50%{box-shadow:0 0 0 8px rgba(129,140,248,0)} }
        @keyframes sv_glow      { 0%,100%{opacity:.6} 50%{opacity:1} }

        .sv-section {
          position:relative; width:100%; overflow:hidden;
          background:linear-gradient(175deg,#080d1e 0%,#0a0a1f 30%,#050714 60%,#0d0620 100%);
          font-family:'DM Sans',sans-serif;
          padding: clamp(48px,9vw,110px) 0 clamp(56px,10vw,120px);
        }
        .sv-gridbg {
          position:absolute; inset:0; z-index:0; overflow:hidden;
          background-image:
            linear-gradient(rgba(129,140,248,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(129,140,248,0.04) 1px,transparent 1px);
          background-size:55px 55px;
          animation:sv_gridMove 10s linear infinite;
        }

        .sv-inner {
          position:relative; z-index:10;
          max-width:1320px; margin:0 auto;
          padding:0 clamp(12px,4vw,64px);
        }

        /* Hero 3D canvas */
        .sv-hero-canvas {
          width:100%; height:clamp(160px,42vw,340px);
          position:relative; z-index:2; margin-bottom:clamp(24px,5vw,56px);
          border-radius:20px; overflow:hidden;
          border:1px solid rgba(129,140,248,0.15);
          box-shadow:0 0 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
          display:flex; align-items:center; justify-content:center;
        }

        /* Cards grid — mobile first single col */
        .sv-grid {
          display:grid;
          grid-template-columns:1fr;
          gap:12px;
        }
        @media (min-width:480px)  { .sv-grid { grid-template-columns:repeat(2,1fr); gap:14px; } }
        @media (min-width:768px)  { .sv-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
        @media (min-width:1000px) { .sv-grid { grid-template-columns:repeat(3,1fr); gap:18px; } }
        @media (min-width:1200px) { .sv-grid { grid-template-columns:repeat(4,1fr); gap:20px; } }

        /* Hide floating SVG shapes on mobile */
        .sv-float-deco { display:none !important; }
        @media (min-width:640px) { .sv-float-deco { display:block !important; } }
      `}</style>

      <section id="services" ref={sectionRef} className="sv-section" aria-label="Our Services">
        <div className="sv-gridbg"/>

        {/* Noise texture */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.022,pointerEvents:"none" }}>
          <filter id="sv_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#sv_noise)"/>
        </svg>

        {/* Radial glows */}
        {[
          {top:"6%",left:"18%",w:"clamp(180px,44vw,580px)",h:"clamp(180px,44vw,580px)",col:"rgba(99,102,241,0.13)"},
          {bottom:"4%",right:"12%",w:"clamp(150px,35vw,460px)",h:"clamp(150px,35vw,460px)",col:"rgba(168,85,247,0.10)"},
          {top:"48%",left:"4%",w:"clamp(120px,28vw,360px)",h:"clamp(120px,28vw,360px)",col:"rgba(103,232,249,0.07)"},
        ].map((g,i)=>(
          <div key={i} style={{ position:"absolute",...(g.top?{top:g.top}:{bottom:g.bottom}),...(g.left?{left:g.left}:{right:g.right}),width:g.w,height:g.h,borderRadius:"50%",background:`radial-gradient(ellipse,${g.col} 0%,transparent 70%)`,pointerEvents:"none",zIndex:1 }}/>
        ))}

        <BgAccents/>

        <div className="sv-inner">

          {/* ── Header ── */}
          <header style={{
            textAlign:"center",
            marginBottom:"clamp(32px,5vw,52px)",
            opacity: visible ? 1 : 0,
            animation: visible ? "sv_fadeDown 0.8s ease both 0.05s" : "none",
          }}>
            {/* Badge */}
            <div style={{ marginBottom:14 }}>
              <span style={{
                display:"inline-flex",alignItems:"center",gap:7,
                padding:"7px 16px",borderRadius:100,
                background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(168,85,247,0.12))",
                border:"1px solid rgba(129,140,248,0.3)",
                color:"#a5b4fc",fontSize:10,fontWeight:700,
                letterSpacing:"0.2em",textTransform:"uppercase",
                animation:"sv_badgePulse 3s ease-in-out infinite",
              }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 7px #818cf8" }}/>
                What We Offer
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:900,
              fontSize:"clamp(1.8rem,5vw,3.6rem)",
              letterSpacing:"-0.03em", lineHeight:1.08,
              margin:"0 0 6px 0", color:"#fff",
            }}>
              <span style={{ display:"block" }}>Our Premium</span>
              <span style={{
                display:"block",
                background:"linear-gradient(135deg,#818cf8 0%,#a78bfa 35%,#c084fc 65%,#f472b6 100%)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
                filter:"drop-shadow(0 0 24px rgba(129,140,248,0.5))",
              }}>
                Services
              </span>
            </h2>

            <p style={{
              color:"rgba(199,210,254,0.62)",
              fontSize:"clamp(13px,1.7vw,17px)",
              lineHeight:1.75, maxWidth:560,
              margin:"14px auto 0",fontWeight:400,
            }}>
              IsiTech Innovations delivers industry-leading digital solutions to launch, grow, and scale your brand globally.
            </p>

            {/* Divider */}
            <div style={{ marginTop:22,height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.4),transparent)",maxWidth:360,margin:"22px auto 0" }}/>
          </header>

          {/* ── Hero 3D Scene ── */}
          <div
            className="sv-hero-canvas"
            style={{ opacity: visible ? 1 : 0, animation: visible ? "sv_fadeUp 0.9s ease both 0.2s" : "none" }}
          >
            {/* Corner brackets */}
            {[{top:10,left:10,bt:"2px solid rgba(129,140,248,0.5)",bl:"2px solid rgba(129,140,248,0.5)"},{top:10,right:10,bt:"2px solid rgba(192,132,252,0.5)",br:"2px solid rgba(192,132,252,0.5)"},{bottom:10,left:10,bb:"2px solid rgba(103,232,249,0.5)",bl:"2px solid rgba(103,232,249,0.5)"},{bottom:10,right:10,bb:"2px solid rgba(244,114,182,0.5)",br:"2px solid rgba(244,114,182,0.5)"}].map((c,i)=>(
              <div key={i} style={{ position:"absolute",zIndex:5,width:18,height:18,...(c.top!==undefined?{top:c.top}:{bottom:c.bottom}),...(c.left!==undefined?{left:c.left}:{right:c.right}),borderTop:c.bt,borderBottom:c.bb,borderLeft:c.bl,borderRight:c.br }}/>
            ))}
            {/* Live badge */}
            <div style={{ position:"absolute",top:14,left:16,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(129,140,248,0.25)" }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"sv_pulse 2s ease-in-out infinite",display:"inline-block" }}/>
              <span style={{ color:"#a5b4fc",fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase" }}>Live Services Engine</span>
            </div>
            <HeroScene/>
          </div>

          {/* ── Cards Grid ── */}
          <div className="sv-grid">
            {SERVICES.map((s,i) => (
              <ServiceCard key={s.title} service={s} index={i} visible={visible}/>
            ))}
          </div>

          {/* ── Stats strip ── */}
          <StatsStrip visible={visible}/>

          {/* ── CTA row ── */}
          <div style={{
            textAlign:"center", marginTop:"clamp(32px,5vw,52px)",
            opacity: visible ? 1 : 0,
            animation: visible ? "sv_fadeUp 0.7s ease both 0.85s" : "none",
          }}>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
              style={{
                padding:"14px clamp(28px,4vw,44px)",borderRadius:100,border:"none",
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                fontSize:"clamp(13px,1.5vw,16px)",fontWeight:800,letterSpacing:"0.05em",
                color:"#fff",
                background:"linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",
                boxShadow:"0 8px 32px rgba(99,102,241,0.45)",
                transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",
                display:"inline-flex",alignItems:"center",gap:10,
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.04)";e.currentTarget.style.boxShadow="0 20px 56px rgba(99,102,241,0.6)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.45)";}}
            >
              <span>→</span> Start Your Project
            </button>
            <p style={{ color:"rgba(165,180,252,0.45)",fontSize:12,marginTop:12,fontWeight:500 }}>
              Free consultation · No commitment required
            </p>
          </div>

        </div>

        {/* Bottom divider */}
        <div style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.25),transparent)",zIndex:5 }}/>
      </section>
    </>
  );
};

export default Services;