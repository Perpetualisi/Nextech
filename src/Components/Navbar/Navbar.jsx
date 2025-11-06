import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Navbar.css";
import { FaWhatsapp, FaPhone, FaEnvelope, FaCommentDots } from "react-icons/fa";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`} data-aos="fade-down">
        <div className="navbar-container">
          <div className="logo">
            IsiTech <span className="desktop-only">Innovations</span>
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

      <div className="floating-message-wrapper">
        <div className="message-icon" onClick={() => setContactOpen(!contactOpen)}>
          <FaCommentDots />
        </div>

        {contactOpen && (
          <div className="message-options">
            <a
              href="https://wa.me/2348103558837"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a href="tel:+2348103558837" title="Call phone">
              <FaPhone />
            </a>
            <a href="mailto:perpetualokan0@gmail.com" title="Send email">
              <FaEnvelope />
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
