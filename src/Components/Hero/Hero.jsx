import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

/* ─── Design Tokens ─────────────────────────────────────────────────── */
const C = {
  bg0: "#080A0F", bg1: "#0D1017", bg2: "#131820", bg3: "#1C2333",
  o1: "#4F8EF7", o2: "#6BA3FF", o3: "#93BBFF", o4: "#2563EB",
  accent: "#38BDF8", accentAlt: "#818CF8",
  tw: "#F8FAFF", ts: "#C8D5F0", tm: "#7A90B8", tf: "#3A4F72",
};

/* ─── Services — full data for the cinematic showcase ───────────────── */
const SERVICES = [
  {
    id: "webdev", label: "Web Development", tag: "Full-Stack", color: "#4F8EF7",
    desc: "Blazing-fast web apps built with React, Next.js and Node.js — shipped to production with zero compromise.",
    pills: ["React", "Next.js", "Node.js", "GraphQL"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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
    id: "uiux", label: "UI / UX Design", tag: "Product Design", color: "#38BDF8",
    desc: "Human-centered design systems and pixel-perfect interfaces that convert visitors into loyal customers.",
    pills: ["Figma", "Design Systems", "Prototyping"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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
    id: "aiml", label: "AI & Machine Learning", tag: "Intelligence", color: "#818CF8",
    desc: "Custom AI models, LLM integrations and intelligent automation that give your business an unfair advantage.",
    pills: ["LLMs", "PyTorch", "MLOps", "RAG"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="5" stroke={c} strokeWidth="2.2" fill="none"/>
        <circle cx="24" cy="24" r="2.2" fill={c}/>
        <circle cx="8" cy="10" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="40" cy="10" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="8" cy="38" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="40" cy="38" r="3.5" stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="24" cy="5"  r="3"   stroke={c} strokeWidth="1.8" fill="none"/>
        <circle cx="24" cy="43" r="3"   stroke={c} strokeWidth="1.8" fill="none"/>
        <line x1="11" y1="12.8" x2="19.5" y2="19.5" stroke={c} strokeWidth="1.6" opacity="0.8"/>
        <line x1="37" y1="12.8" x2="28.5" y2="19.5" stroke={c} strokeWidth="1.6" opacity="0.8"/>
        <line x1="11" y1="35.2" x2="19.5" y2="28.5" stroke={c} strokeWidth="1.6" opacity="0.65"/>
        <line x1="37" y1="35.2" x2="28.5" y2="28.5" stroke={c} strokeWidth="1.6" opacity="0.65"/>
        <line x1="24" y1="8"  x2="24" y2="19" stroke={c} strokeWidth="1.6" opacity="0.55"/>
        <line x1="24" y1="29" x2="24" y2="40" stroke={c} strokeWidth="1.6" opacity="0.55"/>
      </svg>
    ),
  },
  {
    id: "cloud", label: "Cloud & DevOps", tag: "Infrastructure", color: "#4F8EF7",
    desc: "Kubernetes, CI/CD pipelines and multi-cloud architecture built for 99.99% uptime at any scale.",
    pills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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
    id: "mobile", label: "Mobile Development", tag: "iOS & Android", color: "#38BDF8",
    desc: "Native-quality iOS and Android apps built with React Native — one codebase, two platforms, zero slowdown.",
    pills: ["React Native", "Swift", "Expo", "Firebase"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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
    id: "security", label: "Cybersecurity", tag: "Enterprise Security", color: "#818CF8",
    desc: "Zero-trust architecture, penetration testing and compliance frameworks that protect what matters most.",
    pills: ["Zero-Trust", "SOC 2", "Pen Testing", "SIEM"],
    svg: (c, size = 52) => (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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

const STATS = [
  { id: "projects", label: "Projects Shipped", value: "1,200+", icon: "◈", color: C.o1 },
  { id: "clients",  label: "Client Satisfaction", value: "99.9%", icon: "◉", color: C.accent },
  { id: "team",     label: "Engineers Worldwide", value: "180+",  icon: "◎", color: C.accentAlt },
  { id: "uptime",   label: "Platform Uptime", value: "99.99%", icon: "◐", color: C.o2 },
];

const TYPEWRITER_WORDS = ["Scale.", "Innovate.", "Accelerate.", "Transform.", "Dominate."];
const TECH_TAGS = ["React", "Node.js", "AI / ML", "Kubernetes", "Web3", "TypeScript"];
const SKILL_BARS = [
  { l: "Product Engineering", p: 97, c: C.o1 },
  { l: "AI & Data Systems",   p: 94, c: C.accent },
  { l: "Cloud Infrastructure",p: 91, c: C.accentAlt },
];
const AVATAR_COLORS = [
  ["#4F8EF7","#1E3F7A"],["#38BDF8","#0C4A6E"],["#818CF8","#312E81"],
  ["#4F8EF7","#1E3A6A"],["#38BDF8","#0E4F6F"],
];

/* ─── Hooks ─────────────────────────────────────────────────────────── */
const useTypewriter = (words, speed = 80, pause = 1900) => {
  const [st, setSt] = useState({ displayed: "", wordIdx: 0, charIdx: 0, deleting: false });
  useEffect(() => {
    const { wordIdx, charIdx, deleting } = st;
    const cur = words[wordIdx];
    let ms = deleting ? speed / 2 : speed, next;
    if (!deleting && charIdx < cur.length) next = { ...st, charIdx: charIdx + 1, displayed: cur.slice(0, charIdx + 1) };
    else if (!deleting) { ms = pause; next = { ...st, deleting: true }; }
    else if (charIdx > 0) next = { ...st, charIdx: charIdx - 1, displayed: cur.slice(0, charIdx - 1) };
    else next = { displayed: "", wordIdx: (wordIdx + 1) % words.length, charIdx: 0, deleting: false };
    const t = setTimeout(() => setSt(next), ms);
    return () => clearTimeout(t);
  }, [st, words, speed, pause]);
  return st.displayed;
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
    const raw = target.replace(/[^0-9.]/g, "");
    const num = parseFloat(raw);
    if (isNaN(num)) { setCount(num); return; }
    const step = num / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  const suffix = target.replace(/[0-9.,]/g, "");
  const isFloat = target.includes(".");
  const display = typeof count === "number"
    ? (count >= 1 ? (isFloat ? count.toFixed(2) : Math.floor(count).toLocaleString()) : "0") + suffix
    : count + suffix;
  return { ref, display };
};

const useScrolled = (threshold = 80) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
};

/* ─── Cinematic Service Showcase ────────────────────────────────────── */
const SLIDE_DURATION = 3800; // ms each service is shown
const TRANSITION_MS  = 680;  // slide in/out duration

const ServiceShowcase = () => {
  const canvasRef   = useRef(null);
  const wrapRef     = useRef(null);
  // Three.js mutable refs — updated from animate loop, read by React state setter
  const threeRef    = useRef({ wireColor: new THREE.Color("#4F8EF7"), igColor: new THREE.Color("#4F8EF7") });

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [phase, setPhase]           = useState("in");  // "in" | "hold" | "out"
  const [paused, setPaused]         = useState(false);
  const timerRef = useRef(null);

  const svc = SERVICES[activeIdx];

  // ── Slide sequencer ──────────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    // Start: slide in
    setPhase("in");
    // After transition → hold
    const t1 = setTimeout(() => setPhase("hold"), TRANSITION_MS);
    // Before next: slide out
    const t2 = setTimeout(() => setPhase("out"),  SLIDE_DURATION - TRANSITION_MS);
    // Advance to next service
    timerRef.current = setTimeout(() => {
      setActiveIdx(i => (i + 1) % SERVICES.length);
    }, SLIDE_DURATION);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(timerRef.current); };
  }, [activeIdx, paused]);

  // ── Three.js engine ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    let renderer = null, animId = null;

    const getSize = () => ({
      W: canvas.clientWidth  || wrap.clientWidth  || 400,
      H: canvas.clientHeight || wrap.clientHeight || 400,
    });

    const init = () => {
      if (renderer) return;
      const { W, H } = getSize();

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      cam.position.z = 5;

      // Lights
      scene.add(new THREE.AmbientLight(0xd0e8ff, 0.3));
      const pl1 = new THREE.PointLight(0xffffff, 6,  22); pl1.position.set( 3,  3,  3); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xffffff, 3.5,22); pl2.position.set(-3, -2,  2); scene.add(pl2);
      const pl3 = new THREE.PointLight(0xffffff, 2.5,20); pl3.position.set( 0, -3,  1); scene.add(pl3);
      const pl4 = new THREE.PointLight(0xffffff, 2,  18); pl4.position.set(-2,  3, -2); scene.add(pl4);

      // Core morphing icosahedron
      const geo     = new THREE.IcosahedronGeometry(1.1, 2);
      const origPos = new Float32Array(geo.attributes.position.array);
      const tmpPos  = new Float32Array(origPos.length);

      const icoMat  = new THREE.MeshPhongMaterial({
        color: 0x030d1a, emissive: 0x060e1e,
        specular: new THREE.Color("#4F8EF7"), shininess: 260,
        transparent: true, opacity: 0.97,
      });
      const ico  = new THREE.Mesh(geo, icoMat);
      scene.add(ico);

      const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#4F8EF7"), wireframe: true, transparent: true, opacity: 0.22,
      });
      const wire = new THREE.Mesh(geo, wireMat);
      wire.scale.setScalar(1.016);
      scene.add(wire);

      // Inner glow
      const igMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color("#4F8EF7"), emissive: new THREE.Color("#4F8EF7"),
        emissiveIntensity: 0.9, transparent: true, opacity: 0.24,
      });
      const ig = new THREE.Mesh(new THREE.SphereGeometry(0.50, 32, 32), igMat);
      scene.add(ig);

      // Torus rings
      const mkRing = (radius, tube, hex, opacity, rx, ry, rz) => {
        const col = new THREE.Color(hex);
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(radius, tube, 16, 120),
          new THREE.MeshPhongMaterial({
            color: col, emissive: col.clone().multiplyScalar(0.28),
            shininess: 280, transparent: true, opacity,
          })
        );
        m.rotation.set(rx, ry, rz);
        scene.add(m);
        return m;
      };
      const r1 = mkRing(1.85, 0.028, "#4F8EF7", 0.80, Math.PI/2.4, 0, 0);
      const r2 = mkRing(2.25, 0.018, "#38BDF8", 0.46, Math.PI/4,   0, Math.PI/6);
      const r3 = mkRing(2.60, 0.012, "#818CF8", 0.28, Math.PI/5,   0, -Math.PI/4);

      // Particles
      const pCount  = 220;
      const pPos    = new Float32Array(pCount * 3);
      const pColors = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const r = 2.8 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pPos[i*3+2] = r * Math.cos(phi);
        // tinted blue-white
        pColors[i*3]   = 0.6 + Math.random() * 0.4;
        pColors[i*3+1] = 0.7 + Math.random() * 0.3;
        pColors[i*3+2] = 1.0;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.042, transparent: true, opacity: 0.80, vertexColors: true,
      })));

      // Store mutable refs so color lerp can be driven by activeIdx state
      threeRef.current = { icoMat, wireMat, igMat, pl1, pl2, pl3, pl4, r1, r2, r3 };

      let tmx = 0, tmy = 0, mx = 0, my = 0;
      const onMouse = e => { tmx = (e.clientX/window.innerWidth-0.5)*2; tmy = -(e.clientY/window.innerHeight-0.5)*2; };
      const onTouch = e => { if(!e.touches[0])return; tmx=(e.touches[0].clientX/window.innerWidth-0.5)*2; tmy=-(e.touches[0].clientY/window.innerHeight-0.5)*2; };
      const onResize = () => { if(!renderer)return; const{W,H}=getSize(); renderer.setSize(W,H); cam.aspect=W/H; cam.updateProjectionMatrix(); };
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("resize",    onResize);

      const targetColor = new THREE.Color("#4F8EF7");
      const currentColor = new THREE.Color("#4F8EF7");
      const t0 = performance.now();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now() - t0) * 0.001;
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;

        // Read the current service color from the DOM dataset (set by React effect below)
        const hexTarget = canvas.dataset.serviceColor || "#4F8EF7";
        targetColor.set(hexTarget);
        currentColor.lerp(targetColor, 0.04); // smooth color transition

        // Apply color to materials
        wireMat.color.copy(currentColor);
        igMat.color.copy(currentColor);
        igMat.emissive.copy(currentColor);
        icoMat.specular.copy(currentColor);
        pl1.color.copy(currentColor);
        pl2.color.copy(currentColor);
        pl3.color.copy(currentColor);

        // Morph
        for (let i = 0; i < origPos.length; i += 3) {
          const ox = origPos[i], oy = origPos[i+1], oz = origPos[i+2];
          const len  = Math.sqrt(ox*ox + oy*oy + oz*oz);
          const wave = Math.sin(t * 1.4 + ox * 2.1 + oy * 1.7) * 0.055;
          const sc   = (1.1 + wave) / len;
          tmpPos[i]   = ox*sc; tmpPos[i+1] = oy*sc; tmpPos[i+2] = oz*sc;
        }
        geo.attributes.position.array.set(tmpPos);
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();

        ico.rotation.x  = t * 0.14 + my * 0.26;
        ico.rotation.y  = t * 0.20 + mx * 0.26;
        wire.rotation.x = ico.rotation.x;
        wire.rotation.y = ico.rotation.y;
        r1.rotation.z   = t * 0.17;
        r2.rotation.x   = Math.PI/4 + t * 0.12;
        r2.rotation.z   = Math.PI/6 + t * 0.08;
        r3.rotation.y   = t * 0.10;
        r3.rotation.z   = -Math.PI/4 + t * 0.07;
        ig.scale.setScalar(1 + Math.sin(t * 1.8) * 0.13);
        pl1.position.set(Math.sin(t*0.48)*4, Math.cos(t*0.38)*3, 3);
        pl4.position.set(Math.cos(t*0.35)*-3, Math.sin(t*0.26)*4, -2);

        renderer.render(scene, cam);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("touchmove", onTouch);
        window.removeEventListener("resize",    onResize);
        renderer.dispose();
        renderer = null;
      };
    };

    let cleanup = null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !cleanup) cleanup = init();
      else if (!e.isIntersecting && cleanup) { cleanup(); cleanup = null; }
    }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); cleanup?.(); };
  }, []); // only runs once

  // Push current service color into canvas dataset so animate loop can read it
  useEffect(() => {
    if (canvasRef.current) canvasRef.current.dataset.serviceColor = SERVICES[activeIdx].color;
  }, [activeIdx]);

  // Slide animation state
  const isIn  = phase === "in";
  const isOut = phase === "out";
  const slideStyle = {
    transform:  isIn  ? "translateX(0) scale(1)"      : isOut ? "translateX(-40px) scale(0.97)"  : "translateX(0) scale(1)",
    opacity:    isIn  ? 1                              : isOut ? 0                                : 1,
    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1), opacity ${TRANSITION_MS}ms ease`,
  };

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* ── Service info overlay ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "clamp(14px,3vw,28px)",
      }}>
        {/* Gradient scrim so text is always readable */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: "65%",
          background: "linear-gradient(to top, rgba(8,10,15,0.96) 0%, rgba(8,10,15,0.70) 55%, transparent 100%)",
          borderRadius: "0 0 16px 16px",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2, ...slideStyle }}>
          {/* Service tag pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px", borderRadius: 6, marginBottom: 10,
            background: `${svc.color}18`,
            border: `1px solid ${svc.color}55`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: svc.color, display: "inline-block", flexShrink: 0, boxShadow: `0 0 6px ${svc.color}` }} />
            <span style={{ color: svc.color, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{svc.tag}</span>
          </div>

          {/* Icon + Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{
              background: `${svc.color}18`,
              border: `1.5px solid ${svc.color}55`,
              borderRadius: 12,
              padding: 10,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              flexShrink: 0,
              boxShadow: `0 0 18px ${svc.color}35`,
            }}>
              {svc.svg(svc.color, 36)}
            </div>
            <h3 style={{
              margin: 0,
              fontFamily: "'Sora',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.1rem,3vw,1.55rem)",
              color: "#F8FAFF",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: `0 0 30px ${svc.color}60`,
            }}>
              {svc.label}
            </h3>
          </div>

          {/* Description */}
          <p style={{
            margin: "0 0 12px",
            color: "#C8D5F0",
            fontSize: "clamp(11px,1.5vw,13px)",
            lineHeight: 1.7,
            fontFamily: "'DM Sans',sans-serif",
            maxWidth: 340,
            fontWeight: 400,
          }}>
            {svc.desc}
          </p>

          {/* Tech pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {svc.pills.map(p => (
              <span key={p} style={{
                padding: "3px 9px", borderRadius: 5,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#7A90B8",
                fontSize: 10, fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.04em",
              }}>{p}</span>
            ))}
          </div>
        </div>

        {/* ── Progress dots / nav ── */}
        <div style={{
          position: "absolute", bottom: "clamp(14px,2.5vw,22px)", right: "clamp(14px,2.5vw,22px)",
          zIndex: 10, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
          pointerEvents: "auto",
        }}>
          {/* Counter */}
          <span style={{ color: C.tm, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", fontFamily: "'DM Sans',sans-serif" }}>
            {String(activeIdx + 1).padStart(2,"0")} / {String(SERVICES.length).padStart(2,"0")}
          </span>
          {/* Dot nav */}
          <div style={{ display: "flex", gap: 6 }}>
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveIdx(i); setPhase("in"); }}
                style={{
                  width: i === activeIdx ? 22 : 7,
                  height: 7, borderRadius: 4,
                  background: i === activeIdx ? svc.color : "rgba(255,255,255,0.18)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                  boxShadow: i === activeIdx ? `0 0 8px ${svc.color}90` : "none",
                }}
                aria-label={`Show ${s.label}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        {!paused && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
            <div
              key={activeIdx}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${svc.color}80, ${svc.color})`,
                animation: `it_progressBar ${SLIDE_DURATION}ms linear forwards`,
                borderRadius: 2,
              }}
            />
          </div>
        )}

        {/* Pause indicator */}
        {paused && (
          <div style={{
            position: "absolute", top: 14, left: 14, zIndex: 10,
            padding: "4px 10px", borderRadius: 6,
            background: "rgba(8,10,15,0.85)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: C.tm, fontSize: 9, fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.12em",
          }}>
            ⏸ PAUSED
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Live Metrics Bar ───────────────────────────────────────────────── */
const LiveMetrics = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2400);
    return () => clearInterval(t);
  }, []);
  const metrics = useMemo(() => [
    { l: "Latency", v: `${(28 + Math.sin(tick * 0.9) * 6).toFixed(0)}ms`, c: C.o1 },
    { l: "Uptime",  v: "99.99%",                                            c: C.accent },
    { l: "Online",  v: `${(18_420 + (tick * 23) % 600).toLocaleString()}`, c: C.accentAlt },
  ], [tick]);
  return (
    <div style={{ display: "flex", gap: "clamp(10px,2vw,24px)", flexWrap: "wrap", alignItems: "center" }}>
      {metrics.map(m => (
        <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.c, boxShadow: `0 0 7px ${m.c}`, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: C.tm, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.l}</span>
          <span style={{ color: m.c, fontSize: 11, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{m.v}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────────────── */
const StatCard = ({ stat, index }) => {
  const [hov, setHov] = useState(false);
  const { ref, display } = useCounter(stat.value);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animation: `it_fadeUp 0.6s ease both ${0.55 + index * 0.1}s`,
        background: hov ? C.bg3 : C.bg2,
        border: hov ? `1px solid ${stat.color}55` : "1px solid rgba(255,255,255,0.06)",
        transform: hov ? "translateY(-6px) scale(1.04)" : "none",
        transition: "all 0.26s cubic-bezier(0.23,1,0.32,1)",
        borderRadius: 14,
        padding: "clamp(12px,2.2vw,22px) clamp(10px,1.6vw,16px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: hov
          ? `0 16px 48px rgba(0,0,0,0.7),0 0 0 1px ${stat.color}20,inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 2px 12px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.025)`,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${stat.color},transparent)` }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 44, height: 44, background: `radial-gradient(circle at top right,${stat.color}22,transparent 70%)`, borderRadius: "0 14px 0 0" }} />
      {hov && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%,${stat.color}0e,transparent 70%)` }} />}
      <div style={{ fontSize: "clamp(14px,2vw,19px)", color: stat.color, marginBottom: 6, position: "relative", filter: `drop-shadow(0 0 5px ${stat.color}80)` }}>{stat.icon}</div>
      <div style={{ fontSize: "clamp(1.1rem,2.6vw,2rem)", fontWeight: 800, lineHeight: 1, marginBottom: 5, color: C.tw, position: "relative", filter: `drop-shadow(0 0 6px ${stat.color}45)`, fontVariantNumeric: "tabular-nums" }}>{display}</div>
      <div style={{ color: C.tm, fontSize: "clamp(8px,0.95vw,10.5px)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.4, position: "relative" }}>{stat.label}</div>
    </div>
  );
};

/* ─── CTA Button ─────────────────────────────────────────────────────── */
const CTAButton = ({ label, href, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        padding: "13px clamp(20px,3vw,34px)",
        borderRadius: 9, fontWeight: 700,
        fontSize: "clamp(12px,1.35vw,13.5px)",
        letterSpacing: "0.07em", cursor: "pointer",
        transform: hov ? "translateY(-2px) scale(1.03)" : "none",
        transition: "all 0.22s cubic-bezier(0.23,1,0.32,1)",
        outline: "none", textTransform: "uppercase",
        fontFamily: "'DM Sans',sans-serif",
        ...(primary ? {
          background: hov
            ? `linear-gradient(135deg,${C.o2},${C.o1})`
            : `linear-gradient(135deg,${C.o1},${C.o4})`,
          border: "none", color: "#fff",
          boxShadow: hov
            ? `0 14px 42px rgba(79,142,247,0.55),0 0 0 1px rgba(79,142,247,0.4)`
            : `0 6px 22px rgba(79,142,247,0.32)`,
        } : {
          background: hov ? "rgba(79,142,247,0.1)" : "transparent",
          border: `1.5px solid rgba(79,142,247,0.38)`,
          color: C.o1,
          boxShadow: hov ? "0 6px 20px rgba(79,142,247,0.18)" : "none",
        }),
      }}
    >
      {hov && primary && (
        <span style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: "38%",
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
          animation: "it_shimmerBtn 0.65s ease forwards",
          pointerEvents: "none",
        }} />
      )}
      {primary && <span style={{ marginRight: 8, display: "inline-block", animation: "it_arrowPulse 2s ease-in-out infinite" }}>→</span>}
      {label}
    </button>
  );
};

/* ─── Decorative Divider ─────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,${C.o1}45)` }} />
    <div style={{ width: 5, height: 5, background: C.o1, transform: "rotate(45deg)", flexShrink: 0, boxShadow: `0 0 7px ${C.o1}` }} />
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${C.o1}45,transparent)` }} />
  </div>
);

/* ─── Section Label ──────────────────────────────────────────────────── */
const SectionLabel = ({ text }) => (
  <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
    <div style={{ height: 1, background: `linear-gradient(90deg,${C.o1}45,transparent)`, flex: 1 }} />
    <div style={{ width: 4, height: 4, background: C.o1, transform: "rotate(45deg)", flexShrink: 0 }} />
    <span style={{ color: C.tm, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{text}</span>
    <div style={{ width: 4, height: 4, background: C.o1, transform: "rotate(45deg)", flexShrink: 0 }} />
    <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.o1}45)`, flex: 1 }} />
  </div>
);

