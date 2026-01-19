import { useEffect, useState, useCallback, useRef } from "react";
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

const CONTACT_METHODS = [
  {
    href: "https://wa.me/2348103558837",
    icon: FaWhatsapp,
    label: "Chat on WhatsApp",
    color: "bg-green-500 hover:bg-green-600",
    external: true,
  },
  {
    href: "tel:+2348103558837",
    icon: FaPhone,
    label: "Call us",
    color: "bg-blue-500 hover:bg-blue-600",
    external: false,
  },
  {
    href: "mailto:perpetualokan0@gmail.com",
    icon: FaEnvelope,
    label: "Send email",
    color: "bg-red-500 hover:bg-red-600",
    external: false,
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
  }, [menuOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleScrollTo = useCallback((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo */}
          <button
            onClick={() => handleScrollTo("home")}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/isitech-logo.png"
              alt="IsiTech Innovations"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className="relative text-gray-700 hover:text-indigo-600 font-medium text-base lg:text-lg transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => handleScrollTo("contact")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-base lg:text-lg font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              GET STARTED
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-50"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <nav
          ref={menuRef}
          className={`md:hidden bg-white border-t border-gray-200 shadow-xl transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 space-y-2 max-h-screen overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className="w-full text-left text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-base"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleScrollTo("contact")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-base font-semibold shadow-md mt-4"
            >
              GET STARTED
            </button>
          </div>
        </nav>
      </header>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        <div
          className={`flex flex-col-reverse items-end gap-3 transition-all duration-300 ${
            contactOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {CONTACT_METHODS.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                className={`${method.color} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2`}
                style={{ transitionDelay: `${index * 50}ms` }}
                aria-label={method.label}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <button
          onClick={() => setContactOpen(!contactOpen)}
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
            contactOpen ? "rotate-45" : "rotate-0"
          }`}
          aria-label={contactOpen ? "Close contact options" : "Open contact options"}
          aria-expanded={contactOpen}
        >
          <FaTimes
            className={`transition-transform duration-300 ${
              contactOpen ? "rotate-0" : "rotate-45"
            }`}
            size={20}
          />
        </button>
      </div>
    </>
  );
};

export default Navbar;
