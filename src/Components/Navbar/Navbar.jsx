import { useEffect, useState, useRef, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

const NAV_LINKS = [
  { label: "Home",     id: "home",     icon: "⌂" },
  { label: "About",    id: "about",    icon: "◈" },
  { label: "Services", id: "services", icon: "⬡" },
  { label: "Projects", id: "projects", icon: "◉" },
  { label: "Blog",     id: "blog",     icon: "✦" },
  { label: "Contact",  id: "contact",  icon: "◎" },
];

/* ════════════════════════════════════════════
   ACTIVE SECTION TRACKER
════════════════════════════════════════════ */
const useActiveSection = () => {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observers = NAV_LINKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return active;
};

/* ════════════════════════════════════════════
   3D SVG LOGO
════════════════════════════════════════════ */
const Logo3D = ({ onClick, compact }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: 0, display: "flex", alignItems: "center",
        gap: compact ? 7 : 10,
        transform: hov ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
      }}
      aria-label="IsiTech Innovations home"
    >
      <svg
        width={compact ? 32 : 38}
        height={compact ? 32 : 38}
        viewBox="0 0 80 80"
        style={{
          flexShrink: 0,
          filter: hov
            ? "drop-shadow(0 0 14px rgba(129,140,248,0.95))"
            : "drop-shadow(0 0 6px rgba(129,140,248,0.5))",
          transition: "filter 0.35s ease",
        }}
      >
        <defs>
          <linearGradient id="nb_face1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c7d2fe" /><stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="nb_face2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="nb_face3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="nb_face4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0e7ff" /><stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="nb_glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Isometric cube */}
        <polygon points="40,4 72,22 40,40 8,22"  fill="url(#nb_face4)" opacity="0.95" />
        <polygon points="8,22 40,40 40,76 8,58"  fill="url(#nb_face2)" opacity="0.95" />
        <polygon points="72,22 40,40 40,76 72,58" fill="url(#nb_face3)" opacity="0.95" />
        {/* Edge highlights */}
        <polyline points="40,4 40,40 40,76"   stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none" />
        <polyline points="8,22 40,40 72,22"   stroke="rgba(255,255,255,0.3)"  strokeWidth="0.8" fill="none" />
        <circle cx="40" cy="40" r="3" fill="white" opacity="0.5" filter="url(#nb_glow)" />
        <line x1="8" y1="22" x2="40" y2="4" stroke="rgba(199,210,254,0.6)" strokeWidth="1">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </line>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: compact ? "clamp(13px,1.4vw,16px)" : "clamp(15px,1.6vw,19px)",
          letterSpacing: "-0.02em",
          background: hov
            ? "linear-gradient(135deg,#e0e7ff 0%,#818cf8 40%,#c084fc 70%,#f472b6 100%)"
            : "linear-gradient(135deg,#c7d2fe 0%,#818cf8 50%,#a78bfa 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          transition: "all 0.3s ease",
          filter: hov ? "drop-shadow(0 0 8px rgba(129,140,248,0.6))" : "none",
        }}>
          IsiTech
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: compact ? "clamp(7px,0.7vw,9px)" : "clamp(8px,0.8vw,10px)",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(165,180,252,0.65)", marginTop: 1,
        }}>
          Innovations
        </span>
      </div>
    </button>
  );
};

/* ════════════════════════════════════════════
   DESKTOP NAV LINK with magnetic hover + active pill
════════════════════════════════════════════ */
const NavLink = ({ link, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(link.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: isActive
          ? "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(168,85,247,0.12))"
          : hov ? "rgba(255,255,255,0.05)" : "none",
        border: isActive ? "1px solid rgba(129,140,248,0.35)" : "1px solid transparent",
        borderRadius: 100,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: isActive ? "#c7d2fe" : hov ? "#c7d2fe" : "rgba(199,210,254,0.6)",
        transition: "all 0.28s cubic-bezier(0.23,1,0.32,1)",
        padding: "6px 14px",
        boxShadow: isActive ? "0 0 16px rgba(129,140,248,0.2), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
      }}
    >
      {/* Active glow dot */}
      {isActive && (
        <span style={{
          position: "absolute", top: 3, right: 3,
          width: 4, height: 4, borderRadius: "50%",
          background: "#818cf8",
          boxShadow: "0 0 6px #818cf8",
          animation: "nb_pulse 2s ease-in-out infinite",
        }} />
      )}
      {link.label}
      {/* Hover underline */}
      <span style={{
        position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
        height: "1.5px", width: hov && !isActive ? "60%" : "0%",
        background: "linear-gradient(90deg, transparent, #818cf8, transparent)",
        transition: "width 0.3s cubic-bezier(0.23,1,0.32,1)",
        borderRadius: 1,
      }} />
    </button>
  );
};

