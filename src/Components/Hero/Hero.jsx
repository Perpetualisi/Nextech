import React from "react";
import "./Hero.css";

const stats = [
  { label: "Projects Completed", value: "150+" },
  { label: "Client Satisfaction", value: "99%" },
  { label: "Team Members", value: "25" },
  { label: "24/7 Support", value: "Yes" }
];

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span>IsiTech Innovations</span>
        </h1>
        <p className="hero-subtitle">
          Crafting innovative digital experiences with creativity, precision, and bold design. 
          We transform ideas into smart, futuristic solutions that elevate brands, delight users, 
          and drive growth in the digital world.
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons">
          <a href="#contact" className="hero-btn">
            Get Started
          </a>
          <a href="#projects" className="hero-btn secondary-btn">
            View Our Work
          </a>
        </div>

        {/* Statistics */}
        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
