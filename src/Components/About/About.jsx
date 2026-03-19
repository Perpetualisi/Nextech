import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ─── Design Tokens (mirrors Hero exactly) ───────────────────────────── */
const C = {
  bg0: "#080A0F", bg1: "#0D1017", bg2: "#131820", bg3: "#1C2333",
  o1: "#4F8EF7", o2: "#6BA3FF", o3: "#93BBFF", o4: "#2563EB",
  accent: "#38BDF8", accentAlt: "#818CF8",
  tw: "#F8FAFF", ts: "#C8D5F0", tm: "#7A90B8", tf: "#3A4F72",
};

/* ─── Content ────────────────────────────────────────────────────────── */
const ABOUT = {
  badge: "Who We Are",
  tagline: "We don't just build products — we engineer digital legacies.",
  description: [
    "At IsiTech Innovations, we architect transformative digital ecosystems that captivate audiences, drive conversions, and propel brands into their next era of growth.",
    "With deep expertise spanning industries, we've partnered with visionary startups and Fortune 500 enterprises alike — unlocking unprecedented digital growth through strategic design, intelligent technology, and measurable outcomes.",
    "Our philosophy is human-first: boundless creativity married to emerging tech, solving complex business challenges with clarity and conviction.",
  ],
  highlights: [
    { icon: "⬡", label: "Human-First Design",   desc: "Every pixel serves a purpose" },
    { icon: "◈", label: "Full-Stack Mastery",    desc: "From concept to deployment" },
    { icon: "◉", label: "AI-Powered Solutions",  desc: "Intelligence built in by default" },
    { icon: "◎", label: "Measurable Results",    desc: "Data-driven & outcome-focused" },
  ],
  stats: [
    { value: "8+",   label: "Years Experience",    color: C.accentAlt },
    { value: "1200+",label: "Projects Delivered",  color: C.o1 },
    { value: "99%",  label: "Client Retention",    color: C.accent },
    { value: "180+", label: "Expert Engineers",    color: C.o2 },
  ],
  tabs: ["Our Story", "Our Values", "Our Process"],
  tabContent: [
    "Founded on the belief that technology should empower people, IsiTech Innovations has grown from a small creative studio to a full-service digital powerhouse trusted by brands across 30+ countries. Every engagement starts with deep listening and ends with measurable impact.",
    "We operate on four pillars: radical transparency, relentless innovation, human-centered design, and outcome-driven execution. These aren't buzzwords — they're the standards we hold ourselves to on every project, every day.",
    "Discovery → Strategy → Design → Build → Launch → Optimize. Our six-phase process ensures nothing is left to chance. Each phase has defined deliverables, clear milestones, and regular client checkpoints so you're always in control.",
  ],
  skillBars: [
    { label: "UI/UX & Branding",   pct: 96, color: C.o1 },
    { label: "Full-Stack Dev",     pct: 93, color: C.accent },
    { label: "Cloud & DevOps",     pct: 89, color: C.accentAlt },
    { label: "AI Integration",     pct: 85, color: C.o2 },
  ],
  avatarColors: [
    ["#4F8EF7","#1E3F7A"],["#38BDF8","#0C4A6E"],["#818CF8","#312E81"],
    ["#4F8EF7","#1E3A6A"],["#38BDF8","#0E4F6F"],
  ],
};

/* ─── Hooks ──────────────────────────────────────────────────────────── */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const useCounter = (target, duration = 1800, active = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;
    const step = num / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setVal(cur);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  const suffix = target.replace(/[0-9.,]/g, "");
  const isFloat = target.includes(".");
  return (val >= 1 ? (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) : "0") + suffix;
};

/* ─── IsiTech Identity Graph — "Who We Are" 3D scene ───────────────── */
//
// Centre:  IsiTech logo-sphere (morphing icosahedron)
// Pillars: 4 orbiting pillar nodes with HTML label overlays
//          projected from 3D world-space each frame
// Pulses:  data-flow particles travel from centre → each pillar
// Stats:   4 secondary mini-nodes carrying live numbers
//
const PILLARS = [
  { label: "Human-First",  sub: "Design",          color: "#4F8EF7", hex: 0x4F8EF7, angle: 0          },
  { label: "Full-Stack",   sub: "Engineering",      color: "#38BDF8", hex: 0x38BDF8, angle: Math.PI/2  },
  { label: "AI-Powered",   sub: "Intelligence",     color: "#818CF8", hex: 0x818CF8, angle: Math.PI    },
  { label: "Measurable",   sub: "Results",          color: "#6BA3FF", hex: 0x6BA3FF, angle: 3*Math.PI/2},
];
const STAT_NODES = [
  { label: "8+ yrs",    color: "#38BDF8", angle: Math.PI/4       },
  { label: "1200+",     color: "#4F8EF7", angle: 3*Math.PI/4     },
  { label: "99%",       color: "#818CF8", angle: 5*Math.PI/4     },
  { label: "180 eng",   color: "#6BA3FF", angle: 7*Math.PI/4     },
];
const ORBIT_R   = 2.6;  // pillar orbit radius
const STAT_R    = 1.55; // stat node orbit radius