/* ─── Hexagonal Background Pattern ──────────────────────────────────── */
const HexPattern = () => (
  <svg
    aria-hidden="true"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.045 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hex-pat" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8" />
      </pattern>
      <pattern id="hex-pat2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex-pat)" />
    <rect width="100%" height="100%" fill="url(#hex-pat2)" />
  </svg>
);

/* ─── Orbital Rings SVG Overlay ──────────────────────────────────────── */
const OrbitalRings = () => (
  <svg
    viewBox="0 0 600 600"
    preserveAspectRatio="xMidYMid meet"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.07 }}
  >
    <defs>
      {[["ro1", C.o1], ["ro2", C.accent], ["ro3", C.accentAlt]].map(([id, col]) => (
        <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={col} stopOpacity="0" />
          <stop offset="50%"  stopColor={col} stopOpacity="1" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      ))}
    </defs>
    <ellipse cx="300" cy="300" rx="240" ry="88" fill="none" stroke="url(#ro1)" strokeWidth="1.4">
      <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="14s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="300" cy="300" rx="192" ry="70" fill="none" stroke="url(#ro2)" strokeWidth="1" transform="rotate(60 300 300)">
      <animateTransform attributeName="transform" type="rotate" from="60 300 300" to="420 300 300" dur="10s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="300" cy="300" rx="278" ry="108" fill="none" stroke="url(#ro3)" strokeWidth="0.75" transform="rotate(-30 300 300)">
      <animateTransform attributeName="transform" type="rotate" from="-30 300 300" to="330 300 300" dur="18s" repeatCount="indefinite" />
    </ellipse>
  </svg>
);

/* ─── Floating Notification ──────────────────────────────────────────── */
const FloatingNotif = ({ text, sub, color, delay = 0 }) => (
  <div
    style={{
      backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
      background: "linear-gradient(135deg,rgba(13,16,23,0.96),rgba(19,24,32,0.95))",
      border: `1px solid ${color}50`,
      borderRadius: 10, padding: "10px 14px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: `0 8px 36px rgba(0,0,0,0.65),inset 0 1px 0 rgba(79,142,247,0.1)`,
      animation: `it_floatNotif 6s ease-in-out infinite ${delay}ms`,
      pointerEvents: "none",
    }}
  >
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}`, flexShrink: 0, animation: "it_pulse 2s ease-in-out infinite" }} />
    <div>
      <div style={{ color: C.tw, fontSize: 11, fontWeight: 600, lineHeight: 1.25, whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ color: C.tm, fontSize: 9.5, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);

/* ─── Main Hero ──────────────────────────────────────────────────────── */
const Hero = () => {
  const handleNav = useCallback(href => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const typedWord = useTypewriter(TYPEWRITER_WORDS, 78, 1900);
  const scrolled = useScrolled(80);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillsVisible(true); }, { threshold: 0.35 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');

        @keyframes it_float1{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-14px) rotate(2.5deg)}66%{transform:translateY(-6px) rotate(-1.5deg)}}
        @keyframes it_floatNotif{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes it_pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.2);opacity:1}}
        @keyframes it_fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes it_fadeDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes it_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}
        @keyframes it_arrowPulse{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
        @keyframes it_hexDrift{from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes it_scrollDot{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(11px);opacity:0.2}}
        @keyframes it_gradText{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes it_cursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes it_shimmerBar{0%{transform:translateX(-100%)}100%{transform:translateX(220%)}}
        @keyframes it_shimmerBtn{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(280%) skewX(-12deg)}}
        @keyframes it_borderRot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes it_glowPulse{0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
        @keyframes it_scanDown{0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
        @keyframes it_tagIn{from{opacity:0;transform:translateY(9px) scale(0.88)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes it_diamondSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.14)}100%{transform:rotate(360deg) scale(1)}}
        @keyframes it_blueShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes it_countUp{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        @keyframes it_dotPulse{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        @keyframes it_hexGlow{0%,100%{opacity:0.045}50%{opacity:0.075}}
        @keyframes it_progressBar{from{width:0%}to{width:100%}}

        .it-section{position:relative;width:100%;min-height:100svh;overflow:hidden;background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;}
        .it-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}
        .it-grid{position:relative;z-index:10;display:grid;grid-template-columns:1fr;gap:18px;width:100%;max-width:1440px;margin:0 auto;padding:clamp(72px,14vw,92px) clamp(16px,4vw,28px) clamp(48px,8vw,64px);align-items:start;}
        .it-canvas-wrap{grid-row:1;position:relative;width:100%;height:clamp(240px,65vw,370px);}
        .it-canvas-card{width:100%;height:100%;border-radius:18px;overflow:hidden;border:1px solid rgba(79,142,247,0.28);position:relative;animation:it_glowPulse 4s ease-in-out infinite;}
        .it-text{grid-row:2;display:flex;flex-direction:column;gap:15px;min-width:0;}
        .it-stats{grid-row:3;display:grid;grid-template-columns:repeat(2,1fr);gap:9px;}
        .it-hl{font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:#F8FAFF;margin:0;font-size:clamp(1.75rem,7.8vw,2.35rem);}
        .it-hl .accent{display:block;background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:it_gradText 5s ease infinite;filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));}
        .it-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:6px;background:rgba(79,142,247,0.07);border:1px solid rgba(79,142,247,0.2);color:rgba(248,250,255,0.6);font-size:11px;font-weight:600;transition:all 0.22s cubic-bezier(0.23,1,0.32,1);cursor:default;white-space:nowrap;}
        .it-tag::before{content:'';width:4px;height:4px;border-radius:50%;background:#4F8EF7;opacity:0.7;flex-shrink:0;}
        .it-tag:hover{background:rgba(79,142,247,0.16);border-color:rgba(79,142,247,0.5);color:#F8FAFF;transform:translateY(-2px);box-shadow:0 4px 14px rgba(79,142,247,0.18);}
        .it-skillbar-inner{position:relative;overflow:hidden;}
        .it-skillbar-inner::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(180,210,255,0.4),transparent);animation:it_shimmerBar 2.4s ease-in-out infinite;}
        .it-blue-shimmer{background:linear-gradient(90deg,#93BBFF,#4F8EF7,#38BDF8,#818CF8,#93BBFF);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:it_blueShimmer 3.2s linear infinite;}

        /* Floating elements hidden on mobile */
        .it-shapes{display:none !important;}
        .it-notif{display:none !important;}
        .it-skills{display:none !important;}
        .it-float-notifs{display:none !important;}
        .it-data-badge{display:none !important;}

        /* Accessibility */
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        @media(max-width:380px){
          .it-grid{padding:64px 10px 38px;gap:12px;}
          .it-canvas-wrap{height:clamp(200px,62vw,250px);}
          .it-hl{font-size:1.55rem;}
          .it-stats{gap:7px;}
        }
        @media(min-width:480px){
          .it-canvas-wrap{height:clamp(270px,58vw,340px);}
          .it-hl{font-size:clamp(1.9rem,6.8vw,2.25rem);}
        }
        @media(min-width:600px){
          .it-grid{padding:84px clamp(20px,4vw,44px) 54px;gap:20px;}
          .it-canvas-wrap{height:clamp(310px,54vw,390px);}
          .it-hl{font-size:clamp(2rem,5.9vw,2.45rem);}
        }
        @media(min-width:768px){
          .it-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:26px clamp(24px,3.8vw,48px);padding:100px clamp(28px,5vw,64px) 68px;align-items:center;}
          .it-canvas-wrap{grid-column:2;grid-row:1/3;height:clamp(370px,50vw,620px);animation:it_fadeUp 0.9s ease both 0.25s;}
          .it-text{grid-column:1;grid-row:1;gap:clamp(14px,1.9vw,22px);}
          .it-stats{grid-column:1/-1;grid-row:2;grid-template-columns:repeat(4,1fr);gap:clamp(9px,1.3vw,18px);}
          .it-hl{font-size:clamp(2rem,3vw,3.1rem);}
          .it-shapes{display:block !important;}
          .it-notif{display:flex !important;}
          .it-skills{display:block !important;}
          .it-float-notifs{display:contents !important;}
          .it-data-badge{display:flex !important;}
        }
        @media(min-width:1024px){
          .it-grid{gap:34px 60px;padding:116px clamp(36px,5.5vw,88px) 76px;}
          .it-canvas-wrap{height:clamp(450px,47vw,660px);}
          .it-hl{font-size:clamp(2.25rem,3.1vw,3.4rem);}
          .it-stats{gap:clamp(12px,1.6vw,22px);}
        }
        @media(min-width:1280px){
          .it-hl{font-size:3.4rem;}
          .it-canvas-wrap{height:clamp(520px,49vw,740px);}
        }
      `}</style>

      <section className="it-section" id="home" aria-label="IsiTech Innovations Hero">

        {/* Hex Pattern Background */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", animation: "it_hexDrift 16s linear infinite" }}>
          <HexPattern />
        </div>

        {/* Noise grain */}
        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.025, pointerEvents: "none" }}>
          <filter id="it_n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#it_n)" />
        </svg>

        {/* Scanline */}
        <div className="it-scanline" aria-hidden="true" />

        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: "absolute", top: "12%", left: "24%", width: "min(700px,55vw)", height: "min(700px,55vw)", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)", pointerEvents: "none", zIndex: 1 }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: "4%", right: "10%", width: "min(500px,40vw)", height: "min(500px,40vw)", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)", pointerEvents: "none", zIndex: 1 }} />
        <div aria-hidden="true" style={{ position: "absolute", top: "55%", left: "5%", width: "min(360px,30vw)", height: "min(360px,30vw)", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(129,140,248,0.05) 0%,transparent 68%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Orbital rings overlay */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2 }}><OrbitalRings /></div>

        {/* Floating geometric shapes */}
        <div className="it-shapes" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
          <svg width="80" height="80" viewBox="0 0 120 120" style={{ position: "absolute", top: "7%", left: "3%", animation: "it_float1 7.5s ease-in-out infinite", filter: `drop-shadow(0 0 16px ${C.o1}55)` }}>
            <defs><linearGradient id="itsh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.o2} /><stop offset="100%" stopColor={C.accentAlt} /></linearGradient></defs>
            <polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#itsh1)" strokeWidth="1.4" opacity="0.7" />
          </svg>
          <svg width="58" height="58" viewBox="0 0 90 90" style={{ position: "absolute", bottom: "8%", right: "4%", animation: "it_float1 11s ease-in-out infinite reverse", filter: `drop-shadow(0 0 10px ${C.accent}50)` }}>
            <polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65" />
          </svg>
          <svg width="44" height="44" viewBox="0 0 60 60" style={{ position: "absolute", top: "35%", left: "1%", animation: "it_float1 9s ease-in-out infinite 2s" }}>
            <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke={C.accentAlt} strokeWidth="1" opacity="0.4" transform="rotate(22 30 30)" />
          </svg>
        </div>

        <div className="it-grid">

          {/* ── CANVAS COLUMN ── */}
          <div className="it-canvas-wrap">
            {/* Conic border */}
            <div aria-hidden="true" style={{ position: "absolute", inset: -2, borderRadius: 20, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", inset: -2, borderRadius: 22, background: `conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`, animation: "it_borderRot 11s linear infinite" }} />
            </div>

            <div className="it-canvas-card" style={{ zIndex: 1 }}>
              {/* Inner glow */}
              <div aria-hidden="true" style={{ position: "absolute", inset: "10%", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(79,142,247,0.20) 0%,rgba(56,189,248,0.06) 40%,transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />

              {/* Scan line */}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 6, overflow: "hidden", pointerEvents: "none", borderRadius: 18 }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`, animation: "it_scanDown 5.5s linear infinite", opacity: 0.5 }} />
              </div>

              {/* Corner brackets */}
              {[
                { top: 12, left: 12,  borderTop:    `2px solid ${C.o1}90`, borderLeft:  `2px solid ${C.o1}90` },
                { top: 12, right: 12, borderTop:    `2px solid ${C.accent}90`, borderRight: `2px solid ${C.accent}90` },
                { bottom: 12, left: 12, borderBottom: `2px solid ${C.accentAlt}90`, borderLeft: `2px solid ${C.accentAlt}90` },
                { bottom: 12, right: 12, borderBottom: `2px solid ${C.o1}90`, borderRight: `2px solid ${C.o1}90` },
              ].map((s, i) => (
                <div key={i} aria-hidden="true" style={{ position: "absolute", width: 22, height: 22, zIndex: 7, ...s }} />
              ))}

              {/* Live badge */}
              <div style={{ position: "absolute", top: 14, left: 14, zIndex: 8, display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 7, background: "rgba(8,10,15,0.92)", backdropFilter: "blur(14px)", border: `1px solid rgba(79,142,247,0.35)` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.o1, boxShadow: `0 0 9px ${C.o1}`, animation: "it_pulse 2s ease-in-out infinite", display: "inline-block", flexShrink: 0 }} />
                <span style={{ color: C.o1, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Our Services</span>
              </div>

              <ServiceShowcase />
            </div>

            {/* Floating notifs */}
            <div className="it-float-notifs" style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "5%", left: "-10%" }}>
                <FloatingNotif text="Production deploy ✓" sub="30s ago — 0 errors" color={C.o1} delay={0} />
              </div>
              <div style={{ position: "absolute", bottom: "9%", right: "-10%" }}>
                <FloatingNotif text="New enterprise client" sub="Just now · $240k ARR" color={C.accent} delay={2200} />
              </div>
            </div>
          </div>

          {/* ── TEXT COLUMN ── */}
          <div className="it-text">

            {/* Badge */}
            <div style={{ animation: "it_fadeDown 0.6s ease both 0.08s" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 16px", borderRadius: 7,
                background: "rgba(79,142,247,0.1)", border: `1px solid rgba(79,142,247,0.32)`,
                color: C.o2, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                animation: "it_badgePulse 3.2s ease-in-out infinite", boxShadow: "0 0 18px rgba(79,142,247,0.12)",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.o1, boxShadow: `0 0 9px ${C.o1}`, animation: "it_pulse 2s ease-in-out infinite", display: "inline-block", flexShrink: 0 }} />
                Building the Future of Tech
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: "it_fadeUp 0.7s ease both 0.2s" }}>
              <h1 className="it-hl">
                <span style={{ display: "block", color: C.tm, fontSize: "0.62em", fontWeight: 400, marginBottom: 5, letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif" }}>Welcome to</span>
                <span style={{ display: "block", color: C.tw }}>IsiTech</span>
                <span className="accent">Innovations</span>
              </h1>
            </div>

            <div style={{ animation: "it_fadeUp 0.6s ease both 0.28s" }}><Divider /></div>

            {/* Typewriter + description */}
            <div style={{ animation: "it_fadeUp 0.7s ease both 0.34s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ color: C.tm, fontSize: "clamp(12px,1.3vw,15px)", fontWeight: 400 }}>We help you</span>
                <span className="it-blue-shimmer" style={{ fontSize: "clamp(13px,1.45vw,16px)", fontWeight: 700, minWidth: 90 }}>
                  {typedWord}<span style={{ borderRight: `2.5px solid ${C.o1}`, marginLeft: 1, animation: "it_cursor 1s step-end infinite" }}>&nbsp;</span>
                </span>
              </div>
              <p style={{ color: C.tm, fontSize: "clamp(13px,1.45vw,15.5px)", lineHeight: 1.88, fontWeight: 400, maxWidth: 500, margin: 0 }}>
                We engineer <span style={{ color: C.tw, fontWeight: 600 }}>enterprise-grade digital solutions</span> that propel ambitious companies forward — powered by <span style={{ color: C.accent }}>AI, cloud-native infrastructure</span> and human-centered design.
              </p>
            </div>

            {/* Tech tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, animation: "it_fadeUp 0.7s ease both 0.42s" }}>
              {TECH_TAGS.map((tag, i) => (
                <span
                  key={tag}
                  className="it-tag"
                  style={{ animationName: "it_tagIn", animationDuration: "0.5s", animationFillMode: "both", animationTimingFunction: "cubic-bezier(0.23,1,0.32,1)", animationDelay: `${0.5 + i * 0.06}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Skill bars */}
            <div ref={skillsRef} className="it-skills" style={{ background: C.bg2, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", animation: "it_fadeUp 0.7s ease both 0.5s" }}>
              <div style={{ color: C.tf, fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 14 }}>Core Expertise</div>
              {SKILL_BARS.map((s, i) => (
                <div key={s.l} style={{ marginBottom: i < SKILL_BARS.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: C.ts, fontSize: 11, fontWeight: 600 }}>{s.l}</span>
                    <span style={{ color: s.c, fontSize: 11, fontWeight: 800 }}>{s.p}%</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.055)", overflow: "hidden" }}>
                    <div
                      className="it-skillbar-inner"
                      style={{
                        height: "100%", borderRadius: 2,
                        background: `linear-gradient(90deg,${s.c}70,${s.c})`,
                        width: skillsVisible ? `${s.p}%` : "0%",
                        transition: `width 1.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.15}s`,
                        boxShadow: `0 0 7px ${s.c}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 11, animation: "it_fadeUp 0.7s ease both 0.54s" }}>
              <CTAButton label="Get Started" href="#contact" primary onClick={handleNav} />
              <CTAButton label="Our Work" href="#projects" primary={false} onClick={handleNav} />
            </div>

            {/* Live metrics */}
            <div style={{ animation: "it_fadeUp 0.7s ease both 0.84s" }}><LiveMetrics /></div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", animation: "it_fadeUp 0.7s ease both 0.9s" }}>
              <div style={{ display: "flex" }}>
                {AVATAR_COLORS.map(([from, to], i) => (
                  <div key={i} style={{
                    width: 29, height: 29, borderRadius: "50%",
                    marginLeft: i === 0 ? 0 : "-10px",
                    border: `2px solid ${C.bg1}`,
                    background: `linear-gradient(135deg,${from},${to})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: "#fff", fontWeight: 800, flexShrink: 0,
                    boxShadow: `0 0 5px ${from}45`,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: C.o1, fontSize: 12, filter: `drop-shadow(0 0 4px ${C.o1}70)` }}>★</span>
                  ))}
                </div>
                <span style={{ color: C.tm, fontSize: 12, fontWeight: 500 }}>
                  Trusted by <strong style={{ color: C.tw }}>1,200+</strong> companies worldwide
                </span>
              </div>
              <div className="it-data-badge" style={{
                alignItems: "center", gap: 6, padding: "5px 12px",
                borderRadius: 7, background: "rgba(79,142,247,0.09)", border: "1px solid rgba(79,142,247,0.26)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.o1, boxShadow: `0 0 9px ${C.o1}`, animation: "it_pulse 2s ease-in-out infinite", display: "inline-block", flexShrink: 0 }} />
                <span style={{ color: C.o1, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>AVAILABLE NOW</span>
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="it-stats" role="list" aria-label="Company statistics">
            <SectionLabel text="By The Numbers" />
            {STATS.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
          animation: "it_fadeUp 1s ease both 1.35s",
          opacity: scrolled ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: "none",
        }}>
          <div style={{ width: 5, height: 5, background: C.o1, transform: "rotate(45deg)", animation: "it_diamondSpin 4s ease-in-out infinite", boxShadow: `0 0 9px ${C.o1}` }} />
          <span style={{ color: C.tf, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600 }}>Scroll</span>
          <div style={{ width: 20, height: 34, borderRadius: 10, border: "1.5px solid rgba(79,142,247,0.28)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 4 }}>
            <div style={{ width: 3, height: 7, borderRadius: 2, background: C.o1, animation: "it_scrollDot 2s ease-in-out infinite", boxShadow: `0 0 5px ${C.o1}` }} />
          </div>
        </div>

        {/* Fade overlays */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "linear-gradient(transparent,rgba(8,10,15,0.97))", zIndex: 5, pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 76, background: "linear-gradient(rgba(8,10,15,0.55),transparent)", zIndex: 5, pointerEvents: "none" }} />
      </section>
    </>
  );
};

export default Hero;