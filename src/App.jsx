import { useEffect, useState } from "react";
import Navbar  from "./Components/Navbar/Navbar";
import Hero    from "./Components/Hero/Hero";
import About   from "./Components/About/About";
import Services from "./Components/Services/Services";
import Projects from "./Components/Projects/Projects";
import Blog    from "./Components/Blog/Blog";
import Contact from "./Components/Contact/Contact";
import Footer  from "./Components/Footer/Footer";
import "./index.css";
import "./App.css";

/* ── Minimal page-loader shown while fonts / assets load ── */
const Loader = ({ done }) => (
  <div style={{
    position:"fixed", inset:0, zIndex:9999,
    background:"#050714",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:24,
    transition:"opacity 0.6s ease, visibility 0.6s ease",
    opacity: done ? 0 : 1,
    visibility: done ? "hidden" : "visible",
    pointerEvents: done ? "none" : "all",
  }}>
    {/* Spinning logo */}
    <div style={{
      width:60, height:60, borderRadius:16,
      background:"linear-gradient(135deg,#6366f1,#a855f7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:28, fontWeight:900, color:"#fff",
      fontFamily:"'Syne',sans-serif",
      boxShadow:"0 0 40px rgba(99,102,241,0.55)",
      animation:"app_spin 1.2s linear infinite",
    }}>I</div>

    {/* Progress bar */}
    <div style={{
      width:160, height:3, borderRadius:3,
      background:"rgba(129,140,248,0.15)",
      overflow:"hidden",
    }}>
      <div style={{
        height:"100%", borderRadius:3,
        background:"linear-gradient(90deg,#6366f1,#c084fc,#f472b6)",
        animation:"app_progress 1.4s ease-in-out infinite",
      }}/>
    </div>

    <p style={{
      color:"rgba(165,180,252,0.45)",
      fontFamily:"'DM Sans',sans-serif",
      fontSize:11, fontWeight:700,
      letterSpacing:"0.22em", textTransform:"uppercase",
    }}>IsiTech Innovations</p>
  </div>
);

/* ── Scroll-to-top FAB (appears after 400px scroll) ── */
const ScrollTopFAB = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
      aria-label="Scroll to top"
      style={{
        position:"fixed", bottom:28, right:24, zIndex:900,
        width:44, height:44, borderRadius:"50%",
        border:"1px solid rgba(129,140,248,0.35)",
        background:"rgba(5,7,20,0.88)",
        backdropFilter:"blur(16px)",
        color:"#818cf8", fontSize:18, fontWeight:700,
        display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer",
        boxShadow:"0 4px 24px rgba(99,102,241,0.35)",
        transition:"all 0.3s ease",
        animation:"app_fabIn 0.3s ease both",
      }}
      onMouseEnter={e => { e.currentTarget.style.background="rgba(99,102,241,0.25)"; e.currentTarget.style.transform="translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background="rgba(5,7,20,0.88)"; e.currentTarget.style.transform="translateY(0)"; }}
    >↑</button>
  );
};

const App = () => {
  const [loaded, setLoaded] = useState(false);

  /* Simulate asset readiness — resolves on window load or 1.8s max */
  useEffect(() => {
    const done = () => setLoaded(true);
    if (document.readyState === "complete") {
      setTimeout(done, 600);
    } else {
      window.addEventListener("load", () => setTimeout(done, 400), { once:true });
      setTimeout(done, 1800); // hard cap
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap');

        @keyframes app_spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes app_progress { 0%{transform:translateX(-100%)} 60%{transform:translateX(0%)} 100%{transform:translateX(100%)} }
        @keyframes app_fabIn    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes app_sectionIn{ from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }

        /* ── Root wrapper ── */
        #app-root {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          width: 100%;
          overflow-x: hidden;
          background: #050714;
        }

        /* ── Section entrance via IntersectionObserver class ── */
        .section-visible {
          animation: app_sectionIn 0.75s cubic-bezier(0.23,1,0.32,1) both;
        }

        /* ── Smooth inter-section gradient transitions ── */
        #app-root > section,
        #app-root > footer {
          position: relative;
        }

        /* ── Selection colour ── */
        ::selection {
          background: rgba(99,102,241,0.35);
          color: #e0e7ff;
        }
      `}</style>

      {/* Page loader */}
      <Loader done={loaded}/>

      {/* Fixed navbar */}
      <Navbar/>

      {/* Main content */}
      <main id="app-root" role="main">
        <Hero/>
        <About/>
        <Services/>
        <Projects/>
        <Blog/>
        <Contact/>
        <Footer/>
      </main>

      {/* Scroll-to-top FAB */}
      <ScrollTopFAB/>
    </>
  );
};

export default App;