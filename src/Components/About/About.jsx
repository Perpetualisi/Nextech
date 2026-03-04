import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/* ════════════════════════════════════════════
   CONTENT
════════════════════════════════════════════ */
const ABOUT = {
  badge: "Who We Are",
  title: "About IsiTech\nInnovations",
  tagline: "We don't just build products — we engineer digital legacies.",
  description: [
    "At IsiTech Innovations, we architect transformative digital ecosystems that captivate audiences, drive conversions, and propel brands into their next era of growth.",
    "With deep expertise spanning industries, we've partnered with visionary startups and Fortune 500 enterprises alike — unlocking unprecedented digital growth through strategic design, intelligent technology, and measurable outcomes.",
    "Our philosophy is human-first: boundless creativity married to emerging tech, solving complex business challenges with clarity and conviction.",
  ],
  highlights: [
    { icon: "⬡", label: "Human-First Design", desc: "Every pixel serves a purpose" },
    { icon: "◈", label: "Full-Stack Mastery", desc: "From concept to deployment" },
    { icon: "◉", label: "AI-Powered Solutions", desc: "Intelligence built in by default" },
    { icon: "◎", label: "Measurable Results", desc: "Data-driven & outcome-focused" },
  ],
  stats: [
    { value: "8+",   label: "Years Experience", color: "#818cf8" },
    { value: "500+", label: "Projects Delivered", color: "#c084fc" },
    { value: "98%",  label: "Client Retention",  color: "#67e8f9" },
    { value: "45+",  label: "Expert Team",        color: "#f472b6" },
  ],
  cta:  { label: "Discover Our Services", href: "#services" },
  cta2: { label: "View Case Studies",     href: "#projects" },
};

/* ════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════ */
const useInView = (threshold = 0.12) => {
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
    const step = num / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setVal(cur);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  const suffix = target.replace(/[0-9.]/g, "");
  const isFloat = target.includes(".");
  return (val >= 1 ? (isFloat ? val.toFixed(1) : Math.floor(val).toString()) : "0") + suffix;
};

