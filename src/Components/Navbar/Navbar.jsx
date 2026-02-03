import { useEffect, useState, useCallback } from "react";
import { FaWhatsapp, FaPhone, FaEnvelope, FaTimes } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

const NAV_LINKS = [
  { label: "HOME", id: "home" },
  { label: "ABOUT", id: "about" },
  { label: "SERVICES", id: "services" },
  { label: "PROJECTS", id: "projects" },
  { label: "BLOG", id: "blog" },
  { label: "CONTACT", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll and close menu
  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* 1. Backdrop - Highest Z-index to cover content but stay under the button */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[80] ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <header
        className={`fixed w-full top-0 transition-all duration-300 z-[90] ${
          scrolled || menuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5">
          {/* Logo */}
          <button onClick={() => handleScrollTo("home")} className="z-[100]">
            <img
              src="/isitech-logo.png"
              alt="Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* 2. Hamburger Button - Locked to z-[100] so it's always on top */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-full transition-all duration-300 z-[100] ${
              menuOpen 
                ? "bg-indigo-600 text-white rotate-180" 
                : "bg-white/90 text-gray-900 shadow-md"
            }`}
          >
            {menuOpen ? <FaTimes size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* 3. Sliding Menu */}
        <nav
          className={`fixed top-0 right-0 h-screen w-[75%] max-w-[300px] bg-white z-[85] shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col pt-24 px-8 space-y-6">
            {NAV_LINKS.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`text-left text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 transition-all duration-300 ${
                  menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleScrollTo("contact")}
              className="bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg mt-4"
            >
              GET STARTED
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;