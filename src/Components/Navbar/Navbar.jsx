import { useEffect, useState, useRef, useCallback } from "react";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const C = {
  bg0:"#080A0F", bg1:"#0D1017",
  o1:"#4F8EF7", o2:"#6BA3FF", o3:"#93BBFF", o4:"#2563EB",
  accent:"#38BDF8", accentAlt:"#818CF8",
  tw:"#F8FAFF", ts:"#C8D5F0", tm:"#7A90B8", tf:"#3A4F72",
};

/* ─── Nav links ──────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label:"Home",     id:"home",     icon:"⌂" },
  { label:"About",    id:"about",    icon:"◈" },
  { label:"Services", id:"services", icon:"⬡" },
  { label:"Projects", id:"projects", icon:"◉" },
  { label:"Blog",     id:"blog",     icon:"✦" },
  { label:"Contact",  id:"contact",  icon:"◎" },
];

/* ─── Inline SVG icons (replaces react-icons) ───────────────────────── */
const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconX = ({ size=16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
);

/* ─── Active section tracker ─────────────────────────────────────────── */
const useActiveSection = () => {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = NAV_LINKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.30 }
      );
      o.observe(el);
      return o;
    }).filter(Boolean);
    return () => obs.forEach(o => o.disconnect());
  }, []);
  return active;
};

/* ─── Scroll progress bar ────────────────────────────────────────────── */
const ScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => {
      const d = document.documentElement;
      setPct(d.scrollHeight - d.clientHeight > 0 ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{position:"absolute",bottom:-1,left:0,right:0,height:2,background:"rgba(255,255,255,0.04)",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.o4},${C.o1},${C.accent})`,transition:"width 0.1s linear",boxShadow:`0 0 8px rgba(79,142,247,0.65)`}}/>
    </div>
  );
};

/* ─── Status badge ───────────────────────────────────────────────────── */
const StatusBadge = () => (
  <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:7,background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.22)"}}>
    <span style={{width:5,height:5,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80",animation:"nb_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
    <span style={{color:"#4ade80",fontSize:9,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif"}}>OPEN</span>
  </div>
);

/* ─── Logo ───────────────────────────────────────────────────────────── */
const Logo = ({ onClick, compact }) => {
  const [hov, setHov] = useState(false);
  const sz = compact ? 32 : 38;
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:compact?7:10,transform:hov?"scale(1.04)":"none",transition:"transform 0.32s cubic-bezier(0.23,1,0.32,1)"}}
      aria-label="IsiTech Innovations home">
      {/* Logo mark */}
      <div style={{width:sz,height:sz,borderRadius:Math.round(sz*0.28),background:"linear-gradient(135deg,#4F8EF7,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:Math.round(sz*0.46),color:"#fff",flexShrink:0,boxShadow:hov?"0 0 26px rgba(79,142,247,0.70)":"0 0 14px rgba(79,142,247,0.38)",transition:"box-shadow 0.3s ease"}}>I</div>
      <div style={{display:"flex",flexDirection:"column",lineHeight:1}}>
        <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:compact?"clamp(13px,1.4vw,16px)":"clamp(15px,1.6vw,19px)",letterSpacing:"-0.02em",background:hov?`linear-gradient(135deg,${C.tw},${C.o1},${C.accent})`:`linear-gradient(135deg,${C.ts},${C.o1})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",transition:"all 0.3s ease"}}>IsiTech</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:compact?"clamp(7px,0.7vw,9px)":"clamp(8px,0.8vw,10px)",letterSpacing:"0.18em",textTransform:"uppercase",color:C.tm,marginTop:1}}>Innovations</span>
      </div>
    </button>
  );
};

