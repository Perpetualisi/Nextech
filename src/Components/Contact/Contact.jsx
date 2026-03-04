import { useEffect, useRef, useState, useCallback } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const HEADINGS = [
  "Let's Build Something Exceptional",
  "Start Your Project With Us",
  "Design. Develop. Deliver.",
  "Empowering Ideas Digitally",
  "Ready to Bring Your Vision to Life",
  "Collaborate. Create. Launch",
];

const SOCIAL_LINKS = [
  { href: "https://github.com/Perpetualisi",                         label: "GitHub",   Icon: FaGithub,   color: "#818cf8", glow: "rgba(129,140,248,0.35)" },
  { href: "mailto:isitech1111@gmail.com",                            label: "Email",    Icon: FaEnvelope, color: "#f87171", glow: "rgba(248,113,113,0.35)" },
  { href: "https://www.linkedin.com/in/perpetual-okan-759655344/",   label: "LinkedIn", Icon: FaLinkedin, color: "#60a5fa", glow: "rgba(96,165,250,0.35)"  },
  { href: "https://wa.me/2348103558837",                             label: "WhatsApp", Icon: FaWhatsapp, color: "#4ade80", glow: "rgba(74,222,128,0.35)"  },
];

const CONTACT_INFO = [
  { Icon: FaEnvelope,     label: "Email",    value: "Isitech1111@gmail.com", href: "mailto:Isitech1111@gmail.com", accent: "#818cf8" },
  { Icon: FaPhone,        label: "Phone",    value: "+234 810 355 8837",      href: "tel:+2348103558837",           accent: "#c084fc" },
  { Icon: FaMapMarkerAlt, label: "Location", value: "Nigeria",                href: null,                           accent: "#34d399" },
];

const PROCESS_STEPS = [
  { num: "01", title: "Discovery Call",   desc: "We learn your goals, challenges, and vision in depth." },
  { num: "02", title: "Strategy & Scope", desc: "We craft a precise plan with timelines and deliverables." },
  { num: "03", title: "Build & Iterate",  desc: "Rapid development with weekly demos and feedback loops." },
  { num: "04", title: "Launch & Scale",   desc: "Live deployment with ongoing optimization support." },
];

/* ════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════ */
const useInView = (threshold = 0.08) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "40px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ════════════════════════════════════════════
   FLOATING BG ACCENTS