const AboutCanvas = () => {
  const mountRef  = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef([]);  // 4 pillar HTML labels
  const statRefs  = useRef([]);  // 4 stat HTML labels

  useEffect(() => {
    const mount  = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;
    let renderer = null, animId = null;

    const init = () => {
      if (renderer) return;
      const W = mount.clientWidth  || 400;
      const H = mount.clientHeight || 400;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      cam.position.set(0, 0.8, 6.5);
      cam.lookAt(0, 0, 0);

      // ── Lights ──────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xd0e8ff, 0.3));
      const pl1 = new THREE.PointLight(0x4F8EF7, 7, 25); pl1.position.set( 4,  4,  4); scene.add(pl1);
      const pl2 = new THREE.PointLight(0x38BDF8, 4, 22); pl2.position.set(-4, -3,  3); scene.add(pl2);
      const pl3 = new THREE.PointLight(0x818CF8, 3, 20); pl3.position.set( 0, -4,  2); scene.add(pl3);

      // ── Centre: IsiTech morphing icosahedron ────────────────────────────
      const coreGeo = new THREE.IcosahedronGeometry(1.0, 2);
      const origPos = new Float32Array(coreGeo.attributes.position.array);
      const tmpPos  = new Float32Array(origPos.length);

      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      coreGroup.add(new THREE.Mesh(coreGeo, new THREE.MeshPhongMaterial({
        color: 0x030d1a, emissive: 0x060e1e,
        specular: new THREE.Color("#4F8EF7"), shininess: 280,
        transparent: true, opacity: 0.97,
      })));
      const wireMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({
        color: 0x4F8EF7, wireframe: true, transparent: true, opacity: 0.18,
      }));
      wireMesh.scale.setScalar(1.015);
      coreGroup.add(wireMesh);
      const igMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x4F8EF7, emissive: 0x4F8EF7, emissiveIntensity: 0.9, transparent: true, opacity: 0.22 })
      );
      coreGroup.add(igMesh);

      // ── Connector ring around centre ─────────────────────────────────────
      const connRing = new THREE.Mesh(
        new THREE.TorusGeometry(ORBIT_R, 0.012, 12, 120),
        new THREE.MeshBasicMaterial({ color: 0x4F8EF7, transparent: true, opacity: 0.18 })
      );
      connRing.rotation.x = Math.PI / 2;
      scene.add(connRing);

      // Tilted accent rings
      [
        { r: ORBIT_R * 0.65, op: 0.12, rx: Math.PI/2.2, rz: 0.4 },
        { r: ORBIT_R * 1.18, op: 0.08, rx: Math.PI/3,   rz: -0.6 },
      ].forEach(d => {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(d.r, 0.008, 10, 90),
          new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: d.op })
        );
        m.rotation.x = d.rx; m.rotation.z = d.rz;
        scene.add(m);
      });

      // ── Pillar nodes (4 orbiting spheres) ──────────────────────────────
      const pillarMeshes = PILLARS.map(p => {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 24, 24),
          new THREE.MeshPhongMaterial({
            color: p.hex, emissive: p.hex, emissiveIntensity: 0.45, shininess: 260,
          })
        );
        // inner glow ring
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.018, 10, 60),
          new THREE.MeshBasicMaterial({ color: p.hex, transparent: true, opacity: 0.5 })
        );
        node.add(ring);
        scene.add(node);
        return node;
      });

      // Lines from centre to each pillar
      const connLines = PILLARS.map(p => {
        const pts = [new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: p.hex, transparent: true, opacity: 0.35,
        }));
        scene.add(line);
        return line;
      });

      // ── Stat mini-nodes (inner orbit) ───────────────────────────────────
      const statMeshes = STAT_NODES.map(s => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 16, 16),
          new THREE.MeshPhongMaterial({ color: s.color, emissive: s.color, emissiveIntensity: 0.6, shininess: 220 })
        );
        scene.add(m);
        return m;
      });

      // ── Pulse particles (travel from centre → pillar) ───────────────────
      // 4 pulses, one per pillar, staggered phases
      const PULSE_COUNT = 4;
      const pulseMeshes = Array.from({ length: PULSE_COUNT }, (_, i) => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 10, 10),
          new THREE.MeshPhongMaterial({
            color: PILLARS[i].hex, emissive: PILLARS[i].hex,
            emissiveIntensity: 1.0, shininess: 300,
          })
        );
        m.userData = { pillarIdx: i, phase: i / PULSE_COUNT };
        scene.add(m);
        return m;
      });

      // ── Ambient particles ────────────────────────────────────────────────
      const pCount  = 180;
      const pPos    = new Float32Array(pCount * 3);
      const pColors = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const r = 3.5 + Math.random() * 1.5;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
        pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pPos[i*3+2] = r * Math.cos(ph);
        pColors[i*3]   = 0.3 + Math.random() * 0.4;
        pColors[i*3+1] = 0.5 + Math.random() * 0.3;
        pColors[i*3+2] = 0.9 + Math.random() * 0.1;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.038, transparent: true, opacity: 0.75, vertexColors: true,
      }));
      scene.add(particles);

      // ── Mouse tilt ────────────────────────────────────────────────────────
      let tmx = 0, tmy = 0, mx = 0, my = 0;
      const onMove = e => {
        const t = e.touches ? e.touches[0] : e;
        tmx = (t.clientX / window.innerWidth  - 0.5) * 2;
        tmy = -(t.clientY / window.innerHeight - 0.5) * 2;
      };
      const onResize = () => {
        const nw = mount.clientWidth, nh = mount.clientHeight;
        renderer.setSize(nw, nh);
        cam.aspect = nw / nh;
        cam.updateProjectionMatrix();
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("resize",    onResize);

      // ── reusable projection vector ────────────────────────────────────────
      const v3 = new THREE.Vector3();
      const t0 = performance.now();

      // ── Animate ──────────────────────────────────────────────────────────
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now() - t0) * 0.001;
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;

        // Slow scene-wide orbit tilt driven by mouse
        scene.rotation.y = mx * 0.22;
        scene.rotation.x = my * 0.12;

        // Morph centre sphere
        for (let i = 0; i < origPos.length; i += 3) {
          const ox = origPos[i], oy = origPos[i+1], oz = origPos[i+2];
          const len  = Math.sqrt(ox*ox + oy*oy + oz*oz);
          const wave = Math.sin(t * 1.3 + ox * 2.0 + oy * 1.6) * 0.05;
          const sc   = (1.0 + wave) / len;
          tmpPos[i]=ox*sc; tmpPos[i+1]=oy*sc; tmpPos[i+2]=oz*sc;
        }
        coreGeo.attributes.position.array.set(tmpPos);
        coreGeo.attributes.position.needsUpdate = true;
        coreGeo.computeVertexNormals();
        coreGroup.rotation.y = t * 0.18;
        coreGroup.rotation.z = Math.sin(t * 0.22) * 0.06;
        igMesh.scale.setScalar(1 + Math.sin(t * 1.9) * 0.12);

        // Orbit connector ring slow spin
        connRing.rotation.z = t * 0.08;

        // Position pillar nodes on orbit ring
        PILLARS.forEach((p, i) => {
          const angle = p.angle + t * 0.15;
          const x = Math.cos(angle) * ORBIT_R;
          const z = Math.sin(angle) * ORBIT_R;
          const y = Math.sin(t * 0.6 + i * 1.2) * 0.18;
          pillarMeshes[i].position.set(x, y, z);
          pillarMeshes[i].rotation.y = t * 0.5;

          // Update connector line geometry
          const pos = connLines[i].geometry.attributes.position;
          pos.setXYZ(0, 0, 0, 0);
          pos.setXYZ(1, x, y, z);
          pos.needsUpdate = true;
        });

        // Stat mini-nodes orbit slightly inside, offset angle
        STAT_NODES.forEach((s, i) => {
          const angle = s.angle + t * 0.22;
          statMeshes[i].position.set(
            Math.cos(angle) * STAT_R,
            Math.sin(t * 0.8 + i) * 0.12,
            Math.sin(angle) * STAT_R
          );
        });

        // Pulse particles travel centre → pillar target
        pulseMeshes.forEach(pm => {
          const pi  = pm.userData.pillarIdx;
          // advance phase 0→1 over ~2s, reset
          pm.userData.phase = (pm.userData.phase + 0.004) % 1;
          const f   = pm.userData.phase;
          const target = pillarMeshes[pi].position;
          pm.position.set(
            target.x * f,
            target.y * f,
            target.z * f
          );
          // fade in then out
          const op = f < 0.5 ? f * 2 : (1 - f) * 2;
          pm.material.opacity = op;
          pm.material.transparent = true;
          pm.scale.setScalar(0.5 + op * 0.8);
        });

        particles.rotation.y = t * 0.025;
        pl1.position.set(Math.sin(t*0.4)*5, Math.cos(t*0.3)*4, 4);
        pl2.position.set(Math.cos(t*0.28)*-5, Math.sin(t*0.44)*-3, 3);

        renderer.render(scene, cam);

        // ── Project pillar & stat nodes to screen for HTML labels ───────────
        const cW = canvas.clientWidth, cH = canvas.clientHeight;
        cam.updateMatrixWorld();

        PILLARS.forEach((_, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          v3.copy(pillarMeshes[i].position).applyEuler(scene.rotation).project(cam);
          const sx = ( v3.x * 0.5 + 0.5) * cW;
          const sy = (-v3.y * 0.5 + 0.5) * cH;
          const depth = (v3.z + 1) * 0.5;
          const sc    = Math.max(0.7, Math.min(1.05, 1.1 - depth * 0.35));
          const op    = Math.max(0.4, Math.min(1, 1.2 - depth * 0.7));
          el.style.left      = (sx - 56) + "px";
          el.style.top       = (sy + 18) + "px";
          el.style.transform = `scale(${sc.toFixed(3)})`;
          el.style.opacity   = op.toFixed(3);
          el.style.visibility = v3.z > 1 ? "hidden" : "visible";
        });

        STAT_NODES.forEach((_, i) => {
          const el = statRefs.current[i];
          if (!el) return;
          v3.copy(statMeshes[i].position).applyEuler(scene.rotation).project(cam);
          const sx = ( v3.x * 0.5 + 0.5) * cW;
          const sy = (-v3.y * 0.5 + 0.5) * cH;
          el.style.left       = (sx - 22) + "px";
          el.style.top        = (sy - 10) + "px";
          el.style.visibility = v3.z > 1 ? "hidden" : "visible";
        });
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("resize",    onResize);
        renderer.dispose();
        renderer = null;
      };
    };

    let doCleanup = null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !doCleanup) doCleanup = init();
      else if (!e.isIntersecting && doCleanup) { doCleanup(); doCleanup = null; }
    }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); doCleanup?.(); };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* IsiTech centre label */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -60px)",
        textAlign: "center", pointerEvents: "none", zIndex: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#4F8EF7", textTransform: "uppercase", fontFamily: "'Sora',sans-serif", textShadow: "0 0 12px #4F8EF7" }}>IsiTech</div>
        <div style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(200,213,240,0.55)", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Innovations</div>
      </div>

      {/* Pillar HTML labels — positioned by JS each frame */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
        {PILLARS.map((p, i) => (
          <div
            key={p.label}
            ref={el => { labelRefs.current[i] = el; }}
            style={{
              position: "absolute", width: 112, textAlign: "center",
              visibility: "hidden",
              transition: "opacity 0.08s linear",
            }}
          >
            <div style={{
              background: "rgba(8,10,15,0.88)",
              border: `1px solid ${p.color}55`,
              borderRadius: 8, padding: "5px 10px",
              backdropFilter: "blur(10px)",
              display: "inline-block",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Sora',sans-serif", whiteSpace: "nowrap" }}>{p.label}</div>
              <div style={{ fontSize: 9, color: "rgba(200,213,240,0.6)", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{p.sub}</div>
            </div>
          </div>
        ))}

        {/* Stat mini-node labels */}
        {STAT_NODES.map((s, i) => (
          <div
            key={s.label}
            ref={el => { statRefs.current[i] = el; }}
            style={{
              position: "absolute", visibility: "hidden",
              background: "rgba(8,10,15,0.82)",
              border: `1px solid ${s.color}40`,
              borderRadius: 5, padding: "2px 7px",
              backdropFilter: "blur(8px)",
              fontSize: 9, fontWeight: 700,
              color: s.color, fontFamily: "'DM Sans',sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Hex Background (same as Hero) ─────────────────────────────────── */
const HexPattern = () => (
  <svg aria-hidden="true" style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.04 }}>
    <defs>
      <pattern id="ab_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8"/>
      </pattern>
      <pattern id="ab_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ab_hex1)"/>
    <rect width="100%" height="100%" fill="url(#ab_hex2)"/>
  </svg>
);

/* ─── Divider (same as Hero) ─────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display:"flex",alignItems:"center",gap:10,margin:"2px 0" }}>
    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.o1}45)` }}/>
    <div style={{ width:5,height:5,background:C.o1,transform:"rotate(45deg)",flexShrink:0,boxShadow:`0 0 7px ${C.o1}` }}/>
    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${C.o1}45,transparent)` }}/>
  </div>
);

/* ─── Stat Card (same structure as Hero StatCard) ────────────────────── */
const StatCard = ({ stat, active, index }) => {
  const [hov, setHov] = useState(false);
  const display = useCounter(stat.value, 1800, active);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex:"1 1 100px", minWidth:90,
        padding:"clamp(12px,2vw,20px) clamp(10px,1.5vw,16px)",
        borderRadius:14,
        background: hov ? C.bg3 : C.bg2,
        border: hov ? `1px solid ${stat.color}55` : "1px solid rgba(255,255,255,0.06)",
        transform: hov ? "translateY(-6px) scale(1.04)" : "none",
        transition:"all 0.26s cubic-bezier(0.23,1,0.32,1)",
        cursor:"default", position:"relative", overflow:"hidden",
        textAlign:"center",
        boxShadow: hov
          ? `0 16px 48px rgba(0,0,0,0.7),0 0 0 1px ${stat.color}20,inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 2px 12px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.025)`,
        animation:`ab_fadeUp 0.6s ease both ${0.55 + index * 0.1}s`,
      }}
    >
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${stat.color},transparent)` }}/>
      <div style={{ position:"absolute",top:0,right:0,width:40,height:40,background:`radial-gradient(circle at top right,${stat.color}22,transparent 70%)`,borderRadius:"0 14px 0 0" }}/>
      {hov && <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${stat.color}0e,transparent 70%)` }}/>}
      <div style={{ fontSize:"clamp(1.1rem,2.6vw,2rem)",fontWeight:800,lineHeight:1,marginBottom:5,color:C.tw,position:"relative",fontFamily:"'Sora',sans-serif",fontVariantNumeric:"tabular-nums",filter:`drop-shadow(0 0 6px ${stat.color}45)` }}>
        {display}
      </div>
      <div style={{ color:C.tm,fontSize:"clamp(8px,0.95vw,10.5px)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",lineHeight:1.4,position:"relative" }}>
        {stat.label}
      </div>
    </div>
  );
};

/* ─── Highlight Card ─────────────────────────────────────────────────── */
const HighlightCard = ({ item, index, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"flex-start", gap:12,
        padding:"13px 15px", borderRadius:12,
        background: hov ? `rgba(79,142,247,0.10)` : C.bg2,
        border: hov ? `1px solid ${C.o1}45` : "1px solid rgba(255,255,255,0.06)",
        transition:"all 0.26s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        cursor:"default",
        animation: visible ? `ab_fadeUp 0.6s ease both ${0.45 + index * 0.08}s` : "none",
        opacity: visible ? 1 : 0,
      }}
    >
      <div style={{
        width:36,height:36,borderRadius:9,flexShrink:0,
        background:`rgba(79,142,247,0.12)`,
        border:`1px solid ${C.o1}35`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:16,color:C.o1,
        boxShadow: hov ? `0 0 14px ${C.o1}35` : "none",
        transition:"box-shadow 0.26s ease",
      }}>
        {item.icon}
      </div>
      <div>
        <div style={{ color:C.ts,fontSize:13,fontWeight:700,marginBottom:2 }}>{item.label}</div>
        <div style={{ color:C.tm,fontSize:11,lineHeight:1.4 }}>{item.desc}</div>
      </div>
    </div>
  );
};