/* ════════════════════════════════════════════
   MOBILE NAV ITEM — full-width with icon
════════════════════════════════════════════ */
const MobileNavItem = ({ link, index, open, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onClick(link.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        background: isActive
          ? "linear-gradient(90deg,rgba(99,102,241,0.18),rgba(168,85,247,0.06))"
          : hov ? "rgba(99,102,241,0.09)" : "transparent",
        border: "none",
        borderLeft: isActive ? "3px solid #818cf8" : "3px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        padding: "15px 28px",
        display: "flex", alignItems: "center", gap: 14,
        fontFamily: "'Syne', sans-serif",
        fontSize: 15, fontWeight: 800,
        letterSpacing: "0.04em",
        color: isActive ? "#c7d2fe" : hov ? "#c7d2fe" : "rgba(199,210,254,0.7)",
        opacity: open ? 1 : 0,
        transform: open ? "translateX(0)" : "translateX(28px)",
        transition: `
          opacity 0.38s ease ${index * 50 + 80}ms,
          transform 0.38s cubic-bezier(0.23,1,0.32,1) ${index * 50 + 80}ms,
          background 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease
        `,
      }}
    >
      {/* Icon badge */}
      <span style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
        background: isActive
          ? "linear-gradient(135deg,rgba(99,102,241,0.4),rgba(168,85,247,0.3))"
          : hov ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
        border: isActive ? "1px solid rgba(129,140,248,0.45)" : "1px solid rgba(255,255,255,0.08)",
        color: isActive ? "#c7d2fe" : "rgba(165,180,252,0.6)",
        boxShadow: isActive ? "0 0 12px rgba(129,140,248,0.25)" : "none",
        transition: "all 0.25s ease",
      }}>
        {link.icon}
      </span>
      <span style={{ flex: 1 }}>{link.label}</span>
      {/* Chevron */}
      <span style={{
        fontSize: 10,
        color: isActive ? "#818cf8" : "rgba(129,140,248,0.35)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        transition: "transform 0.25s ease",
      }}>▶</span>
    </button>
  );
};

/* ════════════════════════════════════════════
   PROGRESS BAR — scroll indicator
════════════════════════════════════════════ */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "absolute", bottom: -1, left: 0, right: 0,
      height: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #6366f1, #a78bfa, #c084fc, #f472b6)",
        transition: "width 0.1s linear",
        boxShadow: "0 0 8px rgba(129,140,248,0.6)",
      }} />
    </div>
  );
};

/* ════════════════════════════════════════════
   STATUS BADGE
════════════════════════════════════════════ */
const StatusBadge = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: 5,
    padding: "4px 10px",
    borderRadius: 100,
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.22)",
  }}>
    <span style={{
      width: 5, height: 5, borderRadius: "50%",
      background: "#34d399",
      boxShadow: "0 0 6px #34d399",
      animation: "nb_pulse 2s ease-in-out infinite",
      display: "inline-block",
    }} />
    <span style={{
      color: "#34d399", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
    }}>OPEN</span>
  </div>
);

