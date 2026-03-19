import { useEffect, useState } from "react";
import Navbar   from "./Components/Navbar/Navbar";
import Hero     from "./Components/Hero/Hero";
import About    from "./Components/About/About";
import Services from "./Components/Services/Services";
import Projects from "./Components/Projects/Projects";
import Blog     from "./Components/Blog/Blog";
import Contact  from "./Components/Contact/Contact";
import Footer   from "./Components/Footer/Footer";
import FloatingWhatsApp from "./Components/FloatingWhatsApp";
import "./index.css";
import "./App.css";

/* ─── Page Loader ────────────────────────────────────────────────────── */
const Loader = ({ done }) => (
  <div style={{
    position:"fixed",inset:0,zIndex:9999,
    background:"#080A0F",
    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,
    transition:"opacity 0.45s ease,visibility 0.45s ease",
    opacity:done?0:1, visibility:done?"hidden":"visible",
    pointerEvents:done?"none":"all",
  }}>
    {/* Logo mark */}
    <div style={{
      width:52,height:52,borderRadius:14,
      background:"linear-gradient(135deg,#4F8EF7,#38BDF8)",
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:"#fff",
      boxShadow:"0 0 32px rgba(79,142,247,0.55)",
      animation:"app_pulse 1.1s ease-in-out infinite",
    }}>I</div>

    {/* Slim progress bar */}
    <div style={{width:140,height:2,borderRadius:2,background:"rgba(79,142,247,0.15)",overflow:"hidden"}}>
      <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#4F8EF7,#38BDF8,#818CF8)",animation:"app_progress 1.2s ease-in-out infinite"}}/>
    </div>

    <p style={{color:"rgba(120,144,184,0.55)",fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.24em",textTransform:"uppercase",margin:0}}>IsiTech Innovations</p>
  </div>
);

/* ─── Scroll-to-top FAB ──────────────────────────────────────────────── */
const ScrollTopFAB = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
      aria-label="Back to top"
      style={{
        position:"fixed",bottom:82,right:22,zIndex:900,
        width:42,height:42,borderRadius:"50%",
        border:"1px solid rgba(79,142,247,0.35)",
        background:"rgba(8,10,15,0.90)",
        backdropFilter:"blur(16px)",
        color:"#4F8EF7",fontSize:17,fontWeight:700,
        display:"flex",alignItems:"center",justifyContent:"center",
        cursor:"pointer",
        boxShadow:"0 4px 22px rgba(79,142,247,0.28)",
        transition:"all 0.26s ease",
        animation:"app_fabIn 0.28s ease both",
        fontFamily:"sans-serif",
      }}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(79,142,247,0.20)";e.currentTarget.style.transform="translateY(-3px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="rgba(8,10,15,0.90)";e.currentTarget.style.transform="translateY(0)";}}
    >↑</button>
  );
};

/* ─── App ────────────────────────────────────────────────────────────── */
const App = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Resolve as soon as the DOM is interactive — don't wait for all resources
    const done = () => setLoaded(true);

    if (document.readyState !== "loading") {
      // DOM already ready — show content after a single rAF so paint happens first
      requestAnimationFrame(() => setTimeout(done, 300));
    } else {
      document.addEventListener("DOMContentLoaded", () => setTimeout(done, 300), { once:true });
      // Hard cap — never block more than 1.4s
      setTimeout(done, 1400);
    }
  }, []);

  return (
    <>
      <style>{`
        /* ── Fonts — preconnect declared in index.html for fastest load ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');

        /* ── Global resets ── */
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;background:#080A0F;}

        /* ── Loader animations ── */
        @keyframes app_pulse   {0%,100%{transform:scale(1);box-shadow:0 0 32px rgba(79,142,247,0.55)}50%{transform:scale(1.06);box-shadow:0 0 52px rgba(79,142,247,0.75)}}
        @keyframes app_progress{0%{transform:translateX(-100%)}55%{transform:translateX(0%)}100%{transform:translateX(100%)}}
        @keyframes app_fabIn   {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        /* ── App wrapper ── */
        #app-root{
          display:flex;flex-direction:column;
          min-height:100dvh;width:100%;overflow-x:hidden;
          background:#080A0F;
        }

        /* ── Text selection ── */
        ::selection{background:rgba(79,142,247,0.30);color:#F8FAFF;}

        /* ── Scrollbar ── */
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:#080A0F;}
        ::-webkit-scrollbar-thumb{background:rgba(79,142,247,0.35);border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(79,142,247,0.55);}
      `}</style>

      <Loader done={loaded}/>
      <Navbar/>

      <main id="app-root" role="main">
        <Hero/>
        <About/>
        <Services/>
        <Projects/>
        <Blog/>
        <Contact/>
        <Footer/>
      </main>

      <ScrollTopFAB/>
      <FloatingWhatsApp/>
    </>
  );
};

export default App;