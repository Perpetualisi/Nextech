import { useEffect, useState } from "react";
import "./Hero.css";

const titles = [
  "NexTech Innovations",
  "InnovaLab Systems",
  "FutureSoft Solutions"
];

const phrases = [
  "Future-Ready Solutions",
  "Smart Digital Experiences",
  "Creative Tech Ideas"
];

const subtitles = [
  "Crafting digital experiences with creativity & precision.",
  "Delivering intuitive and bold tech for tomorrow.",
  "Empowering brands with futuristic design."
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title animate-slide">
            Welcome to <span>{titles[index]}</span>
          </h1>
          <h2 className="typing-text animate-fade">{phrases[index]}</h2>
          <p className="hero-subtitle animate-zoom">{subtitles[index]}</p>
          <a href="#contact" className="hero-btn">
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
