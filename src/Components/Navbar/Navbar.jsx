import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["HOME", "ABOUT", "SERVICES", "PROJECTS", "BLOG", "CONTACT"];

  const handleScrollTo = (id) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`} data-aos="fade-down">
      <div className="navbar-container">
<div className="logo">
  NexTech <span className="desktop-only">Innovations</span>
</div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <button key={link} onClick={() => handleScrollTo(link)}>
              {link}
            </button>
          ))}
          <a href="#contact" className="cta-btn" onClick={() => setMenuOpen(false)}>
            GET STARTED
          </a>
        </nav>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