/* ─── Desktop nav link ───────────────────────────────────────────────── */
const NavLink = ({ link, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={()=>onClick(link.id)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"relative",
        background:isActive?`rgba(79,142,247,0.14)`:hov?"rgba(255,255,255,0.05)":"none",
        border:isActive?`1px solid rgba(79,142,247,0.38)`:"1px solid transparent",
        borderRadius:100, cursor:"pointer",
        fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700,
        letterSpacing:"0.1em", textTransform:"uppercase",
        color:isActive?C.ts:hov?C.ts:C.tm,
        transition:"all 0.26s cubic-bezier(0.23,1,0.32,1)",
        padding:"6px 14px",
        boxShadow:isActive?`0 0 14px rgba(79,142,247,0.18),inset 0 1px 0 rgba(255,255,255,0.07)`:"none",
      }}>
      {isActive&&<span style={{position:"absolute",top:3,right:3,width:4,height:4,borderRadius:"50%",background:C.o1,boxShadow:`0 0 6px ${C.o1}`,animation:"nb_pulse 2s ease-in-out infinite"}}/>}
      {link.label}
      <span style={{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",height:"1.5px",width:hov&&!isActive?"60%":"0%",background:`linear-gradient(90deg,transparent,${C.o1},transparent)`,transition:"width 0.28s cubic-bezier(0.23,1,0.32,1)",borderRadius:1}}/>
    </button>
  );
};

/* ─── Mobile nav item ────────────────────────────────────────────────── */
const MobileNavItem = ({ link, index, open, onClick, isActive }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={()=>onClick(link.id)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%",
        background:isActive?`rgba(79,142,247,0.12)`:hov?"rgba(79,142,247,0.07)":"transparent",
        border:"none",
        borderLeft:isActive?`3px solid ${C.o1}`:`3px solid transparent`,
        cursor:"pointer", textAlign:"left",
        padding:"15px 28px",
        display:"flex", alignItems:"center", gap:14,
        fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:800, letterSpacing:"0.04em",
        color:isActive?C.ts:hov?C.ts:C.tm,
        opacity:open?1:0,
        transform:open?"translateX(0)":"translateX(28px)",
        transition:`opacity 0.36s ease ${index*50+80}ms,transform 0.36s cubic-bezier(0.23,1,0.32,1) ${index*50+80}ms,background 0.2s ease,border-color 0.2s ease,color 0.2s ease`,
      }}>
      <span style={{width:34,height:34,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:isActive?`rgba(79,142,247,0.22)`:hov?"rgba(79,142,247,0.12)":"rgba(255,255,255,0.05)",border:isActive?`1px solid rgba(79,142,247,0.42)`:"1px solid rgba(255,255,255,0.08)",color:isActive?C.o1:C.tm,boxShadow:isActive?`0 0 12px rgba(79,142,247,0.25)`:"none",transition:"all 0.22s ease"}}>
        {link.icon}
      </span>
      <span style={{flex:1}}>{link.label}</span>
      <span style={{fontSize:10,color:isActive?C.o1:C.tf,transform:hov?"translateX(4px)":"none",transition:"transform 0.22s ease"}}>▶</span>
    </button>
  );
};