/* ─── CTA Button (same as Hero CTAButton) ────────────────────────────── */
const CTAButton = ({ label, href, primary, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", overflow:"hidden",
        padding:"13px clamp(20px,3vw,32px)",
        borderRadius:9, fontWeight:700,
        fontSize:"clamp(12px,1.35vw,13.5px)",
        letterSpacing:"0.07em", cursor:"pointer",
        transform: hov ? "translateY(-2px) scale(1.03)" : "none",
        transition:"all 0.22s cubic-bezier(0.23,1,0.32,1)",
        outline:"none", textTransform:"uppercase",
        fontFamily:"'DM Sans',sans-serif",
        ...(primary ? {
          background: hov
            ? `linear-gradient(135deg,${C.o2},${C.o1})`
            : `linear-gradient(135deg,${C.o1},${C.o4})`,
          border:"none", color:"#fff",
          boxShadow: hov
            ? `0 14px 42px rgba(79,142,247,0.55),0 0 0 1px rgba(79,142,247,0.4)`
            : `0 6px 22px rgba(79,142,247,0.32)`,
        } : {
          background: hov ? "rgba(79,142,247,0.10)" : "transparent",
          border:`1.5px solid rgba(79,142,247,0.38)`,
          color:C.o1,
          boxShadow: hov ? "0 6px 20px rgba(79,142,247,0.18)" : "none",
        }),
      }}
    >
      {hov && primary && (
        <span style={{ position:"absolute",top:0,left:0,bottom:0,width:"38%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",animation:"ab_shimmerBtn 0.65s ease forwards",pointerEvents:"none" }}/>
      )}
      {primary && <span style={{ marginRight:8,display:"inline-block",animation:"ab_arrowPulse 2s ease-in-out infinite" }}>→</span>}
      {label}
    </button>
  );
};

