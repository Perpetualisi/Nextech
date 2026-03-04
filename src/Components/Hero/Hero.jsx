import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const STATS = [
  { id: "projects", label: "Projects Done", value: "500+", icon: "◈", color: "#818cf8" },
  { id: "clients", label: "Client Satisfaction", value: "99.8%", icon: "◉", color: "#c084fc" },
  { id: "team", label: "Skilled Team", value: "45+", icon: "◎", color: "#67e8f9" },
  { id: "support", label: "Support", value: "24/7", icon: "◐", color: "#f472b6" },
];
const CTA_BUTTONS = [
  { id: "get-started", label: "Get Started", href: "#contact", primary: true },
  { id: "view-work", label: "See Our Work", href: "#projects", primary: false },
];
const TECH_TAGS = ["React", "Node.js", "AI / ML", "Cloud", "Web3", "Mobile"];

const useTypewriter = (words, speed = 90, pause = 1800) => {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    else if (!deleting && charIdx === current.length) timeout = setTimeout(() => setDeleting(true), pause);
    else if (deleting && charIdx > 0) timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    else { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return displayed;
};

const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const step = num / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => { cur = Math.min(cur + step, num); setCount(cur); if (cur >= num) clearInterval(timer); }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  const suffix = target.replace(/[0-9.]/g, "");
  const isFloat = target.includes(".");
  return { ref, display: (count >= 1 ? (isFloat ? count.toFixed(1) : Math.floor(count).toString()) : "0") + suffix };
};