════════════════════════════════════════════ */
const BgAccents = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
    <svg width="85" height="85" viewBox="0 0 120 120" style={{ position:"absolute",top:"4%",left:"1.5%",animation:"ct_float1 9s ease-in-out infinite",filter:"drop-shadow(0 0 14px #818cf860)" }}>
      <defs>
        <linearGradient id="ct_cr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
        <linearGradient id="ct_cr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
      </defs>
      <polygon points="60,5 110,40 110,80 60,115 10,80 10,40" fill="url(#ct_cr1)" opacity="0.55"/>
      <polygon points="60,5 110,40 60,60" fill="url(#ct_cr2)" opacity="0.4"/>
      <polygon points="60,115 10,80 60,60" fill="#4338ca" opacity="0.3"/>
    </svg>
    <svg width="64" height="64" viewBox="0 0 100 100" style={{ position:"absolute",top:"5%",right:"2.5%",animation:"ct_float2 11s ease-in-out infinite",filter:"drop-shadow(0 0 10px #f472b660)" }}>
      <defs><linearGradient id="ct_dm1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#ct_dm1)" opacity="0.6"/>
      <polygon points="50,5 95,50 50,50" fill="#f9a8d4" opacity="0.28"/>
    </svg>
    <svg width="70" height="70" viewBox="0 0 100 100" style={{ position:"absolute",top:"45%",left:"0.5%",animation:"ct_spin 22s linear infinite",filter:"drop-shadow(0 0 10px #67e8f960)" }}>
      <defs><linearGradient id="ct_tr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="url(#ct_tr1)" strokeWidth="8" opacity="0.6"/>
      <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#cffafe" strokeWidth="1.5" opacity="0.25"/>
    </svg>
    <svg width="52" height="52" viewBox="0 0 80 80" style={{ position:"absolute",bottom:"6%",right:"1.5%",animation:"ct_float1 8s ease-in-out infinite reverse",filter:"drop-shadow(0 0 9px #fbbf2460)" }}>
      <defs><linearGradient id="ct_cb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="15,25 55,25 55,65 15,65" fill="url(#ct_cb1)" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="15,25 55,25 65,15 25,15" fill="#fcd34d" opacity="0.5" stroke="#fbbf24" strokeWidth="1"/>
      <polygon points="55,25 65,15 65,55 55,65" fill="#d97706" opacity="0.45" stroke="#fbbf24" strokeWidth="1"/>
    </svg>
    <svg width="46" height="46" viewBox="0 0 60 60" style={{ position:"absolute",bottom:"10%",left:"3%",animation:"ct_pulse 5s ease-in-out infinite",filter:"drop-shadow(0 0 8px #a78bfa60)" }}>
      <defs><radialGradient id="ct_sp1" cx="35%" cy="30%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#4c1d95"/></radialGradient></defs>
      <circle cx="30" cy="30" r="26" fill="url(#ct_sp1)" opacity="0.65"/>
      <circle cx="22" cy="22" r="8" fill="white" opacity="0.1"/>
    </svg>
  </div>
);

/* ════════════════════════════════════════════
   GLASS FIELD
════════════════════════════════════════════ */
const Field = ({ as: Tag = "input", name, value, onChange, placeholder, required, type = "text", rows }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Tag
        name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        type={type} rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "13px 18px",
          borderRadius: 12,
          outline: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px,1.4vw,15px)",
          fontWeight: 400,
          background: focused ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
          border: focused ? "1px solid rgba(129,140,248,0.65)" : "1px solid rgba(255,255,255,0.09)",
          color: "#e0e7ff",
          backdropFilter: "blur(12px)",
          boxShadow: focused
            ? "0 0 0 3px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
          resize: Tag === "textarea" ? "none" : undefined,
          colorScheme: "dark",
          boxSizing: "border-box",
          display: "block",
        }}
      />
      {/* Focused top accent */}
      {focused && (
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.7), transparent)",
          borderRadius: 1,
        }} />
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   SOCIAL BUTTON
════════════════════════════════════════════ */
const SocialBtn = ({ link, index, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={link.label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "9px 16px", borderRadius: 10,
        textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 700,
        background: hov ? `rgba(${link.color.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.15)` : "rgba(255,255,255,0.05)",
        border: `1px solid ${hov ? link.color + "55" : "rgba(255,255,255,0.09)"}`,
        color: hov ? link.color : "rgba(165,180,252,0.7)",
        backdropFilter: "blur(12px)",
        boxShadow: hov ? `0 8px 24px ${link.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
        transform: hov ? "translateY(-3px) scale(1.04)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
        animation: visible ? `ct_fadeUp 0.55s ease both ${0.5 + index * 0.07}s` : "none",
        opacity: visible ? 1 : 0,
      }}
    >
      <link.Icon size={14} />
      {link.label}
    </a>
  );
};

/* ════════════════════════════════════════════
   CONTACT INFO ROW
════════════════════════════════════════════ */
const InfoItem = ({ item, index, visible }) => {
  const [hov, setHov] = useState(false);
  const inner = (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "13px 16px", borderRadius: 14,
      background: hov
        ? `rgba(${item.accent.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.1)`
        : "rgba(255,255,255,0.03)",
      border: hov ? `1px solid ${item.accent}44` : "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(12px)",
      boxShadow: hov ? `0 4px 20px ${item.accent}22` : "none",
      transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
      cursor: item.href ? "pointer" : "default",
      animation: visible ? `ct_fadeUp 0.55s ease both ${0.35 + index * 0.1}s` : "none",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: hov ? `rgba(${item.accent.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.2)` : "rgba(255,255,255,0.06)",
        border: `1px solid ${item.accent}${hov ? "66" : "28"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? `0 0 20px ${item.accent}44` : "none",
        transition: "all 0.3s ease",
      }}>
        <item.Icon style={{ color: item.accent, fontSize: 16 }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ color:"rgba(165,180,252,0.5)", fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", margin:"0 0 3px 0", fontFamily:"'DM Sans', sans-serif" }}>
          {item.label}
        </p>
        <span style={{ color: hov ? "#e0e7ff" : "#c7d2fe", fontSize:"clamp(13px,1.4vw,15px)", fontWeight:600, fontFamily:"'DM Sans', sans-serif", transition:"color 0.2s ease", wordBreak:"break-all" }}>
          {item.value}
        </span>
      </div>
      {item.href && (
        <span style={{ marginLeft:"auto", color: item.accent, fontSize:11, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(-6px)", transition:"all 0.25s ease" }}>▶</span>
      )}
    </div>
  );
  const wrapProps = {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  };
  return item.href ? (
    <a href={item.href} style={{ textDecoration:"none" }} {...wrapProps}>{inner}</a>
  ) : (
    <div {...wrapProps}>{inner}</div>
  );
};

/* ════════════════════════════════════════════
   PROCESS STEP
════════════════════════════════════════════ */
const ProcessStep = ({ step, index, visible }) => {
  const [hov, setHov] = useState(false);
  const colors = ["#818cf8", "#c084fc", "#67e8f9", "#f472b6"];
  const col = colors[index % colors.length];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", gap:14, alignItems:"flex-start",
        padding:"13px 16px", borderRadius:14,
        background: hov ? `rgba(${col.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.09)` : "rgba(255,255,255,0.03)",
        border: hov ? `1px solid ${col}44` : "1px solid rgba(255,255,255,0.06)",
        transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        animation: visible ? `ct_fadeUp 0.55s ease both ${0.6 + index * 0.09}s` : "none",
        opacity: visible ? 1 : 0,
      }}
    >
      <div style={{
        fontFamily:"'Syne', sans-serif", fontWeight:900,
        fontSize:11, letterSpacing:"0.1em",
        color: col, flexShrink:0,
        width:28, height:28, borderRadius:8,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: `rgba(${col.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.15)`,
        border:`1px solid ${col}44`,
        boxShadow: hov ? `0 0 12px ${col}44` : "none",
        transition:"box-shadow 0.3s ease",
      }}>
        {step.num}
      </div>
      <div>
        <div style={{ color:"#e0e7ff", fontSize:13, fontWeight:700, marginBottom:3, fontFamily:"'DM Sans', sans-serif" }}>{step.title}</div>
        <div style={{ color:"rgba(165,180,252,0.55)", fontSize:11, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif" }}>{step.desc}</div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   CONTACT SECTION
════════════════════════════════════════════ */
const Contact = () => {
  const { ref: sectionRef, visible } = useInView(0.06);
  const [headingIdx, setHeadingIdx] = useState(0);
  const [headingVisible, setHeadingVisible] = useState(true);
  const [formData, setFormData] = useState({ name:"", email:"", company:"", phone:"", date:"", time:"", message:"" });
  const [formState, setFormState] = useState({ isSubmitting:false, isSuccess:false, error:null });
  const [hovSubmit, setHovSubmit] = useState(false);

  /* rotating heading */
  useEffect(() => {
    const iv = setInterval(() => {
      setHeadingVisible(false);
      setTimeout(() => {
        setHeadingIdx(p => (p + 1) % HEADINGS.length);
        setHeadingVisible(true);
      }, 380);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  const handleChange = useCallback(e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setFormState({ isSubmitting:true, isSuccess:false, error:null });
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("_captcha", "false");
      await fetch("https://formsubmit.co/26c5f71fda07ffbdc912a6d46cb82242", { method:"POST", body:fd });
      setFormState({ isSubmitting:false, isSuccess:true, error:null });
      setFormData({ name:"", email:"", company:"", phone:"", date:"", time:"", message:"" });
      setTimeout(() => setFormState({ isSubmitting:false, isSuccess:false, error:null }), 6000);
    } catch {
      setFormState({ isSubmitting:false, isSuccess:false, error:"Failed to send. Please try again." });
    }
  }, [formData]);

  const cardBase = {
    borderRadius: 24,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
    background: "linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes ct_fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ct_fadeDown  { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ct_fadeLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ct_fadeRight { from{opacity:0;transform:translateX(30px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes ct_float1    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-13px) rotate(4deg)} 66%{transform:translateY(-6px) rotate(-3deg)} }
        @keyframes ct_float2    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-17px)} }
        @keyframes ct_spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ct_pulse     { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.14);opacity:1} }
        @keyframes ct_gridMove  { from{transform:translateY(0)} to{transform:translateY(50px)} }
        @keyframes ct_arrowPulse{ 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes ct_spinner   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ct_badgePulse{ 0%,100%{box-shadow:0 0 0 0 rgba(129,140,248,.35)} 50%{box-shadow:0 0 0 7px rgba(129,140,248,0)} }
        @keyframes ct_shimmer   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(250%) skewX(-12deg)} }
        @keyframes ct_borderRot { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ct_scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes ct_glow      { 0%,100%{box-shadow:0 0 22px rgba(99,102,241,0.15)} 50%{box-shadow:0 0 44px rgba(168,85,247,0.35)} }

        .ct-section {
          position: relative; width: 100%; overflow: hidden;
          background: linear-gradient(160deg, #050714 0%, #080c1e 35%, #0d0620 65%, #060b1a 100%);
          font-family: 'DM Sans', sans-serif;
          padding: clamp(64px,9vw,120px) 0 clamp(64px,9vw,100px);
        }
        .ct-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 0 clamp(16px,4.5vw,72px);
          position: relative; z-index: 10;
        }
        .ct-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
        }
        @media (min-width: 900px) {
          .ct-two-col { grid-template-columns: 1fr 1fr; gap: 26px; }
        }
        .ct-date-time { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
        @media (max-width: 420px) { .ct-date-time { grid-template-columns: 1fr; } }
        .ct-social-row { display: flex; flex-wrap: wrap; gap: 9px; }
        input[type="date"], input[type="time"] { color-scheme: dark; }
        input::placeholder, textarea::placeholder { color: rgba(165,180,252,0.38); }
        /* Scanline */
        .ct-scanline {
          position: absolute; inset: 0; pointer-events: none; z-index: 4;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.018) 50%);
          background-size: 100% 3px;
        }
      `}</style>

      <section id="contact" ref={sectionRef} className="ct-section" aria-label="Contact IsiTech Innovations">

        {/* Grid bg */}
        <div style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",backgroundImage:`linear-gradient(rgba(129,140,248,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.04) 1px,transparent 1px)`,backgroundSize:"55px 55px",animation:"ct_gridMove 10s linear infinite" }} />

        {/* Scanline */}
        <div className="ct-scanline" />

        {/* Noise */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.022,pointerEvents:"none" }}>
          <filter id="ct_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#ct_noise)"/>
        </svg>

        {/* Radial glows */}
        <div style={{ position:"absolute",top:"6%",left:"18%",width:"clamp(260px,42vw,560px)",height:"clamp(260px,42vw,560px)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.14) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }} />
        <div style={{ position:"absolute",bottom:"4%",right:"8%",width:"clamp(220px,36vw,480px)",height:"clamp(220px,36vw,480px)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }} />
        <div style={{ position:"absolute",top:"52%",left:"6%",width:"clamp(160px,26vw,360px)",height:"clamp(160px,26vw,360px)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(103,232,249,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }} />

        <BgAccents />

        <div className="ct-inner">

          {/* ── Header ── */}
          <header style={{
            textAlign:"center",
            marginBottom:"clamp(40px,6vw,72px)",
            opacity: visible ? 1 : 0,
            animation: visible ? "ct_fadeDown 0.8s ease both 0.05s" : "none",
          }}>
            {/* Badge */}
            <div style={{ marginBottom:18 }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"6px 16px", borderRadius:100,
                background:"linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.13))",
                border:"1px solid rgba(129,140,248,0.32)",
                color:"#a5b4fc", fontSize:10, fontWeight:700,
                letterSpacing:"0.2em", textTransform:"uppercase",
                animation:"ct_badgePulse 3s ease-in-out infinite",
              }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 8px #818cf8",animation:"ct_pulse 2s ease-in-out infinite",display:"inline-block" }} />
                Get In Touch
              </span>
            </div>

            {/* Rotating heading */}
            <div style={{ minHeight:"clamp(2.4rem,6vw,4.4rem)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:18 }}>
              <h2 style={{
                fontFamily:"'Syne', sans-serif", fontWeight:900,
                fontSize:"clamp(1.5rem,4.5vw,3.4rem)",
                letterSpacing:"-0.03em", lineHeight:1.08, margin:0,
                background:"linear-gradient(135deg,#e0e7ff 0%,#818cf8 40%,#c084fc 70%,#f472b6 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                filter:"drop-shadow(0 0 22px rgba(129,140,248,0.45))",
                opacity: headingVisible ? 1 : 0,
                transform: headingVisible ? "translateY(0)" : "translateY(-16px)",
                transition:"opacity 0.38s ease, transform 0.38s ease",
                textAlign:"center",
              }}>
                {HEADINGS[headingIdx]}
              </h2>
            </div>

            <p style={{
              color:"rgba(199,210,254,0.62)", fontSize:"clamp(14px,1.7vw,18px)",
              lineHeight:1.8, maxWidth:600, margin:"0 auto", fontWeight:400,
            }}>
              Whether it's a website, app, or product strategy — we're ready to collaborate and bring your ideas to life.
            </p>

            <div style={{ marginTop:26, height:1, background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.45),transparent)", maxWidth:360, marginLeft:"auto", marginRight:"auto" }} />
          </header>

          {/* ── Two-column grid ── */}
          <div className="ct-two-col">

            {/* ════ FORM CARD ════ */}
            <div style={{
              ...cardBase,
              animation: visible ? "ct_fadeLeft 0.8s ease both 0.15s" : "none",
              opacity: visible ? 1 : 0,
              animationFillMode: "both",
            }}>
              {/* Rotating conic border */}
              <div style={{ position:"absolute",inset:-2,borderRadius:26,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
                <div style={{ position:"absolute",inset:-2,borderRadius:28,background:"conic-gradient(from 0deg,transparent 0%,#818cf830 20%,#c084fc55 40%,#67e8f930 60%,transparent 80%)",animation:"ct_borderRot 9s linear infinite" }} />
              </div>

              {/* Top accent bar */}
              <div style={{ position:"relative",zIndex:2,height:3,background:"linear-gradient(90deg,#6366f1,#a855f7,#f472b6)",boxShadow:"0 0 14px rgba(129,140,248,0.55)" }} />
              <div style={{ position:"absolute",top:3,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.45),transparent)",zIndex:2 }} />

              {/* Glow animation on card */}
              <div style={{ position:"relative",zIndex:2,padding:"clamp(22px,3.5vw,36px)",display:"flex",flexDirection:"column",gap:18 }}>
                {/* Card header */}
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.2))",border:"1px solid rgba(129,140,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>
                    ✦
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Syne', sans-serif",fontWeight:900,fontSize:"clamp(1.15rem,2.3vw,1.65rem)",letterSpacing:"-0.02em",margin:0,background:"linear-gradient(135deg,#e0e7ff,#818cf8 55%,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                      Start a Project
                    </h3>
                    <p style={{ color:"rgba(165,180,252,0.5)",fontSize:11,margin:0,fontFamily:"'DM Sans', sans-serif" }}>Free consultation — no obligations</p>
                  </div>
                </div>

                {/* Fields */}
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <Field name="name"  value={formData.name}  onChange={handleChange} placeholder="Full Name *"      required />
                    <Field name="email" value={formData.email} onChange={handleChange} placeholder="Email *"          required type="email" />
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <Field name="company" value={formData.company} onChange={handleChange} placeholder="Company / Brand" />
                    <Field name="phone"   value={formData.phone}   onChange={handleChange} placeholder="Phone"           type="tel" />
                  </div>
                  <div className="ct-date-time">
                    <Field name="date" value={formData.date} onChange={handleChange} placeholder="Preferred Date" required type="date" />
                    <Field name="time" value={formData.time} onChange={handleChange} placeholder="Preferred Time" required type="time" />
                  </div>
                  <Field as="textarea" name="message" value={formData.message} onChange={handleChange}
                    placeholder="Project Description / Message *" required rows={5} />
                </div>

                {/* Submit */}
                <div style={{ position:"relative",overflow:"hidden",borderRadius:12 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={formState.isSubmitting}
                    onMouseEnter={() => setHovSubmit(true)}
                    onMouseLeave={() => setHovSubmit(false)}
                    style={{
                      width:"100%", padding:"14px 24px", borderRadius:12,
                      border:"none",
                      cursor: formState.isSubmitting ? "not-allowed" : "pointer",
                      fontFamily:"'DM Sans', sans-serif",
                      fontSize:"clamp(13px,1.4vw,15px)", fontWeight:800, letterSpacing:"0.06em",
                      color:"#fff",
                      background: formState.isSuccess
                        ? "linear-gradient(135deg,#10b981,#059669)"
                        : hovSubmit
                          ? "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)"
                          : "linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",
                      boxShadow: formState.isSuccess
                        ? "0 8px 28px rgba(16,185,129,0.45)"
                        : hovSubmit ? "0 16px 48px rgba(99,102,241,0.6)" : "0 8px 28px rgba(99,102,241,0.4)",
                      transform: hovSubmit && !formState.isSubmitting ? "translateY(-2px) scale(1.015)" : "translateY(0) scale(1)",
                      transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",
                      opacity: formState.isSubmitting ? 0.7 : 1,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                      outline:"none", position:"relative", overflow:"hidden",
                    }}
                  >
                    {hovSubmit && !formState.isSubmitting && !formState.isSuccess && (
                      <span style={{ position:"absolute",top:0,left:0,bottom:0,width:"35%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)",animation:"ct_shimmer 0.65s ease forwards",pointerEvents:"none" }} />
                    )}
                    {formState.isSubmitting ? (
                      <>
                        <svg style={{ animation:"ct_spinner 0.9s linear infinite",width:18,height:18,flexShrink:0 }} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                        </svg>
                        Sending…
                      </>
                    ) : formState.isSuccess ? "✓ Message Sent Successfully!" : (
                      <>
                        <span style={{ display:"inline-block",animation:"ct_arrowPulse 2s ease-in-out infinite" }}>→</span>
                        Book a Free Consultation
                      </>
                    )}
                  </button>
                </div>

                {formState.isSuccess && (
                  <p style={{ textAlign:"center",color:"#34d399",fontSize:13,fontWeight:600,margin:0,animation:"ct_fadeUp 0.5s ease" }}>
                    Thank you! We'll get back to you within 24 hours. 🎉
                  </p>
                )}
                {formState.error && (
                  <p style={{ textAlign:"center",color:"#f87171",fontSize:13,fontWeight:600,margin:0,animation:"ct_fadeUp 0.5s ease" }}>
                    {formState.error}
                  </p>
                )}
              </div>
            </div>

            {/* ════ INFO CARD ════ */}
            <div style={{
              ...cardBase,
              animation: visible ? "ct_fadeRight 0.8s ease both 0.25s" : "none",
              opacity: visible ? 1 : 0,
              display:"flex", flexDirection:"column",
              animationFillMode: "both",
            }}>
              {/* Top accent */}
              <div style={{ height:3,background:"linear-gradient(90deg,#c084fc,#f472b6,#fb923c)",boxShadow:"0 0 14px rgba(192,132,252,0.55)",flexShrink:0,borderRadius:"24px 24px 0 0" }} />
              <div style={{ position:"absolute",top:3,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(192,132,252,0.4),transparent)" }} />

              <div style={{ padding:"clamp(22px,3.5vw,36px)",display:"flex",flexDirection:"column",gap:20,flex:1 }}>

                {/* Card header */}
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(192,132,252,0.3),rgba(244,114,182,0.2))",border:"1px solid rgba(192,132,252,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>
                    ◈
                  </div>
                  <div>
                    <h3 style={{ fontFamily:"'Syne', sans-serif",fontWeight:900,fontSize:"clamp(1.15rem,2.3vw,1.65rem)",letterSpacing:"-0.02em",margin:0,background:"linear-gradient(135deg,#e0e7ff,#c084fc 55%,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                      Contact Details
                    </h3>
                    <p style={{ color:"rgba(165,180,252,0.5)",fontSize:11,margin:0,fontFamily:"'DM Sans', sans-serif" }}>Reach us directly, anytime</p>
                  </div>
                </div>

                {/* Contact info */}
                <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
                  {CONTACT_INFO.map((item, i) => (
                    <InfoItem key={i} item={item} index={i} visible={visible} />
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.22),transparent)" }} />

                {/* Social */}
                <div>
                  <div style={{ color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10 }}>Connect With Us</div>
                  <div className="ct-social-row">
                    {SOCIAL_LINKS.map((link, i) => <SocialBtn key={i} link={link} index={i} visible={visible} />)}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.22),transparent)" }} />

                {/* Process steps */}
                <div>
                  <div style={{ color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10 }}>How It Works</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    {PROCESS_STEPS.map((step, i) => (
                      <ProcessStep key={i} step={step} index={i} visible={visible} />
                    ))}
                  </div>
                </div>

                {/* Urgent callout */}
                <div style={{
                  padding:"16px 20px", borderRadius:14, marginTop:"auto",
                  background:"linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))",
                  border:"1px solid rgba(129,140,248,0.22)",
                  borderLeft:"3px solid #818cf8",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)",
                  animation: visible ? "ct_fadeUp 0.6s ease both 0.85s" : "none",
                  opacity: visible ? 1 : 0,
                }}>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                    <span style={{ fontSize:18,lineHeight:1 }}>⚡</span>
                    <p style={{ margin:0,color:"rgba(199,210,254,0.8)",fontSize:"clamp(13px,1.4vw,15px)",lineHeight:1.7,fontFamily:"'DM Sans', sans-serif",fontWeight:500 }}>
                      <span style={{ fontWeight:900,fontFamily:"'Syne', sans-serif",background:"linear-gradient(135deg,#818cf8,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                        Need it urgent?
                      </span>{" "}
                      We can start within 48 hours. Let's talk today.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* end two-col */}
        </div>{/* end inner */}

        {/* Bottom divider */}
        <div style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.28),transparent)",zIndex:5 }} />
      </section>
    </>
  );
};

export default Contact;