/* ════════════════════════════════════════════
   MAIN NAVBAR
════════════════════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [hovCta, setHovCta]       = useState(false);
  const [scrollY, setScrollY]     = useState(0);
  const activeSection             = useActiveSection();
  const headerRef                 = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
    };
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleScrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }, []);

  const isCompact = scrolled && scrollY > 80;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        @keyframes nb_fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nb_pulse {
          0%,100% { opacity: 0.8; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes nb_pulseRing {
          0%,100% { box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
          50%     { box-shadow: 0 4px 28px rgba(99,102,241,0.7), 0 0 0 4px rgba(99,102,241,0.1); }
        }
        @keyframes nb_shimmerSlide {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%)  skewX(-15deg); }
        }
        @keyframes nb_drawerIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes nb_arrowBounce {
          0%,100% { transform: translateX(0); }
          50%     { transform: translateX(4px); }
        }

        /* Touch-friendly tap states */
        @media (hover: none) {
          .nb-navlink:active { background: rgba(99,102,241,0.15) !important; }
          .nb-mob-item:active { background: rgba(99,102,241,0.12) !important; }
        }

        /* Safe area for notched phones */
        .nb-drawer { padding-bottom: env(safe-area-inset-bottom, 20px); }
        .nb-header { padding-top: env(safe-area-inset-top, 0); }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 80,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.38s ease",
        }}
      />

      {/* ── Header ── */}
      <header
        ref={headerRef}
        className="nb-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 90,
          animation: "nb_fadeDown 0.65s cubic-bezier(0.23,1,0.32,1) both",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease",
          background: scrolled
            ? "rgba(5,7,20,0.88)"
            : "rgba(5,7,20,0.18)",
          backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "blur(14px) saturate(130%)",
          WebkitBackdropFilter: scrolled ? "blur(28px) saturate(180%)" : "blur(14px) saturate(130%)",
          borderBottom: scrolled
            ? "1px solid rgba(129,140,248,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: scrolled
            ? "0 4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "none",
          padding: isCompact ? "8px 0" : "14px 0",
        }}
      >
        {/* Top shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.7) 50%, transparent 100%)",
          opacity: scrolled ? 0.9 : 0.3,
          transition: "opacity 0.4s ease",
        }} />

        {/* Scroll progress bar */}
        <ScrollProgress />

        <div style={{
          maxWidth: 1400, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(14px, 4vw, 52px)",
          gap: 12,
        }}>

          {/* Logo */}
          <Logo3D onClick={() => handleScrollTo("home")} compact={isCompact} />

          {/* Desktop: center nav */}
          {!isMobile && (
            <nav
              style={{
                display: "flex", alignItems: "center",
                gap: "clamp(2px, 1vw, 8px)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(129,140,248,0.1)",
                borderRadius: 100,
                padding: "4px 6px",
                backdropFilter: "blur(10px)",
              }}
            >
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.id}
                  link={link}
                  onClick={handleScrollTo}
                  isActive={activeSection === link.id}
                />
              ))}
            </nav>
          )}

          {/* Desktop: right side */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <StatusBadge />
              <button
                onClick={() => handleScrollTo("contact")}
                onMouseEnter={() => setHovCta(true)}
                onMouseLeave={() => setHovCta(false)}
                style={{
                  position: "relative", overflow: "hidden",
                  padding: "9px 22px",
                  borderRadius: 100, border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.07em",
                  color: "#fff",
                  background: hovCta
                    ? "linear-gradient(135deg,#818cf8,#6366f1,#a855f7)"
                    : "linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)",
                  animation: "nb_pulseRing 3s ease-in-out infinite",
                  transform: hovCta ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
                  transition: "background 0.3s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1)",
                  display: "flex", alignItems: "center", gap: 7,
                  whiteSpace: "nowrap",
                }}
              >
                {/* Shimmer sweep on hover */}
                {hovCta && (
                  <span style={{
                    position: "absolute", top: 0, left: 0, bottom: 0, width: "40%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                    animation: "nb_shimmerSlide 0.65s ease forwards",
                    pointerEvents: "none",
                  }} />
                )}
                <span style={{ animation: "nb_arrowBounce 2s ease-in-out infinite", display: "inline-block" }}>→</span>
                Get Started
              </button>
            </div>
          )}

          {/* Mobile: status + hamburger */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge />
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                style={{
                  zIndex: 100, padding: 9,
                  borderRadius: "50%", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 40, height: 40,
                  background: menuOpen
                    ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                    : "rgba(255,255,255,0.07)",
                  color: "#e0e7ff",
                  boxShadow: menuOpen
                    ? "0 0 24px rgba(99,102,241,0.55)"
                    : "0 2px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                  border: "1px solid rgba(129,140,248,0.28)",
                  transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "all 0.38s cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                {menuOpen ? <FaTimes size={16} /> : <HiMenu size={18} />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {isMobile && (
        <nav
          className="nb-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed", top: 0, right: 0,
            height: "100dvh", height: "100vh",
            width: "min(82%, 340px)",
            zIndex: 85,
            background: "linear-gradient(160deg, #07081c 0%, #0d0821 55%, #09101e 100%)",
            borderLeft: "1px solid rgba(129,140,248,0.18)",
            boxShadow: "-12px 0 60px rgba(0,0,0,0.7), -2px 0 0 rgba(129,140,248,0.08)",
            transform: menuOpen ? "translateX(0)" : "translateX(110%)",
            transition: "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Drawer ambient glows */}
          <div style={{ position:"absolute",top:"18%",right:"-25%",width:220,height:220,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.22) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:"20%",left:"-15%",width:180,height:180,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.18) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",top:"55%",right:"10%",width:100,height:100,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(103,232,249,0.1) 0%,transparent 70%)",pointerEvents:"none" }} />

          {/* Top edge shimmer */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,rgba(129,140,248,0.55),transparent)" }} />

          {/* Drawer header */}
          <div style={{
            padding: "0 20px",
            height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(129,140,248,0.1)",
            flexShrink: 0,
          }}>
            <Logo3D onClick={() => handleScrollTo("home")} compact />
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(129,140,248,0.2)",
                borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(165,180,252,0.7)",
                transition: "all 0.2s ease",
              }}
            >
              <FaTimes size={13} />
            </button>
          </div>

          {/* Section label */}
          <div style={{
            padding: "14px 28px 8px",
            opacity: menuOpen ? 1 : 0,
            transition: `opacity 0.3s ease ${NAV_LINKS.length * 50 + 160}ms`,
          }}>
            <span style={{ color:"rgba(129,140,248,0.45)",fontSize:9,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase" }}>
              Navigation
            </span>
          </div>

          {/* Nav items */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {NAV_LINKS.map((link, i) => (
              <MobileNavItem
                key={link.id}
                link={link}
                index={i}
                open={menuOpen}
                onClick={handleScrollTo}
                isActive={activeSection === link.id}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            margin: "0 20px",
            background: "linear-gradient(90deg,transparent,rgba(129,140,248,0.2),transparent)",
            opacity: menuOpen ? 1 : 0,
            transition: `opacity 0.3s ease ${NAV_LINKS.length * 50 + 180}ms`,
          }} />

          {/* Footer CTA block */}
          <div style={{
            padding: "18px 20px 28px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {/* Social proof strip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(129,140,248,0.1)",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.35s ease ${NAV_LINKS.length * 50 + 200}ms, transform 0.35s ease ${NAV_LINKS.length * 50 + 200}ms`,
            }}>
              <div style={{ display: "flex" }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: "50%",
                    marginLeft: i === 0 ? 0 : -7,
                    border: "2px solid #07081c",
                    background: `linear-gradient(135deg,${["#6366f1","#8b5cf6","#a855f7","#c084fc"][i]},${["#312e81","#4c1d95","#581c87","#6b21a8"][i]})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 7, color: "rgba(255,255,255,0.9)", fontWeight: 700,
                  }}>
                    {["A","B","C","D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:1 }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color:"#fbbf24",fontSize:9 }}>★</span>)}
                </div>
                <span style={{ color:"rgba(165,180,252,0.55)",fontSize:9 }}>
                  <strong style={{ color:"#a5b4fc" }}>500+</strong> brands trust us
                </span>
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={() => handleScrollTo("contact")}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 800, letterSpacing: "0.05em",
                color: "#fff",
                background: "linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#7c3aed 100%)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.4s ease ${NAV_LINKS.length * 50 + 240}ms, transform 0.4s ease ${NAV_LINKS.length * 50 + 240}ms`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <span style={{ animation: "nb_arrowBounce 2s ease-in-out infinite", display: "inline-block" }}>→</span>
              Get Started
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;