/* ── Orbital rings (decorative SVG, contained, no overflow) ── */
const OrbitalRings = () => (
  <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.15 }}>
    <defs>
      {[["r1","#818cf8"],["r2","#c084fc"],["r3","#67e8f9"]].map(([id,col]) => (
        <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={col} stopOpacity="0"/>
          <stop offset="50%" stopColor={col} stopOpacity="1"/>
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

/* ── Floating shapes — only rendered on ≥768px via CSS class ── */
const FloatingShapes = () => (
  <div className="hr-shapes" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
    <svg width="90" height="90" viewBox="0 0 120 120" style={{ position:"absolute", top:"8%", left:"3%", animation:"hr_float1 7s ease-in-out infinite", filter:"drop-shadow(0 0 18px #818cf880)" }}>
      <defs>
        <linearGradient id="hr_c1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
        <linearGradient id="hr_c2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
      </defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#hr_c1)" opacity="0.85"/>
      <polygon points="60,5 110,40 60,60" fill="url(#hr_c2)" opacity="0.6"/>
    </svg>
    <svg width="70" height="70" viewBox="0 0 90 90" style={{ position:"absolute", top:"10%", right:"5%", animation:"hr_float2 9s ease-in-out infinite", filter:"drop-shadow(0 0 16px #c084fc80)" }}>
      <defs><radialGradient id="hr_sp1" cx="35%" cy="30%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="50%" stopColor="#a855f7"/><stop offset="100%" stopColor="#3b0764"/></radialGradient></defs>
      <circle cx="45" cy="45" r="40" fill="url(#hr_sp1)" opacity="0.9"/>
    </svg>
    <svg width="75" height="75" viewBox="0 0 100 100" style={{ position:"absolute", top:"44%", left:"1%", animation:"hr_spin 14s linear infinite", filter:"drop-shadow(0 0 12px #67e8f980)" }}>
      <defs><linearGradient id="hr_tor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#hr_tor)" strokeWidth="9" opacity="0.85"/>
    </svg>
    <svg width="72" height="72" viewBox="0 0 100 100" style={{ position:"absolute", bottom:"9%", right:"4%", animation:"hr_float1 11s ease-in-out infinite reverse", filter:"drop-shadow(0 0 14px #f472b680)" }}>
      <defs><linearGradient id="hr_di" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#hr_di)" opacity="0.85"/>
    </svg>
  </div>
);

/* ── Three.js scene ── */
const ThreeCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer = null, animId = null, doCleanup = null;
    const init = () => {
      if (renderer) return;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      cam.position.z = 5;
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const pl1 = new THREE.PointLight(0x818cf8, 3, 20); pl1.position.set(3, 3, 3); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xc084fc, 2, 20); pl2.position.set(-3, -2, 2); scene.add(pl2);
      const pl3 = new THREE.PointLight(0x67e8f9, 2, 20); pl3.position.set(0, -3, 1); scene.add(pl3);
      const geo = new THREE.IcosahedronGeometry(1.1, 1);
      const ico = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color: 0x4f46e5, emissive: 0x1e1b4b, specular: 0xc7d2fe, shininess: 120, transparent: true, opacity: 0.92 }));
      scene.add(ico);
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.3 }));
      wire.scale.setScalar(1.01); scene.add(wire);
      const torus = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 16, 120), new THREE.MeshPhongMaterial({ color: 0x818cf8, emissive: 0x312e81, shininess: 200, transparent: true, opacity: 0.8 }));
      torus.rotation.x = Math.PI / 2.5; scene.add(torus);
      const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.025, 12, 100), new THREE.MeshPhongMaterial({ color: 0xc084fc, emissive: 0x581c87, shininess: 160, transparent: true, opacity: 0.6 }));
      torus2.rotation.x = Math.PI / 4; torus2.rotation.z = Math.PI / 6; scene.add(torus2);
      const pCount = 160, pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) { const r = 2.5 + Math.random() * 1.5, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1); pPos[i * 3] = r * Math.sin(p) * Math.cos(t); pPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t); pPos[i * 3 + 2] = r * Math.cos(p); }
      const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc7d2fe, size: 0.045, transparent: true, opacity: 0.8 }));
      scene.add(pts);
      const smalls = [0x818cf8, 0xc084fc, 0x67e8f9, 0xf472b6].map((c, i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.4 }));
        m.userData = { angle: (i / 4) * Math.PI * 2, radius: 1.7, speed: 0.4 + i * 0.15, yOff: i % 2 === 0 ? 0.4 : -0.4 };
        scene.add(m); return m;
      });
      let mx = 0, my = 0;
      const onMouse = e => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = -(e.clientY / window.innerHeight - 0.5) * 2; };
      const onTouch = e => { if (e.touches[0]) { mx = (e.touches[0].clientX / window.innerWidth - 0.5) * 2; my = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2; } };
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("touchmove", onTouch, { passive: true });
      const onResize = () => { if (!canvas || !renderer) return; renderer.setSize(canvas.clientWidth, canvas.clientHeight); cam.aspect = canvas.clientWidth / canvas.clientHeight; cam.updateProjectionMatrix(); };
      window.addEventListener("resize", onResize);
      const _t0 = performance.now();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now() - _t0) * 0.001;
        ico.rotation.x = t * 0.18 + my * 0.3; ico.rotation.y = t * 0.25 + mx * 0.3;
        wire.rotation.x = ico.rotation.x; wire.rotation.y = ico.rotation.y;
        torus.rotation.z = t * 0.2;
        torus2.rotation.x = Math.PI / 4 + t * 0.15; torus2.rotation.z = Math.PI / 6 + t * 0.1;
        pts.rotation.y = t * 0.04; pts.rotation.x = t * 0.02;
        smalls.forEach(s => { s.userData.angle += s.userData.speed * 0.012; s.position.x = Math.cos(s.userData.angle) * s.userData.radius; s.position.z = Math.sin(s.userData.angle) * s.userData.radius; s.position.y = s.userData.yOff + Math.sin(t * 1.2 + s.userData.angle) * 0.3; });
        pl1.position.x = Math.sin(t * 0.5) * 4; pl1.position.y = Math.cos(t * 0.4) * 3;
        renderer.render(scene, cam);
      };
      animate();
      doCleanup = () => { cancelAnimationFrame(animId); window.removeEventListener("mousemove", onMouse); window.removeEventListener("touchmove", onTouch); window.removeEventListener("resize", onResize); if (renderer) { renderer.dispose(); renderer = null; } };
    };
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) init(); else if (doCleanup) { doCleanup(); doCleanup = null; } }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); if (doCleanup) doCleanup(); };
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