/* ─── Canvas Card with Hero-style chrome ─────────────────────────────── */
const CanvasColumn = ({ visible }) => (
  <div
    className="ab-canvas-col"
    style={{ animation: visible ? "ab_fadeLeft 0.9s ease both 0.15s" : "none", opacity: visible ? 1 : 0 }}
  >
    {/* Rotating conic border — same as Hero */}
    <div style={{ position:"absolute",inset:-2,borderRadius:20,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      <div style={{ position:"absolute",inset:-2,borderRadius:22,background:`conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`,animation:"ab_borderRot 11s linear infinite" }}/>
    </div>

    <div className="ab-canvas-card" style={{ position:"relative",zIndex:1 }}>
      {/* Inner radial glow */}
      <div style={{ position:"absolute",inset:"10%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.20) 0%,rgba(56,189,248,0.06) 40%,transparent 70%)",filter:"blur(30px)",zIndex:0 }}/>

      {/* Scan line — same as Hero */}
      <div style={{ position:"absolute",inset:0,zIndex:6,overflow:"hidden",pointerEvents:"none",borderRadius:18 }}>
        <div style={{ position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`,animation:"ab_scanDown 5.5s linear infinite",opacity:0.5 }}/>
      </div>

      {/* Corner brackets — same as Hero */}
      {[
        { top:12,left:12,   borderTop:`2px solid ${C.o1}90`,   borderLeft:`2px solid ${C.o1}90`   },
        { top:12,right:12,  borderTop:`2px solid ${C.accent}90`,borderRight:`2px solid ${C.accent}90` },
        { bottom:12,left:12, borderBottom:`2px solid ${C.accentAlt}90`,borderLeft:`2px solid ${C.accentAlt}90` },
        { bottom:12,right:12,borderBottom:`2px solid ${C.o1}90`, borderRight:`2px solid ${C.o1}90` },
      ].map((s,i) => (
        <div key={i} aria-hidden="true" style={{ position:"absolute",width:22,height:22,zIndex:7,...s }}/>
      ))}

      {/* Live badge — same style as Hero */}
      <div style={{ position:"absolute",top:14,left:14,zIndex:8,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,background:"rgba(8,10,15,0.92)",backdropFilter:"blur(14px)",border:`1px solid rgba(79,142,247,0.35)` }}>
        <span style={{ width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
        <span style={{ color:C.o1,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase" }}>Live 3D</span>
      </div>

      {/* Bottom label */}
      <div style={{ position:"absolute",bottom:14,right:14,zIndex:8,padding:"4px 10px",borderRadius:7,background:"rgba(8,10,15,0.82)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ color:C.tf,fontSize:9,fontWeight:600,letterSpacing:"0.1em" }}>DRAG TO INTERACT</span>
      </div>

      <AboutCanvas/>
    </div>
  </div>
);

/* ─── Main About Section ─────────────────────────────────────────────── */
const About = () => {
  const { ref: sectionRef, visible } = useInView(0.08);
  const [activeTab, setActiveTab] = useState(0);

  const handleNav = useCallback(href => {
    document.querySelector(href)?.scrollIntoView({ behavior:"smooth", block:"start" });
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}

        /* ── Keyframes (prefixed ab_ to avoid Hero conflicts) ── */
        @keyframes ab_fadeUp    {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ab_fadeLeft  {from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ab_fadeRight {from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ab_float1    {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-13px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
        @keyframes ab_pulse     {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.2);opacity:1}}
        @keyframes ab_borderRot {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ab_glowPulse {0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
        @keyframes ab_scanDown  {0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
        @keyframes ab_shimmerBar{0%{transform:translateX(-100%)}100%{transform:translateX(220%)}}
        @keyframes ab_shimmerBtn{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(280%) skewX(-12deg)}}
        @keyframes ab_arrowPulse{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
        @keyframes ab_hexDrift  {from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes ab_gradText  {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes ab_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}

        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        /* ── Section base — same bg as Hero ── */
        .ab-section{
          position:relative;width:100%;overflow:hidden;
          background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);
          font-family:'DM Sans',sans-serif;color:#F8FAFF;
          padding:clamp(56px,9vw,110px) 0;
        }
        .ab-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}

        /* ── Layout — single centred column, canvas inline after headline ── */
        .ab-inner{
          position:relative;z-index:10;max-width:860px;margin:0 auto;
          padding:0 clamp(16px,4vw,60px);
          display:flex;flex-direction:column;
          gap:clamp(20px,3.5vw,32px);
        }
        .ab-canvas-col{position:relative;width:100%;height:clamp(260px,70vw,480px);}

        /* Canvas card — matches Hero .it-canvas-card */
        .ab-canvas-card{
          width:100%;height:100%;border-radius:18px;overflow:hidden;
          border:1px solid rgba(79,142,247,0.28);position:relative;
          animation:ab_glowPulse 4s ease-in-out infinite;
        }

        /* ── Headline ── */
        .ab-hl{
          font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;
          letter-spacing:-0.03em;color:#F8FAFF;margin:0;
          font-size:clamp(1.75rem,7.8vw,2.35rem);
        }
        .ab-hl .ab-accent{
          display:block;
          background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);
          background-size:300% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:ab_gradText 5s ease infinite;
          filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));
        }

        /* Tech tag — same as Hero .it-tag */
        .ab-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:6px;background:rgba(79,142,247,0.07);border:1px solid rgba(79,142,247,0.2);color:rgba(248,250,255,0.6);font-size:11px;font-weight:600;transition:all 0.22s cubic-bezier(0.23,1,0.32,1);cursor:default;white-space:nowrap;}
        .ab-tag::before{content:'';width:4px;height:4px;border-radius:50%;background:#4F8EF7;opacity:0.7;flex-shrink:0;}
        .ab-tag:hover{background:rgba(79,142,247,0.16);border-color:rgba(79,142,247,0.5);color:#F8FAFF;transform:translateY(-2px);box-shadow:0 4px 14px rgba(79,142,247,0.18);}

        /* Skill bar shimmer — same as Hero */
        .ab-skillbar-inner{position:relative;overflow:hidden;}
        .ab-skillbar-inner::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(180,210,255,0.4),transparent);animation:ab_shimmerBar 2.4s ease-in-out infinite;}

        /* Tab bar */
        .ab-tab-bar{display:flex;gap:4px;background:rgba(255,255,255,0.04);border-radius:10px;padding:4px;border:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;}
        .ab-tab{flex:1 1 80px;padding:8px 14px;border-radius:7px;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;cursor:pointer;transition:all 0.22s ease;color:${C.tm};background:transparent;}
        .ab-tab.active{background:rgba(79,142,247,0.14);border:1px solid rgba(79,142,247,0.35);color:${C.ts};box-shadow:0 2px 12px rgba(79,142,247,0.18);}
        .ab-tab:hover:not(.active){color:rgba(248,250,255,0.75);background:rgba(255,255,255,0.04);}

        /* Highlights grid */
        .ab-highlights{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        @media(max-width:420px){.ab-highlights{grid-template-columns:1fr;}}

        /* Floating shapes — hidden on mobile */
        .ab-shapes{display:none !important;}

        /* ── Breakpoints ── */
        @media(max-width:380px){
          .ab-inner{padding:0 10px;gap:14px;}
          .ab-canvas-col{height:clamp(220px,68vw,300px);}
          .ab-hl{font-size:1.55rem;}
        }
        @media(min-width:480px){
          .ab-canvas-col{height:clamp(300px,65vw,400px);}
          .ab-hl{font-size:clamp(1.9rem,6vw,2.25rem);}
        }
        @media(min-width:600px){
          .ab-inner{padding:0 clamp(20px,4vw,60px);gap:24px;}
          .ab-canvas-col{height:clamp(360px,55vw,460px);}
          .ab-hl{font-size:clamp(2rem,4.5vw,2.45rem);}
          .ab-shapes{display:block !important;}
        }
        @media(min-width:768px){
          .ab-canvas-col{height:clamp(400px,50vw,520px);}
          .ab-hl{font-size:clamp(2.2rem,3.2vw,3.1rem);}
        }
        @media(min-width:1024px){
          .ab-canvas-col{height:clamp(460px,48vw,560px);}
          .ab-hl{font-size:clamp(2.4rem,3.4vw,3.4rem);}
        }
      `}</style>

      <section id="about" ref={sectionRef} className="ab-section" aria-label="About IsiTech Innovations">

        {/* Hex pattern — same as Hero */}
        <div aria-hidden="true" style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"ab_hexDrift 16s linear infinite" }}>
          <HexPattern/>
        </div>

        {/* Noise grain */}
        <svg aria-hidden="true" style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none" }}>
          <filter id="ab_noise"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#ab_noise)"/>
        </svg>

        <div className="ab-scanline" aria-hidden="true"/>

        {/* Ambient glows — same positions as Hero */}
        <div aria-hidden="true" style={{ position:"absolute",top:"8%",left:"12%",width:"min(600px,50vw)",height:"min(600px,50vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",bottom:"5%",right:"8%",width:"min(480px,38vw)",height:"min(480px,38vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>
        <div aria-hidden="true" style={{ position:"absolute",top:"50%",left:"5%",width:"min(360px,28vw)",height:"min(360px,28vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(129,140,248,0.05) 0%,transparent 68%)",pointerEvents:"none",zIndex:1 }}/>

        {/* Floating shapes — 600px+ only */}
        <div className="ab-shapes" aria-hidden="true" style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2 }}>
          <svg width="80" height="80" viewBox="0 0 120 120" style={{ position:"absolute",top:"6%",right:"3%",animation:"ab_float1 8s ease-in-out infinite",filter:"drop-shadow(0 0 14px rgba(79,142,247,0.55))" }}>
            <defs><linearGradient id="ab_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs>
            <polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#ab_sh1)" strokeWidth="1.4" opacity="0.7"/>
          </svg>
          <svg width="60" height="60" viewBox="0 0 90 90" style={{ position:"absolute",bottom:"8%",left:"2%",animation:"ab_float1 11s ease-in-out infinite reverse",filter:"drop-shadow(0 0 10px rgba(56,189,248,0.5))" }}>
            <polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65"/>
          </svg>
          <svg width="46" height="46" viewBox="0 0 60 60" style={{ position:"absolute",top:"38%",right:"1%",animation:"ab_float1 9s ease-in-out infinite 2s" }}>
            <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke={C.accentAlt} strokeWidth="1" opacity="0.4" transform="rotate(22 30 30)"/>
          </svg>
        </div>

        <div className="ab-inner">

            {/* Badge — same style as Hero */}
            <div style={{ animation: visible ? "ab_fadeUp 0.6s ease both 0.08s" : "none", opacity: visible ? 1 : 0 }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:7,background:"rgba(79,142,247,0.10)",border:`1px solid rgba(79,142,247,0.32)`,color:C.o2,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"ab_badgePulse 3.2s ease-in-out infinite",boxShadow:"0 0 18px rgba(79,142,247,0.12)" }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                {ABOUT.badge}
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: visible ? "ab_fadeUp 0.7s ease both 0.16s" : "none", opacity: visible ? 1 : 0 }}>
              <h2 className="ab-hl">
                <span style={{ display:"block",color:C.tm,fontSize:"0.62em",fontWeight:400,marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif" }}>Who We Are</span>
                <span style={{ display:"block",color:C.tw }}>About IsiTech</span>
                <span className="ab-accent">Innovations</span>
              </h2>
            </div>

            <div style={{ animation: visible ? "ab_fadeUp 0.6s ease both 0.22s" : "none", opacity: visible ? 1 : 0 }}><Divider/></div>

            {/* ── 3D Canvas sits right here, after the headline ── */}
            <CanvasColumn visible={visible}/>

            {/* Tagline — same italic quote style */}
            <div style={{ opacity: visible ? 1 : 0, animation: visible ? "ab_fadeUp 0.7s ease both 0.3s" : "none" }}>
              <p style={{ color:C.tm,fontSize:"clamp(13px,1.5vw,16px)",fontWeight:500,fontStyle:"italic",lineHeight:1.7,margin:0,borderLeft:`2px solid ${C.o1}50`,paddingLeft:14 }}>
                {ABOUT.tagline}
              </p>
            </div>

            {/* Description paragraphs */}
            <div style={{ display:"flex",flexDirection:"column",gap:11,animation:visible?"ab_fadeUp 0.7s ease both 0.36s":"none" }}>
              {ABOUT.description.map((p, i) => (
                <p key={i} style={{ color:i===0?C.ts:C.tm,fontSize:"clamp(13px,1.45vw,15.5px)",lineHeight:1.85,fontWeight:i===0?500:400,margin:0 }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div style={{ opacity: visible ? 1 : 0, animation: visible ? "ab_fadeUp 0.7s ease both 0.42s" : "none" }}>
              <div style={{ color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.24em",textTransform:"uppercase",marginBottom:10 }}>Core Capabilities</div>
              <div className="ab-highlights">
                {ABOUT.highlights.map((item,i) => (
                  <HighlightCard key={i} item={item} index={i} visible={visible}/>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ opacity: visible ? 1 : 0, animation: visible ? "ab_fadeUp 0.7s ease both 0.50s" : "none" }}>
              <div className="ab-tab-bar">
                {ABOUT.tabs.map((tab, i) => (
                  <button key={tab} className={`ab-tab${activeTab===i?" active":""}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
              </div>
              <div style={{ marginTop:10,padding:"14px 16px",borderRadius:12,background:C.bg2,border:"1px solid rgba(255,255,255,0.06)",minHeight:72 }}>
                <p style={{ color:C.tm,fontSize:"clamp(12px,1.4vw,14px)",lineHeight:1.8,margin:0 }}>
                  {ABOUT.tabContent[activeTab]}
                </p>
              </div>
            </div>

            {/* Skill bars — same as Hero */}
            <div style={{ background:C.bg2,border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"16px 18px",animation:visible?"ab_fadeUp 0.7s ease both 0.56s":"none" }}>
              <div style={{ color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.24em",textTransform:"uppercase",marginBottom:14 }}>Expertise Level</div>
              {ABOUT.skillBars.map((s,i) => (
                <div key={s.label} style={{ marginBottom:i<ABOUT.skillBars.length-1?14:0 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <span style={{ color:C.ts,fontSize:11,fontWeight:600 }}>{s.label}</span>
                    <span style={{ color:s.color,fontSize:11,fontWeight:800 }}>{s.pct}%</span>
                  </div>
                  <div style={{ height:3,borderRadius:2,background:"rgba(255,255,255,0.055)",overflow:"hidden" }}>
                    <div className="ab-skillbar-inner" style={{ height:"100%",borderRadius:2,background:`linear-gradient(90deg,${s.color}70,${s.color})`,width:visible?`${s.pct}%`:"0%",transition:`width 1.7s cubic-bezier(0.23,1,0.32,1) ${0.6 + i*0.15}s`,boxShadow:`0 0 7px ${s.color}` }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,animation:visible?"ab_fadeUp 0.7s ease both 0.64s":"none" }}>
              {ABOUT.stats.map((s,i) => (
                <StatCard key={i} stat={s} active={visible} index={i}/>
              ))}
            </div>

            {/* Social proof — same as Hero */}
            <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",animation:visible?"ab_fadeUp 0.7s ease both 0.82s":"none" }}>
              <div style={{ display:"flex" }}>
                {ABOUT.avatarColors.map(([from,to],i) => (
                  <div key={i} style={{ width:29,height:29,borderRadius:"50%",marginLeft:i===0?0:"-10px",border:`2px solid ${C.bg1}`,background:`linear-gradient(135deg,${from},${to})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:800,flexShrink:0,boxShadow:`0 0 5px ${from}45` }}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:2,marginBottom:3 }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color:C.o1,fontSize:12,filter:`drop-shadow(0 0 4px ${C.o1}70)` }}>★</span>)}
                </div>
                <span style={{ color:C.tm,fontSize:12,fontWeight:500 }}>
                  Trusted by <strong style={{ color:C.tw }}>1,200+</strong> companies worldwide
                </span>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:7,background:"rgba(79,142,247,0.09)",border:"1px solid rgba(79,142,247,0.26)" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0 }}/>
                <span style={{ color:C.o1,fontSize:10,fontWeight:700,letterSpacing:"0.12em" }}>AVAILABLE FOR PROJECTS</span>
              </div>
            </div>

            {/* CTA buttons — same as Hero */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:11,animation:visible?"ab_fadeUp 0.7s ease both 0.9s":"none" }}>
              <CTAButton label="Discover Our Services" href="#services" primary onClick={handleNav}/>
              <CTAButton label="View Case Studies"     href="#projects" primary={false} onClick={handleNav}/>
            </div>

        </div>

        {/* Bottom divider — same as Hero fade overlay */}
        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,rgba(8,10,15,0.85))`,zIndex:5,pointerEvents:"none" }}/>
        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}28,transparent)`,zIndex:6 }}/>
      </section>
    </>
  );
};

export default About;