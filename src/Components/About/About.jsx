import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./About.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-image" data-aos="fade-right">
          <img src="/About.jpg" alt="NexTech Team" />
        </div>
        <div className="about-content" data-aos="fade-left">
          <h2 className="typing-text-loop">About IsiTech Innovations</h2>

          <p>
            At IsiTech Innovations, we don't just build websites — we craft digital experiences
            that captivate, convert, and grow brands.
          </p>
          <p>
            With years of experience and a passion for innovation, we’ve helped startups and
            enterprises unlock new levels of digital success through performance, design, and
            strategy.
          </p>
          <p>
            Our approach is centered on collaboration, creativity, and cutting-edge technologies.
          </p>
          <p>
            We believe every brand has a story, and we’re here to help you tell it through design and code.
          </p>

          <a href="#services" className="about-btn">Explore Our Services</a>
        </div>
      </div>
    </section>
  );
};

export default About;