/* ── Stat card ── */
const StatCard = ({ stat, index }) => {
  const [hov, setHov] = useState(false);
  const { ref, display } = useCounter(stat.value);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      animation: `hr_fadeUp 0.7s ease both ${0.5 + index * 0.12}s`,
      background: hov ? `linear-gradient(135deg,${stat.color}22,${stat.color}0a)` : "linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
      border: hov ? `1px solid ${stat.color}70` : "1px solid rgba(255,255,255,0.1)",
      transform: hov ? "translateY(-5px) scale(1.03)" : "none",
      transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
      backdropFilter: "blur(20px)", borderRadius: "16px",
      padding: "clamp(10px,2vw,22px)", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)" }}/>
      <div style={{ fontSize: "clamp(14px,2vw,22px)", color: stat.color, marginBottom: 4 }}>{stat.icon}</div>
      <div style={{ fontSize: "clamp(1.05rem,2.8vw,2rem)", fontWeight: 900, lineHeight: 1, marginBottom: 4, background: `linear-gradient(135deg,#e0e7ff,${stat.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{display}</div>
      <div style={{ color: "rgba(199,210,254,0.65)", fontSize: "clamp(8px,1vw,11px)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.3 }}>{stat.label}</div>
    </div>
  );
};

/* ── CTA button ── */
const CTAButton = ({ button, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={() => onClick(button.href)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "11px clamp(16px,3vw,32px)", borderRadius: "100px", fontWeight: 800,
      fontSize: "clamp(12px,1.4vw,15px)", letterSpacing: "0.05em", cursor: "pointer",
      transform: hov ? "translateY(-3px) scale(1.04)" : "none",
      transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)", outline: "none",
      fontFamily: "'DM Sans',sans-serif",
      ...(button.primary ? {
        background: hov ? "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)" : "linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",
        border: "none", color: "#fff",
        boxShadow: hov ? "0 20px 60px rgba(99,102,241,0.6)" : "0 8px 30px rgba(99,102,241,0.4)",
      } : {
        background: hov ? "rgba(129,140,248,0.12)" : "transparent",
        border: "1.5px solid rgba(129,140,248,0.5)", color: "#c7d2fe",
        boxShadow: hov ? "0 8px 30px rgba(99,102,241,0.25)" : "none",
      }),
    }}>
      {button.primary && <span style={{ marginRight: 7, animation: "hr_arrowPulse 2s ease-in-out infinite", display: "inline-block" }}>→</span>}
      {button.label}
    </button>
  );
};

/* ── Floating notification — hidden on mobile via CSS ── */
const FloatingNotif = ({ text, sub, color, style }) => (
  <div className="hr-notif" style={{
    position: "absolute", backdropFilter: "blur(20px)",
    background: "linear-gradient(135deg,rgba(10,10,35,0.92),rgba(20,10,50,0.88))",
    border: `1px solid ${color}40`, borderRadius: "14px", padding: "10px 14px",
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
    zIndex: 20, animation: "hr_floatNotif 6s ease-in-out infinite", ...style,
  }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}`, flexShrink: 0, animation: "hr_pulse 2s ease-in-out infinite" }} />
    <div>
      <div style={{ color: "#e0e7ff", fontSize: 11, fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ color: "rgba(165,180,252,0.55)", fontSize: 10, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);

/* ── Live metrics ── */
const LiveMetrics = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: "flex", gap: "clamp(8px,1.5vw,20px)", flexWrap: "wrap" }}>
      {[{ l: "Uptime", v: "99.99%", c: "#34d399" }, { l: "Load", v: `${(1.2 + Math.sin(tick) * 0.4).toFixed(1)}s`, c: "#818cf8" }, { l: "Online", v: `${1240 + (tick * 17) % 300}`, c: "#f472b6" }].map(m => (
        <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: m.c, boxShadow: `0 0 7px ${m.c}`, flexShrink: 0 }} />
          <span style={{ color: "rgba(165,180,252,0.45)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.l}</span>
          <span style={{ color: m.c, fontSize: 11, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{m.v}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Hero ── */
const Hero = () => {
  const handleNav = useCallback(href => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const typedWord = useTypewriter(["Innovate.", "Transform.", "Grow.", "Succeed."], 80, 2000);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes hr_float1     { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-16px) rotate(3deg)} 66%{transform:translateY(-7px) rotate(-2deg)} }
        @keyframes hr_float2     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px) rotate(-4deg)} }
        @keyframes hr_floatNotif { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes hr_spin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hr_pulse      { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.14);opacity:1} }
        @keyframes hr_fadeUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hr_fadeDown   { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hr_badgePulse { 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,0.4)} 50%{box-shadow:0 0 0 8px rgba(129,140,248,0)} }
        @keyframes hr_arrowPulse { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes hr_gridMove   { from{transform:translateY(0)} to{transform:translateY(60px)} }
        @keyframes hr_scrollDot  { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(13px);opacity:0.3} }
        @keyframes hr_gradient   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes hr_cursor     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hr_shimmer    { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

        /* ─────────────────────────────────────────────────
           SECTION  — contains everything, no horizontal scroll
        ───────────────────────────────────────────────── */
        .hr-section {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;                        /* clips any absolute children */
          background: linear-gradient(135deg,#050714 0%,#0a0a1f 30%,#0d0620 60%,#080d1e 100%);
          font-family: 'DM Sans', sans-serif;
        }

        /* ─────────────────────────────────────────────────
           MOBILE-FIRST GRID  (single column, canvas on top)
        ───────────────────────────────────────────────── */
        .hr-grid {
          position: relative; z-index: 10;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;  /* canvas | text | stats */
          gap: 16px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 72px 16px 44px;             /* top clears navbar on mobile */
          align-items: start;
        }

        .hr-canvas { grid-row: 1; position: relative; width: 100%; height: 54vw; min-height: 200px; max-height: 310px; }
        .hr-text   { grid-row: 2; display: flex; flex-direction: column; gap: 13px; min-width: 0; }
        .hr-stats  { grid-row: 3; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }

        /* ─────────────────────────────────────────────────
           HEADLINE  (wraps freely on mobile)
        ───────────────────────────────────────────────── */
        .hr-hl {
          font-family: 'Syne', sans-serif; font-weight: 900;
          line-height: 1.08; letter-spacing: -0.025em; color: #fff;
          font-size: clamp(1.65rem, 7.5vw, 2.2rem);
          margin: 0;
        }
        .hr-hl .l2 {
          display: block;
          background: linear-gradient(135deg,#818cf8 0%,#a78bfa 35%,#c084fc 65%,#f472b6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: hr_gradient 4s ease infinite;
          filter: drop-shadow(0 0 22px rgba(129,140,248,0.5));
        }

        /* ─────────────────────────────────────────────────
           DECORATIVE: hidden on mobile, shown ≥ 768px
        ───────────────────────────────────────────────── */
        .hr-shapes  { display: none; }
        .hr-notif   { display: none !important; }
        .hr-skills  { display: none !important; }

        .hr-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 100px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(129,140,248,0.2);
          color: rgba(199,210,254,0.65); font-size: 11px; font-weight: 600;
          transition: all 0.3s ease; cursor: default; white-space: nowrap;
        }
        .hr-tag::before { content:''; width:5px; height:5px; border-radius:50%; background:#818cf8; opacity:0.7; flex-shrink:0; }
        .hr-tag:hover { background:rgba(99,102,241,0.15); border-color:rgba(129,140,248,0.5); color:#c7d2fe; transform:translateY(-2px); }

        .hr-skillbar { position: relative; overflow: hidden; }
        .hr-skillbar::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); animation:hr_shimmer 2s ease-in-out infinite; }

        /* ─────────────────────────────────────────────────
           TABLET PORTRAIT  ≥ 600px
        ───────────────────────────────────────────────── */
        @media (min-width: 600px) {
          .hr-grid   { padding: 80px 24px 52px; gap: 20px; }
          .hr-canvas { height: 50vw; max-height: 360px; }
          .hr-hl     { font-size: clamp(1.85rem, 5.5vw, 2.6rem); }
          .hr-stats  { gap: 10px; }
        }

        /* ─────────────────────────────────────────────────
           TABLET LANDSCAPE  ≥ 768px  — 2-column layout
        ───────────────────────────────────────────────── */
        @media (min-width: 768px) {
          .hr-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
            gap: 24px 36px;
            padding: 92px clamp(24px,4vw,60px) 60px;
            align-items: center;
          }
          .hr-canvas { grid-column: 2; grid-row: 1; height: clamp(280px,40vw,460px); max-height: unset; animation: hr_fadeUp 0.9s ease both 0.3s; }
          .hr-text   { grid-column: 1; grid-row: 1; gap: clamp(12px,1.6vw,20px); }
          .hr-stats  { grid-column: 1 / -1; grid-row: 2; grid-template-columns: repeat(4,1fr); gap: clamp(8px,1.2vw,16px); }
          .hr-hl     { font-size: clamp(1.7rem, 2.6vw, 2.7rem); }
          /* show decorative elements on tablet+ */
          .hr-shapes { display: block; }
          .hr-notif  { display: flex !important; }
          .hr-skills { display: block !important; }
        }

        /* ─────────────────────────────────────────────────
           DESKTOP  ≥ 1024px
        ───────────────────────────────────────────────── */
        @media (min-width: 1024px) {
          .hr-grid   { gap: 32px 52px; padding: 104px clamp(32px,5vw,80px) 64px; }
          .hr-canvas { height: clamp(340px,42vw,540px); }
          .hr-hl     { font-size: clamp(2rem, 2.8vw, 3.1rem); white-space: nowrap; }
          .hr-stats  { gap: clamp(10px,1.5vw,20px); }
        }

        @media (min-width: 1280px) { .hr-hl { font-size: 3.1rem; } }

        /* ─────────────────────────────────────────────────
           TINY  ≤ 380px
        ───────────────────────────────────────────────── */
        @media (max-width: 380px) {
          .hr-grid   { padding: 66px 12px 38px; gap: 12px; }
          .hr-canvas { height: 52vw; min-height: 170px; }
          .hr-hl     { font-size: 1.55rem; }
          .hr-stats  { gap: 6px; }
        }
      `}</style>

      <section className="hr-section" id="home">

        {/* Animated grid bg */}
        <div style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",backgroundImage:`linear-gradient(rgba(129,140,248,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.05) 1px,transparent 1px)`,backgroundSize:"60px 60px",animation:"hr_gridMove 8s linear infinite" }}/>

        {/* Noise */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none" }}>
          <filter id="hr_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#hr_noise)"/>
        </svg>

        {/* Radial glows — use % sizes so they never overflow */}
        <div style={{ position:"absolute",top:"18%",left:"28%",width:"min(700px,55vw)",height:"min(700px,55vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.16) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>
        <div style={{ position:"absolute",bottom:"8%",right:"18%",width:"min(500px,40vw)",height:"min(500px,40vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.13) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>
        <div style={{ position:"absolute",top:"55%",left:"5%",width:"min(420px,32vw)",height:"min(420px,32vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(103,232,249,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }}/>

        {/* Orbital rings */}
        <div style={{ position:"absolute",inset:0,zIndex:2 }}><OrbitalRings/></div>

        {/* Floating shapes (desktop only) */}
        <FloatingShapes/>

        {/* ═══ MAIN GRID ═══ */}
        <div className="hr-grid">

          {/* ── 3-D Canvas ── */}
          <div className="hr-canvas">
            <div style={{ position:"absolute",inset:"8%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.3) 0%,rgba(168,85,247,0.14) 40%,transparent 70%)",filter:"blur(30px)",zIndex:0 }}/>
            <ThreeCanvas/>
            <FloatingNotif text="New project launched 🚀" sub="2 min ago"  color="#818cf8" style={{ top:"6%",  left:"-6%",  minWidth:170 }}/>
            <FloatingNotif text="Client approved ✓"       sub="Just now"   color="#34d399" style={{ bottom:"10%",right:"-5%", minWidth:162, animationDelay:"2s" }}/>
          </div>

          {/* ── Text ── */}
          <div className="hr-text">

            {/* Badge */}
            <div style={{ animation:"hr_fadeDown 0.6s ease both 0.1s" }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:100,background:"linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.14))",border:"1px solid rgba(129,140,248,0.33)",color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",animation:"hr_badgePulse 3s ease-in-out infinite" }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 8px #818cf8",animation:"hr_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                Innovating the Future
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.25s" }}>
              <h1 className="hr-hl">
                <span style={{ display:"block" }}>Welcome to</span>
                <span className="l2">IsiTech Innovations</span>
              </h1>
            </div>

            {/* Typewriter + body */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.38s" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap" }}>
                <span style={{ color:"rgba(165,180,252,0.5)",fontSize:"clamp(12px,1.3vw,15px)",fontStyle:"italic",fontWeight:300 }}>We help you</span>
                <span style={{ color:"#818cf8",fontSize:"clamp(13px,1.4vw,16px)",fontWeight:700,minWidth:90 }}>
                  {typedWord}<span style={{ borderRight:"2px solid #818cf8",marginLeft:1,animation:"hr_cursor 1s step-end infinite" }}>&nbsp;</span>
                </span>
              </div>
              <p style={{ color:"rgba(199,210,254,0.6)",fontSize:"clamp(13px,1.5vw,16px)",lineHeight:1.8,fontWeight:400,maxWidth:460,margin:0 }}>
                We build simple, modern digital solutions to help your business grow online — powered by cutting-edge technology.
              </p>
            </div>

            {/* Tech tags */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:7,animation:"hr_fadeUp 0.7s ease both 0.44s" }}>
              {TECH_TAGS.map(t => <span key={t} className="hr-tag">{t}</span>)}
            </div>

            {/* Skill bars — desktop only */}
            <div className="hr-skills" style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(129,140,248,0.15)",borderRadius:14,padding:"14px 16px",animation:"hr_fadeUp 0.7s ease both 0.5s" }}>
              {[{l:"UI/UX Design",p:96,c:"#818cf8"},{l:"Full-Stack Dev",p:92,c:"#c084fc"},{l:"Cloud & DevOps",p:88,c:"#67e8f9"}].map((s,i) => (
                <div key={s.l} style={{ marginBottom:i<2?11:0 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                    <span style={{ color:"rgba(199,210,254,0.65)",fontSize:11,fontWeight:600 }}>{s.l}</span>
                    <span style={{ color:s.c,fontSize:11,fontWeight:700 }}>{s.p}%</span>
                  </div>
                  <div style={{ height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
                    <div className="hr-skillbar" style={{ height:"100%",width:`${s.p}%`,borderRadius:2,background:`linear-gradient(90deg,${s.c}80,${s.c})` }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:10,animation:"hr_fadeUp 0.7s ease both 0.54s" }}>
              {CTA_BUTTONS.map(btn => <CTAButton key={btn.id} button={btn} onClick={handleNav}/>)}
            </div>

            {/* Live metrics */}
            <div style={{ animation:"hr_fadeUp 0.7s ease both 0.9s" }}><LiveMetrics/></div>

            {/* Social proof */}
            <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",animation:"hr_fadeUp 0.7s ease both 0.95s" }}>
              <div style={{ display:"flex" }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:26,height:26,borderRadius:"50%",marginLeft:i===0?0:-8,border:"2px solid #050714",background:`linear-gradient(135deg,${["#6366f1","#8b5cf6","#a855f7","#c084fc","#818cf8"][i]},${["#312e81","#4c1d95","#581c87","#6b21a8","#3730a3"][i]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"rgba(255,255,255,0.85)",fontWeight:700 }}>
                    {["A","B","C","D","E"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:2,marginBottom:2 }}>{[...Array(5)].map((_,i)=><span key={i} style={{ color:"#fbbf24",fontSize:11 }}>★</span>)}</div>
                <span style={{ color:"rgba(165,180,252,0.65)",fontSize:12,fontWeight:500 }}>Trusted by <strong style={{ color:"#a5b4fc" }}>500+</strong> businesses</span>
              </div>
            </div>

          </div>{/* end .hr-text */}

          {/* ── Stats row ── */}
          <div className="hr-stats">
            {STATS.map((s, i) => <StatCard key={s.id} stat={s} index={i}/>)}
          </div>

        </div>{/* end .hr-grid */}

        {/* Scroll indicator */}
        <div style={{ position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:7,animation:"hr_fadeUp 1s ease both 1.3s" }}>
          <span style={{ color:"rgba(165,180,252,0.35)",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600 }}>Scroll</span>
          <div style={{ width:20,height:34,borderRadius:10,border:"1.5px solid rgba(129,140,248,0.25)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:4 }}>
            <div style={{ width:3,height:7,borderRadius:2,background:"#818cf8",animation:"hr_scrollDot 2s ease-in-out infinite" }}/>
          </div>
        </div>

        {/* Fade vignettes */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(transparent,rgba(5,7,20,0.88))",zIndex:5,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:72,background:"linear-gradient(rgba(5,7,20,0.55),transparent)",zIndex:5,pointerEvents:"none" }}/>

      </section>
    </>
  );
};

export default Hero;