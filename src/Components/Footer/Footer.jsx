import { useEffect, useState, useRef, useCallback } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Home",     id: "home",     icon: "⌂" },
  { label: "About",    id: "about",    icon: "◈" },
  { label: "Services", id: "services", icon: "⬡" },
  { label: "Projects", id: "projects", icon: "◉" },
  { label: "Blog",     id: "blog",     icon: "✦" },
  { label: "Contact",  id: "contact",  icon: "◎" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/Perpetualisi",                        label: "GitHub",   Icon: FaGithub,   color: "#818cf8" },
  { href: "mailto:isitech1111@gmail.com",                           label: "Email",    Icon: FaEnvelope, color: "#f87171" },
  { href: "https://www.linkedin.com/in/perpetual-okan-759655344/", label: "LinkedIn", Icon: FaLinkedin, color: "#60a5fa" },
  { href: "https://wa.me/2348103558837",                            label: "WhatsApp", Icon: FaWhatsapp, color: "#4ade80" },
];

const SERVICES = [
  "Web Design & Development",
  "Mobile App Development",
  "UI/UX Design",
  "Brand Identity",
  "AI Integration",
  "Cloud & DevOps",
];

const TAGLINES = [
  "Empowering your digital future.",
  "Innovating with purpose.",
  "Design. Develop. Deliver.",
  "Your success, our mission.",
  "Engineering digital legacies.",
];

/* ════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════ */
const useInView = (threshold = 0.05) => {
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

/* ════════════════════════════════════════════
   3D LOGO (matches Navbar)
════════════════════════════════════════════ */
const FooterLogo = ({ onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:11,transform:hov?"scale(1.03)":"scale(1)",transition:"transform 0.3s cubic-bezier(0.23,1,0.32,1)" }}
      aria-label="IsiTech Innovations home"
    >
      <svg width="42" height="42" viewBox="0 0 80 80" style={{ flexShrink:0,filter:hov?"drop-shadow(0 0 14px rgba(129,140,248,0.9))":"drop-shadow(0 0 6px rgba(129,140,248,0.5))",transition:"filter 0.3s ease" }}>
        <defs>
          <linearGradient id="ft_f1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
          <linearGradient id="ft_f2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#312e81"/></linearGradient>
          <linearGradient id="ft_f3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
          <linearGradient id="ft_f4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
          <filter id="ft_glow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <polygon points="40,4 72,22 40,40 8,22" fill="url(#ft_f4)" opacity="0.95"/>
        <polygon points="8,22 40,40 40,76 8,58" fill="url(#ft_f2)" opacity="0.95"/>
        <polygon points="72,22 40,40 40,76 72,58" fill="url(#ft_f3)" opacity="0.95"/>
        <polyline points="40,4 40,40 40,76" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none"/>
        <polyline points="8,22 40,40 72,22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none"/>
        <circle cx="40" cy="40" r="3" fill="white" opacity="0.5" filter="url(#ft_glow)"/>
        <line x1="8" y1="22" x2="40" y2="4" stroke="rgba(199,210,254,0.6)" strokeWidth="1">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/>
        </line>
      </svg>
      <div style={{ display:"flex",flexDirection:"column",lineHeight:1 }}>
        <span style={{ fontFamily:"'Syne', sans-serif",fontWeight:900,fontSize:"clamp(17px,2vw,22px)",letterSpacing:"-0.02em",background:hov?"linear-gradient(135deg,#e0e7ff 0%,#818cf8 40%,#c084fc 70%,#f472b6 100%)":"linear-gradient(135deg,#c7d2fe 0%,#818cf8 50%,#a78bfa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",transition:"all 0.3s ease",filter:hov?"drop-shadow(0 0 8px rgba(129,140,248,0.6))":"none" }}>
          IsiTech
        </span>
        <span style={{ fontFamily:"'DM Sans', sans-serif",fontWeight:500,fontSize:"clamp(8px,0.9vw,11px)",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(165,180,252,0.65)",marginTop:2 }}>
          Innovations
        </span>
      </div>
    </button>
  );
};

/* ════════════════════════════════════════════
   FOOTER LINK
════════════════════════════════════════════ */
const FooterLink = ({ label, id, onNav, index, visible }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onNav(id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"none", border:"none", cursor:"pointer",
        fontFamily:"'DM Sans', sans-serif",
        fontSize:"clamp(13px,1.3vw,14px)", fontWeight:500,
        color: hov ? "#c7d2fe" : "rgba(165,180,252,0.6)",
        textAlign:"left", padding:"4px 0",
        display:"flex", alignItems:"center", gap:8,
        transition:"all 0.25s ease",
        transform: hov ? "translateX(5px)" : "translateX(0)",
        animation: visible ? `ft_fadeUp 0.55s ease both ${0.3 + index * 0.06}s` : "none",
        opacity: visible ? 1 : 0,
      }}
    >
      <span style={{ width:5,height:5,borderRadius:"50%",flexShrink:0,background: hov ? "#818cf8" : "rgba(129,140,248,0.3)",boxShadow: hov ? "0 0 7px #818cf8" : "none",transition:"all 0.25s ease" }} />
      {label}
    </button>
  );
};

