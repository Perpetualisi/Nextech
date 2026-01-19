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
  <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-lg transition-all duration-300">
    <h3 className="text-indigo-600 font-extrabold text-[clamp(1.5rem,4vw,2rem)] mb-2">
      {stat.value}
    </h3>
    <p className="text-gray-700 text-sm sm:text-base text-center">{stat.label}</p>
  </div>
);

const CTAButton = ({ button, onClick }) => {
  const classes = useMemo(() => {
    const base =
      "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 w-full sm:w-auto";
    const primary =
      "bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg";
    const secondary =
      "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 hover:shadow-lg";
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
    const el = document.querySelector(href);
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.offsetHeight || 70; // default 70px if not found
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 8; // 8px extra spacing
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <section
      id="home"
      className="flex flex-col items-center justify-start min-h-[calc(100vh-70px)] w-full bg-white px-4 pt-32 sm:pt-28 md:pt-32 lg:pt-36 pb-12 text-black sm:px-6 md:px-8 lg:px-12"
    >
      <div className="w-full max-w-5xl text-center">
        {/* Heading */}
        <h1 className="mb-4 text-black text-[clamp(1.5rem,6vw,3rem)] font-bold leading-tight">
          Welcome to IsiTech Innovations
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
          We build simple, modern digital solutions to help your business grow
          and succeed online.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 w-full sm:w-auto">
          {CTA_BUTTONS.map((btn) => (
            <CTAButton key={btn.id} button={btn} onClick={handleNavigation} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 md:gap-8">
          {STATS.map((stat) => (
            <StatisticCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
