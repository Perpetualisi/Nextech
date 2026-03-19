import { useEffect, useState, useRef, useCallback } from "react";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const C = {
  bg0:"#080A0F", bg1:"#0D1017", bg2:"#131820", bg3:"#1C2333",
  o1:"#4F8EF7",  o2:"#6BA3FF",  o3:"#93BBFF",  o4:"#2563EB",
  accent:"#38BDF8", accentAlt:"#818CF8",
  tw:"#F8FAFF", ts:"#C8D5F0", tm:"#7A90B8", tf:"#3A4F72",
};

/* ─── Data ───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label:"Home",     id:"home"     },
  { label:"About",    id:"about"    },
  { label:"Services", id:"services" },
  { label:"Projects", id:"projects" },
  { label:"Blog",     id:"blog"     },
  { label:"Contact",  id:"contact"  },
];

const SERVICES = [
  "Web Design & Development",
  "Mobile App Development",
  "UI / UX Design",
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

const SOCIAL_LINKS = [
  { href:"https://github.com/Perpetualisi",                       label:"GitHub",   color:C.o1,
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill={c}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
  { href:"mailto:isitech1111@gmail.com",                          label:"Email",    color:"#f87171",
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/></svg> },
  { href:"https://www.linkedin.com/in/perpetual-okan-759655344/",label:"LinkedIn",  color:C.o2,
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { href:"https://wa.me/2348103558837",                           label:"WhatsApp", color:"#4ade80",
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill={c}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
];

const CONTACT_ITEMS = [
  { label:"isitech1111@gmail.com", href:"mailto:isitech1111@gmail.com", color:C.o1      },
  { label:"+234 810 355 8837",     href:"tel:+2348103558837",           color:C.accent  },
  { label:"Nigeria",               href:null,                           color:C.accentAlt },
];

/* ─── Hex Pattern ────────────────────────────────────────────────────── */
const HexPattern = () => (
  <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.035}}>
    <defs>
      <pattern id="ft_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.7"/>
      </pattern>
      <pattern id="ft_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.45" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ft_hex1)"/>
    <rect width="100%" height="100%" fill="url(#ft_hex2)"/>
  </svg>
);

/* ─── Logo ───────────────────────────────────────────────────────────── */
const FooterLogo = ({ onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:11,transform:hov?"scale(1.03)":"none",transition:"transform 0.3s cubic-bezier(0.23,1,0.32,1)"}}
      aria-label="IsiTech Innovations home">
      {/* Logo mark — same as Navbar */}
      <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#4F8EF7,#38BDF8)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:18,color:"#fff",flexShrink:0,boxShadow:hov?"0 0 26px rgba(79,142,247,0.65)":"0 0 14px rgba(79,142,247,0.38)",transition:"box-shadow 0.3s ease"}}>I</div>
      <div style={{display:"flex",flexDirection:"column",lineHeight:1}}>
        <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(17px,2vw,21px)",letterSpacing:"-0.02em",background:hov?`linear-gradient(135deg,${C.tw},${C.o1},${C.accent})`:`linear-gradient(135deg,${C.ts},${C.o1})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",transition:"all 0.3s ease"}}>IsiTech</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:"clamp(8px,0.9vw,10px)",letterSpacing:"0.18em",textTransform:"uppercase",color:C.tm,marginTop:2}}>Innovations</span>
      </div>
    </button>
  );
};

