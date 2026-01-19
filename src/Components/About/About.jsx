import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ABOUT_CONTENT = {
  title: "About IsiTech Innovations",
  description: [
    "At IsiTech Innovations, we architect transformative digital ecosystems that captivate audiences, drive conversions, and propel brands forward.",
    "With extensive expertise across industries, we've partnered with visionary startups and Fortune 500 enterprises to unlock unprecedented digital growth through strategic design, intelligent technology, and measurable results.",
    "Our philosophy centers on human-first collaboration, boundless creativity, and leveraging emerging technologies to solve complex business challenges.",
    "We believe every brand possesses a unique narrative waiting to be amplified—we transform that story into compelling digital experiences that resonate and endure."
  ],
  cta: { label: "Discover Our Services", href: "#services" }
};

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    const section = document.querySelector(ABOUT_CONTENT.cta.href);
    const navbar = document.querySelector("header");
    const navbarHeight = navbar?.offsetHeight || 70;
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 px-6 md:py-20 md:px-10 bg-gradient-to-br from-gray-100 to-white"
      aria-label="About IsiTech Innovations"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div
          className="flex-1 w-full md:w-1/2 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          data-aos="fade-right"
        >
          <img
            src="/About.jpg"
            alt="Team working on innovative projects"
            className="w-full h-auto object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>

        <div className="flex-1 w-full md:w-1/2 space-y-5 md:space-y-6" data-aos="fade-left">
          <h2 className="text-black text-[clamp(1.5rem,5vw,2.5rem)] font-bold leading-tight inline-block overflow-hidden whitespace-nowrap border-r-4 border-indigo-600 pr-1 animate-[typing_6s_steps(40)_infinite,blink_0.75s_step-end_infinite]">
            {ABOUT_CONTENT.title}
          </h2>

          {ABOUT_CONTENT.description.map((p, idx) => (
            <p key={idx} className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
              {p}
            </p>
          ))}

          <button
            onClick={handleCTAClick}
            className="bg-indigo-600 text-white border-2 border-indigo-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg w-full md:w-auto text-base md:text-lg"
          >
            {ABOUT_CONTENT.cta.label}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes typing { 0%{width:0;}50%{width:100%;}100%{width:0;} }
          @keyframes blink { 0%,49%,100%{border-right-color:#5b5bf7;}50%,99%{border-right-color:transparent;} }
          .animate-[typing_6s_steps(40)_infinite] { animation: typing 6s steps(40,end) infinite, blink 0.75s step-end infinite; }
        `}
      </style>
    </section>
  );
};

export default About;
