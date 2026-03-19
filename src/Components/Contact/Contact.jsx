import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const C = {
  bg0:"#080A0F", bg1:"#0D1017", bg2:"#131820", bg3:"#1C2333",
  o1:"#4F8EF7",  o2:"#6BA3FF",  o3:"#93BBFF",  o4:"#2563EB",
  accent:"#38BDF8", accentAlt:"#818CF8",
  tw:"#F8FAFF", ts:"#C8D5F0", tm:"#7A90B8", tf:"#3A4F72",
};

/* ─── Data ───────────────────────────────────────────────────────────── */
const HEADINGS = [
  "Let's Build Something Exceptional",
  "Start Your Project With Us",
  "Design. Develop. Deliver.",
  "Empowering Ideas Digitally",
  "Ready to Bring Your Vision to Life",
  "Collaborate. Create. Launch.",
];

const SOCIAL_LINKS = [
  { href:"https://github.com/Perpetualisi",                        label:"GitHub",   color:C.o1,
    svg: c=><svg viewBox="0 0 24 24" width="13" height="13" fill={c}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
  { href:"mailto:isitech1111@gmail.com",                           label:"Email",    color:"#f87171",
    svg: c=><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/></svg> },
  { href:"https://www.linkedin.com/in/perpetual-okan-759655344/",  label:"LinkedIn", color:C.o2,
    svg: c=><svg viewBox="0 0 24 24" width="13" height="13" fill={c}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { href:"https://wa.me/2348103558837",                            label:"WhatsApp", color:"#4ade80",
    svg: c=><svg viewBox="0 0 24 24" width="13" height="13" fill={c}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
];

const CONTACT_INFO = [
  { label:"Email",    value:"isitech1111@gmail.com", href:"mailto:isitech1111@gmail.com", color:C.o1,
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/></svg> },
  { label:"Phone",    value:"+234 810 355 8837",     href:"tel:+2348103558837",           color:C.accent,
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6 6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { label:"Location", value:"Nigeria",               href:null,                           color:C.accentAlt,
    svg: c=><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
];

const PROCESS_STEPS = [
  { num:"01", title:"Discovery Call",   desc:"We learn your goals, challenges, and vision in depth." },
  { num:"02", title:"Strategy & Scope", desc:"We craft a precise plan with timelines and deliverables." },
  { num:"03", title:"Build & Iterate",  desc:"Rapid development with weekly demos and feedback loops." },
  { num:"04", title:"Launch & Scale",   desc:"Live deployment with ongoing optimisation support." },
];

const STEP_COLORS = [C.o1, C.accent, C.accentAlt, C.o2];

/* ─── Hex Pattern ────────────────────────────────────────────────────── */
const HexPattern = () => (
  <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none",opacity:0.04}}>
    <defs>
      <pattern id="ct_hex1" x="0" y="0" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#4F8EF7" strokeWidth="0.8"/>
      </pattern>
      <pattern id="ct_hex2" x="30" y="34.64" width="60" height="69.28" patternUnits="userSpaceOnUse">
        <polygon points="30,0 60,17.32 60,51.96 30,69.28 0,51.96 0,17.32" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#ct_hex1)"/>
    <rect width="100%" height="100%" fill="url(#ct_hex2)"/>
  </svg>
);

/* ─── Input / Textarea ───────────────────────────────────────────────── */
const Field = ({ as:Tag="input", name, value, onChange, placeholder, required, type="text", rows }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{position:"relative"}}>
      <Tag name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        type={type} rows={rows}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:"100%", padding:"12px 16px", borderRadius:10, outline:"none",
          fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.3vw,14.5px)", fontWeight:400,
          background: focused ? "rgba(79,142,247,0.08)" : C.bg2,
          border: `1px solid ${focused ? "rgba(79,142,247,0.55)" : "rgba(255,255,255,0.08)"}`,
          color: C.tw,
          boxShadow: focused ? "0 0 0 3px rgba(79,142,247,0.14), inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition:"all 0.22s cubic-bezier(0.23,1,0.32,1)",
          resize: Tag==="textarea" ? "none" : undefined,
          colorScheme:"dark",
          boxSizing:"border-box", display:"block",
        }}
      />
      {focused && <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}70,transparent)`,borderRadius:1}}/>}
    </div>
  );
};

/* ─── Contact Section ────────────────────────────────────────────────── */
const Contact = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [headingIdx, setHeadingIdx] = useState(0);
  const [headingIn, setHeadingIn] = useState(true);
  const [formData, setFormData] = useState({name:"",email:"",company:"",phone:"",date:"",time:"",message:""});
  const [formState, setFormState] = useState({submitting:false,success:false,error:null});
  const [hovSubmit, setHovSubmit] = useState(false);

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true);},{threshold:0.06,rootMargin:"40px"});
    if(sectionRef.current)obs.observe(sectionRef.current);
    return()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setHeadingIn(false);
      setTimeout(()=>{setHeadingIdx(p=>(p+1)%HEADINGS.length);setHeadingIn(true);},350);
    },3600);
    return()=>clearInterval(iv);
  },[]);

  const handleChange=useCallback(e=>{setFormData(p=>({...p,[e.target.name]:e.target.value}));},[]);

  const handleSubmit=useCallback(async e=>{
    e.preventDefault();
    setFormState({submitting:true,success:false,error:null});
    try{
      const fd=new FormData();
      Object.entries(formData).forEach(([k,v])=>fd.append(k,v));
      fd.append("_captcha","false");
      await fetch("https://formsubmit.co/26c5f71fda07ffbdc912a6d46cb82242",{method:"POST",body:fd});
      setFormState({submitting:false,success:true,error:null});
      setFormData({name:"",email:"",company:"",phone:"",date:"",time:"",message:""});
      setTimeout(()=>setFormState({submitting:false,success:false,error:null}),6000);
    }catch{
      setFormState({submitting:false,success:false,error:"Failed to send. Please try again."});
    }
  },[formData]);

  /* ── animation helpers — no animationFillMode conflicts ── */
  const anim = (name, dur="0.7s", delay="0s") =>
    visible ? `${name} ${dur} cubic-bezier(0.23,1,0.32,1) ${delay} both` : "none";

  return(
    <>
      <style>{`
        @keyframes ct_fadeUp    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ct_fadeDown  {from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ct_fadeLeft  {from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ct_fadeRight {from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ct_pulse     {0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.18);opacity:1}}
        @keyframes ct_glowPulse {0%,100%{box-shadow:0 0 24px rgba(79,142,247,0.18)}50%{box-shadow:0 0 52px rgba(79,142,247,0.40),0 0 0 1px rgba(79,142,247,0.12)}}
        @keyframes ct_borderRot {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ct_scanDown  {0%{transform:translateY(-100%)}100%{transform:translateY(1200px)}}
        @keyframes ct_shimmer   {0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(260%) skewX(-12deg)}}
        @keyframes ct_hexDrift  {from{transform:translateY(0)}to{transform:translateY(80px)}}
        @keyframes ct_gradText  {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes ct_badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(79,142,247,0.45)}50%{box-shadow:0 0 0 9px rgba(79,142,247,0)}}
        @keyframes ct_float1    {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-13px) rotate(2.5deg)}66%{transform:translateY(-5px) rotate(-1.5deg)}}
        @keyframes ct_spinner   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ct_arrowPulse{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}

        .ct-section{position:relative;width:100%;overflow:hidden;background:linear-gradient(165deg,#080A0F 0%,#0D1017 35%,#101520 65%,#090C13 100%);font-family:'DM Sans',sans-serif;color:#F8FAFF;padding:clamp(56px,9vw,110px) 0 clamp(64px,10vw,120px);}
        .ct-scanline{position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(transparent 50%,rgba(0,0,0,0.01) 50%);background-size:100% 3px;}
        .ct-inner{position:relative;z-index:10;max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,80px);display:flex;flex-direction:column;gap:clamp(32px,5vw,52px);}
        .ct-cols{display:flex;flex-direction:column;gap:clamp(18px,2.5vw,26px);}
        @media(min-width:860px){.ct-cols{flex-direction:row;align-items:flex-start;}.ct-left{flex:0 0 42%;}.ct-right{flex:1;}}
        .ct-card{border-radius:18px;overflow:hidden;border:1px solid rgba(79,142,247,0.18);background:#131820;animation:ct_glowPulse 4s ease-in-out infinite;}
        .ct-card-body{padding:clamp(20px,3vw,32px);display:flex;flex-direction:column;gap:16px;}
        .ct-hl{font-family:'Sora',sans-serif;font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:#F8FAFF;margin:0;font-size:clamp(1.75rem,7.8vw,2.35rem);}
        .ct-hl .ct-accent{display:block;background:linear-gradient(135deg,#93BBFF 0%,#4F8EF7 30%,#38BDF8 60%,#818CF8 85%,#4F8EF7 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:ct_gradText 5s ease infinite;filter:drop-shadow(0 0 22px rgba(79,142,247,0.5));}
        .ct-date-time{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        @media(max-width:420px){.ct-date-time{grid-template-columns:1fr;}}
        .ct-social-row{display:flex;flex-wrap:wrap;gap:8px;}
        input::placeholder,textarea::placeholder{color:rgba(120,144,184,0.45);}
        input[type="date"],input[type="time"]{color-scheme:dark;}
        .ct-shapes{display:none !important;}
        @media(min-width:600px){.ct-shapes{display:block !important;}}
        @media(max-width:380px){.ct-inner{padding:0 10px;}.ct-hl{font-size:1.55rem;}}
        @media(min-width:768px){.ct-hl{font-size:clamp(2rem,3vw,3.1rem);}}
      `}</style>

      <section id="contact" ref={sectionRef} className="ct-section" aria-label="Contact IsiTech Innovations">

        {/* Hex */}
        <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:0,overflow:"hidden",animation:"ct_hexDrift 16s linear infinite"}}><HexPattern/></div>
        <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0,opacity:0.025,pointerEvents:"none"}}><filter id="ct_n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#ct_n)"/></svg>
        <div className="ct-scanline" aria-hidden="true"/>

        {/* Glows */}
        <div aria-hidden="true" style={{position:"absolute",top:"6%",left:"16%",width:"min(560px,48vw)",height:"min(560px,48vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(79,142,247,0.10) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div aria-hidden="true" style={{position:"absolute",bottom:"4%",right:"8%",width:"min(480px,38vw)",height:"min(480px,38vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(56,189,248,0.08) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>
        <div aria-hidden="true" style={{position:"absolute",top:"50%",left:"5%",width:"min(360px,28vw)",height:"min(360px,28vw)",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(129,140,248,0.05) 0%,transparent 68%)",pointerEvents:"none",zIndex:1}}/>

        {/* Floating shapes */}
        <div className="ct-shapes" aria-hidden="true" style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:2}}>
          <svg width="80" height="80" viewBox="0 0 120 120" style={{position:"absolute",top:"5%",right:"2%",animation:"ct_float1 8s ease-in-out infinite",filter:`drop-shadow(0 0 14px ${C.o1}55)`}}><defs><linearGradient id="ct_sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93BBFF"/><stop offset="100%" stopColor="#818CF8"/></linearGradient></defs><polygon points="60,5 110,32 110,88 60,115 10,88 10,32" fill="none" stroke="url(#ct_sh1)" strokeWidth="1.4" opacity="0.7"/></svg>
          <svg width="56" height="56" viewBox="0 0 90 90" style={{position:"absolute",bottom:"6%",left:"1.5%",animation:"ct_float1 11s ease-in-out infinite reverse",filter:`drop-shadow(0 0 10px ${C.accent}50)`}}><polygon points="45,4 86,45 45,86 4,45" fill={C.accent} fillOpacity="0.06" stroke={C.accent} strokeWidth="1.1" opacity="0.65"/></svg>
        </div>

        <div className="ct-inner">

          {/* Header */}
          <header style={{textAlign:"center",opacity:visible?1:0,animation:anim("ct_fadeDown","0.8s","0.05s")}}>
            <div style={{marginBottom:12}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:7,background:"rgba(79,142,247,0.10)",border:`1px solid rgba(79,142,247,0.32)`,color:C.o2,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",animation:"ct_badgePulse 3.2s ease-in-out infinite",boxShadow:"0 0 18px rgba(79,142,247,0.12)"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:C.o1,boxShadow:`0 0 9px ${C.o1}`,animation:"ct_pulse 2s ease-in-out infinite",display:"inline-block"}}/>
                Get In Touch
              </span>
            </div>

            {/* Rotating headline */}
            <div style={{minHeight:"clamp(2.2rem,5.5vw,4rem)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:14}}>
              <h2 style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:"clamp(1.4rem,4vw,3rem)",letterSpacing:"-0.03em",lineHeight:1.08,margin:0,background:`linear-gradient(135deg,${C.tw} 0%,${C.o1} 40%,${C.accent} 70%,${C.accentAlt} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:`drop-shadow(0 0 22px rgba(79,142,247,0.45))`,opacity:headingIn?1:0,transform:headingIn?"translateY(0)":"translateY(-14px)",transition:"opacity 0.35s ease, transform 0.35s ease",textAlign:"center"}}>
                {HEADINGS[headingIdx]}
              </h2>
            </div>

            <p style={{color:C.tm,fontSize:"clamp(13px,1.5vw,15.5px)",lineHeight:1.8,maxWidth:560,margin:"0 auto 18px",fontWeight:400}}>
              Whether it's a website, app, or product strategy — we're ready to collaborate and bring your ideas to life.
            </p>
            <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.o1}45,transparent)`,maxWidth:340,margin:"0 auto"}}/>
          </header>

          {/* Two columns */}
          <div className="ct-cols">

            {/* ── Form card ── */}
            <div className="ct-left" style={{opacity:visible?1:0,animation:anim("ct_fadeLeft","0.8s","0.2s")}}>
              <div style={{position:"relative",borderRadius:18,overflow:"hidden"}}>
                {/* Conic border */}
                <div aria-hidden="true" style={{position:"absolute",inset:-2,borderRadius:20,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
                  <div style={{position:"absolute",inset:-2,borderRadius:22,background:`conic-gradient(from 0deg,transparent 0%,rgba(79,142,247,0.38) 20%,rgba(56,189,248,0.65) 40%,rgba(79,142,247,0.38) 60%,transparent 80%)`,animation:"ct_borderRot 11s linear infinite"}}/>
                </div>
                <div className="ct-card" style={{zIndex:1,position:"relative"}}>
                  {/* Scan line */}
                  <div style={{position:"absolute",inset:0,zIndex:6,overflow:"hidden",pointerEvents:"none",borderRadius:18}}>
                    <div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,142,247,0.65),transparent)`,animation:"ct_scanDown 5.5s linear infinite",opacity:0.5}}/>
                  </div>
                  {/* Corner brackets */}
                  {[{top:10,left:10,borderTop:`2px solid ${C.o1}90`,borderLeft:`2px solid ${C.o1}90`},{top:10,right:10,borderTop:`2px solid ${C.accent}90`,borderRight:`2px solid ${C.accent}90`},{bottom:10,left:10,borderBottom:`2px solid ${C.accentAlt}90`,borderLeft:`2px solid ${C.accentAlt}90`},{bottom:10,right:10,borderBottom:`2px solid ${C.o1}90`,borderRight:`2px solid ${C.o1}90`}].map((s,i)=><div key={i} aria-hidden="true" style={{position:"absolute",width:18,height:18,zIndex:7,...s}}/>)}

                  <div className="ct-card-body">
                    {/* Card header */}
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:10,background:`rgba(79,142,247,0.15)`,border:`1px solid rgba(79,142,247,0.30)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✦</div>
                      <div>
                        <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(1.1rem,2vw,1.5rem)",letterSpacing:"-0.02em",margin:0,color:C.tw}}>Start a Project</h3>
                        <p style={{color:C.tf,fontSize:11,margin:0,fontFamily:"'DM Sans',sans-serif"}}>Free consultation — no obligations</p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                        <Field name="name"  value={formData.name}  onChange={handleChange} placeholder="Full Name *"      required/>
                        <Field name="email" value={formData.email} onChange={handleChange} placeholder="Email *"          required type="email"/>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                        <Field name="company" value={formData.company} onChange={handleChange} placeholder="Company / Brand"/>
                        <Field name="phone"   value={formData.phone}   onChange={handleChange} placeholder="Phone"           type="tel"/>
                      </div>
                      <div className="ct-date-time">
                        <Field name="date" value={formData.date} onChange={handleChange} placeholder="Preferred Date" required type="date"/>
                        <Field name="time" value={formData.time} onChange={handleChange} placeholder="Preferred Time" required type="time"/>
                      </div>
                      <Field as="textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Project description / message *" required rows={5}/>
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={formState.submitting}
                      onMouseEnter={()=>setHovSubmit(true)} onMouseLeave={()=>setHovSubmit(false)}
                      style={{
                        width:"100%", padding:"13px 24px", borderRadius:10, border:"none",
                        cursor:formState.submitting?"not-allowed":"pointer",
                        fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12.5px,1.3vw,14px)", fontWeight:800, letterSpacing:"0.06em",
                        color:"#fff",
                        background:formState.success
                          ? "linear-gradient(135deg,#22c55e,#16a34a)"
                          : `linear-gradient(135deg,${C.o1},${C.o4})`,
                        boxShadow:formState.success?"0 8px 28px rgba(34,197,94,0.45)":hovSubmit?"0 16px 48px rgba(79,142,247,0.60)":"0 6px 22px rgba(79,142,247,0.38)",
                        transform:hovSubmit&&!formState.submitting?"translateY(-2px) scale(1.015)":"none",
                        transition:"all 0.28s cubic-bezier(0.23,1,0.32,1)",
                        opacity:formState.submitting?0.7:1,
                        display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                        outline:"none", position:"relative", overflow:"hidden",
                      }}>
                      {hovSubmit&&!formState.submitting&&!formState.success&&<span style={{position:"absolute",top:0,left:0,bottom:0,width:"35%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)",animation:"ct_shimmer 0.65s ease forwards",pointerEvents:"none"}}/>}
                      {formState.submitting ? (
                        <><svg style={{animation:"ct_spinner 0.9s linear infinite",width:17,height:17,flexShrink:0}} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>Sending…</>
                      ) : formState.success ? "✓ Message Sent!" : (
                        <><span style={{display:"inline-block",animation:"ct_arrowPulse 2s ease-in-out infinite"}}>→</span>Book a Free Consultation</>
                      )}
                    </button>

                    {formState.success && <p style={{textAlign:"center",color:"#4ade80",fontSize:13,fontWeight:600,margin:0,animation:"ct_fadeUp 0.5s ease both"}}>Thank you! We'll get back to you within 24 hours. 🎉</p>}
                    {formState.error   && <p style={{textAlign:"center",color:"#f87171",fontSize:13,fontWeight:600,margin:0,animation:"ct_fadeUp 0.5s ease both"}}>{formState.error}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Info card ── */}
            <div className="ct-right" style={{opacity:visible?1:0,animation:anim("ct_fadeRight","0.8s","0.28s")}}>
              <div className="ct-card">
                <div className="ct-card-body">
                  {/* Header */}
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:`rgba(56,189,248,0.15)`,border:`1px solid rgba(56,189,248,0.30)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>◈</div>
                    <div>
                      <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"clamp(1.1rem,2vw,1.5rem)",letterSpacing:"-0.02em",margin:0,color:C.tw}}>Contact Details</h3>
                      <p style={{color:C.tf,fontSize:11,margin:0,fontFamily:"'DM Sans',sans-serif"}}>Reach us directly, anytime</p>
                    </div>
                  </div>

                  {/* Contact info rows */}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {CONTACT_INFO.map((item,i)=>{
                      const [hov,setHov]=useState(false);
                      const inner=(
                        <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:"flex",alignItems:"center",gap:13,padding:"12px 15px",borderRadius:12,background:hov?`rgba(79,142,247,0.07)`:C.bg2,border:hov?`1px solid ${item.color}40`:"1px solid rgba(255,255,255,0.06)",transition:"all 0.26s ease",cursor:item.href?"pointer":"default"}}>
                          <div style={{width:38,height:38,borderRadius:10,background:`${item.color}15`,border:`1px solid ${item.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:hov?`0 0 14px ${item.color}35`:"none",transition:"box-shadow 0.26s ease"}}>
                            {item.svg(item.color)}
                          </div>
                          <div style={{minWidth:0}}>
                            <div style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{item.label}</div>
                            <span style={{color:hov?C.tw:C.ts,fontSize:"clamp(12px,1.3vw,14px)",fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"color 0.2s ease",wordBreak:"break-all"}}>{item.value}</span>
                          </div>
                          {item.href&&<span style={{marginLeft:"auto",color:item.color,fontSize:10,opacity:hov?1:0,transition:"opacity 0.22s ease"}}>▶</span>}
                        </div>
                      );
                      return item.href
                        ? <a key={i} href={item.href} style={{textDecoration:"none"}}>{inner}</a>
                        : <div key={i}>{inner}</div>;
                    })}
                  </div>

                  <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.o1}22,transparent)`}}/>

                  {/* Social */}
                  <div>
                    <div style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Connect With Us</div>
                    <div className="ct-social-row">
                      {SOCIAL_LINKS.map((link,i)=>{
                        const [hov,setHov]=useState(false);
                        return(
                          <a key={i} href={link.href} target={link.href.startsWith("http")?"_blank":undefined} rel={link.href.startsWith("http")?"noopener noreferrer":undefined} aria-label={link.label}
                            onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                            style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:9,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,background:hov?`${link.color}18`:"rgba(255,255,255,0.05)",border:`1px solid ${hov?link.color+"55":"rgba(255,255,255,0.09)"}`,color:hov?link.color:C.tm,transform:hov?"translateY(-2px) scale(1.03)":"none",transition:"all 0.26s cubic-bezier(0.23,1,0.32,1)",boxShadow:hov?`0 6px 20px ${link.color}30`:"none"}}>
                            {link.svg(hov?link.color:C.tm)}{link.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.o1}22,transparent)`}}/>

                  {/* Process steps */}
                  <div>
                    <div style={{color:C.tf,fontSize:9,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>How It Works</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {PROCESS_STEPS.map((step,i)=>{
                        const [hov,setHov]=useState(false);
                        const col=STEP_COLORS[i];
                        return(
                          <div key={i} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
                            style={{display:"flex",gap:12,alignItems:"flex-start",padding:"11px 14px",borderRadius:12,background:hov?`${col}0a`:C.bg2,border:hov?`1px solid ${col}38`:"1px solid rgba(255,255,255,0.05)",transition:"all 0.26s ease",transform:hov?"translateX(4px)":"none"}}>
                            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:900,fontSize:10.5,letterSpacing:"0.08em",color:col,flexShrink:0,width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",background:`${col}15`,border:`1px solid ${col}38`,boxShadow:hov?`0 0 10px ${col}40`:"none",transition:"box-shadow 0.26s ease"}}>{step.num}</div>
                            <div>
                              <div style={{color:C.ts,fontSize:12.5,fontWeight:700,marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{step.title}</div>
                              <div style={{color:C.tm,fontSize:11,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{step.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Urgent callout */}
                  <div style={{padding:"15px 18px",borderRadius:12,background:`linear-gradient(135deg,rgba(79,142,247,0.10),rgba(56,189,248,0.06))`,border:`1px solid rgba(79,142,247,0.22)`,borderLeft:`3px solid ${C.o1}`,opacity:visible?1:0,animation:anim("ct_fadeUp","0.6s","0.85s")}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <span style={{fontSize:16,lineHeight:1,flexShrink:0}}>⚡</span>
                      <p style={{margin:0,color:C.ts,fontSize:"clamp(12.5px,1.3vw,14px)",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                        <span style={{fontWeight:900,fontFamily:"'Sora',sans-serif",color:C.o1}}>Need it urgent?</span>{" "}We can start within 48 hours. Let's talk today.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,rgba(8,10,15,0.85))`,zIndex:5,pointerEvents:"none"}}/>
        <div aria-hidden="true" style={{position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${C.o1}28,transparent)`,zIndex:6}}/>
      </section>
    </>
  );
};

export default Contact;