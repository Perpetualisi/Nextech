import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  const messages = [
    "Empowering your digital future.",
    "Innovating with purpose.",
    "Design. Develop. Deliver.",
    "Your success, our mission."
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const links = ["home", "about", "services", "projects", "blog", "contact"];

  return (
    <motion.footer
      className="bg-gray-900 text-gray-100 py-16 px-6 md:px-12 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-16">
        {/* Brand + Tagline */}
        <motion.div
          className="flex flex-col items-start md:items-start space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            IsiTech Innovations
          </h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={messages[currentMsgIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="italic text-gray-400"
            >
              {messages[currentMsgIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="flex flex-col space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="flex flex-col gap-1">
            {links.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <a
                  href={`#${item}`}
                  className="text-gray-400 hover:text-green-400 relative transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-green-400 after:via-cyan-400 after:to-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="flex flex-col space-y-1 md:text-left text-gray-400"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
          <p className="hover:text-green-400 transition-colors duration-300">Email: Isitech1111@gmail.com</p>
          <p className="hover:text-green-400 transition-colors duration-300">Phone: +234 810 355 8837</p>
          <p className="hover:text-green-400 transition-colors duration-300">Location: Nigeria</p>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        &copy; {year} IsiTech Innovations. All Rights Reserved.
      </motion.div>

      {/* Tailwind Animations for Gradient + Tagline */}
      <style>
        {`
          @keyframes gradientX {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradientX 6s ease infinite;
          }
        `}
      </style>
    </motion.footer>
  );
};

export default Footer;