/* ─── Navbar ─────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [hovCta,    setHovCta]    = useState(false);
  const [scrollY,   setScrollY]   = useState(0);
  const activeSection = useActiveSection();

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<900);
    check();
    const onScroll=()=>{const y=window.scrollY;setScrolled(y>30);setScrollY(y);};
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",check);
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",check);};
  },[]);

  useEffect(()=>{ if(!isMobile)setMenuOpen(false); },[isMobile]);
  useEffect(()=>{ document.body.style.overflow=menuOpen?"hidden":""; return()=>{document.body.style.overflow="";}; },[menuOpen]);

  const handleScrollTo=useCallback(id=>{
    document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
    setMenuOpen(false);
  },[]);

  const isCompact = scrolled && scrollY > 80;

  return(
    <>
      <style>{`
        @keyframes nb_fadeDown  {from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes nb_pulse     {0%,100%{opacity:.8;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes nb_pulseRing {0%,100%{box-shadow:0 4px 20px rgba(79,142,247,0.40)}50%{box-shadow:0 4px 28px rgba(79,142,247,0.68),0 0 0 4px rgba(79,142,247,0.10)}}
        @keyframes nb_shimmer   {0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(300%) skewX(-15deg)}}
        @keyframes nb_arrowBounce{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
        @media(hover:none){.nb-mob-item:active{background:rgba(79,142,247,0.12) !important;}}
        .nb-drawer{padding-bottom:env(safe-area-inset-bottom,20px);}
        .nb-header{padding-top:env(safe-area-inset-top,0);}
      `}</style>

      {/* Backdrop */}
      <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:80,background:"rgba(0,0,0,0.62)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",opacity:menuOpen?1:0,pointerEvents:menuOpen?"auto":"none",transition:"opacity 0.36s ease"}}/>

      {/* Header */}
      <header className="nb-header" style={{position:"fixed",top:0,left:0,right:0,zIndex:90,animation:"nb_fadeDown 0.62s cubic-bezier(0.23,1,0.32,1) both",transition:"background 0.38s ease,border-color 0.38s ease,box-shadow 0.38s ease,padding 0.38s ease",background:scrolled?"rgba(8,10,15,0.90)":"rgba(8,10,15,0.18)",backdropFilter:scrolled?"blur(28px) saturate(180%)":"blur(14px) saturate(130%)",WebkitBackdropFilter:scrolled?"blur(28px) saturate(180%)":"blur(14px) saturate(130%)",borderBottom:scrolled?`1px solid rgba(79,142,247,0.18)`:"1px solid rgba(255,255,255,0.05)",boxShadow:scrolled?"0 4px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)":"none",padding:isCompact?"8px 0":"14px 0"}}>

        {/* Top shimmer line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.o1}70,${C.accent}55,transparent)`,opacity:scrolled?0.9:0.3,transition:"opacity 0.38s ease"}}/>

        <ScrollProgress/>

        <div style={{maxWidth:1440,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(14px,4vw,56px)",gap:12}}>

          <Logo onClick={()=>handleScrollTo("home")} compact={isCompact}/>

          {/* Desktop nav */}
          {!isMobile&&(
            <nav style={{display:"flex",alignItems:"center",gap:"clamp(2px,1vw,6px)",background:"rgba(255,255,255,0.03)",border:`1px solid rgba(79,142,247,0.10)`,borderRadius:100,padding:"4px 6px",backdropFilter:"blur(10px)"}}>
              {NAV_LINKS.map(link=>(
                <NavLink key={link.id} link={link} onClick={handleScrollTo} isActive={activeSection===link.id}/>
              ))}
            </nav>
          )}

          {/* Desktop right */}
          {!isMobile&&(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <StatusBadge/>
              <button onClick={()=>handleScrollTo("contact")}
                onMouseEnter={()=>setHovCta(true)} onMouseLeave={()=>setHovCta(false)}
                style={{position:"relative",overflow:"hidden",padding:"9px 22px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.07em",color:"#fff",background:hovCta?`linear-gradient(135deg,${C.o2},${C.o1},${C.accent})`:`linear-gradient(135deg,${C.o1},${C.o4})`,animation:"nb_pulseRing 3s ease-in-out infinite",transform:hovCta?"translateY(-2px) scale(1.05)":"none",transition:"background 0.28s ease,transform 0.28s cubic-bezier(0.23,1,0.32,1)",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap"}}>
                {hovCta&&<span style={{position:"absolute",top:0,left:0,bottom:0,width:"40%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",animation:"nb_shimmer 0.65s ease forwards",pointerEvents:"none"}}/>}
                <span style={{animation:"nb_arrowBounce 2s ease-in-out infinite",display:"inline-block"}}>→</span>
                Get Started
              </button>
            </div>
          )}

          {/* Mobile: status + hamburger */}
          {isMobile&&(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <StatusBadge/>
              <button onClick={()=>setMenuOpen(o=>!o)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen}
                style={{zIndex:100,padding:0,borderRadius:"50%",border:`1px solid rgba(79,142,247,0.28)`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:40,height:40,background:menuOpen?`linear-gradient(135deg,${C.o1},${C.o4})`:"rgba(255,255,255,0.07)",color:C.ts,boxShadow:menuOpen?`0 0 22px rgba(79,142,247,0.55)`:"0 2px 12px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08)",transform:menuOpen?"rotate(90deg)":"none",transition:"all 0.36s cubic-bezier(0.23,1,0.32,1)"}}>
                {menuOpen ? <IconX size={16}/> : <IconMenu/>}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobile&&(
        <nav className="nb-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu"
          style={{position:"fixed",top:0,right:0,height:"100dvh",width:"min(82%,340px)",zIndex:85,background:`linear-gradient(160deg,${C.bg1} 0%,#0A0E18 55%,#080C14 100%)`,borderLeft:`1px solid rgba(79,142,247,0.16)`,boxShadow:`-12px 0 60px rgba(0,0,0,0.70),-2px 0 0 rgba(79,142,247,0.08)`,transform:menuOpen?"translateX(0)":"translateX(110%)",transition:"transform 0.44s cubic-bezier(0.23,1,0.32,1)",display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Ambient glows */}
          <div style={{position:"absolute",top:"18%",right:"-25%",width:220,height:220,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"20%",left:"-15%",width:180,height:180,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:"55%",right:"10%",width:100,height:100,borderRadius:"50%",background:`radial-gradient(ellipse,rgba(129,140,248,0.09) 0%,transparent 70%)`,pointerEvents:"none"}}/>

          {/* Top shimmer */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.o1}55,transparent)`}}/>

          {/* Drawer header */}
          <div style={{padding:"0 20px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid rgba(79,142,247,0.10)`,flexShrink:0}}>
            <Logo onClick={()=>handleScrollTo("home")} compact/>
            <button onClick={()=>setMenuOpen(false)}
              style={{background:"rgba(255,255,255,0.05)",border:`1px solid rgba(79,142,247,0.18)`,borderRadius:"50%",width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.tm,transition:"all 0.2s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`rgba(79,142,247,0.12)`;e.currentTarget.style.color=C.ts;}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color=C.tm;}}>
              <IconX size={13}/>
            </button>
          </div>

          {/* Section label */}
          <div style={{padding:"13px 28px 7px",opacity:menuOpen?1:0,transition:`opacity 0.3s ease ${NAV_LINKS.length*50+160}ms`}}>
            <span style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Navigation</span>
          </div>

          {/* Nav items */}
          <div style={{flex:1,overflowY:"auto"}}>
            {NAV_LINKS.map((link,i)=>(
              <MobileNavItem key={link.id} link={link} index={i} open={menuOpen} onClick={handleScrollTo} isActive={activeSection===link.id}/>
            ))}
          </div>

          {/* Divider */}
          <div style={{height:1,margin:"0 20px",background:`linear-gradient(90deg,transparent,${C.o1}22,transparent)`,opacity:menuOpen?1:0,transition:`opacity 0.3s ease ${NAV_LINKS.length*50+180}ms`}}/>

          {/* Drawer CTA block */}
          <div style={{padding:"18px 20px 28px",display:"flex",flexDirection:"column",gap:10}}>
            {/* Social proof */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:`1px solid rgba(79,142,247,0.10)`,opacity:menuOpen?1:0,transform:menuOpen?"translateY(0)":"translateY(8px)",transition:`opacity 0.35s ease ${NAV_LINKS.length*50+200}ms,transform 0.35s ease ${NAV_LINKS.length*50+200}ms`}}>
              <div style={{display:"flex"}}>
                {[C.o1,C.o2,C.accent,C.accentAlt].map((col,i)=>(
                  <div key={i} style={{width:22,height:22,borderRadius:"50%",marginLeft:i===0?0:-7,border:`2px solid ${C.bg1}`,background:`linear-gradient(135deg,${col},${C.o4})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:"#fff",fontWeight:700}}>
                    {["A","B","C","D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{display:"flex",gap:1}}>{[...Array(5)].map((_,i)=><span key={i} style={{color:"#fbbf24",fontSize:9}}>★</span>)}</div>
                <span style={{color:C.tm,fontSize:9,fontFamily:"'DM Sans',sans-serif"}}><strong style={{color:C.ts}}>500+</strong> brands trust us</span>
              </div>
            </div>

            {/* CTA */}
            <button onClick={()=>handleScrollTo("contact")}
              style={{width:"100%",padding:"14px 0",borderRadius:11,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:800,letterSpacing:"0.05em",color:"#fff",background:`linear-gradient(135deg,${C.o1},${C.o4})`,boxShadow:`0 8px 28px rgba(79,142,247,0.45),inset 0 1px 0 rgba(255,255,255,0.14)`,opacity:menuOpen?1:0,transform:menuOpen?"translateY(0)":"translateY(12px)",transition:`opacity 0.4s ease ${NAV_LINKS.length*50+240}ms,transform 0.4s ease ${NAV_LINKS.length*50+240}ms`,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{animation:"nb_arrowBounce 2s ease-in-out infinite",display:"inline-block"}}>→</span>
              Get Started
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;