/* ════════════════════════════════════════════
   THREE.JS SCENE
════════════════════════════════════════════ */
const AboutCanvas = () => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    let renderer = null, animId = null, doCleanup = null;

    const init = () => {
      if (renderer) return;
      const W = mount.clientWidth, H = mount.clientHeight;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
      camera.position.set(0, 0.5, 7);

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      const lightsConfig = [
        { col: 0x818cf8, intensity: 5, dist: 30, pos: [5, 5, 5] },
        { col: 0xc084fc, intensity: 4, dist: 30, pos: [-5, -3, 4] },
        { col: 0x67e8f9, intensity: 3, dist: 25, pos: [0, -5, 3] },
        { col: 0xf472b6, intensity: 3, dist: 22, pos: [4, -2, -3] },
        { col: 0x34d399, intensity: 2, dist: 20, pos: [-4, 4, -2] },
      ];
      const pointLights = lightsConfig.map(l => {
        const pl = new THREE.PointLight(l.col, l.intensity, l.dist);
        pl.position.set(...l.pos);
        scene.add(pl);
        return pl;
      });

      /* ── Central morphing geometry ── */
      const morphGroup = new THREE.Group();
      scene.add(morphGroup);

      const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
      // Cache original positions for morphing
      const origPositions = new Float32Array(coreGeo.attributes.position.array.length);
      origPositions.set(coreGeo.attributes.position.array);

      const coreMat = new THREE.MeshPhongMaterial({
        color: 0x4f46e5, emissive: 0x1e1b4b, specular: 0xc7d2fe,
        shininess: 140, transparent: true, opacity: 0.88,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      morphGroup.add(core);

      const wireMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.22 });
      const wireCore = new THREE.Mesh(coreGeo, wireMat);
      wireCore.scale.setScalar(1.02);
      morphGroup.add(wireCore);

      const innerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 0.8, transparent: true, opacity: 0.4 })
      );
      morphGroup.add(innerGlow);

      /* ── DNA Double Helix ── */
      const helixGroup = new THREE.Group();
      scene.add(helixGroup);

      const nodeCount = 14;
      const helixRadius = 1.3;
      const helixHeight = 5.0;
      const strand1Pts = [], strand2Pts = [];

      const nodeMat = (col) => new THREE.MeshPhongMaterial({
        color: col, emissive: col, emissiveIntensity: 0.35, shininess: 200,
      });

      for (let i = 0; i < nodeCount; i++) {
        const t = (i / (nodeCount - 1)) * Math.PI * 3 - Math.PI * 1.5;
        const y = (i / (nodeCount - 1)) * helixHeight - helixHeight / 2;
        const isCentral = i === Math.floor(nodeCount / 2);
        const r = isCentral ? 0.24 : 0.14;

        const c1 = [0x818cf8, 0x6366f1, 0xa78bfa, 0xc084fc, 0x8b5cf6][i % 5];
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), nodeMat(c1));
        s1.position.set(Math.cos(t) * helixRadius, y, Math.sin(t) * helixRadius);
        helixGroup.add(s1);
        strand1Pts.push(s1.position.clone());

        const c2 = [0x67e8f9, 0x06b6d4, 0x34d399, 0x10b981, 0x22d3ee][i % 5];
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), nodeMat(c2));
        s2.position.set(Math.cos(t + Math.PI) * helixRadius, y, Math.sin(t + Math.PI) * helixRadius);
        helixGroup.add(s2);
        strand2Pts.push(s2.position.clone());

        if (i % 2 === 0) {
          const p1 = s1.position.clone(), p2 = s2.position.clone();
          const mid = p1.clone().lerp(p2, 0.5);
          const len = p1.distanceTo(p2);
          const rod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.022, 0.022, len, 8),
            new THREE.MeshPhongMaterial({ color: 0xc7d2fe, transparent: true, opacity: 0.35, shininess: 200 })
          );
          rod.position.copy(mid);
          rod.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            p2.clone().sub(p1).normalize()
          );
          helixGroup.add(rod);
        }
      }

      const makeTube = (pts, col, emissive) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        return new THREE.Mesh(
          new THREE.TubeGeometry(curve, 80, 0.032, 10, false),
          new THREE.MeshPhongMaterial({ color: col, emissive: emissive, transparent: true, opacity: 0.6, shininess: 220 })
        );
      };
      helixGroup.add(makeTube(strand1Pts, 0x818cf8, 0x312e81));
      helixGroup.add(makeTube(strand2Pts, 0x67e8f9, 0x0e7490));
      helixGroup.position.set(2.2, 0, -0.5);

      /* ── Orbital rings ── */
      const ringsConfig = [
        { r: 2.4, tube: 0.038, col: 0x818cf8, emissive: 0x312e81, rotX: Math.PI / 2.5, rotZ: 0.3,           opacity: 0.8 },
        { r: 2.9, tube: 0.025, col: 0xc084fc, emissive: 0x581c87, rotX: Math.PI / 4,   rotZ: Math.PI / 6,   opacity: 0.6 },
        { r: 3.4, tube: 0.018, col: 0x67e8f9, emissive: 0x0e7490, rotX: Math.PI / 6,   rotZ: -Math.PI / 5,  opacity: 0.45 },
      ];
      const ringMeshes = ringsConfig.map(r => {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(r.r, r.tube, 16, 140),
          new THREE.MeshPhongMaterial({ color: r.col, emissive: r.emissive, specular: 0xffffff, shininess: 240, transparent: true, opacity: r.opacity })
        );
        m.rotation.x = r.rotX;
        m.rotation.z = r.rotZ;
        scene.add(m);
        return m;
      });

      /* ── Satellites ── */
      const satConfigs = [
        { col: 0x818cf8, r: 2.2, speed:  0.55, yOff:  0.4, phase: 0   },
        { col: 0xf472b6, r: 2.7, speed: -0.38, yOff: -0.6, phase: 1.2 },
        { col: 0x67e8f9, r: 1.9, speed:  0.72, yOff:  0.9, phase: 2.4 },
        { col: 0x34d399, r: 3.1, speed: -0.28, yOff: -0.3, phase: 3.6 },
      ];
      const sats = satConfigs.map(d => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 20, 20),
          new THREE.MeshPhongMaterial({ color: d.col, emissive: d.col, emissiveIntensity: 0.55, shininess: 240 })
        );
        mesh.userData = { ...d, angle: d.phase };
        scene.add(mesh);
        const trail = new THREE.Mesh(
          new THREE.TorusGeometry(0.18, 0.012, 8, 40),
          new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: 0.4 })
        );
        mesh.add(trail);
        return mesh;
      });

      /* ── Geometric accents ── */
      const octahedron = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshPhongMaterial({ color: 0xf472b6, emissive: 0x9d174d, shininess: 200, transparent: true, opacity: 0.75 })
      );
      octahedron.position.set(-2.5, 1.5, 0.5);
      scene.add(octahedron);

      const tetrahedron = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.38, 0),
        new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x065f46, shininess: 180, transparent: true, opacity: 0.7 })
      );
      tetrahedron.position.set(-2.0, -1.8, -0.3);
      scene.add(tetrahedron);

      /* ── Energy field lines ── */
      const fieldLines = [];
      const lineColors = [0x818cf8, 0xc084fc, 0x67e8f9, 0xf472b6, 0x34d399, 0xa78bfa];
      for (let i = 0; i < 6; i++) {
        const pts = [];
        const angle = (i / 6) * Math.PI * 2;
        for (let j = 0; j <= 30; j++) {
          const frac = j / 30;
          pts.push(new THREE.Vector3(
            Math.cos(angle + frac * Math.PI) * (1.8 + frac * 0.8),
            (frac - 0.5) * 4.5,
            Math.sin(angle + frac * Math.PI) * (1.8 + frac * 0.8)
          ));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: lineColors[i], transparent: true, opacity: 0.18,
        }));
        scene.add(line);
        fieldLines.push(line);
      }

      /* ── Particles ── */
      const pCount = 220;
      const pPos = new Float32Array(pCount * 3);
      const pColors = new Float32Array(pCount * 3);
      const palette = [[0.49,0.49,0.97],[0.75,0.51,0.99],[0.40,0.91,0.98],[0.96,0.45,0.71],[0.20,0.83,0.60]];
      for (let i = 0; i < pCount; i++) {
        const rr = 3.2 + Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pPos[i*3]   = rr * Math.sin(phi) * Math.cos(theta);
        pPos[i*3+1] = rr * Math.sin(phi) * Math.sin(theta);
        pPos[i*3+2] = rr * Math.cos(phi);
        const c = palette[i % palette.length];
        pColors[i*3] = c[0]; pColors[i*3+1] = c[1]; pColors[i*3+2] = c[2];
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors, 3));
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.048, transparent: true, opacity: 0.82, vertexColors: true,
      }));
      scene.add(particles);

      /* ── Mouse interaction ── */
      let mx = 0, my = 0, targetMx = 0, targetMy = 0;
      const onMove = e => {
        const touch = e.touches ? e.touches[0] : e;
        targetMx = (touch.clientX / window.innerWidth  - 0.5) * 2;
        targetMy = -(touch.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });

      const onResize = () => {
        const nw = mount.clientWidth, nh = mount.clientHeight;
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      /* ── Animation loop ── */
      const t0 = performance.now();
      const posArr = coreGeo.attributes.position.array;
      const tempPos = new Float32Array(posArr.length);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = (performance.now() - t0) * 0.001;

        // Smooth mouse
        mx += (targetMx - mx) * 0.06;
        my += (targetMy - my) * 0.06;

        // Morph core — use cached original positions to avoid drift
        for (let i = 0; i < origPositions.length; i += 3) {
          const ox = origPositions[i], oy = origPositions[i+1], oz = origPositions[i+2];
          const len = Math.sqrt(ox*ox + oy*oy + oz*oz);
          const wave = Math.sin(t * 1.4 + ox * 2.1 + oy * 1.7) * 0.06;
          const scale = (1.05 + wave) / len;
          tempPos[i]   = ox * scale;
          tempPos[i+1] = oy * scale;
          tempPos[i+2] = oz * scale;
        }
        coreGeo.attributes.position.array.set(tempPos);
        coreGeo.attributes.position.needsUpdate = true;
        coreGeo.computeVertexNormals();

        morphGroup.rotation.y = t * 0.22 + mx * 0.35;
        morphGroup.rotation.x = Math.sin(t * 0.18) * 0.18 + my * 0.2;
        morphGroup.rotation.z = Math.cos(t * 0.14) * 0.08;

        helixGroup.rotation.y = t * 0.28 + mx * 0.15;
        helixGroup.rotation.x = Math.sin(t * 0.22) * 0.12 + my * 0.08;
        const breathe = 1 + Math.sin(t * 0.9) * 0.04;
        helixGroup.scale.set(breathe, 1, breathe);

        ringMeshes[0].rotation.z = t * 0.22;
        ringMeshes[1].rotation.x = Math.PI / 4 + t * 0.17;
        ringMeshes[1].rotation.z = Math.PI / 6 + t * 0.12;
        ringMeshes[2].rotation.y = t * 0.14;
        ringMeshes[2].rotation.z = -Math.PI / 5 + t * 0.09;

        sats.forEach(s => {
          s.userData.angle += s.userData.speed * 0.013;
          s.position.x = Math.cos(s.userData.angle) * s.userData.r;
          s.position.z = Math.sin(s.userData.angle) * s.userData.r;
          s.position.y = s.userData.yOff + Math.sin(t * 1.1 + s.userData.angle) * 0.35;
          s.rotation.y = t * 2;
        });

        octahedron.rotation.x = t * 0.5;
        octahedron.rotation.y = t * 0.7;
        octahedron.position.y = 1.5 + Math.sin(t * 0.8) * 0.3;
        tetrahedron.rotation.x = -t * 0.6;
        tetrahedron.rotation.z = t * 0.4;
        tetrahedron.position.y = -1.8 + Math.cos(t * 0.7) * 0.25;

        fieldLines.forEach((l, i) => { l.rotation.y = t * (0.05 + i * 0.012); });

        particles.rotation.y = t * 0.035;
        particles.rotation.x = t * 0.018;

        innerGlow.scale.setScalar(1 + Math.sin(t * 1.8) * 0.15);

        pointLights[0].position.set(Math.sin(t * 0.42) * 6,  Math.cos(t * 0.35) * 5,  5);
        pointLights[1].position.set(Math.cos(t * 0.31) * -6, Math.sin(t * 0.48) * -4, 4);
        pointLights[3].position.set(Math.sin(t * 0.55) * 5,  -2, Math.cos(t * 0.38) * -4);
        pointLights[4].position.set(Math.cos(t * 0.27) * -4, Math.sin(t * 0.33) * 4,  -3);

        renderer.render(scene, camera);
      };
      animate();

      doCleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("resize", onResize);
        if (renderer) { renderer.dispose(); renderer = null; }
      };
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { init(); }
      else { if (doCleanup) { doCleanup(); doCleanup = null; } }
    }, { threshold: 0.01 });
    obs.observe(canvas);
    return () => { obs.disconnect(); if (doCleanup) doCleanup(); };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
};

