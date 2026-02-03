import React, { useCallback, useMemo } from "react";

const STATS = [
  { id: "projects", label: "Projects Done", value: "500+" },
  { id: "clients", label: "Happy Clients", value: "99.8%" },
  { id: "team", label: "Skilled Team", value: "45+" },
  { id: "support", label: "Support 24/7", value: "24/7" },
];

const CTA_BUTTONS = [
  { id: "get-started", label: "Get Started", href: "#contact", primary: true },
  { id: "view-work", label: "See Our Work", href: "#projects", primary: false },
];

const StatisticCard = ({ stat }) => (
  <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <h3 className="text-indigo-600 font-black text-[clamp(1.25rem,5vw,2.25rem)] mb-1 leading-none">
      {stat.value}
    </h3>
    <p className="text-gray-500 font-medium text-xs sm:text-sm uppercase tracking-wider text-center">
      {stat.label}
    </p>
  </div>
);

const CTAButton = ({ button, onClick }) => {
  const classes = useMemo(() => {
    const base = "relative overflow-hidden rounded-full px-8 py-4 text-base font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 w-full sm:w-auto flex items-center justify-center";
    const primary = "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-2xl active:scale-95";
    const secondary = "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95";
    return `${base} ${button.primary ? primary : secondary}`;
  }, [button.primary]);

  return (
    <button onClick={() => onClick(button.href)} className={classes}>
      {button.label}
    </button>
  );
};

const Hero = () => {
  const handleNavigation = useCallback((href) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    const navbar = document.querySelector("header");
    const offset = navbar?.offsetHeight || 80;
    
    if (el) {
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-white px-4 sm:px-6 lg:px-12"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-50/60 blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-50/60 blur-[100px]" />
      </div>

      {/* - Changed pt-12 to pt-20: Balances the space between the top of the viewport and content.
          - Added md:pt-28: Increases the gap on larger screens to prevent crowding the Navbar.
      */}
      <div className="w-full max-w-7xl mx-auto pt-20 pb-16 md:pt-28 md:pb-24 text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <span className="inline-block py-1.5 px-4 mb-8 rounded-full bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-sm">
          Innovating the Future
        </span>

        {/* - text-nowrap: strictly prevents the line break.
           - clamp logic: start at 4.2vw to ensure it scales precisely with the screen width.
        */}
        <h1 className="mb-6 w-full max-w-full text-gray-900 font-black leading-tight tracking-tight text-center">
          <span className="text-[clamp(14px,4.2vw,4.5rem)] text-nowrap inline-block">
            Welcome to <span className="text-indigo-600">IsiTech</span> Innovations
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
          We build simple, modern digital solutions to help your business grow
          and succeed online.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full max-w-md mx-auto sm:max-w-none">
          {CTA_BUTTONS.map((btn) => (
            <CTAButton key={btn.id} button={btn} onClick={handleNavigation} />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
          {STATS.map((stat) => (
            <StatisticCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;