/* ─── Footer ─────────────────────────────────────────────────────────── */
const Footer = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [taglineIn, setTaglineIn] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);},{threshold:0.05});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTaglineIn(false);
      setTimeout(()=>{setTaglineIdx(p=>(p+1)%TAGLINES.length);setTaglineIn(true);},350);
    },3600);
    return()=>clearInterval(iv);
  },[]);

  const handleNav=useCallback(id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});},[]);
  const handleSubscribe=useCallback(e=>{e.preventDefault();if(email.trim()){setSubscribed(true);setEmail("");};},[email]);

  /* Animation shorthand — avoids animation+animationFillMode conflict */
  const anim=(name,dur="0.7s",delay="0s")=>
    visible ? `${name} ${dur} cubic-bezier(0.23,1,0.32,1) ${delay} both` : "none";

  return(
    <>
      <style>{`
        @keyframes ft_fadeUp  {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ft_pulse   {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.2);opacity:1}}
        @keyframes ft_hexDrift{from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes ft_float1  {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-12px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
        @keyframes ft_spin    {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ft_gradText{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        .ft-footer{position:relative;width:100%;overflow:hidden;background:linear-gradient(165deg,#050810 0%,#080A0F 40%,#0A0E18 70%,#070A12 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;}
        .ft-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.012) 50%);background-size:100% 3px;}
        .ft-inner{max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,80px);position:relative;z-index:10;}
        .ft-grid{display:grid;grid-template-columns:1fr;gap:36px 28px;padding:clamp(52px,8vw,90px) 0 clamp(36px,5vw,60px);}
        @media(min-width:640px){.ft-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.ft-grid{grid-template-columns:2fr 1fr 1fr 1.6fr;gap:40px 44px;}}
        .ft-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(79,142,247,0.30),transparent);margin:0;}
        .ft-bottom{display:flex;flex-direction:column;gap:14px;padding:clamp(18px,3vw,26px) 0 clamp(22px,4vw,32px);align-items:center;text-align:center;}
        @media(min-width:768px){.ft-bottom{flex-direction:row;justify-content:space-between;text-align:left;}}
        input::placeholder{color:rgba(120,144,184,0.4);}
        .ft-shapes{display:none !important;}
        @media(min-width:600px){.ft-shapes{display:block !important;}}
      `}</style>

      <footer ref={ref} className="ft-footer" aria-label="IsiTech Innovations footer">

        {/* Hex pattern */}
        <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"ft_hexDrift 18s linear infinite"}}><HexPattern/></div>

        {/* Noise */}
        <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.018,pointerEvents:"none"}}><filter id="ft_n"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#ft_n)"/></svg>

        <div className="ft-scanline" aria-hidden="true"/>

        {/* Glows */}
        <div aria-hidden="true" style={{position:"absolute",top:0,left:"14%",width:"min(520px,44vw)",height:"min(520px,44vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div aria-hidden="true" style={{position:"absolute",bottom:0,right:"10%",width:"min(420px,36vw)",height:"min(420px,36vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.07) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>

        {/* Floating shapes */}
        <div className="ft-shapes" aria-hidden="true" style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
          <svg width="56" height="56" viewBox="0 0 90 90" style={{position:"absolute",top:"8%",right:"2.5%",animation:"ft_float1 10s ease-in-out infinite",filter:`drop-shadow(0 0 10px ${C.o1}55)`}}><polygon points="45,4 86,45 45,86 4,45" fill={C.o1} fillOpacity="0.06" stroke={C.o1} strokeWidth="1.1" opacity="0.65"/></svg>
          <svg width="62" height="62" viewBox="0 0 100 100" style={{position:"absolute",top:"38%",right:"0.5%",animation:"ft_spin 24s linear infinite",filter:`drop-shadow(0 0 9px ${C.accent}50)`}}><ellipse cx="50" cy="50" rx="45" ry="17" fill="none" stroke={C.accent} strokeWidth="6.5" opacity="0.52"/></svg>
          <svg width="48" height="48" viewBox="0 0 80 80" style={{position:"absolute",bottom:"15%",left:"1.5%",animation:"ft_float1 9s ease-in-out infinite reverse",filter:`drop-shadow(0 0 8px ${C.accentAlt}50)`}}><defs><linearGradient id="ft_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs><polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="url(#ft_sh1)" opacity="0.45"/></svg>
        </div>

        {/* Top separator */}
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.o1}55,${C.accent}44,transparent)`,position:"relative",zIndex:5}}>
          <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",width:180,height:36,background:`radial-gradient(ellipse,rgba(79,142,247,0.28) 0%,transparent 70%)`,filter:"blur(10px)"}}/>
        </div>

        <div className="ft-inner">
          <div className="ft-grid">

            {/* ── Brand column ── */}
            <div style={{display:"flex",flexDirection:"column",gap:18,opacity:visible?1:0,animation:anim("ft_fadeUp","0.7s","0.1s")}}>
              <FooterLogo onClick={()=>handleNav("home")}/>

              {/* Animated tagline */}
              <p style={{color:C.tm,fontSize:"clamp(13px,1.3vw,14.5px)",fontWeight:500,fontStyle:"italic",margin:0,lineHeight:1.6,borderLeft:`2px solid ${C.o1}40`,paddingLeft:12,opacity:taglineIn?1:0,transform:taglineIn?"translateY(0)":"translateY(-8px)",transition:"opacity 0.32s ease,transform 0.32s ease"}}>
                {TAGLINES[taglineIdx]}
              </p>

              <p style={{color:C.tf,fontSize:"clamp(12px,1.2vw,13px)",lineHeight:1.85,margin:0,maxWidth:280}}>
                Architecting transformative digital ecosystems that captivate audiences and drive measurable growth.
              </p>

              {/* Availability badge */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:7,background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.22)",width:"fit-content"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80",animation:"ft_pulse 2s ease-in-out infinite",display:"inline-block",flexShrink:0}}/>
                <span style={{color:"#4ade80",fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif"}}>AVAILABLE FOR PROJECTS</span>
              </div>

              {/* Social icons */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {SOCIAL_LINKS.map((link,i)=>{
                  const [hov,setHov]=useState(false);
                  return(
                    <a key={i} href={link.href} target={link.href.startsWith("http")?"_blank":undefined} rel={link.href.startsWith("http")?"noopener noreferrer":undefined} aria-label={link.label}
                      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                      style={{width:40,height:40,borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:hov?`${link.color}1e`:"rgba(255,255,255,0.05)",border:`1px solid ${hov?link.color+"55":"rgba(255,255,255,0.08)"}`,boxShadow:hov?`0 6px 18px ${link.color}30`:"none",transform:hov?"translateY(-4px) scale(1.08)":"none",transition:"all 0.28s cubic-bezier(0.23,1,0.32,1)",textDecoration:"none"}}>
                      {link.svg(hov?link.color:C.tm)}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* ── Quick links ── */}
            <div style={{opacity:visible?1:0,animation:anim("ft_fadeUp","0.7s","0.2s")}}>
              <div style={{marginBottom:16}}>
                <span style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Quick Links</span>
                <div style={{height:1,marginTop:7,background:`linear-gradient(90deg,${C.o1}40,transparent)`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:1}}>
                {NAV_LINKS.map((link,i)=>{
                  const [hov,setHov]=useState(false);
                  return(
                    <button key={link.id} onClick={()=>handleNav(link.id)}
                      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                      style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(13px,1.3vw,14px)",fontWeight:500,color:hov?C.ts:C.tm,textAlign:"left",padding:"5px 0",display:"flex",alignItems:"center",gap:8,transition:"all 0.22s ease",transform:hov?"translateX(5px)":"none",opacity:1}}>
                      <span style={{width:5,height:5,borderRadius:"50%",flexShrink:0,background:hov?C.o1:"rgba(79,142,247,0.28)",boxShadow:hov?`0 0 7px ${C.o1}`:"none",transition:"all 0.22s ease"}}/>
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Services ── */}
            <div style={{opacity:visible?1:0,animation:anim("ft_fadeUp","0.7s","0.3s")}}>
              <div style={{marginBottom:16}}>
                <span style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Services</span>
                <div style={{height:1,marginTop:7,background:`linear-gradient(90deg,${C.accent}40,transparent)`}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:1}}>
                {SERVICES.map((s,i)=>(
                  <div key={i} style={{color:C.tm,fontSize:"clamp(12.5px,1.2vw,13.5px)",fontWeight:500,padding:"5px 0",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:`${C.accent}55`,flexShrink:0}}/>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Newsletter + Contact ── */}
            <div style={{display:"flex",flexDirection:"column",gap:20,opacity:visible?1:0,animation:anim("ft_fadeUp","0.7s","0.4s")}}>

              {/* Newsletter card */}
              <div style={{padding:"18px 20px",borderRadius:14,background:C.bg2,border:`1px solid rgba(79,142,247,0.16)`,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.o1},${C.accent},${C.accentAlt})`}}/>
                <h4 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(13.5px,1.4vw,15.5px)",letterSpacing:"-0.01em",margin:"0 0 5px",background:`linear-gradient(135deg,${C.tw},${C.o1})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Stay in the Loop</h4>
                <p style={{color:C.tf,fontSize:11,margin:"0 0 13px",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Get insights on design, tech & digital growth.</p>
                {subscribed ? (
                  <div style={{padding:"9px 13px",borderRadius:9,background:"rgba(74,222,128,0.10)",border:"1px solid rgba(74,222,128,0.28)",color:"#4ade80",fontSize:12,fontWeight:700,textAlign:"center"}}>✓ Welcome aboard! 🎉</div>
                ) : (
                  <div style={{display:"flex",gap:7}}>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubscribe(e)} placeholder="your@email.com"
                      style={{flex:1,padding:"9px 12px",borderRadius:8,background:C.bg1,border:"1px solid rgba(255,255,255,0.08)",color:C.tw,fontFamily:"'DM Sans',sans-serif",fontSize:12,outline:"none",colorScheme:"dark",minWidth:0}}/>
                    <button onClick={handleSubscribe} style={{padding:"9px 14px",borderRadius:8,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.o1},${C.o4})`,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,flexShrink:0,transition:"all 0.22s ease",boxShadow:`0 4px 14px rgba(79,142,247,0.35)`}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 22px rgba(79,142,247,0.55)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 4px 14px rgba(79,142,247,0.35)`;}}>→</button>
                  </div>
                )}
              </div>

              {/* Quick contact */}
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                <div style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Contact</div>
                {CONTACT_ITEMS.map((item,i)=>{
                  const [hov,setHov]=useState(false);
                  const inner=<div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{color:hov?item.color:C.tm,fontSize:"clamp(12px,1.2vw,13px)",display:"flex",alignItems:"center",gap:7,transition:"color 0.2s ease",cursor:item.href?"pointer":"default"}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:item.color,opacity:hov?1:0.6,flexShrink:0,transition:"opacity 0.2s ease"}}/>
                    {item.label}
                  </div>;
                  return item.href
                    ? <a key={i} href={item.href} style={{textDecoration:"none"}}>{inner}</a>
                    : <div key={i}>{inner}</div>;
                })}
              </div>
            </div>

          </div>{/* end grid */}

          {/* Divider */}
          <div className="ft-divider" style={{opacity:visible?1:0,transition:"opacity 0.6s ease 0.6s"}}/>

          {/* Bottom row */}
          <div className="ft-bottom" style={{opacity:visible?1:0,animation:anim("ft_fadeUp","0.6s","0.65s")}}>
            <p style={{color:C.tf,fontSize:12,margin:0,fontFamily:"'DM Sans',sans-serif"}}>
              © {year}{" "}<span style={{color:C.tm,fontWeight:700}}>IsiTech Innovations</span>. All Rights Reserved.
            </p>
            <div style={{display:"flex",gap:18,flexWrap:"wrap",justifyContent:"center"}}>
              {["Privacy Policy","Terms of Service","Cookie Policy"].map((t,i)=>(
                <button key={i} style={{background:"none",border:"none",cursor:"pointer",color:C.tf,fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:500,padding:0,transition:"color 0.2s ease"}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.ts} onMouseLeave={e=>e.currentTarget.style.color=C.tf}>{t}</button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:C.tf,fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>Crafted with</span>
              <span style={{fontSize:13,animation:"ft_pulse 2s ease-in-out infinite",display:"inline-block",color:"#f87171"}}>♥</span>
              <span style={{color:C.tf,fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>in Nigeria</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;