/* ════════════════════════════════════════════
   STAT CARD
════════════════════════════════════════════ */
const StatCard = ({ stat, active }) => {
  const [hov, setHov] = useState(false);
  const display = useCounter(stat.value, 1800, active);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "1 1 100px",
        minWidth: 90,
        padding: "clamp(12px,2vw,20px) clamp(10px,1.5vw,18px)",
        borderRadius: 18,
        background: hov
          ? `linear-gradient(135deg, ${stat.color}28 0%, ${stat.color}0e 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        border: hov ? `1px solid ${stat.color}70` : "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(18px)",
        boxShadow: hov
          ? `0 0 36px ${stat.color}28, inset 0 1px 0 rgba(255,255,255,0.12)`
          : "0 2px 18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        transform: hov ? "translateY(-6px) scale(1.04)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${stat.color}60,transparent)` }} />
      <div style={{ position:"absolute",top:0,right:0,width:40,height:40,background:`radial-gradient(circle at top right,${stat.color}35,transparent 70%)`,borderRadius:"0 18px 0 0" }} />
      <div style={{
        fontSize: "clamp(1.3rem,3vw,2rem)",
        fontFamily: "'Syne', sans-serif",
        fontWeight: 900,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        marginBottom: 5,
        background: `linear-gradient(135deg, #e0e7ff 0%, ${stat.color} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {display}
      </div>
      <div style={{ color: "rgba(199,210,254,0.6)", fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {stat.label}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   HIGHLIGHT CARD
════════════════════════════════════════════ */
const HighlightCard = ({ item, index, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 16,
        background: hov ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
        border: hov ? "1px solid rgba(129,140,248,0.4)" : "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        cursor: "default",
        animation: visible ? `ab_fadeUp 0.6s ease both ${0.4 + index * 0.08}s` : "none",
        opacity: visible ? 1 : 0,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))",
        border: "1px solid rgba(129,140,248,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, color: "#818cf8",
        boxShadow: hov ? "0 0 16px rgba(129,140,248,0.3)" : "none",
        transition: "box-shadow 0.3s ease",
      }}>
        {item.icon}
      </div>
      <div>
        <div style={{ color: "#e0e7ff", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
        <div style={{ color: "rgba(165,180,252,0.55)", fontSize: 11 }}>{item.desc}</div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   CANVAS COLUMN — extracted for reuse of order
════════════════════════════════════════════ */
const CanvasColumn = ({ visible }) => (
  <div
    className="ab-canvas-col"
    style={{ animation: visible ? "ab_fadeLeft 0.9s ease both 0.15s" : "none", opacity: visible ? 1 : 0 }}
  >
    {/* Rotating conic border */}
    <div style={{ position:"absolute",inset:-2,borderRadius:30,zIndex:0,overflow:"hidden" }}>
      <div className="ab-rotating-border" />
    </div>

    <div className="ab-canvas-card" style={{ position:"relative",zIndex:1 }}>
      {/* Inner glow */}
      <div style={{ position:"absolute",inset:"12%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.28) 0%,rgba(168,85,247,0.12) 40%,transparent 70%)",filter:"blur(28px)",zIndex:0 }}/>

      {/* Corner accents */}
      {[
        { top:12,  left:12,  borderTop:"2px solid rgba(129,140,248,0.5)", borderLeft:"2px solid rgba(129,140,248,0.5)" },
        { top:12,  right:12, borderTop:"2px solid rgba(192,132,252,0.5)", borderRight:"2px solid rgba(192,132,252,0.5)" },
        { bottom:12, left:12,  borderBottom:"2px solid rgba(103,232,249,0.5)", borderLeft:"2px solid rgba(103,232,249,0.5)" },
        { bottom:12, right:12, borderBottom:"2px solid rgba(244,114,182,0.5)", borderRight:"2px solid rgba(244,114,182,0.5)" },
      ].map((s, i) => (
        <div key={i} style={{ position:"absolute",width:20,height:20,zIndex:5,...s }}/>
      ))}

      {/* Live badge */}
      <div style={{ position:"absolute",top:16,left:16,zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(129,140,248,0.28)" }}>
        <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block" }}/>
        <span style={{ color:"#a5b4fc",fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase" }}>Live 3D Engine</span>
      </div>

      {/* Bottom label */}
      <div style={{ position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:6,display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:100,background:"rgba(5,7,20,0.75)",backdropFilter:"blur(12px)",border:"1px solid rgba(129,140,248,0.28)",whiteSpace:"nowrap" }}>
        <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 8px #818cf8",animation:"ab_blink 2s ease-in-out infinite",display:"inline-block" }}/>
        <span style={{ color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase" }}>Digital Innovation Engine</span>
      </div>

      <AboutCanvas />
    </div>
  </div>
);

/* ════════════════════════════════════════════
   ABOUT SECTION
════════════════════════════════════════════ */
const About = () => {
  const { ref: sectionRef, visible } = useInView(0.1);
  const [hovCta1, setHovCta1] = useState(false);
  const [hovCta2, setHovCta2] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleNav = useCallback((href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const tabs = ["Our Story", "Our Values", "Our Process"];
  const tabContent = [
    "Founded on the belief that technology should empower people, IsiTech Innovations has grown from a small creative studio to a full-service digital agency trusted by brands across 30+ countries. Every engagement starts with deep listening and ends with measurable impact.",
    "We operate on four pillars: radical transparency, relentless innovation, human-centered design, and outcome-driven execution. These aren't buzzwords — they're the standards we hold ourselves to on every project, every day.",
    "Discovery → Strategy → Design → Build → Launch → Optimize. Our six-phase process ensures nothing is left to chance. Each phase has defined deliverables, clear milestones, and regular client checkpoints so you're always in control.",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        @keyframes ab_fadeUp    { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes ab_fadeLeft  { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ab_fadeRight { from{opacity:0;transform:translateX(36px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes ab_float1    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(4deg)} 66%{transform:translateY(-6px) rotate(-3deg)} }
        @keyframes ab_float2    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px) rotate(-5deg)} }
        @keyframes ab_spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ab_blink     { 0%,49%,100%{opacity:1} 50%,99%{opacity:0} }
        @keyframes ab_gridMove  { from{transform:translateY(0)} to{transform:translateY(50px)} }
        @keyframes ab_pulse     { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.15);opacity:1} }
        @keyframes ab_shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes ab_arrowPulse{ 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes ab_glow      { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.2)} 50%{box-shadow:0 0 40px rgba(168,85,247,0.45)} }
        @keyframes ab_borderRot { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ab_scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }

        .ab-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(160deg, #050714 0%, #080c1e 35%, #0d0620 65%, #060b1a 100%);
          font-family: 'DM Sans', sans-serif;
          padding: clamp(56px, 9vw, 110px) 0;
        }

        /* ── Mobile: single column, canvas FIRST then text ── */
        .ab-inner {
          position: relative;
          z-index: 10;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 80px);
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 5vw, 48px);
        }

        .ab-text-col {
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 2vw, 20px);
          min-width: 0;
          /* canvas is order:1 on mobile, text is order:2 */
          order: 2;
        }

        .ab-canvas-col {
          position: relative;
          width: 100%;
          height: clamp(240px, 72vw, 380px);
          /* canvas first on mobile */
          order: 1;
        }

        /* Hide decorative floating SVGs on mobile */
        .ab-float-deco { display: none; }

        /* ── Small tablet 600px+ ── */
        @media (min-width: 600px) {
          .ab-canvas-col { height: clamp(300px, 60vw, 440px); }
          .ab-float-deco { display: block; }
        }

        /* ── Desktop 960px+: side-by-side, text LEFT, canvas RIGHT ── */
        @media (min-width: 960px) {
          .ab-inner {
            flex-direction: row !important;
            align-items: flex-start;
            gap: clamp(40px, 5vw, 68px);
          }
          /* restore natural reading order on desktop */
          .ab-text-col  { order: 1; flex: 1 1 0; }
          .ab-canvas-col {
            order: 2;
            flex: 0 0 44%;
            width: 44%;
            height: clamp(480px, 44vw, 620px);
            position: sticky;
            top: 80px;
          }
        }

        @media (min-width: 1200px) {
          .ab-canvas-col {
            flex: 0 0 46%;
            width: 46%;
            height: clamp(520px, 46vw, 660px);
          }
        }

        /* ── Headline ── */
        .ab-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          font-size: clamp(1.75rem, 7vw, 2.4rem);
          line-height: 1.08;
          letter-spacing: -0.025em;
          margin: 0;
          color: #fff;
        }
        .ab-headline .hl1 { display: block; color: #fff; }
        .ab-headline .hl2 {
          display: block;
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #f472b6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 24px rgba(129,140,248,0.5));
        }
        @media (min-width: 768px) {
          .ab-headline { font-size: clamp(2rem, 3.5vw, 3.2rem); }
          .ab-headline .hl1, .ab-headline .hl2 { white-space: nowrap; }
        }
        @media (min-width: 1024px) {
          .ab-headline { font-size: clamp(2.2rem, 3.8vw, 3.6rem); }
        }

        /* Stats grid */
        .ab-stats { display: flex; flex-wrap: wrap; gap: 8px; }

        /* Highlights grid */
        .ab-highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (max-width: 420px) { .ab-highlights { grid-template-columns: 1fr; } }

        /* Tab bar */
        .ab-tab-bar {
          display: flex; gap: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 12px; padding: 4px;
          border: 1px solid rgba(255,255,255,0.07);
          flex-wrap: wrap;
        }
        .ab-tab {
          flex: 1 1 80px;
          padding: 8px 14px; border-radius: 8px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer;
          transition: all 0.25s ease; color: rgba(165,180,252,0.55);
          background: transparent;
        }
        .ab-tab.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2));
          border: 1px solid rgba(129,140,248,0.35);
          color: #c7d2fe;
          box-shadow: 0 2px 12px rgba(99,102,241,0.2);
        }
        .ab-tab:hover:not(.active) { color: rgba(199,210,254,0.8); background: rgba(255,255,255,0.04); }

        /* Canvas card */
        .ab-canvas-card {
          width: 100%; height: 100%;
          border-radius: 28px; overflow: hidden;
          border: 1px solid rgba(129,140,248,0.18);
          box-shadow: 0 0 80px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
          position: relative;
          animation: ab_glow 4s ease-in-out infinite;
        }

        /* Rotating border accent */
        .ab-rotating-border {
          position: absolute; inset: -2px; border-radius: 30px;
          background: conic-gradient(from 0deg, transparent 0%, #818cf830 20%, #c084fc60 40%, #67e8f930 60%, transparent 80%);
          animation: ab_borderRot 8s linear infinite;
          z-index: 0;
        }

        /* Shimmer bar */
        .ab-shimmer-bar {
          position: relative; overflow: hidden;
          height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.06);
        }
        .ab-shimmer-bar::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: ab_shimmer 2.5s ease-in-out infinite;
        }

        /* Scanline overlay */
        .ab-scanline {
          position: absolute; inset: 0; pointer-events: none; z-index: 4;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.02) 50%);
          background-size: 100% 3px;
        }
      `}</style>

      <section id="about" ref={sectionRef} className="ab-section" aria-label="About IsiTech Innovations">

        {/* Grid background */}
        <div style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",backgroundImage:`linear-gradient(rgba(129,140,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.04) 1px,transparent 1px)`,backgroundSize:"55px 55px",animation:"ab_gridMove 10s linear infinite" }}/>

        {/* Scanline */}
        <div className="ab-scanline" />

        {/* Noise texture */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none" }}>
          <filter id="ab_noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#ab_noise)"/>
        </svg>

        {/* Radial glows */}
        {[
          { style:{top:"8%",left:"12%",width:"clamp(200px,46vw,600px)",height:"clamp(200px,46vw,600px)"},   bg:"rgba(99,102,241,0.14)" },
          { style:{bottom:"4%",right:"8%",width:"clamp(180px,38vw,500px)",height:"clamp(180px,38vw,500px)"}, bg:"rgba(168,85,247,0.11)" },
          { style:{top:"50%",left:"40%",width:"clamp(150px,30vw,400px)",height:"clamp(150px,30vw,400px)"},   bg:"rgba(103,232,249,0.07)" },
        ].map((g, i) => (
          <div key={i} style={{ position:"absolute",...g.style,borderRadius:"50%",background:`radial-gradient(ellipse,${g.bg} 0%,transparent 70%)`,pointerEvents:"none",zIndex:1 }}/>
        ))}

        {/* Floating SVG accents — hidden on mobile */}
        <div className="ab-float-deco" style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden" }}>
          <svg width="68" height="68" viewBox="0 0 100 100" style={{ position:"absolute",top:"6%",right:"3%",animation:"ab_float1 9s ease-in-out infinite",filter:"drop-shadow(0 0 12px #f472b660)" }}>
            <defs><linearGradient id="ab_d1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
            <polygon points="50,5 95,50 50,95 5,50" fill="url(#ab_d1)" opacity="0.7"/>
            <polygon points="50,5 95,50 50,50" fill="#f9a8d4" opacity="0.3"/>
          </svg>
          <svg width="85" height="85" viewBox="0 0 120 120" style={{ position:"absolute",bottom:"7%",left:"2%",animation:"ab_float2 11s ease-in-out infinite",filter:"drop-shadow(0 0 14px #818cf860)" }}>
            <defs>
              <linearGradient id="ab_c1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
              <linearGradient id="ab_c2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
            </defs>
            <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#ab_c1)" opacity="0.7"/>
            <polygon points="60,5 110,40 60,60" fill="url(#ab_c2)" opacity="0.5"/>
          </svg>
          <svg width="75" height="75" viewBox="0 0 100 100" style={{ position:"absolute",top:"44%",right:"1%",animation:"ab_spin 18s linear infinite",filter:"drop-shadow(0 0 10px #67e8f960)" }}>
            <defs><linearGradient id="ab_t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#ab_t1)" strokeWidth="8" opacity="0.7"/>
            <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#cffafe" strokeWidth="1.5" opacity="0.3"/>
          </svg>
          <svg width="52" height="52" viewBox="0 0 80 80" style={{ position:"absolute",top:"8%",left:"2%",animation:"ab_float1 7s ease-in-out infinite reverse",filter:"drop-shadow(0 0 8px #fbbf2460)" }}>
            <defs><linearGradient id="ab_cub" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
            <polygon points="15,25 55,25 55,65 15,65" fill="url(#ab_cub)" opacity="0.55" stroke="#fbbf24" strokeWidth="1.2"/>
            <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.6" stroke="#fbbf24" strokeWidth="1.2"/>
            <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.55" stroke="#fbbf24" strokeWidth="1.2"/>
          </svg>
        </div>

        <div className="ab-inner">

          {/* ══ CANVAS COLUMN — order:1 on mobile, order:2 on desktop ══ */}
          <CanvasColumn visible={visible} />

          {/* ══ TEXT COLUMN — order:2 on mobile, order:1 on desktop ══ */}
          <div
            className="ab-text-col"
            style={{ animation: visible ? "ab_fadeRight 0.9s ease both 0.1s" : "none", opacity: visible ? 1 : 0 }}
          >
            {/* Badge */}
            <div>
              <span style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:100,background:"linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.13))",border:"1px solid rgba(129,140,248,0.32)",color:"#a5b4fc",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase" }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 8px #818cf8",animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block" }}/>
                {ABOUT.badge}
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: visible ? "ab_fadeUp 0.7s ease both 0.2s" : "none" }}>
              <h2 className="ab-headline">
                <span className="hl1">About IsiTech</span>
                <span className="hl2">Innovations</span>
              </h2>
            </div>

            {/* Tagline */}
            <div style={{ animation: visible ? "ab_fadeUp 0.7s ease both 0.28s" : "none" }}>
              <p style={{ color:"rgba(165,180,252,0.7)",fontSize:"clamp(14px,1.6vw,17px)",fontWeight:500,fontStyle:"italic",lineHeight:1.6,margin:0,borderLeft:"2px solid rgba(129,140,248,0.4)",paddingLeft:14 }}>
                {ABOUT.tagline}
              </p>
            </div>

            {/* Description */}
            <div style={{ display:"flex",flexDirection:"column",gap:12,animation:visible?"ab_fadeUp 0.7s ease both 0.35s":"none" }}>
              {ABOUT.description.map((p, i) => (
                <p key={i} style={{ color: i===0 ? "rgba(199,210,254,0.85)" : "rgba(199,210,254,0.6)", fontSize:"clamp(13px,1.5vw,16px)", lineHeight:1.8, fontWeight: i===0 ? 500 : 400, margin:0 }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div>
              <div style={{ color:"rgba(165,180,252,0.45)",fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:10 }}>Core Capabilities</div>
              <div className="ab-highlights">
                {ABOUT.highlights.map((item, i) => (
                  <HighlightCard key={i} item={item} index={i} visible={visible} />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ animation:visible?"ab_fadeUp 0.7s ease both 0.6s":"none" }}>
              <div className="ab-tab-bar">
                {tabs.map((tab, i) => (
                  <button key={tab} className={`ab-tab${activeTab===i?" active":""}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
              </div>
              <div style={{ marginTop:12,padding:"14px 16px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(129,140,248,0.1)",minHeight:72 }}>
                <p style={{ color:"rgba(199,210,254,0.65)",fontSize:"clamp(12px,1.4vw,14px)",lineHeight:1.75,margin:0 }}>
                  {tabContent[activeTab]}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="ab-stats" style={{ animation:visible?"ab_fadeUp 0.7s ease both 0.7s":"none" }}>
              {ABOUT.stats.map((s, i) => (
                <StatCard key={i} stat={s} active={visible} />
              ))}
            </div>

            {/* Skill bars */}
            <div style={{ display:"flex",flexDirection:"column",gap:10,animation:visible?"ab_fadeUp 0.7s ease both 0.8s":"none" }}>
              {[
                { label:"UI/UX & Branding", pct:96, col:"#818cf8" },
                { label:"Full-Stack Dev",   pct:93, col:"#c084fc" },
                { label:"Cloud & DevOps",   pct:89, col:"#67e8f9" },
                { label:"AI Integration",   pct:85, col:"#f472b6" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                    <span style={{ color:"rgba(199,210,254,0.65)",fontSize:11,fontWeight:600 }}>{s.label}</span>
                    <span style={{ color:s.col,fontSize:11,fontWeight:800 }}>{s.pct}%</span>
                  </div>
                  <div className="ab-shimmer-bar">
                    <div style={{ height:"100%",width:visible?`${s.pct}%`:"0%",borderRadius:2,background:`linear-gradient(90deg,${s.col}70,${s.col})`,transition:"width 1.6s cubic-bezier(0.23,1,0.32,1) 0.9s" }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",animation:visible?"ab_fadeUp 0.7s ease both 0.9s":"none" }}>
              <div style={{ display:"flex" }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:28,height:28,borderRadius:"50%",marginLeft:i===0?0:"-9px",border:"2px solid #050714",background:`linear-gradient(135deg,${["#6366f1","#8b5cf6","#a855f7","#c084fc","#818cf8"][i]},${["#312e81","#4c1d95","#581c87","#6b21a8","#3730a3"][i]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:"rgba(255,255,255,0.9)",fontWeight:700 }}>
                    {["A","B","C","D","E"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:1,marginBottom:2 }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color:"#fbbf24",fontSize:11 }}>★</span>)}
                </div>
                <span style={{ color:"rgba(165,180,252,0.6)",fontSize:11,fontWeight:500 }}>
                  Trusted by <strong style={{ color:"#a5b4fc" }}>500+</strong> global brands
                </span>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"ab_pulse 2s ease-in-out infinite",display:"inline-block" }}/>
                <span style={{ color:"#34d399",fontSize:10,fontWeight:700,letterSpacing:"0.1em" }}>AVAILABLE FOR PROJECTS</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display:"flex",flexWrap:"wrap",gap:12,animation:visible?"ab_fadeUp 0.7s ease both 1s":"none" }}>
              <button
                onClick={() => handleNav(ABOUT.cta.href)}
                onMouseEnter={() => setHovCta1(true)}
                onMouseLeave={() => setHovCta1(false)}
                style={{ padding:"12px 28px",borderRadius:100,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.4vw,15px)",fontWeight:800,letterSpacing:"0.05em",color:"#fff",background:hovCta1?"linear-gradient(135deg,#818cf8,#6366f1,#a855f7)":"linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",boxShadow:hovCta1?"0 20px 55px rgba(99,102,241,0.55)":"0 8px 28px rgba(99,102,241,0.4)",transform:hovCta1?"translateY(-3px) scale(1.04)":"translateY(0) scale(1)",transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",display:"inline-flex",alignItems:"center",gap:8 }}>
                <span style={{ animation:"ab_arrowPulse 2s ease-in-out infinite",display:"inline-block" }}>→</span>
                {ABOUT.cta.label}
              </button>
              <button
                onClick={() => handleNav(ABOUT.cta2.href)}
                onMouseEnter={() => setHovCta2(true)}
                onMouseLeave={() => setHovCta2(false)}
                style={{ padding:"12px 28px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.4vw,15px)",fontWeight:800,letterSpacing:"0.05em",color:"#c7d2fe",background:hovCta2?"rgba(129,140,248,0.12)":"transparent",border:"1.5px solid rgba(129,140,248,0.45)",boxShadow:hovCta2?"0 8px 28px rgba(99,102,241,0.22)":"none",transform:hovCta2?"translateY(-3px) scale(1.04)":"translateY(0) scale(1)",transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)" }}>
                {ABOUT.cta2.label}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom divider */}
        <div style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.28),transparent)",zIndex:5 }}/>
      </section>
    </>
  );
};

export default About;