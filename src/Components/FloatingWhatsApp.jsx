import { useState } from "react";

/* ─── Floating WhatsApp Button ───────────────────────────────────────── */
const FloatingWhatsApp = ({
  phone   = "2348103558837",
  message = "Hi! I'd like to start a project with IsiTech Innovations.",
}) => {
  const [hov,  setHov]  = useState(false);
  const [pulse, setPulse] = useState(true);

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <style>{`
        @keyframes wa_ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        @keyframes wa_bounce {
          0%,100% { transform: translateY(0);   }
          40%     { transform: translateY(-8px); }
          60%     { transform: translateY(-4px); }
        }
        @keyframes wa_fadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Tooltip */}
      {hov && (
        <div style={{
          position:"fixed", bottom:22, right:80, zIndex:1001,
          background:"rgba(8,10,15,0.95)", backdropFilter:"blur(16px)",
          border:"1px solid rgba(37,211,102,0.28)",
          borderRadius:10, padding:"8px 14px",
          color:"#F8FAFF", fontSize:12, fontWeight:600,
          fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
          boxShadow:"0 4px 24px rgba(0,0,0,0.5)",
          animation:"wa_fadeIn 0.2s ease both",
          pointerEvents:"none",
        }}>
          Chat on WhatsApp
          {/* Arrow */}
          <span style={{position:"absolute",top:"50%",right:-5,transform:"translateY(-50%)",width:0,height:0,borderTop:"5px solid transparent",borderBottom:"5px solid transparent",borderLeft:"5px solid rgba(8,10,15,0.95)"}}/>
        </div>
      )}

      {/* Ping ring */}
      {pulse && !hov && (
        <div style={{
          position:"fixed", bottom:20, right:20, zIndex:1000,
          width:55, height:55, borderRadius:"50%",
          background:"rgba(37,211,102,0.45)",
          animation:"wa_ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
          pointerEvents:"none",
        }}/>
      )}

      {/* Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with IsiTech on WhatsApp"
        onMouseEnter={()=>{ setHov(true);  setPulse(false); }}
        onMouseLeave={()=>{ setHov(false); setPulse(true);  }}
        style={{
          position:"fixed", bottom:20, right:20, zIndex:1001,
          width:55, height:55, borderRadius:"50%",
          background: hov
            ? "linear-gradient(135deg,#1ebe5d,#25D366)"
            : "linear-gradient(135deg,#25D366,#1da851)",
          display:"flex", alignItems:"center", justifyContent:"center",
          textDecoration:"none",
          boxShadow: hov
            ? "0 8px 28px rgba(37,211,102,0.55), 0 0 0 2px rgba(37,211,102,0.25)"
            : "0 4px 18px rgba(37,211,102,0.38), 0 2px 8px rgba(0,0,0,0.30)",
          transform: hov ? "scale(1.12) translateY(-2px)" : "scale(1)",
          animation: !hov ? "wa_bounce 3.5s ease-in-out infinite 2s" : "none",
          transition:"transform 0.28s cubic-bezier(0.23,1,0.32,1), box-shadow 0.28s ease, background 0.22s ease",
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
};

export default FloatingWhatsApp;