/* ════════════════════════════════════════════
   SOCIAL ICON BUTTON
════════════════════════════════════════════ */
const SocialIcon = ({ link }) => {
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
        width:40, height:40, borderRadius:12, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: hov ? `rgba(${link.color.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.2)` : "rgba(255,255,255,0.06)",
        border: hov ? `1px solid ${link.color}55` : "1px solid rgba(255,255,255,0.09)",
        color: hov ? link.color : "rgba(165,180,252,0.65)",
        backdropFilter:"blur(12px)",
        boxShadow: hov ? `0 6px 20px rgba(${link.color.slice(1).match(/../g).map(h=>parseInt(h,16)).join(",")},0.3), inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
        transform: hov ? "translateY(-4px) scale(1.08)" : "translateY(0) scale(1)",
        transition:"all 0.3s cubic-bezier(0.23,1,0.32,1)",
        textDecoration:"none",
      }}
    >
      <link.Icon size={16} />
    </a>
  );
};

/* ════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════ */
const Footer = () => {
  const { ref, visible } = useInView(0.05);
  const year = new Date().getFullYear();
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setTaglineIdx(p => (p + 1) % TAGLINES.length);
        setTaglineVisible(true);
      }, 350);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  const handleNav = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  }, []);

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  }, [email]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

        @keyframes ft_fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ft_fadeDown  { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ft_pulse     { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.2);opacity:1} }
        @keyframes ft_gridMove  { from{transform:translateY(0)} to{transform:translateY(50px)} }
        @keyframes ft_spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ft_float1    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-12px) rotate(3deg)} 66%{transform:translateY(-5px) rotate(-2deg)} }
        @keyframes ft_shimmer   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(250%) skewX(-12deg)} }
        @keyframes ft_scanline  {
          0%  { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .ft-footer {
          position: relative; width: 100%; overflow: hidden;
          background: linear-gradient(160deg, #040613 0%, #070a1a 40%, #0b0519 70%, #05091a 100%);
          font-family: 'DM Sans', sans-serif;
        }
        .ft-scanline {
          position: absolute; inset: 0; pointer-events: none; z-index: 3;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.018) 50%);
          background-size: 100% 3px;
        }
        .ft-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 0 clamp(16px,4.5vw,72px);
          position: relative; z-index: 10;
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px 32px;
          padding: clamp(56px,8vw,96px) 0 clamp(40px,6vw,64px);
        }
        @media (min-width: 640px) {
          .ft-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .ft-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px 48px; }
        }
        .ft-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.28), transparent);
          margin: 0;
        }
        .ft-bottom {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: clamp(20px,3vw,28px) 0 clamp(24px,4vw,36px);
          align-items: center;
          text-align: center;
        }
        @media (min-width: 768px) {
          .ft-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
      `}</style>

      <footer ref={ref} className="ft-footer" aria-label="IsiTech Innovations Footer">

        {/* Grid bg */}
        <div style={{ position:"absolute",inset:0,zIndex:0,overflow:"hidden",backgroundImage:`linear-gradient(rgba(129,140,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.03) 1px,transparent 1px)`,backgroundSize:"55px 55px",animation:"ft_gridMove 10s linear infinite" }} />

        {/* Scanline */}
        <div className="ft-scanline" />

        {/* Noise */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.018,pointerEvents:"none" }}>
          <filter id="ft_noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#ft_noise)"/>
        </svg>

        {/* Radial glows */}
        <div style={{ position:"absolute",top:"0%",left:"15%",width:"clamp(240px,40vw,520px)",height:"clamp(240px,40vw,520px)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }} />
        <div style={{ position:"absolute",bottom:"0%",right:"12%",width:"clamp(200px,32vw,420px)",height:"clamp(200px,32vw,420px)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:1 }} />

        {/* Floating deco */}
        <div style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden" }}>
          <svg width="58" height="58" viewBox="0 0 80 80" style={{ position:"absolute",top:"8%",right:"3%",animation:"ft_float1 10s ease-in-out infinite",filter:"drop-shadow(0 0 10px #f472b655)" }}>
            <defs><linearGradient id="ft_d1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fce7f3"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
            <polygon points="40,4 76,40 40,76 4,40" fill="url(#ft_d1)" opacity="0.55"/>
          </svg>
          <svg width="64" height="64" viewBox="0 0 100 100" style={{ position:"absolute",top:"35%",right:"0.5%",animation:"ft_spin 22s linear infinite",filter:"drop-shadow(0 0 9px #67e8f955)" }}>
            <defs><linearGradient id="ft_t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0891b2"/></linearGradient></defs>
            <ellipse cx="50" cy="50" rx="45" ry="17" fill="none" stroke="url(#ft_t1)" strokeWidth="7" opacity="0.55"/>
          </svg>
          <svg width="48" height="48" viewBox="0 0 80 80" style={{ position:"absolute",bottom:"18%",left:"1.5%",animation:"ft_float1 8s ease-in-out infinite reverse",filter:"drop-shadow(0 0 8px #818cf855)" }}>
            <defs><linearGradient id="ft_h1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs>
            <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="url(#ft_h1)" opacity="0.5"/>
          </svg>
        </div>

        {/* Top separator with glow */}
        <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.5),rgba(192,132,252,0.4),transparent)",position:"relative",zIndex:5 }}>
          <div style={{ position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",width:200,height:40,background:"radial-gradient(ellipse,rgba(129,140,248,0.3) 0%,transparent 70%)",filter:"blur(10px)" }} />
        </div>

        <div className="ft-inner">
          <div className="ft-grid">

            {/* ── Brand column ── */}
            <div style={{
              display:"flex", flexDirection:"column", gap:18,
              animation: visible ? "ft_fadeUp 0.7s ease both 0.1s" : "none",
              opacity: visible ? 1 : 0,
            }}>
              <FooterLogo onClick={() => handleNav("home")} />

              {/* Animated tagline */}
              <div style={{ minHeight:24 }}>
                <p style={{
                  color:"rgba(165,180,252,0.7)", fontSize:"clamp(13px,1.4vw,15px)",
                  fontWeight:500, fontStyle:"italic", margin:0, lineHeight:1.6,
                  borderLeft:"2px solid rgba(129,140,248,0.38)", paddingLeft:12,
                  opacity: taglineVisible ? 1 : 0,
                  transform: taglineVisible ? "translateY(0)" : "translateY(-8px)",
                  transition:"opacity 0.35s ease, transform 0.35s ease",
                }}>
                  {TAGLINES[taglineIdx]}
                </p>
              </div>

              <p style={{ color:"rgba(165,180,252,0.5)",fontSize:"clamp(12px,1.3vw,13px)",lineHeight:1.8,margin:0,maxWidth:280 }}>
                Architecting transformative digital ecosystems that captivate audiences and drive measurable growth.
              </p>

              {/* Availability */}
              <div style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:100,background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.22)",width:"fit-content" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399",animation:"ft_pulse 2s ease-in-out infinite",display:"inline-block" }} />
                <span style={{ color:"#34d399",fontSize:10,fontWeight:700,letterSpacing:"0.12em" }}>AVAILABLE FOR PROJECTS</span>
              </div>

              {/* Social icons */}
              <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
                {SOCIAL_LINKS.map((link, i) => <SocialIcon key={i} link={link} />)}
              </div>
            </div>

            {/* ── Quick links ── */}
            <div style={{
              animation: visible ? "ft_fadeUp 0.7s ease both 0.2s" : "none",
              opacity: visible ? 1 : 0,
            }}>
              <div style={{ marginBottom:18 }}>
                <span style={{ color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase" }}>Quick Links</span>
                <div style={{ height:1,marginTop:8,background:"linear-gradient(90deg,rgba(129,140,248,0.35),transparent)" }} />
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
                {NAV_LINKS.map((link, i) => (
                  <FooterLink key={link.id} label={link.label} id={link.id} onNav={handleNav} index={i} visible={visible} />
                ))}
              </div>
            </div>

            {/* ── Services ── */}
            <div style={{
              animation: visible ? "ft_fadeUp 0.7s ease both 0.3s" : "none",
              opacity: visible ? 1 : 0,
            }}>
              <div style={{ marginBottom:18 }}>
                <span style={{ color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase" }}>Services</span>
                <div style={{ height:1,marginTop:8,background:"linear-gradient(90deg,rgba(192,132,252,0.35),transparent)" }} />
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
                {SERVICES.map((s, i) => (
                  <div key={i} style={{
                    color:"rgba(165,180,252,0.55)", fontSize:"clamp(13px,1.3vw,14px)",
                    fontWeight:500, padding:"4px 0",
                    display:"flex", alignItems:"center", gap:8,
                    animation: visible ? `ft_fadeUp 0.55s ease both ${0.35 + i * 0.06}s` : "none",
                    opacity: visible ? 1 : 0,
                  }}>
                    <span style={{ width:4,height:4,borderRadius:"50%",background:"rgba(192,132,252,0.45)",flexShrink:0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Newsletter + Contact ── */}
            <div style={{
              display:"flex", flexDirection:"column", gap:22,
              animation: visible ? "ft_fadeUp 0.7s ease both 0.4s" : "none",
              opacity: visible ? 1 : 0,
            }}>
              {/* Newsletter */}
              <div style={{
                padding:"20px",
                borderRadius:18,
                background:"linear-gradient(160deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))",
                border:"1px solid rgba(129,140,248,0.15)",
                backdropFilter:"blur(16px)",
                boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)",
              }}>
                <div style={{ height:2,background:"linear-gradient(90deg,#6366f1,#a855f7,#f472b6)",borderRadius:1,marginBottom:14,boxShadow:"0 0 8px rgba(129,140,248,0.4)" }} />
                <h4 style={{ fontFamily:"'Syne', sans-serif",fontWeight:900,fontSize:"clamp(14px,1.5vw,16px)",letterSpacing:"-0.01em",margin:"0 0 6px 0",background:"linear-gradient(135deg,#e0e7ff,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                  Stay in the Loop
                </h4>
                <p style={{ color:"rgba(165,180,252,0.5)",fontSize:11,margin:"0 0 14px 0",lineHeight:1.6 }}>
                  Get insights on design, tech & digital growth.
                </p>
                {subscribed ? (
                  <div style={{ padding:"10px 14px",borderRadius:10,background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.3)",color:"#34d399",fontSize:12,fontWeight:700,textAlign:"center",animation:"ft_fadeUp 0.4s ease" }}>
                    ✓ You're subscribed! Welcome aboard 🎉
                  </div>
                ) : (
                  <div style={{ display:"flex",gap:8 }}>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe(e)}
                      placeholder="your@email.com"
                      style={{ flex:1,padding:"9px 13px",borderRadius:9,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"#e0e7ff",fontFamily:"'DM Sans', sans-serif",fontSize:12,outline:"none",colorScheme:"dark",minWidth:0 }}
                    />
                    <button
                      onClick={handleSubscribe}
                      style={{ padding:"9px 14px",borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"#fff",fontFamily:"'DM Sans', sans-serif",fontSize:12,fontWeight:700,flexShrink:0,transition:"all 0.25s ease" }}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              {/* Contact quick info */}
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <div style={{ color:"rgba(165,180,252,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase" }}>Contact</div>
                {[
                  { label:"isitech1111@gmail.com", href:"mailto:isitech1111@gmail.com", col:"#818cf8" },
                  { label:"+234 810 355 8837",     href:"tel:+2348103558837",           col:"#c084fc" },
                  { label:"Nigeria",               href:null,                            col:"#34d399" },
                ].map((c, i) => (
                  c.href ? (
                    <a key={i} href={c.href} style={{ color:"rgba(165,180,252,0.6)",fontSize:"clamp(12px,1.3vw,13px)",textDecoration:"none",display:"flex",alignItems:"center",gap:7,transition:"color 0.2s ease" }}
                      onMouseEnter={e => e.currentTarget.style.color = c.col}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(165,180,252,0.6)"}
                    >
                      <span style={{ width:4,height:4,borderRadius:"50%",background:c.col,opacity:0.7,flexShrink:0 }} />
                      {c.label}
                    </a>
                  ) : (
                    <div key={i} style={{ color:"rgba(165,180,252,0.6)",fontSize:"clamp(12px,1.3vw,13px)",display:"flex",alignItems:"center",gap:7 }}>
                      <span style={{ width:4,height:4,borderRadius:"50%",background:c.col,opacity:0.7,flexShrink:0 }} />
                      {c.label}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="ft-divider" style={{ opacity: visible ? 1 : 0, transition:"opacity 0.6s ease 0.6s" }} />

          {/* Bottom row */}
          <div className="ft-bottom" style={{ animation: visible ? "ft_fadeUp 0.6s ease both 0.65s" : "none", opacity: visible ? 1 : 0 }}>
            <p style={{ color:"rgba(165,180,252,0.4)",fontSize:12,margin:0,fontFamily:"'DM Sans', sans-serif" }}>
              © {year} <span style={{ color:"rgba(165,180,252,0.65)",fontWeight:700 }}>IsiTech Innovations</span>. All Rights Reserved.
            </p>

            {/* Legal links */}
            <div style={{ display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center" }}>
              {["Privacy Policy","Terms of Service","Cookie Policy"].map((t, i) => (
                <button key={i} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(165,180,252,0.4)",fontSize:11,fontFamily:"'DM Sans', sans-serif",fontWeight:500,padding:0,transition:"color 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(165,180,252,0.8)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(165,180,252,0.4)"}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Made with */}
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ color:"rgba(165,180,252,0.35)",fontSize:11 }}>Crafted with</span>
              <span style={{ fontSize:13,animation:"ft_pulse 2s ease-in-out infinite",display:"inline-block" }}>♥</span>
              <span style={{ color:"rgba(165,180,252,0.35)",fontSize:11 }}>in Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;